import Link from "next/link";
import { notFound } from "next/navigation";
import { requireDashboardUser } from "@/lib/dashboard";
import { formatRand } from "@/lib/order-of-merit";
import { paymentPath } from "@/lib/yoco";

export default async function CustomerApplication({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!["oom", "academy"].includes(kind) || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const user = await requireDashboardUser();
  const { data: entry, error } = await user.supabase.from(kind === "oom" ? "oom_registrations" : "junior_academy_registrations")
    .select("*").eq("id", id).eq("user_id", user.userId).maybeSingle();
  if (error) throw new Error("Application could not be loaded. Please retry.");
  if (!entry) notFound();
  const rounds = kind === "oom" ? await user.supabase.from("oom_registration_rounds")
    .select("round_id,status,line_total_cents,oom_rounds(round_date,nine)").eq("registration_id", id) : null;
  const paymentUrl = kind === "oom" ? paymentPath(id) : null;
  const submission = entry.submission as Record<string, unknown>;
  return <main className="dashboard-content"><Link className="text-link" href={kind === "oom" ? "/dashboard/order-of-merit" : "/dashboard/academy"}>Back to your registrations</Link>
    <header><h1>{kind === "oom" ? entry.reference : "Junior Academy application"}</h1><p>Status: {entry.status.replaceAll("_", " ")}</p></header>
    {paymentUrl && <p><Link className="button button-small" href={paymentUrl}>View payment / continue checkout</Link></p>}
    {rounds && <section className="dashboard-panel"><h2>Selected rounds</h2>{rounds.error ? <p role="alert">Round details are temporarily unavailable.</p> : <div className="customer-registration-list">{rounds.data?.map((round) => <article key={round.round_id}>
      <h3>{(round.oom_rounds as unknown as { round_date: string } | null)?.round_date || round.round_id}</h3><p>{round.status} · {formatRand(round.line_total_cents)}</p>
      <p>Tee time will be confirmed by the academy.</p>
    </article>)}</div>}</section>}
    <section className="dashboard-panel"><h2>Your submitted information</h2><dl className="customer-submission">{Object.entries(submission ?? {}).filter(([key]) => !["website", "round_ids", "season_id", "amount_due_cents"].includes(key)).map(([key, value]) => <div key={key}><dt>{key.replaceAll("_", " ")}</dt><dd>{Array.isArray(value) ? value.join(", ") : typeof value === "boolean" ? value ? "Yes" : "No" : String(value ?? "—")}</dd></div>)}</dl></section>
    <p>Need to correct an application or cancel a competition entry? <a href="tel:+27762470501">Contact the academy</a> with your reference. Submitted details are kept as a record of your application.</p>
  </main>;
}
