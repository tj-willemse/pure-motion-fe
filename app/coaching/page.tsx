import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleGauge,
  Layers3,
  ScanLine,
  UsersRound,
} from "lucide-react";
import { formatRand, services, site, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Golf Coaching and Lesson Prices",
  description:
    "Explore private golf lessons, lesson packages, ladies golf clinics and golf technology services at Pure Motion Golf in Cape Town.",
  keywords: [
    "golf lessons Cape Town",
    "golf lesson prices Durbanville",
    "ladies golf clinics Cape Town",
    "golf club fitting Cape Town",
  ],
  alternates: { canonical: "/coaching" },
  openGraph: {
    title: "Golf Coaching and Lesson Prices | Pure Motion Golf",
    description:
      "Private coaching, lesson packages, ladies golf and technology services in one clear place.",
    url: `${siteUrl}/coaching`,
    images: [
      {
        url: "/images/home/coaching-lesson.webp",
        width: 2560,
        height: 1707,
        alt: "Golf coach helping a player with his setup on the practice ground",
      },
    ],
  },
};

const privateLessons = services.filter((service) =>
  ["private-30", "private-55", "on-course"].includes(service.id),
);

const pageSections = [
  { label: "Private lessons", href: "#private-lessons", icon: CircleGauge },
  { label: "Lesson packages", href: "#packages", icon: Layers3 },
  { label: "Ladies golf", href: "#ladies-golf", icon: UsersRound },
  { label: "Technology and fittings", href: "#technology", icon: ScanLine },
];

