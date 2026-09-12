import fs from 'node:fs'

const read = (path) => fs.readFileSync(path, 'utf8')
const assert = (condition, message) => {
  if (!condition) {
    console.error(`commercial-hardening: ${message}`)
    process.exitCode = 1
  }
}

const leadOps = read('src/lib/leadOps.ts')
const edge = read('supabase/functions/lead-intake/index.ts')
const migration = read('supabase/migrations/20260913023000_lead_operations_hardening.sql')
const shell = read('src/components/SiteShell.tsx')
const policies = read('src/pages/Policies.tsx')
const sourceFiles = fs.readdirSync('src', { recursive: true })
  .filter((entry) => typeof entry === 'string' && /\.(ts|tsx)$/.test(entry))
  .map((entry) => read(`src/${entry}`))
  .join('\n')

assert(leadOps.includes('requestTimeoutMs = 12_000'), 'browser lead requests must have a bounded timeout')
assert(leadOps.includes('getSubmissionId()'), 'browser lead submissions must carry an idempotency identifier')
assert(leadOps.includes("'11t_attribution_v1'"), 'first-touch attribution must survive SPA navigation')
assert(leadOps.includes("landingPath"), 'landing path must be preserved for conversion attribution')
assert(edge.includes("allowedEventTypes"), 'analytics event names must be allow-listed')
assert(edge.includes("request_id: requestId"), 'edge lead writes must persist the idempotency identifier')
assert(edge.includes("eq('request_id', requestId)"), 'edge lead writes must detect duplicate retries')
assert(edge.includes('AbortController()'), 'notification delivery must have a bounded timeout')
assert(edge.includes("IP_HASH_SALT is not configured"), 'IP hashing must fail closed without a configured secret salt')
assert(edge.includes("Origin not allowed"), 'edge function must reject unapproved browser origins')
assert(migration.includes('leads_request_id_uidx'), 'database must enforce unique lead request identifiers')
assert(migration.includes('leads_goals_length_check'), 'database must enforce core lead content bounds')
assert(shell.includes('footer-trust-strip-v23') && shell.includes('footer-cta-v23') && shell.includes('corporate-footer-v23'), 'approved three-part footer composition must remain present')
assert(!shell.match(/TOYOTA|World Vision|BBC|UNHCR|Oxford|Safaricom/i), 'unsupported client logos or names must not be introduced into the footer')
assert(policies.includes('safe email fallback') || policies.includes('email fallback'), 'privacy policy must disclose the lead fallback behavior')
assert(!sourceFiles.includes('SUPABASE_SERVICE_ROLE_KEY'), 'service-role keys must never be referenced by browser source')
assert(!sourceFiles.includes('RESEND_API_KEY'), 'Resend secrets must never be referenced by browser source')

if (!process.exitCode) console.log('commercial-hardening: all invariants passed')
