-- Secure intake for 2026 Junior Academy registrations.

create table public.junior_academy_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  registration_type text not null,
  parent_first_name text not null,
  parent_last_name text not null,
  parent_email text not null,
  junior_first_name text not null,
  junior_last_name text not null,
  location text,
  joining_month text,
  programme text,
  amount_due_cents integer not null default 0 check (amount_due_cents >= 0),
  status text not null default 'submitted' check (status in ('submitted', 'awaiting_payment', 'paid', 'approved', 'declined')),
  submission jsonb not null,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger junior_academy_registrations_set_updated_at
before update on public.junior_academy_registrations
for each row execute function public.set_updated_at();

create index junior_academy_registrations_status_idx
on public.junior_academy_registrations (status, submitted_at desc);

alter table public.junior_academy_registrations enable row level security;

create policy "Clients read their academy registrations"
on public.junior_academy_registrations for select to authenticated
using (user_id = auth.uid());

create policy "Operations staff manage academy registrations"
on public.junior_academy_registrations for all to authenticated
using (public.is_operations_staff())
with check (public.is_operations_staff());

create or replace function public.submit_junior_academy_registration(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  registration_id uuid;
  amount_cents integer;
begin
  if coalesce(length(trim(payload ->> 'parent_email')), 0) = 0
    or coalesce(length(trim(payload ->> 'junior_first_name')), 0) = 0 then
    raise exception 'Required registration details are missing';
  end if;

  amount_cents := greatest(coalesce((payload ->> 'amount_due_cents')::integer, 0), 0);

  insert into public.junior_academy_registrations (
    user_id, registration_type, parent_first_name, parent_last_name, parent_email,
    junior_first_name, junior_last_name, location, joining_month, programme,
    amount_due_cents, status, submission
  ) values (
    auth.uid(), payload ->> 'registration_type', payload ->> 'parent_first_name',
    payload ->> 'parent_last_name', lower(payload ->> 'parent_email'),
    payload ->> 'junior_first_name', payload ->> 'junior_last_name',
    nullif(payload ->> 'location', ''), nullif(payload ->> 'joining_month', ''),
    nullif(payload ->> 'programme', ''), amount_cents,
    case when amount_cents > 0 then 'awaiting_payment' else 'submitted' end,
    payload - 'website'
  ) returning id into registration_id;

  return registration_id;
end;
$$;

revoke all on public.junior_academy_registrations from anon, authenticated;
grant select, update, delete on public.junior_academy_registrations to authenticated;
revoke all on function public.submit_junior_academy_registration(jsonb) from public;
grant execute on function public.submit_junior_academy_registration(jsonb) to anon, authenticated;