export default function CoachingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Golf coaching",
    provider: {
      "@type": "SportsActivityLocation",
      name: site.name,
      url: siteUrl,
    },
    areaServed: ["Cape Town", "Durbanville", "Stellenbosch"],
    serviceType: "Golf coaching",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Golf lessons",
      itemListElement: privateLessons.map((lesson) => ({
        "@type": "Offer",
        priceCurrency: "ZAR",
        price: lesson.price,
        itemOffered: {
          "@type": "Service",
          name: lesson.title,
          description: lesson.description,
        },
      })),
    },
  };

  return (
    <main id="main-content" className="coaching-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="coaching-hero">
        <Image
          className="coaching-hero-background"
          src="/images/home/coaching-lesson.webp"
          alt="Golf coach helping a player with his setup on the practice ground"
          fill
          priority
          sizes="100vw"
        />
        <div className="site-shell coaching-hero-grid">
          <div className="coaching-hero-copy reveal">
            <h1>Better coaching.<br />Less guesswork.</h1>
            <p>
              Choose the support that suits your game, your goals and the time you have
              available. Coaches are available across Durbanville and Hazendal seven days a
              week.
            </p>
            <div className="coaching-hero-note">
              <span>From</span>
              <strong>{formatRand(privateLessons[0].price)}</strong>
              <small>per lesson</small>
            </div>
            <div className="coaching-hero-actions">
              <Link href="/book" className="button button-small">
                Book a lesson <ArrowRight size={19} aria-hidden="true" />
              </Link>
              <Link href="/coaches" className="text-link">
                Meet the coaches <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-nav-sticky">
        <nav className="site-shell coaching-section-nav" aria-label="Coaching services">
          {pageSections.map(({ label, href, icon: Icon }) => (
            <Link href={href} key={href}>
              <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
              <strong>{label}</strong>
            </Link>
          ))}
        </nav>
      </div>

      <section className="section coaching-pricing" id="private-lessons">
        <div className="site-shell">
          <div className="coaching-section-head">
            <div>
              <h2>Choose the right amount of time.</h2>
            </div>
            <p>
              Personal coaching for beginners, established players and competitive golfers.
              Select your lesson first, then choose a location, coach and live time. For lasting
              progress, the academy recommends starting with at least three lessons.
            </p>
          </div>

          <div className="lesson-price-grid">
            {privateLessons.map((lesson, index) => (
              <article className="lesson-price-card" key={lesson.id}>
                <div className="lesson-price-top">
                  <span>0{index + 1}</span>
                  <small>{lesson.duration}</small>
                </div>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <div className="lesson-price-bottom">
                  <div><small>From</small><strong>{formatRand(lesson.price)}</strong></div>
                  <Link href="/book" aria-label={`Book ${lesson.title}`}>
                    <ArrowRight size={20} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="coaching-booking-notes">
            <div>
              <strong>Junior coaching</strong>
              <p>
                Junior rates shown in the booking flow are for players who are not Junior
                Academy members. Members receive reduced lesson rates.
              </p>
            </div>
            <div>
              <strong>Before you confirm</strong>
              <p>
                Prices vary by coach and location. The full price and live availability will be
                shown before confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section package-section" id="packages">
        <div className="site-shell package-grid">
          <div className="package-image-wrap">
            <Image
              src="/images/home/coaching-package.webp"
              alt="Golfer completing a full swing on the course"
              width={1800}
              height={1201}
              sizes="(max-width: 860px) 100vw, 46vw"
            />
          </div>
          <div className="package-copy">
            <h2>Build momentum across more than one session.</h2>
            <p>
              A package contains three 30 minute lessons and offers better value for players who
              want to build on what they learn from one session to the next.
            </p>
            <ul>
              <li><Check size={18} aria-hidden="true" /> Three 30 minute lessons from {formatRand(1073)}</li>
              <li><Check size={18} aria-hidden="true" /> Lessons must usually be used within five weeks</li>
              <li><Check size={18} aria-hidden="true" /> At least 24 hours notice is required to cancel</li>
              <li><Check size={18} aria-hidden="true" /> Packages are not refundable or transferable</li>
            </ul>
            <p className="package-terms-note">
              Late cancellations are forfeited. Injury, weather and other exceptional situations
              are handled directly by the academy.
            </p>
            <div className="package-actions">
              <Link href="/login" className="button button-light">
                View your portal <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/book" className="package-link">Book one lesson</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section specialist-section">
        <div className="site-shell specialist-grid">
          <article className="specialist-card ladies-card" id="ladies-golf">
            <div className="specialist-icon"><UsersRound size={25} strokeWidth={1.7} /></div>
            <div>
              <h2>Learn, practise and enjoy the game together.</h2>
              <p>
                Friendly clinics for women who are new to golf or want to improve in a relaxed,
                supportive group environment.
              </p>
              <div className="ladies-facts">
                <div><small>Duration</small><strong>1 hour</strong></div>
                <div><small>Single clinic</small><strong>R211</strong></div>
                <div><small>2026 online deal</small><strong>R200 each</strong></div>
              </div>
              <div className="clinic-schedule">
                <strong>Weekly clinic times</strong>
                <p>Mondays at 10 am, both locations</p>
                <p>Wednesdays at 10 am, Durbanville</p>
                <p>Fridays at 11 am, Durbanville</p>
                <p>Fridays at 5 am, Hazendal</p>
              </div>
              <p className="specialist-note">
                Equipment is provided for newcomers who do not have their own. The multi clinic
                offer must be booked at least 48 hours before the first clinic. Missed clinics are
                not refunded or carried over.
              </p>
              <div className="specialist-actions">
                <Link href="/book" className="specialist-link">
                  Book a clinic <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a href="mailto:ladies@puremotiongolf.com">ladies@puremotiongolf.com</a>
                <a href="tel:+27762470501">076 247 0501</a>
              </div>
            </div>
          </article>

          <article className="specialist-card technology-card" id="technology">
            <div className="specialist-icon"><ScanLine size={25} strokeWidth={1.7} /></div>
            <div>
              <h2>Use better information to make better decisions.</h2>
              <p>
                Book a fitting at Durbanville or Hazendal, or use measured feedback during a
                lesson to better understand your swing, putting and equipment.
              </p>
              <div className="technology-options">
                <div>
                  <strong>CoachNow</strong>
                  <p>Video swing analysis, coach notes and instructions in the free app.</p>
                  <small>Available on request with any lesson at no extra cost</small>
                </div>
                <div>
                  <strong>FlightScope Mevo+</strong>
                  <p>Ball flight and swing data with video and performance measurements.</p>
                  <small>R850 for 45 minutes, R2340 for three, or from R150 without a lesson</small>
                </div>
                <div>
                  <strong>CAPTO putting analysis</strong>
                  <p>Detailed putting stroke data for focused work on the greens.</p>
                  <small>R1200 for 75 minutes, R600 for a 45 minute follow up</small>
                </div>
              </div>
              <p className="specialist-note technology-note">
                The Hazendal studios also include V1 Pro analysis, pressure mats, high speed
                cameras and FlightScope launch monitors.
              </p>
              <Link href="/book" className="specialist-link">
                Book a fitting <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="coaching-junior-link">
        <div className="site-shell coaching-junior-inner">
          <div>
            <h2>A weekly team pathway for school going golfers.</h2>
            <p>
              Open to all skill levels with no club membership or handicap required. Teams of
              four to eight receive weekly 55 minute lessons during public school terms.
            </p>
          </div>
          <Link href="/juniors" className="button button-outline">
            Explore junior programmes <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="final-cta">
        <div className="site-shell final-cta-inner">
          <div><CircleGauge size={28} strokeWidth={1.5} /><h2>Ready to work on your game?</h2></div>
          <Link href="/book" className="button button-dark">
            Book a lesson <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
