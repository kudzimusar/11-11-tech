import * as Linking from 'expo-linking'
import * as SecureStore from 'expo-secure-store'

export type CommercialSession = { accessToken: string; refreshToken?: string; expiresAt?: number; email?: string }
export type PortalOrganization = { id: string; legal_name: string; trading_name: string | null; status: string }
export type PortalMembership = { organization_id: string; role: string; organizations: PortalOrganization | PortalOrganization[] | null }
export type PortalProject = { id: string; reference: string; organization_id: string; title: string; service_category: string | null; summary: string | null; currency: string; contract_value_minor: number; status: string; proposed_start: string | null; target_completion: string | null }
export type PortalDocument = { id: string; project_id: string; organization_id: string; document_type: string; title: string; reference: string | null; version: number; status: string; required_for_acceptance: boolean; storage_path: string | null; sha256: string | null; issued_at: string | null }
export type PortalAcceptance = { id: string; project_id: string; document_id: string; acknowledgement_key: string; accepted_at: string }
export type PortalPlan = { id: string; project_id: string; organization_id: string; name: string; plan_type: 'full' | 'deposit_balance' | 'installments' | 'recurring'; currency: string; total_minor: number; minimum_extra_payment_minor: number | null; allow_extra_payments: boolean; requires_autopay_authorization: boolean; recurring_interval?: 'week' | 'month' | 'quarter' | 'year' | null; status: string; selected_at: string | null }
export type PortalInstallment = { id: string; payment_plan_id: string; sequence_no: number; amount_minor: number; paid_minor: number; due_at: string | null; status: string }
export type PortalInvoice = { id: string; reference: string; project_id: string; organization_id: string; payment_plan_id: string | null; currency: string; amount_due_minor: number; amount_paid_minor: number; status: string; due_at: string | null; paid_at: string | null }
export type PortalPayment = { id: string; receipt_reference: string | null; project_id: string; organization_id: string; invoice_id: string | null; currency: string; amount_minor: number; status: string; method: string; received_at: string | null; created_at: string }
export type PortalAuthorization = { id: string; payment_plan_id: string; authorization_type: string; accepted_at: string; revoked_at: string | null; stripe_payment_method_id?: string | null }
export type PortalData = { memberships: PortalMembership[]; projects: PortalProject[]; documents: PortalDocument[]; acceptances: PortalAcceptance[]; plans: PortalPlan[]; installments: PortalInstallment[]; invoices: PortalInvoice[]; payments: PortalPayment[]; authorizations: PortalAuthorization[] }

const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
const commercialApiUrl = (process.env.EXPO_PUBLIC_COMMERCIAL_API_URL || '').replace(/\/$/, '')
const sessionKey = '11t.commercial.session.v1'
let memorySession: CommercialSession | null = null
const listeners = new Set<(session: CommercialSession | null) => void>()

export const commercialConfigured = Boolean(supabaseUrl && anonKey)
export const paymentsConfigured = Boolean(commercialApiUrl && anonKey)

async function persistSession(session: CommercialSession | null) {
  memorySession = session
  if (session) await SecureStore.setItemAsync(sessionKey, JSON.stringify(session), { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY })
  else await SecureStore.deleteItemAsync(sessionKey)
  for (const listener of listeners) listener(session)
}

export function subscribeCommercialSession(listener: (session: CommercialSession | null) => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export async function getCommercialSession() {
  if (memorySession) return memorySession
  try {
    const raw = await SecureStore.getItemAsync(sessionKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CommercialSession
    if (!parsed.accessToken) return null
    memorySession = parsed
    return parsed
  } catch { return null }
}

async function refreshCommercialSession(session: CommercialSession) {
  if (!commercialConfigured || !session.refreshToken) return null
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', apikey: anonKey }, body: JSON.stringify({ refresh_token: session.refreshToken }),
  })
  if (!response.ok) { await persistSession(null); return null }
  const payload = await response.json() as { access_token?: string; refresh_token?: string; expires_in?: number; user?: { email?: string } }
  if (!payload.access_token) { await persistSession(null); return null }
  const next: CommercialSession = { accessToken: payload.access_token, refreshToken: payload.refresh_token || session.refreshToken, expiresAt: Math.floor(Date.now()/1000) + Number(payload.expires_in || 3600), email: payload.user?.email || session.email }
  await persistSession(next)
  return next
}

