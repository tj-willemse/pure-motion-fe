import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  ShieldCheck,
} from "lucide-react";
import {
  academyRates,
  academySchedules,
  registrationChecklist,
} from "@/lib/junior-academy-terms";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Junior Academy Fees, Schedules and Terms",
  description:
    "2026 Pure Motion Junior Academy membership, programme fees, monthly billing schedules, attendance rules, safeguarding and registration terms.",
  alternates: { canonical: "/juniors/academy-terms" },
  openGraph: {
    title: "Junior Academy Fees, Schedules and Terms | Pure Motion Golf",
    description:
      "Membership, programme rates, monthly schedules and complete 2026 Junior Academy terms.",
    url: `${siteUrl}/juniors/academy-terms`,
    images: [
      {
        url: "/images/home/juniors-hero.webp",
        width: 1200,
        height: 720,
        alt: "Junior golfers walking together on the golf course",
      },
    ],
  },
};

const formatRand = (value: number) => `R${value.toFixed(2)}`;

const programmes = [
  {
    name: "Grassroots",
    session: "30-minute sessions",
    detail: "Groups run during public school terms. Monthly lesson totals vary from two to five.",
    opening: academyRates.opening.grassroots,
    current: academyRates.current.grassroots,
  },
  {
    name: "Groups 7+",
    session: "55-minute sessions",
    detail: "Groups run during public school terms. Monthly lesson totals vary from two to five.",
    opening: academyRates.opening.group,
    current: academyRates.current.group,
  },
  {
    name: "Individual",
    session: "30-minute sessions",
    detail: "Lessons run during public school terms. Monthly lesson totals vary from two to five.",
    opening: academyRates.opening.individual,
    current: academyRates.current.individual,
  },
  {
    name: "Family Sharing",
    session: "Shared individual lessons",
    detail:
      "Up to three assessed siblings of a similar age or skill level may share. The first child pays the individual rate and each additional child pays 20%.",
    opening: academyRates.opening.individual,
    current: academyRates.current.individual,
    secondary: `Each additional child: ${formatRand(academyRates.current.individual * 0.2)}`,
  },
  {
    name: "Specialised",
    session: "Four 30-minute lessons each month",
    detail:
      "Lessons run during public school terms. Coaches arrange four sessions each month around the child’s schedule.",
    current: 1667,
    secondary: "Fixed monthly rate · January to December 2026",
  },
] as const;

function TermsBlock({
  id,
  title,
  children,
  open = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="academy-terms-disclosure" id={id} open={open}>
      <summary>
        <span>{title}</span>
        <ChevronDown size={19} aria-hidden="true" />
      </summary>
      <div className="academy-terms-disclosure-body">{children}</div>
    </details>
  );
}

