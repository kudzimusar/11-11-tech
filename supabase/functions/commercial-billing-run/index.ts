import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}})
const stripeKey=Deno.env.get('STRIPE_SECRET_KEY')||''
const billingSecret=Deno.env.get('BILLING_CRON_SECRET')||''
const resendKey=Deno.env.get('RESEND_API_KEY')||''
const commercialFrom=Deno.env.get('COMMERCIAL_FROM')||Deno.env.get('LEAD_FROM')||''
const publicAppUrl=(Deno.env.get('PUBLIC_APP_URL')||'https://kudzimusar.github.io/11-11-tech').replace(/\/$/,'')
async function stripe(path:string,init:RequestInit={}){const response=await fetch(`https://api.stripe.com/v1/${path}`,{...init,headers:{Authorization:`Bearer ${stripeKey}`,...(init.headers||{})}});const payload=await response.json();if(!response.ok)throw new Error(payload?.error?.message||`Stripe ${response.status}`);return payload}
async function sendFailure(email:string,projectRef:string,amount:number,currency:string,reason='scheduled payment'){if(!resendKey||!commercialFrom||!email)return;const formatted=new Intl.NumberFormat('en-US',{style:'currency',currency}).format(amount/100);await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${resendKey}`,'Content-Type':'application/json'},body:JSON.stringify({from:commercialFrom,to:[email],subject:`Payment action required — ${projectRef}`,text:`11-11 Tech\n\nWe could not complete the ${reason} of ${formatted} for ${projectRef}.\nPlease open your secure client workspace to review the authorised payment method and project balance:\n${publicAppUrl}/client\n\nNo unapproved amount will be charged.`})}).catch(()=>undefined)}

Deno.serve(async(req)=>{
  if(req.method!=='POST')return new Response('Method not allowed',{status:405})
  const supplied=req.headers.get('x-billing-secret')||req.headers.get('authorization')?.replace(/^Bearer\s+/,'')||''
  if(!billingSecret||supplied!==billingSecret)return new Response('Unauthorized',{status:401})
  if(!stripeKey)return new Response(JSON.stringify({error:'Stripe not configured'}),{status:503,headers:{'Content-Type':'application/json'}})
  const now=new Date().toISOString()
  const {data:due,error}=await supabase.from('payment_installments').select('id,payment_plan_id,sequence_no,amount_minor,paid_minor,due_at,status').lte('due_at',now).in('status',['scheduled','due','late']).limit(50)
  if(error){console.error(error);return new Response(JSON.stringify({error:error.message}),{status:500,headers:{'Content-Type':'application/json'}})}
  const results:any[]=[]
  for(const row of due||[]){
    try{
      const {data:plan,error:planError}=await supabase.from('payment_plans').select('id,project_id,organization_id,currency,status,requires_autopay_authorization,plan_type').eq('id',row.payment_plan_id).single();if(planError)throw planError
      if(plan.plan_type==='recurring'||!['accepted','active'].includes(plan.status)){results.push({id:row.id,status:'skipped'});continue}
      const {data:authorization}=await supabase.from('payment_authorizations').select('id,stripe_payment_method_id').eq('payment_plan_id',plan.id).eq('authorization_type','scheduled_charges').is('revoked_at',null).order('accepted_at',{ascending:false}).limit(1).maybeSingle()
      if(plan.requires_autopay_authorization&&!authorization){results.push({id:row.id,status:'no_authorization'});continue}
      const [{data:project,error:projectError},{data:org,error:orgError}]=await Promise.all([
        supabase.from('projects').select('reference,title').eq('id',plan.project_id).single(),
        supabase.from('organizations').select('stripe_customer_id,billing_email').eq('id',plan.organization_id).single(),
      ]);if(projectError)throw projectError;if(orgError)throw orgError
      const remaining=Math.max(Number(row.amount_minor)-Number(row.paid_minor),0);if(!remaining){await supabase.from('payment_installments').update({status:'paid'}).eq('id',row.id);continue}
      if(!org?.stripe_customer_id)throw new Error('No Stripe customer is attached to the organisation')
      const paymentMethodId=authorization?.stripe_payment_method_id||''
      if(!paymentMethodId){
        await supabase.from('audit_events').insert({organization_id:plan.organization_id,project_id:plan.project_id,event_type:'payment.method_required',entity_type:'payment_plan',entity_id:plan.id,context:{installment_id:row.id}})
        await sendFailure(org.billing_email||'',project.reference,remaining,plan.currency,'scheduled payment because no authorised saved payment method is available')
        results.push({id:row.id,status:'no_authorized_payment_method'});continue
      }
      const {data:invoice,error:invoiceError}=await supabase.from('invoices').insert({project_id:plan.project_id,organization_id:plan.organization_id,payment_plan_id:plan.id,installment_id:row.id,currency:plan.currency,amount_due_minor:remaining,amount_paid_minor:0,status:'open',due_at:row.due_at,issued_at:new Date().toISOString()}).select('*').single();if(invoiceError)throw invoiceError
      const body=new URLSearchParams({amount:String(remaining),currency:String(plan.currency).toLowerCase(),customer:org.stripe_customer_id,payment_method:paymentMethodId,off_session:'true',confirm:'true',description:`${project.reference} · installment ${row.sequence_no}`})
      body.set('metadata[project_id]',plan.project_id);body.set('metadata[organization_id]',plan.organization_id);body.set('metadata[payment_plan_id]',plan.id);body.set('metadata[installment_id]',row.id);body.set('metadata[invoice_id]',invoice.id);body.set('metadata[payment_kind]','scheduled_installment')
      let intent:any
      try{intent=await stripe('payment_intents',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body})}catch(paymentError){await supabase.from('payment_installments').update({status:'late'}).eq('id',row.id);await supabase.from('audit_events').insert({organization_id:plan.organization_id,project_id:plan.project_id,event_type:'payment.failed',entity_type:'invoice',entity_id:invoice.id,context:{installment_id:row.id,reason:paymentError instanceof Error?paymentError.message:'Stripe payment failed'}});await sendFailure(org.billing_email||'',project.reference,remaining,plan.currency);results.push({id:row.id,status:'failed'});continue}
      if(intent.status==='succeeded'){
        const {data:payment}=await supabase.from('payments').insert({project_id:plan.project_id,organization_id:plan.organization_id,invoice_id:invoice.id,installment_id:row.id,currency:plan.currency,amount_minor:remaining,status:'succeeded',method:'stripe',stripe_payment_intent_id:intent.id,received_at:new Date().toISOString()}).select('id,receipt_reference').single()
        await supabase.from('invoices').update({amount_paid_minor:remaining,status:'paid',paid_at:new Date().toISOString()}).eq('id',invoice.id)
        await supabase.from('payment_installments').update({paid_minor:Number(row.paid_minor)+remaining,status:'paid'}).eq('id',row.id)
        const {data:open}=await supabase.from('payment_installments').select('id').eq('payment_plan_id',plan.id).not('status','in','("paid","waived","cancelled")').neq('id',row.id).limit(1)
        await supabase.from('payment_plans').update({status:open?.length?'active':'completed'}).eq('id',plan.id)
        await supabase.from('audit_events').insert({organization_id:plan.organization_id,project_id:plan.project_id,event_type:'payment.succeeded',entity_type:'payment',entity_id:payment?.id||null,context:{installment_id:row.id,invoice_id:invoice.id,payment_intent_id:intent.id,scheduled:true,payment_method_authorization_id:authorization?.id||null}})
        results.push({id:row.id,status:'paid',receipt:payment?.receipt_reference||null})
      }else{await supabase.from('payment_installments').update({status:'late'}).eq('id',row.id);results.push({id:row.id,status:intent.status})}
    }catch(err){console.error('billing installment',row.id,err);results.push({id:row.id,status:'error',error:err instanceof Error?err.message:'Unknown error'})}
  }
  return new Response(JSON.stringify({checked:(due||[]).length,results}),{status:200,headers:{'Content-Type':'application/json'}})
})
