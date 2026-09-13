-- Every conversion event written by the public ingress function is associated
-- with the server-derived HMAC of the request IP. Require that invariant in
-- the database so direct service-role writes cannot silently weaken it.
alter table public.conversion_events
  alter column ip_hash set not null;
