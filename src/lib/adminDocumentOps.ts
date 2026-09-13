import { getCommercialSession } from './commercial'

const apiUrl = (import.meta.env.VITE_COMMERCIAL_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

async function renderRequest(body: Record<string, unknown>) {
  const session = getCommercialSession()
  if (!session || !apiUrl || !anonKey) throw new Error('Commercial document API is not configured.')
  const response = await fetch(`${apiUrl}/document-render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}`, apikey: anonKey },
    body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => ({})) as { error?: string; documentId?: string; path?: string; sha256?: string }
  if (!response.ok) throw new Error(payload.error || 'Document generation failed.')
  return payload
}

export function issueCommercialDocument(documentId: string) {
  return renderRequest({ documentId })
}

export function createAgreementPack(projectId: string) {
  return renderRequest({ mode: 'pack', projectId })
}
