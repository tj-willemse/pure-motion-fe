-- Run manually AFTER the Junior Academy, OOM operations and Yoco migrations.
-- Enforces account ownership at the Data API boundary, not just in the UI.
begin;
revoke execute on function public.submit_oom_registration(jsonb) from public, anon;
revoke execute on function public.submit_junior_academy_registration(jsonb) from public, anon;
grant execute on function public.submit_oom_registration(jsonb) to authenticated;
grant execute on function public.submit_junior_academy_registration(jsonb) to authenticated;
-- Existing functions assign user_id from auth.uid(); no browser-supplied owner is used.
-- Existing RLS limits client reads to that user_id. Guest records remain unclaimed.
create or replace function public.link_registration_family_golfer()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  first_name_value text;
  last_name_value text;
  birth_date date;
  family_id uuid;
begin
  if new.user_id is null then raise exception 'Sign in before registering'; end if;
  if tg_table_name = 'oom_registrations' then
    first_name_value := new.player_first_name;
    last_name_value := new.player_last_name;
    birth_date := new.player_date_of_birth;
  else
    first_name_value := new.junior_first_name;
    last_name_value := new.junior_last_name;
    birth_date := nullif(new.submission ->> 'junior_date_of_birth', '')::date;
  end if;
  -- Re-enrolment may omit DOB. Do not guess which family member that is.
  if birth_date is null then return new; end if;
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  select id into family_id from public.dependents
    where client_id = new.user_id and lower(trim(first_name)) = lower(trim(first_name_value))
      and lower(trim(last_name)) = lower(trim(last_name_value)) and date_of_birth = birth_date
    order by id limit 1;
  if family_id is null then
    insert into public.dependents(client_id, first_name, last_name, date_of_birth)
      values(new.user_id, trim(first_name_value), trim(last_name_value), birth_date) returning id into family_id;
  end if;
  if tg_table_name = 'oom_registrations' then new.dependent_id := family_id; end if;
  return new;
end;
$$;
revoke all on function public.link_registration_family_golfer() from public, anon, authenticated;
create trigger oom_link_family before insert on public.oom_registrations
  for each row execute function public.link_registration_family_golfer();
create trigger academy_link_family before insert on public.junior_academy_registrations
  for each row execute function public.link_registration_family_golfer();
commit;
