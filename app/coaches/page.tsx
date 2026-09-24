import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Clock3, MapPin, UsersRound } from "lucide-react";
import { coaches, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Golf Coaches",
  description:
    "Meet the Pure Motion golf coaches at Durbanville Golf Club and Hazendal Golf in Stellenbosch.",
  alternates: { canonical: "/coaches" },
  openGraph: {
    title: "Golf Coaches | Pure Motion Golf",
    description:
      "Find the Pure Motion coach whose experience, location and availability suit your game.",
    url: "/coaches",
    images: [
      {
        url: "/images/coaches/lana-orgovanyi.webp",
        width: 605,
        height: 605,
        alt: "Lana Orgovanyi, founder and director of Pure Motion Golf Academy",
      },
    ],
  },
};

const director = coaches.find((coach) => coach.id === "lana")!;
const availableCoaches = coaches.filter((coach) => coach.acceptingBookings);

export default function CoachesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pure Motion Golf Academy coaches",
    url: `${siteUrl}/coaches`,
    itemListElement: coaches.map((coach, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: coach.name,
        jobTitle: coach.role,
        image: `${siteUrl}${coach.image}`,
        worksFor: {
          "@type": "SportsActivityLocation",
          name: "Pure Motion Golf Academy",
        },
      },
    })),
  };

  return (
    <main id="main-content" className="coaches-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="coaches-hero">
        <div className="site-shell coaches-hero-grid">
          <div>
            <h1>Meet your coaches.</h1>
          </div>
          <div className="coaches-hero-copy">
            <p>
              Choose a coach by location, experience and availability. Every coach brings a
              different strength to your game.
            </p>
            <a href="#available-coaches" className="text-link">
              View the team <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="site-shell team-snapshot" aria-label="Team summary">
          <div><strong>8</strong><span>Coaches</span></div>
          <div><strong>2</strong><span>Locations</span></div>
          <div><strong>All</strong><span>Ages and abilities</span></div>
        </div>
      </section>

      <section className="section director-section" id="lana">
        <div className="site-shell director-feature">
          <div className="director-image-wrap">
            <Image
              src={director.image}
              alt={`${director.name}, ${director.role}`}
              width={605}
              height={605}
              priority
              sizes="(max-width: 820px) 100vw, 48vw"
              className="director-image"
            />
          </div>
          <div className="director-copy">
            <h2>{director.name}</h2>
            <p className="coach-role">{director.role}</p>
            <p className="director-bio">{director.bio}</p>
            <div className="coach-facts">
              <span><MapPin size={18} aria-hidden="true" /> Durbanville and Hazendal</span>
              <span><UsersRound size={18} aria-hidden="true" /> Academy leadership</span>
            </div>
            <p className="capacity-note">
              Lana is currently at capacity and is not accepting new clients.
            </p>
            <a href="#available-coaches" className="button button-outline">
              View available coaches <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="section coach-directory-section" id="available-coaches">
        <div className="site-shell">
          <div className="coach-directory-head">
            <h2>Available coaches.</h2>
            <p>Prices and live times are shown during booking.</p>
          </div>
          <div className="coaches-directory-grid">
            {availableCoaches.map((coach) => (
              <article className="directory-card" id={coach.id} key={coach.id}>
                <div className="directory-image-wrap">
                  <Image
                    src={coach.image}
                    alt={`${coach.name}, ${coach.role}`}
                    width={610}
                    height={610}
                    sizes="(max-width: 680px) 100vw, (max-width: 1050px) 46vw, 31vw"
                    className="directory-image"
                  />
                  <span>{coach.location}</span>
                </div>
                <div className="directory-copy">
                  <p className="coach-role">{coach.role}</p>
                  <h3>{coach.name}</h3>
                  <p className="directory-bio">{coach.bio}</p>
                  <div className="directory-availability">
                    <Clock3 size={17} aria-hidden="true" />
                    <span>{coach.availability}</span>
                  </div>
                  <Link href={`/book?coach=${coach.id}`} className="directory-book-link">
                    Book with {coach.name.split(" ")[0]} <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="team-cta">
        <div className="site-shell team-cta-inner">
          <div>
            <h2>Not sure who to choose?</h2>
            <p>Select no preference and we will show the first available coach.</p>
          </div>
          <Link href="/book" className="button button-light">
            Find a lesson <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
