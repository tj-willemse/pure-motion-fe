import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayment } from "@/lib/yoco";
import { formatRand } from "@/lib/order-of-merit";
import { PaymentButton } from "./payment-button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Registration payment", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function PaymentPage({ params, searchParams }: {
  params: Promise<{ token: string }>; searchParams: Promise<{ result?: string }>;
}) {
  const { token } = await params;
  const { result } = await searchParams;
  const record = await getPayment(token);
  if (!record) notFound();
  const { registration, payment, expired } = record;
  const paid = payment?.status === "paid";
  const test = payment?.processing_mode === "test" || (!payment?.processing_mode && process.env.YOCO_MODE !== "live");
  return <main className="section"><div className="site-shell">
    <h1>{paid ? (test ? "Test payment received." : "Payment received.") : "Complete your registration payment."}</h1>
    {test && <p><strong>Test mode — use only Yoco test card details. No real entry is confirmed by a test payment.</strong></p>}
    <p>Reference: {registration.reference}</p>
    <p>Amount: {formatRand(registration.total_cents)}</p>
    {paid ? <p>{registration.status === "confirmed" ? "Your registration and selected rounds are confirmed." : test ? "The test transaction was verified. This is not a live registration confirmation." : "Your payment was received, but your registration needs staff review. Please contact the academy with your reference."}</p> : <>
      {result === "success" && <p role="status">Waiting for Yoco’s verified payment notification. Refresh this page shortly. A redirect alone does not confirm payment.</p>}
      {result === "cancelled" && <p>Checkout was cancelled. Your registration is still saved.</p>}
      {result === "failed" && <p>Payment did not complete. You can return to checkout while your reservation is valid.</p>}
      {expired || registration.status !== "awaiting_payment" ? <p>This reservation has expired or is no longer awaiting payment. Contact the academy before paying.</p> : <>
        <p>Complete payment before {new Date(registration.payment_deadline).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })} (South African time).</p>
        {result !== "success" && <PaymentButton token={token} />}
      </>}
    </>}
    <p><Link href={`/payments/oom/${token}`}>Refresh payment status</Link></p>
    <p><Link href="/juniors/order-of-merit">Back to Order of Merit</Link></p>
  </div></main>;
}
