const endpoint = process.env.EXPO_PUBLIC_LEAD_API_URL || ''

export const leadApiConfigured = endpoint.startsWith('https://')

export async function postLeadEnvelope(envelope: unknown) {
  if (!leadApiConfigured) throw new Error('Lead API is not configured.')
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(envelope),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : 'Submission failed.')
  return data
}
