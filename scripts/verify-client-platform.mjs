import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const exists = (file) => fs.existsSync(path.join(root, file))
const fail = (message) => { console.error(`FAIL: ${message}`); process.exitCode = 1 }
const pass = (message) => console.log(`PASS: ${message}`)
const requireFile = (file) => exists(file) ? pass(file) : fail(`missing ${file}`)
const requireText = (file, needles) => {
  const source = read(file)
  for (const needle of needles) source.includes(needle) ? pass(`${file}: ${needle}`) : fail(`${file} missing invariant: ${needle}`)
}
const requirePattern = (file, pattern, label) => {
  pattern.test(read(file)) ? pass(`${file}: ${label}`) : fail(`${file} missing invariant: ${label}`)
}

const requiredFiles = [
  'docs/commercial-platform/00_MASTER_PLAN_AND_OPERATIONS.md',
  'docs/commercial-platform/01_DEPLOYMENT_AND_ACTIVATION_RUNBOOK.md',
  'docs/commercial-platform/02_ADMIN_AND_CLIENT_MANUAL.md',
  'src/pages/ClientPortal.tsx',
  'src/pages/AdminPortal.tsx',
  'src/components/AdminProjectConsole.tsx',
  'src/pages/PayInvoice.tsx',
  'supabase/functions/stripe-checkout/index.ts',
  'supabase/functions/stripe-webhook/index.ts',
  'supabase/functions/commercial-admin/index.ts',
  'supabase/functions/document-render/index.ts',
  'supabase/functions/commercial-billing-run/index.ts',
  'supabase/functions/commercial-document-link/index.ts',
  'supabase/migrations/20260913150000_commercial_client_platform.sql',
  'supabase/migrations/20260913151000_commercial_write_boundaries.sql',
  'supabase/migrations/20260913153000_payment_authorizations.sql',
  'supabase/migrations/20260913154000_commercial_reconciliation_and_provisioning.sql',
  'supabase/migrations/20260913155000_commercial_payment_closure.sql',
  'mobile/app/client.tsx',
  'mobile/app/pay.tsx',
  'mobile/src/lib/commercialClient.ts',
]
requiredFiles.forEach(requireFile)

requireText('docs/commercial-platform/00_MASTER_PLAN_AND_OPERATIONS.md', [
  'No orphan payment', 'Agreement before first payment', 'Historical terms are immutable',
  'Explicit auto-charge consent', 'Client isolation', 'Document vault is private',
])
requireText('supabase/migrations/20260913150000_commercial_client_platform.sql', [
  'create table if not exists public.organizations', 'create table if not exists public.projects',
  'create table if not exists public.project_documents', 'create table if not exists public.payment_plans',
  'create table if not exists public.invoices', 'create table if not exists public.payments',
  "values ('client-documents', 'client-documents', false)", 'enable row level security',
])
requireText('supabase/migrations/20260913151000_commercial_write_boundaries.sql', [
  'accept_project_document', 'select_payment_plan', 'project_agreement_ready',
  'revoke insert on public.agreement_acceptances from authenticated',
])
requireText('supabase/migrations/20260913153000_payment_authorizations.sql', [
  'payment_authorizations', 'authorize_payment_plan', 'scheduled_charges', 'recurring_subscription',
])
requireText('supabase/migrations/20260913154000_commercial_reconciliation_and_provisioning.sql', [
  'stripe_events', 'provision_lead_commercial_shell', 'trg_provision_lead_commercial_shell', 'content_snapshot',
])
requireText('supabase/migrations/20260913155000_commercial_payment_closure.sql', [
  'stripe_payment_method_id', 'payment_method_saved_at', 'pg_advisory_xact_lock',
  "account_email || '|' || org_key", 'reused_organisation',
])

