create table if not exists public.payment_authorizations (
  id uuid primary key default gen_random_uuid(),
  payment_plan_id uuid not null references public.payment_plans(id) on delete restrict,
  project_id uuid not null references public.projects(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  profile_id uuid not null references public.commercial_profiles(id) on delete restrict,
  authorization_type text not null default 'scheduled_charges' check (authorization_type in ('scheduled_charges','recurring_subscription')),
  authorization_text_version text not null default 'v1',
  accepted_at timestamptz not null default now(),
  user_agent text,
  revoked_at timestamptz,
  unique (payment_plan_id, profile_id, authorization_type)
);

alter table public.payment_authorizations enable row level security;
revoke all on public.payment_authorizations from anon, authenticated;
grant select on public.payment_authorizations to authenticated;
grant all on public.payment_authorizations to service_role;

create policy payment_authorizations_member_select on public.payment_authorizations
for select to authenticated using (public.is_org_member(organization_id) or public.is_commercial_admin());

create or replace function public.authorize_payment_plan(
  target_plan uuid,
  authorization_kind text default 'scheduled_charges',
  client_user_agent text default null
)
returns public.payment_authorizations
language plpgsql
security definer
set search_path = public
as $$
declare
  p public.payment_plans;
  result public.payment_authorizations;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into p from public.payment_plans where id = target_plan;
  if p.id is null or not public.is_org_member(p.organization_id) then raise exception 'Payment plan not available'; end if;
  if authorization_kind not in ('scheduled_charges','recurring_subscription') then raise exception 'Unsupported authorization type'; end if;

  insert into public.payment_authorizations (
    payment_plan_id, project_id, organization_id, profile_id,
    authorization_type, authorization_text_version, user_agent
  ) values (
    p.id, p.project_id, p.organization_id, auth.uid(),
    authorization_kind, 'v1', left(client_user_agent, 512)
  )
  on conflict (payment_plan_id, profile_id, authorization_type)
  do update set accepted_at = now(), revoked_at = null, user_agent = excluded.user_agent
  returning * into result;

  insert into public.audit_events (actor_profile_id, organization_id, project_id, event_type, entity_type, entity_id, context)
  values (auth.uid(), p.organization_id, p.project_id, 'payment.authorization.accepted', 'payment_plan', p.id,
    jsonb_build_object('authorization_type', authorization_kind, 'text_version', 'v1'));

  return result;
end;
$$;

revoke all on function public.authorize_payment_plan(uuid,text,text) from public, anon;
grant execute on function public.authorize_payment_plan(uuid,text,text) to authenticated;
