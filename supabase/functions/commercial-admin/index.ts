import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl=Deno.env.get('SUPABASE_URL')!
const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth:{persistSession:false} })
const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || 'https://kudzimusar.github.io').split(',').map((v)=>v.trim()).filter(Boolean)
const resendKey = Deno.env.get('RESEND_API_KEY') || ''
const commercialFrom = Deno.env.get('COMMERCIAL_FROM') || Deno.env.get('LEAD_FROM') || ''
const publicAppUrl = (Deno.env.get('PUBLIC_APP_URL') || 'https://kudzimusar.github.io/11-11-tech').replace(/\/$/,'')
const documentRenderSecret=Deno.env.get('DOCUMENT_RENDER_SECRET')||''
function cors(origin:string|null){const allowed=origin&&allowedOrigins.includes(origin)?origin:allowedOrigins[0];return {'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json','Cache-Control':'no-store',Vary:'Origin'}}
function json(body:unknown,status=200,origin:string|null=null){return new Response(JSON.stringify(body),{status,headers:cors(origin)})}
function text(value:unknown,max=500){return typeof value==='string'?value.trim().slice(0,max):''}
function uuid(value:unknown){const v=text(value,40);return /^[0-9a-f-]{36}$/i.test(v)?v:''}
function minor(value:unknown){const n=Number(value);return Number.isSafeInteger(n)&&n>=0?n:0}
function orgKey(value:string){return value.trim().replace(/\s+/g,' ').toLowerCase()}
function amountText(amount:number,currency:string){return new Intl.NumberFormat('en-US',{style:'currency',currency}).format(amount/100)}

