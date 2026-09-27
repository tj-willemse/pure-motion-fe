# Order of Merit operations setup

## Database

The Order of Merit migration depends on the existing authentication and portal
tables. Apply migrations in this order when a new Supabase project is empty:

1. `20260924223000_auth_foundation.sql`
2. `20260924232000_portal_operations.sql`
3. `20260925154000_social_auth_profiles.sql`
4. `20260926125000_junior_academy_registrations.sql`
5. `20260926153000_order_of_merit_operations.sql`

For an existing project, check the required foundations before applying the new
Order of Merit migration:

```sql
select
  to_regclass('public.profiles') as profiles,
  to_regclass('public.user_roles') as user_roles,
  to_regclass('public.dependents') as dependents,
  to_regclass('public.audit_events') as audit_events;
```

All four results must contain a table name. If they do, run only the complete
`20260926153000_order_of_merit_operations.sql` file. Do not paste individual
sections from it.

## Server environment

The public form can create database registrations with the existing Supabase
publishable key. These server-only variables activate the remaining automation:

```ini
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
REGISTRATION_FROM_EMAIL=Pure Motion Golf <registrations@verified-domain.example>
REGISTRATION_TEAM_EMAIL=registrations@puremotiongolf.com
```

The service-role key is used only for validated private photograph uploads. It
must never be exposed through a `NEXT_PUBLIC_` variable.

## Current workflow

1. The server validates the complete form and file metadata.
2. The database locks the selected rounds and checks capacity.
3. Pricing, discount and the accepted terms version are calculated in SQL.
4. The registration, selected rounds, manual payment and audit event are saved
   in one transaction.
5. The photograph is auto-rotated, stripped of metadata, resized to fit within
   1200 × 1200 pixels and converted to WebP before entering the private bucket.
6. The parent and operations team receive email summaries when email delivery is
   configured.
7. Staff update payment and registration statuses in Dashboard → Order of Merit.

## Later Yoco connection

Yoco should create a checkout only after the database creates the capacity hold.
Store its checkout/payment IDs in `oom_payments`. A verified, idempotent webhook
then marks the payment paid and calls the same registration confirmation logic.
The form and registration tables do not need to be replaced.
