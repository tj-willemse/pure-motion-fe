"use client";

import Link from "next/link";
import { CalendarDays, Check, ClipboardList, FileText, Settings, Trophy, Users } from "lucide-react";
import { useState } from "react";
import type { DashboardRole } from "@/lib/dashboard-navigation";
import {
  formatOomDate,
  formatRand,
  getOomDivision,
  oomRounds,
  oomSeason,
  type OomRound,
} from "@/lib/order-of-merit";
import {
  latestStablefordResults,
  oomAnnualStandings,
  oomPublishedRounds,
} from "@/lib/order-of-merit-results";

type WorkspaceTab = "overview" | "rounds" | "registrations" | "results" | "content";

export type DashboardOomRegistration = {
  id: string;
  reference: string;
  player: string;
  parent: string;
  parentEmail: string;
  division: "standard" | "kickstarter";
  roundIds: string[];
  jamMember: boolean;
  amountCents: number;
  status: "awaiting_payment" | "confirmed" | "declined" | "cancelled" | "expired";
  paymentStatus: "pending" | "paid" | "failed" | "expired" | "refunded" | "waived";
  paymentDeadline: string;
  submittedAt: string;
  staffNotes: string;
  photoUrl?: string;
};

const tabs: { id: WorkspaceTab; label: string; icon: typeof Trophy }[] = [
  { id: "overview", label: "Overview", icon: Trophy },
  { id: "rounds", label: "Rounds", icon: CalendarDays },
  { id: "registrations", label: "Registrations", icon: Users },
  { id: "results", label: "Results", icon: ClipboardList },
  { id: "content", label: "Content & terms", icon: FileText },
];

export function OomDashboard({ role, registrations = [], databaseReady = true }: { role: DashboardRole; registrations?: DashboardOomRegistration[]; databaseReady?: boolean }) {
  if (role === "client") return <ClientOom registrations={registrations} databaseReady={databaseReady} />;
  if (role === "coach") return <CoachOom />;
  return <StaffOom role={role} registrations={registrations} databaseReady={databaseReady} />;
}

function ClientOom({ registrations, databaseReady }: { registrations: DashboardOomRegistration[]; databaseReady: boolean }) {
  const upcomingCount = registrations.reduce((count, item) => count + item.roundIds.length, 0);
  const amountDue = registrations.filter((item) => item.paymentStatus === "pending").reduce((sum, item) => sum + item.amountCents, 0);
  return (
    <div className="oom-dashboard">
      <div className="oom-dashboard-head">
        <div><h1>Order of Merit</h1><p>Your junior registrations, payment status, tee times and results will appear here.</p></div>
        <Link className="button button-small" href="/juniors/order-of-merit#registration">Register a junior</Link>
      </div>
      {!databaseReady && <div className="oom-dashboard-notice">Apply the Order of Merit SQL migration to activate registrations.</div>}
      <div className="dashboard-stats">
        <DashboardStat label="Selected rounds" value={String(upcomingCount)} />
        <DashboardStat label="Payment due" value={formatRand(amountDue)} />
        <DashboardStat label="Registrations" value={String(registrations.length)} />
      </div>
      <section className="dashboard-panel">
        <h2>Your registrations</h2>
        {registrations.length ? <div className="oom-client-rounds">{registrations.map((item) => (
          <article key={item.id}><div><strong>{item.player} · {item.reference}</strong><span>{getOomDivision(item.division).shortName} · {item.roundIds.length} round{item.roundIds.length === 1 ? "" : "s"}</span></div><b>{item.status.replaceAll("_", " ")}</b></article>
        ))}</div> : <p>No Order of Merit registrations are linked to this account yet.</p>}
      </section>
    </div>
  );
}

