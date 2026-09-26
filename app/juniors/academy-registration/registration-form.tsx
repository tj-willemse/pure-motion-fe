"use client";

import { FormEvent, ReactNode, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { submitAcademyRegistration } from "./actions";

const registrationTypes = [
  ["returning", "Returning — has a Junior Academy membership and JAM number"],
  ["assessed", "New — recently completed the required PMGA assessment"],
  ["waived", "New — assessment was waived by PMGA"],
  ["not-assessed", "New — has not completed the required assessment"],
  ["re-enrollment", "Re-enrolment — cancelled earlier in 2026 and is returning"],
] as const;

const joiningMonths = [
  ["January 2026", 33500], ["February 2026", 31193], ["March 2026", 28887],
  ["April 2026", 26580], ["May 2026", 24274], ["June 2026", 21967],
  ["July 2026", 19661], ["August 2026", 17354], ["September 2026", 15047],
  ["October 2026", 12741], ["November 2026", 10434], ["December 2026", 8128],
] as const;

const programmeOptions = [
  ["grassroots", "Grassroots Groups (4–6 years) — weekly 30-minute lessons at R160.61"],
  ["group-7", "Youth Groups (7+ years) — weekly 55-minute lessons at R241.81"],
  ["individual", "Youth Individual — weekly 30-minute lessons at R259.05"],
  ["individual-doubles", "Youth Individual Doubles — two weekly 30-minute lessons at R259.05 each"],
  ["family-sharing", "Family Sharing for two — weekly 30-minute lessons at R310.86"],
  ["group-and-individual", "Youth Group (7+) and Individual lessons — R500.86 per week"],
  ["not-sure", "Not sure yet — please contact me to discuss options"],
] as const;

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Not sure yet"];
const coaches = [
  "Chanrie Losper (Hazendal)", "Christiaan Basson (Durbanville)",
  "Leandri van Rooyen (Durbanville)", "Luzelle Booyens (Durbanville)",
  "Matthew Kilfoil (Durbanville)", "MS Calitz (Hazendal)",
  "Ludwig Coetzer (both locations)", "New coach", "No preference",
];

type RegistrationType = typeof registrationTypes[number][0] | "";

export function AcademyRegistrationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [registrationType, setRegistrationType] = useState<RegistrationType>("");
  const [step, setStep] = useState(0);
  const [programme, setProgramme] = useState("");
  const [dgcMember, setDgcMember] = useState("");
  const [joiningMonth, setJoiningMonth] = useState("");
  const isReEnrollment = registrationType === "re-enrollment";
  const needsAssessment = registrationType === "not-assessed";
  const steps = isReEnrollment
    ? ["Welcome", "Re-enrolment", "Review"]
    : ["Welcome", "Parent info", "Location", "Contacts", "Billing", "Junior", "Review"];
  const amountDue = joiningMonths.find(([month]) => month === joiningMonth)?.[1] ?? 0;

  function nextStep(event: FormEvent) {
    event.preventDefault();
    const panel = formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const controls = [...(panel?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea") ?? [])];
    const heardAbout = controls.filter((control) => control.getAttribute("name") === "heard_about") as HTMLInputElement[];
    if (heardAbout.length && !heardAbout.some((control) => control.checked)) {
      heardAbout[0].setCustomValidity("Select at least one option.");
      heardAbout[0].reportValidity();
      heardAbout[0].setCustomValidity("");
      return;
    }
    const invalid = controls.find((control) => !control.checkValidity());
    if (invalid) return invalid.reportValidity();
    setStep((value) => Math.min(value + 1, steps.length - 1));
    window.scrollTo({ top: formRef.current?.offsetTop ? formRef.current.offsetTop - 120 : 0, behavior: "smooth" });
  }

  return (
    <form ref={formRef} action={submitAcademyRegistration} className="academy-registration-form">
      <input className="academy-form-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="amount_due_cents" value={amountDue} />

      <nav className={`academy-form-steps${isReEnrollment ? " compact" : ""}`} aria-label="Registration progress">
        {steps.map((label, index) => (
          <button key={label} type="button" className={index === step ? "active" : index < step ? "complete" : ""} onClick={() => index <= step && setStep(index)} disabled={index > step}>
            <span>{index < step ? <Check size={15} aria-hidden="true" /> : index + 1}</span>{label}
          </button>
        ))}
      </nav>

      <div className="academy-form-card">
        <fieldset data-step="0" className={step === 0 ? "academy-form-panel active" : "academy-form-panel"}>
          <legend>Welcome to the 2026 Junior Academy</legend>
          <p className="academy-form-lead">Welcome back, 2025 JAMmers—and a warm welcome to first-time families. Select the option that applies to this junior.</p>
          <div className="academy-choice-list">
            {registrationTypes.map(([value, label]) => (
              <label key={value} className={registrationType === value ? "selected" : ""}>
                <input name="registration_type" type="radio" value={value} checked={registrationType === value} onChange={() => { setRegistrationType(value); setStep(0); }} required={step === 0} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {registrationType === "returning" && <Field label="Junior JAM number" hint="Add a zero at the end if you have a five-digit JAM number." required><input name="jam_number" required={step === 0} /></Field>}
          {needsAssessment && (
            <div className="academy-form-assessment-callout">
              <strong>An assessment is required before registration.</strong>
              <p>New members must have a recent assessment by a PMGA coach, unless the academy has specifically waived it.</p>
              <Link className="button button-small" href="/book?service=junior-assessment">Book a free assessment <ArrowRight size={17} /></Link>
            </div>
          )}
          <FormNavigation next={nextStep} disableNext={!registrationType || needsAssessment} />
        </fieldset>

        {!isReEnrollment && (
          <>
            <fieldset data-step="1" className={step === 1 ? "academy-form-panel active" : "academy-form-panel"}>
              <legend>Parent or guardian details</legend>
              <CheckboxGroup label="How did you hear about the Junior Academy?" name="heard_about" options={["Previous member", "Internet search", "Email from Pure Motion", "Durbanville Golf Club", "Hazendal Golf, Stellenbosch", "Instagram", "Facebook", "Friends or family", "A Pure Motion coach", "Brochure", "Other"]} required={step === 1} />
              <div className="academy-form-grid two">
                <Field label="First name" required><input name="parent_first_name" required={step === 1} autoComplete="given-name" /></Field>
                <Field label="Surname" required><input name="parent_last_name" required={step === 1} autoComplete="family-name" /></Field>
              </div>
              <Field label="Email address" required><input name="parent_email" type="email" required={step === 1} autoComplete="email" /></Field>
              <Field label="Relationship to child" required><input name="parent_relationship" required={step === 1} placeholder="Mom, dad, guardian…" /></Field>
              <div className="academy-form-grid two">
                <Field label="Mobile number for calls" required hint="Example: +27 0##-###-####"><input name="parent_phone" type="tel" required={step === 1} autoComplete="tel" /></Field>
                <Field label="WhatsApp number if different"><input name="parent_whatsapp" type="tel" /></Field>
              </div>
              <div className="academy-form-grid two">
                <Field label="Alternate contact name" required><input name="alternate_contact_name" required={step === 1} /></Field>
                <Field label="Alternate contact number" required><input name="alternate_contact_phone" type="tel" required={step === 1} /></Field>
              </div>
              <FormNavigation back={() => setStep(0)} next={nextStep} />
            </fieldset>

            <fieldset data-step="2" className={step === 2 ? "academy-form-panel active" : "academy-form-panel"}>
              <legend>Location and membership fee</legend>
              <RadioGroup label="Where will your child take lessons?" name="location" options={[["durbanville", "Durbanville Golf Club"], ["hazendal", "Hazendal Golf, Stellenbosch"], ["either", "Either location is suitable"]]} required={step === 2} />
              <Field label="When will they be joining?" required hint="The annual R335 membership fee is charged pro-rata after January.">
                <select name="joining_month" value={joiningMonth} onChange={(event) => setJoiningMonth(event.target.value)} required={step === 2}>
                  <option value="">Select a month</option>
                  {joiningMonths.map(([month, cents]) => <option key={month} value={month}>{month} — R{(cents / 100).toFixed(2)}</option>)}
                </select>
              </Field>
              {joiningMonth && <div className="academy-form-total"><span>Membership fee due</span><strong>R{(amountDue / 100).toFixed(2)}</strong></div>}
              <FormNavigation back={() => setStep(1)} next={nextStep} />
            </fieldset>

            <fieldset data-step="3" className={step === 3 ? "academy-form-panel active" : "academy-form-panel"}>
              <legend>Additional contacts</legend>
              <p className="academy-form-lead">Add people who may bring the child to golf if they are different from the parent or guardian.</p>
              <ContactFields number="1" />
              <ContactFields number="2" />
              <FormNavigation back={() => setStep(2)} next={nextStep} />
            </fieldset>

            <fieldset data-step="4" className={step === 4 ? "academy-form-panel active" : "academy-form-panel"}>
              <legend>Billing details</legend>
              <Field label="Full physical billing address" required hint="Include the postal code."><textarea name="billing_address" required={step === 4} rows={3} autoComplete="street-address" /></Field>
              <div className="academy-form-grid two">
                <Field label="Billing first name" required><input name="billing_first_name" required={step === 4} /></Field>
                <Field label="Billing surname" required><input name="billing_last_name" required={step === 4} /></Field>
              </div>
              <Field label="Billing email address" required><input name="billing_email" type="email" required={step === 4} /></Field>
              <div className="academy-form-grid two">
                <Field label="Billing WhatsApp number" required><input name="billing_whatsapp" type="tel" required={step === 4} /></Field>
                <Field label="Billing number for calls if different"><input name="billing_phone" type="tel" /></Field>
              </div>
              <FormNavigation back={() => setStep(3)} next={nextStep} />
            </fieldset>

            <fieldset data-step="5" className={step === 5 ? "academy-form-panel active" : "academy-form-panel"}>
              <legend>Junior and programme details</legend>
              <p className="academy-form-lead">Complete one form per child. Programme and schedule selections are preferences; the academy team will confirm availability.</p>
              <div className="academy-form-grid three">
                <Field label="First name" required><input name="junior_first_name" required={step === 5} /></Field>
                <Field label="Known as / nickname"><input name="junior_nickname" /></Field>
                <Field label="Surname" required><input name="junior_last_name" required={step === 5} /></Field>
              </div>
              <div className="academy-form-grid three">
                <Field label="Gender" required><select name="junior_gender" required={step === 5}><option value="">Select</option><option>Girl</option><option>Boy</option></select></Field>
                <Field label="Date of birth" required><input name="junior_date_of_birth" type="date" required={step === 5} /></Field>
                <Field label="Current age" required><input name="junior_age" type="number" min="4" max="18" required={step === 5} /></Field>
              </div>
              <div className="academy-form-grid two">
                <Field label="School" required><input name="junior_school" required={step === 5} /></Field>
                <Field label="Grade" required><input name="junior_grade" required={step === 5} /></Field>
              </div>
              <RadioGroup label="Preferred programme" name="programme" options={programmeOptions} required={step === 5} value={programme} onChange={setProgramme} />
              {programme === "family-sharing" && <div className="academy-form-grid two"><Field label="Other child’s name" required><input name="family_child_name" required={step === 5} /></Field><Field label="Other child’s age" required><input name="family_child_age" type="number" min="4" max="18" required={step === 5} /></Field></div>}
              {programme === "grassroots" && <ScheduleFields prefix="grassroots" active={step === 5} label="Grassroots" />}
              {programme === "group-7" && <ScheduleFields prefix="group" active={step === 5} label="Group 7+" />}
              {["individual", "individual-doubles", "family-sharing"].includes(programme) && <ScheduleFields prefix="individual" active={step === 5} label="Individual or Family Sharing" />}
              {programme === "group-and-individual" && <><ScheduleFields prefix="group" active={step === 5} label="Group 7+" /><ScheduleFields prefix="individual" active={step === 5} label="Individual" /></>}
              <Field label="Preferred coach" required hint="A preference does not guarantee the same coach, day or timeslot."><select name="coach" required={step === 5}><option value="">Select a coach</option>{coaches.map((coach) => <option key={coach}>{coach}</option>)}</select></Field>
              <Field label="Accommodations" hint="Share any physical, learning, language, allergy or emotional support needs."><textarea name="accommodations" rows={3} /></Field>
              <Field label="Scheduling considerations and comments"><textarea name="scheduling_comments" rows={4} /></Field>
              <RadioGroup label="Is the junior a Durbanville Golf Club member?" name="dgc_member" options={[["yes", "Yes"], ["no", "No"]]} required={step === 5} value={dgcMember} onChange={setDgcMember} />
              {dgcMember === "yes" ? <Field label="DGC membership number" required><input name="dgc_membership_number" required={step === 5} /></Field> : dgcMember === "no" ? <Field label="Other golf club name, if applicable"><input name="other_golf_club" /></Field> : null}
              <Field label="Official Handicap Index, if applicable"><input name="handicap_index" /></Field>
              <RadioGroup label="Previously participated in Order of Merit?" name="previous_order_of_merit" options={[["yes", "Yes"], ["no", "No"], ["unaware", "Not aware of Order of Merit"]]} required={step === 5} />
              <RadioGroup label="Previously participated in a Holiday Programme?" name="previous_holiday_programme" options={[["yes", "Yes"], ["no", "No"], ["unaware", "Not aware of Holiday Programmes"]]} required={step === 5} />
              <RadioGroup label="Previously participated in AIM Series events?" name="previous_aim_series" options={[["yes", "Yes"], ["no", "No"], ["unaware", "Not aware of AIM Series"]]} required={step === 5} />
              <FormNavigation back={() => setStep(4)} next={nextStep} />
            </fieldset>
          </>
        )}

        {isReEnrollment && (
          <fieldset data-step="1" className={step === 1 ? "academy-form-panel active" : "academy-form-panel"}>
            <legend>Re-enrolment details</legend>
            <div className="academy-form-grid two"><Field label="Parent/guardian first name" required><input name="parent_first_name" required={step === 1} /></Field><Field label="Parent/guardian surname" required><input name="parent_last_name" required={step === 1} /></Field></div>
            <Field label="Parent/guardian email" required><input name="parent_email" type="email" required={step === 1} /></Field>
            <div className="academy-form-grid two"><Field label="Relationship to child" required><input name="parent_relationship" required={step === 1} /></Field><Field label="Mobile number" required><input name="parent_phone" type="tel" required={step === 1} /></Field></div>
            <div className="academy-form-grid two"><Field label="Junior first name" required><input name="junior_first_name" required={step === 1} /></Field><Field label="Junior surname" required><input name="junior_last_name" required={step === 1} /></Field></div>
            <RadioGroup label="Previous programme" name="previous_programme" options={programmeOptions.slice(0, 6)} required={step === 1} />
            <Field label="Previous coach" required><select name="previous_coach" required={step === 1}><option value="">Select a coach</option>{["Christiaan Basson (Hazendal)", "Jurian Mostert (Hazendal)", "Leandri van Rooyen (Durbanville)", "Luzelle Booyens (Durbanville)", "Matthew Kilfoil (Durbanville)", "MS Calitz (Hazendal)", "Paul McKenzie (Durbanville)"].map((coach) => <option key={coach}>{coach}</option>)}</select></Field>
            <ScheduleFields prefix="previous" active={step === 1} label="Previous lesson" />
            <Field label="Preferred re-enrolment start date" required hint="Subject to availability."><input name="preferred_start_date" type="date" required={step === 1} /></Field>
            <Field label="Scheduling considerations and comments" required hint="List all days and times when your junior is available."><textarea name="scheduling_comments" rows={4} required={step === 1} /></Field>
            <FormNavigation back={() => setStep(0)} next={nextStep} />
          </fieldset>
        )}

        <fieldset data-step={steps.length - 1} className={step === steps.length - 1 ? "academy-form-panel active" : "academy-form-panel"}>
          <legend>Review and submit</legend>
          <div className="academy-review-card"><ShieldCheck size={25} aria-hidden="true" /><div><strong>Your details are protected.</strong><p>The academy uses this information to arrange the requested programme, billing and essential communications.</p></div></div>
          {!isReEnrollment && <div className="academy-form-total"><span>2026 membership fee due</span><strong>R{(amountDue / 100).toFixed(2)}</strong></div>}
          <p>Once submitted, the academy team will confirm the programme and schedule. Payment instructions are provided separately while the new online payment handoff is being connected.</p>
          <label className="academy-consent"><input name="consent" type="checkbox" value="accepted" required={step === steps.length - 1} /><span>I have read and agree to the <Link href="/juniors/academy-terms" target="_blank">Junior Academy Terms and Conditions</Link> and <a href="https://puremotiongolf.com/privacy-policy/" target="_blank" rel="noreferrer">Privacy Policy</a>, consent to PMGA contacting me about the requested services, and acknowledge that photographs and videos may be taken at academy events for promotional use.</span></label>
          <div className="academy-form-actions"><button type="button" className="button button-outline" onClick={() => setStep(step - 1)}><ArrowLeft size={17} /> Back</button><button type="submit" className="button">Submit registration <ArrowRight size={17} /></button></div>
        </fieldset>
      </div>
    </form>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return <label className="academy-form-field"><span>{label}{required && <b aria-hidden="true"> *</b>}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function RadioGroup({ label, name, options, required, value, onChange }: { label: string; name: string; options: readonly (readonly [string, string])[]; required?: boolean; value?: string; onChange?: (value: string) => void }) {
  return <div className="academy-form-group"><span>{label}{required && <b aria-hidden="true"> *</b>}</span><div className="academy-choice-list compact">{options.map(([optionValue, optionLabel]) => <label key={optionValue} className={value === optionValue ? "selected" : ""}><input type="radio" name={name} value={optionValue} checked={value === undefined ? undefined : value === optionValue} onChange={() => onChange?.(optionValue)} required={required} /><span>{optionLabel}</span></label>)}</div></div>;
}

function CheckboxGroup({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return <div className="academy-form-group"><span>{label}{required && <b aria-hidden="true"> *</b>}</span><div className="academy-checkbox-grid">{options.map((option) => <label key={option}><input type="checkbox" name={name} value={option} /><span>{option}</span></label>)}</div></div>;
}

function ContactFields({ number }: { number: string }) {
  return <div className="academy-contact-block"><h3>Additional contact {number}</h3><div className="academy-form-grid two"><Field label="Name and surname"><input name={`contact_${number}_name`} /></Field><Field label="Relationship to child"><input name={`contact_${number}_relationship`} /></Field><Field label="Mobile number for calls"><input name={`contact_${number}_phone`} type="tel" /></Field><Field label="WhatsApp number if different"><input name={`contact_${number}_whatsapp`} type="tel" /></Field></div></div>;
}

function ScheduleFields({ prefix, active, label }: { prefix: string; active: boolean; label: string }) {
  return <div className="academy-form-grid two"><Field label={`${label} preferred day`} required><select name={`${prefix}_preferred_day`} required={active}><option value="">Select a day</option>{days.map((day) => <option key={day}>{day}</option>)}</select></Field><Field label={`${label} preferred time`} required><input name={`${prefix}_preferred_time`} type="time" required={active} /></Field></div>;
}

function FormNavigation({ back, next, disableNext = false }: { back?: () => void; next: (event: FormEvent) => void; disableNext?: boolean }) {
  return <div className="academy-form-actions">{back ? <button type="button" className="button button-outline" onClick={back}><ArrowLeft size={17} /> Back</button> : <span />}<button type="button" className="button" onClick={next} disabled={disableNext}>Continue <ArrowRight size={17} /></button></div>;
}
