import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, LockKeyhole, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Portal",
  description: "Sign in to view and manage your Pure Motion Golf lessons and account.",
  alternates: { canonical: "/portal" },
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return (
    <main id="main-content" className="portal-page">
      <div className="portal-shell">
        <section className="portal-promise">
          <h1>Everything around your coaching, in one place.</h1>
          <div className="portal-benefits">
            <div><CalendarDays size={21} /><span><strong>Upcoming sessions</strong><small>View dates, times and locations.</small></span></div>
            <div><UserRound size={21} /><span><strong>Your coaching account</strong><small>Manage your details and booking history.</small></span></div>
            <div><LockKeyhole size={21} /><span><strong>Secure access</strong><small>Your personal information stays protected.</small></span></div>
          </div>
        </section>
        <section className="sign-in-card">
          <div className="prototype-pill">Interface preview</div>
          <h2>Welcome back.</h2>
          <p>Sign in to your Pure Motion account.</p>
          <form>
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" />
            <button className="button" type="button">Sign in <ArrowRight size={18} /></button>
          </form>
          <p className="portal-help">New to Pure Motion? <Link href="/book">Book your first lesson</Link></p>
        </section>
      </div>
    </main>
  );
}
