# Supabase setup

The frontend uses Supabase Auth with cookie-based SSR sessions.

## Connect the intended project

1. Sign the Supabase CLI into the account that owns the Pure Motion Golf project.
2. Run `supabase link --project-ref qlcoexpjyfoumryymuur`.
3. Review the pending migration with `supabase db diff --linked`.
4. Apply migrations with `supabase db push`.
5. Add the project URL and publishable key to `.env.local` using `.env.example`.

Never add the database password, secret key or service-role key to a `NEXT_PUBLIC_` variable.

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
