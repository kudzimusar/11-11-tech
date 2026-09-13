import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const exists = (relative) => fs.existsSync(path.join(root, relative))
const assert = (condition, message) => { if (!condition) { console.error(`cross-surface-parity: ${message}`); process.exitCode = 1 } }
const matches = (source, pattern) => pattern.test(source)

const requiredShared = ['portfolio.ts','projects.ts','projectTaxonomy.ts','media.ts','method.ts','trust.ts','policies.ts','company.ts','commercialDisplay.ts','intake.ts']
for (const file of requiredShared) assert(exists(`shared/${file}`), `shared/${file} must exist as canonical framework-neutral product truth`)

const portfolio = read('shared/portfolio.ts')
const projects = read('shared/projects.ts')
const media = read('shared/media.ts')
const method = read('shared/method.ts')
const trust = read('shared/trust.ts')
const policies = read('shared/policies.ts')
const sharedIndex = read('shared/index.ts')
const webPortfolio = read('src/data/portfolio.ts')
const webProjects = read('src/data/projects.ts')
const webTaxonomy = read('src/data/projectTaxonomy.ts')
const webMedia = read('src/lib/media.ts')
const nativeCapabilities = read('mobile/src/data/capabilities.ts')
const nativeProjects = read('mobile/src/data/projects.ts')
const themeProvider = read('mobile/src/theme/ThemeProvider.tsx')
const themeTokens = read('mobile/src/theme/tokens.ts')
const more = read('mobile/app/more.tsx')
const client = read('mobile/app/client.tsx')
const pay = read('mobile/app/pay.tsx')
const commercial = read('mobile/src/lib/commercialClient.ts')
const webClient = read('src/pages/ClientPortal.tsx')
const checkout = read('supabase/functions/stripe-checkout/index.ts')
const webhook = read('supabase/functions/stripe-webhook/index.ts')

assert(matches(portfolio, /export const capabilities/) && matches(portfolio, /services:\s*\[/) && matches(portfolio, /startingAt:/) && matches(portfolio, /typicalRange:/), 'canonical portfolio must own capabilities, services and pricing depth')
assert(matches(portfolio, /export const pricingBands/) && matches(portfolio, /export const industries/) && matches(portfolio, /export const businessOutcomes/), 'pricing, industries and business outcomes must remain canonical')
assert(matches(projects, /export const projects/) && matches(projects, /status:/), 'canonical projects must retain maturity/truth labels')
assert(matches(media, /capabilityMedia/) && matches(media, /industryMedia/) && matches(media, /heroStill/), 'shared media registry must own hero, capability and industry mappings')
assert(matches(method, /Discover/) && matches(method, /Improve/) && matches(method, /clientSuccessJourney/), 'shared method must cover the full delivery lifecycle and client success journey')
assert(matches(trust, /publicTrustStandards/) && matches(trust, /trustOnRequest/) && matches(trust, /trustProjectSpecific/), 'shared Trust model must preserve the three legal/assurance layers')
assert(matches(policies, /Privacy/) && matches(policies, /Responsible AI/) && matches(policies, /Accessibility/) && matches(policies, /Security/), 'shared public policies must cover privacy, AI, accessibility and security')
assert(!sharedIndex.includes("export * from './method'"), 'shared barrel must not reintroduce the duplicate deliveryLifecycle export')

for (const [relative, source, target] of [
  ['src/data/portfolio.ts', webPortfolio, '../../shared/portfolio'],
  ['src/data/projects.ts', webProjects, '../../shared/projects'],
  ['src/data/projectTaxonomy.ts', webTaxonomy, '../../shared/projectTaxonomy'],
  ['src/lib/media.ts', webMedia, '../../shared/media'],
]) assert(source.includes(target), `${relative} must be an adapter to shared truth rather than a product-content fork`)
assert(nativeCapabilities.includes('../../../shared/portfolio'), 'native capabilities must consume shared portfolio truth')
assert(nativeProjects.includes('../../../shared/projects'), 'native projects must consume shared project truth')

const publicRoutes = ['pricing','method','trust','policies','about','lab','solutions','industries']
for (const route of publicRoutes) {
  const relative = `mobile/app/${route}.tsx`
  assert(exists(relative), `${relative} must exist as a first-class native route`)
  const source = read(relative)
  assert(source.includes('../../shared/') || route === 'solutions', `${relative} must consume canonical shared product content`)
}
assert(more.includes('Client workspace') && more.includes('Pay an invoice'), 'native utility navigation must expose both commercial entry points')
assert(more.includes('About 11-11 Tech') && more.includes('Trust Center') && more.includes('Policies'), 'About, Trust and Policies must be first-class native destinations')

assert(themeProvider.includes("type ThemePreference = 'system' | ThemeName") && themeProvider.includes('SecureStore') && themeProvider.includes("'11t.appearance.preference.v1'"), 'appearance must support persisted System/Light/Dark preference')
for (const token of ['background','surface','elevated','text','muted','rule','accent','input','navigation','sheet','success','warning','danger','overlay']) assert(themeTokens.includes(`${token}:`), `semantic theme token ${token} must exist`)
assert(more.includes("'system','light','dark'"), 'native preferences UI must expose System, Light and Dark')

assert(matches(client, /invoiceId:\s*exactInvoice\.id/), 'native exact-invoice checkout must pass the exact invoice ID')
assert(matches(webClient, /invoiceId:\s*(exactInvoice|requestedInvoice)\.id/), 'web exact-invoice checkout must pass an exact invoice ID')
assert(client.includes('Scheduled charge consent.') && client.includes('OPEN SECURE PDF'), 'native legal/payment flow must require explicit authorization and secure document review')
assert(commercial.includes('accept_project_document') && commercial.includes('authorize_payment_plan') && commercial.includes("clientSurface: 'native'"), 'native commercial actions must use the shared server authority boundary')
assert(checkout.includes('agreementComplete') && checkout.includes('planOutstandingMinor') && checkout.includes('requestedExtra > payableOutstanding'), 'Stripe checkout must enforce agreement readiness, server-derived outstanding balance and overpayment rejection')
assert(webhook.includes('stripe_events'), 'Stripe reconciliation must remain idempotent and webhook-authoritative')
assert(pay.includes('No card information'), 'native billing entry must preserve the Stripe-hosted card-data boundary')

const platformDataFiles = ['src/data/portfolio.ts','src/data/projects.ts','src/data/projectTaxonomy.ts','mobile/src/data/capabilities.ts','mobile/src/data/projects.ts']
for (const relative of platformDataFiles) {
  const source = read(relative)
  assert(!/export const capabilities\s*[:=]/.test(source) || relative.startsWith('shared/'), `${relative} must not define an independent capability catalogue`)
  assert(!/export const projectTaxonomy\s*[:=]/.test(source) || relative.startsWith('shared/'), `${relative} must not define an independent project taxonomy`)
}

const appLayout = read('mobile/app/_layout.tsx')
for (const route of publicRoutes) assert(appLayout.includes(`name="${route}"`), `root native navigation must register ${route}`)
assert(appLayout.includes('ThemeProvider'), 'root native navigation must be theme-governed')

if (!process.exitCode) console.log('cross-surface-parity: P1–P10 product, theme, public-route and commercial invariants passed')
