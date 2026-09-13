import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || ''
const publicAppUrl = (Deno.env.get('PUBLIC_APP_URL') || 'https://kudzimusar.github.io/11-11-tech').replace(/\/$/, '')
const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || 'https://kudzimusar.github.io').split(',').map((v) => v.trim()).filter(Boolean)
const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

function cors(origin: string | null) {
  const allowed = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  return { 'Access-Control-Allow-Origin': allowed, 'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin' }
}
function json(body: unknown, status = 200, origin: string | null = null) { return new Response(JSON.stringify(body), { status, headers: cors(origin) }) }
function safeId(value: unknown) { return typeof value === 'string' && /^[0-9a-f-]{36}$/i.test(value) ? value : '' }
function safeMinor(value: unknown) { const n = Number(value); return Number.isSafeInteger(n) && n > 0 ? n : 0 }

async function stripePost(path: string, body: URLSearchParams) {
  if (!stripeKey) throw new Error('Stripe is not configured')
  const response = await fetch(`https://api.stripe.com/v1/${path}`, { method: 'POST', headers: { Authorization: `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload?.error?.message || `Stripe returned ${response.status}`)
  return payload
}

async function getAuthenticatedUser(req: Request) {
  const authorization = req.headers.get('authorization') || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token) return null
  const { data, error } = await supabase.auth.getUser(token)
  return error ? null : data.user
}

async function hasOrgMembership(userId: string, organizationId: string) {
  const { data } = await supabase.from('organization_members').select('id').eq('organization_id', organizationId).eq('profile_id', userId).eq('active', true).maybeSingle()
  return Boolean(data)
}

async function agreementComplete(userId: string, projectId: string) {
  const { data: docs, error: docsError } = await supabase.from('project_documents').select('id').eq('project_id', projectId).eq('status', 'issued').eq('required_for_acceptance', true)
  if (docsError) throw docsError
  if (!docs?.length) return true
  const { data: accepted, error } = await supabase.from('agreement_acceptances').select('document_id').eq('project_id', projectId).eq('profile_id', userId).in('document_id', docs.map((d) => d.id))
  if (error) throw error
  return new Set((accepted || []).map((a) => a.document_id)).size === docs.length
}

async function succeededProjectPayments(projectId: string) {
  const { data, error } = await supabase.from('payments').select('amount_minor').eq('project_id', projectId).eq('status', 'succeeded')
  if (error) throw error
  return (data || []).reduce((sum, item) => sum + Number(item.amount_minor || 0), 0)
}

async function planOutstandingMinor(plan: any) {
  const { data: installments, error: installmentError } = await supabase.from('payment_installments').select('amount_minor,paid_minor,status').eq('payment_plan_id', plan.id)
  if (installmentError) throw installmentError
  if (installments?.length) {
    return installments
      .filter((item) => !['waived','cancelled'].includes(item.status))
      .reduce((sum, item) => sum + Math.max(Number(item.amount_minor) - Number(item.paid_minor), 0), 0)
  }

  const { data: invoices, error: invoiceError } = await supabase.from('invoices').select('amount_paid_minor,status').eq('payment_plan_id', plan.id).not('status', 'in', '("void","uncollectible")')
  if (invoiceError) throw invoiceError
  const invoicedPaid = (invoices || []).reduce((sum, item) => sum + Number(item.amount_paid_minor || 0), 0)
  return Math.max(Number(plan.total_minor) - invoicedPaid, 0)
}

async function getOrCreateStripeCustomer(organization: any) {
  if (organization.stripe_customer_id) return organization.stripe_customer_id as string
  const body = new URLSearchParams()
  if (organization.billing_email) body.set('email', organization.billing_email)
  body.set('name', organization.trading_name || organization.legal_name)
  body.set('metadata[organization_id]', organization.id)
  body.set('metadata[source]', '11-11-tech-commercial-platform')
  const customer = await stripePost('customers', body)
  const { error } = await supabase.from('organizations').update({ stripe_customer_id: customer.id, updated_at: new Date().toISOString() }).eq('id', organization.id).is('stripe_customer_id', null)
  if (error) throw error
  return customer.id as string
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  if (origin && !allowedOrigins.includes(origin)) return json({ error: 'Origin not allowed' }, 403, null)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin)
  if (!stripeKey) return json({ error: '11-11 Tech Stripe account is not configured yet.' }, 503, origin)

  const user = await getAuthenticatedUser(req)
  if (!user) return json({ error: 'Authentication required' }, 401, origin)

  let input: any
  try { input = await req.json() } catch { return json({ error: 'Invalid request body' }, 400, origin) }
  const projectId = safeId(input?.projectId)
  const paymentPlanId = safeId(input?.paymentPlanId)
  const invoiceId = safeId(input?.invoiceId)
  const requestedExtra = safeMinor(input?.amountMinor)
  if (!projectId) return json({ error: 'Project is required' }, 400, origin)

  try {
    const { data: project, error: projectError } = await supabase.from('projects').select('id,reference,title,organization_id,currency,contract_value_minor,status').eq('id', projectId).single()
    if (projectError || !project) return json({ error: 'Project not found' }, 404, origin)
    if (!(await hasOrgMembership(user.id, project.organization_id))) return json({ error: 'Project not available' }, 403, origin)
    if (!(await agreementComplete(user.id, project.id))) return json({ error: 'Complete the required agreement review before payment.' }, 409, origin)

    const { data: organization, error: orgError } = await supabase.from('organizations').select('id,legal_name,trading_name,billing_email,stripe_customer_id').eq('id', project.organization_id).single()
    if (orgError || !organization) throw orgError || new Error('Organisation missing')

    let plan: any = null
    let installment: any = null
    let invoice: any = null
    let amountMinor = 0
    let description = project.title
    let paymentKind = 'project_payment'

    if (invoiceId) {
      const { data, error } = await supabase.from('invoices').select('*').eq('id', invoiceId).eq('project_id', project.id).single()
      if (error || !data) return json({ error: 'Invoice not available' }, 404, origin)
      if (!['open','partially_paid'].includes(data.status)) return json({ error: data.status === 'paid' ? 'This invoice is already paid.' : 'This invoice is not payable.' }, 409, origin)
      invoice = data
      amountMinor = Math.max(Number(data.amount_due_minor) - Number(data.amount_paid_minor), 0)
      description = `${data.reference} · ${project.title}`
      paymentKind = 'invoice'
    } else if (paymentPlanId) {
      const { data, error } = await supabase.from('payment_plans').select('*').eq('id', paymentPlanId).eq('project_id', project.id).single()
      if (error || !data || !['accepted','active'].includes(data.status)) return json({ error: 'Select an approved payment plan before payment.' }, 409, origin)
      plan = data
      const { data: installments, error: installmentError } = await supabase.from('payment_installments').select('*').eq('payment_plan_id', plan.id).not('status','in','("paid","waived","cancelled")').order('sequence_no').limit(1)
      if (installmentError) throw installmentError
      installment = installments?.[0] || null
      amountMinor = installment ? Math.max(Number(installment.amount_minor) - Number(installment.paid_minor), 0) : Number(plan.total_minor)
      description = `${plan.name} · ${project.title}`
      paymentKind = plan.plan_type === 'recurring' ? 'subscription' : installment ? 'installment' : 'project_payment'

      if (plan.requires_autopay_authorization) {
        const authorizationType = plan.plan_type === 'recurring' ? 'recurring_subscription' : 'scheduled_charges'
        const { data: authorization } = await supabase.from('payment_authorizations').select('id').eq('payment_plan_id', plan.id).eq('profile_id', user.id).eq('authorization_type', authorizationType).is('revoked_at', null).maybeSingle()
        if (!authorization) return json({ error: 'Scheduled payment authorization is required.' }, 409, origin)
      }

      if (requestedExtra) {
        if (plan.plan_type === 'recurring') return json({ error: 'Additional project-balance payments do not apply to recurring subscriptions.' }, 409, origin)
        if (!plan.allow_extra_payments) return json({ error: 'Additional balance payments are not enabled for this plan.' }, 409, origin)
        if (plan.minimum_extra_payment_minor && requestedExtra < Number(plan.minimum_extra_payment_minor)) return json({ error: 'The additional payment is below the permitted minimum.' }, 409, origin)
        const planOutstanding = await planOutstandingMinor(plan)
        const paidProject = await succeededProjectPayments(project.id)
        const projectCeiling = Number(project.contract_value_minor) > 0 ? Number(project.contract_value_minor) : Number(plan.total_minor)
        const projectOutstanding = Math.max(projectCeiling - paidProject, 0)
        const payableOutstanding = Math.min(planOutstanding, projectOutstanding)
        if (payableOutstanding <= 0) return json({ error: 'There is no outstanding project balance for an additional payment.' }, 409, origin)
        if (requestedExtra > payableOutstanding) return json({ error: `The requested payment exceeds the outstanding balance of ${payableOutstanding} minor units.` }, 409, origin)
        amountMinor = requestedExtra
        paymentKind = 'extra_payment'
        installment = null
      }
    } else {
      return json({ error: 'An invoice or selected payment plan is required.' }, 400, origin)
    }

    if (amountMinor <= 0) return json({ error: 'There is no payable balance for this selection.' }, 409, origin)
    const stripeCustomerId = await getOrCreateStripeCustomer(organization)
    const body = new URLSearchParams()
    const recurring = plan?.plan_type === 'recurring'
    body.set('mode', recurring ? 'subscription' : 'payment')
    body.set('customer', stripeCustomerId)
    body.set('client_reference_id', project.reference)
    body.set('line_items[0][quantity]', '1')
    body.set('line_items[0][price_data][currency]', String((plan?.currency || invoice?.currency || project.currency || 'USD')).toLowerCase())
    body.set('line_items[0][price_data][unit_amount]', String(amountMinor))
    body.set('line_items[0][price_data][product_data][name]', description.slice(0, 240))
    body.set('line_items[0][price_data][product_data][metadata][project_id]', project.id)
    if (recurring) {
      const interval = plan.recurring_interval === 'quarter' ? 'month' : (plan.recurring_interval || 'month')
      const count = plan.recurring_interval === 'quarter' ? 3 : (plan.recurring_interval_count || 1)
      body.set('line_items[0][price_data][recurring][interval]', interval)
      body.set('line_items[0][price_data][recurring][interval_count]', String(count))
    } else {
      body.set('invoice_creation[enabled]', 'true')
      if (plan?.requires_autopay_authorization) body.set('payment_intent_data[setup_future_usage]', 'off_session')
    }
    const metadata: Record<string,string> = {
      project_id: project.id,
      organization_id: project.organization_id,
      payment_kind: paymentKind,
      profile_id: user.id,
    }
    if (plan?.id) metadata.payment_plan_id = plan.id
    if (installment?.id) metadata.installment_id = installment.id
    if (invoice?.id) metadata.invoice_id = invoice.id
    for (const [key,value] of Object.entries(metadata)) {
      body.set(`metadata[${key}]`, value)
      if (!recurring) body.set(`payment_intent_data[metadata][${key}]`, value)
      else body.set(`subscription_data[metadata][${key}]`, value)
    }
    body.set('success_url', `${publicAppUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`)
    body.set('cancel_url', `${publicAppUrl}/payment/cancelled?project=${encodeURIComponent(project.reference)}`)
    body.set('billing_address_collection', 'auto')

    const checkout = await stripePost('checkout/sessions', body)
    await supabase.from('audit_events').insert({ actor_profile_id: user.id, organization_id: project.organization_id, project_id: project.id, event_type: 'stripe.checkout_created', entity_type: plan ? 'payment_plan' : 'invoice', entity_id: plan?.id || invoice?.id || null, context: { checkout_session_id: checkout.id, amount_minor: amountMinor, payment_kind: paymentKind } })
    return json({ url: checkout.url, sessionId: checkout.id }, 200, origin)
  } catch (error) {
    console.error('stripe-checkout', error)
    return json({ error: error instanceof Error ? error.message.slice(0, 240) : 'Unable to prepare payment' }, 500, origin)
  }
})
