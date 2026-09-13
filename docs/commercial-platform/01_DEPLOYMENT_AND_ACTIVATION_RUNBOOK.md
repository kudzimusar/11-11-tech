# 11-11 Tech Commercial Platform — Deployment & Activation Runbook

Status: production activation checklist  
Canonical design: `00_MASTER_PLAN_AND_OPERATIONS.md`

## 1. Safety rule

Do not point this platform at an unrelated Supabase or Stripe account. Production activation requires a dedicated 11-11 Tech Supabase project and the correct 11-11 Tech Stripe account. Start Stripe in test mode and certify the full journey before live keys are introduced.

## 2. Required Supabase deployment order

Apply migrations in timestamp order:

1. existing lead/conversion migrations;
2. `20260913150000_commercial_client_platform.sql`;
3. `20260913151000_commercial_write_boundaries.sql`;
4. `20260913152000_commercial_admin_lead_access.sql`;
5. `20260913153000_payment_authorizations.sql`;
6. `20260913154000_commercial_reconciliation_and_provisioning.sql`.

After migration, run Supabase security and performance advisors. Resolve RLS/security findings before inviting a real client.

## 3. Edge Functions

Deploy:

- `lead-intake` — public intake; custom origin/rate/validation controls in function.
- `commercial-admin` — JWT required.
- `document-render` — JWT required for browser/admin calls; internal renderer secret is checked for webhook-originated financial PDFs.
- `stripe-checkout` — JWT required.
- `stripe-webhook` — Stripe-signature verification is implemented in-function; deploy without platform JWT verification because Stripe cannot provide Supabase JWTs.
- `commercial-billing-run` — internal cron secret is verified in-function; deploy without platform JWT verification only when invoked by a protected scheduler.

## 4. Secrets

Configure in Supabase Edge Function secrets, never Vite/browser variables:

- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY` — `sk_test_...` during certification
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `COMMERCIAL_FROM`
- `PUBLIC_APP_URL`
- `ALLOWED_ORIGINS`
- `BILLING_CRON_SECRET`
- `DOCUMENT_RENDER_SECRET`
- existing lead secrets (`LEAD_NOTIFY_TO`, `LEAD_FROM`, `IP_HASH_SALT`) where applicable.

Browser-safe build variables:

- `VITE_LEAD_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` / publishable key
- `VITE_COMMERCIAL_API_URL`

## 5. Supabase Auth

Enable email magic-link authentication and configure allowed redirect URLs for:

- `<PUBLIC_APP_URL>/client`
- `<PUBLIC_APP_URL>/admin`
- project-reference query-string variants on the same paths.

Do not make `commercial_admins` infer access from email domain. Bootstrap the first company administrator explicitly by creating/authenticating the user and inserting their profile UUID into `commercial_admins` with `active = true`.

## 6. Stripe test-mode configuration

Use the correct 11-11 Tech Stripe account.

1. Configure test secret key in Supabase.
2. Add webhook endpoint: `<SUPABASE_URL>/functions/v1/stripe-webhook`.
3. Subscribe at minimum to:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Store the endpoint signing secret as `STRIPE_WEBHOOK_SECRET`.
5. Do not create project-specific permanent Stripe Products. Custom projects are represented by project/payment-plan/invoice records; true recurring services use Stripe subscriptions.

## 7. Scheduled installment collection

The finite installment collector is `commercial-billing-run`.

- Invoke it at most once per billing window with `x-billing-secret: BILLING_CRON_SECRET`.
- A charge is attempted only for due finite installments whose payment plan is accepted/active and, where required, has an unrevoked recorded `scheduled_charges` authorization.
- Failed off-session collection marks the installment late, records an audit event and sends a client action-required email where email is configured.
- Do not use this function for recurring subscriptions; Stripe manages those through subscription billing.

Recommended initial scheduler cadence: once daily after midnight in the business billing timezone. Do not enable the scheduler until test-mode due-installment scenarios pass.

## 8. Document storage and PDF rendering

Verify private Storage bucket `client-documents` exists and is not public.

Path invariant:

`{organisation_uuid}/{project_uuid}/{document_uuid}/{version}/{filename}.pdf`

Verify:

- client A cannot fetch client B document;
- issued PDFs receive `sha256` metadata;
- an accepted document cannot have storage path/hash/version changed;
- Agreement Pack contains contract documents only;
- payment success creates invoice/receipt PDF records and stores their rendered PDFs in the same private vault.

## 9. Pre-production certification journeys

### Journey A — new website project / pay in full

Public Start a Project → lead → prospect organisation/project shell → admin formalises project → quotation/SOW/service/payment/privacy documents issued → payment option offered → client magic link → opens every required document → accepts checkboxes → pays Stripe test card → webhook → project active → invoice/receipt PDFs → email → portal paid/outstanding values correct.

### Journey B — 50/50

Offer two installments totaling project value. First Checkout must save the payment method only after explicit scheduled-charge authorization. Simulate second due date and run billing job. Verify second payment settles plan and produces ledger/audit records.

### Journey C — four installments + extra payment

Offer four installments and a configured minimum extra payment. Verify below-minimum extra payment is refused and accepted extra payment cannot exceed the actual outstanding project balance once reconciliation hardening is complete.

### Journey D — recurring service

Offer a true recurring plan, accept recurring authorization, create Stripe subscription in test mode, verify subscription lifecycle webhooks and client portal status.

### Journey E — cross-tenant attack

Create two client users in different organisations. Attempt direct REST/Storage reads of the other tenant's rows/objects. Every request must fail or return no rows.

### Journey F — webhook replay

Replay the same Stripe event. `stripe_events` must prevent duplicate financial effects.

### Journey G — document mutation

Accept a required document then attempt to change its hash/path/version/delete it. Database trigger must reject the mutation.

## 10. Live-mode cutover

Live mode is allowed only after all certification journeys pass.

1. Replace test Stripe secret with correct account live secret.
2. Create live webhook endpoint and set the live signing secret.
3. Re-run one small internal/live payment under an approved 11-11 Tech test engagement.
4. Confirm money, webhook, Supabase ledger, PDF invoice/receipt, email and portal balance.
5. Enable real client invitations.

## 11. Rollback posture

If payment reconciliation is uncertain:

- disable/undeploy checkout or remove the browser `VITE_COMMERCIAL_API_URL`;
- stop the scheduled billing job;
- leave client documents and historical financial/audit records intact;
- never delete accepted agreements to “reset” a test;
- reconcile Stripe and Supabase by immutable references before re-enabling collection.
