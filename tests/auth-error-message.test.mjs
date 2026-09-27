import test from "node:test";
import assert from "node:assert/strict";
import { authErrorMessage } from "../lib/auth-error-message.ts";

test("distinguishes email limits, duplicate accounts and service errors", () => {
  assert.match(authErrorMessage({ code: "over_email_send_rate_limit" }, "signup"), /email sending limit/);
  assert.match(authErrorMessage({ code: "user_already_exists" }, "signup"), /already exists/);
  assert.doesNotMatch(authErrorMessage({ code: "unexpected_failure", status: 500 }, "signup"), /already exists|already registered/);
});
test("never returns internal provider messages", () => {
  const message = authErrorMessage({ code: "unknown_error", message: "SQL private details" }, "signup");
  assert.doesNotMatch(message, /SQL|private details|unknown_error/);
});
test("handles rate limits and connection failures", () => {
  assert.match(authErrorMessage({ status: 429 }, "signup"), /too many attempts/);
  assert.match(authErrorMessage({ name: "AuthRetryableFetchError" }, "signin"), /connection/);
});
test("keeps sign-in credential failures ambiguous", () => {
  assert.equal(authErrorMessage({ code: "user_not_found" }, "signin"), authErrorMessage({ code: "invalid_credentials" }, "signin"));
});
test("explains password requirements and reset failures", () => {
  assert.match(authErrorMessage({ code: "same_password" }, "password"), /different/);
  assert.match(authErrorMessage({ code: "weak_password" }, "signup"), /10 characters/);
  assert.match(authErrorMessage({ code: "otp_expired" }, "recovery"), /new one/);
});
