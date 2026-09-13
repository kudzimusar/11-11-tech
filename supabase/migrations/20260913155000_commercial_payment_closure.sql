-- Commercial payment closure: bind future charges to the payment method actually
-- authorised during Checkout and reuse commercial organisations deterministically.

alter table public.payment_authorizations
  add column if not exists stripe_payment_method_id text,
  add column if not exists payment_method_saved_at timestamptz;

create index if not exists payment_authorizations_saved_method_idx
  on public.payment_authorizations (payment_plan_id, authorization_type)
  where revoked_at is null and stripe_payment_method_id is not null;

comment on column public.payment_authorizations.stripe_payment_method_id is
  'Stripe PaymentMethod captured from the interactive Checkout that followed this explicit authorization. Service-role write only.';

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
  org_key text;
  account_email text;
begin
  org_name := coalesce(nullif(trim(new.organization),''), nullif(trim(new.name),''), 'Prospective client');
  org_key := lower(regexp_replace(trim(org_name), '\s+', ' ', 'g'));
  account_email := lower(trim(new.email));

  -- Prevent two simultaneous submissions for the same commercial identity from
  -- creating parallel organisation shells. We deliberately key on both email
  -- and normalised organisation name: one billing address may legitimately
  -- represent more than one legal entity.
  perform pg_advisory_xact_lock(hashtextextended(account_email || '|' || org_key, 0));

  select o.id into org_id
  from public.organizations o
  where lower(trim(coalesce(o.billing_email,''))) = account_email
    and lower(regexp_replace(trim(coalesce(nullif(o.trading_name,''), o.legal_name)), '\s+', ' ', 'g')) = org_key
  order by o.created_at asc
  limit 1;

  if org_id is null then
    insert into public.organizations (legal_name, trading_name, billing_email, website, country, status)
    values (org_name, nullif(trim(new.organization),''), account_email, new.website, new.region, 'prospect')
    returning id into org_id;
  else
    update public.organizations
    set website = coalesce(website, new.website),
        country = coalesce(country, new.region),
        updated_at = now()
    where id = org_id;
  end if;

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
  values (project_id, account_email, new.name, 'primary');

  insert into public.client_invites (organization_id, email, role)
  values (org_id, account_email, 'owner')
  on conflict do nothing;

  insert into public.audit_events (organization_id, project_id, event_type, entity_type, entity_id, context)
  values (org_id, project_id, 'lead.commercial_shell_created', 'lead', new.id,
    jsonb_build_object(
      'lead_reference', new.reference,
      'email', account_email,
      'organisation_identity', org_key,
      'reused_organisation', exists (
        select 1 from public.projects p where p.organization_id = org_id and p.id <> project_id
      )
    ));

  return new;
end;
$$;

revoke all on function public.provision_lead_commercial_shell() from public, anon, authenticated;
grant execute on function public.provision_lead_commercial_shell() to service_role;
