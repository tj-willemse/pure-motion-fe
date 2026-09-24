-- Pure Motion Golf portal operations: bookings, family members, services and coach availability.

create type public.booking_status as enum (
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

create type public.booking_kind as enum (
  'lesson',
  'assessment',
  'group'
);

alter table public.profiles
  add column email text,
  add column is_active boolean not null default true;

update public.profiles as profiles
set email = users.email
from auth.users as users
where profiles.id = users.id;

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind public.booking_kind not null default 'lesson',
  duration_minutes integer not null check (duration_minutes between 15 and 480),
  price_cents integer not null default 0 check (price_cents >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dependents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coach_availability (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references auth.users (id) on delete cascade,
  location_id uuid not null references public.locations (id),
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (start_time < end_time),
  unique (coach_id, location_id, weekday, start_time, end_time)
);

create table public.availability_exceptions (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references auth.users (id) on delete cascade,
  exception_date date not null,
  is_available boolean not null default false,
  start_time time,
  end_time time,
  note text,
  created_at timestamptz not null default now(),
  check (
    (not is_available and start_time is null and end_time is null)
    or (is_available and start_time is not null and end_time is not null and start_time < end_time)
  )
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id),
  dependent_id uuid references public.dependents (id) on delete set null,
  coach_id uuid references auth.users (id),
  service_id uuid not null references public.services (id),
  location_id uuid not null references public.locations (id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.booking_status not null default 'pending',
  client_notes text,
  staff_notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at < ends_at)
);

create index bookings_client_starts_at_idx on public.bookings (client_id, starts_at);
create index bookings_coach_starts_at_idx on public.bookings (coach_id, starts_at);
create index bookings_status_starts_at_idx on public.bookings (status, starts_at);
create unique index bookings_coach_start_unique_idx
on public.bookings (coach_id, starts_at)
where coach_id is not null and status not in ('cancelled', 'no_show');

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger dependents_set_updated_at
before update on public.dependents
for each row execute function public.set_updated_at();

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'last_name'), ''),
    new.email
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'client');

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
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_updated
after update of email on auth.users
for each row execute function public.sync_user_email();

create or replace function public.coach_has_client(target_client uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.bookings
    where coach_id = auth.uid()
      and client_id = target_client
  );
$$;

create or replace function public.user_has_role(
  target_user uuid,
  required_role public.app_role
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = target_user and role = required_role
  );
$$;

