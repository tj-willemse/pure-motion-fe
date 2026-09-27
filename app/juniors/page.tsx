import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleCheck,
  GraduationCap,
  Trophy,
  UsersRound,
} from "lucide-react";
import { site, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Junior Golf Academy and Order of Merit",
  description:
    "Explore junior golf assessments, academy programmes, Order of Merit, holiday coaching and School Team Golf in Durbanville and Stellenbosch.",
  keywords: [
    "junior golf Cape Town",
    "junior golf academy Durbanville",
    "junior golf Stellenbosch",
    "junior Order of Merit golf",
    "kids golf lessons Cape Town",
  ],
  alternates: { canonical: "/juniors" },
  openGraph: {
    title: "Junior Golf Academy and Order of Merit | Pure Motion Golf",
    description:
      "A clear pathway from a first assessment to confident course play and junior competition.",
    url: `${siteUrl}/juniors`,
    images: [
      {
        url: "/images/home/juniors-hero.webp",
        width: 1200,
        height: 720,
        alt: "Junior golfers carrying their bags along the fairway",
      },
    ],
  },
};

const juniorSections = [
  { label: "Free assessment", href: "#assessment", icon: CircleCheck },
  { label: "Junior Academy", href: "#academy", icon: GraduationCap },
  { label: "Order of Merit", href: "#order-of-merit", icon: Trophy },
  { label: "Holidays & school teams", href: "#more-programmes", icon: CalendarDays },
];

const programmes = [
  {
    title: "Grassroots",
    ages: "Ages 4 to 6",
    duration: "30 minutes",
    group: "Maximum 4 per group",
    price: "R160.61 per lesson",
    copy: "Fun weekly sessions using SNAG equipment to build the first movement, safety and golf skills.",
  },
  {
    title: "Youth groups",
    ages: "Ages 7 and older",
    duration: "55 minutes",
    group: "Maximum 6 per group",
    price: "R241.81 per lesson",
    copy: "Weekly group coaching for beginners, social players and focused juniors with shared goals.",
  },
  {
    title: "Individual",
    ages: "Progressing juniors",
    duration: "30 minutes",
    group: "One player and one coach",
    price: "R259.05 per lesson",
    copy: "Purposeful weekly sessions with a planned progression map and CoachNow video analysis.",
  },
  {
    title: "Specialised",
    ages: "Competitive players",
    duration: "4 sessions monthly",
    group: "Coach and director oversight",
    price: "R1667 per month",
    copy: "Technique, practice, mental skills, course management, preparation, fitness and advanced rules.",
  },
];

