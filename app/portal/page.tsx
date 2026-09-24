import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { signIn } from "@/app/auth/actions";
import { ToastMessage } from "@/components/toast-message";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  if (claims) redirect("/dashboard");

  return (
    <main id="main-content" className="portal-page">
      <ToastMessage error={error} message={message} />
      <div className="portal-shell">
        <section className="portal-promise">
          <h1>Everything around your coaching, in one place.</h1>
        </section>
        <section className="sign-in-card">
          <h2>Welcome back.</h2>
          <p>Sign in to your Pure Motion account.</p>
          {!configured && <p className="portal-alert">The portal UI is ready. Add the Supabase project URL and publishable key to activate sign-in.</p>}
          <form action={signIn}>
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" minLength={8} required />
            <PendingSubmitButton pendingLabel="Signing in…" disabled={!configured}>
              Sign in <ArrowRight size={18} />
            </PendingSubmitButton>
          </form>
          <p className="portal-help">New to Pure Motion? <Link href="/portal/register">Create your account</Link></p>
        </section>
      </div>
    </main>
  );
}
