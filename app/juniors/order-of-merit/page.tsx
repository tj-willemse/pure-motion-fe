import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  LockKeyhole,
  Flag,
  MapPin,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { OomRegistrationForm } from "./register/registration-form";
import { OomNavigation } from "@/components/order-of-merit/oom-navigation";
import { OomResultsExplorer } from "@/components/order-of-merit/oom-results-explorer";
import { OomTermsAccordion } from "@/components/order-of-merit/oom-terms-accordion";
import {
  formatOomDate,
  formatRand,
  getOomRoundsByTerm,
  oomDivisions,
  oomRounds,
  oomSeason,
  oomTermsSections,
  standardPoints,
} from "@/lib/order-of-merit";
import { siteUrl } from "@/lib/site";
import { registrationAccount } from "@/lib/registration-account";

export const metadata: Metadata = {
  title: "Junior Order of Merit",
  description:
    "Pure Motion Golf's nine-hole Tuesday Order of Merit competition for course-ready junior golfers aged 6 to 18.",
  alternates: { canonical: "/juniors/order-of-merit" },
  openGraph: {
    title: "Junior Order of Merit | Pure Motion Golf",
    description: "Competition experience, weekly results and an annual leaderboard for course-ready juniors.",
    url: `${siteUrl}/juniors/order-of-merit`,
    images: [{ url: "/images/home/juniors-hero.webp", width: 1200, height: 720 }],
  },
};

const nextRounds = oomRounds.filter((item) => item.status === "open").slice(0, 4);
const playableRounds = oomRounds.filter((item) => item.status !== "cancelled").length;

