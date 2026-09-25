-- Normalize Google and Apple profile metadata into the existing customer profile.
-- Supabase automatically links OAuth identities that share the same verified email,
-- while these constraints keep the application profile and default role idempotent.

create unique index if not exists profiles_email_unique_idx
on public.profiles (lower(email))
where email is not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  profile_first_name text;
  profile_last_name text;
  profile_full_name text;
begin
  profile_first_name := coalesce(
    nullif(trim(metadata ->> 'first_name'), ''),
    nullif(trim(metadata ->> 'given_name'), '')
  );
  profile_last_name := coalesce(
    nullif(trim(metadata ->> 'last_name'), ''),
    nullif(trim(metadata ->> 'family_name'), '')
  );
  profile_full_name := coalesce(
    nullif(trim(metadata ->> 'full_name'), ''),
    nullif(trim(metadata ->> 'name'), '')
  );

  if profile_first_name is null and profile_full_name is not null then
    profile_first_name := split_part(profile_full_name, ' ', 1);
  end if;

  if profile_last_name is null
    and profile_full_name is not null
    and position(' ' in profile_full_name) > 0 then
    profile_last_name := nullif(trim(regexp_replace(profile_full_name, '^\S+\s+', '')), '');
  end if;

  insert into public.profiles (id, first_name, last_name, email)
  values (new.id, profile_first_name, profile_last_name, lower(new.email))
  on conflict (id) do update
  set
    first_name = coalesce(public.profiles.first_name, excluded.first_name),
    last_name = coalesce(public.profiles.last_name, excluded.last_name),
    email = coalesce(excluded.email, public.profiles.email);

  insert into public.user_roles (user_id, role)
  values (new.id, 'client')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create or replace function public.sync_user_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = lower(new.email)
  where id = new.id;
  return new;
end;
$$;
