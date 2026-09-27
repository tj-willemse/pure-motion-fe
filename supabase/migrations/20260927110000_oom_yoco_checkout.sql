-- Run manually after 20260926153000_order_of_merit_operations.sql.
-- No keys belong in this migration. Test transactions never confirm live entries.
begin;
alter table public.oom_payments add column if not exists processing_mode text
  check (processing_mode in ('test', 'live'));

create table if not exists public.oom_yoco_events (
  event_id text primary key,
  payment_id uuid not null references public.oom_payments(id),
  event_type text not null,
  processed_at timestamptz not null default now()
);
alter table public.oom_yoco_events enable row level security;
revoke all on public.oom_yoco_events from anon, authenticated;
grant all on public.oom_yoco_events to service_role;

create or replace function public.apply_oom_yoco_event(event jsonb)
returns text language plpgsql security definer set search_path = public
as $$
declare
  p public.oom_payments;
  r public.oom_registrations;
  event_type text := event ->> 'type';
  details jsonb := event -> 'payload';
  inserted integer;
begin
  if event_type not in ('payment.succeeded', 'payment.failed') or
     event_type <> 'payment.' || (details ->> 'status') then
    raise exception 'Unsupported payment event';
  end if;
  select * into p from public.oom_payments
    where provider = 'yoco' and provider_checkout_id = details #>> '{metadata,checkoutId}'
    for update;
  if not found then return 'unrelated_checkout'; end if;
  if p.amount_cents <> (details ->> 'amount')::integer or
     p.currency <> details ->> 'currency' or
     p.processing_mode is distinct from details ->> 'mode' then
    raise exception 'Payment reconciliation mismatch';
  end if;
  insert into public.oom_yoco_events(event_id, payment_id, event_type)
    values(event ->> 'id', p.id, event_type) on conflict do nothing;
  get diagnostics inserted = row_count;
  if inserted = 0 then return 'duplicate'; end if;
  -- A delayed failure or duplicate success must never downgrade a settled payment.
  if p.status in ('paid', 'refunded', 'waived') then return 'already_settled'; end if;
  if event_type = 'payment.failed' then
    update public.oom_payments set status = 'failed' where id = p.id;
    return 'failed';
  end if;
  select * into r from public.oom_registrations where id = p.registration_id for update;
  update public.oom_payments set status = 'paid', paid_at = now(),
    provider_payment_id = details ->> 'id' where id = p.id;

  if p.processing_mode = 'live' then
    -- Serialise with submissions; never revive released or expired places.
    perform 1 from public.oom_rounds where id in (
      select round_id from public.oom_registration_rounds where registration_id = r.id
    ) order by id for update;
    if r.status = 'awaiting_payment' and r.payment_deadline > now() and
       exists (select 1 from public.oom_registration_rounds where registration_id = r.id) and
       not exists (select 1 from public.oom_registration_rounds rr
         join public.oom_rounds rd on rd.id = rr.round_id
         where rr.registration_id = r.id and
           (rr.status <> 'held' or rr.hold_expires_at is null or rr.hold_expires_at <= now() or rd.status in ('cancelled','completed'))) then
      update public.oom_registrations set status = 'confirmed' where id = r.id;
      update public.oom_registration_rounds set status = 'confirmed', hold_expires_at = null where registration_id = r.id;
    else
      update public.oom_registrations set staff_notes = concat_ws(E'\n', staff_notes,
        'Yoco payment received after hold expiry or registration change. Review availability/refund; entry was not automatically confirmed.') where id = r.id;
    end if;
  end if;
  insert into public.audit_events(actor_id, action, entity_type, entity_id, metadata)
    values(null, 'oom.payment.yoco_verified', 'oom_registration', r.id::text,
      jsonb_build_object('mode', p.processing_mode, 'payment_id', p.id, 'event_id', event ->> 'id'));
  return case when p.processing_mode = 'test' then 'test_payment_verified' else 'payment_verified' end;
end;
$$;
revoke all on function public.apply_oom_yoco_event(jsonb) from public, anon, authenticated;
grant execute on function public.apply_oom_yoco_event(jsonb) to service_role;
commit;
