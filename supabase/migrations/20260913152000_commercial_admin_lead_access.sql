-- Authenticated users remain denied unless explicitly registered as active commercial admins.

grant select on public.leads to authenticated;

drop policy if exists leads_commercial_admin_select on public.leads;
create policy leads_commercial_admin_select on public.leads
for select to authenticated
using (public.is_commercial_admin());
