import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleCheck,
  Flag,
  GraduationCap,
  ShieldCheck,
  Target,
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
  { label: "Holiday programmes", href: "#holiday-programmes", icon: CalendarDays },
  { label: "School Team Golf", href: "#school-team-golf", icon: UsersRound },
  { label: "Calendar", href: "#calendar", icon: CalendarDays },
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

const meritPoints = [
  ["1st", "60"],
  ["2nd", "52"],
  ["3rd", "45"],
  ["4th", "38"],
  ["5th", "30"],
  ["6th", "25"],
  ["7th", "20"],
  ["8th", "15"],
  ["9th and after", "10"],
];

const termFourDates = [
  "13 Oct",
  "20 Oct",
  "27 Oct",
  "3 Nov",
  "10 Nov",
  "17 Nov",
  "24 Nov",
  "1 Dec",
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
            <a href={href} key={href}>
              <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
              <strong>{label}</strong>
            </a>
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
          </div>
        </div>
      </section>

      <section className="section merit-section" id="order-of-merit">
        <div className="site-shell">
          <div className="merit-hero">
            <div className="merit-title">
              <h2>Order of Merit.</h2>
            </div>
            <div className="merit-intro">
              <p>
                Learn to compete without losing the love of the game. A nine hole Tuesday competition
                at Durbanville Golf Club for course ready juniors.
                Players build confidence, learn competition routines and collect points across the year.
              </p>
              <a href="#merit-results" className="button button-light">
                Understand the scoring <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="merit-facts-grid">
            <div><small>Eligibility</small><strong>Ages 6 to 18</strong><span>Course ready juniors</span></div>
            <div><small>Schedule</small><strong>Tuesdays</strong><span>During public school terms</span></div>
            <div><small>Check in</small><strong>3:00 pm</strong><span>Tee times from 3:20 pm</span></div>
            <div><small>2026 season</small><strong>31 rounds</strong><span>Minimum 12 for prizes</span></div>
          </div>

          <div className="merit-registration-row">
            <div>
              <strong>Registration opens Wednesday and closes Saturday before each Tuesday round.</strong>
              <p>No club membership or official handicap is required. A paid entry secures the tee time.</p>
            </div>
            <div className="merit-fees">
              <span><small>JAM member</small><strong>R35</strong><em>per round</em></span>
              <span><small>Non member</small><strong>R80</strong><em>per round</em></span>
              <p>Book a full term or year and receive 10 percent off.</p>
            </div>
          </div>

          <div className="merit-course-grid">
            <article>
              <div className="merit-course-icon"><Flag size={24} /></div>
              <span>Standard course</span>
              <h3>Stableford competition</h3>
              <p>
                Nine holes on alternating front and back nines. Players use their official handicap,
                or begin with an allocated Handicap Index of 36.0.
              </p>
              <ul>
                <li>Boys 13 and older play blue tees</li>
                <li>Boys 12 and younger play red tees</li>
                <li>Girls play red tees</li>
                <li>Record fairways, greens and putts</li>
              </ul>
            </article>
            <article>
              <div className="merit-course-icon"><Target size={24} /></div>
              <span>Kickstarter course</span>
              <h3>A shorter route into competition</h3>
              <p>
                Nine adapted holes for newer course players. No official handicap is needed and
                players can graduate into the Standard division as confidence improves.
              </p>
              <ul>
                <li>Gross score format</li>
                <li>Maximum score of 7 on each hole</li>
                <li>Putts recorded on every hole</li>
                <li>Adults may help younger players score</li>
              </ul>
            </article>
          </div>

          <div className="merit-results-grid" id="merit-results">
            <div className="merit-points-panel">
              <span>Standard division points</span>
              <h3>Every round contributes.</h3>
              <div className="merit-points-table">
                {meritPoints.map(([place, points]) => (
                  <div key={place}><span>{place}</span><strong>{points} pts</strong></div>
                ))}
              </div>
            </div>
            <div className="merit-results-copy">
              <span>Results and prizes</span>
              <h3>Weekly results feed the annual leaderboard.</h3>
              <p>
                Stableford players earn points for every round and their finishing position.
                Kickstarter standings use the average gross score from all rounds played.
              </p>
              <ul>
                <li><CircleCheck size={17} /> Results update on Wednesday after each round</li>
                <li><CircleCheck size={17} /> At least 12 rounds are required for annual prizes</li>
                <li><CircleCheck size={17} /> Six front nine and six back nine rounds are required</li>
                <li><CircleCheck size={17} /> Prizes include leaders, statistics, putting, improvement and sportsmanship</li>
                <li><CircleCheck size={17} /> A player may win one annual prize</li>
              </ul>
              <div className="merit-results-links">
                <span>Annual leaderboard</span>
                <span>Weekly Standard results</span>
                <span>Weekly Kickstarter results</span>
              </div>
            </div>
          </div>

          <div className="course-ready-panel">
            <div><ShieldCheck size={28} /><h3>What course ready means</h3></div>
            <p>
              The player can make contact with the ball, use basic chipping skills, take no more
              than four putts, follow tee and green etiquette, stand safely, keep pace and
              understand the warning fore. Ask a coach for an assessment if unsure.
            </p>
            <small>Players aged 6 to 10 must be accompanied by an adult.</small>
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

      <section className="junior-calendar-section" id="calendar">
        <div className="site-shell junior-calendar-grid">
          <div>
            <h2>Order of Merit, term four.</h2>
            <p>Dates can change. Confirmed event availability will be managed through the live calendar.</p>
          </div>
          <div className="junior-date-list">
            {termFourDates.map((date, index) => (
              <div key={date}><span>{String(index + 1).padStart(2, "0")}</span><strong>{date}</strong><small>Tuesday</small></div>
            ))}
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
