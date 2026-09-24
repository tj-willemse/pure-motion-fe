import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, LockKeyhole, LogOut, UserRound } from "lucide-react";
import { signIn, signOut } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Customer Portal",
  description: "Sign in to view and manage your Pure Motion Golf lessons and account.",
  alternates: { canonical: "/portal" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PortalPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const { error, message } = await searchParams;
  const configured = isSupabaseConfigured();
  const supabase = configured ? await createClient() : null;
  const claims = supabase ? (await supabase.auth.getClaims()).data?.claims : null;

  let profile: { first_name: string | null; last_name: string | null } | null = null;
  let roles: string[] = [];

  if (supabase && claims?.sub) {
    const [profileResult, roleResult] = await Promise.all([
      supabase.from("profiles").select("first_name,last_name").eq("id", claims.sub).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", claims.sub),
    ]);
    profile = profileResult.data;
    roles = roleResult.data?.map(({ role }) => role) ?? [];
  }

  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");

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
        {claims ? (
          <section className="sign-in-card portal-account-card">
            <div className="prototype-pill">Account connected</div>
            <p className="portal-eyebrow">Signed in as</p>
            <h2>{displayName || claims.email || "Pure Motion member"}</h2>
            <p>{claims.email}</p>
            <div className="portal-account-summary">
              <div><span>Access</span><strong>{roles.length ? roles.join(", ") : "Client"}</strong></div>
              <div><span>Bookings</span><strong>Calendar connection next</strong></div>
              <div><span>Profile</span><strong>{profile ? "Ready" : "Database migration required"}</strong></div>
            </div>
            <form action={signOut}>
              <button className="button button-outline" type="submit">Sign out <LogOut size={17} /></button>
            </form>
          </section>
        ) : (
          <section className="sign-in-card">
            <div className="prototype-pill">Secure portal</div>
            <h2>Welcome back.</h2>
            <p>Sign in to your Pure Motion account.</p>
            {error && <p className="portal-alert portal-alert-error">{error}</p>}
            {message && <p className="portal-alert portal-alert-success">{message}</p>}
            {!configured && <p className="portal-alert">The portal UI is ready. Add the Supabase project URL and publishable key to activate sign-in.</p>}
            <form action={signIn}>
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" minLength={8} required />
              <button className="button" type="submit" disabled={!configured}>Sign in <ArrowRight size={18} /></button>
            </form>
            <p className="portal-help">New to Pure Motion? <Link href="/portal/register">Create your account</Link></p>
          </section>
        )}
      </div>
    </main>
  );
}
