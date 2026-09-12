import { createClient } from 'npm:@supabase/supabase-js@2'

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || 'https://kudzimusar.github.io').split(',').map((v) => v.trim()).filter(Boolean)
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
const allowedEventTypes = new Set(['page_view', 'intake_step_viewed', 'lead_email_fallback', 'lead_success', 'lead_submit_attempt', 'lead_submit_failed'])
const allowedCapabilities = new Set(['ui-ux', 'enterprise', 'ai', 'software-data-cloud', 'transformation', 'talent', 'trust'])
const proofByCapability: Record<string, string> = {
  'ui-ux': 'CarUp, HealthTimes, ALT Game Center',
  enterprise: 'Church OS, CarUp, Sessions',
  ai: 'Agentic AI Lab, Morning Pulse, JD2CV',
  'software-data-cloud': 'CarUp, Sessions, DIREKT',
  transformation: 'HealthTimes, Church OS, Morning Pulse',
  talent: 'JD2CV, Paid Refer',
  trust: 'DIREKT, Reverse Verification Tool, CarUp',
}
const maxBodyBytes = 40_000

function isAllowedOrigin(origin: string | null) {
  return !origin || allowedOrigins.includes(origin)
}

function cors(origin: string | null) {
  const allowed = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  }
}

function json(body: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(body), { status, headers: cors(origin) })
}

