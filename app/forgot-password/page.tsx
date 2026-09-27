import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { PasswordRecoveryShell } from "@/components/password-recovery-shell";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { safeNext } from "@/lib/auth-next";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false, follow: false } };
export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; message?: string }> }) {
  const query = await searchParams;
  const next = safeNext(query.next);
  return <PasswordRecoveryShell>
    <h2>Forgot your password?</h2><p>Enter your account email and we’ll send you a reset link.</p>
    {query.error && <p role="alert">{query.error}</p>}
    {query.message && <p role="status">{query.message}</p>}
    <form action={requestPasswordReset}>
      <input type="hidden" name="next" value={next} />
      <label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required />
      <PendingSubmitButton pendingLabel="Sending reset link…" disabled={!isSupabaseConfigured()}>Send reset link</PendingSubmitButton>
    </form>
    <p className="portal-help"><Link href={`/login?next=${encodeURIComponent(next)}`}>Back to sign in</Link></p>
  </PasswordRecoveryShell>;
}
