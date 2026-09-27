import Link from "next/link";
import { requireDashboardUser } from "@/lib/dashboard";
import { paymentPath, paymentHoldOpen } from "@/lib/yoco";
import { formatRand } from "@/lib/order-of-merit";

type User = Awaited<ReturnType<typeof requireDashboardUser>>;
const readable = (value: string) => value.replaceAll("_", " ");

export async function CustomerRegistrations({ user, section }: { user: User; section: string }) {
  const [oom, academy] = await Promise.all([
    user.supabase.from("oom_registrations").select("id,reference,player_first_name,player_last_name,division,status,total_cents,payment_deadline,submitted_at")
      .eq("user_id", user.userId).order("submitted_at", { ascending: false }),
    user.supabase.from("junior_academy_registrations").select("id,junior_first_name,junior_last_name,programme,location,status,amount_due_cents,submitted_at")
      .eq("user_id", user.userId).order("submitted_at", { ascending: false }),
  ]);
  const ids = (oom.data ?? []).map((row) => row.id);
  const payments = ids.length ? await user.supabase.from("oom_payments").select("registration_id,status,amount_cents,processing_mode,paid_at,created_at")
    .in("registration_id", ids).order("created_at", { ascending: false }) : { data: [], error: null };
  const showOom = section !== "academy";
  const showAcademy = section !== "order-of-merit";
  return <div className="customer-registration-workspace">
    <header><h1>{section === "overview" ? "Your registrations" : section === "academy" ? "Junior Academy" : section === "payments" ? "Payments" : "Order of Merit"}</h1>
      <p>Manage your family’s entries and check their current status. A submitted application is not a confirmed booking.</p>
      <div className="customer-actions"><Link className="button button-small" href="/book">Request a lesson</Link><Link className="text-link" href="/juniors/academy-registration">Register for JAM</Link><Link className="text-link" href="/juniors/order-of-merit#registration">Register for Order of Merit</Link></div>
    </header>
    {showOom && <section className="dashboard-panel"><h2>Order of Merit</h2>
      {oom.error || payments.error ? <p role="alert">Registration or payment information could not be loaded. Please retry or contact the academy.</p> : !oom.data?.length ? <p>No Order of Merit registrations are linked to this account yet.</p> : <div className="customer-registration-list">{oom.data.map((entry) => {
        const payment = payments.data?.find((row) => row.registration_id === entry.id);
        const path = paymentPath(entry.id);
        const test = payment?.processing_mode === "test";
        const canPay = entry.status === "awaiting_payment" && paymentHoldOpen(entry.payment_deadline) && !["paid", "waived", "refunded"].includes(payment?.status ?? "pending");
        return <article key={entry.id}>
          <h3>{entry.player_first_name} {entry.player_last_name}</h3><p>{entry.reference} · {entry.division === "standard" ? "Stableford" : "Kickstarter"}</p>
          <dl><div><dt>Registration</dt><dd>{readable(entry.status)}</dd></div><div><dt>Payment</dt><dd>{test ? "TEST · " : ""}{readable(payment?.status ?? "pending")}</dd></div><div><dt>Total</dt><dd>{formatRand(entry.total_cents)}</dd></div></dl>
          {test && <p>Test transaction only. This does not confirm a live competition entry.</p>}
          <div className="customer-actions"><Link href={`/dashboard/registrations/oom/${entry.id}`} className="text-link">View entry and rounds</Link>{path && <Link className="button button-small" href={path}>{canPay ? "Continue payment" : "View payment status"}</Link>}</div>
        </article>;
      })}</div>}
    </section>}
    {showAcademy && <section className="dashboard-panel"><h2>Junior Academy applications</h2>
      {academy.error ? <p role="alert">Academy applications could not be loaded. Please retry or contact the academy.</p> : !academy.data?.length ? <p>No Junior Academy applications are linked to this account yet.</p> : <div className="customer-registration-list">{academy.data.map((entry) => <article key={entry.id}>
        <h3>{entry.junior_first_name} {entry.junior_last_name}</h3>
        <dl><div><dt>Status</dt><dd>{readable(entry.status)}</dd></div><div><dt>Preferred venue</dt><dd>{entry.location || "To be confirmed"}</dd></div><div><dt>Membership amount</dt><dd>{formatRand(entry.amount_due_cents)}</dd></div></dl>
        <p>Programme and schedule require academy confirmation. JAM online payment is not connected yet.</p>
        <Link className="text-link" href={`/dashboard/registrations/academy/${entry.id}`}>View application</Link>
      </article>)}</div>}
    </section>}
    <p>Registered previously while signed out? Contact the academy to link that entry securely. Registrations are not linked by email alone.</p>
  </div>;
}
