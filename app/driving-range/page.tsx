import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  CircleDollarSign,
  Clock3,
  Fingerprint,
  Flag,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Durbanville Golf Driving Range and Packages",
  description:
    "View Durbanville Golf Club driving range facilities, 2026 bucket prices, member packages and biometric access information.",
  alternates: { canonical: "/driving-range" },
  openGraph: {
    title: "Durbanville Golf Driving Range | Pure Motion Golf",
    description: "Driving range facilities, bucket prices and 2026 member packages.",
    url: "/driving-range",
  },
};

const packages = [
  { name: "Bronze", buckets: 30, price: 842 },
  { name: "Silver", buckets: 50, price: 1351 },
  { name: "Gold", buckets: 125, price: 2711 },
  { name: "Platinum", buckets: 230, price: 4078 },
  { name: "Premium", buckets: 390, price: 5858 },
] as const;

const singleBuckets = [
  { balls: 34, price: 57 },
  { balls: 68, price: 100 },
  { balls: 102, price: 140 },
] as const;

const formatRand = (amount: number) => `R${amount.toLocaleString("en-ZA")}`;

export default function DrivingRangePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Durbanville Golf Club Driving Range",
    url: `${siteUrl}/driving-range`,
    sport: "Golf",
    telephone: "+27762470501",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sport Way",
      addressLocality: "Durbanville",
      postalCode: "7550",
      addressRegion: "Western Cape",
      addressCountry: "ZA",
    },
    operator: { "@type": "Organization", name: "Pure Motion Golf Academy", url: siteUrl },
  };

  return (
    <main id="main-content" className="range-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="range-hero">
        <Image
          className="range-hero-background"
          src="/images/home/driving-range-hero.webp"
          alt="Golf ball beside a hole on a practice green"
          fill
          priority
          sizes="100vw"
        />
        <div className="site-shell range-hero-grid">
          <div className="range-hero-copy reveal">
            <h1>More practice.<br />Better motion.</h1>
            <p>A purpose built range for warming up, focused practice and building consistency between lessons.</p>
            <div className="range-hero-facts" aria-label="Driving range overview">
              <span><strong>13</strong> Open air bays</span>
              <span><strong>7</strong> Days a week</span>
              <span><strong>Daylight</strong> Opening hours</span>
            </div>
            <div className="range-hero-actions">
              <a href="#packages" className="button button-small">View range packages <ArrowRight size={18} /></a>
              <a href="https://www.google.com/maps?ll=-33.834205,18.659658&z=18&t=m&hl=en-GB&gl=US&mapclient=apiv3&cid=9352012408936297811" target="_blank" rel="noreferrer" className="range-text-link"><MapPin size={17} /> Get directions</a>
            </div>
          </div>
        </div>
      </section>
      <div className="section-nav-sticky">
        <nav className="site-shell range-section-nav" aria-label="Driving range sections">
          {[
            ["Facilities", "#facilities", Target],
            ["Bucket prices", "#bucket-prices", CircleDollarSign],
            ["Packages", "#packages", BadgeCheck],
            ["How it works", "#how-it-works", Fingerprint],
            ["Sharing", "#sharing", UsersRound],
          ].map(([label, href, Icon]) => (
            <a href={href as string} key={href as string}>
              <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
              <strong>{label as string}</strong>
            </a>
          ))}
        </nav>
      </div>

      <section className="section range-facilities-section" id="facilities">
        <div className="site-shell">
          <div className="range-section-head">
            <div><h2>Everything needed for focused practice.</h2></div>
            <p>Pure Motion manages the driving range at Durbanville Golf Club for club members and playing visitors.</p>
          </div>
          <div className="range-facility-grid">
            {[
              ["13", "Open air bays", "Space to warm up or work through a complete practice session."],
              ["01", "Putting green", "A spacious surface for pace, start line and confidence work."],
              ["02", "Short game areas", "A chipping area and practice bunker for scoring shots."],
              ["07", "Days a week", "The range is available during daylight hours outside closures."],
            ].map(([number, title, copy]) => (
              <article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
          <div className="range-hours-panel">
            <div><Clock3 size={24} /><span><strong>Ball sales</strong><small>Until 5:30 pm from the Pure Motion office</small></span></div>
            <div><CalendarClock size={24} /><span><strong>Scheduled maintenance</strong><small>Normally every second Sunday from 3:30 pm until Monday at 7:00 am</small></span></div>
            <div><CircleDollarSign size={24} /><span><strong>Payment on site</strong><small>Card or SnapScan at the office</small></span></div>
          </div>
        </div>
      </section>

      <section className="section bucket-price-section" id="bucket-prices">
        <div className="site-shell bucket-price-grid">
          <div className="bucket-price-copy">
            <h2>Buy only what you need today.</h2>
            <p>Single buckets are available from the Pure Motion office. Regular players can save more with a member package.</p>
            <a href="#packages">Compare packages <ArrowRight size={17} /></a>
          </div>
          <div className="single-bucket-list">
            {singleBuckets.map((bucket) => (
              <article key={bucket.balls}>
                <div className="bucket-ball" aria-hidden="true" />
                <span><strong>{bucket.balls}</strong><small>balls</small></span>
                <strong>{formatRand(bucket.price)}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section range-package-section" id="packages">
        <div className="site-shell">
          <div className="range-section-head light-range-head">
            <div><h2>Practise more for less.</h2></div>
            <p>Packages are available only to active Durbanville Golf Club members and are valid until 31 December 2026.</p>
          </div>
          <div className="range-package-grid">
            {packages.map((rangePackage, index) => {
              const standardCost = rangePackage.buckets * 57;
              const saving = standardCost - rangePackage.price;
              const perBucket = Math.round((rangePackage.price / rangePackage.buckets) * 100) / 100;
              return (
                <article className={rangePackage.name === "Gold" ? "featured-range-package" : undefined} key={rangePackage.name}>
                  <div className="range-package-top"><span>0{index + 1}</span>{rangePackage.name === "Gold" && <small>Popular</small>}</div>
                  <h3>{rangePackage.name}</h3>
                  <p><strong>{rangePackage.buckets}</strong> buckets of 34 balls</p>
                  <div className="range-package-price"><strong>{formatRand(rangePackage.price)}</strong><span>{formatRand(perBucket)} per bucket</span></div>
                  <div className="range-package-saving">Save {formatRand(saving)} against single buckets</div>
                  <a href={`mailto:drivingrange@puremotiongolf.com?subject=${rangePackage.name}%202026%20range%20package`}>
                    Choose {rangePackage.name} <ArrowRight size={17} />
                  </a>
                </article>
              );
            })}
          </div>
          <div className="package-eligibility-note">
            <ShieldCheck size={25} />
            <div><strong>Durbanville Golf Club membership is required.</strong><p>Playing or social membership must remain active. Contact the club before purchasing if you are not yet a member.</p></div>
            <a href="mailto:admin@durbanvillegc.co.za?subject=New%20DGC%20Membership%20enquiry%20from%20Pure%20Motion%20Golf&cc=drivingrange@puremotiongolf.com">Ask about DGC membership <Mail size={16} /></a>
          </div>
        </div>
      </section>

      <section className="section range-process-section" id="how-it-works">
        <div className="site-shell">
          <div className="range-section-head">
            <div><h2>From package to practice in four steps.</h2></div>
            <p>A registered fingerprint gives package holders access to the RangeServant ball machine outside office hours.</p>
          </div>
          <div className="range-process-grid">
            {[
              ["01", "Choose", "Select the package that suits how often you practise."],
              ["02", "Pay", "Complete payment and receive confirmation of your purchase."],
              ["03", "Register", "Visit the Pure Motion office to register your fingerprint."],
              ["04", "Practise", "Use your fingerprint at the ball machine to collect buckets."],
            ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section package-sharing-section" id="sharing">
        <div className="site-shell package-sharing-grid">
          <div className="sharing-copy">
            <h2>Add family or friends.</h2>
            <p>Package holders may add family or friends who are also Durbanville Golf Club members. Each additional user registers a fingerprint against the same package balance.</p>
            <ul>
              <li><Check size={17} /> Every additional user must be a DGC member</li>
              <li><Check size={17} /> All buckets are deducted from the holder&apos;s package</li>
              <li><Check size={17} /> The system cannot identify which fingerprint collected a bucket</li>
              <li><Check size={17} /> The holder must explain the range rules to every user</li>
            </ul>
            <Link href="/login" className="button button-light">Manage package users <ArrowRight size={18} /></Link>
          </div>
          <aside className="range-terms-card">
            <Fingerprint size={28} strokeWidth={1.5} />
            <h3>Important package terms</h3>
            <ul>
              <li>All 2026 packages expire on 31 December 2026.</li>
              <li>Unused buckets are forfeited after the expiry date.</li>
              <li>Packages are processed after documentation and payment are complete.</li>
              <li>No refund applies if membership was not confirmed before purchase.</li>
              <li>Replacement tags cost R169 in 2026.</li>
              <li>Range closures may occur for maintenance, repairs or events.</li>
              <li>Use of the range and practice areas is at the golfer&apos;s own risk.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="final-cta">
        <div className="site-shell final-cta-inner">
          <div><Flag size={28} strokeWidth={1.5} /><h2>Ready to spend more time practising?</h2></div>
          <div className="final-cta-actions">
            <a href="https://wa.me/27762470501?text=Hi%20I%20have%20a%20driving%20range%20question" target="_blank" rel="noreferrer" className="final-whatsapp-link"><MessageCircle size={18} /> Ask a question</a>
            <a href="#packages" className="button button-dark">Choose a package <ArrowRight size={19} /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
