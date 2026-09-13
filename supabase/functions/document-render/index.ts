import { createClient } from 'npm:@supabase/supabase-js@2'
import { PDFDocument, StandardFonts, rgb } from 'npm:pdf-lib@1.17.1'

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth:{persistSession:false} })
const publicAppUrl = (Deno.env.get('PUBLIC_APP_URL') || 'https://kudzimusar.github.io/11-11-tech').replace(/\/$/,'')
const allowedOrigins=(Deno.env.get('ALLOWED_ORIGINS')||'https://kudzimusar.github.io').split(',').map((v)=>v.trim()).filter(Boolean)
const internalSecret=Deno.env.get('DOCUMENT_RENDER_SECRET')||''
const packTypes=['quotation','sow','service_terms','payment_terms','privacy','nda','sla','dpa','security','ai_addendum']
function cors(origin:string|null){const allowed=origin&&allowedOrigins.includes(origin)?origin:allowedOrigins[0];return {'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-document-secret','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json','Cache-Control':'no-store',Vary:'Origin'}}
function json(body:unknown,status=200,origin:string|null=null){return new Response(JSON.stringify(body),{status,headers:cors(origin)})}
function uuid(value:unknown){return typeof value==='string'&&/^[0-9a-f-]{36}$/i.test(value)?value:''}
function slug(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'document'}
function hex(bytes:ArrayBuffer){return [...new Uint8Array(bytes)].map((b)=>b.toString(16).padStart(2,'0')).join('')}
async function sha256(bytes:Uint8Array){return hex(await crypto.subtle.digest('SHA-256',bytes))}
async function adminUser(req:Request){const auth=req.headers.get('authorization')||'';const token=auth.startsWith('Bearer ')?auth.slice(7):'';if(!token)return null;const {data,error}=await supabase.auth.getUser(token);if(error||!data.user)return null;const {data:admin}=await supabase.from('commercial_admins').select('role').eq('profile_id',data.user.id).eq('active',true).maybeSingle();return admin?data.user:null}
function internalAuthorized(req:Request){const supplied=req.headers.get('x-document-secret')||'';return Boolean(internalSecret&&supplied&&supplied===internalSecret)}
function wrap(text:string,max=88){const words=text.replace(/\r/g,'').split(/\s+/).filter(Boolean);const lines:string[]=[];let line='';for(const word of words){const next=line?`${line} ${word}`:word;if(next.length>max&&line){lines.push(line);line=word}else line=next}if(line)lines.push(line);return lines}
function snapshotSections(snapshot:any){
  const sections:Array<{heading:string;body:string}>=[]
  if(Array.isArray(snapshot?.sections)) for(const item of snapshot.sections){if(item&&typeof item==='object')sections.push({heading:String(item.heading||''),body:String(item.body||'')})}
  if(!sections.length){for(const [key,value] of Object.entries(snapshot||{})){if(['sections','meta'].includes(key))continue;const body=Array.isArray(value)?value.map(String).join('\n'):typeof value==='object'?JSON.stringify(value,null,2):String(value??'');if(body)sections.push({heading:key.replaceAll('_',' ').replace(/\b\w/g,(m)=>m.toUpperCase()),body})}}
  return sections
}
async function renderDocument(document:any,project:any,organization:any){
  const pdf=await PDFDocument.create();const regular=await pdf.embedFont(StandardFonts.Helvetica);const bold=await pdf.embedFont(StandardFonts.HelveticaBold)
  let logo:any=null;try{const logoResponse=await fetch(`${publicAppUrl}/assets/icon-512.png`);if(logoResponse.ok){const logoBytes=new Uint8Array(await logoResponse.arrayBuffer());logo=await pdf.embedPng(logoBytes)}}catch{/* wordmark remains */}
  let page=pdf.addPage([595.28,841.89]);let y=785
  const addPage=()=>{page=pdf.addPage([595.28,841.89]);y=790;page.drawText('11-11 Tech',{x:48,y,font:bold,size:10,color:rgb(.04,.12,.24)});page.drawLine({start:{x:48,y:y-12},end:{x:547,y:y-12},thickness:.7,color:rgb(.83,.86,.9)});y-=35}
  const ensure=(height:number)=>{if(y-height<55)addPage()}
  if(logo){const scale=logo.scale(.09);page.drawImage(logo,{x:48,y:754,width:scale.width,height:scale.height})}
  page.drawText('11-11 Tech',{x:105,y:781,font:bold,size:17,color:rgb(.04,.12,.24)});page.drawText('BUILD · PROVE · GROW',{x:105,y:765,font:regular,size:7,color:rgb(.18,.39,.64)})
  y=708;page.drawText(document.document_type.replaceAll('_',' ').toUpperCase(),{x:48,y,font:bold,size:8,color:rgb(.16,.38,.67)});y-=28
  for(const line of wrap(document.title,48)){page.drawText(line,{x:48,y,font:bold,size:24,color:rgb(.05,.1,.17)});y-=29}
  y-=8;page.drawText(`${project.reference}  ·  ${organization.trading_name||organization.legal_name}`,{x:48,y,font:regular,size:10,color:rgb(.34,.39,.46)});y-=18
  page.drawText(`${document.reference||'11-11 Tech document'}  ·  Version ${document.version}  ·  ${new Date().toISOString().slice(0,10)}`,{x:48,y,font:regular,size:9,color:rgb(.45,.5,.57)});y-=38
  const summary=[['Client',organization.trading_name||organization.legal_name],['Project',project.title],['Project reference',project.reference],['Contract value',`${project.currency} ${(Number(project.contract_value_minor)/100).toLocaleString('en-US',{minimumFractionDigits:2})}`]]
  for(const [label,value] of summary){ensure(26);page.drawText(label,{x:48,y,font:bold,size:8,color:rgb(.38,.43,.5)});page.drawText(String(value||'—'),{x:175,y,font:regular,size:9,color:rgb(.08,.12,.18)});y-=22}y-=15
  const sections=snapshotSections(document.content_snapshot)
  if(!sections.length)sections.push({heading:'Document notice',body:'This document record has been issued by 11-11 Tech. The approved contractual wording for this document must be provided in the controlled document content before production use.'})
  for(const section of sections){ensure(55);if(section.heading){page.drawText(section.heading,{x:48,y,font:bold,size:13,color:rgb(.04,.18,.35)});y-=20}for(const paragraph of section.body.split(/\n+/)){if(!paragraph.trim()){y-=8;continue}for(const line of wrap(paragraph,92)){ensure(17);page.drawText(line,{x:48,y,font:regular,size:9.3,color:rgb(.12,.16,.22)});y-=14}y-=5}y-=12}
  ensure(75);y-=10;page.drawLine({start:{x:48,y},end:{x:547,y},thickness:.7,color:rgb(.82,.85,.89)});y-=20;page.drawText('Controlled commercial document',{x:48,y,font:bold,size:8,color:rgb(.25,.31,.4)});y-=14;page.drawText('The client workspace preserves the exact issued version and acceptance evidence.',{x:48,y,font:regular,size:8,color:rgb(.42,.47,.55)})
  return new Uint8Array(await pdf.save())
}

