create sequence if not exists public.lead_reference_seq start 1;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  reference text unique,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','reviewing','qualified','proposal','won','lost','spam')),
  name text not null,
  email text not null,
  organization text,
  region text,
  website text,
  industry text,
  capability text,
  service text,
  outcome text,
  current_system text,
  goals text not null,
  budget text,
  timeline text,
  engagement text,
  legal_needs text[] not null default '{}',
  preferred_contact text,
  referral_source text,
  consent boolean not null default false,
  session_id text,
  source_path text,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_hash text,
  user_agent text,
  internal_brief text,
  notification_sent boolean not null default false
);

create or replace function public.assign_lead_reference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  code text;
begin
  code := upper(regexp_replace(coalesce(nullif(new.capability,''), 'DISCOVERY'), '[^A-Za-z0-9]+', '-', 'g'));
  new.reference := '11T-' || trim(both '-' from code) || '-' || lpad(nextval('public.lead_reference_seq')::text, 4, '0');
  return new;
end;
$$;

drop trigger if exists trg_assign_lead_reference on public.leads;
create trigger trg_assign_lead_reference
before insert on public.leads
for each row when (new.reference is null)
execute function public.assign_lead_reference();

create table if not exists public.conversion_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event_type text not null,
  session_id text,
  source_path text,
  capability text,
  industry text,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  context jsonb not null default '{}'::jsonb,
  ip_hash text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_capability_idx on public.leads (capability, created_at desc);
create index if not exists leads_ip_hash_idx on public.leads (ip_hash, created_at desc);
create index if not exists conversion_events_created_at_idx on public.conversion_events (created_at desc);
create index if not exists conversion_events_type_idx on public.conversion_events (event_type, created_at desc);
create index if not exists conversion_events_ip_hash_idx on public.conversion_events (ip_hash, created_at desc);

alter table public.leads enable row level security;
alter table public.conversion_events enable row level security;

revoke all on public.leads from anon, authenticated;
revoke all on public.conversion_events from anon, authenticated;
revoke all on sequence public.lead_reference_seq from anon, authenticated;

grant all on public.leads to service_role;
grant all on public.conversion_events to service_role;
grant usage, select on sequence public.lead_reference_seq to service_role;
