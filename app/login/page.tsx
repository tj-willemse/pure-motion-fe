import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { signIn } from "@/app/auth/actions";
import { ToastMessage } from "@/components/toast-message";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { PasswordInput } from "@/components/password-input";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to view and manage your Pure Motion Golf lessons and account.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;
  const configured = isSupabaseConfigured();
  const supabase = configured ? await createClient() : null;
  const claims = supabase ? (await supabase.auth.getClaims()).data?.claims : null;

  if (claims) redirect("/dashboard");

  return (
    <main id="main-content" className="portal-page auth-page">
      <ToastMessage error={error} message={message} />
      <div className="portal-shell auth-shell">
        <section className="portal-promise auth-promise">
          <Link href="/" className="auth-brand" aria-label="Back to Pure Motion Golf">
            <Image
              src="/brand/pure-motion-wordmark.webp"
              alt="Pure Motion Golf Academy"
              width={2025}
              height={573}
              priority
            />
          </Link>
          <div className="auth-promise-copy">
            <h1>Everything around your coaching, in one place.</h1>
            <p>Bookings, family golfers and coaching details—kept together.</p>
          </div>
        </section>
        <section className="sign-in-card auth-card">
          <div className="auth-form-wrap">
            <h2>Welcome back.</h2>
            <p>Sign in to your Pure Motion account.</p>
            {!configured && <p className="portal-alert">The portal UI is ready. Add the Supabase project URL and publishable key to activate sign-in.</p>}
            <form action={signIn}>
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
              <label htmlFor="password">Password</label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                minLength={8}
              />
              <PendingSubmitButton pendingLabel="Signing in…" disabled={!configured}>
                Sign in <ArrowRight size={18} />
              </PendingSubmitButton>
            </form>
            <p className="portal-help">New to Pure Motion? <Link href="/register">Create your account</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
