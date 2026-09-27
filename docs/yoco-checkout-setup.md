# Yoco Checkout — Order of Merit

## Current scope

Order of Merit registrations now lead to a private payment page, then Yoco-hosted checkout. Card details never pass through this app. Amounts come from the saved server-priced registration, not browser totals. The same payment record is reused with a stable provider idempotency key.

Signed webhooks reconcile payment status atomically and deduplicate events. Live, timely payments confirm held rounds. Late payments are recorded as paid but require review rather than reclaiming released capacity. Test payments are labelled and **do not confirm live entries**. JAM membership payments and generic lesson bookings are not connected by this change.

## Manual setup (no remote changes have been applied)

1. In Supabase SQL Editor, run `supabase/migrations/20260927110000_oom_yoco_checkout.sql` after the existing Order of Merit migration.
2. Add these server-only variables to `.env.local`:

   ```dotenv
   YOCO_MODE=test
   YOCO_SECRET_KEY=sk_test_your_checkout_secret
   YOCO_WEBHOOK_SECRET=whsec_your_webhook_secret
   PAYMENT_LINK_SECRET=your_separate_random_secret_at_least_32_characters
   ```

   The public key is not needed for hosted checkout. Do not use `NEXT_PUBLIC_` for these secrets. Generate the payment-link secret locally with `openssl rand -hex 32`. Keep it stable: changing it invalidates existing private payment links. Rotate the test key shared in the screenshot before shared testing.
3. Make localhost:3000 reachable via an HTTPS tunnel for webhook testing. Set `NEXT_PUBLIC_SITE_URL` to the tunnel origin. This does not require deploying, but exposes the local application publicly; only enable the tunnel when ready.
4. Register one **test** webhook using the test secret at `POST https://payments.yoco.com/api/webhooks`, with JSON `{"name":"Pure Motion local test","url":"https://YOUR-TUNNEL/api/yoco/webhook"}`. Save the returned secret as `YOCO_WEBHOOK_SECRET`. Do not create duplicates. Neither the key nor webhook has been installed by the coding agent.
5. Restart the development server. Submit a clearly labelled test OOM registration and continue to payment. Use the test-card details from Yoco's Test keys panel, never a real card.

## Acceptance checks before live use

- Complete a test payment and verify the signed webhook changes the saved payment to paid/test and leaves the competition entry unconfirmed.
- Refresh/retry checkout: it must reuse the saved checkout rather than create duplicate charges.
- Test cancellation and failure, amount/mode mismatch, forged signatures, duplicate/reordered events, expired holds and delayed notifications.
- Check the admin application payment warning, provider IDs and audit event.
- Apply/verify the migration in a test database. Local security unit tests do not establish database correctness or provider end-to-end success.
- Payment confirmation emails/refund automation are not implemented here. Existing registration-received emails still require Resend configuration. The payment page/admin are the source of verified status.

For live launch: use the client's approved Checkout credentials and a live webhook, HTTPS domain, `YOCO_MODE=live`, and fresh registrations. Do not reuse test checkouts for live payment. Configure monitoring of webhook failures, expired holds and paid-but-unconfirmed entries; validate the client's cancellation/refund handling before launch.

References:
- https://developer.yoco.com/api-reference/checkout-api/checkout/create-checkout
- https://developer.yoco.com/guides/online-payments/webhooks/verifying-the-events
- https://developer.yoco.com/guides/online-payments/webhooks/listen-for-events
