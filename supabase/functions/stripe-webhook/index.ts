import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || ''
const documentRenderSecret = Deno.env.get('DOCUMENT_RENDER_SECRET') || ''
const resendKey = Deno.env.get('RESEND_API_KEY') || ''
const commercialFrom = Deno.env.get('COMMERCIAL_FROM') || Deno.env.get('LEAD_FROM') || ''
const publicAppUrl = (Deno.env.get('PUBLIC_APP_URL') || 'https://kudzimusar.github.io/11-11-tech').replace(/\/$/, '')

function hex(bytes: ArrayBuffer) { return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2,'0')).join('') }
function safeEqual(a: string, b: string) { if (a.length !== b.length) return false; let diff = 0; for (let i=0;i<a.length;i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0 }
async function verifySignature(payload: string, header: string) {
  if (!webhookSecret || !header) return false
  const values = header.split(',').map((part) => part.split('=')); const timestamp = values.find(([key]) => key === 't')?.[1]; const signatures = values.filter(([key]) => key === 'v1').map(([,value]) => value)
  if (!timestamp || !signatures.length || Math.abs(Date.now()/1000 - Number(timestamp)) > 300) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(webhookSecret), { name:'HMAC', hash:'SHA-256' }, false, ['sign'])
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${payload}`)); const expected = hex(signed)
  return signatures.some((signature) => safeEqual(expected, signature))
}
async function sha256(value: string) { return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))) }
function amountText(amountMinor:number,currency:string){return new Intl.NumberFormat('en-US',{style:'currency',currency:String(currency).toUpperCase()}).format(amountMinor/100)}
async function stripeGet(path:string){if(!stripeKey)throw new Error('Stripe is not configured');const response=await fetch(`https://api.stripe.com/v1/${path}`,{headers:{Authorization:`Bearer ${stripeKey}`}});const payload=await response.json();if(!response.ok)throw new Error(payload?.error?.message||`Stripe ${response.status}`);return payload}
async function stripePost(path:string,body:URLSearchParams){if(!stripeKey)return;const response=await fetch(`https://api.stripe.com/v1/${path}`,{method:'POST',headers:{Authorization:`Bearer ${stripeKey}`,'Content-Type':'application/x-www-form-urlencoded'},body});if(!response.ok)console.error('stripe-post',path,response.status,await response.text())}

async function sendPaymentEmail(organizationId: string, projectId: string, amountMinor: number, currency: string, receipt: string | null) {
  if (!resendKey || !commercialFrom) return
  const [{ data: org }, { data: project }] = await Promise.all([
    supabase.from('organizations').select('billing_email,legal_name,trading_name').eq('id',organizationId).maybeSingle(),
    supabase.from('projects').select('reference,title').eq('id',projectId).maybeSingle(),
  ])
  if (!org?.billing_email || !project) return
  const amount = amountText(amountMinor,currency)
  await fetch('https://api.resend.com/emails', { method:'POST', headers:{Authorization:`Bearer ${resendKey}`,'Content-Type':'application/json'}, body:JSON.stringify({ from:commercialFrom, to:[org.billing_email], subject:`Payment received — ${project.title}`, text:`11-11 Tech\n\nPayment received: ${amount}\nProject: ${project.reference} — ${project.title}\n${receipt ? `Receipt: ${receipt}\n` : ''}\nYour invoice, receipt, agreement documents and remaining project balance are available in your secure client workspace:\n${publicAppUrl}/client\n\nThank you,\n11-11 Tech` }) }).catch(() => undefined)
}

async function renderFinancialDocument(input:{projectId:string;organizationId:string;type:'invoice'|'receipt';title:string;reference:string;sections:Array<{heading:string;body:string}>}){
  if(!documentRenderSecret)return
  const {data:latest}=await supabase.from('project_documents').select('version').eq('project_id',input.projectId).eq('document_type',input.type).order('version',{ascending:false}).limit(1).maybeSingle()
  const version=Number(latest?.version||0)+1
  const {data:document,error}=await supabase.from('project_documents').insert({project_id:input.projectId,organization_id:input.organizationId,document_type:input.type,title:input.title,reference:input.reference,version,status:'draft',required_for_acceptance:false,content_snapshot:{sections:input.sections}}).select('id').single()
  if(error||!document){console.error('financial-document-metadata',error);return}
  const response=await fetch(`${supabaseUrl}/functions/v1/document-render`,{method:'POST',headers:{'Content-Type':'application/json','x-document-secret':documentRenderSecret},body:JSON.stringify({documentId:document.id})})
  if(!response.ok)console.error('financial-document-render',input.type,response.status,await response.text())
}

async function completePlanIfSettled(planId: string) {
  const { data: installments } = await supabase.from('payment_installments').select('id,status').eq('payment_plan_id',planId)
  const open=(installments||[]).some((item:any)=>!['paid','waived','cancelled'].includes(item.status))
  await supabase.from('payment_plans').update({ status:open?'active':'completed' }).eq('id',planId)
}

async function bindAuthorizedPaymentMethod(session:any,metadata:any){
  const planId=metadata?.payment_plan_id;const profileId=metadata?.profile_id
  if(!stripeKey||!planId||!profileId||session.mode!=='payment'||!session.payment_intent)return
  try{
    const intentId=typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent.id
    const intent=await stripeGet(`payment_intents/${encodeURIComponent(intentId)}`)
    const paymentMethodId=typeof intent.payment_method==='string'?intent.payment_method:intent.payment_method?.id
    if(!paymentMethodId)return
    const {data:plan}=await supabase.from('payment_plans').select('requires_autopay_authorization,plan_type,organization_id,project_id').eq('id',planId).maybeSingle()
    if(!plan?.requires_autopay_authorization)return
    const authorizationType=plan.plan_type==='recurring'?'recurring_subscription':'scheduled_charges'
    const {data:authorization}=await supabase.from('payment_authorizations').update({stripe_payment_method_id:paymentMethodId,payment_method_saved_at:new Date().toISOString()}).eq('payment_plan_id',planId).eq('profile_id',profileId).eq('authorization_type',authorizationType).is('revoked_at',null).select('id').maybeSingle()
    if(authorization&&session.customer){const customerId=typeof session.customer==='string'?session.customer:session.customer.id;const body=new URLSearchParams();body.set('invoice_settings[default_payment_method]',paymentMethodId);await stripePost(`customers/${encodeURIComponent(customerId)}`,body)}
    if(authorization)await supabase.from('audit_events').insert({actor_profile_id:profileId,organization_id:plan.organization_id,project_id:plan.project_id,event_type:'payment.method_bound_to_authorization',entity_type:'payment_plan',entity_id:planId,context:{authorization_id:authorization.id,stripe_payment_method_id:paymentMethodId}})
  }catch(error){console.error('bind-authorized-payment-method',error)}
}

async function processCheckoutCompleted(session: any, eventId: string) {
  if (session.payment_status !== 'paid' && session.mode !== 'subscription') return
  const metadata = session.metadata || {}; const projectId = metadata.project_id; const organizationId = metadata.organization_id
  if (!projectId || !organizationId) return
  const amount = Number(session.amount_total || 0); const currency = String(session.currency || 'usd').toUpperCase(); let localInvoiceId = metadata.invoice_id || null; let invoiceReference:string|null=null

  if (!localInvoiceId && session.mode === 'payment' && amount > 0) {
    const { data: invoice, error } = await supabase.from('invoices').insert({ project_id:projectId, organization_id:organizationId, payment_plan_id:metadata.payment_plan_id || null, installment_id:metadata.installment_id || null, currency, amount_due_minor:amount, amount_paid_minor:amount, status:'paid', stripe_invoice_id:typeof session.invoice === 'string' ? session.invoice : session.invoice?.id || null, issued_at:new Date().toISOString(), paid_at:new Date().toISOString() }).select('id,reference').single()
    if (error) throw error; localInvoiceId = invoice.id; invoiceReference=invoice.reference
  } else if (localInvoiceId && amount > 0) {
    const { data: invoice } = await supabase.from('invoices').select('reference,amount_due_minor,amount_paid_minor').eq('id',localInvoiceId).single()
    if (invoice) { invoiceReference=invoice.reference; const paid = Math.min(Number(invoice.amount_due_minor), Number(invoice.amount_paid_minor) + amount); await supabase.from('invoices').update({ amount_paid_minor:paid, status: paid >= Number(invoice.amount_due_minor) ? 'paid' : 'partially_paid', paid_at: paid >= Number(invoice.amount_due_minor) ? new Date().toISOString() : null, stripe_invoice_id: typeof session.invoice === 'string' ? session.invoice : session.invoice?.id || null }).eq('id',localInvoiceId) }
  }

  let receiptReference: string | null = null
  if (amount > 0) {
    const { data: payment, error } = await supabase.from('payments').upsert({ project_id:projectId, organization_id:organizationId, invoice_id:localInvoiceId, installment_id:metadata.installment_id || null, currency, amount_minor:amount, status:'succeeded', method:'stripe', stripe_payment_intent_id:typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null, stripe_checkout_session_id:session.id, stripe_event_id:eventId, received_at:new Date().toISOString() }, { onConflict:'stripe_checkout_session_id' }).select('receipt_reference').single()
    if (error) throw error; receiptReference = payment?.receipt_reference || null
  }

  if (metadata.installment_id && amount > 0) {
    const { data: installment } = await supabase.from('payment_installments').select('amount_minor,paid_minor,payment_plan_id').eq('id',metadata.installment_id).single()
    if (installment) { const paid = Math.min(Number(installment.amount_minor), Number(installment.paid_minor) + amount); await supabase.from('payment_installments').update({ paid_minor:paid, status: paid >= Number(installment.amount_minor) ? 'paid' : 'partially_paid' }).eq('id',metadata.installment_id); await completePlanIfSettled(installment.payment_plan_id) }
  } else if (metadata.payment_plan_id && session.mode === 'payment') await supabase.from('payment_plans').update({ status:'completed' }).eq('id',metadata.payment_plan_id).eq('plan_type','full')

  if (session.mode === 'subscription' && session.subscription) {
    const { data: plan } = await supabase.from('payment_plans').select('currency,total_minor,recurring_interval').eq('id',metadata.payment_plan_id).maybeSingle()
    await supabase.from('subscriptions').upsert({ project_id:projectId, organization_id:organizationId, payment_plan_id:metadata.payment_plan_id || null, stripe_subscription_id:typeof session.subscription === 'string' ? session.subscription : session.subscription.id, status:'active', currency:plan?.currency || currency, recurring_minor:plan?.total_minor || amount, interval:plan?.recurring_interval || 'month' }, { onConflict:'stripe_subscription_id' })
    if (metadata.payment_plan_id) await supabase.from('payment_plans').update({ status:'active' }).eq('id',metadata.payment_plan_id)
  }

  await bindAuthorizedPaymentMethod(session,metadata)
  await supabase.from('projects').update({ status:'active', activated_at:new Date().toISOString() }).eq('id',projectId).in('status',['awaiting_payment','awaiting_acceptance','proposed','draft'])
  await supabase.from('audit_events').insert({ organization_id:organizationId, project_id:projectId, event_type:'payment.succeeded', entity_type:'payment', context:{ stripe_event_id:eventId, checkout_session_id:session.id, amount_minor:amount, currency } })

  if(amount>0){
    const {data:project}=await supabase.from('projects').select('reference,title').eq('id',projectId).maybeSingle()
    if(invoiceReference) await renderFinancialDocument({projectId,organizationId,type:'invoice',title:`Invoice ${invoiceReference}`,reference:invoiceReference,sections:[{heading:'Invoice',body:`Project: ${project?.reference||projectId}\nDescription: ${project?.title||'11-11 Tech engagement'}\nAmount: ${amountText(amount,currency)}\nStatus: Paid\nPayment date: ${new Date().toISOString().slice(0,10)}\nStripe checkout reference: ${session.id}`}]})
    if(receiptReference) await renderFinancialDocument({projectId,organizationId,type:'receipt',title:`Receipt ${receiptReference}`,reference:receiptReference,sections:[{heading:'Payment receipt',body:`Project: ${project?.reference||projectId}\nDescription: ${project?.title||'11-11 Tech engagement'}\nAmount received: ${amountText(amount,currency)}\nMethod: Card / Stripe\nReceived: ${new Date().toISOString()}\n${invoiceReference?`Invoice: ${invoiceReference}\n`:''}Stripe checkout reference: ${session.id}`}]})
    await sendPaymentEmail(organizationId,projectId,amount,currency,receiptReference)
  }
}

async function processInvoiceEvent(eventType: string, invoice: any) {
  const stripeId = invoice.id; const { data: local } = await supabase.from('invoices').select('id,project_id,organization_id,amount_due_minor,amount_paid_minor,currency').eq('stripe_invoice_id',stripeId).maybeSingle(); if (!local) return
  if (eventType === 'invoice.paid') { const paid = Number(invoice.amount_paid || local.amount_due_minor); await supabase.from('invoices').update({ amount_paid_minor:paid, status:'paid', paid_at:new Date().toISOString() }).eq('id',local.id) }
  else if (eventType === 'invoice.payment_failed') { await supabase.from('invoices').update({ status:Number(local.amount_paid_minor)>0 ? 'partially_paid' : 'open' }).eq('id',local.id); await supabase.from('audit_events').insert({ organization_id:local.organization_id, project_id:local.project_id, event_type:'payment.failed', entity_type:'invoice', entity_id:local.id, context:{ stripe_invoice_id:stripeId } }) }
}
async function processSubscriptionEvent(eventType: string, subscription: any) {
  const statusMap: Record<string,string> = { active:'active', trialing:'active', past_due:'past_due', paused:'paused', canceled:'cancelled', incomplete:'pending', incomplete_expired:'cancelled', unpaid:'past_due' }; const status = statusMap[subscription.status] || 'pending'
  await supabase.from('subscriptions').update({ status, current_period_end:subscription.current_period_end ? new Date(subscription.current_period_end*1000).toISOString() : null }).eq('stripe_subscription_id',subscription.id)
  if (eventType === 'customer.subscription.deleted') await supabase.from('payment_plans').update({ status:'cancelled' }).eq('id',subscription.metadata?.payment_plan_id || '')
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed',{status:405}); if (!webhookSecret) return new Response('Webhook not configured',{status:503})
  const raw = await req.text(); const signature = req.headers.get('stripe-signature') || ''; if (!(await verifySignature(raw,signature))) return new Response('Invalid signature',{status:400})
  let event: any; try { event = JSON.parse(raw) } catch { return new Response('Invalid JSON',{status:400}) }
  const payloadHash = await sha256(raw); const { data: existing } = await supabase.from('stripe_events').select('status').eq('id',event.id).maybeSingle()
  if (existing?.status === 'processed' || existing?.status === 'ignored') return new Response(JSON.stringify({received:true,duplicate:true}),{status:200,headers:{'Content-Type':'application/json'}})
  await supabase.from('stripe_events').upsert({ id:event.id,event_type:event.type,livemode:Boolean(event.livemode),status:'received',payload_sha256:payloadHash },{onConflict:'id'})
  try {
    const object = event.data?.object; let handled = true
    switch (event.type) {
      case 'checkout.session.completed': await processCheckoutCompleted(object,event.id); break
      case 'invoice.paid': case 'invoice.payment_failed': await processInvoiceEvent(event.type,object); break
      case 'customer.subscription.created': case 'customer.subscription.updated': case 'customer.subscription.deleted': await processSubscriptionEvent(event.type,object); break
      default: handled = false
    }
    await supabase.from('stripe_events').update({ status:handled?'processed':'ignored', processed_at:new Date().toISOString(), error_message:null }).eq('id',event.id)
    return new Response(JSON.stringify({received:true,handled}),{status:200,headers:{'Content-Type':'application/json'}})
  } catch (error) {
    console.error('stripe-webhook',event.id,event.type,error); await supabase.from('stripe_events').update({ status:'failed', error_message:(error instanceof Error ? error.message : 'Processing failed').slice(0,500) }).eq('id',event.id); return new Response('Webhook processing failed',{status:500})
  }
})
