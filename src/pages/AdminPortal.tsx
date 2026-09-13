import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { hrefFor } from '../components/Link'
import { AdminProjectConsole } from '../components/AdminProjectConsole'
import { commercialConfigured, consumeCommercialAuthFromLocation, getCommercialSession, money, requestCommercialMagicLink, shortDate, signOutCommercial } from '../lib/commercial'
import { callCommercialAdmin, loadAdminData, type AdminData, type AdminProject } from '../lib/adminOps'

const empty: AdminData = { leads: [], organizations: [], projects: [], invoices: [], payments: [], documents: [] }
type Tab = 'overview' | 'leads' | 'clients' | 'projects' | 'billing' | 'documents'

export function AdminPortal() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sessionReady, setSessionReady] = useState(Boolean(getCommercialSession()))
  const [data, setData] = useState<AdminData>(empty)
  const [tab, setTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [projectDialog, setProjectDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null)
  const [projectForm, setProjectForm] = useState({ organizationName: '', billingEmail: '', clientName: '', title: '', serviceCategory: '', currency: 'USD', contractValue: '' })

  const refresh = async () => {
    if (!getCommercialSession()) return
    setLoading(true); setError('')
    try { setData(await loadAdminData()) }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to load admin workspace.') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const consumed = consumeCommercialAuthFromLocation()
    if (consumed) setSessionReady(true)
    if (consumed || getCommercialSession()) void refresh()
  }, [])

  const successfulPayments = data.payments.filter((item) => item.status === 'succeeded')
  const received = successfulPayments.reduce((sum, item) => sum + item.amount_minor, 0)
  const outstanding = data.invoices.filter((item) => !['paid','void','uncollectible'].includes(item.status)).reduce((sum, item) => sum + Math.max(item.amount_due_minor - item.amount_paid_minor, 0), 0)
  const overdue = data.invoices.filter((item) => item.due_at && new Date(item.due_at) < new Date() && !['paid','void','uncollectible'].includes(item.status))
  const activeProjects = data.projects.filter((item) => item.status === 'active')
  const orgById = useMemo(() => new Map(data.organizations.map((org) => [org.id, org])), [data.organizations])

  const sendLogin = async (event: FormEvent) => {
    event.preventDefault(); setError('')
    try { await requestCommercialMagicLink(email, '/admin'); setSent(true) }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to send admin sign-in link.') }
  }

  const createProject = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setNotice('')
    try {
      await callCommercialAdmin('create-project', {
        organizationName: projectForm.organizationName, billingEmail: projectForm.billingEmail, clientName: projectForm.clientName,
        title: projectForm.title, serviceCategory: projectForm.serviceCategory, currency: projectForm.currency,
        contractValueMinor: Math.round(Number(projectForm.contractValue || 0) * 100),
      })
      setProjectDialog(false)
      setProjectForm({ organizationName: '', billingEmail: '', clientName: '', title: '', serviceCategory: '', currency: 'USD', contractValue: '' })
      setNotice('Project created and client access prepared.')
      await refresh()
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to create project.') }
  }

  if (!sessionReady) return <AdminLogin email={email} setEmail={setEmail} sent={sent} onSubmit={sendLogin} error={error} />

  return <section className="commercial-shell admin-shell">
    <aside className="commercial-rail admin-rail"><a className="commercial-logo" href={hrefFor('/')}><img src={hrefFor('/assets/logo-light.svg')} alt="11-11 Tech" /></a><div className="commercial-context"><small>COMPANY ADMIN</small><strong>Commercial OS</strong><span>Clients · contracts · money</span></div><nav aria-label="Company admin">{([['overview','Overview'],['leads','Leads'],['clients','Clients'],['projects','Projects'],['billing','Billing'],['documents','Documents']] as [Tab,string][]).map(([value,label]) => <button key={value} className={tab===value?'active':''} onClick={()=>setTab(value)}>{label}{value==='leads'&&<span>{data.leads.filter((lead)=>lead.status==='new').length}</span>}</button>)}</nav><div className="commercial-rail-bottom"><a href={hrefFor('/')}>← Public website</a><button onClick={()=>{signOutCommercial();setData(empty);setSessionReady(false)}}>Sign out</button></div></aside>
    <main className="commercial-main"><header className="commercial-topbar"><div><small>11-11 TECH · ADMIN</small><h1>{tab==='overview'?'Commercial command centre':tab[0].toUpperCase()+tab.slice(1)}</h1></div><button className="btn primary" onClick={()=>setProjectDialog(true)}>New client project +</button></header>{error&&<div className="commercial-alert error" role="alert">{error}</div>}{notice&&<div className="commercial-alert" role="status">{notice}</div>}{loading&&<div className="commercial-loading">Loading company commercial data…</div>}
      {!loading&&tab==='overview'&&<AdminOverview data={data} received={received} outstanding={outstanding} overdue={overdue.length} active={activeProjects.length} orgById={orgById}/>} 
      {!loading&&tab==='leads'&&<DataTable title="Lead pipeline" intro="Every structured public enquiry enters here before formal project conversion." columns={['Reference','Client','Service','Budget','Status']} rows={data.leads.map((item)=>[item.reference,item.organization||item.name,item.service||item.capability||'Discovery',item.budget||'—',item.status])}/>} 
      {!loading&&tab==='clients'&&<DataTable title="Client organisations" intro="Authoritative commercial organisations and billing identities." columns={['Organisation','Billing','Country','Status','Created']} rows={data.organizations.map((item)=>[item.trading_name||item.legal_name,item.billing_email||'—',item.country||'—',item.status,shortDate(item.created_at)])}/>} 
      {!loading&&tab==='projects'&&<ProjectsAdmin projects={data.projects} orgById={orgById} onOpen={setSelectedProject}/>} 
      {!loading&&tab==='billing'&&<BillingAdmin data={data} orgById={orgById}/>} 
      {!loading&&tab==='documents'&&<DataTable title="Document register" intro="Issued versions are preserved; accepted evidence is immutable." columns={['Document','Project','Type','Version','Status']} rows={data.documents.map((item)=>[item.reference||item.title,data.projects.find((project)=>project.id===item.project_id)?.reference||'—',item.document_type.replaceAll('_',' '),`v${item.version}`,item.status])}/>} 
    </main>
    {projectDialog&&<NewProjectModal form={projectForm} setForm={setProjectForm} onSubmit={createProject} onClose={()=>setProjectDialog(false)}/>} 
    {selectedProject&&<AdminProjectConsole project={selectedProject} organization={orgById.get(selectedProject.organization_id)} onClose={()=>setSelectedProject(null)} onChanged={async()=>{await refresh();const latest=data.projects.find((p)=>p.id===selectedProject.id);if(latest)setSelectedProject(latest)}}/>}
  </section>
}

