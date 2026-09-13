-- Make pseudonymous abuse-control retention deterministic even during idle periods.
create extension if not exists pg_cron with schema extensions;

do $$
begin
  if exists (select 1 from cron.job where jobname = '11-11-tech-ingress-retention') then
    update cron.job
      set schedule = '17 * * * *',
          command = $cmd$delete from public.ingress_rate_limits where window_started_at < now() - interval '48 hours';$cmd$
    where jobname = '11-11-tech-ingress-retention';
  else
    perform cron.schedule(
      '11-11-tech-ingress-retention',
      '17 * * * *',
      $cmd$delete from public.ingress_rate_limits where window_started_at < now() - interval '48 hours';$cmd$
    );
  end if;
end
$$;