async function issue(document:any,userId:string|null){
  const [{data:project,error:pErr},{data:organization,error:oErr}]=await Promise.all([
    supabase.from('projects').select('*').eq('id',document.project_id).single(),
    supabase.from('organizations').select('*').eq('id',document.organization_id).single(),
  ]);if(pErr)throw pErr;if(oErr)throw oErr
  const bytes=await renderDocument(document,project,organization);const hash=await sha256(bytes);const filename=`${slug(document.reference||document.title)}-v${document.version}.pdf`;const path=`${document.organization_id}/${document.project_id}/${document.id}/${document.version}/${filename}`
  const upload=await supabase.storage.from('client-documents').upload(path,bytes,{contentType:'application/pdf',upsert:false});if(upload.error)throw upload.error
  await supabase.from('project_documents').update({storage_path:path,sha256:hash,status:'issued',issued_at:new Date().toISOString()}).eq('id',document.id)
  await supabase.from('project_documents').update({status:'superseded'}).eq('project_id',document.project_id).eq('document_type',document.document_type).eq('status','issued').neq('id',document.id).lt('version',document.version)
  await supabase.from('audit_events').insert({actor_profile_id:userId,organization_id:document.organization_id,project_id:document.project_id,event_type:'document.issued',entity_type:'project_document',entity_id:document.id,context:{version:document.version,sha256:hash,storage_path:path,automatic:userId===null}})
  return {documentId:document.id,path,sha256:hash}
}

