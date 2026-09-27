import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyYocoWebhook, signPaymentLink, verifyPaymentLink } from "../lib/yoco-security.ts";

const secret = `whsec_${Buffer.from("test-webhook-secret").toString("base64")}`;
const now = 1_800_000_000_000;
const body = JSON.stringify({ type: "payment.succeeded", payload: { amount: 3500 } });
function headers(timestamp = String(now / 1000), payload = body) {
  const signature = createHmac("sha256", Buffer.from(secret.slice(6), "base64"))
    .update(`evt-test.${timestamp}.${payload}`).digest("base64");
  return new Headers({ "webhook-id": "evt-test", "webhook-timestamp": timestamp, "webhook-signature": `v1,${signature}` });
}
test("accepts a valid signed raw body", () => assert.equal(verifyYocoWebhook(body, headers(), secret, now), true));
test("rejects tampered amounts", () => assert.equal(verifyYocoWebhook(body.replace("3500", "1"), headers(), secret, now), false));
test("rejects old and future signatures", () => {
  for (const offset of [-181, 181]) assert.equal(verifyYocoWebhook(body, headers(String(now / 1000 + offset)), secret, now), false);
});
test("rejects missing headers and wrong secrets", () => {
  assert.equal(verifyYocoWebhook(body, new Headers(), secret, now), false);
  assert.equal(verifyYocoWebhook(body, headers(), "whsec_d3Jvbmc=", now), false);
});
test("accepts a matching signature in a rotation list", () => {
  const h = headers(); h.set("webhook-signature", `v1,YmFk ${h.get("webhook-signature")}`);
  assert.equal(verifyYocoWebhook(body, h, secret, now), true);
});
test("payment links cannot be forged by changing the registration", () => {
  const id = "10000000-0000-4000-8000-000000000001";
  const token = signPaymentLink(id, "private-secret");
  assert.equal(verifyPaymentLink(token, "private-secret"), id);
  assert.equal(verifyPaymentLink(token.replace("10000000", "20000000"), "private-secret"), null);
  assert.equal(verifyPaymentLink(token, "other-secret"), null);
  assert.equal(verifyPaymentLink(id, "private-secret"), null);
});
