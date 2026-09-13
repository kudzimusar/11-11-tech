-- Native/mobile and shared lead-ingress hardening.
-- The lead tables are service-role only. This migration adds a second line of
-- defence beneath the Edge Function and an atomic, pseudonymous rate limiter.

alter table public.leads
  alter column request_id set not null,
  alter column reference set not null,
  alter column ip_hash set not null,
  alter column consent drop default;

alter table public.leads drop constraint if exists leads_consent_true_check;
alter table public.leads add constraint leads_consent_true_check check (consent is true);

alter table public.leads drop constraint if exists leads_name_bounds_check;
alter table public.leads add constraint leads_name_bounds_check
  check (char_length(name) between 1 and 160 and name = btrim(name));

alter table public.leads drop constraint if exists leads_email_integrity_check;
alter table public.leads add constraint leads_email_integrity_check
  check (
    char_length(email) between 3 and 254
    and email = lower(btrim(email))
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  );

alter table public.leads drop constraint if exists leads_capability_allowlist_check;
alter table public.leads add constraint leads_capability_allowlist_check
  check (capability is null or capability in ('ui-ux','enterprise','ai','software-data-cloud','transformation','talent','trust'));

alter table public.leads drop constraint if exists leads_reference_format_check;
alter table public.leads add constraint leads_reference_format_check
  check (reference ~ '^11T-[A-Z0-9-]+-[0-9]{4,}$');

alter table public.leads drop constraint if exists leads_ip_hash_format_check;
alter table public.leads add constraint leads_ip_hash_format_check
  check (ip_hash ~ '^[0-9a-f]{64}$');

alter table public.leads drop constraint if exists leads_field_bounds_check;
alter table public.leads add constraint leads_field_bounds_check check (
  (organization is null or char_length(organization) <= 200)
  and (region is null or char_length(region) <= 100)
  and (website is null or (char_length(website) <= 500 and website ~ '^https?://'))
  and (industry is null or char_length(industry) <= 140)
  and (service is null or char_length(service) <= 180)
  and (outcome is null or char_length(outcome) <= 180)
  and (current_system is null or char_length(current_system) <= 1000)
  and (budget is null or char_length(budget) <= 100)
  and (timeline is null or char_length(timeline) <= 100)
  and (engagement is null or char_length(engagement) <= 140)
  and cardinality(legal_needs) <= 12
  and (preferred_contact is null or char_length(preferred_contact) <= 100)
  and (referral_source is null or char_length(referral_source) <= 180)
  and (session_id is null or char_length(session_id) <= 100)
  and (source_path is null or char_length(source_path) <= 300)
  and (landing_path is null or char_length(landing_path) <= 300)
  and (referrer_host is null or char_length(referrer_host) <= 180)
  and (utm_source is null or char_length(utm_source) <= 100)
  and (utm_medium is null or char_length(utm_medium) <= 100)
  and (utm_campaign is null or char_length(utm_campaign) <= 160)
  and (user_agent is null or char_length(user_agent) <= 500)
  and (internal_brief is null or char_length(internal_brief) <= 8000)
  and (notification_error is null or char_length(notification_error) <= 300)
);

alter table public.conversion_events drop constraint if exists conversion_events_type_allowlist_check;
alter table public.conversion_events add constraint conversion_events_type_allowlist_check
  check (event_type in ('page_view','intake_step_viewed','lead_email_fallback','lead_success','lead_submit_attempt','lead_submit_failed','lead_submitted'));

alter table public.conversion_events drop constraint if exists conversion_events_capability_allowlist_check;
alter table public.conversion_events add constraint conversion_events_capability_allowlist_check
  check (capability is null or capability in ('ui-ux','enterprise','ai','software-data-cloud','transformation','talent','trust'));

alter table public.conversion_events drop constraint if exists conversion_events_ip_hash_format_check;
alter table public.conversion_events add constraint conversion_events_ip_hash_format_check
  check (ip_hash is null or ip_hash ~ '^[0-9a-f]{64}$');

alter table public.conversion_events drop constraint if exists conversion_events_payload_bounds_check;
alter table public.conversion_events add constraint conversion_events_payload_bounds_check check (
  char_length(event_type) <= 80
  and (session_id is null or char_length(session_id) <= 100)
  and (source_path is null or char_length(source_path) <= 300)
  and (landing_path is null or char_length(landing_path) <= 300)
  and (industry is null or char_length(industry) <= 100)
  and (referrer_host is null or char_length(referrer_host) <= 180)
  and (utm_source is null or char_length(utm_source) <= 100)
  and (utm_medium is null or char_length(utm_medium) <= 100)
  and (utm_campaign is null or char_length(utm_campaign) <= 160)
  and jsonb_typeof(context) = 'object'
  and octet_length(context::text) <= 8000
);

create table if not exists public.ingress_rate_limits (
  bucket text not null check (bucket in ('event-ip','lead-ip','lead-email')),
  subject_hash text not null check (subject_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  primary key (bucket, subject_hash)
);

create index if not exists ingress_rate_limits_window_idx
  on public.ingress_rate_limits (window_started_at);

alter table public.ingress_rate_limits enable row level security;
alter table public.ingress_rate_limits force row level security;

revoke all on public.ingress_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.ingress_rate_limits to service_role;

drop policy if exists deny_public_ingress_rate_limits on public.ingress_rate_limits;
create policy deny_public_ingress_rate_limits
on public.ingress_rate_limits
for all
to anon, authenticated
using (false)
with check (false);

create or replace function public.consume_ingress_rate_limit(
  p_bucket text,
  p_subject_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_started timestamptz;
begin
  if p_bucket not in ('event-ip','lead-ip','lead-email')
     or p_subject_hash !~ '^[0-9a-f]{64}$'
     or p_limit < 1 or p_limit > 1000
     or p_window_seconds < 60 or p_window_seconds > 86400 then
    raise exception 'Invalid ingress rate-limit request';
  end if;

  -- Rate-limit identifiers are HMACs, not raw IPs/emails, and expire quickly.
  delete from public.ingress_rate_limits
  where window_started_at < now() - interval '48 hours';

  insert into public.ingress_rate_limits (bucket, subject_hash, window_started_at, request_count)
  values (p_bucket, p_subject_hash, now(), 0)
  on conflict (bucket, subject_hash) do nothing;

  select request_count, window_started_at
    into v_count, v_started
  from public.ingress_rate_limits
  where bucket = p_bucket and subject_hash = p_subject_hash
  for update;

  if v_started <= now() - make_interval(secs => p_window_seconds) then
    update public.ingress_rate_limits
      set window_started_at = now(), request_count = 1
    where bucket = p_bucket and subject_hash = p_subject_hash;
    return true;
  end if;

  if v_count >= p_limit then
    return false;
  end if;

  update public.ingress_rate_limits
    set request_count = request_count + 1
  where bucket = p_bucket and subject_hash = p_subject_hash;

  return true;
end;
$$;

revoke execute on function public.consume_ingress_rate_limit(text,text,integer,integer)
  from public, anon, authenticated;
grant execute on function public.consume_ingress_rate_limit(text,text,integer,integer)
  to service_role;

alter table public.leads force row level security;
alter table public.conversion_events force row level security;