async function adminUser(req:Request){
  const auth=req.headers.get('authorization')||''; const token=auth.startsWith('Bearer ')?auth.slice(7):''
  if(!token)return null
  const {data,error}=await supabase.auth.getUser(token); if(error||!data.user)return null
  const {data:admin}=await supabase.from('commercial_admins').select('role').eq('profile_id',data.user.id).eq('active',true).maybeSingle()
  return admin?{user:data.user,role:admin.role}:null
}
async function email(to:string,subject:string,body:string){if(!resendKey||!commercialFrom||!to)return;await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${resendKey}`,'Content-Type':'application/json'},body:JSON.stringify({from:commercialFrom,to:[to],subject,text:body})}).catch(()=>undefined)}
async function audit(actor:string,org:string|null,project:string|null,eventType:string,entityType:string,entityId:string|null,context:Record<string,unknown>={}){await supabase.from('audit_events').insert({actor_profile_id:actor,organization_id:org,project_id:project,event_type:eventType,entity_type:entityType,entity_id:entityId,context})}
async function ensureInvite(organizationId:string,emailAddress:string,role:string,invitedBy:string){
  const {data:existing}=await supabase.from('client_invites').select('id,expires_at').eq('organization_id',organizationId).ilike('email',emailAddress).is('claimed_at',null).gt('expires_at',new Date().toISOString()).order('created_at',{ascending:false}).limit(1).maybeSingle()
  if(existing)return existing
  const {data,error}=await supabase.from('client_invites').insert({organization_id:organizationId,email:emailAddress,role,invited_by:invitedBy}).select('id,expires_at').single();if(error)throw error;return data
}
async function projectOutstanding(project:any){
  const {data:payments,error}=await supabase.from('payments').select('amount_minor').eq('project_id',project.id).eq('status','succeeded');if(error)throw error
  const paid=(payments||[]).reduce((sum,item)=>sum+Number(item.amount_minor||0),0)
  let ceiling=Number(project.contract_value_minor||0)
  if(ceiling<=0){const {data:plans}=await supabase.from('payment_plans').select('total_minor').eq('project_id',project.id).in('status',['offered','accepted','active']);ceiling=Math.max(0,...(plans||[]).map((item)=>Number(item.total_minor||0)))}
  return Math.max(ceiling-paid,0)
}
async function completePlanIfSettled(planId:string){const {data:open}=await supabase.from('payment_installments').select('id').eq('payment_plan_id',planId).not('status','in','("paid","waived","cancelled")').limit(1);await supabase.from('payment_plans').update({status:open?.length?'active':'completed'}).eq('id',planId)}
async function renderManualReceipt(input:{project:any;payment:any;invoiceReference?:string|null}){
  if(!documentRenderSecret||!input.payment?.receipt_reference)return false
  const {data:latest}=await supabase.from('project_documents').select('version').eq('project_id',input.project.id).eq('document_type','receipt').order('version',{ascending:false}).limit(1).maybeSingle()
  const version=Number(latest?.version||0)+1
  const method=String(input.payment.method||'other').replaceAll('_',' ')
  const {data:document,error}=await supabase.from('project_documents').insert({project_id:input.project.id,organization_id:input.project.organization_id,document_type:'receipt',title:`Receipt ${input.payment.receipt_reference}`,reference:input.payment.receipt_reference,version,status:'draft',required_for_acceptance:false,content_snapshot:{sections:[{heading:'Payment receipt',body:`Project: ${input.project.reference}\nDescription: ${input.project.title}\nAmount received: ${amountText(Number(input.payment.amount_minor),input.payment.currency)}\nMethod: ${method}\nReceived: ${input.payment.received_at||input.payment.created_at}\n${input.invoiceReference?`Invoice: ${input.invoiceReference}\n`:''}${input.payment.external_reference?`External reference: ${input.payment.external_reference}`:''}`}]} }).select('id').single()
  if(error||!document){console.error('manual-receipt-metadata',error);return false}
  const response=await fetch(`${supabaseUrl}/functions/v1/document-render`,{method:'POST',headers:{'Content-Type':'application/json','x-document-secret':documentRenderSecret},body:JSON.stringify({documentId:document.id})})
  if(!response.ok){console.error('manual-receipt-render',response.status,await response.text());return false}
  return true
}

Deno.serve(async(req)=>{
  const origin=req.headers.get('origin'); if(origin&&!allowedOrigins.includes(origin))return json({error:'Origin not allowed'},403,null)
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)})
  if(req.method!=='POST')return json({error:'Method not allowed'},405,origin)
  const admin=await adminUser(req); if(!admin)return json({error:'Company admin access required'},403,origin)
  let input:any; try{input=await req.json()}catch{return json({error:'Invalid request'},400,origin)}
  const action=text(input?.action,80)
  try{
    if(action==='create-project'){
      const organizationName=text(input.organizationName,180), billingEmail=text(input.billingEmail,254).toLowerCase(), clientName=text(input.clientName,180), title=text(input.title,220)
      if(!organizationName||!billingEmail||!title||!billingEmail.includes('@'))return json({error:'Organisation, billing email and project title are required.'},400,origin)
      const {data:candidates,error:candidateError}=await supabase.from('organizations').select('*').ilike('billing_email',billingEmail).order('created_at',{ascending:true});if(candidateError)throw candidateError
      let organization=(candidates||[]).find((item:any)=>orgKey(item.trading_name||item.legal_name||'')===orgKey(organizationName))||null
      if(!organization){const created=await supabase.from('organizations').insert({legal_name:organizationName,trading_name:organizationName,billing_email:billingEmail,status:'prospect'}).select('*').single();if(created.error)throw created.error;organization=created.data}
      const projectInsert=await supabase.from('projects').insert({organization_id:organization.id,title,service_category:text(input.serviceCategory,180)||null,currency:(text(input.currency,3)||'USD').toUpperCase(),contract_value_minor:minor(input.contractValueMinor),status:'draft'}).select('*').single();if(projectInsert.error)throw projectInsert.error
      const project=projectInsert.data
      await supabase.from('project_contacts').insert({project_id:project.id,email:billingEmail,name:clientName||organizationName,role:'primary'})
      await ensureInvite(organization.id,billingEmail,'owner',admin.user.id)
      await audit(admin.user.id,organization.id,project.id,'project.created','project',project.id,{source:'admin',contract_value_minor:project.contract_value_minor,organisation_identity:orgKey(organizationName)})
      await email(billingEmail,`Your 11-11 Tech project is being prepared — ${project.reference}`,`11-11 Tech\n\nWe have created a secure commercial workspace for ${organizationName}.\nProject: ${project.reference} — ${project.title}\n\nWhen the commercial package is issued you can review your quotation, scope, terms, payment options and documents from:\n${publicAppUrl}/client\n\nUse this email address to sign in securely.`)
      return json({organization,project},201,origin)
    }

    if(action==='create-payment-plan'){
      const projectId=uuid(input.projectId); if(!projectId)return json({error:'Project required'},400,origin)
      const {data:project,error:projectError}=await supabase.from('projects').select('*').eq('id',projectId).single();if(projectError)throw projectError
      const planType=text(input.planType,40); if(!['full','deposit_balance','installments','recurring'].includes(planType))return json({error:'Unsupported payment plan type'},400,origin)
      const total=minor(input.totalMinor||project.contract_value_minor); const installments=Array.isArray(input.installments)?input.installments:[]
      if(total<=0)return json({error:'Payment plan total must be greater than zero.'},400,origin)
      if(planType!=='recurring'&&installments.length&&installments.reduce((sum:number,item:any)=>sum+minor(item.amountMinor),0)!==total)return json({error:'Installment amounts must equal the payment-plan total.'},400,origin)
      const created=await supabase.from('payment_plans').insert({project_id:project.id,organization_id:project.organization_id,name:text(input.name,180)||'Project payment plan',plan_type:planType,currency:project.currency,total_minor:total,minimum_extra_payment_minor:input.minimumExtraPaymentMinor==null?null:minor(input.minimumExtraPaymentMinor),allow_extra_payments:Boolean(input.allowExtraPayments),requires_autopay_authorization:Boolean(input.requiresAutopayAuthorization ?? (planType==='installments'||planType==='recurring')),recurring_interval:planType==='recurring'?(text(input.recurringInterval,10)||'month'):null,recurring_interval_count:planType==='recurring'?Math.max(1,Number(input.recurringIntervalCount)||1):null,status:'offered'}).select('*').single();if(created.error)throw created.error
      if(installments.length){const rows=installments.map((item:any,index:number)=>({payment_plan_id:created.data.id,sequence_no:index+1,amount_minor:minor(item.amountMinor),due_at:item.dueAt||null,status:index===0?'due':'scheduled'}));const {error}=await supabase.from('payment_installments').insert(rows);if(error)throw error}
      await supabase.from('projects').update({status:'awaiting_acceptance'}).eq('id',project.id).in('status',['draft','proposed'])
      await audit(admin.user.id,project.organization_id,project.id,'payment_plan.offered','payment_plan',created.data.id,{plan_type:planType,total_minor:total})
      return json({paymentPlan:created.data},201,origin)
    }

    if(action==='create-document'){
      const projectId=uuid(input.projectId); const documentType=text(input.documentType,80); const title=text(input.title,220)
      if(!projectId||!documentType||!title)return json({error:'Project, document type and title are required.'},400,origin)
      const {data:project,error}=await supabase.from('projects').select('id,organization_id').eq('id',projectId).single();if(error)throw error
      const {data:latest}=await supabase.from('project_documents').select('version').eq('project_id',projectId).eq('document_type',documentType).order('version',{ascending:false}).limit(1).maybeSingle()
      const version=Number(latest?.version||0)+1
      const reference=text(input.reference,120)||null
      const snapshot=typeof input.contentSnapshot==='object'&&input.contentSnapshot?input.contentSnapshot:{}
      const {data:document,error:docError}=await supabase.from('project_documents').insert({project_id:project.id,organization_id:project.organization_id,document_type:documentType,title,reference,version,status:'draft',required_for_acceptance:Boolean(input.requiredForAcceptance),content_snapshot:snapshot,created_by:admin.user.id}).select('*').single();if(docError)throw docError
      await audit(admin.user.id,project.organization_id,project.id,'document.draft_created','project_document',document.id,{document_type:documentType,version})
      return json({document},201,origin)
    }

    if(action==='record-manual-payment'){
      const projectId=uuid(input.projectId), invoiceId=uuid(input.invoiceId), installmentId=uuid(input.installmentId), amount=minor(input.amountMinor)
      if(!projectId||!amount)return json({error:'Project and positive amount are required.'},400,origin)
      const {data:project,error}=await supabase.from('projects').select('*').eq('id',projectId).single();if(error)throw error
      const method=text(input.method,30); if(!['bank_transfer','cash','mobile_money','paypal','other'].includes(method))return json({error:'Approved offline payment method required.'},400,origin)
      const projectRemaining=await projectOutstanding(project);let payable=projectRemaining;let invoice:any=null;let installment:any=null;let invoiceReference:string|null=null
      if(invoiceId){const result=await supabase.from('invoices').select('*').eq('id',invoiceId).eq('project_id',project.id).maybeSingle();if(result.error)throw result.error;invoice=result.data;if(!invoice)return json({error:'Invoice does not belong to this project.'},404,origin);if(!['open','partially_paid'].includes(invoice.status))return json({error:'Invoice is not open for payment.'},409,origin);invoiceReference=invoice.reference;payable=Math.min(payable,Math.max(Number(invoice.amount_due_minor)-Number(invoice.amount_paid_minor),0))}
      if(installmentId){const result=await supabase.from('payment_installments').select('*,payment_plans!inner(project_id)').eq('id',installmentId).maybeSingle();if(result.error)throw result.error;installment=result.data;if(!installment||installment.payment_plans?.project_id!==project.id)return json({error:'Installment does not belong to this project.'},404,origin);payable=Math.min(payable,Math.max(Number(installment.amount_minor)-Number(installment.paid_minor),0))}
      if(payable<=0)return json({error:'There is no outstanding balance for this payment target.'},409,origin)
      if(amount>payable)return json({error:`Payment exceeds the outstanding balance of ${payable} minor units.`},409,origin)
      const {data:payment,error:paymentError}=await supabase.from('payments').insert({project_id:project.id,organization_id:project.organization_id,invoice_id:invoiceId||null,installment_id:installmentId||null,currency:project.currency,amount_minor:amount,status:'succeeded',method,external_reference:text(input.externalReference,220)||null,received_at:input.receivedAt||new Date().toISOString(),recorded_by:admin.user.id}).select('*').single();if(paymentError)throw paymentError
      if(invoice){const paid=Number(invoice.amount_paid_minor)+amount;await supabase.from('invoices').update({amount_paid_minor:paid,status:paid>=Number(invoice.amount_due_minor)?'paid':'partially_paid',paid_at:paid>=Number(invoice.amount_due_minor)?new Date().toISOString():null}).eq('id',invoice.id)}
      if(installment){const paid=Number(installment.paid_minor)+amount;await supabase.from('payment_installments').update({paid_minor:paid,status:paid>=Number(installment.amount_minor)?'paid':'partially_paid'}).eq('id',installment.id);await completePlanIfSettled(installment.payment_plan_id)}
      await supabase.from('projects').update({status:'active',activated_at:new Date().toISOString()}).eq('id',project.id).in('status',['awaiting_payment','awaiting_acceptance','proposed','draft'])
      const receiptRendered=await renderManualReceipt({project,payment,invoiceReference})
      await audit(admin.user.id,project.organization_id,project.id,'payment.manual_recorded','payment',payment.id,{amount_minor:amount,method,receipt_rendered:receiptRendered})
      const {data:org}=await supabase.from('organizations').select('billing_email').eq('id',project.organization_id).maybeSingle()
      if(org?.billing_email)await email(org.billing_email,`Payment recorded — ${project.reference}`,`11-11 Tech\n\nWe recorded your ${amountText(amount,project.currency)} ${method.replaceAll('_',' ')} payment for ${project.reference} — ${project.title}.\n${payment.receipt_reference?`Receipt: ${payment.receipt_reference}\n`:''}\nYour updated balance and receipt are available in your secure client workspace:\n${publicAppUrl}/client`)
      return json({payment,receiptRendered},201,origin)
    }

    if(action==='set-project-status'){
      const projectId=uuid(input.projectId), status=text(input.status,40); if(!projectId||!['draft','proposed','awaiting_acceptance','awaiting_payment','active','paused','completed','cancelled'].includes(status))return json({error:'Valid project and status required'},400,origin)
      const {data:project,error}=await supabase.from('projects').update({status,updated_at:new Date().toISOString()}).eq('id',projectId).select('*').single();if(error)throw error
      await audit(admin.user.id,project.organization_id,project.id,'project.status_changed','project',project.id,{status})
      return json({project},200,origin)
    }

    return json({error:'Unsupported admin action'},400,origin)
  }catch(error){console.error('commercial-admin',action,error);return json({error:error instanceof Error?error.message.slice(0,300):'Admin operation failed'},500,origin)}
})
