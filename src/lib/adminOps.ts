import { getCommercialSession } from './commercial'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const commercialApiUrl = (import.meta.env.VITE_COMMERCIAL_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

async function adminFetch(path: string, init: RequestInit = {}) {
  const session = getCommercialSession()
  if (!session || !supabaseUrl || !anonKey) throw new Error('Company admin authentication is required.')
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { message?: string; error?: string }
    throw new Error(payload.message || payload.error || 'Unable to load company commercial data.')
  }
  return response.status === 204 ? null : response.json()
}

async function table<T>(name: string, select: string, query = ''): Promise<T[]> {
  return adminFetch(`/rest/v1/${name}?select=${encodeURIComponent(select)}${query ? `&${query}` : ''}`) as Promise<T[]>
}

export type AdminLead = { id: string; reference: string; created_at: string; status: string; name: string; email: string; organization: string | null; capability: string | null; service: string | null; budget: string | null; timeline: string | null }
export type AdminOrganization = { id: string; legal_name: string; trading_name: string | null; billing_email: string | null; country: string | null; status: string; created_at: string }
export type AdminProject = { id: string; reference: string; organization_id: string; title: string; service_category: string | null; currency: string; contract_value_minor: number; status: string; created_at: string }
export type AdminInvoice = { id: string; reference: string; project_id: string; organization_id: string; currency: string; amount_due_minor: number; amount_paid_minor: number; status: string; due_at: string | null; created_at: string }
export type AdminPayment = { id: string; receipt_reference: string | null; project_id: string; organization_id: string; currency: string; amount_minor: number; status: string; method: string; received_at: string | null; created_at: string }
export type AdminDocument = { id: string; project_id: string; organization_id: string; document_type: string; title: string; reference: string | null; version: number; status: string; required_for_acceptance: boolean; issued_at: string | null; created_at: string }

export type AdminData = {
  leads: AdminLead[]
  organizations: AdminOrganization[]
  projects: AdminProject[]
  invoices: AdminInvoice[]
  payments: AdminPayment[]
  documents: AdminDocument[]
}

export async function isCompanyAdmin(): Promise<boolean> {
  return adminFetch('/rest/v1/rpc/is_commercial_admin', { method: 'POST', body: '{}' }) as Promise<boolean>
}

export async function loadAdminData(): Promise<AdminData> {
  if (!(await isCompanyAdmin())) throw new Error('This account is not authorised for the 11-11 Tech company workspace.')
  const [leads, organizations, projects, invoices, payments, documents] = await Promise.all([
    table<AdminLead>('leads', 'id,reference,created_at,status,name,email,organization,capability,service,budget,timeline', 'order=created_at.desc&limit=100'),
    table<AdminOrganization>('organizations', 'id,legal_name,trading_name,billing_email,country,status,created_at', 'order=created_at.desc&limit=100'),
    table<AdminProject>('projects', 'id,reference,organization_id,title,service_category,currency,contract_value_minor,status,created_at', 'order=created_at.desc&limit=100'),
    table<AdminInvoice>('invoices', 'id,reference,project_id,organization_id,currency,amount_due_minor,amount_paid_minor,status,due_at,created_at', 'order=created_at.desc&limit=100'),
    table<AdminPayment>('payments', 'id,receipt_reference,project_id,organization_id,currency,amount_minor,status,method,received_at,created_at', 'order=created_at.desc&limit=100'),
    table<AdminDocument>('project_documents', 'id,project_id,organization_id,document_type,title,reference,version,status,required_for_acceptance,issued_at,created_at', 'order=created_at.desc&limit=100'),
  ])
  return { leads, organizations, projects, invoices, payments, documents }
}

export async function callCommercialAdmin(action: string, input: Record<string, unknown> = {}) {
  const session = getCommercialSession()
  if (!session || !commercialApiUrl || !anonKey) throw new Error('Commercial admin API is not configured on this deployment.')
  const response = await fetch(`${commercialApiUrl}/commercial-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}`, apikey: anonKey },
    body: JSON.stringify({ action, ...input }),
  })
  const payload = await response.json().catch(() => ({})) as { error?: string; [key: string]: unknown }
  if (!response.ok) throw new Error(payload.error || 'Admin action failed.')
  return payload
}
