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

const endpoint = (import.meta.env.VITE_LEAD_API_URL as string | undefined)?.trim()
export const leadApiConfigured = Boolean(endpoint)

function getSessionId() {
  try {
    const key = '11t_session_id'
    const existing = sessionStorage.getItem(key)
    if (existing) return existing
    const id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
    return id
  } catch {
    return ''
  }
}

function attribution() {
  const params = new URLSearchParams(window.location.search)
  let referrerHost = ''
  try { referrerHost = document.referrer ? new URL(document.referrer).host : '' } catch { referrerHost = '' }
  return {
    path: window.location.pathname,
    referrerHost,
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    capability: params.get('capability') || '',
    industry: params.get('industry') || '',
  }
}

async function post(body: unknown) {
  if (!endpoint) throw new Error('Lead API is not configured.')
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : 'The request could not be submitted.')
  return data
}

export async function submitLead(lead: LeadPayload): Promise<LeadResponse> {
  return post({ action: 'lead', lead, sessionId: getSessionId(), attribution: attribution() }) as Promise<LeadResponse>
}

export function trackEvent(eventType: string, context: Record<string, string> = {}) {
  if (!endpoint || typeof window === 'undefined') return
  const payload = { action: 'event', eventType, sessionId: getSessionId(), attribution: attribution(), context }
  const body = JSON.stringify(payload)
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }))
      return
    }
  } catch { /* fall through */ }
  fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined)
}
