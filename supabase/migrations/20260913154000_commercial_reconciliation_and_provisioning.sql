-- Commercial platform completion: Stripe idempotency, recurring configuration,
-- immutable document content snapshots and immediate lead -> client/project shell provisioning.

alter table public.payment_plans
  add column if not exists recurring_interval text check (recurring_interval is null or recurring_interval in ('week','month','quarter','year')),
  add column if not exists recurring_interval_count integer check (recurring_interval_count is null or recurring_interval_count > 0);

alter table public.project_documents
  add column if not exists content_snapshot jsonb not null default '{}'::jsonb;

create table if not exists public.stripe_events (
  id text primary key,
  event_type text not null,
  livemode boolean not null default false,
  status text not null default 'received' check (status in ('received','processed','ignored','failed')),
  payload_sha256 text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error_message text
);

alter table public.stripe_events enable row level security;
revoke all on public.stripe_events from anon, authenticated;
grant select on public.stripe_events to authenticated;
grant all on public.stripe_events to service_role;

create policy stripe_events_admin_select on public.stripe_events
for select to authenticated using (public.is_commercial_admin());

create unique index if not exists projects_lead_unique_idx on public.projects (lead_id) where lead_id is not null;

create or replace function public.provision_lead_commercial_shell()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  org_id uuid;
  project_id uuid;
  org_name text;
begin
  org_name := coalesce(nullif(trim(new.organization),''), nullif(trim(new.name),''), 'Prospective client');

  insert into public.organizations (legal_name, trading_name, billing_email, website, country, status)
  values (org_name, nullif(trim(new.organization),''), lower(new.email), new.website, new.region, 'prospect')
  returning id into org_id;

  insert into public.projects (
    organization_id, lead_id, title, service_category, summary, currency, contract_value_minor, status
  ) values (
    org_id,
    new.id,
    org_name || ' — ' || coalesce(nullif(new.service,''), nullif(new.capability,''), 'Discovery'),
    coalesce(nullif(new.service,''), new.capability),
    new.goals,
    'USD',
    0,
    'draft'
  )
  returning id into project_id;

  insert into public.project_contacts (project_id, email, name, role)
  values (project_id, lower(new.email), new.name, 'primary');

  insert into public.client_invites (organization_id, email, role)
  values (org_id, lower(new.email), 'owner')
  on conflict do nothing;

  insert into public.audit_events (organization_id, project_id, event_type, entity_type, entity_id, context)
  values (org_id, project_id, 'lead.commercial_shell_created', 'lead', new.id,
    jsonb_build_object('lead_reference',new.reference,'email',lower(new.email)));

  return new;
end;
$$;

revoke all on function public.provision_lead_commercial_shell() from public, anon, authenticated;
grant execute on function public.provision_lead_commercial_shell() to service_role;

drop trigger if exists trg_provision_lead_commercial_shell on public.leads;
create trigger trg_provision_lead_commercial_shell
after insert on public.leads
for each row execute function public.provision_lead_commercial_shell();

-- Helper used by checkout/webhook server code. It deliberately returns only
-- the first outstanding installment after a plan has been selected.
create or replace function public.next_payable_installment(target_plan uuid)
returns table (id uuid, amount_minor bigint, paid_minor bigint, due_at timestamptz, sequence_no integer)
language sql
stable
security definer
set search_path = public
as $$
  select i.id, i.amount_minor, i.paid_minor, i.due_at, i.sequence_no
  from public.payment_installments i
  join public.payment_plans p on p.id = i.payment_plan_id
  where i.payment_plan_id = target_plan
    and i.status not in ('paid','waived','cancelled')
    and (public.is_org_member(p.organization_id) or public.is_commercial_admin())
  order by i.sequence_no
  limit 1;
$$;

revoke all on function public.next_payable_installment(uuid) from public, anon;
grant execute on function public.next_payable_installment(uuid) to authenticated, service_role;
