-- Harden browser write access behind narrow RPCs.

revoke insert on public.agreement_acceptances from authenticated;
revoke update on public.payment_plans from authenticated;

create or replace function public.accept_project_document(
  target_document uuid,
  acknowledgement text,
  client_user_agent text default null
)
returns public.agreement_acceptances
language plpgsql
security definer
set search_path = public
as $$
declare
  d public.project_documents;
  result public.agreement_acceptances;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select * into d
  from public.project_documents
  where id = target_document and status = 'issued';

  if d.id is null or not public.is_org_member(d.organization_id) then
    raise exception 'Document not available';
  end if;

  if nullif(trim(acknowledgement),'') is null then
    raise exception 'Acknowledgement key required';
  end if;

  insert into public.agreement_acceptances (
    project_id, organization_id, profile_id, document_id,
    document_version, document_sha256, acknowledgement_key, user_agent
  ) values (
    d.project_id, d.organization_id, auth.uid(), d.id,
    d.version, d.sha256, acknowledgement, left(client_user_agent, 512)
  )
  on conflict (project_id, profile_id, document_id, acknowledgement_key)
  do update set user_agent = excluded.user_agent
  returning * into result;

  insert into public.audit_events (actor_profile_id, organization_id, project_id, event_type, entity_type, entity_id, context)
  values (auth.uid(), d.organization_id, d.project_id, 'agreement.accepted', 'project_document', d.id,
    jsonb_build_object('acknowledgement', acknowledgement, 'document_version', d.version, 'sha256', d.sha256));

  return result;
end;
$$;

revoke all on function public.accept_project_document(uuid,text,text) from public, anon;
grant execute on function public.accept_project_document(uuid,text,text) to authenticated;

create or replace function public.select_payment_plan(target_plan uuid)
returns public.payment_plans
language plpgsql
security definer
set search_path = public
as $$
declare
  p public.payment_plans;
  result public.payment_plans;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select * into p from public.payment_plans where id = target_plan for update;
  if p.id is null or p.status <> 'offered' or not public.is_org_member(p.organization_id) then
    raise exception 'Payment plan not available';
  end if;

  update public.payment_plans
  set status = 'accepted', selected_by = auth.uid(), selected_at = now()
  where id = p.id
  returning * into result;

  -- Any other offered plan for the project becomes cancelled once the client selects one.
  update public.payment_plans
  set status = 'cancelled'
  where project_id = p.project_id and id <> p.id and status = 'offered';

  insert into public.audit_events (actor_profile_id, organization_id, project_id, event_type, entity_type, entity_id, context)
  values (auth.uid(), p.organization_id, p.project_id, 'payment_plan.accepted', 'payment_plan', p.id,
    jsonb_build_object('name', p.name, 'plan_type', p.plan_type, 'total_minor', p.total_minor, 'currency', p.currency));

  return result;
end;
$$;

revoke all on function public.select_payment_plan(uuid) from public, anon;
grant execute on function public.select_payment_plan(uuid) to authenticated;

create or replace function public.project_agreement_ready(target_project uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with project_scope as (
    select p.id, p.organization_id
    from public.projects p
    where p.id = target_project
      and (public.is_org_member(p.organization_id) or public.is_commercial_admin())
  ), required_docs as (
    select d.id
    from public.project_documents d
    join project_scope p on p.id = d.project_id
    where d.required_for_acceptance = true and d.status = 'issued'
  )
  select exists (select 1 from project_scope)
    and not exists (
      select 1 from required_docs d
      where not exists (
        select 1 from public.agreement_acceptances a
        where a.document_id = d.id and a.profile_id = auth.uid()
      )
    );
$$;

revoke all on function public.project_agreement_ready(uuid) from public, anon;
grant execute on function public.project_agreement_ready(uuid) to authenticated, service_role;

-- Keep browser grants read-only apart from narrow RPC execution.
revoke insert, update, delete on public.organizations, public.organization_members, public.projects,
  public.project_contacts, public.document_templates, public.project_documents, public.payment_installments,
  public.invoices, public.payments, public.subscriptions, public.change_orders, public.milestones,
  public.audit_events, public.client_invites
from authenticated;
