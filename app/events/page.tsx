import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  ExternalLink,
  Flag,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact, Events and Golf Calendar",
  description:
    "Contact Pure Motion Golf Academy, view upcoming events, follow the AIM Series calendar and find golf fixtures and results.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Contact and Events | Pure Motion Golf",
    description: "Academy contact details, upcoming golf events, calendar, AIM Series and results.",
    url: "/events",
  },
};

const calendarUrl =
  "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Africa%2FJohannesburg&showPrint=0&showTabs=0&src=Mmhub3N2YXFucTdoaXU0MjFmcjRwNTBoMDRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW4tZ2Iuc2Eub2ZmaWNpYWwjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%233F51B5&color=%234285F4";

const durbanvilleMap =
  "https://www.google.com/maps?ll=-33.834205,18.659658&z=18&t=m&hl=en-GB&gl=US&mapclient=apiv3&cid=9352012408936297811";
const hazendalMap =
  "https://www.google.com/maps/dir//hazendal+golf,+Bottelary+Road,+Stellenbosch,+7599";

const aimDates = ["7 Feb", "14 Mar", "11 Apr", "9 May", "6 Jun", "12 Sep", "17 Oct"];

const achievements = [
  ["Kaitlyn Rix", "Nomads SA Girls Rose Bowl Championship"],
  ["Jordan Pillay", "Heart of America Athletic Conference"],
  ["Henru Walters", "Italian International Under 16 Championship"],
  ["Bianca Ngecu", "Kenya Junior Strokeplay Championship"],
  ["Arman Patel", "Vernon Dickson Memorial Junior Trophy"],
  ["Kaylah Williams", "Florida State University"],
] as const;