export default function JuniorsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: `${site.name} Junior Academy`,
    url: `${siteUrl}/juniors`,
    sport: "Golf",
    areaServed: ["Cape Town", "Durbanville", "Stellenbosch"],
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: 4,
      suggestedMaxAge: 18,
    },
  };

  return (
    <main id="main-content" className="juniors-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="juniors-hero">
        <Image
          className="juniors-hero-background"
          src="/images/home/juniors-hero.webp"
          alt="Junior golfers carrying their bags along the fairway"
          fill
          priority
          sizes="100vw"
        />
        <div className="site-shell juniors-hero-grid">
          <div className="juniors-hero-copy reveal">
            <h1>A place to begin.<br />A pathway to grow.</h1>
            <p>
              Junior golf for ages 4 to 18, from a first assessment and weekly coaching to
              confident course play and competition.
            </p>
            <div className="junior-age-badge"><strong>4 to 18</strong><span>years old</span></div>
            <p>Atlantic Beach Academy by Pure Motion opens in October 2026. Junior programme details will be confirmed.</p>
            <div className="juniors-hero-actions">
              <Link href="/book?service=junior-assessment" className="button button-small">
                Book a free assessment <ArrowRight size={19} aria-hidden="true" />
              </Link>
              <a href="#academy" className="text-link">
                View programmes <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-nav-sticky">
        <nav className="site-shell junior-section-nav" aria-label="Junior golf sections">
          {juniorSections.map(({ label, href, icon: Icon }) => (
            <Link href={href} key={href}>
              <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
              <strong>{label}</strong>
            </Link>
          ))}
        </nav>
      </div>

      <section className="junior-entry-strip">
        <div className="site-shell junior-entry-grid">
          {["Boys and girls", "No experience required", "No club membership", "No equipment needed"].map(
            (item) => <div key={item}><Check size={17} aria-hidden="true" /><span>{item}</span></div>,
          )}
        </div>
      </section>

      <section className="section assessment-section" id="assessment">
        <div className="site-shell assessment-grid">
          <div className="assessment-intro">
            <h2>Every new junior starts with a free assessment.</h2>
            <p>
              A coach considers age, current ability, goals and schedule. Together with the
              parent, the academy then selects the right programme, coach, day and time.
            </p>
            <Link href="/book?service=junior-assessment" className="button">
              Request an assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="assessment-steps">
            {[
              ["01", "Assess", "Meet a coach and understand the right starting point."],
              ["02", "Place", "Choose the programme, coach and weekly schedule together."],
              ["03", "Progress", "Begin lessons with a clear pathway and regular feedback."],
            ].map(([number, title, copy]) => (
              <div key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section junior-academy-section" id="academy">
        <div className="site-shell">
          <div className="junior-section-head">
            <div><h2>Coaching that grows with the player.</h2></div>
            <p>
              Academy programmes run weekly during public school terms and are billed monthly
              in advance. Current rates below apply from March 2026.
            </p>
          </div>
          <div className="junior-programme-grid">
            {programmes.map((programme, index) => (
              <article className="junior-programme-card" key={programme.title}>
                <div className="junior-programme-number">0{index + 1}</div>
                <span>{programme.ages}</span>
                <h3>{programme.title}</h3>
                <p>{programme.copy}</p>
                <dl>
                  <div><dt>Session</dt><dd>{programme.duration}</dd></div>
                  <div><dt>Format</dt><dd>{programme.group}</dd></div>
                  <div><dt>Rate</dt><dd>{programme.price}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <div className="family-sharing-note">
            <UsersRound size={23} aria-hidden="true" />
            <div>
              <strong>Family sharing</strong>
              <p>
                Up to three siblings of a similar age or level may share an individual lesson.
                The first child pays the individual rate and each additional child pays 20 percent.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section membership-section">
        <div className="site-shell membership-grid">
          <div className="membership-price">
            <small>2026 annual membership</small>
            <strong>R335</strong>
            <span>per child</span>
          </div>
          <div className="membership-copy">
            <h2>More support, better value.</h2>
            <p>
              Membership runs from January to December. A junior must participate in a Grassroots,
              Youth, Individual or Family Sharing programme to qualify.
            </p>
            <div className="membership-benefits">
              {[
                "Reduced lesson rates",
                "Complimentary assessment",
                "Official PMGA cap",
                "Birthday month practice balls",
                "Discounts on OOM, AIM and holiday programmes",
                "Preferred partner and equipment rates",
              ].map((benefit) => <div key={benefit}><Check size={16} />{benefit}</div>)}
            </div>
            <p className="membership-note">
              Membership is not refundable. Lessons are scheduled around public school terms and
              monthly accounts are payable within seven days.
            </p>
            <Link href="/juniors/academy-terms" className="text-link membership-terms-link">
              View 2026 fees, schedules and terms <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section merit-section" id="order-of-merit">
        <div className="site-shell junior-oom-teaser">
          <div>
            <Trophy size={30} strokeWidth={1.5} aria-hidden="true" />
            <h2>Order of Merit.</h2>
          </div>
          <div>
            <p>
              A nine-hole Tuesday competition for course-ready juniors aged 6 to 18, with
              Standard and Kickstarter divisions, weekly results and an annual leaderboard.
            </p>
            <dl>
              <div><dt>2026 season</dt><dd>31 playable rounds</dd></div>
              <div><dt>Entry</dt><dd>R35 JAM · R80 standard</dd></div>
              <div><dt>Venue</dt><dd>Durbanville Golf Club</dd></div>
            </dl>
            <Link href="/juniors/order-of-merit" className="button button-light">
              Explore Order of Merit <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section more-junior-section" id="more-programmes">
        <span className="section-anchor-marker" id="holiday-programmes" aria-hidden="true" />
        <span className="section-anchor-marker" id="school-team-golf" aria-hidden="true" />
        <div className="site-shell">
          <div className="junior-section-head">
            <div><h2>School holidays and school teams.</h2></div>
            <p>Short programmes for focused holiday learning and a weekly team option at Hazendal.</p>
          </div>
          <div className="more-junior-grid">
            <article className="holiday-card">
              <CalendarDays size={26} />
              <span>January 2027</span>
              <h3>Junior Holiday Programme</h3>
              <p>Professional coaching, skills games, short game, putting, etiquette and shared fun.</p>
              <div className="holiday-options">
                <div><strong>Junior programme</strong><span>4 and 5 January, 9 am to 11 am</span><small>R747 JAM, R786 non JAM</small></div>
                <div><strong>Youth programme</strong><span>6 to 8 January, 12 pm to 3 pm</span><small>R1441 JAM, R1517 non JAM</small></div>
              </div>
              <small>Durbanville and Hazendal. Registration closes 28 December 2026.</small>
            </article>
            <article className="school-team-card">
              <GraduationCap size={26} />
              <span>Hazendal Golf</span>
              <h3>School Team Golf Programme</h3>
              <p>
                Weekly team coaching for school going juniors of all abilities, including players
                whose schools do not run their own golf programme.
              </p>
              <dl>
                <div><dt>Team size</dt><dd>4 to 8 players</dd></div>
                <div><dt>Sessions</dt><dd>55 minutes, Tuesday to Friday</dd></div>
                <div><dt>Times</dt><dd>3 pm or 4 pm</dd></div>
                <div><dt>Term rate</dt><dd>R1050 for terms 1 to 3</dd></div>
                <div><dt>Term 4</dt><dd>R450</dd></div>
                <div><dt>Registration</dt><dd>R85 annually</dd></div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="site-shell final-cta-inner">
          <div><Trophy size={28} strokeWidth={1.5} /><h2>Find the right starting point.</h2></div>
          <Link href="/book?service=junior-assessment" className="button button-dark">
            Book a free assessment <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
