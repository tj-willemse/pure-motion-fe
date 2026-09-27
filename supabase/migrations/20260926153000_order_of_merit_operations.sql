-- Order of Merit seasons, rounds, registrations and provider-neutral payments.
-- This migration is safe to apply before Yoco is connected. New registrations
-- use a manual payment record until a checkout provider is enabled.

create sequence public.oom_registration_reference_seq start 1001;

create table public.oom_seasons (
  id text primary key,
  year integer not null unique check (year between 2020 and 2100),
  name text not null,
  venue text not null,
  standard_price_cents integer not null check (standard_price_cents >= 0),
  jam_price_cents integer not null check (jam_price_cents >= 0),
  term_discount_percent numeric(5,2) not null default 0 check (term_discount_percent between 0 and 100),
  terms_version text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.oom_rounds (
  id text primary key,
  season_id text not null references public.oom_seasons (id) on delete cascade,
  term smallint not null check (term between 1 and 4),
  round_date date not null,
  nine text not null check (nine in ('front', 'back')),
  status text not null default 'draft' check (status in ('draft', 'open', 'full', 'closed', 'cancelled', 'completed')),
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  standard_capacity integer not null default 32 check (standard_capacity >= 0),
  kickstarter_capacity integer not null default 16 check (kickstarter_capacity >= 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, round_date),
  check (registration_closes_at is null or registration_opens_at is null or registration_opens_at < registration_closes_at)
);

create table public.oom_registrations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('OOM-' || lpad(nextval('public.oom_registration_reference_seq')::text, 6, '0')),
  season_id text not null references public.oom_seasons (id),
  user_id uuid references auth.users (id) on delete set null,
  dependent_id uuid references public.dependents (id) on delete set null,
  registration_date date not null default current_date,
  division text not null check (division in ('standard', 'kickstarter')),
  parent_first_name text not null,
  parent_last_name text not null,
  relationship text not null,
  parent_email text not null,
  parent_phone text not null,
  physical_address text not null,
  alternate_transport text,
  discovery_sources text[] not null default '{}',
  player_first_name text not null,
  player_known_as text,
  player_last_name text not null,
  player_gender text not null,
  player_date_of_birth date not null,
  player_school text not null,
  player_grade text not null,
  player_identity_key text not null,
  handicap_index numeric(4,1) check (handicap_index between 0 and 54),
  coach_name text,
  dgc_member boolean not null,
  dgc_membership_number text,
  jam_member boolean not null,
  jam_membership_number text,
  player_social_media text,
  support_requirements text,
  leaderboard_photo_path text,
  image_consent boolean not null,
  terms_accepted boolean not null,
  terms_version text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  status text not null default 'awaiting_payment' check (status in ('awaiting_payment', 'confirmed', 'declined', 'cancelled', 'expired')),
  payment_deadline timestamptz not null default (now() + interval '12 hours'),
  staff_notes text,
  submission jsonb not null,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (discount_cents <= subtotal_cents),
  check (total_cents = subtotal_cents - discount_cents),
  check ((not dgc_member) or nullif(trim(dgc_membership_number), '') is not null),
  check ((not jam_member) or nullif(trim(jam_membership_number), '') is not null)
);

create table public.oom_registration_rounds (
  registration_id uuid not null references public.oom_registrations (id) on delete cascade,
  round_id text not null references public.oom_rounds (id),
  player_identity_key text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  line_total_cents integer not null check (line_total_cents >= 0),
  status text not null default 'held' check (status in ('held', 'confirmed', 'cancelled', 'refunded', 'expired')),
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (registration_id, round_id),
  check (line_total_cents = unit_price_cents - discount_cents)
);

create unique index oom_registration_rounds_active_player_idx
on public.oom_registration_rounds (round_id, player_identity_key)
where status in ('held', 'confirmed');

