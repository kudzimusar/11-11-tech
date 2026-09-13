const endpoint = process.env.EXPO_PUBLIC_LEAD_API_URL || ''
const requestTimeoutMs = 12_000

export const leadApiConfigured = endpoint.startsWith('https://')

export async function postLeadEnvelope(envelope: unknown) {
  if (!leadApiConfigured) throw new Error('Lead API is not configured.')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs)
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envelope),
      signal: controller.signal,
    })
    const text = await response.text()
    let data: any = {}
    try { data = text ? JSON.parse(text) : {} } catch { data = {} }
    if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : 'The secure lead service could not accept this request.')
    return data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('The secure lead service took too long to respond. Please retry or use the email fallback.')
    if (error instanceof TypeError) throw new Error('The secure lead service could not be reached. Please retry or use the email fallback.')
    throw error
  } finally {
    clearTimeout(timer)
  }
}
