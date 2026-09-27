# Supabase setup

The frontend uses Supabase Auth with cookie-based SSR sessions.

## Connect the intended project

1. Sign the Supabase CLI into the account that owns the Pure Motion Golf project.
2. Run `supabase link --project-ref qlcoexpjyfoumryymuur`.
3. Review the pending migration with `supabase db diff --linked`.
4. Apply migrations with `supabase db push`.
5. Add the project URL and publishable key to `.env.local` using `.env.example`.

Never add the database password, secret key or service-role key to a `NEXT_PUBLIC_` variable.

## Google and Apple sign-in

Email/password, Google and Apple all use the same Supabase user. Supabase automatically links a social identity to an existing account when the provider returns the same verified email. The application keeps one profile per Supabase user ID and the social-auth migration makes profile/role creation idempotent, so do not build a second Google- or Apple-specific customer table.

In **Authentication → Sign In / Providers**:

1. Keep Email enabled.
2. Configure Google with the client ID and secret from Google Cloud.
3. Configure Apple with the Services ID and signing secret from Apple Developer.
4. Use the Supabase callback shown in each provider panel as the provider's authorized redirect URI. For this project it follows `https://qlcoexpjyfoumryymuur.supabase.co/auth/v1/callback`.

In **Authentication → URL Configuration**, add these application redirects:

- `http://localhost:3000/auth/callback`
- `http://127.0.0.1:3000/auth/callback`
- `https://pure-motion-fe.vercel.app/auth/callback`
- `https://puremotiongolf.com/auth/callback` when the production domain is connected

Also retain the matching `/auth/confirm` URLs for email confirmation. OAuth secrets belong only in Supabase/provider settings; they must never be added to this repository or exposed as `NEXT_PUBLIC_` variables.

Once a provider has been configured and tested, enable its button in the Vercel environment and redeploy:

```ini
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
NEXT_PUBLIC_APPLE_AUTH_ENABLED=true
```

Leave either value `false` until that provider is ready. Its button will remain disabled and display a “Coming soon” tooltip.

## First administrator

Every new account receives the `client` role automatically. After the first trusted administrator registers, bootstrap that role from the Supabase SQL editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where email = 'replace-with-trusted-admin@example.com'
on conflict do nothing;
```

After this one-time bootstrap, administrators can assign roles from **Dashboard → People**.

## Portal operations migration

`20260924232000_portal_operations.sql` adds the live portal data model and policies for:

- services and locations;
- clients and managed family members;
- lesson and assessment bookings;
- coach weekly availability and date-specific exceptions;
- operations booking assignment/status changes;
- role-aware client, coach, receptionist and admin access.

If the CLI cannot access the project, paste the complete migration into the Supabase SQL Editor and run it once. Then bootstrap the first administrator with the query above. Do not run only part of the migration.

## Order of Merit registration workflow

After the earlier auth and portal migrations have been applied, run the complete
`20260926153000_order_of_merit_operations.sql` migration in the Supabase SQL Editor.
It creates:

- the editable season and round records;
- atomic capacity holds and duplicate-player protection;
- registration snapshots linked to existing users/dependents when possible;
- provider-neutral payment records that can later use Yoco;
- private player-photo storage and role-aware access;
- staff status controls and audit events.

Do not run isolated sections of the file. The functions depend on the tables,
policies and seeded 2026 season records created earlier in the same migration.

Private photograph uploads also require `SUPABASE_SERVICE_ROLE_KEY` in the server
environment. Email receipts require `RESEND_API_KEY`, `REGISTRATION_FROM_EMAIL`
and `REGISTRATION_TEAM_EMAIL`. These values are server-only and must never use a
`NEXT_PUBLIC_` prefix.
# Yoco checkout (manual setup)

After the Order of Merit operations migration, run
`migrations/20260927110000_oom_yoco_checkout.sql` manually in SQL Editor.
This adds test/live payment tracking and a service-role-only, idempotent webhook reconciliation function.
See `../docs/yoco-checkout-setup.md` for environment and webhook setup. No provider secrets belong in SQL.