create or replace function public.is_coach_slot_available(
  target_coach uuid,
  target_location uuid,
  target_start timestamptz,
  target_end timestamptz,
  ignored_booking uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.user_has_role(target_coach, 'coach')
    and target_start < target_end
    and not exists (
      select 1 from public.bookings
      where coach_id = target_coach
        and id is distinct from ignored_booking
        and status not in ('cancelled', 'no_show')
        and starts_at < target_end
        and ends_at > target_start
    )
    and not exists (
      select 1 from public.availability_exceptions
      where coach_id = target_coach
        and exception_date = (target_start at time zone 'Africa/Johannesburg')::date
        and not is_available
    )
    and (
      exists (
        select 1 from public.coach_availability
        where coach_id = target_coach
          and location_id = target_location
          and weekday = extract(dow from target_start at time zone 'Africa/Johannesburg')::smallint
          and start_time <= (target_start at time zone 'Africa/Johannesburg')::time
          and end_time >= (target_end at time zone 'Africa/Johannesburg')::time
      )
      or exists (
        select 1 from public.availability_exceptions
        where coach_id = target_coach
          and exception_date = (target_start at time zone 'Africa/Johannesburg')::date
          and is_available
          and start_time <= (target_start at time zone 'Africa/Johannesburg')::time
          and end_time >= (target_end at time zone 'Africa/Johannesburg')::time
      )
    );
$$;

create or replace function public.set_booking_status(
  target_booking uuid,
  next_status public.booking_status
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (
    public.is_operations_staff()
    or exists (
      select 1 from public.bookings
      where id = target_booking and coach_id = auth.uid()
    )
  ) then
    raise exception 'Not authorized';
  end if;

  update public.bookings
  set status = next_status
  where id = target_booking;
end;
$$;

create or replace function public.cancel_own_booking(target_booking uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.bookings
  set status = 'cancelled'
  where id = target_booking
    and client_id = auth.uid()
    and status in ('pending', 'confirmed');

  if not found then
    raise exception 'Booking cannot be cancelled';
  end if;
end;
$$;

create or replace function public.assign_booking_coach(
  target_booking uuid,
  target_coach uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_booking public.bookings;
begin
  if not public.is_operations_staff() then
    raise exception 'Not authorized';
  end if;

  select * into selected_booking from public.bookings where id = target_booking;
  if selected_booking.id is null then
    raise exception 'Booking not found';
  end if;

  if not public.is_coach_slot_available(
    target_coach,
    selected_booking.location_id,
    selected_booking.starts_at,
    selected_booking.ends_at,
    target_booking
  ) then
    raise exception 'Coach is unavailable';
  end if;

  update public.bookings
  set coach_id = target_coach
  where id = target_booking;
end;
$$;

alter table public.locations enable row level security;
alter table public.services enable row level security;
alter table public.dependents enable row level security;
alter table public.coach_availability enable row level security;
alter table public.availability_exceptions enable row level security;
alter table public.bookings enable row level security;

create policy "Authenticated users read active locations"
on public.locations for select to authenticated
using (is_active or public.is_operations_staff());

create policy "Operations staff manage locations"
on public.locations for all to authenticated
using (public.is_operations_staff())
with check (public.is_operations_staff());

create policy "Authenticated users read active services"
on public.services for select to authenticated
using (is_active or public.is_operations_staff());

create policy "Operations staff manage services"
on public.services for all to authenticated
using (public.is_operations_staff())
with check (public.is_operations_staff());

create policy "Clients read their family members"
on public.dependents for select to authenticated
using (client_id = auth.uid());

create policy "Clients add family members"
on public.dependents for insert to authenticated
with check (client_id = auth.uid());

create policy "Clients update family members"
on public.dependents for update to authenticated
using (client_id = auth.uid())
with check (client_id = auth.uid());

create policy "Clients remove family members"
on public.dependents for delete to authenticated
using (client_id = auth.uid());

create policy "Staff read family members"
on public.dependents for select to authenticated
using (public.is_operations_staff() or public.coach_has_client(client_id));

create policy "Authenticated users read coach availability"
on public.coach_availability for select to authenticated
using (true);

create policy "Coaches manage their availability"
on public.coach_availability for all to authenticated
using (coach_id = auth.uid() or public.is_operations_staff())
with check (
  (coach_id = auth.uid() and public.has_role('coach'))
  or public.is_operations_staff()
);

create policy "Coaches read their exceptions"
on public.availability_exceptions for select to authenticated
using (coach_id = auth.uid() or public.is_operations_staff());

create policy "Coaches manage their exceptions"
on public.availability_exceptions for all to authenticated
using (coach_id = auth.uid() or public.is_operations_staff())
with check (
  (coach_id = auth.uid() and public.has_role('coach'))
  or public.is_operations_staff()
);

create policy "Users read permitted bookings"
on public.bookings for select to authenticated
using (
  client_id = auth.uid()
  or coach_id = auth.uid()
  or public.is_operations_staff()
);

create policy "Clients request bookings"
on public.bookings for insert to authenticated
with check (
  client_id = auth.uid()
  and created_by = auth.uid()
  and status = 'pending'
  and (coach_id is null or public.user_has_role(coach_id, 'coach'))
);

create policy "Operations staff create bookings"
on public.bookings for insert to authenticated
with check (public.is_operations_staff());

create policy "Coaches read booked client profiles"
on public.profiles for select to authenticated
using (public.has_role('coach') and public.coach_has_client(id));

create policy "Authenticated users read coach profiles"
on public.profiles for select to authenticated
using (public.user_has_role(id, 'coach'));

create policy "Authenticated users read coach roles"
on public.user_roles for select to authenticated
using (role = 'coach');

revoke update on public.profiles from authenticated;
grant update (first_name, last_name, phone) on public.profiles to authenticated;

grant select, insert, update, delete on public.locations to authenticated;
grant select, insert, update, delete on public.services to authenticated;
grant select, insert, update, delete on public.dependents to authenticated;
grant select, insert, update, delete on public.coach_availability to authenticated;
grant select, insert, update, delete on public.availability_exceptions to authenticated;
grant select, insert on public.bookings to authenticated;

revoke all on function public.coach_has_client(uuid) from public;
revoke all on function public.user_has_role(uuid, public.app_role) from public;
revoke all on function public.is_coach_slot_available(uuid, uuid, timestamptz, timestamptz, uuid) from public;
revoke all on function public.set_booking_status(uuid, public.booking_status) from public;
revoke all on function public.cancel_own_booking(uuid) from public;
revoke all on function public.assign_booking_coach(uuid, uuid) from public;
grant execute on function public.coach_has_client(uuid) to authenticated;
grant execute on function public.user_has_role(uuid, public.app_role) to authenticated;
grant execute on function public.is_coach_slot_available(uuid, uuid, timestamptz, timestamptz, uuid) to authenticated;
grant execute on function public.set_booking_status(uuid, public.booking_status) to authenticated;
grant execute on function public.cancel_own_booking(uuid) to authenticated;
grant execute on function public.assign_booking_coach(uuid, uuid) to authenticated;

insert into public.locations (slug, name, address)
values
  ('durbanville', 'Durbanville Golf Club', 'Sport Way, Durbanville'),
  ('hazendal', 'Hazendal Golf', 'Bottelary Road, Stellenbosch')
on conflict (slug) do nothing;

insert into public.services (slug, name, kind, duration_minutes, price_cents)
values
  ('junior-assessment', 'Junior assessment', 'assessment', 30, 0),
  ('private-30', '30 minute private lesson', 'lesson', 30, 38200),
  ('private-55', '55 minute private lesson', 'lesson', 55, 67900),
  ('junior-30', '30 minute junior lesson', 'lesson', 30, 30700),
  ('on-course', 'On-course lesson', 'lesson', 120, 170800)
on conflict (slug) do nothing;
