import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { register } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Create a secure Pure Motion Golf customer account.",
  robots: { index: false, follow: false },
};

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <main id="main-content" className="portal-page">
      <div className="portal-shell portal-shell-compact">
        <section className="portal-promise">
          <h1>Your golf household, organised.</h1>
        </section>
        <section className="sign-in-card">
          <h2>Create your account.</h2>
          <p>Start with the parent, guardian or adult golfer&apos;s details.</p>
          {error && <p className="portal-alert portal-alert-error">{error}</p>}
          {!configured && <p className="portal-alert">Supabase connection details are still required before registration can be used.</p>}
          <form action={register}>
            <label htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" type="text" autoComplete="given-name" required />
            <label htmlFor="lastName">Surname</label>
            <input id="lastName" name="lastName" type="text" autoComplete="family-name" required />
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
            <button className="button" type="submit" disabled={!configured}>Create account <ArrowRight size={18} /></button>
          </form>
          <p className="portal-help">Already registered? <Link href="/portal">Sign in</Link></p>
        </section>
      </div>
    </main>
  );
}