function AdminLogin({email,setEmail,sent,onSubmit,error}:{email:string;setEmail:(value:string)=>void;sent:boolean;onSubmit:(event:FormEvent)=>void;error:string}){return <section className="commercial-auth-page admin-auth"><div className="commercial-auth-panel"><a href={hrefFor('/')}><img className="commercial-auth-logo" src={hrefFor('/assets/logo.svg')} alt="11-11 Tech"/></a><div className="kicker">Company admin</div><h1>Operate every client engagement from one record.</h1><p>Authorised 11-11 Tech staff use a secure email link. Admin access is granted explicitly in Supabase—it is never inferred from an email domain.</p>{!commercialConfigured&&<div className="commercial-alert error">Commercial authentication is not configured.</div>}{error&&<div className="commercial-alert error">{error}</div>}{sent?<div className="commercial-auth-success"><strong>Check your inbox.</strong><p>Open the secure admin link sent to {email}.</p></div>:<form onSubmit={onSubmit}><label htmlFor="admin-email">Company email</label><input id="admin-email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}/><button className="btn primary" disabled={!commercialConfigured}>Send admin sign-in link ↗</button></form>}</div></section>}
function AdminOverview({data,received,outstanding,overdue,active,orgById}:any){const recent=[...data.payments].slice(0,5);return <div className="commercial-stack"><section className="commercial-metrics admin-metrics"><article><span>Confirmed received</span><strong>{money(received,'USD')}</strong><small>Recorded successful payments</small></article><article className="accent"><span>Outstanding invoices</span><strong>{money(outstanding,'USD')}</strong><small>{overdue} overdue requiring attention</small></article><article><span>Active projects</span><strong>{active}</strong><small>{data.projects.length} total engagements</small></article><article><span>New enquiries</span><strong>{data.leads.filter((item:any)=>item.status==='new').length}</strong><small>{data.leads.length} leads in register</small></article></section><section className="commercial-two-col"><article className="commercial-section"><small>COMMERCIAL FUNNEL</small><h2>From enquiry to active engagement.</h2><div className="admin-funnel">{['new','reviewing','qualified','proposal','won'].map((status)=><div key={status}><span>{status}</span><strong>{data.leads.filter((lead:any)=>lead.status===status).length}</strong></div>)}</div></article><article className="commercial-section"><small>RECENT MONEY</small><h2>Latest confirmed transactions.</h2><div className="compact-ledger">{recent.length?recent.map((payment:any)=><div key={payment.id}><span><strong>{orgById.get(payment.organization_id)?.trading_name||orgById.get(payment.organization_id)?.legal_name||'Client'}</strong><small>{payment.receipt_reference||payment.method}</small></span><span><strong>{money(payment.amount_minor,payment.currency)}</strong><small>{shortDate(payment.received_at||payment.created_at)}</small></span></div>):<p>No confirmed payments yet.</p>}</div></article></section></div>}
function ProjectsAdmin({projects,orgById,onOpen}:{projects:AdminProject[];orgById:Map<string,any>;onOpen:(project:AdminProject)=>void}){return <section className="commercial-section"><div className="commercial-section-heading"><div><small>PROJECT REGISTER</small><h2>Operate the engagement, not just the record.</h2></div><p>Open a project to publish payment options, issue legal/commercial PDFs, create the Agreement Pack and record offline payments.</p></div><div className="admin-project-list">{projects.length?projects.map((project)=><article key={project.id}><div><small>{project.reference}</small><h3>{project.title}</h3><p>{orgById.get(project.organization_id)?.trading_name||orgById.get(project.organization_id)?.legal_name||'Client'} · {project.service_category||'Technology engagement'}</p></div><div><strong>{money(project.contract_value_minor,project.currency)}</strong><span className={`status-pill ${project.status}`}>{project.status.replaceAll('_',' ')}</span><button onClick={()=>onOpen(project)}>Open project ↗</button></div></article>):<p>No projects yet.</p>}</div></section>}
function BillingAdmin({data,orgById}:any){return <div className="commercial-stack"><DataTable title="Invoices" intro="Open, partial and settled receivables." columns={['Invoice','Client','Due','Paid','Status']} rows={data.invoices.map((item:any)=>[item.reference,orgById.get(item.organization_id)?.trading_name||orgById.get(item.organization_id)?.legal_name||'Client',money(item.amount_due_minor,item.currency),money(item.amount_paid_minor,item.currency),item.status])}/><DataTable title="Payments" intro="Stripe and approved offline payments share one financial history." columns={['Receipt','Client','Amount','Method','Received']} rows={data.payments.map((item:any)=>[item.receipt_reference||'Pending',orgById.get(item.organization_id)?.trading_name||orgById.get(item.organization_id)?.legal_name||'Client',money(item.amount_minor,item.currency),item.method.replaceAll('_',' '),shortDate(item.received_at||item.created_at)])}/></div>}
function DataTable({title,intro,columns,rows}:{title:string;intro:string;columns:string[];rows:(string|number)[][]}){return <section className="commercial-section admin-table-section"><div className="commercial-section-heading"><div><small>11-11 TECH REGISTER</small><h2>{title}</h2></div><p>{intro}</p></div><div className="admin-table-wrap"><table><thead><tr>{columns.map((column)=><th key={column}>{column}</th>)}</tr></thead><tbody>{rows.length?rows.map((row,index)=><tr key={index}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>):<tr><td colSpan={columns.length}>No records yet.</td></tr>}</tbody></table></div></section>}
function NewProjectModal({form,setForm,onSubmit,onClose}:any){return <div className="commercial-modal-backdrop" role="presentation" onMouseDown={(event)=>{if(event.currentTarget===event.target)onClose()}}><div className="commercial-modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title"><img src={hrefFor('/assets/logo.svg')} alt="11-11 Tech"/><small>NEW COMMERCIAL ENGAGEMENT</small><h2 id="new-project-title">Create client + project</h2><p>This prepares the organisation, project record and secure client invitation. Contract documents and payment plans are added next.</p><form onSubmit={onSubmit}><div className="field-grid"><div className="field"><label>Organisation *</label><input required value={form.organizationName} onChange={(e)=>setForm({...form,organizationName:e.target.value})}/></div><div className="field"><label>Billing email *</label><input required type="email" value={form.billingEmail} onChange={(e)=>setForm({...form,billingEmail:e.target.value})}/></div><div className="field"><label>Primary contact</label><input value={form.clientName} onChange={(e)=>setForm({...form,clientName:e.target.value})}/></div><div className="field"><label>Project title *</label><input required value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})}/></div><div className="field"><label>Service</label><input value={form.serviceCategory} onChange={(e)=>setForm({...form,serviceCategory:e.target.value})}/></div><div className="field"><label>Contract value</label><input type="number" min="0" step="0.01" value={form.contractValue} onChange={(e)=>setForm({...form,contractValue:e.target.value})}/></div></div><div className="commercial-modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="btn primary">Create project ↗</button></div></form></div></div>}
