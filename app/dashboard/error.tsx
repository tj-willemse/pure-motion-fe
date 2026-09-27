"use client";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <section className="dashboard-content" role="alert">
      <h1>We couldn’t load your dashboard</h1>
      <p>Please try again. If this continues, contact the academy.</p>
      <button type="button" onClick={reset}>Try again</button>
    </section>
  );
}