requireText('src/pages/ClientPortal.tsx', [
  'Agreement & pay', 'authorizePaymentPlan', 'Continue to secure payment', 'Open document',
  'requires_autopay_authorization', 'Required documents', 'requestedInvoiceId',
  'invoiceId: exactInvoice.id', 'Confirm the invoice you are paying.',
])
requireText('src/pages/AdminPortal.tsx', ['Commercial command centre', 'AdminProjectConsole', 'New client project'])
requireText('src/components/AdminProjectConsole.tsx', [
  'Publish payment option', 'Generate Agreement Pack PDF', 'Record payment', 'firstPercent', 'minimumExtra',
])
requireText('supabase/functions/stripe-checkout/index.ts', [
  'agreementComplete', 'payment_authorizations', 'invoice_creation[enabled]', 'setup_future_usage',
  'project_id: project.id', 'body.set(`metadata[${key}]`', "['open','partially_paid'].includes(data.status)",
  'planOutstandingMinor', 'requestedExtra > payableOutstanding',
])
requireText('supabase/functions/stripe-webhook/index.ts', [
  'verifySignature', 'stripe_events', 'duplicate:true', 'renderFinancialDocument', "type:'receipt'", "type:'invoice'",
  'bindAuthorizedPaymentMethod', 'stripe_payment_method_id', 'invoice_settings[default_payment_method]',
])
requireText('supabase/functions/commercial-admin/index.ts', [
  'record-manual-payment', 'projectOutstanding', 'amount>payable', 'renderManualReceipt', 'receiptRendered',
  'orgKey(item.trading_name||item.legal_name',
])
requireText('supabase/functions/document-render/index.ts', [
  'client-documents', 'sha256', 'Agreement Pack', 'DOCUMENT_RENDER_SECRET', 'packTypes',
])
requireText('supabase/functions/commercial-document-link/index.ts', [
  "createSignedUrl(document.storage_path,300)", 'organization_members', 'Document not available',
])
requireText('supabase/functions/commercial-billing-run/index.ts', [
  'BILLING_CRON_SECRET', 'payment_authorizations', "off_session:'true'", "status:'late'",
  'stripe_payment_method_id', 'no_authorized_payment_method',
])
const billing = read('supabase/functions/commercial-billing-run/index.ts')
billing.includes('payment_methods?customer=') ? fail('scheduled billing must never select an arbitrary attached card') : pass('scheduled billing uses only the authorised stored PaymentMethod')

requireText('mobile/src/lib/commercialClient.ts', [
  'expo-secure-store', 'EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_COMMERCIAL_API_URL',
  'claim_commercial_invites', 'accept_project_document', 'authorize_payment_plan',
  "commercialFunction<{ url: string; expiresIn: number }>('commercial-document-link'", "clientSurface: 'native'",
])
requireText('mobile/app/client.tsx', [
  'requestedInvoiceId', 'OPEN SECURE PDF', 'Scheduled charge consent.',
  'Continue to secure Stripe payment', 'SAME COMMERCIAL RECORD', 'amountMinor:extraMinor',
])
requirePattern('mobile/app/client.tsx', /invoiceId\s*:\s*exactInvoice\.id/, 'exact invoice is bound to Stripe checkout independent of source formatting')
requireText('mobile/app/pay.tsx', ['PAY AN INVOICE OR PROJECT BALANCE.', 'CONTINUE SECURELY'])
requireText('mobile/app/more.tsx', ['Pay an invoice', 'Client workspace', 'Company admin', 'Desktop-first internal commercial command centre'])
requireText('mobile/package.json', ['"expo": "~57.0.22"', '"expo-secure-store": "~57.0.4"'])
requireText('src/App.tsx', ["path === '/client'", "path === '/admin'", "case '/pay'", 'CommercialUtilityNav'])
requireText('src/pages/PayInvoice.tsx', ['eleveneleven://client?payment=', 'exact invoice'])
requireText('.env.example', ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'DOCUMENT_RENDER_SECRET'])

function sourceFiles(base) {
  const files = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.expo') walk(full)
      else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) files.push(full)
    }
  }
  walk(path.join(root, base))
  return files.map((file) => fs.readFileSync(file, 'utf8')).join('\n')
}
const browserSource = sourceFiles('src')
const nativeSource = sourceFiles('mobile')
for (const forbidden of ['SUPABASE_SERVICE_ROLE_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'RESEND_API_KEY', 'BILLING_CRON_SECRET', 'DOCUMENT_RENDER_SECRET', 'sk_live_', 'sk_test_']) {
  browserSource.includes(forbidden) ? fail(`browser source contains server-only token name/pattern: ${forbidden}`) : pass(`browser excludes ${forbidden}`)
  nativeSource.includes(forbidden) ? fail(`native source contains server-only token name/pattern: ${forbidden}`) : pass(`native excludes ${forbidden}`)
}

if (process.exitCode) process.exit(process.exitCode)
console.log('Commercial client platform + native parity static certification passed.')
