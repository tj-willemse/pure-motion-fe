import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteUrl } from "@/lib/site";
import { AcademyRegistrationForm } from "./registration-form";

export const metadata: Metadata = {
  title: "2026 Junior Academy Registration",
  description: "Register or re-enrol a junior for the 2026 Pure Motion Junior Academy.",
  alternates: { canonical: "/juniors/academy-registration" },
  openGraph: {
    title: "2026 Junior Academy Registration | Pure Motion Golf",
    description: "Complete the 2026 Junior Academy registration form.",
    url: `${siteUrl}/juniors/academy-registration`,
  },
};

export default async function AcademyRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main id="main-content" className="academy-form-page">
      <section className="academy-form-hero">
        <div className="site-shell academy-form-hero-inner">
          <Link href="/juniors/academy-terms" className="academy-form-back">
            <ArrowLeft size={17} aria-hidden="true" /> Fees, schedules and terms
          </Link>
          <span className="academy-terms-kicker">Junior Academy · 2026</span>
          <h1>JAM registration.</h1>
          <p>Complete one form per child. Your preferences help the team confirm the right programme, coach and schedule.</p>
        </div>
      </section>
      <section className="section academy-form-section">
        <div className="site-shell">
          {params.message && <div className="academy-form-notice success" role="status">{params.message}</div>}
          {params.error && <div className="academy-form-notice error" role="alert">{params.error}</div>}
          <AcademyRegistrationForm />
        </div>
      </section>
    </main>
  );
}
