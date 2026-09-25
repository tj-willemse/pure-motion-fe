import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegistrationForm } from "@/app/portal/register/registration-form";
import { ToastMessage } from "@/components/toast-message";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
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
    <main id="main-content" className="portal-page auth-page auth-register-page">
      <ToastMessage error={error} />
      <div className="portal-shell portal-shell-compact auth-shell">
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
            <h1>Your golf household, organised.</h1>
            <p>One account for your profile, family golfers and bookings.</p>
          </div>
        </section>
        <section className="sign-in-card auth-card">
          <div className="auth-form-wrap">
            <h2>Create your account.</h2>
            <p>Start with the parent, guardian or adult golfer&apos;s details.</p>
            {!configured && <p className="portal-alert">Supabase connection details are still required before registration can be used.</p>}
            {configured && <SocialAuthButtons />}
            <RegistrationForm configured={configured} />
            <Link href="/" className="button button-outline auth-back-button">
              <ArrowLeft size={18} aria-hidden="true" /> Back to website
            </Link>
            <p className="portal-help">Already registered? <Link href="/login">Sign in</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
