# 11-11 Tech Website 2.3 — Commercial Conversion & Lead Operations

## Objective
Turn the public website from a brochure with a mailto fallback into a secure, measurable commercial intake system without exposing privileged credentials in the Vite/GitHub Pages frontend.

## Public flow
Visitor → Service / Industry / Work / Pricing → Guided intake → Secure Edge Function → Lead record → Resend notification → Qualified brief → Follow-up.

If the secure endpoint is not configured, the UI retains the existing structured email fallback rather than pretending a database submission occurred.

## Browser responsibilities
- classify the requested business outcome, capability, service and industry;
- capture budget, timeline, engagement model, organization, region and current system;
- capture preferred contact method and referral/source;
- capture legal/procurement requirements (NDA, MSA, DPA, security review, SLA, vendor onboarding);
- require explicit contact consent;
- include an invisible honeypot field;
- generate a portable project brief;
- submit only to `VITE_LEAD_API_URL` when configured;
- record first-party, non-fingerprinting conversion events only when the secure endpoint exists.

No Supabase service-role key or Resend API key belongs in the browser bundle.

## Database
Migration: `supabase/migrations/20260913010000_lead_operations.sql`

Tables:
- `leads` — commercial opportunity record with generated `11T-<CAPABILITY>-NNNN` reference;
- `conversion_events` — first-party route and conversion measurement.

Both tables have RLS enabled and direct `anon` / `authenticated` table privileges revoked. Writes are performed by the Edge Function using the service role.

## Edge Function
Function: `supabase/functions/lead-intake/index.ts`

The public function implements its own controls because an anonymous website form cannot require a user JWT:
- strict POST / OPTIONS handling;
- origin allow-list;
- payload-size limit;
- email and required-field validation;
- honeypot rejection;
- salted IP hashing rather than raw-IP analytics storage;
- per-hour lead and event rate limits;
- length limits for submitted fields;
- server-generated lead reference;
- server-side internal brief;
- database persistence before notification;
- Resend notification when configured;
- graceful notification failure without losing the lead.

## Edge Function secrets
Configure these only in the secure function environment:
- `SUPABASE_URL` (provided by Supabase runtime)
- `SUPABASE_SERVICE_ROLE_KEY` (provided/configured securely)
- `ALLOWED_ORIGINS=https://kudzimusar.github.io`
- `IP_HASH_SALT=<random-secret>`
- `RESEND_API_KEY=<secret>`
- `LEAD_NOTIFY_TO=<internal-inbox>`
- `LEAD_FROM=<verified-sender>`

## GitHub Pages build configuration
Set the public build variable:

`VITE_LEAD_API_URL=https://<project-ref>.supabase.co/functions/v1/lead-intake`

Until that variable is present, the production website intentionally displays and uses the structured email fallback.

## Privacy model
- no advertising cookies;
- no cross-site profile;
- no browser fingerprint;
- session identifier stored in `sessionStorage` only;
- route, capability, industry, referrer host and UTM fields may be recorded;
- raw IP is not persisted for analytics; a salted hash is used for abuse controls;
- enquiry content is stored only after explicit submission and consent.

## Footer / closing system
2.3 also replaces the former dense footer with the approved corporate composition:
1. light sector credibility strip;
2. cinematic global CTA;
3. white corporate footer with brand, navigation, external/contact links, legal row and Tokyo / Harare / Global positioning.

The visual structure follows the supplied reference closely while avoiding fabricated customer logos or unsupported client claims.

## Remaining account-level activation
A dedicated 11-11 Tech Supabase project must be created before the migration and Edge Function can be deployed. Do not reuse an unrelated project. Supabase project creation requires explicit organization/cost confirmation. A verified Resend sender is also required before live notification email can be enabled.