async function buildPack(projectId:string,userId:string){
  const {data:project,error:pErr}=await supabase.from('projects').select('*').eq('id',projectId).single();if(pErr)throw pErr
  const {data:docs,error:dErr}=await supabase.from('project_documents').select('*').eq('project_id',projectId).eq('status','issued').in('document_type',packTypes).order('created_at');if(dErr)throw dErr
  if(!docs?.length)throw new Error('Issue at least one contractual project document before creating the agreement pack.')
  const merged=await PDFDocument.create()
  for(const doc of docs){if(!doc.storage_path)continue;const download=await supabase.storage.from('client-documents').download(doc.storage_path);if(download.error)throw download.error;const source=await PDFDocument.load(await download.data.arrayBuffer());const pages=await merged.copyPages(source,source.getPageIndices());for(const page of pages)merged.addPage(page)}
  const bytes=new Uint8Array(await merged.save());const hash=await sha256(bytes)
  const {data:latest}=await supabase.from('project_documents').select('version').eq('project_id',projectId).eq('document_type','agreement_pack').order('version',{ascending:false}).limit(1).maybeSingle();const version=Number(latest?.version||0)+1
  const {data:pack,error:insertErr}=await supabase.from('project_documents').insert({project_id:projectId,organization_id:project.organization_id,document_type:'agreement_pack',title:`${project.title} — Agreement Pack`,reference:`${project.reference}-PACK`,version,status:'draft',required_for_acceptance:false,content_snapshot:{included_documents:docs.map((d:any)=>({id:d.id,type:d.document_type,version:d.version,sha256:d.sha256}))},created_by:userId}).select('*').single();if(insertErr)throw insertErr
  const filename=`${slug(project.reference)}-agreement-pack-v${version}.pdf`;const path=`${project.organization_id}/${projectId}/${pack.id}/${version}/${filename}`;const upload=await supabase.storage.from('client-documents').upload(path,bytes,{contentType:'application/pdf'});if(upload.error)throw upload.error
  await supabase.from('project_documents').update({storage_path:path,sha256:hash,status:'issued',issued_at:new Date().toISOString()}).eq('id',pack.id)
  await supabase.from('project_documents').update({status:'superseded'}).eq('project_id',projectId).eq('document_type','agreement_pack').eq('status','issued').neq('id',pack.id).lt('version',version)
  await supabase.from('audit_events').insert({actor_profile_id:userId,organization_id:project.organization_id,project_id:projectId,event_type:'agreement_pack.issued',entity_type:'project_document',entity_id:pack.id,context:{version,sha256:hash,included_documents:docs.map((d:any)=>d.id)}})
  return {documentId:pack.id,path,sha256:hash}
}

Deno.serve(async(req)=>{
  const origin=req.headers.get('origin');if(origin&&!allowedOrigins.includes(origin))return json({error:'Origin not allowed'},403,null)
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)})
  if(req.method!=='POST')return json({error:'Method not allowed'},405,origin)
  const internal=internalAuthorized(req)
  const user=internal?null:await adminUser(req)
  if(!internal&&!user)return json({error:'Company admin access required'},403,origin)
  let input:any;try{input=await req.json()}catch{return json({error:'Invalid request'},400,origin)}
  try{
    if(input?.mode==='pack'){
      if(!user)return json({error:'Agreement packs require company admin access'},403,origin)
      const projectId=uuid(input.projectId);if(!projectId)return json({error:'Project required'},400,origin);return json(await buildPack(projectId,user.id),201,origin)
    }
    const documentId=uuid(input?.documentId);if(!documentId)return json({error:'Document required'},400,origin)
    const {data:document,error}=await supabase.from('project_documents').select('*').eq('id',documentId).single();if(error)throw error;if(document.status!=='draft')return json({error:'Only draft documents can be rendered as a new issued version.'},409,origin)
    return json(await issue(document,user?.id||null),201,origin)
  }catch(error){console.error('document-render',error);return json({error:error instanceof Error?error.message.slice(0,300):'Document rendering failed'},500,origin)}
})