export default function JuniorAcademyTermsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Junior Academy Fees, Schedules and Terms",
    url: `${siteUrl}/juniors/academy-terms`,
    dateModified: "2026-07-18",
    isPartOf: {
      "@type": "WebSite",
      name: "Pure Motion Golf Academy",
      url: siteUrl,
    },
  };

  return (
    <main id="main-content" className="academy-terms-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="academy-terms-hero">
        <div className="site-shell academy-terms-hero-grid">
          <div>
            <span className="academy-terms-kicker">Junior Academy · 2026</span>
            <h1>Fees, schedules<br />and terms.</h1>
            <p>
              Membership requirements, programme rates, monthly lesson schedules and the
              complete conditions for joining Pure Motion Junior Academy.
            </p>
          </div>
          <aside className="academy-terms-hero-card">
            <small>Annual membership</small>
            <strong>R335</strong>
            <span>per child · January to December 2026</span>
            <p>Pro-rata membership fees apply when joining after January.</p>
          </aside>
        </div>
      </section>

      <nav className="academy-terms-index" aria-label="On this page">
        <div className="site-shell">
          <span>On this page</span>
          <a href="#membership">Membership</a>
          <a href="#programme-fees">Programme fees</a>
          <a href="#monthly-schedules">Monthly schedules</a>
          <a href="#academy-conditions">Terms and conditions</a>
          <a href="#academy-registration">Registration</a>
        </div>
      </nav>

      <section className="section academy-membership-section" id="membership">
        <div className="site-shell academy-terms-reading-grid">
          <div className="academy-terms-section-label">
            <span>01</span>
            <h2>Membership</h2>
          </div>
          <div className="academy-terms-prose">
            <p className="academy-terms-lead">
              Junior Academy membership costs <strong>R335 per child</strong> for January to
              December 2026. The annual fee is non-refundable, with pro-rata fees available for
              registrations after January.
            </p>
            <p>
              To qualify, a junior must participate in Grassroots, Groups 7+, Individual or
              Individual Family Sharing. Private lesson packages are not Junior Academy programmes
              and do not include Junior Academy benefits or discounted OOM, Holiday Programme and
              AIM rates.
            </p>
            <div className="academy-terms-callout">
              <CircleAlert size={22} aria-hidden="true" />
              <p>
                Families needing flexible lesson dates or costs should consider a private junior
                package instead of an annual academy programme.
              </p>
            </div>
            <ul className="academy-terms-checklist">
              <li><Check size={17} />Membership ends on 31 December each year.</li>
              <li><Check size={17} />The upper age limit is 18: a child may be 17 turning 18, but not 18 turning 19 in the membership year.</li>
              <li><Check size={17} />Lesson fees include balls, clubs and training aids needed during the session.</li>
              <li><Check size={17} />Lessons and billing follow public school terms, not private school terms.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section academy-fees-section" id="programme-fees">
        <div className="site-shell">
          <div className="academy-terms-section-head">
            <div><span>02</span><h2>Programme fees</h2></div>
            <p>Current rates apply from March 2026. Programme lessons are billed monthly in advance.</p>
          </div>
          <div className="academy-programme-fee-grid">
            {programmes.map((programme) => (
              <article key={programme.name}>
                <span>{programme.session}</span>
                <h3>{programme.name}</h3>
                <p>{programme.detail}</p>
                <div className="academy-programme-price">
                  <small>{programme.name === "Specialised" ? "Monthly" : "Current rate per lesson"}</small>
                  <strong>{formatRand(programme.current)}</strong>
                </div>
                {"opening" in programme && programme.opening ? (
                  <small className="academy-previous-rate">January–February rate: {formatRand(programme.opening)}</small>
                ) : null}
                {"secondary" in programme && programme.secondary ? (
                  <small className="academy-secondary-rate">{programme.secondary}</small>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section academy-schedules-section" id="monthly-schedules">
        <div className="site-shell">
          <div className="academy-terms-section-head is-light">
            <div><span>03</span><h2>Monthly billing schedules</h2></div>
            <p>
              These are the minimum scheduled sessions for 2026. Additional lessons are added at
              month end. Dates may change because of public holidays, weather or scheduling needs.
            </p>
          </div>
          <div className="academy-schedule-note">
            <CalendarDays size={21} aria-hidden="true" />
            <p>Amounts are calculated from the published per-lesson rate and the number of scheduled sessions.</p>
          </div>
          <div className="academy-schedule-list">
            {academySchedules.map((schedule, index) => {
              const rate = academyRates[schedule.rate];
              return (
                <details key={schedule.title} open={index === 0}>
                  <summary>
                    <span>{schedule.title}</span>
                    <ChevronDown size={19} aria-hidden="true" />
                  </summary>
                  <div className="academy-schedule-panel">
                    {schedule.note ? <p>{schedule.note}</p> : null}
                    <div className="academy-schedule-table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Day</th><th>Sessions</th><th>Dates</th><th>Grassroots</th>
                            <th>Groups 7+</th><th>Individual</th><th>Family sharing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.rows.map(([day, sessions, dates]) => (
                            <tr key={day}>
                              <th scope="row">{day}</th>
                              <td>{sessions}</td>
                              <td>{dates}</td>
                              <td>{formatRand(rate.grassroots * sessions)}</td>
                              <td>{formatRand(rate.group * sessions)}</td>
                              <td>{formatRand(rate.individual * sessions)}</td>
                              <td>{formatRand(rate.family * sessions)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section academy-conditions-section" id="academy-conditions">
        <div className="site-shell academy-terms-reading-grid">
          <div className="academy-terms-section-label">
            <span>04</span>
            <h2>Terms and conditions</h2>
            <p>Last updated 18 July 2026</p>
          </div>
          <div className="academy-terms-disclosures">
            <TermsBlock id="safeguarding" title="Safety and safeguarding" open>
              <p>
                Pure Motion Golf Academy takes junior safety seriously, and its coaches are
                Guardian Certified. Parents and the academy work together to keep juniors safer.
              </p>
              <ul>
                <li>Parents of juniors under 16 must hand their child over to the coach—or to the office if the coach is teaching—and collect them after the lesson.</li>
                <li>Add the office number, <a href="https://wa.me/27762470501" target="_blank" rel="noreferrer">+27 76 247 0501</a>, so the academy can be told if collection will be late.</li>
                <li>Include all medical, accessibility or other information the academy needs when enrolling the child.</li>
              </ul>
            </TermsBlock>

            <TermsBlock id="fees-and-penalties" title="Registration, fees and penalties">
              <ul>
                <li>Membership runs from January to December and ends on 31 December.</li>
                <li>The R335 annual membership fee is non-refundable. Pro-rata membership fees are available after January.</li>
                <li>When joining mid-month, the full joining-month membership fee is due, but only lessons remaining from the joining date are charged. Those lessons are charged within three days of joining.</li>
                <li>Programmes follow public school terms. No JAM lessons are scheduled during public school holidays.</li>
                <li>Additional individual lessons during school holidays may be arranged with the coach and are charged at JAM rates.</li>
                <li>Monthly fees are billed in advance at the end of the month for the next month and are payable within seven days.</li>
                <li>A 5% fee is charged on overdue accounts.</li>
                <li>Families unable to commit to advance payment before the ninth of each month should consider a private Junior Package.</li>
              </ul>
            </TermsBlock>

            <TermsBlock id="missed-lessons" title="Late arrivals, missed lessons and schedule changes">
              <ul>
                <li>Juniors should arrive five to ten minutes early to check in and warm up. Late arrivals receive only the remaining lesson time.</li>
                <li>Non-emergency cancellations and missed lessons are forfeited and billed because the coach has committed the scheduled time.</li>
                <li>Injury, illness and other emergencies may be considered for rescheduling or credit where rescheduling is impossible.</li>
                <li>Written notice to <a href="mailto:juniors@puremotiongolf.com">juniors@puremotiongolf.com</a> is preferred. Parents may also contact the coach or call/WhatsApp the office.</li>
                <li>Substitute lessons cannot be accommodated for Grassroots or Groups 7+. Individual lessons may be rescheduled with adequate notice when coach availability allows, but this is not guaranteed.</li>
                <li>Give the coach 14 days’ notice for a programme, scheduled-day or scheduled-time change.</li>
              </ul>
            </TermsBlock>

            <TermsBlock id="weather-and-coaches" title="Weather and coach availability">
              <ul>
                <li>Where possible, lessons continue indoors during inclement weather. The coach will confirm arrangements on the morning of the lesson.</li>
                <li>If an indoor lesson is impossible, the academy will provide a replacement date. A weather-cancelled lesson is credited only when a replacement cannot be scheduled.</li>
                <li>If an individual coach is unavailable, the lesson is rescheduled.</li>
                <li>For groups, another qualified coach will teach wherever possible. If no replacement is available, the lesson is cancelled and credited.</li>
              </ul>
            </TermsBlock>

            <TermsBlock id="cancellations" title="Temporary and full cancellations">
              <ul>
                <li>For a one-calendar-month absence, such as exams, give at least one calendar month’s notice by emailing <a href="mailto:juniors@puremotiongolf.com">juniors@puremotiongolf.com</a>.</li>
                <li>The absent month is billed. If the child returns the following month, 50% of those lessons is credited.</li>
                <li>The academy cannot guarantee that the original day and time will remain available after a temporary cancellation.</li>
                <li>Re-enrolment in the same year waives the annual registration fee.</li>
                <li>Full cancellation requires one calendar month’s written notice. All lessons in the cancellation month remain payable.</li>
                <li>Notice submitted after the first day of a month runs for 30 days from the written-notice date.</li>
                <li>Maximum group sizes are four for Grassroots and six for Groups 7+. If a group drops below three, a junior may need to move to another available group after discussion with the coach.</li>
              </ul>
            </TermsBlock>

            <TermsBlock id="dress-code" title="Dress code and facility rules">
              <p>
                Children must wear closed shoes or takkies when attending lessons or playing at
                the club. T-shirts may be worn, but tracksuits are not permitted.
              </p>
            </TermsBlock>

            <TermsBlock id="default" title="Default and termination">
              <p>
                If a parent or legal guardian fails to pay fees, penalties or other amounts on time,
                or breaches this agreement, Pure Motion Golf Academy may provide seven calendar
                days’ written notice and terminate the agreement. Termination does not remove the
                academy’s right to recover amounts due, damages caused by the breach, legal costs,
                attorney-and-client costs or collection charges.
              </p>
            </TermsBlock>

            <TermsBlock id="indemnity" title="Undertaking, indemnity and privacy">
              <ul>
                <li>Registration creates a legally binding commitment to pay all fees and follow the academy’s rules and regulations.</li>
                <li>Golf carries risks including slips, stray balls or clubs, golf-cart incidents, lightning, power-line risks, animals and the actions of other people. Lessons and facility use are undertaken at the golfer’s own risk.</li>
                <li>The parent or guardian waives claims against Pure Motion Golf Academy for injury, loss or damage and indemnifies the academy, its owners, employees and contractors to the fullest extent permitted by law.</li>
                <li>Personal information is used to provide requested products and services. Photographs and videos may be taken at events for promotional use.</li>
                <li>Pure Motion Golf Academy reserves the right of admission and may terminate services at the Director of Golf’s discretion.</li>
              </ul>
              <p>
                Read the academy’s <a href="https://puremotiongolf.com/privacy-policy/" target="_blank" rel="noreferrer">Privacy Policy</a> for further information.
              </p>
            </TermsBlock>
          </div>
        </div>
      </section>

      <section className="section academy-registration-section" id="academy-registration">
        <div className="site-shell academy-registration-grid">
          <div>
            <span className="academy-terms-kicker">Junior Academy registration</span>
            <h2>Ready for the next step?</h2>
            <p>
              New juniors begin with a free assessment. Returning or recently assessed juniors can
              create their customer account now; Junior Academy programme registration is completed
              with the academy team.
            </p>
            <div className="academy-registration-actions">
              <Link href="/book?service=junior-assessment" className="button">
                Book a free assessment <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/register" className="text-link">
                Create an account <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <aside>
            <div><ShieldCheck size={24} aria-hidden="true" /><h3>Information needed to register</h3></div>
            <ul>
              {registrationChecklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
