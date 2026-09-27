"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Info, ShieldCheck, Upload } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import type { CustomerAccount } from "@/lib/customer-account-types";
import { submitOomRegistration, type OomSubmissionResult } from "./actions";
import {
  formatOomDate,
  formatRand,
  getOomDivision,
  oomRegistrationOptions,
  oomRounds,
  oomSeason,
  type OomDivisionId,
  type OomRound,
} from "@/lib/order-of-merit";

const steps = ["Adult and player", "Player profile", "Choose rounds", "Review"] as const;
const bookableRounds = oomRounds.filter((item) => item.status === "open");
const terms = [1, 2, 3, 4] as const;

type Details = {
  registrationDate: string;
  parentFirstName: string;
  parentSurname: string;
  relationship: string;
  email: string;
  phone: string;
  address: string;
  alternateTransport: string;
  discoverySources: string[];
  playerFirstName: string;
  playerKnownAs: string;
  playerSurname: string;
  gender: string;
  dateOfBirth: string;
  school: string;
  grade: string;
  handicap: string;
  coach: string;
  otherCoach: string;
  dgcStatus: "member" | "not_member" | "";
  dgcNumber: string;
  jamStatus: "yes" | "no" | "";
  jamNumber: string;
  leaderboardPhoto: File | null;
  socialMedia: string;
  support: string;
};

const initialDetails: Details = {
  registrationDate: "",
  parentFirstName: "",
  parentSurname: "",
  relationship: "",
  email: "",
  phone: "",
  address: "",
  alternateTransport: "",
  discoverySources: [],
  playerFirstName: "",
  playerKnownAs: "",
  playerSurname: "",
  gender: "",
  dateOfBirth: "",
  school: "",
  grade: "",
  handicap: "",
  coach: "",
  otherCoach: "",
  dgcStatus: "",
  dgcNumber: "",
  jamStatus: "",
  jamNumber: "",
  leaderboardPhoto: null,
  socialMedia: "",
  support: "",
};

function ageOnSeasonStart(dateOfBirth: string) {
  if (!dateOfBirth) return null;
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  if (!year || !month || !day) return null;
  return oomSeason.year - year - (month > 1 || (month === 1 && day > 1) ? 1 : 0);
}

function availabilityLabel(round: OomRound, division: OomDivisionId | "") {
  if (round.status === "cancelled") return "Cancelled";
  if (round.status === "completed" || round.status === "closed") return "Closed";
  if (round.status === "full") return "Fully booked";
  if (division && round.capacity[division] - round.confirmed[division] <= 0) return `${getOomDivision(division).shortName} fully booked`;
  return round.note ?? "Registration available";
}

