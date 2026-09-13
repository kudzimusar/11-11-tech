-- 11-11 Tech Commercial Client Platform 1.0
-- Canonical commercial schema, tenant isolation, agreement evidence and document vault.

create extension if not exists pgcrypto;

create sequence if not exists public.project_reference_seq start 1;
create sequence if not exists public.invoice_reference_seq start 1;
create sequence if not exists public.receipt_reference_seq start 1;

create table if not exists public.commercial_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists commercial_profiles_email_idx on public.commercial_profiles (lower(email));

create table if not exists public.commercial_admins (
  profile_id uuid primary key references public.commercial_profiles(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','finance','operations','legal','support')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  trading_name text,
  billing_email text,
  phone text,
  website text,
  country text,
  stripe_customer_id text unique,
  status text not null default 'active' check (status in ('prospect','active','paused','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.commercial_profiles(id) on delete cascade,
  role text not null default 'client' check (role in ('owner','billing','client','viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, profile_id)
);

create table if not exists public.client_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null default 'client' check (role in ('owner','billing','client','viewer')),
  invited_by uuid references public.commercial_profiles(id),
  expires_at timestamptz not null default (now() + interval '30 days'),
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists active_client_invite_idx
  on public.client_invites (organization_id, lower(email))
  where claimed_at is null;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  reference text unique,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  lead_id uuid references public.leads(id) on delete set null,
  title text not null,
  service_category text,
  summary text,
  currency text not null default 'USD' check (char_length(currency) = 3),
  contract_value_minor bigint not null default 0 check (contract_value_minor >= 0),
  status text not null default 'draft' check (status in ('draft','proposed','awaiting_acceptance','awaiting_payment','active','paused','completed','cancelled')),
  proposed_start date,
  target_completion date,
  accepted_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_contacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  profile_id uuid references public.commercial_profiles(id) on delete set null,
  email text not null,
  name text,
  role text not null default 'primary' check (role in ('primary','billing','legal','technical','executive')),
  created_at timestamptz not null default now()
);

create table if not exists public.document_templates (
  id uuid primary key default gen_random_uuid(),
  document_type text not null,
  name text not null,
  version integer not null default 1 check (version > 0),
  body_markdown text not null default '',
  required_by_default boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (document_type, version)
);

create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  document_type text not null,
  title text not null,
  reference text,
  version integer not null default 1 check (version > 0),
  status text not null default 'draft' check (status in ('draft','issued','superseded')),
  required_for_acceptance boolean not null default false,
  storage_path text,
  sha256 text,
  issued_at timestamptz,
  created_by uuid references public.commercial_profiles(id),
  created_at timestamptz not null default now(),
  unique (project_id, document_type, version)
);

create table if not exists public.agreement_acceptances (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  profile_id uuid not null references public.commercial_profiles(id) on delete restrict,
  document_id uuid not null references public.project_documents(id) on delete restrict,
  document_version integer not null,
  document_sha256 text,
  acknowledgement_key text not null,
  accepted_at timestamptz not null default now(),
  user_agent text,
  unique (project_id, profile_id, document_id, acknowledgement_key)
);

create table if not exists public.payment_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null,
  plan_type text not null check (plan_type in ('full','deposit_balance','installments','recurring')),
  currency text not null check (char_length(currency) = 3),
  total_minor bigint not null check (total_minor >= 0),
  minimum_extra_payment_minor bigint check (minimum_extra_payment_minor is null or minimum_extra_payment_minor >= 0),
  allow_extra_payments boolean not null default false,
  requires_autopay_authorization boolean not null default false,
  status text not null default 'draft' check (status in ('draft','offered','accepted','active','completed','cancelled','defaulted')),
  selected_by uuid references public.commercial_profiles(id),
  selected_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_installments (
  id uuid primary key default gen_random_uuid(),
  payment_plan_id uuid not null references public.payment_plans(id) on delete cascade,
  sequence_no integer not null check (sequence_no > 0),
  amount_minor bigint not null check (amount_minor > 0),
  due_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled','due','partially_paid','paid','late','waived','cancelled')),
  paid_minor bigint not null default 0 check (paid_minor >= 0),
  unique (payment_plan_id, sequence_no)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  reference text unique,
  project_id uuid not null references public.projects(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  payment_plan_id uuid references public.payment_plans(id) on delete set null,
  installment_id uuid references public.payment_installments(id) on delete set null,
  currency text not null check (char_length(currency) = 3),
  amount_due_minor bigint not null check (amount_due_minor >= 0),
  amount_paid_minor bigint not null default 0 check (amount_paid_minor >= 0),
  status text not null default 'draft' check (status in ('draft','open','partially_paid','paid','void','uncollectible')),
  due_at timestamptz,
  stripe_invoice_id text unique,
  issued_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  receipt_reference text unique,
  project_id uuid not null references public.projects(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  invoice_id uuid references public.invoices(id) on delete set null,
  installment_id uuid references public.payment_installments(id) on delete set null,
  currency text not null check (char_length(currency) = 3),
  amount_minor bigint not null check (amount_minor > 0),
  status text not null default 'pending' check (status in ('pending','succeeded','failed','refunded','partially_refunded')),
  method text not null default 'stripe' check (method in ('stripe','bank_transfer','cash','mobile_money','paypal','other')),
  stripe_payment_intent_id text unique,
  stripe_checkout_session_id text unique,
  external_reference text,
  stripe_event_id text,
  received_at timestamptz,
  recorded_by uuid references public.commercial_profiles(id),
  created_at timestamptz not null default now()
);

create unique index if not exists payments_stripe_event_idx on public.payments (stripe_event_id) where stripe_event_id is not null;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  payment_plan_id uuid references public.payment_plans(id) on delete set null,
  stripe_subscription_id text unique,
  status text not null default 'pending' check (status in ('pending','active','past_due','paused','cancelled','completed')),
  currency text not null check (char_length(currency) = 3),
  recurring_minor bigint not null check (recurring_minor >= 0),
  interval text not null default 'month' check (interval in ('week','month','quarter','year')),
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.change_orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  reference text,
  title text not null,
  description text,
  value_delta_minor bigint not null default 0,
  status text not null default 'draft' check (status in ('draft','issued','accepted','rejected','cancelled')),
  accepted_by uuid references public.commercial_profiles(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  due_at timestamptz,
  status text not null default 'planned' check (status in ('planned','in_progress','client_review','accepted','blocked','complete','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  actor_profile_id uuid references public.commercial_profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  context jsonb not null default '{}'::jsonb
);

create or replace function public.is_commercial_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.commercial_admins a
    where a.profile_id = auth.uid() and a.active = true
  );
$$;

create or replace function public.is_org_member(target_organization uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = target_organization
      and m.profile_id = auth.uid()
      and m.active = true
  );
$$;

revoke all on function public.is_commercial_admin() from public, anon;
revoke all on function public.is_org_member(uuid) from public, anon;
grant execute on function public.is_commercial_admin() to authenticated, service_role;
grant execute on function public.is_org_member(uuid) to authenticated, service_role;

create or replace function public.sync_commercial_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.commercial_profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.commercial_profiles.full_name),
        updated_at = now();
  return new;
end;
$$;

revoke all on function public.sync_commercial_profile() from public, anon, authenticated;
grant execute on function public.sync_commercial_profile() to service_role;

drop trigger if exists trg_sync_commercial_profile on auth.users;
create trigger trg_sync_commercial_profile
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_commercial_profile();

insert into public.commercial_profiles (id, email, full_name)
select id, coalesce(email,''), coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name')
from auth.users
on conflict (id) do nothing;

create or replace function public.claim_commercial_invites()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed_count integer := 0;
  account_email text := lower(coalesce(auth.jwt()->>'email',''));
begin
  if auth.uid() is null or account_email = '' then
    raise exception 'Authenticated email required';
  end if;

  insert into public.organization_members (organization_id, profile_id, role)
  select i.organization_id, auth.uid(), i.role
  from public.client_invites i
  where lower(i.email) = account_email
    and i.claimed_at is null
    and i.expires_at > now()
  on conflict (organization_id, profile_id) do update
    set active = true, role = excluded.role;

  get diagnostics claimed_count = row_count;

  update public.client_invites
  set claimed_at = now()
  where lower(email) = account_email
    and claimed_at is null
    and expires_at > now();

  return claimed_count;
end;
$$;

revoke all on function public.claim_commercial_invites() from public, anon;
grant execute on function public.claim_commercial_invites() to authenticated;

create or replace function public.assign_project_reference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.reference is null then
    new.reference := '11T-PROJ-' || lpad(nextval('public.project_reference_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_project_reference on public.projects;
create trigger trg_assign_project_reference before insert on public.projects
for each row execute function public.assign_project_reference();

create or replace function public.assign_invoice_reference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.reference is null then
    new.reference := '11T-INV-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.invoice_reference_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_invoice_reference on public.invoices;
create trigger trg_assign_invoice_reference before insert on public.invoices
for each row execute function public.assign_invoice_reference();

create or replace function public.assign_receipt_reference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.receipt_reference is null and new.status = 'succeeded' then
    new.receipt_reference := '11T-RCT-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.receipt_reference_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_receipt_reference on public.payments;
create trigger trg_assign_receipt_reference before insert or update of status on public.payments
for each row execute function public.assign_receipt_reference();

create or replace function public.protect_accepted_document()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.agreement_acceptances a where a.document_id = old.id) then
    if tg_op = 'DELETE' then
      raise exception 'Accepted commercial documents cannot be deleted';
    end if;
    if new.storage_path is distinct from old.storage_path
       or new.sha256 is distinct from old.sha256
       or new.version is distinct from old.version
       or new.document_type is distinct from old.document_type
       or new.project_id is distinct from old.project_id
       or new.organization_id is distinct from old.organization_id then
      raise exception 'Accepted commercial document evidence is immutable';
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists trg_protect_accepted_document on public.project_documents;
create trigger trg_protect_accepted_document
before update or delete on public.project_documents
for each row execute function public.protect_accepted_document();

-- Indexes for portal and admin queries.
create index if not exists organization_members_profile_idx on public.organization_members (profile_id, active, organization_id);
create index if not exists projects_org_idx on public.projects (organization_id, created_at desc);
create index if not exists project_documents_project_idx on public.project_documents (project_id, status, created_at desc);
create index if not exists acceptances_project_idx on public.agreement_acceptances (project_id, accepted_at desc);
create index if not exists payment_plans_project_idx on public.payment_plans (project_id, created_at desc);
create index if not exists installments_plan_idx on public.payment_installments (payment_plan_id, sequence_no);
create index if not exists invoices_org_idx on public.invoices (organization_id, status, due_at);
create index if not exists payments_org_idx on public.payments (organization_id, created_at desc);
create index if not exists audit_project_idx on public.audit_events (project_id, created_at desc);

-- RLS is mandatory on every commercial table.
alter table public.commercial_profiles enable row level security;
alter table public.commercial_admins enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.client_invites enable row level security;
alter table public.projects enable row level security;
alter table public.project_contacts enable row level security;
alter table public.document_templates enable row level security;
alter table public.project_documents enable row level security;
alter table public.agreement_acceptances enable row level security;
alter table public.payment_plans enable row level security;
alter table public.payment_installments enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.change_orders enable row level security;
alter table public.milestones enable row level security;
alter table public.audit_events enable row level security;

-- Default privilege posture: no anonymous commercial data.
revoke all on public.commercial_profiles, public.commercial_admins, public.organizations,
  public.organization_members, public.client_invites, public.projects, public.project_contacts,
  public.document_templates, public.project_documents, public.agreement_acceptances,
  public.payment_plans, public.payment_installments, public.invoices, public.payments,
  public.subscriptions, public.change_orders, public.milestones, public.audit_events
from anon;

grant select on public.commercial_profiles, public.commercial_admins, public.organizations,
  public.organization_members, public.projects, public.project_contacts, public.document_templates,
  public.project_documents, public.agreement_acceptances, public.payment_plans,
  public.payment_installments, public.invoices, public.payments, public.subscriptions,
  public.change_orders, public.milestones, public.audit_events
to authenticated;

grant insert on public.agreement_acceptances to authenticated;
grant update on public.payment_plans to authenticated;

grant all on public.commercial_profiles, public.commercial_admins, public.organizations,
  public.organization_members, public.client_invites, public.projects, public.project_contacts,
  public.document_templates, public.project_documents, public.agreement_acceptances,
  public.payment_plans, public.payment_installments, public.invoices, public.payments,
  public.subscriptions, public.change_orders, public.milestones, public.audit_events
to service_role;

grant usage, select on sequence public.project_reference_seq, public.invoice_reference_seq, public.receipt_reference_seq to service_role;

-- Profiles.
drop policy if exists commercial_profiles_self_or_admin on public.commercial_profiles;
create policy commercial_profiles_self_or_admin on public.commercial_profiles
for select to authenticated using (id = auth.uid() or public.is_commercial_admin());

-- Admin registry is visible only to admins (and service_role bypasses RLS).
drop policy if exists commercial_admins_admin_select on public.commercial_admins;
create policy commercial_admins_admin_select on public.commercial_admins
for select to authenticated using (public.is_commercial_admin());

-- Organisation-scoped reads.
drop policy if exists organizations_member_select on public.organizations;
create policy organizations_member_select on public.organizations
for select to authenticated using (public.is_org_member(id) or public.is_commercial_admin());

drop policy if exists organization_members_member_select on public.organization_members;
create policy organization_members_member_select on public.organization_members
for select to authenticated using (profile_id = auth.uid() or public.is_org_member(organization_id) or public.is_commercial_admin());

drop policy if exists projects_member_select on public.projects;
create policy projects_member_select on public.projects
for select to authenticated using (public.is_org_member(organization_id) or public.is_commercial_admin());

drop policy if exists project_contacts_member_select on public.project_contacts;
create policy project_contacts_member_select on public.project_contacts
for select to authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and (public.is_org_member(p.organization_id) or public.is_commercial_admin()))
);

drop policy if exists templates_authenticated_select on public.document_templates;
create policy templates_authenticated_select on public.document_templates
for select to authenticated using (active = true or public.is_commercial_admin());

drop policy if exists documents_member_select on public.project_documents;
create policy documents_member_select on public.project_documents
for select to authenticated using (public.is_org_member(organization_id) or public.is_commercial_admin());

drop policy if exists acceptances_member_select on public.agreement_acceptances;
create policy acceptances_member_select on public.agreement_acceptances
for select to authenticated using (public.is_org_member(organization_id) or public.is_commercial_admin());

drop policy if exists acceptances_client_insert on public.agreement_acceptances;
create policy acceptances_client_insert on public.agreement_acceptances
for insert to authenticated with check (
  profile_id = auth.uid()
  and public.is_org_member(organization_id)
  and exists (
    select 1 from public.project_documents d
    where d.id = document_id and d.project_id = project_id and d.organization_id = organization_id and d.status = 'issued'
  )
);

drop policy if exists payment_plans_member_select on public.payment_plans;
create policy payment_plans_member_select on public.payment_plans
for select to authenticated using (public.is_org_member(organization_id) or public.is_commercial_admin());

drop policy if exists payment_plans_client_select_plan on public.payment_plans;
create policy payment_plans_client_select_plan on public.payment_plans
for update to authenticated
using (public.is_org_member(organization_id) and status = 'offered')
with check (public.is_org_member(organization_id) and selected_by = auth.uid() and status in ('accepted','active'));

drop policy if exists installments_member_select on public.payment_installments;
create policy installments_member_select on public.payment_installments
for select to authenticated using (
  exists (select 1 from public.payment_plans p where p.id = payment_plan_id and (public.is_org_member(p.organization_id) or public.is_commercial_admin()))
);

drop policy if exists invoices_member_select on public.invoices;
create policy invoices_member_select on public.invoices
for select to authenticated using (public.is_org_member(organization_id) or public.is_commercial_admin());

drop policy if exists payments_member_select on public.payments;
create policy payments_member_select on public.payments
for select to authenticated using (public.is_org_member(organization_id) or public.is_commercial_admin());

drop policy if exists subscriptions_member_select on public.subscriptions;
create policy subscriptions_member_select on public.subscriptions
for select to authenticated using (public.is_org_member(organization_id) or public.is_commercial_admin());

drop policy if exists change_orders_member_select on public.change_orders;
create policy change_orders_member_select on public.change_orders
for select to authenticated using (public.is_org_member(organization_id) or public.is_commercial_admin());

drop policy if exists milestones_member_select on public.milestones;
create policy milestones_member_select on public.milestones
for select to authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and (public.is_org_member(p.organization_id) or public.is_commercial_admin()))
);

drop policy if exists audit_events_member_select on public.audit_events;
create policy audit_events_member_select on public.audit_events
for select to authenticated using (
  public.is_commercial_admin()
  or (organization_id is not null and public.is_org_member(organization_id) and event_type in ('agreement.accepted','payment.succeeded','invoice.issued','document.issued'))
);

-- Private document vault. Path must begin with the organisation UUID.
insert into storage.buckets (id, name, public)
values ('client-documents', 'client-documents', false)
on conflict (id) do update set public = false;

drop policy if exists client_documents_member_read on storage.objects;
create policy client_documents_member_read on storage.objects
for select to authenticated using (
  bucket_id = 'client-documents'
  and (
    public.is_commercial_admin()
    or (
      (storage.foldername(name))[1] is not null
      and public.is_org_member(((storage.foldername(name))[1])::uuid)
    )
  )
);

-- Writes are intentionally service/admin only. Browser clients never upload authoritative contract evidence directly.
drop policy if exists client_documents_admin_insert on storage.objects;
create policy client_documents_admin_insert on storage.objects
for insert to authenticated with check (
  bucket_id = 'client-documents' and public.is_commercial_admin()
);

drop policy if exists client_documents_admin_update on storage.objects;
create policy client_documents_admin_update on storage.objects
for update to authenticated
using (bucket_id = 'client-documents' and public.is_commercial_admin())
with check (bucket_id = 'client-documents' and public.is_commercial_admin());

-- Seed controlled document categories; legal text itself remains subject to qualified review.
insert into public.document_templates (document_type, name, version, required_by_default, body_markdown)
values
  ('quotation','Quotation / Proposal',1,true,'Controlled commercial template. Populate project-specific pricing and validity.'),
  ('sow','Statement of Work',1,true,'Controlled SOW template. Populate scope, deliverables, exclusions, responsibilities, milestones and acceptance.'),
  ('service_terms','Master Service Terms',1,true,'Controlled legal template. Production wording requires legal approval.'),
  ('payment_terms','Payment Terms',1,true,'Controlled payment template. Include schedule, grace period, late-charge rules, suspension, refunds and applicable-law limitation.'),
  ('privacy','Privacy Notice',1,true,'Controlled privacy notice. Link to current public policy and snapshot the applicable version.'),
  ('nda','NDA / Confidentiality',1,false,'Conditional confidentiality template.'),
  ('sla','Service Level Agreement',1,false,'Conditional support / availability / response-time template.'),
  ('dpa','Data Processing Addendum',1,false,'Conditional data-processing template.'),
  ('security','Security Addendum',1,false,'Conditional security-responsibility template.'),
  ('ai_addendum','AI Addendum',1,false,'Conditional AI provider, data-use and limitation template.')
on conflict (document_type, version) do nothing;
