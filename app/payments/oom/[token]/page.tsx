import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayment } from "@/lib/yoco";
import { formatRand } from "@/lib/order-of-merit";
import { PaymentButton } from "./payment-button";
import { PaymentStatusRefresh } from "./payment-status-refresh";
import { ArrowRight, Check, CheckCircle2, Clock3, Info, ShieldCheck, Trophy } from "lucide-react";
import styles from "./payment.module.css";

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
  const verifying = !paid && result === "success";
  const canPay = !paid && !verifying && !expired && registration.status === "awaiting_payment";
  const confirmed = paid && !test && registration.status === "confirmed";
  const title = paid ? (test ? "Payment successful." : confirmed ? "You’re all set." : "Payment received.") : verifying ? "Confirming your payment." : expired || registration.status !== "awaiting_payment" ? "Let’s check your registration." : result === "cancelled" ? "Checkout paused." : result === "failed" ? "Payment not completed." : "One step from the first tee.";
  const description = confirmed ? "Your Order of Merit registration and selected rounds are confirmed. We look forward to seeing you on the course." : paid && test ? "Your checkout is complete. You can find your entry and payment details in your dashboard." : paid ? "Your payment is recorded. The academy needs to review your registration before confirming your place." : verifying ? "We’re waiting for payment confirmation from Yoco. Please keep this page open and don’t pay again." : canPay ? "Your registration is saved. Complete secure checkout to confirm your place." : "Your payment window has closed or this entry is no longer awaiting payment. Please contact the academy before paying.";
  const StatusIcon = paid ? CheckCircle2 : verifying ? Clock3 : Info;
  return <main className={styles.page}>
    <div className={styles.shell}>
      <div className={styles.eyebrow}><Trophy size={17} aria-hidden="true" /> JUNIOR ORDER OF MERIT</div>
      <section className={styles.card} aria-labelledby="payment-heading">
        <div className={styles.hero}>
          <div className={styles.icon}><StatusIcon size={42} strokeWidth={1.6} aria-hidden="true" /></div>
          <p className={styles.status}>{confirmed ? "REGISTRATION CONFIRMED" : "REGISTRATION PAYMENT"}</p>
          <h1 id="payment-heading">{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
        <dl className={styles.summary}>
          <div><dt>Registration reference</dt><dd>{registration.reference}</dd></div>
          <div><dt>{paid && !test ? "Amount paid" : "Amount"}</dt><dd>{formatRand(paid ? payment.amount_cents : registration.total_cents)}</dd></div>
          <div><dt>Payment status</dt><dd className={styles.paymentState}>{paid ? <Check size={17} aria-hidden="true" /> : <Clock3 size={17} aria-hidden="true" />}{paid ? test ? "Completed" : "Paid" : verifying ? "Checking" : "Awaiting payment"}</dd></div>
        </dl>
        <div className={styles.bottom}>
          <div className={styles.next}>
            <ShieldCheck size={22} aria-hidden="true" />
            <div><h2>{confirmed ? "Your next step" : paid && test ? "Everything in one place" : paid ? "What happens next?" : verifying ? "Your payment is being checked" : "Your registration is saved"}</h2>
              <p>{confirmed ? "Find your registration and payment details in your dashboard. Keep your reference handy for any questions." : paid && test ? "View your entry, selected rounds and payment details in your dashboard. Keep your registration reference handy if you need help." : paid ? "Contact the academy with your registration reference. Please do not submit another payment." : verifying ? "This page checks automatically for two minutes. If it is still pending, refresh the status or check your dashboard later." : canPay ? `Please pay before ${new Date(registration.payment_deadline).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })} (South African time).` : "Contact the academy with the reference above so we can help with your entry."}</p>
            </div>
          </div>
          {verifying && <PaymentStatusRefresh />}
          {test && <p className={styles.testNote}><strong>Test mode.</strong> {paid ? "No money was charged and no competition place is reserved." : "Use Yoco test card details only. No money will be charged and no competition place will be reserved."}</p>}
          <div className={styles.actions}>
            {canPay ? <PaymentButton token={token} /> : <Link className="button button-large" href="/dashboard/order-of-merit">View my registration <ArrowRight size={18} aria-hidden="true" /></Link>}
            {(!paid && !canPay && !verifying || paid && !test && !confirmed) && <Link className={styles.secondary} href="/events#contact">Contact the academy <ArrowRight size={17} aria-hidden="true" /></Link>}
            <Link className={styles.secondary} href="/juniors/order-of-merit">Back to Order of Merit</Link>
          </div>
          {!paid && <div className={styles.refresh}><Link href={`/payments/oom/${token}${verifying ? "?result=success" : ""}`}>Refresh payment status</Link>{canPay && <Link href="/dashboard/order-of-merit">My dashboard</Link>}</div>}
        </div>
      </section>
      <p className={styles.footnote}><ShieldCheck size={15} aria-hidden="true" /> Secure payments handled by Yoco</p>
    </div>
  </main>;
}
