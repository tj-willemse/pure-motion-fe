import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { signPaymentLink, verifyPaymentLink } from "@/lib/yoco-security";

export function paymentPath(id: string) {
  const secret = process.env.PAYMENT_LINK_SECRET;
  if (!secret || secret.length < 32) return null;
  return `/payments/oom/${signPaymentLink(id, secret)}`;
}

export async function getPayment(token: string) {
  const secret = process.env.PAYMENT_LINK_SECRET;
  const id = secret && verifyPaymentLink(token, secret);
  const admin = createAdminClient();
  if (!id || !admin) return null;
  const { data, error } = await admin.from("oom_registrations")
    .select("id,reference,total_cents,status,payment_deadline").eq("id", id).single();
  if (error || !data) return null;
  const payments = await admin.from("oom_payments")
    .select("id,status,provider,provider_checkout_id,checkout_url,processing_mode,amount_cents")
    .eq("registration_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (payments.error) return null;
  return { registration: data, payment: payments.data, expired: Date.parse(data.payment_deadline) <= Date.now() };
}

export async function createYocoCheckout(token: string) {
  const key = process.env.YOCO_SECRET_KEY;
  const mode = process.env.YOCO_MODE || "test";
  if (!["test", "live"].includes(mode) || !key?.startsWith(`sk_${mode}_`) || !process.env.YOCO_WEBHOOK_SECRET) {
    throw new Error("Online payment is not configured yet. Your registration is saved; please try again once checkout is available.");
  }
  const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  if (mode === "live" && origin.protocol !== "https:") throw new Error("Live payments require HTTPS.");
  const record = await getPayment(token);
  const admin = createAdminClient();
  if (!record || !admin || !record.payment) throw new Error("Payment record is unavailable.");
  const { registration, payment } = record;
  if (registration.status !== "awaiting_payment" || Date.parse(registration.payment_deadline) <= Date.now()) {
    throw new Error("This registration is no longer awaiting payment or its reservation has expired.");
  }
  if (payment.status === "paid" || payment.status === "waived") throw new Error("This payment has already been completed.");
  if (payment.processing_mode && payment.processing_mode !== mode) throw new Error("This registration belongs to a different payment environment.");
  if (payment.checkout_url && payment.provider === "yoco") return payment.checkout_url;
  if (!Number.isSafeInteger(registration.total_cents) || registration.total_cents <= 0 || payment.amount_cents !== registration.total_cents) {
    throw new Error("The payment amount requires review.");
  }
  const path = paymentPath(registration.id);
  const returnUrl = new URL(path!, origin).toString();
  const response = await fetch("https://payments.yoco.com/api/checkouts", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `oom-${mode}-${payment.id}` },
    body: JSON.stringify({
      amount: registration.total_cents, currency: "ZAR",
      successUrl: `${returnUrl}?result=success`, cancelUrl: `${returnUrl}?result=cancelled`, failureUrl: `${returnUrl}?result=failed`,
      metadata: { registrationId: registration.id, reference: registration.reference },
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Yoco checkout is temporarily unavailable. Please retry from this page; do not submit another registration.");
  const checkout = await response.json();
  const url = new URL(checkout.redirectUrl);
  if (url.protocol !== "https:" || !(url.hostname === "yoco.com" || url.hostname.endsWith(".yoco.com")) ||
    typeof checkout.id !== "string" || checkout.amount !== registration.total_cents || checkout.currency !== "ZAR" || checkout.processingMode !== mode) {
    throw new Error("Yoco returned an unexpected checkout. No redirect was made.");
  }
  const { error } = await admin.from("oom_payments").update({
    provider: "yoco", provider_checkout_id: checkout.id, checkout_url: url.toString(), processing_mode: mode,
  }).eq("id", payment.id);
  if (error) throw new Error("Could not link checkout to your registration. Retry from this page.");
  return url.toString();
}
