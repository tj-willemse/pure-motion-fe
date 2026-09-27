import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { resetPassword } from "@/app/auth/actions";
import { PasswordRecoveryShell } from "@/components/password-recovery-shell";
import { PasswordInput } from "@/components/password-input";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth-next";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const query = await searchParams;
  const next = safeNext(query.next);
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(`/forgot-password?next=${encodeURIComponent(next)}&error=${encodeURIComponent("Open a valid reset link from your email to continue.")}`);
  return <PasswordRecoveryShell>
    <h2>Set a new password.</h2><p>Use at least 10 characters, including uppercase and lowercase letters, a number and a symbol.</p>
    {query.error && <p role="alert">{query.error}</p>}
    <form action={resetPassword}>
      <input type="hidden" name="next" value={next} />
      <label htmlFor="password">New password</label>
      <PasswordInput id="password" name="password" autoComplete="new-password" minLength={10} />
      <PendingSubmitButton pendingLabel="Updating password…">Update password</PendingSubmitButton>
    </form>
  </PasswordRecoveryShell>;
}