export default async function OrderOfMeritPage() {
  const account = await registrationAccount("/juniors/order-of-merit#registration", false);
  return (
    <main id="main-content" className="oom-page">
      <section className="oom-hero" id="overview">
        <Image
          src="/images/home/juniors-hero.webp"
          alt="Junior golfers walking together on a golf course"
          fill
          priority
          sizes="100vw"
        />
        <div className="oom-hero-overlay" />
        <div className="site-shell oom-hero-inner">
          <div>
            <h1>Junior golf,<br />played for real.</h1>
            <p>
              A nine-hole Tuesday competition where course-ready juniors learn the routines,
              responsibility and confidence that come with competitive golf.
            </p>
            <div className="oom-hero-actions">
              <Link className="button" href="#registration">
                Register for a round <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="button button-light" href="#dates">
                View dates and terms
              </Link>
            </div>
          </div>
          <dl className="oom-hero-facts">
            <div><dt>Players</dt><dd>{oomSeason.ageRange}</dd></div>
            <div><dt>When</dt><dd>Tuesdays during public-school terms</dd></div>
            <div><dt>Where</dt><dd>{oomSeason.venue}</dd></div>
            <div><dt>Entry</dt><dd>{formatRand(oomSeason.jamPriceCents)} JAM · {formatRand(oomSeason.standardPriceCents)} standard</dd></div>
          </dl>
        </div>
      </section>

      <OomNavigation />

      <section className="section oom-intro-section">
        <div className="site-shell oom-intro-grid">
          <div>
            <h2>A clear next step after coaching.</h2>
          </div>
          <div className="oom-rich-copy">
            <p className="oom-lead">
              Established in 2012, the Order of Merit is open to course-ready boys and girls
              from across the country. Golf-club membership and an official handicap are not
              required to begin.
            </p>
            <p>
              Registration opens on Wednesday and closes on Saturday before the following
              Tuesday round. Check-in runs from {oomSeason.checkIn}, with tee times beginning
              {oomSeason.firstTeeTime.toLowerCase()}.
            </p>
            <div className="oom-inline-facts">
              <span><CalendarDays size={18} />31 playable rounds in 2026</span>
              <span><MapPin size={18} />{oomSeason.address}</span>
              <span><Trophy size={18} />Weekly and annual results</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section oom-divisions-section">
        <div className="site-shell">
          <div className="oom-section-heading">
            <h2>Two ways into competition.</h2>
            <p>The right division is based on current on-course confidence—not age alone.</p>
          </div>
          <div className="oom-division-grid">
            {oomDivisions.map((division, index) => (
              <article key={division.id}>
                <div className="oom-division-number">0{index + 1}</div>
                <span>{division.format}</span>
                <h3>{division.name}</h3>
                <p>{division.summary}</p>
                <ul>
                  {division.rules.map((rule) => <li key={rule}><Check size={16} />{rule}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <aside className="oom-course-ready">
            <ShieldCheck size={29} aria-hidden="true" />
            <div>
              <h3>Is your junior course ready?</h3>
              <p>
                They should make regular ball contact, chip, complete a green in no more than four
                putts, keep pace, stand safely and understand basic tee and green etiquette.
              </p>
            </div>
            <Link className="text-link" href="/book?service=junior-assessment">
              Book an assessment <ArrowRight size={17} />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section oom-rounds-section">
        <div className="site-shell">
          <div className="oom-section-heading">
            <h2>Next rounds.</h2>
            <p>Capacity is managed separately for Standard and Kickstarter.</p>
          </div>
          <div className="oom-round-card-grid">
            {nextRounds.map((item) => (
              <article key={item.id}>
                <div><span>Term {item.term}</span><strong>{formatOomDate(item.date, { weekday: "short", day: "numeric", month: "short" })}</strong></div>
                <small>{item.nine}</small>
                <dl>
                  <div><dt>Standard</dt><dd>{item.capacity.standard - item.confirmed.standard > 0 ? "Available" : "Full"}</dd></div>
                  <div><dt>Kickstarter</dt><dd>{item.capacity.kickstarter - item.confirmed.kickstarter > 0 ? "Available" : "Full"}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <div className="oom-rounds-actions">
            <Link className="button" href="#registration">Choose rounds <ArrowRight size={18} /></Link>
            <Link className="text-link" href="#dates">See the full 2026 calendar <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="section oom-results-section" id="leaderboards">
        <div className="site-shell">
          <div className="oom-section-heading is-light">
            <h2>2026 leaderboards.</h2>
            <p>
              Annual running totals, Kickstarter graduates and the complete published
              Stableford round index in one results workspace.
            </p>
          </div>
          <OomResultsExplorer />
          <div className="oom-scoring-grid">
            <div>
              <Flag size={25} />
              <h3>Standard points</h3>
              <div className="oom-points-list">
                {standardPoints.map((item) => <span key={item.place}><small>{item.place}</small><strong>{item.points}</strong></span>)}
              </div>
            </div>
            <div>
              <CircleCheck size={25} />
              <h3>Annual prize qualification</h3>
              <p>
                Play at least {oomSeason.minimumPrizeRounds} rounds, including {oomSeason.requiredFrontNineRounds} front-nine and {oomSeason.requiredBackNineRounds} back-nine rounds.
                Categories include leaders, statistics, putting, most improved and sportsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section oom-calendar-section" id="dates">
        <div className="site-shell">
          <div className="oom-section-heading">
            <h2>{playableRounds} playable rounds.</h2>
            <p>
              JAM members pay {formatRand(oomSeason.jamPriceCents)} per round and standard entry is {formatRand(oomSeason.standardPriceCents)}.
              Whole-term or whole-season bookings receive a {oomSeason.termDiscountPercent}% discount.
            </p>
          </div>
          <div className="oom-term-calendar-grid">
            {([1, 2, 3, 4] as const).map((term) => {
              const rounds = getOomRoundsByTerm(term);
              const playable = rounds.filter((item) => item.status !== "cancelled");
              return (
                <article key={term}>
                  <div className="oom-term-calendar-head">
                    <div><span>Term {term}</span><strong>{playable.length} playable rounds</strong></div>
                    <small>{formatRand(Math.round(playable.length * oomSeason.standardPriceCents * 0.9))} standard</small>
                  </div>
                  <ul>
                    {rounds.map((item) => (
                      <li key={item.id} className={item.status === "cancelled" ? "is-cancelled" : ""}>
                        <span>{formatOomDate(item.date, { weekday: "short", day: "numeric", month: "short" })}</span>
                        <small>{item.nine}</small>
                        <strong>{item.status === "cancelled" ? "Cancelled" : item.status === "completed" ? "Played" : "Scheduled"}</strong>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section oom-booking-rules">
        <div className="site-shell oom-booking-rule-grid">
          <article><Clock size={24} /><h3>Registration window</h3><p>Opens Wednesday and closes Saturday before the following Tuesday round.</p></article>
          <article><CreditCard size={24} /><h3>Payment confirms entry</h3><p>A selection is held temporarily. The tee time is secured only after payment is received.</p></article>
          <article><CircleAlert size={24} /><h3>Division capacity</h3><p>Standard and Kickstarter are managed separately, so one division may fill before the other.</p></article>
          <article><CircleCheck size={24} /><h3>JAM price eligibility</h3><p>Membership must be active on the date of each selected round for the reduced price to apply.</p></article>
        </div>
      </section>

      <section className="section oom-full-terms" id="competition-terms">
        <div className="site-shell oom-terms-grid">
          <div>
            <h2>Competition terms.</h2>
            <p>Only one section opens at a time, keeping the rules readable on desktop and mobile.</p>
          </div>
          <OomTermsAccordion items={oomTermsSections} />
        </div>
      </section>

      <section className="oom-register-heading" id="registration">
        <div className="site-shell">
          <h2>Order of Merit registration.</h2>
          <p>Complete one registration per player. Select several rounds now or return for another round later.</p>
        </div>
      </section>
      <section className="section oom-register-section">
        <div className="site-shell">
          <div className={account ? undefined : "oom-registration-locked"}>
            <div inert={!account} aria-hidden={!account} className={account ? undefined : "oom-registration-preview"}>
              <OomRegistrationForm account={account ?? { firstName: "", lastName: "", email: "", phone: "", family: [] }} today={new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Johannesburg", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())} />
            </div>
            {!account && <section className="oom-registration-unlock" aria-labelledby="registration-unlock-title">
              <LockKeyhole size={28} aria-hidden="true" />
              <h3 id="registration-unlock-title">Sign in to register your junior.</h3>
              <p>Your registration and payment will be saved to your account. Children do not need their own login.</p>
              <div className="oom-registration-unlock-actions">
                <Link className="button" href="/login?next=%2Fjuniors%2Forder-of-merit%23registration">Sign in <ArrowRight size={18} /></Link>
                <Link className="button button-outline" href="/register?next=%2Fjuniors%2Forder-of-merit%23registration">Create an account</Link>
              </div>
            </section>}
          </div>
        </div>
      </section>
    </main>
  );
}
