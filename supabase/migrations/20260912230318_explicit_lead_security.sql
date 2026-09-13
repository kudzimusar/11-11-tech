drop policy if exists deny_public_leads on public.leads;
create policy deny_public_leads
on public.leads
for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists deny_public_conversion_events on public.conversion_events;
create policy deny_public_conversion_events
on public.conversion_events
for all
to anon, authenticated
using (false)
with check (false);

revoke execute on function public.assign_lead_reference() from public, anon, authenticated;
grant execute on function public.assign_lead_reference() to service_role;

-- This project-level event trigger enforces RLS on newly created public tables.
-- It should run only as an event trigger, never as a public RPC.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
