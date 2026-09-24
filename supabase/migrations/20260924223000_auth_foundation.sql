-- Pure Motion Golf authentication and role foundation.
-- Apply with the Supabase CLI after linking the intended production project.

create type public.app_role as enum (
  'client',
  'coach',
  'receptionist',
  'admin'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null default 'client',
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'last_name'), '')
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'client');

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = required_role
  );
$$;

create or replace function public.is_operations_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_role('admin') or public.has_role('receptionist');
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.audit_events enable row level security;

create policy "Users read their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Operations staff read all profiles"
on public.profiles for select
to authenticated
using (public.is_operations_staff());

create policy "Users update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users read their own roles"
on public.user_roles for select
to authenticated
using (user_id = auth.uid());

create policy "Operations staff read all roles"
on public.user_roles for select
to authenticated
using (public.is_operations_staff());

create policy "Admins assign roles"
on public.user_roles for insert
to authenticated
with check (public.has_role('admin'));

create policy "Admins remove roles"
on public.user_roles for delete
to authenticated
using (public.has_role('admin'));

create policy "Authenticated users create audit events for themselves"
on public.audit_events for insert
to authenticated
with check (actor_id = auth.uid());

create policy "Operations staff read audit events"
on public.audit_events for select
to authenticated
using (public.is_operations_staff());

revoke all on function public.has_role(public.app_role) from public;
revoke all on function public.is_operations_staff() from public;
grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.is_operations_staff() to authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, delete on public.user_roles to authenticated;
grant select, insert on public.audit_events to authenticated;
