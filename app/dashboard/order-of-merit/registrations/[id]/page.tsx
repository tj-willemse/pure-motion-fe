/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Check, CircleAlert, ExternalLink, ShieldCheck } from "lucide-react";
import { updateOomRegistrationStatus } from "@/app/dashboard/actions";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { ToastMessage } from "@/components/toast-message";
import { requireDashboardUser } from "@/lib/dashboard";
import { formatRand, getOomDivision } from "@/lib/order-of-merit";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
};

function dateTime(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function dateOnly(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "long" }).format(new Date(`${value}T12:00:00+02:00`));
}

function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}

export default async function OomRegistrationApplicationPage({ params, searchParams }: PageProps) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requireDashboardUser()]);
  if (!["admin", "receptionist"].includes(user.role)) redirect("/dashboard/order-of-merit");
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const { data: registration, error } = await user.supabase
    .from("oom_registrations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !registration) notFound();

  const [selectedResult, paymentsResult, auditResult] = await Promise.all([
    user.supabase
      .from("oom_registration_rounds")
      .select("round_id,unit_price_cents,discount_cents,line_total_cents,status,hold_expires_at,created_at")
      .eq("registration_id", id)
      .order("created_at"),
    user.supabase
      .from("oom_payments")
      .select("*")
      .eq("registration_id", id)
      .order("created_at", { ascending: false }),
    user.supabase
      .from("audit_events")
      .select("id,actor_id,action,metadata,created_at")
      .eq("entity_type", "oom_registration")
      .eq("entity_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const selectedRounds = selectedResult.data ?? [];
  const roundIds = selectedRounds.map((item) => item.round_id);
  const { data: roundRows = [] } = roundIds.length
    ? await user.supabase
        .from("oom_rounds")
        .select("id,round_date,nine,term,status,note")
        .in("id", roundIds)
        .order("round_date")
    : { data: [] };
  const rounds = new Map((roundRows ?? []).map((round) => [round.id, round]));
  const payments = paymentsResult.data ?? [];
  const latestPayment = payments[0];

  let photoUrl: string | undefined;
  if (registration.leaderboard_photo_path) {
    const { data: signed } = await user.supabase.storage
      .from("oom-player-photos")
      .createSignedUrl(registration.leaderboard_photo_path, 3600);
    photoUrl = signed?.signedUrl;
  }

  const applicationPath = `/dashboard/order-of-merit/registrations/${registration.id}`;
  const discoverySources = Array.isArray(registration.discovery_sources) ? registration.discovery_sources : [];

  return (
    <main id="main-content" className="dashboard-content oom-application-page">
      <ToastMessage error={query.error} message={query.message} />
      <Link className="oom-application-back" href="/dashboard/order-of-merit"><ArrowLeft size={16} />Back to registrations</Link>

      <header className="oom-application-header">
        <div>
          <span>Order of Merit application</span>
          <h1>{registration.reference}</h1>
          <p>Submitted {dateTime(registration.submitted_at)} · Terms {registration.terms_version}</p>
        </div>
        <div className="oom-application-header-statuses">
          <span className={`oom-admin-status is-${latestPayment?.status ?? "pending"}`}>Payment: {(latestPayment?.status ?? "pending").replaceAll("_", " ")}</span>
          <span className={`oom-admin-status is-${registration.status}`}>Registration: {registration.status.replaceAll("_", " ")}</span>
        </div>
      </header>

      <div className="oom-application-layout">
        <div className="oom-application-main">
          <ApplicationSection title="Parent or responsible adult">
            <ApplicationGrid>
              <ApplicationField label="Name" value={`${registration.parent_first_name} ${registration.parent_last_name}`} />
              <ApplicationField label="Relationship" value={registration.relationship} />
              <ApplicationField label="Email" value={registration.parent_email} href={`mailto:${registration.parent_email}`} />
              <ApplicationField label="Mobile / WhatsApp" value={registration.parent_phone} href={`tel:${registration.parent_phone}`} />
              <ApplicationField label="Physical address" value={registration.physical_address} wide />
              <ApplicationField label="Alternative transport" value={registration.alternate_transport || "Not supplied"} wide />
              <ApplicationField label="How they heard about it" value={discoverySources.join(", ") || "Not supplied"} wide />
            </ApplicationGrid>
          </ApplicationSection>

          <ApplicationSection title="Player profile">
            <div className="oom-application-player">
              {photoUrl ? <a href={photoUrl} target="_blank" rel="noreferrer"><img src={photoUrl} alt={`${registration.player_first_name} ${registration.player_last_name}`} /><span>Open original <ExternalLink size={14} /></span></a> : <div className="oom-application-photo-empty">No photograph uploaded</div>}
              <ApplicationGrid>
                <ApplicationField label="Full name" value={`${registration.player_first_name} ${registration.player_last_name}`} />
                <ApplicationField label="Known as" value={registration.player_known_as || "—"} />
                <ApplicationField label="Date of birth" value={dateOnly(registration.player_date_of_birth)} />
                <ApplicationField label="Gender" value={registration.player_gender} />
                <ApplicationField label="School" value={registration.player_school} />
                <ApplicationField label="Grade" value={registration.player_grade} />
                <ApplicationField label="Division" value={getOomDivision(registration.division).name} />
                <ApplicationField label="Handicap index" value={registration.handicap_index ?? "Not supplied"} />
                <ApplicationField label="Pure Motion coach" value={registration.coach_name || "No coach supplied"} />
                <ApplicationField label="Social media" value={registration.player_social_media || "Not supplied"} />
                <ApplicationField label="DGC member" value={yesNo(registration.dgc_member)} />
                <ApplicationField label="DGC membership number" value={registration.dgc_membership_number || "—"} />
                <ApplicationField label="JAM member" value={yesNo(registration.jam_member)} />
                <ApplicationField label="JAM membership number" value={registration.jam_membership_number || "—"} />
                <ApplicationField label="Support or accommodation requirements" value={registration.support_requirements || "None supplied"} wide sensitive />
              </ApplicationGrid>
            </div>
          </ApplicationSection>

          <ApplicationSection title="Selected rounds and pricing">
            <div className="dashboard-table-wrap">
              <table className="dashboard-table oom-application-table">
                <thead><tr><th>Date</th><th>Term</th><th>Nine</th><th>Hold</th><th>Price</th><th>Discount</th><th>Total</th></tr></thead>
                <tbody>{selectedRounds.map((selection) => {
                  const round = rounds.get(selection.round_id);
                  return <tr key={selection.round_id}><td><strong>{dateOnly(round?.round_date ?? null)}</strong><small>{round?.note || round?.status || ""}</small></td><td>{round?.term ?? "—"}</td><td>{round?.nine ? `${round.nine} nine` : "—"}</td><td><span className={`oom-admin-status is-${selection.status}`}>{selection.status}</span><small>{selection.hold_expires_at ? `Until ${dateTime(selection.hold_expires_at)}` : ""}</small></td><td>{formatRand(selection.unit_price_cents)}</td><td>−{formatRand(selection.discount_cents)}</td><td>{formatRand(selection.line_total_cents)}</td></tr>;
                })}</tbody>
              </table>
            </div>
            <dl className="oom-application-totals">
              <div><dt>Subtotal</dt><dd>{formatRand(registration.subtotal_cents)}</dd></div>
              <div><dt>Discount</dt><dd>−{formatRand(registration.discount_cents)}</dd></div>
              <div><dt>Total due</dt><dd>{formatRand(registration.total_cents)}</dd></div>
              <div><dt>Payment deadline</dt><dd>{dateTime(registration.payment_deadline)}</dd></div>
            </dl>
          </ApplicationSection>

          <ApplicationSection title="Payment history">
            {latestPayment?.processing_mode === "test" && <p role="status"><strong>Yoco test transaction — no real money collected. Do not confirm this entry as paid for a live competition.</strong></p>}
            {payments.length ? <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>Created</th><th>Provider</th><th>Status</th><th>Amount</th><th>Paid</th><th>Provider reference</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td>{dateTime(payment.created_at)}</td><td>{payment.provider}</td><td><span className={`oom-admin-status is-${payment.status}`}>{payment.status}</span></td><td>{formatRand(payment.amount_cents)}</td><td>{dateTime(payment.paid_at)}</td><td>{payment.provider_payment_id || payment.provider_checkout_id || "—"}</td></tr>)}</tbody></table></div> : <p>No payment record is attached.</p>}
          </ApplicationSection>

          <ApplicationSection title="Consent and record links">
            <div className="oom-application-consents">
              <div className={registration.image_consent ? "is-confirmed" : "is-missing"}>{registration.image_consent ? <Check size={18} /> : <CircleAlert size={18} />}<span><strong>Image and contact consent</strong><small>{registration.image_consent ? "Accepted at submission" : "Not accepted"}</small></span></div>
              <div className={registration.terms_accepted ? "is-confirmed" : "is-missing"}>{registration.terms_accepted ? <Check size={18} /> : <CircleAlert size={18} />}<span><strong>Competition terms</strong><small>{registration.terms_accepted ? `Accepted version ${registration.terms_version}` : "Not accepted"}</small></span></div>
              <div className="is-neutral"><ShieldCheck size={18} /><span><strong>Customer account</strong><small>{registration.user_id ? `Linked · ${registration.user_id}` : "Guest submission · not linked"}</small></span></div>
              <div className="is-neutral"><ShieldCheck size={18} /><span><strong>Junior profile</strong><small>{registration.dependent_id ? `Linked · ${registration.dependent_id}` : "Submission snapshot only"}</small></span></div>
            </div>
          </ApplicationSection>

          <ApplicationSection title="Audit history">
            {(auditResult.data ?? []).length ? <div className="oom-application-audit">{(auditResult.data ?? []).map((event) => <div key={event.id}><span>{dateTime(event.created_at)}</span><strong>{event.action.replaceAll(".", " ")}</strong><small>{event.actor_id ? `Actor ${event.actor_id}` : "Public submission"}{event.metadata && Object.keys(event.metadata).length ? ` · ${JSON.stringify(event.metadata)}` : ""}</small></div>)}</div> : <p>No audit events were found.</p>}
          </ApplicationSection>

          <ApplicationSection title="Original submission snapshot">
            <p className="oom-application-snapshot-note">This immutable snapshot preserves exactly what the browser submitted, independently of later staff updates.</p>
            <details className="oom-application-snapshot"><summary>View stored submission data</summary><pre>{JSON.stringify(registration.submission, null, 2)}</pre></details>
          </ApplicationSection>
        </div>

        <aside className="oom-application-sidebar">
          <section className="dashboard-panel">
            <h2>Update application</h2>
            <form action={updateOomRegistrationStatus} className="dashboard-form">
              <input type="hidden" name="registrationId" value={registration.id} />
              <input type="hidden" name="returnPath" value={applicationPath} />
              <label className="dashboard-field"><span>Payment status</span><select name="paymentStatus" defaultValue={latestPayment?.status ?? "pending"}><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="expired">Expired</option><option value="refunded">Refunded</option><option value="waived">Waived</option></select></label>
              <label className="dashboard-field"><span>Registration status</span><select name="registrationStatus" defaultValue={registration.status}><option value="awaiting_payment">Awaiting payment</option><option value="confirmed">Confirmed</option><option value="declined">Declined</option><option value="cancelled">Cancelled</option><option value="expired">Expired</option></select></label>
              <label className="dashboard-field"><span>Private staff notes</span><textarea name="staffNotes" rows={6} defaultValue={registration.staff_notes ?? ""} placeholder="Not visible to the customer" /></label>
              <PendingSubmitButton pendingLabel="Saving application…">Save status and notes</PendingSubmitButton>
            </form>
          </section>
          <section className="dashboard-panel oom-application-record-summary">
            <h2>Record summary</h2>
            <dl>
              <div><dt>Registration date</dt><dd>{dateOnly(registration.registration_date)}</dd></div>
              <div><dt>Submitted</dt><dd>{dateTime(registration.submitted_at)}</dd></div>
              <div><dt>Last updated</dt><dd>{dateTime(registration.updated_at)}</dd></div>
              <div><dt>Terms version</dt><dd>{registration.terms_version}</dd></div>
              <div><dt>Photo format</dt><dd>{registration.leaderboard_photo_path ? "Private WebP" : "No photo"}</dd></div>
              <div><dt>Season</dt><dd>{registration.season_id}</dd></div>
              <div><dt>Internal ID</dt><dd>{registration.id}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}

function ApplicationSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="dashboard-panel oom-application-section"><h2>{title}</h2>{children}</section>;
}

function ApplicationGrid({ children }: { children: React.ReactNode }) {
  return <dl className="oom-application-grid">{children}</dl>;
}

function ApplicationField({ label, value, href, wide = false, sensitive = false }: { label: string; value: React.ReactNode; href?: string; wide?: boolean; sensitive?: boolean }) {
  return <div className={`${wide ? "is-wide" : ""}${sensitive ? " is-sensitive" : ""}`}><dt>{label}</dt><dd>{href ? <a href={href}>{value}</a> : value}</dd></div>;
}
