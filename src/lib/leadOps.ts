export type LeadPayload = {
  name: string
  email: string
  organization?: string
  region?: string
  website?: string
  industry?: string
  capability?: string
  service?: string
  outcome?: string
  currentSystem?: string
  goals: string
  budget?: string
  timeline?: string
  engagement?: string
  legalNeeds: string[]
  consent: boolean
  preferredContact?: string
  referralSource?: string
  company_website?: string
}

type LeadResponse = { ok: true; leadId: string; reference: string; notification?: boolean }
type Attribution = {
  path: string
  landingPath: string
  referrerHost: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  capability: string
  industry: string
}

const rawEndpoint = (import.meta.env.VITE_LEAD_API_URL as string | undefined)?.trim() ?? ''
const requestTimeoutMs = 12_000

function normalizeEndpoint(value: string) {
  if (!value) return ''
  try {
    const url = new URL(value)
    const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) return ''
    return url.toString()
  } catch {
    return ''
  }
}

const endpoint = normalizeEndpoint(rawEndpoint)
export const leadApiConfigured = Boolean(endpoint)

function randomId() {
  try { return crypto.randomUUID() }
  catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}` }
}

function storageGet(key: string) {
  try { return sessionStorage.getItem(key) ?? '' } catch { return '' }
}

function storageSet(key: string, value: string) {
  try { sessionStorage.setItem(key, value) } catch { /* storage can be unavailable */ }
}

function storageRemove(key: string) {
  try { sessionStorage.removeItem(key) } catch { /* storage can be unavailable */ }
}

function getSessionId() {
  const key = '11t_session_id'
  const existing = storageGet(key)
  if (existing) return existing
  const id = randomId()
  storageSet(key, id)
  return id
}

function getSubmissionId() {
  const key = '11t_lead_submission_id'
  const existing = storageGet(key)
  if (existing) return existing
  const id = randomId()
  storageSet(key, id)
  return id
}

function clearSubmissionId() {
  storageRemove('11t_lead_submission_id')
}

function currentReferrerHost() {
  try { return document.referrer ? new URL(document.referrer).host : '' } catch { return '' }
}

function attribution(): Attribution {
  const params = new URLSearchParams(window.location.search)
  const key = '11t_attribution_v1'
  let persisted: Partial<Attribution> = {}
  try { persisted = JSON.parse(storageGet(key) || '{}') as Partial<Attribution> } catch { persisted = {} }

  const next: Attribution = {
    path: window.location.pathname,
    landingPath: persisted.landingPath || window.location.pathname,
    referrerHost: persisted.referrerHost ?? currentReferrerHost(),
    utmSource: persisted.utmSource || params.get('utm_source') || '',
    utmMedium: persisted.utmMedium || params.get('utm_medium') || '',
    utmCampaign: persisted.utmCampaign || params.get('utm_campaign') || '',
    capability: params.get('capability') || '',
    industry: params.get('industry') || '',
  }

  storageSet(key, JSON.stringify({
    landingPath: next.landingPath,
    referrerHost: next.referrerHost,
    utmSource: next.utmSource,
    utmMedium: next.utmMedium,
    utmCampaign: next.utmCampaign,
  }))
  return next
}

async function post(body: unknown) {
  if (!endpoint) throw new Error('Lead API is not configured.')
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), requestTimeoutMs)
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const text = await response.text()
    let data: any = {}
    try { data = text ? JSON.parse(text) : {} } catch { data = {} }
    if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : 'The request could not be submitted.')
    return data
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new Error('The secure lead service took too long to respond. Please retry or use the email fallback.')
    if (error instanceof TypeError) throw new Error('The secure lead service could not be reached. Please retry or use the email fallback.')
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

export async function submitLead(lead: LeadPayload): Promise<LeadResponse> {
  const requestId = getSubmissionId()
  const data = await post({ action: 'lead', requestId, lead, sessionId: getSessionId(), attribution: attribution() })
  if (data?.ok !== true || typeof data?.leadId !== 'string' || !data.leadId || typeof data?.reference !== 'string' || !data.reference) {
    throw new Error('The lead service returned an invalid confirmation. Please retry or use the email fallback.')
  }
  clearSubmissionId()
  return data as LeadResponse
}

export function trackEvent(eventType: string, context: Record<string, string> = {}) {
  if (!endpoint || typeof window === 'undefined') return
  const payload = { action: 'event', eventType, sessionId: getSessionId(), attribution: attribution(), context }
  const body = JSON.stringify(payload)
  try {
    if (navigator.sendBeacon) {
      const accepted = navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }))
      if (accepted) return
    }
  } catch { /* fall through */ }
  fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined)
}
