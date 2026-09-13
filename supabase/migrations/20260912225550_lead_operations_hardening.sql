alter table public.leads
  add column if not exists request_id text,
  add column if not exists landing_path text,
  add column if not exists notification_error text;

alter table public.conversion_events
  add column if not exists landing_path text;

create unique index if not exists leads_request_id_uidx
  on public.leads (request_id)
  where request_id is not null;

create index if not exists leads_email_created_at_idx
  on public.leads (lower(email), created_at desc);

create index if not exists conversion_events_session_created_at_idx
  on public.conversion_events (session_id, created_at desc);

alter table public.leads
  drop constraint if exists leads_request_id_length_check;

alter table public.leads
  add constraint leads_request_id_length_check
  check (request_id is null or char_length(request_id) between 12 and 100);

alter table public.leads
  drop constraint if exists leads_goals_length_check;

alter table public.leads
  add constraint leads_goals_length_check
  check (char_length(goals) between 20 and 5000);
