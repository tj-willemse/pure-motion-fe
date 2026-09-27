import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { registrationAccount } from "@/lib/registration-account";

export const metadata: Metadata = { title: "Book a Golf Lesson", robots: { index: false, follow: false } };
export default async function BookingPage({ searchParams }: { searchParams: Promise<{ service?: string; coach?: string; location?: string }> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const field of ["service", "coach", "location"] as const) if (typeof params[field] === "string") query.set(field, params[field]);
  await registrationAccount(`/book${query.size ? `?${query}` : ""}`);
  redirect(`/dashboard/bookings${query.size ? `?${query}` : ""}`);
}