async function hashIp(ip: string) {
  const salt = Deno.env.get('IP_HASH_SALT')
  if (!salt) throw new Error('IP_HASH_SALT is not configured')
  const bytes = new TextEncoder().encode(`${salt}:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function safeString(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function safeHeader(value: unknown, max = 180) {
  return safeString(value, max).replace(/[\r\n]+/g, ' ')
}

function safeUrl(value: unknown) {
  const raw = safeString(value, 500)
  if (!raw) return ''
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''
  } catch {
    return ''
  }
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

async function readJson(req: Request) {
  const announcedLength = Number(req.headers.get('content-length') || 0)
  if (announcedLength > maxBodyBytes) return { error: 'Payload too large', status: 413, payload: null as any }

  let raw = ''
  try { raw = await req.text() } catch { return { error: 'Unable to read request body', status: 400, payload: null as any } }
  if (new TextEncoder().encode(raw).byteLength > maxBodyBytes) return { error: 'Payload too large', status: 413, payload: null as any }

  try { return { error: '', status: 200, payload: JSON.parse(raw) } }
  catch { return { error: 'Invalid JSON', status: 400, payload: null as any } }
}

async function sendNotification(input: { reference: string; name: string; email: string; organization: string; internalBrief: string }) {
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const notifyTo = Deno.env.get('LEAD_NOTIFY_TO')
  const from = Deno.env.get('LEAD_FROM')
  if (!resendKey || !notifyTo || !from) return { sent: false, error: 'Notification provider is not configured' }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)
  try {
    const emailBody = `${input.reference}\n\n${input.name} <${input.email}>\n${input.organization}\n\n${input.internalBrief}`
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [notifyTo], reply_to: input.email, subject: `${input.reference} — ${safeHeader(input.organization || input.name)}`, text: emailBody }),
      signal: controller.signal,
    })
    return response.ok ? { sent: true, error: '' } : { sent: false, error: `Notification provider returned ${response.status}` }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Notification request failed'
    return { sent: false, error: safeString(message, 300) }
  } finally {
    clearTimeout(timer)
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  if (!isAllowedOrigin(origin)) return json({ error: 'Origin not allowed' }, 403, null)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin)

  const parsed = await readJson(req)
  if (parsed.error) return json({ error: parsed.error }, parsed.status, origin)
  const payload = parsed.payload

  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || 'unknown'
  let ipHash = ''
  try { ipHash = await hashIp(forwarded) } catch { return json({ error: 'Lead service is not fully configured' }, 503, origin) }
  const nowMinusHour = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const attribution = payload?.attribution || {}
  const sessionId = safeString(payload?.sessionId, 100)
  const landingPath = safeString(attribution.landingPath, 300)

  if (payload?.action === 'event') {
    const eventType = safeString(payload?.eventType, 80)
    if (!allowedEventTypes.has(eventType)) return json({ error: 'Unsupported event type' }, 400, origin)

    const { count, error: rateError } = await supabase.from('conversion_events').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', nowMinusHour)
    if (rateError) return json({ error: 'Event service unavailable' }, 503, origin)
    if ((count || 0) >= 120) return json({ ok: true, sampled: false }, 200, origin)

    const rawContext = typeof payload?.context === 'object' && payload.context ? payload.context : {}
    const context = Object.fromEntries(Object.entries(rawContext).slice(0, 20).map(([key, value]) => [safeString(key, 80), safeString(value, 300)]).filter(([key]) => key))
    const { error } = await supabase.from('conversion_events').insert({
      event_type: eventType,
      session_id: sessionId || null,
      source_path: safeString(attribution.path, 300) || null,
      landing_path: landingPath || null,
      capability: safeString(attribution.capability, 80) || null,
      industry: safeString(attribution.industry, 100) || null,
      referrer_host: safeString(attribution.referrerHost, 180) || null,
      utm_source: safeString(attribution.utmSource, 100) || null,
      utm_medium: safeString(attribution.utmMedium, 100) || null,
      utm_campaign: safeString(attribution.utmCampaign, 160) || null,
      context,
      ip_hash: ipHash,
    })
    if (error) return json({ error: 'Event could not be recorded' }, 500, origin)
    return json({ ok: true }, 200, origin)
  }

  if (payload?.action !== 'lead') return json({ error: 'Unsupported action' }, 400, origin)

  const lead = payload?.lead || {}
  if (safeString(lead.company_website, 300)) return json({ ok: true, reference: 'received', leadId: 'filtered' }, 200, origin)

  const requestId = safeString(payload?.requestId, 100)
  if (requestId.length < 12) return json({ error: 'Submission identifier is missing' }, 422, origin)

  const { data: existing, error: existingError } = await supabase.from('leads').select('id, reference, notification_sent').eq('request_id', requestId).maybeSingle()
  if (existingError) return json({ error: 'Lead service unavailable' }, 503, origin)
  if (existing) return json({ ok: true, leadId: existing.id, reference: existing.reference, notification: existing.notification_sent }, 200, origin)

  const name = safeString(lead.name, 160)
  const email = safeString(lead.email, 254).toLowerCase()
  const goals = safeString(lead.goals, 5000)
  const capability = safeString(lead.capability, 80)
  if (!name || !validEmail(email) || goals.length < 20 || lead.consent !== true) return json({ error: 'Please complete the required contact, project and consent fields.' }, 422, origin)
  if (capability && !allowedCapabilities.has(capability)) return json({ error: 'Unknown capability classification' }, 422, origin)

  const website = safeUrl(lead.website)
  if (safeString(lead.website, 500) && !website) return json({ error: 'Existing product / website URL must use http or https.' }, 422, origin)

  const [{ count: ipCount, error: ipRateError }, { count: emailCount, error: emailRateError }] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', nowMinusHour),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('email', email).gte('created_at', nowMinusHour),
  ])
  if (ipRateError || emailRateError) return json({ error: 'Lead service unavailable' }, 503, origin)
  if ((ipCount || 0) >= 8 || (emailCount || 0) >= 3) return json({ error: 'Too many submissions. Please try again later.' }, 429, origin)

  const legalNeeds = Array.isArray(lead.legalNeeds) ? lead.legalNeeds.map((v: unknown) => safeString(v, 80)).filter(Boolean).slice(0, 12) : []
  const engagement = safeString(lead.engagement, 140) || 'Needs discovery'
  const internalBrief = [
    `Problem: ${goals}`,
    `Requested capability: ${capability || 'Needs discovery'}`,
    `Requested service: ${safeString(lead.service, 180) || 'Needs discovery'}`,
    `Likely engagement: ${engagement}`,
    `Industry: ${safeString(lead.industry, 140) || 'Not specified'}`,
    `Budget: ${safeString(lead.budget, 100) || 'Not specified'}`,
    `Urgency: ${safeString(lead.timeline, 100) || 'Not specified'}`,
    `Preferred contact: ${safeString(lead.preferredContact, 100) || 'Not specified'}`,
    `Relevant 11-11 proof: ${proofByCapability[capability] || 'Cross-capability discovery required'}`,
    `Legal / procurement: ${legalNeeds.join(', ') || 'None specified'}`,
  ].join('\n')

  const row = {
    request_id: requestId,
    name,
    email,
    organization: safeString(lead.organization, 200) || null,
    region: safeString(lead.region, 100) || null,
    website: website || null,
    industry: safeString(lead.industry, 140) || null,
    capability: capability || null,
    service: safeString(lead.service, 180) || null,
    outcome: safeString(lead.outcome, 180) || null,
    current_system: safeString(lead.currentSystem, 1000) || null,
    goals,
    budget: safeString(lead.budget, 100) || null,
    timeline: safeString(lead.timeline, 100) || null,
    engagement: engagement || null,
    legal_needs: legalNeeds,
    preferred_contact: safeString(lead.preferredContact, 100) || null,
    referral_source: safeString(lead.referralSource, 180) || null,
    consent: true,
    session_id: sessionId || null,
    source_path: safeString(attribution.path, 300) || null,
    landing_path: landingPath || null,
    referrer_host: safeString(attribution.referrerHost, 180) || null,
    utm_source: safeString(attribution.utmSource, 100) || null,
    utm_medium: safeString(attribution.utmMedium, 100) || null,
    utm_campaign: safeString(attribution.utmCampaign, 160) || null,
    ip_hash: ipHash,
    user_agent: safeString(req.headers.get('user-agent'), 500) || null,
    internal_brief: internalBrief,
  }

  const { data, error } = await supabase.from('leads').insert(row).select('id, reference').single()
  if (error || !data) {
    const { data: raced } = await supabase.from('leads').select('id, reference, notification_sent').eq('request_id', requestId).maybeSingle()
    if (raced) return json({ ok: true, leadId: raced.id, reference: raced.reference, notification: raced.notification_sent }, 200, origin)
    return json({ error: 'Your enquiry could not be stored. Please use the email fallback.' }, 500, origin)
  }

  const notification = await sendNotification({
    reference: data.reference,
    name,
    email,
    organization: safeString(lead.organization, 200),
    internalBrief,
  })
  await supabase.from('leads').update({ notification_sent: notification.sent, notification_error: notification.error || null }).eq('id', data.id)

  await supabase.from('conversion_events').insert({
    event_type: 'lead_submitted',
    session_id: sessionId || null,
    source_path: safeString(attribution.path, 300) || null,
    landing_path: landingPath || null,
    capability: capability || null,
    industry: safeString(lead.industry, 140) || null,
    referrer_host: safeString(attribution.referrerHost, 180) || null,
    utm_source: safeString(attribution.utmSource, 100) || null,
    utm_medium: safeString(attribution.utmMedium, 100) || null,
    utm_campaign: safeString(attribution.utmCampaign, 160) || null,
    context: { reference: data.reference },
    ip_hash: ipHash,
  })

  return json({ ok: true, leadId: data.id, reference: data.reference, notification: notification.sent }, 200, origin)
})