function CoachOom() {
  const upcoming = oomRounds.filter((item) => item.status === "open").slice(0, 3);
  return (
    <div className="oom-dashboard">
      <div className="oom-dashboard-head"><div><h1>Order of Merit</h1><p>Review upcoming fields and enter round results.</p></div></div>
      <div className="dashboard-stats">
        <DashboardStat label="Next round entries" value="32" />
        <DashboardStat label="Results awaiting review" value="4" />
        <DashboardStat label="Course-ready reviews" value="3" />
      </div>
      <section className="dashboard-panel">
        <h2>Upcoming rounds</h2>
        <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>Date</th><th>Nine</th><th>Standard</th><th>Kickstarter</th><th>Action</th></tr></thead><tbody>{upcoming.map((item) => <tr key={item.id}><td>{formatOomDate(item.date)}</td><td>{item.nine}</td><td>{item.confirmed.standard}</td><td>{item.confirmed.kickstarter}</td><td><button className="dashboard-table-action" type="button">Open field</button></td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}

function StaffOom({ role, registrations, databaseReady }: { role: "admin" | "receptionist"; registrations: DashboardOomRegistration[]; databaseReady: boolean }) {
  const [tab, setTab] = useState<WorkspaceTab>("overview");
  const [rounds, setRounds] = useState<OomRound[]>(oomRounds.map((item) => ({ ...item, capacity: { ...item.capacity }, confirmed: { ...item.confirmed } })));
  const [notice, setNotice] = useState("");
  const nextRound = rounds.find((item) => item.status === "open");
  const registrationsRequiringAction = registrations.filter((item) => item.status !== "confirmed");

  function savePreview(label: string) {
    setNotice(`${label} saved in this local preview. Database persistence is intentionally not connected yet.`);
  }

  return (
    <div className="oom-dashboard">
      <div className="oom-dashboard-head">
        <div><h1>Order of Merit</h1><p>Manage the season once; the public pages, registrations and operations use the same records.</p></div>
        <span className="oom-dashboard-mode">Local management preview</span>
      </div>
      {!databaseReady && <div className="oom-dashboard-notice">The Order of Merit migration has not been applied yet. Registration controls will activate after the SQL is run.</div>}
      {notice && <div className="oom-dashboard-notice" role="status"><Check size={16} />{notice}<button type="button" onClick={() => setNotice("")}>Dismiss</button></div>}
      <nav className="oom-dashboard-tabs" aria-label="Order of Merit workspace">
        {tabs.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}><Icon size={17} />{label}</button>)}
      </nav>

      {tab === "overview" && (
        <>
          <div className="dashboard-stats">
            <DashboardStat label="Next round" value={nextRound ? formatOomDate(nextRound.date, { day: "numeric", month: "short" }) : "None"} />
            <DashboardStat label="Confirmed entries" value={String(nextRound ? nextRound.confirmed.standard + nextRound.confirmed.kickstarter : 0)} />
            <DashboardStat label="Needs attention" value={String(registrationsRequiringAction.length)} />
          </div>
          <div className="dashboard-two-column">
            <section className="dashboard-panel"><h2>Operational checklist</h2><div className="oom-ops-list">{["Review expiring capacity holds", "Confirm received payments", "Build and publish the tee sheet", "Send Sunday or Monday tee-time notices", "Open result entry after play"].map((item, index) => <div key={item}><span>{index + 1}</span><strong>{item}</strong></div>)}</div></section>
            <section className="dashboard-panel"><h2>Season setup</h2><dl className="oom-season-summary"><div><dt>Season</dt><dd>{oomSeason.year}</dd></div><div><dt>Playable rounds</dt><dd>{rounds.filter((item) => item.status !== "cancelled").length}</dd></div><div><dt>Standard price</dt><dd>{formatRand(oomSeason.standardPriceCents)}</dd></div><div><dt>JAM price</dt><dd>{formatRand(oomSeason.jamPriceCents)}</dd></div><div><dt>Term discount</dt><dd>{oomSeason.termDiscountPercent}%</dd></div><div><dt>Public status</dt><dd>Published</dd></div></dl></section>
          </div>
        </>
      )}

      {tab === "rounds" && <RoundsManager rounds={rounds} setRounds={setRounds} onSave={() => savePreview("Round configuration")} />}
      {tab === "registrations" && <RegistrationsManager registrations={registrations} />}
      {tab === "results" && <ResultsManager onSave={() => savePreview("Results")} />}
      {tab === "content" && <ContentManager canEdit={role === "admin"} onSave={() => savePreview("Public content and terms")} />}
    </div>
  );
}

function RoundsManager({ rounds, setRounds, onSave }: { rounds: OomRound[]; setRounds: React.Dispatch<React.SetStateAction<OomRound[]>>; onSave: () => void }) {
  const upcoming = rounds.filter((item) => item.status !== "completed").slice(-10);
  function updateRound(id: string, key: "status" | "standard" | "kickstarter", value: string) {
    setRounds((current) => current.map((item) => item.id !== id ? item : key === "status" ? { ...item, status: value as OomRound["status"] } : { ...item, capacity: { ...item.capacity, [key]: Number(value) } }));
  }
  return <section className="dashboard-panel"><div className="oom-panel-head"><div><h2>Round configuration</h2><p>Edit status and division capacity from one operational table.</p></div><button className="button button-small" type="button" onClick={onSave}>Save changes</button></div><div className="dashboard-table-wrap"><table className="dashboard-table oom-admin-table"><thead><tr><th>Date</th><th>Nine</th><th>Status</th><th>Standard capacity</th><th>Kickstarter capacity</th><th>Confirmed</th></tr></thead><tbody>{upcoming.map((item) => <tr key={item.id}><td><strong>{formatOomDate(item.date)}</strong><small>Term {item.term}</small></td><td>{item.nine}</td><td><select value={item.status} onChange={(event) => updateRound(item.id, "status", event.target.value)}><option value="draft">Draft</option><option value="open">Open</option><option value="full">Full</option><option value="closed">Closed</option><option value="cancelled">Cancelled</option><option value="completed">Completed</option></select></td><td><input type="number" min="0" value={item.capacity.standard} onChange={(event) => updateRound(item.id, "standard", event.target.value)} /></td><td><input type="number" min="0" value={item.capacity.kickstarter} onChange={(event) => updateRound(item.id, "kickstarter", event.target.value)} /></td><td>{item.confirmed.standard + item.confirmed.kickstarter}</td></tr>)}</tbody></table></div></section>;
}

function RegistrationsManager({ registrations }: { registrations: DashboardOomRegistration[] }) {
  return <section className="dashboard-panel"><div className="oom-panel-head"><div><h2>Registrations</h2><p>Open an application to review every submitted field, consent record, selected round, payment and audit event.</p></div></div>{registrations.length ? <div className="dashboard-table-wrap"><table className="dashboard-table oom-admin-table"><thead><tr><th>Application</th><th>Player</th><th>Division</th><th>Rounds</th><th>Total</th><th>Payment</th><th>Registration</th><th>Action</th></tr></thead><tbody>{registrations.map((item) => <tr key={item.id}><td><strong>{item.reference}</strong><small>{item.parent}<br />{item.parentEmail}</small></td><td><strong>{item.player}</strong><small>{item.jamMember ? "JAM member" : "Standard rate"}</small></td><td>{getOomDivision(item.division).shortName}</td><td>{item.roundIds.length}</td><td>{formatRand(item.amountCents)}</td><td><span className={`oom-admin-status is-${item.paymentStatus}`}>{item.paymentStatus.replaceAll("_", " ")}</span></td><td><span className={`oom-admin-status is-${item.status}`}>{item.status.replaceAll("_", " ")}</span></td><td><Link className="dashboard-table-action" href={`/dashboard/order-of-merit/registrations/${item.id}`}>Open application</Link></td></tr>)}</tbody></table></div> : <p>No registrations have been submitted yet.</p>}</section>;
}

function ResultsManager({ onSave }: { onSave: () => void }) {
  const latestRound = oomPublishedRounds[0];
  return (
    <div className="dashboard-two-column oom-results-manager-grid">
      <section className="dashboard-panel">
        <div className="oom-panel-head">
          <div>
            <h2>Round result entry</h2>
            <p>Enter one round, review it, then publish it into the annual standings and public archive.</p>
          </div>
          <button className="button button-small" type="button" onClick={onSave}>Save draft</button>
        </div>
        <div className="oom-admin-result-context">
          <label><span>Round</span><select defaultValue={latestRound.id}>{oomPublishedRounds.map((round) => <option key={round.id} value={round.id}>{round.date} · {round.label}</option>)}</select></label>
          <label><span>Division</span><select defaultValue="standard"><option value="standard">Stableford</option><option value="kickstarter">Kickstarter</option></select></label>
          <label><span>Publication</span><select defaultValue="published"><option value="draft">Draft</option><option value="reviewed">Reviewed</option><option value="published">Published</option></select></label>
        </div>
        <div className="dashboard-table-wrap"><table className="dashboard-table oom-admin-table"><thead><tr><th>Player</th><th>Stableford</th><th>OOM points</th><th>Handicap index</th><th>Course handicap</th></tr></thead><tbody>{latestStablefordResults.slice(0, 10).map((row) => <tr key={row.player}><td><strong>{row.player}</strong><small>Rank {row.position}</small></td><td><input aria-label={`${row.player} Stableford points`} defaultValue={row.stablefordPoints} /></td><td><input aria-label={`${row.player} OOM points`} defaultValue={row.oomPoints} /></td><td><input aria-label={`${row.player} handicap index`} defaultValue={row.handicapIndex} /></td><td><input aria-label={`${row.player} course handicap`} defaultValue={row.courseHandicap} /></td></tr>)}</tbody></table></div>
        <div className="oom-results-publish"><span>Publishing updates the round archive and recalculates the relevant annual table.</span><button type="button" className="button button-outline" onClick={onSave}>Review and publish</button></div>
      </section>
      <aside className="dashboard-panel">
        <h2>Results data</h2>
        <dl className="oom-season-summary">
          <div><dt>Stableford players</dt><dd>{oomAnnualStandings.standard.length}</dd></div>
          <div><dt>Kickstarter players</dt><dd>{oomAnnualStandings.kickstarter.length}</dd></div>
          <div><dt>Graduates</dt><dd>{oomAnnualStandings.graduates.length}</dd></div>
          <div><dt>Published rounds</dt><dd>{oomPublishedRounds.length}</dd></div>
        </dl>
        <div className="oom-admin-photo-note"><strong>Junior image control</strong><p>A photo is published only when the player record has explicit image consent. Otherwise the public table uses initials.</p></div>
      </aside>
    </div>
  );
}

function ContentManager({ canEdit, onSave }: { canEdit: boolean; onSave: () => void }) {
  return <div className="dashboard-two-column"><section className="dashboard-panel"><div className="oom-panel-head"><div><h2>Public page content</h2><p>Structured content keeps marketing copy separate from competition records.</p></div></div><form className="dashboard-form" onSubmit={(event) => { event.preventDefault(); onSave(); }}><label className="dashboard-field"><span>Overview introduction</span><textarea rows={5} defaultValue="Established in 2012, the Order of Merit gives course-ready juniors regular nine-hole competition experience." disabled={!canEdit} /></label><label className="dashboard-field"><span>Course-ready guidance</span><textarea rows={5} defaultValue="Players should make regular contact, use basic chipping skills, keep pace and understand core safety and etiquette." disabled={!canEdit} /></label><button className="button" type="submit" disabled={!canEdit}>Save public content</button>{!canEdit && <small>Only an administrator can change published content.</small>}</form></section><section className="dashboard-panel"><div className="oom-panel-head"><div><h2>Terms version</h2><p>Registrations retain the exact version accepted at submission.</p></div><Settings size={22} /></div><dl className="oom-season-summary"><div><dt>Current version</dt><dd>2026.1</dd></div><div><dt>Effective from</dt><dd>1 January 2026</dd></div><div><dt>Accepted registrations</dt><dd>48</dd></div><div><dt>Status</dt><dd>Published</dd></div></dl><button className="button button-outline" type="button" disabled={!canEdit} onClick={onSave}>Create a new draft version</button></section></div>;
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return <div className="dashboard-stat"><span>{label}</span><strong>{value}</strong></div>;
}
