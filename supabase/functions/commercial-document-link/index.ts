import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl=Deno.env.get('SUPABASE_URL')!
const supabase=createClient(supabaseUrl,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}})
const allowedOrigins=(Deno.env.get('ALLOWED_ORIGINS')||'https://kudzimusar.github.io').split(',').map((value)=>value.trim()).filter(Boolean)
function cors(origin:string|null){const allowed=origin&&allowedOrigins.includes(origin)?origin:allowedOrigins[0];return {'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json','Cache-Control':'no-store',Vary:'Origin'}}
function json(body:unknown,status=200,origin:string|null=null){return new Response(JSON.stringify(body),{status,headers:cors(origin)})}
function uuid(value:unknown){return typeof value==='string'&&/^[0-9a-f-]{36}$/i.test(value)?value:''}

Deno.serve(async(req)=>{
  const origin=req.headers.get('origin')
  if(origin&&!allowedOrigins.includes(origin))return json({error:'Origin not allowed'},403,null)
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)})
  if(req.method!=='POST')return json({error:'Method not allowed'},405,origin)
  const auth=req.headers.get('authorization')||'';const token=auth.startsWith('Bearer ')?auth.slice(7):''
  if(!token)return json({error:'Authentication required'},401,origin)
  const {data:userData,error:userError}=await supabase.auth.getUser(token);if(userError||!userData.user)return json({error:'Authentication required'},401,origin)
  let input:any;try{input=await req.json()}catch{return json({error:'Invalid request'},400,origin)}
  const documentId=uuid(input?.documentId);if(!documentId)return json({error:'Document required'},400,origin)
  const {data:document,error}=await supabase.from('project_documents').select('id,organization_id,status,storage_path,title,reference,version').eq('id',documentId).maybeSingle()
  if(error||!document||document.status==='draft'||!document.storage_path)return json({error:'Document not available'},404,origin)
  const {data:membership}=await supabase.from('organization_members').select('id').eq('organization_id',document.organization_id).eq('profile_id',userData.user.id).eq('active',true).maybeSingle()
  const {data:admin}=await supabase.from('commercial_admins').select('id').eq('profile_id',userData.user.id).eq('active',true).maybeSingle()
  if(!membership&&!admin)return json({error:'Document not available'},403,origin)
  const {data:signed,error:signedError}=await supabase.storage.from('client-documents').createSignedUrl(document.storage_path,300)
  if(signedError||!signed?.signedUrl)return json({error:'Unable to create secure document link'},500,origin)
  await supabase.from('audit_events').insert({actor_profile_id:userData.user.id,organization_id:document.organization_id,event_type:'document.secure_link_created',entity_type:'project_document',entity_id:document.id,context:{version:document.version}})
  return json({url:signed.signedUrl,expiresIn:300,title:document.title,reference:document.reference},200,origin)
})
