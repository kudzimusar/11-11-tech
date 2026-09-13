import { postLeadEnvelope } from './leadApi'

const sessionId = `native-${Date.now()}-${Math.random().toString(36).slice(2)}`

export async function submitProjectBrief(brief: Record<string, unknown>, requestId: string) {
  const capability = typeof brief.capability === 'string' ? brief.capability : ''
  const data = await postLeadEnvelope({
    action: 'lead',
    requestId,
    lead: brief,
    sessionId,
    attribution: {
      path: 'native/start',
      landingPath: 'native/app',
      referrerHost: '',
      utmSource: 'native-app',
      utmMedium: 'app',
      utmCampaign: '',
      capability,
      industry: '',
    },
  })
  if (!data?.ok || typeof data?.leadId !== 'string' || typeof data?.reference !== 'string') throw new Error('The lead service returned an invalid confirmation.')
  return data as { ok: true; leadId: string; reference: string; notification?: boolean }
}
