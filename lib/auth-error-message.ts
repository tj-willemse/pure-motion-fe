type AuthOperation = "signup" | "signin" | "recovery" | "password";
type AuthFailure = { code?: string; status?: number; name?: string };

// Never display provider messages: they can contain internal details or user data.
export function authErrorMessage(error: AuthFailure, operation: AuthOperation): string {
  const messages: Record<string, string> = {
    validation_failed: "Some details weren’t accepted. Check your email address and password, then try again.",
    reauthentication_not_valid: "We couldn’t verify this request. Please sign in again or request a new password reset link.",
    over_email_send_rate_limit: "We’ve reached our email sending limit. Please try again later. If you already received a link, use that one.",
    over_request_rate_limit: "There have been too many attempts. Please wait a few minutes before trying again.",
    email_address_invalid: "That email address isn’t accepted. Check it for spelling mistakes or use another email address.",
    email_address_not_authorized: "We can’t send account emails to this address yet. Please contact the academy for help.",
    email_not_confirmed: "Please confirm your email before signing in. Check your inbox and spam folder for the confirmation link.",
    provider_email_needs_verification: "Please verify your email with your sign-in provider before continuing.",
    invalid_credentials: "The email address or password is incorrect. Check both, or use Forgot password to reset it.",
    weak_password: "Choose a stronger password: at least 10 characters with uppercase and lowercase letters, a number and a symbol.",
    same_password: "Choose a new password that’s different from your current one.",
    signup_disabled: "New accounts are temporarily unavailable. Please try again later or contact the academy.",
    email_provider_disabled: "Email sign-in is temporarily unavailable. Please contact the academy for help.",
    user_banned: "This account is currently unavailable. Please contact the academy for help.",
    captcha_failed: "The security check didn’t finish. Refresh the page and try again.",
    request_timeout: "This is taking longer than expected. Check your connection and try again.",
    hook_timeout: "We couldn’t finish your request in time. Please try again shortly.",
    hook_timeout_after_retry: "We couldn’t finish your request in time. Please try again shortly.",
    session_expired: "Your session has expired. Please sign in again. If you’re resetting your password, request a new reset link.",
    session_not_found: "Your session has ended. Please sign in again or request a new password reset link.",
    otp_expired: "This link has expired or has already been used. Please request a new one.",
    flow_state_expired: "This link has expired. Please request a new one.",
    flow_state_not_found: "We couldn’t open this link. Request a new one and open it in the browser you used to request it.",
    bad_code_verifier: "Open this link in the browser you used to request it, or request a new link here.",
    reauthentication_needed: "Please sign in again before changing your password.",
  };
  if (["email_exists", "user_already_exists"].includes(error.code ?? "")) {
    return operation === "recovery"
      ? "If an account exists for this email, you’ll receive a reset link. Please check your inbox."
      : "An account with this email already exists. Sign in, or use Forgot password if you need a new password.";
  }
  if (error.code === "user_not_found") return operation === "signin"
    ? messages.invalid_credentials
    : "We couldn’t verify your account. Please sign in again or request a new password reset link.";
  if (error.code && messages[error.code]) return messages[error.code];
  if (error.status === 429) return messages.over_request_rate_limit;
  if (error.name === "AuthRetryableFetchError" || error.status === 0) return "We couldn’t reach the sign-in service. Check your connection and try again shortly.";
  const fallback = {
    signup: "We couldn’t finish creating your account because something went wrong on our side. Please try again later, or contact the academy if it continues.",
    signin: "Sign-in is temporarily unavailable. Please try again shortly.",
    recovery: "We couldn’t send your reset email right now. Please try again later or contact the academy.",
    password: "We couldn’t save your new password right now. Please try again shortly, or request a new reset link.",
  };
  return fallback[operation];
}
