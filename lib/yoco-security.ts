import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyYocoWebhook(body: string, headers: Headers, secret: string, now = Date.now()) {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatures = headers.get("webhook-signature");
  if (!id || !timestamp || !/^\d+$/.test(timestamp) || !signatures || !secret.startsWith("whsec_")) return false;
  if (Math.abs(now / 1000 - Number(timestamp)) > 180) return false;
  const expected = createHmac("sha256", Buffer.from(secret.slice(6), "base64"))
    .update(`${id}.${timestamp}.${body}`).digest();
  return signatures.split(" ").some((signature) => {
    const [version, value] = signature.split(",");
    if (version !== "v1" || !value) return false;
    const received = Buffer.from(value, "base64");
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
}

export function signPaymentLink(id: string, secret: string) {
  return `${id}.${createHmac("sha256", secret).update(`oom:${id}`).digest("base64url")}`;
}

export function verifyPaymentLink(token: string, secret: string) {
  const [id] = token.split(".");
  if (!/^[0-9a-f-]{36}$/i.test(id) || token.length > 100) return null;
  const expected = Buffer.from(signPaymentLink(id, secret));
  const actual = Buffer.from(token);
  return expected.length === actual.length && timingSafeEqual(actual, expected) ? id : null;
}
