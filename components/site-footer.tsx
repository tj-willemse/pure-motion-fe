import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, MessageCircle, Phone } from "lucide-react";
import { navItems } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div className="footer-brand">
          <Image
            src="/brand/pure-motion-wordmark.webp"
            alt="Pure Motion Golf Academy"
            width={2025}
            height={573}
            loading="eager"
          />
          <p>Personal coaching. Clear progress. A better game.</p>
          <Link href="/book" className="footer-cta">
            Book a lesson <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <div className="footer-links">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="footer-label">Locations</p>
          <div className="footer-links">
            <Link href="/#locations">Durbanville Golf Club<br /><span>Sport Way, Durbanville</span></Link>
            <Link href="/#locations">Hazendal Golf<br /><span>Bottelary Road, Stellenbosch</span></Link>
          </div>
        </div>
        <div>
          <p className="footer-label">Contact</p>
          <div className="footer-links footer-contact-links">
            <a href="tel:+27762470501"><Phone size={15} aria-hidden="true" /> 076 247 0501</a>
            <a href="https://wa.me/27762470501?text=Hi%20I%20have%20a%20question" target="_blank" rel="noreferrer"><MessageCircle size={15} aria-hidden="true" /> WhatsApp us</a>
          </div>
          <div className="footer-socials" aria-label="Pure Motion social media">
            <a href="https://www.facebook.com/puremotiongolf" target="_blank" rel="noreferrer" aria-label="Pure Motion Golf on Facebook"><Facebook size={17} /></a>
            <a href="https://www.instagram.com/puremotiongolf/" target="_blank" rel="noreferrer" aria-label="Pure Motion Golf on Instagram"><Instagram size={17} /></a>
            <a href="https://twitter.com/PureMotionGolf" target="_blank" rel="noreferrer" aria-label="Pure Motion Golf on X"><span aria-hidden="true">X</span></a>
          </div>
        </div>
        <div>
          <p className="footer-label">Hours</p>
          <div className="footer-hours">
            <p><strong>Durbanville</strong><span>Mon to Fri, 7:00 to 17:30</span><span>Weekends, 7:00 to 16:00</span></p>
            <p><strong>Hazendal</strong><span>Mon to Fri, 7:00 to 17:00</span><span>Sat 7:00 to 16:00, Sun 8:00 to 14:00</span></p>
          </div>
        </div>
      </div>
      <div className="site-shell footer-bottom">
        <span>© {new Date().getFullYear()} Pure Motion Golf Academy</span>
        <div>
          <a href="https://puremotiongolf.com/privacy-policy/">Privacy Policy</a>
          <a href="https://puremotiongolf.com/cookie-policy-za/">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