async function activeSession() {
  const session = await getCommercialSession()
  if (!session) return null
  if (session.expiresAt && Date.now()/1000 > session.expiresAt - 60) return refreshCommercialSession(session)
  return session
}

export async function signOutCommercial() { await persistSession(null) }

export async function consumeCommercialAuthUrl(url: string | null | undefined) {
  if (!url || !url.includes('access_token=')) return false
  const fragment = url.includes('#') ? url.split('#').slice(1).join('#') : url.split('?').slice(1).join('?')
  const params = new URLSearchParams(fragment)
  const accessToken = params.get('access_token')
  if (!accessToken) return false
  await persistSession({
    accessToken,
    refreshToken: params.get('refresh_token') || undefined,
    expiresAt: Number(params.get('expires_at') || 0) || undefined,
    email: params.get('email') || undefined,
  })
  return true
}

export async function requestCommercialMagicLink(email: string, redirectTo: string) {
  if (!commercialConfigured) throw new Error('Client login is not configured in this build yet.')
  const response = await fetch(`${supabaseUrl}/auth/v1/otp?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', apikey: anonKey }, body: JSON.stringify({ email: email.trim().toLowerCase(), create_user: true, data: { surface: 'native' } }),
  })
  if (!response.ok) throw new Error('We could not send the secure sign-in link. Check the billing email and try again.')
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const session = await activeSession()
  if (!commercialConfigured || !session) throw new Error('Sign in to access this workspace.')
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: { apikey: anonKey, Authorization: `Bearer ${session.accessToken}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  })
  if (response.status === 401) { await persistSession(null); throw new Error('Your secure session expired. Request a new sign-in link.') }
  if (!response.ok) {
    let message = 'The client workspace could not complete that request.'
    try { const payload = await response.json() as { message?: string; error?: string }; message = payload.message || payload.error || message } catch { /* keep safe message */ }
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

async function table<T>(name: string, select: string, query = ''): Promise<T[]> {
  return apiFetch(`/rest/v1/${name}?select=${encodeURIComponent(select)}${query ? `&${query}` : ''}`) as Promise<T[]>
}
function inFilter(ids: string[]) { return ids.length ? `in.(${ids.join(',')})` : 'in.()' }

export async function claimInvites() { return apiFetch('/rest/v1/rpc/claim_commercial_invites', { method: 'POST', body: '{}' }) as Promise<number> }

export async function loadPortalData(): Promise<PortalData> {
  await claimInvites().catch(() => 0)
  const memberships = await table<PortalMembership>('organization_members', 'organization_id,role,organizations(id,legal_name,trading_name,status)', 'active=eq.true')
  const orgIds = memberships.map((item) => item.organization_id)
  const empty = { memberships, projects: [], documents: [], acceptances: [], plans: [], installments: [], invoices: [], payments: [], authorizations: [] } satisfies PortalData
  if (!orgIds.length) return empty
  const projects = await table<PortalProject>('projects', 'id,reference,organization_id,title,service_category,summary,currency,contract_value_minor,status,proposed_start,target_completion', `organization_id=${inFilter(orgIds)}&order=created_at.desc`)
  const projectIds = projects.map((item) => item.id)
  if (!projectIds.length) return { ...empty, projects }
  const [documents, acceptances, plans, invoices, payments, authorizations] = await Promise.all([
    table<PortalDocument>('project_documents', 'id,project_id,organization_id,document_type,title,reference,version,status,required_for_acceptance,storage_path,sha256,issued_at', `project_id=${inFilter(projectIds)}&status=neq.draft&order=created_at.desc`),
    table<PortalAcceptance>('agreement_acceptances', 'id,project_id,document_id,acknowledgement_key,accepted_at', `project_id=${inFilter(projectIds)}&order=accepted_at.desc`),
    table<PortalPlan>('payment_plans', 'id,project_id,organization_id,name,plan_type,currency,total_minor,minimum_extra_payment_minor,allow_extra_payments,requires_autopay_authorization,recurring_interval,status,selected_at', `project_id=${inFilter(projectIds)}&order=created_at.asc`),
    table<PortalInvoice>('invoices', 'id,reference,project_id,organization_id,payment_plan_id,currency,amount_due_minor,amount_paid_minor,status,due_at,paid_at', `project_id=${inFilter(projectIds)}&order=created_at.desc`),
    table<PortalPayment>('payments', 'id,receipt_reference,project_id,organization_id,invoice_id,currency,amount_minor,status,method,received_at,created_at', `project_id=${inFilter(projectIds)}&order=created_at.desc`),
    table<PortalAuthorization>('payment_authorizations', 'id,payment_plan_id,authorization_type,accepted_at,revoked_at,stripe_payment_method_id', `organization_id=${inFilter(orgIds)}&revoked_at=is.null`),
  ])
  const planIds = plans.map((item) => item.id)
  const installments = planIds.length ? await table<PortalInstallment>('payment_installments', 'id,payment_plan_id,sequence_no,amount_minor,paid_minor,due_at,status', `payment_plan_id=${inFilter(planIds)}&order=sequence_no.asc`) : []
  return { memberships, projects, documents, acceptances, plans, installments, invoices, payments, authorizations }
}

export async function acceptDocument(documentId: string, acknowledgementKey: string) {
  return apiFetch('/rest/v1/rpc/accept_project_document', { method: 'POST', body: JSON.stringify({ target_document: documentId, acknowledgement: acknowledgementKey, client_user_agent: '11-11 Tech native mobile' }) })
}
export async function selectPaymentPlan(planId: string) { return apiFetch('/rest/v1/rpc/select_payment_plan', { method: 'POST', body: JSON.stringify({ target_plan: planId }) }) }
export async function authorizePaymentPlan(planId: string, recurring = false) {
  return apiFetch('/rest/v1/rpc/authorize_payment_plan', { method: 'POST', body: JSON.stringify({ target_plan: planId, authorization_kind: recurring ? 'recurring_subscription' : 'scheduled_charges', client_user_agent: '11-11 Tech native mobile' }) })
}

async function commercialFunction<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const session = await activeSession()
  if (!session || !paymentsConfigured) throw new Error('Secure commercial services are not configured in this build yet.')
  const response = await fetch(`${commercialApiUrl}/${name}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}`, apikey: anonKey }, body: JSON.stringify(body) })
  const payload = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(payload.error || 'Secure commercial request failed.')
  return payload
}

export async function getSecureDocumentLink(documentId: string) {
  return commercialFunction<{ url: string; expiresIn: number }>('commercial-document-link', { documentId })
}

export async function beginStripeCheckout(input: { projectId: string; paymentPlanId?: string; invoiceId?: string; amountMinor?: number }) {
  const payload = await commercialFunction<{ url: string; sessionId: string }>('stripe-checkout', { ...input, clientSurface: 'native' })
  if (!payload.url) throw new Error('Stripe did not return a secure Checkout URL.')
  await Linking.openURL(payload.url)
  return payload
}

export function money(minor: number, currency = 'USD') { return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(minor / 100) }
export function shortDate(value: string | null) { if (!value) return '—'; return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value)) }
export function organizationFromMembership(item: PortalMembership) { return Array.isArray(item.organizations) ? item.organizations[0] ?? null : item.organizations }
