import { createClient } from 'npm:@supabase/supabase-js@2'

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || 'https://kudzimusar.github.io').split(',').map((v) => v.trim()).filter(Boolean)
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })

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

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  if (!isAllowedOrigin(origin)) return json({ error: 'Origin not allowed' }, 403, null)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin)

  const contentLength = Number(req.headers.get('content-length') || 0)
  if (contentLength > 40_000) return json({ error: 'Payload too large' }, 413, origin)

  let payload: any
  try { payload = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400, origin) }

  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || 'unknown'
  let ipHash = ''
  try { ipHash = await hashIp(forwarded) } catch { return json({ error: 'Lead service is not fully configured' }, 503, origin) }
  const nowMinusHour = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const attribution = payload?.attribution || {}
  const sessionId = safeString(payload?.sessionId, 100)

  if (payload?.action === 'event') {
    const eventType = safeString(payload?.eventType, 80)
    if (!eventType) return json({ error: 'Missing event type' }, 400, origin)
    const { count } = await supabase.from('conversion_events').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', nowMinusHour)
    if ((count || 0) >= 120) return json({ ok: true, sampled: false }, 200, origin)
    const context = typeof payload?.context === 'object' && payload.context ? payload.context : {}
    const { error } = await supabase.from('conversion_events').insert({
      event_type: eventType,
      session_id: sessionId || null,
      source_path: safeString(attribution.path, 300) || null,
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

  const name = safeString(lead.name, 160)
  const email = safeString(lead.email, 254).toLowerCase()
  const goals = safeString(lead.goals, 5000)
  if (!name || !validEmail(email) || goals.length < 20 || lead.consent !== true) return json({ error: 'Please complete the required contact, project and consent fields.' }, 422, origin)

  const { count } = await supabase.from('leads').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', nowMinusHour)
  if ((count || 0) >= 6) return json({ error: 'Too many submissions. Please try again later.' }, 429, origin)

  const legalNeeds = Array.isArray(lead.legalNeeds) ? lead.legalNeeds.map((v: unknown) => safeString(v, 80)).filter(Boolean).slice(0, 12) : []
  const capability = safeString(lead.capability, 80)
  const internalBrief = [
    `Problem: ${goals}`,
    `Capability: ${capability || 'Needs discovery'}`,
    `Service: ${safeString(lead.service, 180) || 'Needs discovery'}`,
    `Industry: ${safeString(lead.industry, 140) || 'Not specified'}`,
    `Budget: ${safeString(lead.budget, 100) || 'Not specified'}`,
    `Timeline: ${safeString(lead.timeline, 100) || 'Not specified'}`,
    `Engagement: ${safeString(lead.engagement, 140) || 'Not specified'}`,
    `Legal / procurement: ${legalNeeds.join(', ') || 'None specified'}`,
  ].join('\n')

  const row = {
    name,
    email,
    organization: safeString(lead.organization, 200) || null,
    region: safeString(lead.region, 100) || null,
    website: safeString(lead.website, 500) || null,
    industry: safeString(lead.industry, 140) || null,
    capability: capability || null,
    service: safeString(lead.service, 180) || null,
    outcome: safeString(lead.outcome, 180) || null,
    current_system: safeString(lead.currentSystem, 1000) || null,
    goals,
    budget: safeString(lead.budget, 100) || null,
    timeline: safeString(lead.timeline, 100) || null,
    engagement: safeString(lead.engagement, 140) || null,
    legal_needs: legalNeeds,
    preferred_contact: safeString(lead.preferredContact, 100) || null,
    referral_source: safeString(lead.referralSource, 180) || null,
    consent: true,
    session_id: sessionId || null,
    source_path: safeString(attribution.path, 300) || null,
    referrer_host: safeString(attribution.referrerHost, 180) || null,
    utm_source: safeString(attribution.utmSource, 100) || null,
    utm_medium: safeString(attribution.utmMedium, 100) || null,
    utm_campaign: safeString(attribution.utmCampaign, 160) || null,
    ip_hash: ipHash,
    user_agent: safeString(req.headers.get('user-agent'), 500) || null,
    internal_brief: internalBrief,
  }

  const { data, error } = await supabase.from('leads').insert(row).select('id, reference').single()
  if (error || !data) return json({ error: 'Your enquiry could not be stored. Please use the email fallback.' }, 500, origin)

  let notificationSent = false
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const notifyTo = Deno.env.get('LEAD_NOTIFY_TO')
  const from = Deno.env.get('LEAD_FROM')
  if (resendKey && notifyTo && from) {
    const emailBody = `${data.reference}\n\n${name} <${email}>\n${safeString(lead.organization, 200)}\n\n${internalBrief}`
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [notifyTo], reply_to: email, subject: `${data.reference} — ${safeString(lead.organization, 200) || name}`, text: emailBody }),
    })
    notificationSent = response.ok
    if (notificationSent) await supabase.from('leads').update({ notification_sent: true }).eq('id', data.id)
  }

  await supabase.from('conversion_events').insert({ event_type: 'lead_submitted', session_id: sessionId || null, source_path: safeString(attribution.path, 300) || null, capability: capability || null, industry: safeString(lead.industry, 140) || null, referrer_host: safeString(attribution.referrerHost, 180) || null, utm_source: safeString(attribution.utmSource, 100) || null, utm_medium: safeString(attribution.utmMedium, 100) || null, utm_campaign: safeString(attribution.utmCampaign, 160) || null, context: { reference: data.reference }, ip_hash: ipHash })

  return json({ ok: true, leadId: data.id, reference: data.reference, notification: notificationSent }, 200, origin)
})
