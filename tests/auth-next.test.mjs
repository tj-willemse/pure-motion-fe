import test from "node:test";
import assert from "node:assert/strict";
import { safeNext } from "../lib/auth-next.ts";

test("preserves local forms and booking selections", () => {
  for (const path of ["/dashboard/payments", "/juniors/order-of-merit#registration", "/book?service=junior-assessment&location=hazendal"]) assert.equal(safeNext(path), path);
});
test("rejects external and malformed return destinations", () => {
  for (const path of [undefined, null, "https://evil.example", "//evil.example", "/\\evil.example", "/\nevil.example", "/auth/callback"]) assert.equal(safeNext(path), "/dashboard");
});
