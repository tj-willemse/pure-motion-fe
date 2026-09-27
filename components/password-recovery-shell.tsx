import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export function PasswordRecoveryShell({ children }: { children: ReactNode }) {
  return <main id="main-content" className="portal-page auth-page"><div className="portal-shell auth-shell">
    <section className="portal-promise auth-promise">
      <Link href="/" className="auth-brand" aria-label="Back to Pure Motion Golf"><Image src="/brand/pure-motion-wordmark.webp" alt="Pure Motion Golf Academy" width={2025} height={573} priority /></Link>
      <div className="auth-promise-copy"><h1>Back to your account.</h1><p>Reset your password to access your bookings and registrations.</p></div>
    </section>
    <section className="sign-in-card auth-card"><div className="auth-form-wrap">{children}</div></section>
  </div></main>;
}