create table public.oom_payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.oom_registrations (id) on delete cascade,
  provider text not null default 'manual' check (provider in ('manual', 'yoco')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired', 'refunded', 'waived')),
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'ZAR' check (currency = 'ZAR'),
  provider_checkout_id text,
  provider_payment_id text,
  checkout_url text,
  provider_payload jsonb not null default '{}',
  paid_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index oom_payments_provider_checkout_idx
on public.oom_payments (provider, provider_checkout_id)
where provider_checkout_id is not null;

create index oom_registrations_status_idx on public.oom_registrations (status, submitted_at desc);
create index oom_registrations_user_idx on public.oom_registrations (user_id, submitted_at desc);
create index oom_registrations_player_idx on public.oom_registrations (player_identity_key, submitted_at desc);
create index oom_registration_rounds_round_idx on public.oom_registration_rounds (round_id, status);
create index oom_payments_registration_idx on public.oom_payments (registration_id, created_at desc);

create trigger oom_seasons_set_updated_at before update on public.oom_seasons
for each row execute function public.set_updated_at();
create trigger oom_rounds_set_updated_at before update on public.oom_rounds
for each row execute function public.set_updated_at();
create trigger oom_registrations_set_updated_at before update on public.oom_registrations
for each row execute function public.set_updated_at();
create trigger oom_registration_rounds_set_updated_at before update on public.oom_registration_rounds
for each row execute function public.set_updated_at();
create trigger oom_payments_set_updated_at before update on public.oom_payments
for each row execute function public.set_updated_at();

alter table public.oom_seasons enable row level security;
alter table public.oom_rounds enable row level security;
alter table public.oom_registrations enable row level security;
alter table public.oom_registration_rounds enable row level security;
alter table public.oom_payments enable row level security;

create policy "Published OOM seasons are public"
on public.oom_seasons for select to anon, authenticated
using (status = 'published' or public.is_operations_staff());

create policy "Published OOM rounds are public"
on public.oom_rounds for select to anon, authenticated
using (
  exists (select 1 from public.oom_seasons s where s.id = season_id and s.status = 'published')
  or public.is_operations_staff()
);

create policy "Operations staff manage OOM seasons"
on public.oom_seasons for all to authenticated
using (public.is_operations_staff()) with check (public.is_operations_staff());

create policy "Operations staff manage OOM rounds"
on public.oom_rounds for all to authenticated
using (public.is_operations_staff()) with check (public.is_operations_staff());

create policy "Clients read their OOM registrations"
on public.oom_registrations for select to authenticated
using (user_id = auth.uid() or public.is_operations_staff());

create policy "Operations staff manage OOM registrations"
on public.oom_registrations for all to authenticated
using (public.is_operations_staff()) with check (public.is_operations_staff());

create policy "Clients read their OOM selected rounds"
on public.oom_registration_rounds for select to authenticated
using (
  exists (
    select 1 from public.oom_registrations r
    where r.id = registration_id and (r.user_id = auth.uid() or public.is_operations_staff())
  )
);

create policy "Operations staff manage OOM selected rounds"
on public.oom_registration_rounds for all to authenticated
using (public.is_operations_staff()) with check (public.is_operations_staff());

create policy "Clients read their OOM payments"
on public.oom_payments for select to authenticated
using (
  exists (
    select 1 from public.oom_registrations r
    where r.id = registration_id and (r.user_id = auth.uid() or public.is_operations_staff())
  )
);

create policy "Operations staff manage OOM payments"
on public.oom_payments for all to authenticated
using (public.is_operations_staff()) with check (public.is_operations_staff());

-- Public submissions enter through this function only. Pricing, capacity,
-- legal version and identity keys are calculated in the database, not trusted
-- from browser input.
create or replace function public.submit_oom_registration(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_season public.oom_seasons%rowtype;
  selected_round public.oom_rounds%rowtype;
  new_registration public.oom_registrations%rowtype;
  selected_ids text[];
  player_key text;
  linked_dependent uuid;
  selected_division text;
  selected_jam boolean;
  unit_price integer;
  selected_count integer;
  subtotal integer;
  discount integer := 0;
  line_discount integer;
  active_count integer;
  capacity_limit integer;
  whole_term boolean;
begin
  if coalesce(length(trim(payload ->> 'parent_email')), 0) = 0
    or coalesce(length(trim(payload ->> 'player_first_name')), 0) = 0
    or coalesce(length(trim(payload ->> 'player_last_name')), 0) = 0
    or coalesce(length(trim(payload ->> 'player_date_of_birth')), 0) = 0 then
    raise exception 'Required registration details are missing';
  end if;

  if coalesce((payload ->> 'image_consent')::boolean, false) is false
    or coalesce((payload ->> 'terms_accepted')::boolean, false) is false then
    raise exception 'Registration consent is required';
  end if;

  selected_division := payload ->> 'division';
  if selected_division not in ('standard', 'kickstarter') then
    raise exception 'Choose a valid division';
  end if;

  select array_agg(distinct value order by value)
  into selected_ids
  from jsonb_array_elements_text(coalesce(payload -> 'round_ids', '[]'::jsonb));

  selected_count := coalesce(cardinality(selected_ids), 0);
  if selected_count = 0 then raise exception 'Choose at least one round'; end if;

  select * into selected_season
  from public.oom_seasons
  where id = payload ->> 'season_id' and status = 'published';
  if not found then raise exception 'The selected season is unavailable'; end if;

  selected_jam := coalesce((payload ->> 'jam_member')::boolean, false);
  unit_price := case when selected_jam then selected_season.jam_price_cents else selected_season.standard_price_cents end;
  subtotal := selected_count * unit_price;
  player_key := lower(trim(payload ->> 'player_first_name')) || '|' ||
    lower(trim(payload ->> 'player_last_name')) || '|' || (payload ->> 'player_date_of_birth');

  if auth.uid() is not null then
    select d.id into linked_dependent
    from public.dependents d
    where d.client_id = auth.uid()
      and lower(trim(d.first_name)) = lower(trim(payload ->> 'player_first_name'))
      and lower(trim(d.last_name)) = lower(trim(payload ->> 'player_last_name'))
      and d.date_of_birth = (payload ->> 'player_date_of_birth')::date
    limit 1;
  end if;

  -- Lock every selected round in a deterministic order. This serialises
  -- competing submissions and makes the capacity check atomic.
  for selected_round in
    select * from public.oom_rounds
    where season_id = selected_season.id and id = any(selected_ids)
    order by id
    for update
  loop
    if selected_round.status <> 'open' then
      raise exception 'Round % is not open for registration', selected_round.id;
    end if;

    capacity_limit := case when selected_division = 'standard'
      then selected_round.standard_capacity else selected_round.kickstarter_capacity end;

    select count(*) into active_count
    from public.oom_registration_rounds rr
    join public.oom_registrations r on r.id = rr.registration_id
    where rr.round_id = selected_round.id
      and r.division = selected_division
      and rr.status in ('held', 'confirmed')
      and (rr.status = 'confirmed' or rr.hold_expires_at > now());

    if active_count >= capacity_limit then
      raise exception 'Round % is fully booked for this division', selected_round.id;
    end if;
  end loop;

  if (select count(*) from public.oom_rounds where season_id = selected_season.id and id = any(selected_ids)) <> selected_count then
    raise exception 'One or more selected rounds are invalid';
  end if;

  -- Apply the published full-term discount only if every non-cancelled round
  -- in that term is open and every one of those rounds was selected.
  for selected_round in
    select distinct on (term) * from public.oom_rounds
    where season_id = selected_season.id and id = any(selected_ids)
    order by term, id
  loop
    select
      bool_and(r.status = 'open')
      and count(*) = (select count(*) from unnest(selected_ids) chosen
        join public.oom_rounds selected on selected.id = chosen
        where selected.term = selected_round.term)
    into whole_term
    from public.oom_rounds r
    where r.season_id = selected_season.id
      and r.term = selected_round.term
      and r.status <> 'cancelled';

    if whole_term then
      discount := discount + round(
        (select count(*) from public.oom_rounds r where r.season_id = selected_season.id and r.term = selected_round.term and r.status <> 'cancelled')
        * unit_price * selected_season.term_discount_percent / 100
      );
    end if;
  end loop;

  insert into public.oom_registrations (
    season_id, user_id, dependent_id, registration_date, division,
    parent_first_name, parent_last_name, relationship, parent_email, parent_phone,
    physical_address, alternate_transport, discovery_sources,
    player_first_name, player_known_as, player_last_name, player_gender,
    player_date_of_birth, player_school, player_grade, player_identity_key,
    handicap_index, coach_name, dgc_member, dgc_membership_number,
    jam_member, jam_membership_number, player_social_media, support_requirements,
    image_consent, terms_accepted, terms_version,
    unit_price_cents, subtotal_cents, discount_cents, total_cents, submission
  ) values (
    selected_season.id, auth.uid(), linked_dependent,
    coalesce(nullif(payload ->> 'registration_date', '')::date, current_date), selected_division,
    trim(payload ->> 'parent_first_name'), trim(payload ->> 'parent_last_name'), trim(payload ->> 'relationship'),
    lower(trim(payload ->> 'parent_email')), trim(payload ->> 'parent_phone'),
    trim(payload ->> 'physical_address'), nullif(trim(payload ->> 'alternate_transport'), ''),
    array(select jsonb_array_elements_text(coalesce(payload -> 'discovery_sources', '[]'::jsonb))),
    trim(payload ->> 'player_first_name'), nullif(trim(payload ->> 'player_known_as'), ''),
    trim(payload ->> 'player_last_name'), trim(payload ->> 'player_gender'),
    (payload ->> 'player_date_of_birth')::date, trim(payload ->> 'player_school'), trim(payload ->> 'player_grade'), player_key,
    nullif(payload ->> 'handicap_index', '')::numeric, nullif(trim(payload ->> 'coach_name'), ''),
    coalesce((payload ->> 'dgc_member')::boolean, false), nullif(trim(payload ->> 'dgc_membership_number'), ''),
    selected_jam, nullif(trim(payload ->> 'jam_membership_number'), ''),
    nullif(trim(payload ->> 'player_social_media'), ''), nullif(trim(payload ->> 'support_requirements'), ''),
    true, true, selected_season.terms_version,
    unit_price, subtotal, discount, subtotal - discount, payload - 'website'
  ) returning * into new_registration;

  for selected_round in
    select * from public.oom_rounds where id = any(selected_ids) order by id
  loop
    whole_term := not exists (
      select 1 from public.oom_rounds r
      where r.season_id = selected_season.id and r.term = selected_round.term
        and r.status <> 'cancelled'
        and (r.status <> 'open' or not (r.id = any(selected_ids)))
    );
    line_discount := case when whole_term then round(unit_price * selected_season.term_discount_percent / 100) else 0 end;
    insert into public.oom_registration_rounds (
      registration_id, round_id, player_identity_key, unit_price_cents,
      discount_cents, line_total_cents, status, hold_expires_at
    ) values (
      new_registration.id, selected_round.id, player_key, unit_price,
      line_discount, unit_price - line_discount, 'held', new_registration.payment_deadline
    );
  end loop;

  insert into public.oom_payments (registration_id, provider, status, amount_cents, expires_at)
  values (new_registration.id, 'manual', 'pending', new_registration.total_cents, new_registration.payment_deadline);

  insert into public.audit_events (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'oom.registration.submitted', 'oom_registration', new_registration.id::text,
    jsonb_build_object('reference', new_registration.reference, 'division', new_registration.division, 'round_count', selected_count));

  return jsonb_build_object(
    'id', new_registration.id,
    'reference', new_registration.reference,
    'total_cents', new_registration.total_cents,
    'payment_deadline', new_registration.payment_deadline
  );
exception
  when unique_violation then
    raise exception 'This player is already registered for one or more selected rounds';
end;
$$;

create or replace function public.manage_oom_registration(
  target_registration uuid,
  new_registration_status text,
  new_payment_status text,
  new_staff_notes text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_operations_staff() then raise exception 'Not authorised'; end if;
  if new_registration_status not in ('awaiting_payment', 'confirmed', 'declined', 'cancelled', 'expired') then
    raise exception 'Invalid registration status';
  end if;
  if new_payment_status not in ('pending', 'paid', 'failed', 'expired', 'refunded', 'waived') then
    raise exception 'Invalid payment status';
  end if;

  update public.oom_registrations
  set status = new_registration_status, staff_notes = nullif(trim(new_staff_notes), '')
  where id = target_registration;
  if not found then raise exception 'Registration not found'; end if;

  update public.oom_payments
  set status = new_payment_status,
      paid_at = case when new_payment_status = 'paid' then coalesce(paid_at, now()) else paid_at end
  where id = (
    select id from public.oom_payments where registration_id = target_registration order by created_at desc limit 1
  );

  update public.oom_registration_rounds
  set status = case
    when new_registration_status = 'confirmed' then 'confirmed'
    when new_registration_status in ('cancelled', 'declined') then 'cancelled'
    when new_registration_status = 'expired' then 'expired'
    else 'held'
  end,
  hold_expires_at = case when new_registration_status = 'confirmed' then null else hold_expires_at end
  where registration_id = target_registration;

  insert into public.audit_events (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'oom.registration.status_updated', 'oom_registration', target_registration::text,
    jsonb_build_object('registration_status', new_registration_status, 'payment_status', new_payment_status));
end;
$$;

create or replace function public.expire_oom_registration_holds()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare affected integer;
begin
  if auth.role() <> 'service_role' and not public.is_operations_staff() then raise exception 'Not authorised'; end if;
  update public.oom_registrations
  set status = 'expired'
  where status = 'awaiting_payment' and payment_deadline <= now();
  get diagnostics affected = row_count;

  update public.oom_registration_rounds rr
  set status = 'expired'
  from public.oom_registrations r
  where r.id = rr.registration_id and r.status = 'expired' and rr.status = 'held';

  update public.oom_payments p
  set status = 'expired'
  from public.oom_registrations r
  where r.id = p.registration_id and r.status = 'expired' and p.status = 'pending';
  return affected;
end;
$$;

revoke all on public.oom_registrations, public.oom_registration_rounds, public.oom_payments from anon, authenticated;
grant select on public.oom_seasons, public.oom_rounds to anon, authenticated;
grant select on public.oom_registrations, public.oom_registration_rounds, public.oom_payments to authenticated;
grant insert, update, delete on public.oom_seasons, public.oom_rounds, public.oom_registrations, public.oom_registration_rounds, public.oom_payments to authenticated;
revoke all on function public.submit_oom_registration(jsonb) from public;
grant execute on function public.submit_oom_registration(jsonb) to anon, authenticated;
revoke all on function public.manage_oom_registration(uuid, text, text, text) from public;
grant execute on function public.manage_oom_registration(uuid, text, text, text) to authenticated;
revoke all on function public.expire_oom_registration_holds() from public;
grant execute on function public.expire_oom_registration_holds() to authenticated, service_role;

insert into public.oom_seasons (
  id, year, name, venue, standard_price_cents, jam_price_cents,
  term_discount_percent, terms_version, status
) values ('oom-2026', 2026, '2026 Order of Merit', 'Durbanville Golf Club', 8000, 3500, 10, '2026.1', 'published');

with source(id, term, round_date, nine, status, standard_capacity, kickstarter_capacity, note) as (
  values
    ('oom-2026-01',1,'2026-01-27'::date,'front','completed',32,16,null),
    ('oom-2026-02',1,'2026-02-03'::date,'back','completed',32,16,null),
    ('oom-2026-03',1,'2026-02-10'::date,'front','completed',32,16,null),
    ('oom-2026-04',1,'2026-02-17'::date,'back','completed',32,16,null),
    ('oom-2026-05',1,'2026-02-24'::date,'front','completed',32,16,null),
    ('oom-2026-06',1,'2026-03-10'::date,'back','completed',32,16,null),
    ('oom-2026-07',1,'2026-03-17'::date,'front','completed',32,16,null),
    ('oom-2026-08',1,'2026-03-24'::date,'back','completed',32,16,null),
    ('oom-2026-09',2,'2026-04-14'::date,'front','completed',32,16,null),
    ('oom-2026-10',2,'2026-04-28'::date,'back','completed',32,16,null),
    ('oom-2026-11',2,'2026-05-05'::date,'front','completed',32,16,null),
    ('oom-2026-12',2,'2026-05-12'::date,'back','cancelled',32,16,'Cancelled by the academy'),
    ('oom-2026-13',2,'2026-05-19'::date,'front','completed',32,16,null),
    ('oom-2026-14',2,'2026-05-26'::date,'back','completed',32,16,null),
    ('oom-2026-15',2,'2026-06-02'::date,'front','completed',32,16,null),
    ('oom-2026-16',2,'2026-06-09'::date,'back','completed',32,16,null),
    ('oom-2026-17',2,'2026-06-23'::date,'front','completed',32,16,null),
    ('oom-2026-18',3,'2026-07-28'::date,'back','completed',32,16,null),
    ('oom-2026-19',3,'2026-08-04'::date,'front','completed',32,16,null),
    ('oom-2026-20',3,'2026-08-11'::date,'back','completed',32,16,null),
    ('oom-2026-21',3,'2026-08-18'::date,'front','completed',32,16,null),
    ('oom-2026-22',3,'2026-08-25'::date,'back','completed',32,16,null),
    ('oom-2026-23',3,'2026-09-08'::date,'front','completed',32,16,null),
    ('oom-2026-24',3,'2026-09-15'::date,'back','completed',32,16,null),
    ('oom-2026-25',3,'2026-09-22'::date,'front','cancelled',32,16,'Cancelled by the academy'),
    ('oom-2026-26',4,'2026-10-13'::date,'back','full',32,16,'Fully booked'),
    ('oom-2026-27',4,'2026-10-20'::date,'front','full',32,16,'Fully booked'),
    ('oom-2026-28',4,'2026-10-27'::date,'back','full',32,16,'Fully booked'),
    ('oom-2026-29',4,'2026-11-03'::date,'front','full',32,16,'Fully booked'),
    ('oom-2026-30',4,'2026-11-10'::date,'back','full',32,16,'Fully booked'),
    ('oom-2026-31',4,'2026-11-17'::date,'front','full',32,16,'Fully booked'),
    ('oom-2026-32',4,'2026-11-24'::date,'back','open',32,16,'Registration available'),
    ('oom-2026-33',4,'2026-12-01'::date,'front','open',32,0,'Stableford only; Kickstarter fully booked')
)
insert into public.oom_rounds (
  id, season_id, term, round_date, nine, status, registration_opens_at,
  registration_closes_at, standard_capacity, kickstarter_capacity, note
)
select id, 'oom-2026', term, round_date, nine, status,
  ((round_date - 6)::timestamp at time zone 'Africa/Johannesburg'),
  (((round_date - 3)::date + time '23:59:59') at time zone 'Africa/Johannesburg'),
  standard_capacity, kickstarter_capacity, note
from source;

-- Private player photographs. Uploads are performed by the server with the
-- service-role key; only the player account and operations staff can read them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('oom-player-photos', 'oom-player-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Operations staff read OOM player photos"
on storage.objects for select to authenticated
using (bucket_id = 'oom-player-photos' and public.is_operations_staff());

create policy "Clients read their own OOM player photos"
on storage.objects for select to authenticated
using (
  bucket_id = 'oom-player-photos'
  and exists (
    select 1 from public.oom_registrations r
    where r.leaderboard_photo_path = name and r.user_id = auth.uid()
  )
);
