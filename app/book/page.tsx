import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = {
  title: "Book a Golf Lesson",
  description:
    "Choose your golf lesson, Pure Motion location, coach and preferred appointment time.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book a Golf Lesson | Pure Motion Golf",
    description: "Find the right lesson, coach and time at Pure Motion Golf Academy.",
    url: "/book",
  },
};

type BookingPageProps = {
  searchParams: Promise<{ service?: string; coach?: string; location?: string }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  return (
    <main id="main-content" className="booking-page">
      <div className="site-shell booking-page-intro">
        <h1>Let’s find your next lesson.</h1>
        <p>Four simple choices. No long forms and no waiting for someone to call you back.</p>
      </div>
      <div className="site-shell">
        <BookingFlow
          initialService={params.service}
          initialCoach={params.coach}
          initialLocation={params.location}
        />
      </div>
    </main>
  );
}
