import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Flag,
  MapPin,
  MessageCircle,
  Quote,
  ScanLine,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import { site, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Golf Coaching in Cape Town",
  description:
    "Book personal golf coaching, junior development and on course lessons at Durbanville Golf Club or Hazendal Golf in Stellenbosch.",
  alternates: { canonical: "/" },
};

const serviceCards = [
  {
    title: "Private coaching",
    copy: "Clear, personal coaching for every stage of your game.",
    href: "/coaching#private-lessons",
    icon: Target,
  },
  {
    title: "Junior development",
    copy: "A positive pathway from first swing to competitive golf.",
    href: "/juniors",
    icon: Flag,
  },
  {
    title: "Clinics and events",
    copy: "Purposeful group experiences for players, schools and teams.",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "Driving range",
    copy: "Quality practice facilities, bucket prices and flexible packages.",
    href: "/driving-range",
    icon: MapPin,
  },
  {
    title: "Meet the team",
    copy: "Eight dedicated coaches across Durbanville and Hazendal.",
    href: "/coaches",
    icon: UsersRound,
  },
  {
    title: "Swing analysis and fittings",
    copy: "Technology that turns clear data into practical improvement.",
    href: "/coaching#technology",
    icon: ScanLine,
  },
];

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: site.name,
    url: siteUrl,
    image: `${siteUrl}/images/home/home-hero.webp`,
    description: site.description,
    sport: "Golf",
    areaServed: ["Cape Town", "Durbanville", "Stellenbosch"],
    subOrganization: site.locations.map((location) => ({
      "@type": "LocalBusiness",
      name: `${site.name} at ${location.shortName}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: location.shortName,
        addressRegion: "Western Cape",
        addressCountry: "ZA",
      },
    })),
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero-section">
        <Image
          className="home-hero-background"
          src="/images/home/home-hero.webp"
          alt="Golf club addressing a ball on a practice field"
          fill
          priority
          sizes="100vw"
        />
        <div className="site-shell hero-grid">
          <div className="hero-copy reveal">
            <h1>Your game.<br />In better motion.</h1>
            <p className="hero-lead">
              Personal coaching for juniors, beginners and experienced players, built around
              where you are and where you want to go.
            </p>
            <div className="hero-actions">
              <Link href="/book" className="button button-small">
                Book a lesson <ArrowRight size={19} aria-hidden="true" />
              </Link>
              <Link href="/coaching" className="text-link">
                Explore coaching <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="hero-proof" aria-label="Academy highlights">
            <div><strong>2</strong><span>Cape Town locations</span></div>
            <div><strong>8</strong><span>Dedicated coaches</span></div>
            <div><strong>2014</strong><span>Established in Cape Town</span></div>
          </div>
        </div>
      </section>

      <section className="section service-section" id="coaching">
        <div className="site-shell">
          <div className="section-heading split-heading">
            <div>
              <h2>What we offer.</h2>
            </div>
            <p>
              Coaching golfers since 2014, led by founder Lana Orgovanyi and her 30 years of
              international playing and coaching experience.
            </p>
          </div>

          <div className="service-grid">
            {serviceCards.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link href={service.href} className="service-card" key={service.title}>
                  <div className="service-number">0{index + 1}</div>
                  <Icon className="service-icon" strokeWidth={1.6} aria-hidden="true" />
                  <h3>{service.title}</h3>
                  <span>{service.copy}</span>
                  <div className="card-arrow"><ArrowRight size={20} /></div>
                </Link>
              );
            })}
          </div>
          <div className="service-quick-links" aria-label="Popular ways to get started">
            <Link href="/book?service=junior-assessment">
              <span>New junior golfer?</span>
              <strong>Book a free assessment</strong>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/coaching#packages">
              <span>Ready to build momentum?</span>
              <strong>View the 3 lesson package</strong>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section junior-section" id="juniors">
        <div className="site-shell junior-grid">
          <div className="junior-image-wrap">
            <Image
              src="/images/home/junior-coaching.webp"
              alt="A junior golfer playing a bunker shot during an on course coaching session"
              width={2048}
              height={1365}
              sizes="(max-width: 820px) 100vw, 48vw"
              className="junior-image"
            />
            <div className="image-stamp"><Sparkles size={18} /><span>Coaching with purpose</span></div>
          </div>
          <div className="junior-copy">
            <h2>A clear pathway for young golfers.</h2>
            <p>
              From a first introduction to tournament preparation, juniors develop strong
              fundamentals, confidence and a genuine love for the game.
            </p>
            <ul className="check-list">
              <li><Check size={18} /> Individual and group coaching</li>
              <li><Check size={18} /> Development suited to every age</li>
              <li><Check size={18} /> Order of Merit competition and annual leaderboard</li>
            </ul>
            <div className="junior-actions">
              <Link href="/juniors" className="button button-light">Explore junior golf <ArrowRight size={18} /></Link>
              <Link href="/book?service=junior-assessment" className="junior-text-link">Free assessment</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section why-section" aria-labelledby="why-title">
        <div className="site-shell why-grid">
          <div className="why-copy">
            <h2 id="why-title">Why choose<br />Pure Motion.</h2>
            <p>
              Led by founder Lana Orgovanyi, Pure Motion combines 30 years of international
              playing and coaching experience with a dedicated team across Durbanville and Hazendal.
            </p>
            <Link href="/coaches" className="text-link why-link">
              Meet the coaching team <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <ul className="why-list">
            {[
              "Personal coaching built around your game",
              "Eight dedicated coaches",
              "Junior and adult programmes",
              "Swing and putting analysis technology",
              "Two Cape Town locations",
              "Coaching available seven days a week",
            ].map((item) => (
              <li key={item}><Check size={19} strokeWidth={2} aria-hidden="true" />{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section academy-highlights-section" aria-labelledby="academy-highlights-title">
        <div className="site-shell">
          <div className="section-heading split-heading academy-highlights-heading">
            <h2 id="academy-highlights-title">More than lessons.</h2>
            <p>Practise between lessons, follow upcoming competitions and hear from the families who know the academy.</p>
          </div>
          <div className="academy-highlights-grid">
            <article className="academy-highlight-card range-highlight" id="driving-range">
              <Target size={27} strokeWidth={1.6} aria-hidden="true" />
              <span>Durbanville</span>
              <h3>Driving range</h3>
              <p>Open in daylight hours, seven days a week. Buckets start from R57, with better value packages for Durbanville Golf Club members.</p>
              <Link href="/driving-range">
                Explore the driving range <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </article>
            <article className="academy-highlight-card calendar-highlight">
              <CalendarDays size={27} strokeWidth={1.6} aria-hidden="true" />
              <span>What is happening</span>
              <h3>Calendar and events</h3>
              <p>See upcoming Order of Merit dates and junior programmes in one clear place.</p>
              <Link href="/events#calendar">
                View the academy calendar <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </article>
            <figure className="academy-highlight-card review-highlight">
              <Quote size={27} strokeWidth={1.6} aria-hidden="true" />
              <blockquote>Pure Motion Academy are incredible with the kids. Coaches are skilled and very professional.</blockquote>
              <figcaption>
                <strong>Jonathan v S</strong>
                <span>Parent and client</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section locations-section" id="locations">
        <div className="site-shell locations-grid">
          <div className="location-intro">
            <h2>Two locations.<br />One standard.</h2>
            <p>Choose the academy that works for you. Your coach and live availability will follow.</p>
          </div>
          <div className="location-list">
            {site.locations.map((location, index) => (
              <Link href={`/book?location=${location.shortName.toLowerCase()}`} key={location.name}>
                <span className="location-index">0{index + 1}</span>
                <span className="location-pin"><MapPin size={22} /></span>
                <span><strong>{location.name}</strong><small>{location.region}</small></span>
                <ArrowRight className="location-arrow" size={22} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" id="contact">
        <div className="site-shell final-cta-inner">
          <div><Trophy size={28} strokeWidth={1.5} /><h2>Ready for your next move?</h2></div>
          <div className="final-cta-actions">
            <a href="https://wa.me/27762470501?text=Hi%20I%20have%20a%20question" target="_blank" rel="noreferrer" className="final-whatsapp-link">
              <MessageCircle size={18} aria-hidden="true" /> Ask on WhatsApp
            </a>
            <Link href="/book" className="button button-dark">Book a lesson <ArrowRight size={19} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