export function OomRegistrationForm({ account, today }: { account: CustomerAccount; today: string }) {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ ...initialDetails, registrationDate: today, parentFirstName: account.firstName, parentSurname: account.lastName, email: account.email, phone: account.phone });
  const [division, setDivision] = useState<OomDivisionId | "">("");
  const [selectedRoundIds, setSelectedRoundIds] = useState<string[]>([]);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [submission, setSubmission] = useState<OomSubmissionResult | null>(null);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, startSubmission] = useTransition();

  const chosenRounds = bookableRounds.filter((item) => selectedRoundIds.includes(item.id));
  const playerAge = ageOnSeasonStart(details.dateOfBirth);
  const ageIsEligible = playerAge !== null && playerAge >= 6 && playerAge < 19;
  const pricing = useMemo(() => {
    const price = details.jamStatus === "yes" ? oomSeason.jamPriceCents : oomSeason.standardPriceCents;
    const discountedRoundIds = new Set<string>();
    terms.forEach((term) => {
      const completeTerm = oomRounds.filter((item) => item.term === term && item.status !== "cancelled");
      const entireTermIsBookable = completeTerm.every((item) => item.status === "open");
      if (entireTermIsBookable && completeTerm.length > 0 && completeTerm.every((item) => selectedRoundIds.includes(item.id))) {
        completeTerm.forEach((item) => discountedRoundIds.add(item.id));
      }
    });
    const subtotal = chosenRounds.length * price;
    const discount = chosenRounds.reduce((sum, item) => sum + (discountedRoundIds.has(item.id) ? Math.round(price * 0.1) : 0), 0);
    return { price, subtotal, discount, total: subtotal - discount };
  }, [chosenRounds, details.jamStatus, selectedRoundIds]);

  function update<K extends keyof Details>(key: K, value: Details[K]) {
    setDetails((current) => ({ ...current, [key]: value }));
  }

  function toggleDiscovery(source: string) {
    update("discoverySources", details.discoverySources.includes(source)
      ? details.discoverySources.filter((item) => item !== source)
      : [...details.discoverySources, source]);
  }

  function toggleRound(id: string) {
    setSelectedRoundIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function selectWholeTerm(term: number) {
    const ids = bookableRounds
      .filter((item) => item.term === term && division && item.capacity[division] - item.confirmed[division] > 0)
      .map((item) => item.id);
    setSelectedRoundIds((current) => [...new Set([...current, ...ids])]);
  }

  function submitRegistration() {
    setSubmissionError("");
    const formData = new FormData();
    const add = (key: string, value: string | boolean) => formData.set(key, String(value));
    add("website", "");
    add("registration_date", details.registrationDate);
    add("parent_first_name", details.parentFirstName);
    add("parent_last_name", details.parentSurname);
    add("relationship", details.relationship);
    add("parent_email", details.email);
    add("parent_phone", details.phone);
    add("physical_address", details.address);
    add("alternate_transport", details.alternateTransport);
    details.discoverySources.forEach((source) => formData.append("discovery_sources", source));
    add("player_first_name", details.playerFirstName);
    add("player_known_as", details.playerKnownAs);
    add("player_last_name", details.playerSurname);
    add("player_gender", details.gender);
    add("player_date_of_birth", details.dateOfBirth);
    add("player_school", details.school);
    add("player_grade", details.grade);
    add("handicap_index", details.handicap);
    add("coach_name", details.coach === "other" ? details.otherCoach : details.coach);
    add("dgc_member", details.dgcStatus === "member");
    add("dgc_membership_number", details.dgcNumber);
    add("jam_member", details.jamStatus === "yes");
    add("jam_membership_number", details.jamNumber);
    add("player_social_media", details.socialMedia);
    add("support_requirements", details.support);
    add("division", division);
    selectedRoundIds.forEach((roundId) => formData.append("round_ids", roundId));
    add("image_consent", privacyConsent);
    add("terms_accepted", accepted);
    if (details.leaderboardPhoto) formData.set("leaderboard_photo", details.leaderboardPhoto);

    startSubmission(async () => {
      const result = await submitOomRegistration(formData);
      if (!result.ok) {
        setSubmissionError(result.error ?? "The registration could not be submitted.");
        return;
      }
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      setSubmission(result);
    });
  }

  const adultComplete = Boolean(
    details.registrationDate && details.parentFirstName && details.parentSurname && details.relationship &&
    details.email && details.phone && details.address && details.discoverySources.length &&
    details.playerFirstName && details.playerSurname && details.gender && details.dateOfBirth &&
    details.school && details.grade && ageIsEligible,
  );
  const eligibilityComplete = Boolean(
    division && details.dgcStatus && details.jamStatus &&
    (details.coach !== "other" || details.otherCoach),
  );

  if (submission?.ok) {
    return (
      <div className="oom-registration-success">
        <Info size={42} aria-hidden="true" />
        <h2>Payment still required.</h2>
        <p>Your entry is awaiting payment, not confirmed. Retry checkout below. Your details are saved; do not submit the same entry again.</p>
        <dl>
          <div><dt>Reference</dt><dd>{submission.reference}</dd></div>
          <div><dt>Player</dt><dd>{details.playerKnownAs || details.playerFirstName} {details.playerSurname}</dd></div>
          <div><dt>Division</dt><dd>{getOomDivision(division || "standard").name}</dd></div>
          <div><dt>Rounds</dt><dd>{chosenRounds.length}</dd></div>
          <div><dt>Amount due</dt><dd>{formatRand(submission.totalCents ?? pricing.total)}</dd></div>
        </dl>
        {!!submission.warnings?.length && <div className="oom-form-notice is-warning"><Info size={19} /><div><strong>Registration saved with a follow-up needed.</strong>{submission.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div></div>}
        <div className="oom-register-actions">
          {submission.paymentUrl ? <Link className="button" href={submission.paymentUrl}>Continue to payment <ArrowRight size={18} /></Link> : <p>Online checkout is not configured yet. Your entry is saved; contact the academy with your reference.</p>}
          <Link className="button" href="/juniors/order-of-merit">Back to Order of Merit <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="oom-registration-shell">
      <nav className="oom-registration-steps" aria-label="Registration progress">
        {steps.map((label, index) => (
          <button key={label} type="button" className={index === step ? "is-active" : index < step ? "is-complete" : ""} onClick={() => index <= step && setStep(index)} disabled={index > step}>
            <span>{index < step ? <Check size={15} /> : index + 1}</span>
            <strong>{label}</strong>
          </button>
        ))}
      </nav>

      <div className="oom-registration-layout">
        <form className="oom-registration-card" onSubmit={(event) => event.preventDefault()} aria-busy={isSubmitting}>
          {step === 0 && (
            <fieldset>
              <legend>Adult and player details</legend>
              <Field label="Saved family golfer"><select defaultValue="" onChange={(event) => {
                const junior = account.family.find((item) => item.id === event.target.value);
                setDetails((current) => ({ ...current, playerFirstName: junior?.first_name ?? "", playerSurname: junior?.last_name ?? "", dateOfBirth: junior?.date_of_birth ?? "" }));
              }}><option value="">Enter a new junior</option>{account.family.map((junior) => <option key={junior.id} value={junior.id}>{junior.first_name} {junior.last_name}</option>)}</select></Field>
              <p>These fields match the information collected by the official 2026 Order of Merit registration form.</p>
              <div className="oom-form-grid three">
                <Field label="Today’s date" required><input type="date" value={details.registrationDate} onChange={(event) => update("registrationDate", event.target.value)} /></Field>
                <Field label="Parent or guardian first name" required><input value={details.parentFirstName} onChange={(event) => update("parentFirstName", event.target.value)} autoComplete="given-name" /></Field>
                <Field label="Parent or guardian surname" required><input value={details.parentSurname} onChange={(event) => update("parentSurname", event.target.value)} autoComplete="family-name" /></Field>
                <Field label="Relationship to player" required>
                  <select value={details.relationship} onChange={(event) => update("relationship", event.target.value)}>
                    <option value="">Select relationship</option>
                    {oomRegistrationOptions.relationships.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>
                <Field label="Email address" required><input type="email" value={details.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" /></Field>
                <Field label="Mobile / WhatsApp" required><input type="tel" value={details.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" /></Field>
              </div>
              <div className="oom-form-grid two oom-form-section-gap">
                <Field label="Physical address, including postal code" required><textarea rows={3} value={details.address} onChange={(event) => update("address", event.target.value)} autoComplete="street-address" /></Field>
                <Field label="Person bringing the player, if different"><textarea rows={3} value={details.alternateTransport} onChange={(event) => update("alternateTransport", event.target.value)} placeholder="Name and mobile number" /></Field>
              </div>
              <CheckboxGroup label="How did you hear about the Order of Merit?" required values={details.discoverySources} options={oomRegistrationOptions.discoverySources} onChange={toggleDiscovery} />
              <hr />
              <div className="oom-form-grid three">
                <Field label="Player first name" required><input value={details.playerFirstName} onChange={(event) => update("playerFirstName", event.target.value)} /></Field>
                <Field label="Known as / nickname"><input value={details.playerKnownAs} onChange={(event) => update("playerKnownAs", event.target.value)} /></Field>
                <Field label="Player surname" required><input value={details.playerSurname} onChange={(event) => update("playerSurname", event.target.value)} /></Field>
                <Field label="Player gender" required>
                  <select value={details.gender} onChange={(event) => update("gender", event.target.value)}>
                    <option value="">Select gender</option>
                    {oomRegistrationOptions.genders.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </Field>
                <Field label="School" required><input value={details.school} onChange={(event) => update("school", event.target.value)} /></Field>
                <Field label="Grade" required>
                  <select value={details.grade} onChange={(event) => update("grade", event.target.value)}>
                    <option value="">Select grade</option>
                    {oomRegistrationOptions.grades.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </Field>
                <Field label="Date of birth" required><input type="date" value={details.dateOfBirth} onChange={(event) => update("dateOfBirth", event.target.value)} /></Field>
                <Field label={`Age on 1 January ${oomSeason.year}`} required><input value={playerAge ?? ""} readOnly placeholder="Calculated from date of birth" /></Field>
              </div>
              {details.dateOfBirth && !ageIsEligible && <div className="oom-form-notice is-error"><Info size={19} /><div><strong>The player is outside the published age range.</strong><p>Order of Merit is for players aged 6 to 18 on 1 January {oomSeason.year}.</p></div></div>}
              <FormActions next={() => setStep(1)} nextDisabled={!adultComplete} />
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend>Player profile</legend>
              <p>Confirm the division, coaching and membership information used by the official form.</p>
              <ChoiceGroup label="Which Order of Merit round will the player enter?" value={division} onChange={(value) => { setDivision(value as OomDivisionId); setSelectedRoundIds([]); }} options={[["standard", "Standard length course / Stableford"], ["kickstarter", "Kickstarter / shortened course"]]} />
              <div className="oom-form-grid two">
                <Field label="Official Handicap Index"><input type="number" min="0" max="54" step="0.1" inputMode="decimal" value={details.handicap} onChange={(event) => update("handicap", event.target.value)} placeholder="If applicable" /></Field>
                <Field label="Pure Motion coach">
                  <select value={details.coach} onChange={(event) => update("coach", event.target.value)}>
                    <option value="">No Pure Motion coach</option>
                    {oomRegistrationOptions.coaches.map((coach) => <option key={coach}>{coach}</option>)}
                    <option value="other">Other coach</option>
                  </select>
                </Field>
                {details.coach === "other" && <Field label="Coach’s name"><input value={details.otherCoach} onChange={(event) => update("otherCoach", event.target.value)} /></Field>}
                <Field label="Durbanville Golf Club membership" required>
                  <select value={details.dgcStatus} onChange={(event) => update("dgcStatus", event.target.value as Details["dgcStatus"])}>
                    <option value="">Select membership status</option>
                    <option value="not_member">The player is not a DGC member</option>
                    <option value="member">The player is a DGC member</option>
                  </select>
                </Field>
                {details.dgcStatus === "member" && <Field label="DGC membership number"><input value={details.dgcNumber} onChange={(event) => update("dgcNumber", event.target.value)} /></Field>}
                <Field label={`Registered ${oomSeason.year} Junior Academy member (JAM)`} required>
                  <select value={details.jamStatus} onChange={(event) => update("jamStatus", event.target.value as Details["jamStatus"])}>
                    <option value="">Select membership status</option>
                    <option value="yes">Yes — R35 per round</option>
                    <option value="no">No — R80 per round</option>
                  </select>
                </Field>
                {details.jamStatus === "yes" && <Field label="Junior Academy membership number"><input value={details.jamNumber} onChange={(event) => update("jamNumber", event.target.value)} /></Field>}
                <Field label="Player social media"><input value={details.socialMedia} onChange={(event) => update("socialMedia", event.target.value)} placeholder="Optional handle or profile" /></Field>
                <Field label="Player picture for the leaderboard">
                  <span className="oom-file-field"><Upload size={17} /><span>{details.leaderboardPhoto?.name ?? "Choose an image"}</span><input type="file" accept="image/*" onChange={(event) => update("leaderboardPhoto", event.target.files?.[0] ?? null)} /></span>
                </Field>
              </div>
              <Field label="Accommodations required"><textarea rows={3} value={details.support} onChange={(event) => update("support", event.target.value)} placeholder="Medical, accessibility or other support information, if applicable" /></Field>
              <FormActions back={() => setStep(0)} next={() => setStep(2)} nextDisabled={!eligibilityComplete} />
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend>Choose rounds by term</legend>
              <p>All published 2026 dates are shown. Closed, cancelled and fully booked rounds cannot be selected.</p>
              {terms.map((term) => {
                const termRounds = oomRounds.filter((item) => item.term === term);
                const availableInTerm = termRounds.filter((item) => item.status === "open" && division && item.capacity[division] - item.confirmed[division] > 0);
                return (
                  <section className="oom-round-picker" key={term}>
                    <div><h3>Term {term}</h3><button type="button" className="text-link" disabled={!availableInTerm.length} onClick={() => selectWholeTerm(term)}>Select available dates</button></div>
                    <div className="oom-round-picker-list">
                      {termRounds.map((item) => {
                        const hasCapacity = Boolean(division && item.capacity[division] - item.confirmed[division] > 0);
                        const disabled = item.status !== "open" || !hasCapacity;
                        return <label key={item.id} className={`${selectedRoundIds.includes(item.id) ? "is-selected" : ""}${disabled ? " is-disabled" : ""}`}><input type="checkbox" checked={selectedRoundIds.includes(item.id)} disabled={disabled} onChange={() => toggleRound(item.id)} /><span><strong>{formatOomDate(item.date, { weekday: "short", day: "numeric", month: "short" })}</strong><small>{item.nine} · {availabilityLabel(item, division)}</small></span><b>{disabled ? "—" : formatRand(pricing.price)}</b></label>;
                      })}
                    </div>
                  </section>
                );
              })}
              <FormActions back={() => setStep(1)} next={() => setStep(3)} nextDisabled={!selectedRoundIds.length} />
            </fieldset>
          )}

          {step === 3 && (
            <fieldset>
              <legend>Review and consent</legend>
              <p>Check the player, division and selected rounds before proceeding to payment.</p>
              <div className="oom-review-summary">
                <div><span>Player</span><strong>{details.playerKnownAs || details.playerFirstName} {details.playerSurname}</strong></div>
                <div><span>Division</span><strong>{getOomDivision(division || "standard").name}</strong></div>
                <div><span>Rounds</span><strong>{chosenRounds.length}</strong></div>
                <div><span>Rate</span><strong>{formatRand(pricing.price)} per round</strong></div>
              </div>
              <label className="oom-checkbox-row"><input type="checkbox" checked={privacyConsent} onChange={(event) => setPrivacyConsent(event.target.checked)} /><span>I consent to Pure Motion contacting me about this registration and acknowledge that photographs and videos may be taken at events for promotional purposes, subject to the <Link href="https://puremotiongolf.com/privacy-policy/" target="_blank">Privacy Policy</Link>.</span></label>
              <label className="oom-checkbox-row"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span>I have read and accept the <Link href="#competition-terms">Order of Merit terms</Link>, payment and cancellation conditions, competition rules, risk acknowledgement, waiver and indemnity.</span></label>
              <div className="oom-form-notice"><ShieldCheck size={19} /><div><strong>Continue to secure payment.</strong><p>You’ll be taken to Yoco checkout next. Your details are saved as awaiting payment, with places held for 12 hours. Registration is confirmed only after live payment is verified; test payments do not confirm places.</p></div></div>
              {submissionError && <div className="oom-form-notice is-error" role="alert"><Info size={19} /><div><strong>Registration not submitted.</strong><p>{submissionError}</p></div></div>}
              <FormActions back={() => setStep(2)} next={submitRegistration} nextLabel={isSubmitting ? "Saving registration…" : "Continue to payment"} nextDisabled={!privacyConsent || !accepted || isSubmitting} />
            </fieldset>
          )}
        </form>

        <aside className="oom-registration-summary">
          <h2>Registration summary</h2>
          <dl>
            <div><dt>Division</dt><dd>{division ? getOomDivision(division).shortName : "Not selected"}</dd></div>
            <div><dt>Membership rate</dt><dd>{details.jamStatus === "yes" ? "JAM" : details.jamStatus === "no" ? "Standard" : "Not selected"}</dd></div>
            <div><dt>Selected rounds</dt><dd>{chosenRounds.length}</dd></div>
            <div><dt>Subtotal</dt><dd>{formatRand(pricing.subtotal)}</dd></div>
            <div><dt>Full-term discount</dt><dd>−{formatRand(pricing.discount)}</dd></div>
          </dl>
          <div className="oom-registration-total"><span>Calculated total</span><strong>{formatRand(pricing.total)}</strong></div>
          <p>Complete payment within 12 hours to keep the selected places. A saved registration is not a payment confirmation.</p>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="oom-field"><span>{label}{required && <b> *</b>}</span>{children}</label>;
}

function CheckboxGroup({ label, required = false, values, options, onChange }: { label: string; required?: boolean; values: string[]; options: readonly string[]; onChange: (value: string) => void }) {
  return <div className="oom-checkbox-group"><span>{label}{required && <b> *</b>}</span><div>{options.map((option) => <label key={option}><input type="checkbox" checked={values.includes(option)} onChange={() => onChange(option)} /><span>{option}</span></label>)}</div></div>;
}

function ChoiceGroup({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return <div className="oom-choice-group"><span>{label}</span><div>{options.map(([optionValue, optionLabel]) => <label key={optionValue} className={value === optionValue ? "is-selected" : ""}><input type="radio" checked={value === optionValue} onChange={() => onChange(optionValue)} /><span>{optionLabel}</span></label>)}</div></div>;
}

function FormActions({ back, next, nextDisabled = false, nextLabel = "Continue" }: { back?: () => void; next: () => void; nextDisabled?: boolean; nextLabel?: string }) {
  return <div className="oom-register-actions">{back ? <button type="button" className="button button-outline" onClick={back}><ArrowLeft size={17} />Back</button> : <span />}<button type="button" className="button" onClick={next} disabled={nextDisabled}>{nextLabel}<ArrowRight size={17} /></button></div>;
}
