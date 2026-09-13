import { postLeadEnvelope } from './leadApi'

export async function submitProjectBrief(brief: Record<string, unknown>, requestId: string) {
  const data = await postLeadEnvelope({ action: 'lead', requestId, lead: brief, sessionId: 'native-app' })
  if (!data?.ok || !data?.reference) throw new Error('Invalid confirmation.')
  return data as { ok: true; leadId: string; reference: string; notification?: boolean }
}
