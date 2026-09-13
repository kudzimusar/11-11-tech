import { leadApiConfigured, postLeadEnvelope } from './leadApi'

const sessionId = `native-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
const landingPath = 'native/app'

type NativeEventType = 'page_view' | 'intake_step_viewed' | 'lead_email_fallback' | 'lead_success' | 'lead_submit_attempt' | 'lead_submit_failed'

function attribution(path: string, capability = '', industry = '') {
  return {
    path,
    landingPath,
    referrerHost: '',
    utmSource: 'native-app',
    utmMedium: 'app',
    utmCampaign: '',
    capability,
    industry,
  }
}

export function trackNativeEvent(eventType: NativeEventType, path: string, context: Record<string, string> = {}, capability = '', industry = '') {
  if (!leadApiConfigured) return
  postLeadEnvelope({ action: 'event', eventType, sessionId, attribution: attribution(path, capability, industry), context }).catch(() => undefined)
}

export async function submitProjectBrief(brief: Record<string, unknown>, requestId: string) {
  const capability = typeof brief.capability === 'string' ? brief.capability : ''
  const data = await postLeadEnvelope({
    action: 'lead',
    requestId,
    lead: brief,
    sessionId,
    attribution: attribution('native/start', capability),
  })
  if (!data?.ok || typeof data?.reference !== 'string' || !data.reference) throw new Error('The lead service returned an invalid confirmation.')
  return data as { ok: true; reference: string; notification?: boolean }
}
