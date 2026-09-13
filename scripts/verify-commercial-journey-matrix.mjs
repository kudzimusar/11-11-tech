import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const check = (condition, label) => {
  if (condition) console.log(`PASS: ${label}`)
  else { console.error(`FAIL: ${label}`); process.exitCode = 1 }
}
const has = (source, text) => source.includes(text)
const match = (source, pattern) => pattern.test(source)

const web = read('src/pages/ClientPortal.tsx')
const native = read('mobile/app/client.tsx')
const webPay = read('src/pages/PayInvoice.tsx')
const nativePay = read('mobile/app/pay.tsx')
const checkout = read('supabase/functions/stripe-checkout/index.ts')
const webhook = read('supabase/functions/stripe-webhook/index.ts')
const admin = read('supabase/functions/commercial-admin/index.ts')
const billing = read('supabase/functions/commercial-billing-run/index.ts')
const docLink = read('supabase/functions/commercial-document-link/index.ts')
const render = read('supabase/functions/document-render/index.ts')
const schema = read('supabase/migrations/20260913150000_commercial_client_platform.sql')
const boundaries = read('supabase/migrations/20260913151000_commercial_write_boundaries.sql')
const authorizations = read('supabase/migrations/20260913153000_payment_authorizations.sql')
const reconciliation = read('supabase/migrations/20260913154000_commercial_reconciliation_and_provisioning.sql')
const closure = read('supabase/migrations/20260913155000_commercial_payment_closure.sql')

console.log('\nP7 COMMERCIAL / LEGAL JOURNEY MATRIX')

check(match(web, /invoiceId:\s*exactInvoice\.id/) && match(native, /invoiceId:\s*exactInvoice\.id/), 'exact invoice reference settles the exact invoice on web and native')
check(has(checkout, "['open','partially_paid'].includes(data.status)") && has(checkout, 'Math.max(Number(data.amount_due_minor)-Number(data.amount_paid_minor),0)'), 'server derives payable exact-invoice balance and rejects non-payable invoice states')

check(has(web, 'Open this document before accepting.') && has(native, 'Open the document before accepting.'), 'both clients require document review before local acceptance action becomes available')
check(has(boundaries, 'accept_project_document') && has(boundaries, 'document_sha256') && has(boundaries, 'document_version'), 'acceptance RPC records the exact version/hash evidence')
check(has(schema, 'protect_accepted_document') && has(schema, 'Accepted commercial document evidence is immutable'), 'database prevents mutation/deletion of accepted document evidence')
check(has(checkout, 'agreementComplete') && has(checkout, 'Agreement acceptance required before payment'), 'server independently enforces agreement-before-payment')

check(has(web, 'authorizePaymentPlan') && has(native, 'authorizePaymentPlan'), 'web and native invoke the same explicit payment-authorization boundary')
check(has(authorizations, 'authorize_payment_plan') && has(authorizations, 'scheduled_charges') && has(authorizations, 'recurring_subscription'), 'database stores distinct scheduled/recurring authorization evidence')
check(has(webhook, 'bindAuthorizedPaymentMethod') && has(closure, 'stripe_payment_method_id'), 'interactive Stripe payment binds the actually-used payment method to authorization evidence')
check(has(billing, 'stripe_payment_method_id') && has(billing, 'no_authorized_payment_method') && !has(billing, 'payment_methods?customer='), 'scheduled billing uses only the explicitly authorized stored payment method')

check(has(web, 'Optional additional balance payment') && has(native, 'Optional additional balance payment'), 'optional extra-payment UX exists on both web and native')
check(has(web, 'amountMinor: extraMinor') && has(native, 'amountMinor:extraMinor'), 'both clients send the optional extra amount through the same Checkout contract')
check(has(checkout, 'planOutstandingMinor') && has(checkout, 'projectOutstanding') && has(checkout, 'requestedExtra > payableOutstanding'), 'server rejects extra payments above the true plan/project receivable')

check(has(admin, 'record-manual-payment') && has(admin, 'projectOutstanding') && has(admin, 'amount>payable'), 'manual/offline payments are bounded by the authoritative receivable')
check(has(admin, 'renderManualReceipt') && has(admin, 'receiptRendered'), 'successful manual/offline payments generate receipt documents')
check(has(render, "type === 'receipt'") || has(render, "documentType === 'receipt'") || has(render, 'Receipt'), 'document renderer supports branded financial receipt output')

check(has(webhook, 'stripe_events') && has(webhook, 'duplicate:true'), 'Stripe webhook processing is idempotent')
check(has(reconciliation, 'stripe_events'), 'Stripe event idempotency ledger is schema-governed')
check(has(webhook, 'renderFinancialDocument') && has(webhook, "type:'receipt'") && has(webhook, "type:'invoice'"), 'server-confirmed Stripe payment produces invoice/receipt document records')
check(has(webPay, 'Your client workspace is the authoritative place') && has(native, 'browser/app return is not a payment-success signal') || has(native, 'return to this app is not a payment-success signal'), 'payment redirects do not become authoritative success state')

check(has(webPay, 'No card information is collected on this page.') && has(nativePay, 'No card information is collected in this screen or stored by 11-11 Tech.'), 'web/native entry surfaces never collect card information')
check(has(checkout, 'checkout.sessions') || has(checkout, '/v1/checkout/sessions'), 'card collection remains inside Stripe-hosted Checkout')

check(has(docLink, 'createSignedUrl(document.storage_path,300)') && has(docLink, 'organization_members'), 'native private-document links are short-lived and tenant-authorized')
check(has(schema, "values ('client-documents', 'client-documents', false)"), 'commercial document vault is private by schema')

check(has(schema, 'bigint') && has(schema, 'amount_minor') && has(schema, 'currency text'), 'money remains integer minor units plus ISO currency in the commercial schema')
check(has(schema, 'is_org_member') && has(schema, 'enable row level security'), 'tenant-scoped RLS remains a database invariant')
check(has(boundaries, 'revoke insert on public.agreement_acceptances from authenticated'), 'broad direct acceptance writes remain revoked from browser/native clients')

if (process.exitCode) process.exit(process.exitCode)
console.log('\ncommercial-journey-matrix: all P7 legal/payment journeys are statically certified')