export default function EventsPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Pure Motion AIM Series",
      startDate: "2026-10-17T15:30:00+02:00",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Durbanville Golf Club",
        address: "Sport Way, Durbanville, 7550, South Africa",
      },
      organizer: { "@type": "Organization", name: "Pure Motion Golf Academy", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "AIMtoGIVE",
      startDate: "2026-11-21T15:30:00+02:00",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Durbanville Golf Club",
        address: "Sport Way, Durbanville, 7550, South Africa",
      },
      organizer: { "@type": "Organization", name: "Pure Motion Golf Academy", url: siteUrl },
    },
  ];

  return (
    <main id="main-content" className="events-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="events-hero">
        <div className="site-shell events-hero-grid">
          <div className="events-hero-copy reveal">
            <h1>Stay informed.<br />Come and play.</h1>
            <p>Contact the academy, find an upcoming event and follow fixtures and results from one clear place.</p>
            <div className="events-hero-actions">
              <a href="https://wa.me/27762470501?text=Hi%20I%20have%20a%20question" target="_blank" rel="noreferrer" className="button">
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp us
              </a>
              <a href="tel:+27762470501" className="events-text-link"><Phone size={17} /> 076 247 0501</a>
            </div>
          </div>
          <div className="events-hero-panel reveal reveal-delay">
            <span>Next up</span>
            <CalendarDays size={28} strokeWidth={1.6} aria-hidden="true" />
            <strong>AIM Series</strong>
            <p>17 October 2026 at 3:30 pm</p>
            <a href="#aim-series">View event details <ArrowRight size={17} /></a>
          </div>
        </div>
      </section>
      <div className="section-nav-sticky">
        <nav className="site-shell events-section-nav" aria-label="Contact and event sections">
          {[
            ["Contact", "#contact", Phone],
            ["Upcoming", "#upcoming", CalendarDays],
            ["AIM Series", "#aim-series", Target],
            ["Calendar", "#calendar", CalendarDays],
            ["Results", "#results", Trophy],
          ].map(([label, href, Icon]) => (
            <a href={href as string} key={href as string}>
              <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
              <strong>{label as string}</strong>
            </a>
          ))}
        </nav>
      </div>

      <section className="section events-contact-section" id="contact">
        <div className="site-shell">
          <div className="events-section-head">
            <div><h2>Visit, call or send a message.</h2></div>
            <p>Lauren and Ofelia assist with reception and bookings. Coaches are available seven days a week across both locations.</p>
          </div>
          <div className="contact-location-grid">
            <article>
              <span>01</span><MapPin size={25} strokeWidth={1.6} />
              <h3>Durbanville Golf Club</h3>
              <p>Sport Way, Durbanville, 7550<br />Western Cape, South Africa</p>
              <a href={durbanvilleMap} target="_blank" rel="noreferrer">Get directions <ExternalLink size={15} /></a>
            </article>
            <article>
              <span>02</span><MapPin size={25} strokeWidth={1.6} />
              <h3>Hazendal Golf</h3>
              <p>Bottelary Road, Stellenbosch, 7599<br />Western Cape, South Africa</p>
              <a href={hazendalMap} target="_blank" rel="noreferrer">Get directions <ExternalLink size={15} /></a>
            </article>
            <article className="contact-direct-card">
              <span>Reception</span><UsersRound size={25} strokeWidth={1.6} />
              <h3>Lauren and Ofelia</h3>
              <p>Your friendly contacts for bookings, availability and general academy questions.</p>
              <div>
                <a href="tel:+27762470501"><Phone size={15} /> Call the academy</a>
                <a href="https://wa.me/27762470501?text=Hi%20I%20have%20a%20question" target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a>
                <a href="mailto:events@puremotiongolf.com"><Mail size={15} /> Events email</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section upcoming-events-section" id="upcoming">
        <div className="site-shell">
          <div className="events-section-head light-head">
            <div><h2>What is coming up.</h2></div>
            <p>Event places are limited and payment is required in advance. Contact the events team if an entry date no longer appears.</p>
          </div>
          <div className="upcoming-event-grid">
            <article>
              <div className="event-date"><strong>17</strong><span>October</span></div>
              <div><span>AIM Series</span><h3>Short game event for every level.</h3><p>All ages from five, no official handicap or club membership required.</p></div>
              <a href="#aim-series" aria-label="View AIM Series information"><ArrowRight size={20} /></a>
            </article>
            <article className="give-event-card">
              <div className="event-date"><strong>21</strong><span>November</span></div>
              <div><span>AIMtoGIVE</span><h3>Play for a bigger purpose.</h3><p>A Christmas edition supporting Breadline Africa and its work with children.</p></div>
              <a href="#aim-to-give" aria-label="View AIMtoGIVE information"><ArrowRight size={20} /></a>
            </article>
          </div>
          <div className="event-path-links">
            <Link href="/juniors#order-of-merit"><Trophy size={19} /> Junior Order of Merit <ArrowRight size={16} /></Link>
            <Link href="/coaching#ladies-golf"><Flag size={19} /> Ladies Golf clinics <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section aim-section" id="aim-series">
        <div className="site-shell">
          <div className="aim-intro-grid">
            <div>
              <h2>A shorter course. A clear target.</h2>
            </div>
            <div>
              <p>Running since June 2022, AIM gives new golfers a welcoming first step onto the course and gives experienced players a focused short game challenge.</p>
              <div className="aim-key-facts">
                <span><UsersRound size={18} /><strong>Ages 5 and up</strong></span>
                <span><MapPin size={18} /><strong>Durbanville</strong></span>
                <span><Clock3 size={18} /><strong>3:30 pm</strong></span>
              </div>
            </div>
          </div>

          <div className="aim-level-grid">
            <article><span>01</span><h3>AIM 36</h3><p>Begin at 25 metres and complete nine holes in 36 strokes or fewer. Progress through 50, 75, 100, 125 and 150 metres.</p></article>
            <article><span>02</span><h3>AIM 27</h3><p>After completing AIM 36 across all six distances, begin again at 25 metres with a target of 27.</p></article>
            <article><span>03</span><h3>AIM 24</h3><p>The final target for golfers who have progressed through AIM 27.</p></article>
          </div>

          <div className="aim-details-grid">
            <article>
              <h3>Entry fees</h3>
              <div className="aim-price-list">
                <span><small>Adults</small><strong>R96</strong></span>
                <span><small>Juniors</small><strong>R47</strong></span>
                <span><small>JAM members</small><strong>R45</strong></span>
              </div>
              <p>Payment is required in advance. Cancellations are not refunded or carried over, but another player may be substituted.</p>
            </article>
            <article>
              <h3>Before you play</h3>
              <ul>
                <li><Check size={17} /> Basic swing training is recommended</li>
                <li><Check size={17} /> Players aged 10 and under need adult supervision</li>
                <li><Check size={17} /> Wear neat golf or sports clothing and closed shoes</li>
                <li><Check size={17} /> Bring a putter, up to three clubs, balls, tees and a marker</li>
              </ul>
            </article>
          </div>

          <div className="aim-dates-panel">
            <div><span>2026 series dates</span><strong>Registration closes at 4 pm on the Tuesday before each event.</strong></div>
            <div>{aimDates.map((date) => <span key={date}>{date}</span>)}</div>
            <a href="mailto:events@puremotiongolf.com?subject=AIM%20Series%20enquiry" className="button button-dark">Ask about entry <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      <section className="section give-section" id="aim-to-give">
        <div className="site-shell give-grid">
          <div className="give-icon"><Heart size={34} strokeWidth={1.5} /></div>
          <div>
            <h2>Supporting children through golf.</h2>
            <p>The 2026 Christmas edition supports Breadline Africa, which has provided classrooms, libraries, toilets and kitchens for children since 1993.</p>
          </div>
          <div className="give-facts">
            <p><small>When</small><strong>21 November, 3:30 pm</strong></p>
            <p><small>Entry</small><strong>R148 adults, R85 juniors</strong></p>
            <p><small>Registration closes</small><strong>16 November at 4 pm</strong></p>
          </div>
          <div className="give-actions">
            <a href="mailto:events@puremotiongolf.com?subject=AIMtoGIVE%20enquiry" className="button">Ask about AIMtoGIVE</a>
            <a href="https://breadlineafrica.org/make-a-donation/" target="_blank" rel="noreferrer">Donate directly <ExternalLink size={16} /></a>
          </div>
        </div>
      </section>

      <section className="section calendar-section" id="calendar">
        <div className="site-shell">
          <div className="events-section-head">
            <div><h2>Academy calendar.</h2></div>
            <p>Use the calendar for events, academy dates and maintenance notices. Dates and times may change.</p>
          </div>
          <div className="calendar-frame-wrap">
            <iframe src={calendarUrl} title="Pure Motion Golf Academy calendar" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section results-section" id="results">
        <div className="site-shell">
          <div className="events-section-head light-head">
            <div><h2>Follow the competition.</h2></div>
            <p>Open official tournament fixtures, follow junior results and explore recent academy achievements.</p>
          </div>
          <div className="results-link-grid">
            <a href="https://rsa.cw.za.prod.dotgolf.co.za/" target="_blank" rel="noreferrer"><strong>GolfRSA</strong><span>National fixtures and results</span><ExternalLink size={17} /></a>
            <a href="https://western-province.cw.za.prod.dotgolf.co.za/" target="_blank" rel="noreferrer"><strong>Western Province</strong><span>Provincial fixtures and results</span><ExternalLink size={17} /></a>
            <a href="https://www.golfgenius.com/leagues/10540232385570557285/customer_directories/10540279646082059317/directory_iframe?league=10540232385570557285" target="_blank" rel="noreferrer"><strong>WP Juniors</strong><span>Junior tournament directory</span><ExternalLink size={17} /></a>
            <a href="https://boland.cw.za.prod.dotgolf.co.za/" target="_blank" rel="noreferrer"><strong>Boland Golf</strong><span>Regional fixtures and results</span><ExternalLink size={17} /></a>
          </div>
          <div className="achievement-head"><Camera size={22} /><h3>Junior achievements</h3><a href="https://www.instagram.com/puremotiongolf/" target="_blank" rel="noreferrer">More on Instagram <ExternalLink size={15} /></a></div>
          <div className="achievement-grid">
            {achievements.map(([name, result]) => <article key={name}><Trophy size={19} /><strong>{name}</strong><span>{result}</span></article>)}
          </div>
        </div>
      </section>

      <section className="section feedback-section" id="feedback">
        <div className="site-shell feedback-grid">
          <div>
            <Star size={27} fill="currentColor" />
            <h2>Share your experience.</h2>
            <p>Feedback helps the academy improve its coaching, programmes and events.</p>
            <a href="https://search.google.com/local/writereview?placeid=ChIJF-otSx9XzB0RU3WxobwFyYE" target="_blank" rel="noreferrer" className="button button-outline">Review Pure Motion <ExternalLink size={17} /></a>
          </div>
          <blockquote>
            “Pure Motion Academy are incredible with the kids. Coaches are all skilled and very professional.”
            <cite>Jonathan Van Schalkwyk</cite>
          </blockquote>
        </div>
      </section>

      <section className="final-cta">
        <div className="site-shell final-cta-inner">
          <div><MessageCircle size={28} strokeWidth={1.5} /><h2>Need help choosing where to start?</h2></div>
          <a href="https://wa.me/27762470501?text=Hi%20I%20need%20help%20choosing%20the%20right%20option" target="_blank" rel="noreferrer" className="button button-dark">Talk to the academy <ArrowRight size={19} /></a>
        </div>
      </section>
    </main>
  );
}
