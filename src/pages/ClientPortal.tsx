import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { hrefFor } from '../components/Link'
import {
  acceptDocument,
  beginStripeCheckout,
  commercialConfigured,
  consumeCommercialAuthFromLocation,
  getCommercialSession,
  loadPortalData,
  money,
  organizationFromMembership,
  paymentsConfigured,
  requestCommercialMagicLink,
  selectPaymentPlan,
  shortDate,
  signOutCommercial,
  type PortalData,
  type PortalDocument,
  type PortalPlan,
  type PortalProject,
} from '../lib/commercial'

const emptyData: PortalData = { memberships: [], projects: [], documents: [], acceptances: [], plans: [], installments: [], invoices: [], payments: [] }

const documentPurpose: Record<string, string> = {
  quotation: 'Commercial price, validity, assumptions and the services proposed by 11-11 Tech.',
  sow: 'Deliverables, exclusions, responsibilities, milestones and project acceptance rules.',
  service_terms: 'The contractual framework governing delivery, responsibilities, IP, liability and termination.',
  payment_terms: 'Your total, deposit/installment schedule, grace period, late-payment rules, suspension, refunds and payment authorization.',
  privacy: 'How 11-11 Tech handles personal and commercial information used to operate this engagement.',
  nda: 'Confidential information handling and permitted disclosure for both parties.',
  sla: 'Applicable support, response-time, availability and service obligations.',
  dpa: 'Data-processing responsibilities where 11-11 Tech processes personal data for your organisation.',
  security: 'Security responsibilities, controls and incident-handling expectations.',
  ai_addendum: 'Applicable AI-provider, data-use, model limitation and human-oversight terms.',
}

export function ClientPortal() {
  const [email, setEmail] = useState('')
  const [loginSent, setLoginSent] = useState(false)
  const [sessionReady, setSessionReady] = useState(Boolean(getCommercialSession()))
  const [data, setData] = useState<PortalData>(emptyData)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeProjectId, setActiveProjectId] = useState('')
  const [tab, setTab] = useState<'overview' | 'documents' | 'billing' | 'agreement'>('overview')
  const [planChoice, setPlanChoice] = useState('')
  const [openedDocuments, setOpenedDocuments] = useState<Set<string>>(new Set())
  const [acceptedChecks, setAcceptedChecks] = useState<Set<string>>(new Set())
  const [autoPayAccepted, setAutoPayAccepted] = useState(false)
  const [processing, setProcessing] = useState(false)

  const refresh = async () => {
    if (!getCommercialSession()) return
    setLoading(true); setError('')
    try {
      const result = await loadPortalData()
      setData(result)
      setActiveProjectId((current) => current || result.projects[0]?.id || '')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Unable to load the client workspace.')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    const consumed = consumeCommercialAuthFromLocation()
    if (consumed) setSessionReady(true)
    if (consumed || getCommercialSession()) void refresh()
    const onSession = () => setSessionReady(Boolean(getCommercialSession()))
    window.addEventListener('commercial:session', onSession)
    return () => window.removeEventListener('commercial:session', onSession)
  }, [])

  const project = data.projects.find((item) => item.id === activeProjectId) ?? data.projects[0]
  const organization = project
    ? data.memberships.map(organizationFromMembership).find((item) => item?.id === project.organization_id) ?? null
    : data.memberships.map(organizationFromMembership)[0] ?? null
  const documents = project ? data.documents.filter((item) => item.project_id === project.id) : []
  const requiredDocuments = documents.filter((item) => item.required_for_acceptance && item.status === 'issued')
  const projectPlans = project ? data.plans.filter((item) => item.project_id === project.id && ['offered','accepted','active'].includes(item.status)) : []
  const selectedPlan = projectPlans.find((item) => item.id === planChoice) ?? projectPlans.find((item) => ['accepted','active'].includes(item.status))
  const invoices = project ? data.invoices.filter((item) => item.project_id === project.id) : []
  const payments = project ? data.payments.filter((item) => item.project_id === project.id && item.status === 'succeeded') : []
  const paidMinor = payments.reduce((sum, item) => sum + item.amount_minor, 0)
  const projectValue = project?.contract_value_minor ?? selectedPlan?.total_minor ?? 0
  const outstandingMinor = Math.max(projectValue - paidMinor, 0)
  const nextInstallment = selectedPlan
    ? data.installments.filter((item) => item.payment_plan_id === selectedPlan.id && !['paid','waived','cancelled'].includes(item.status)).sort((a,b) => a.sequence_no - b.sequence_no)[0]
    : undefined
  const previouslyAccepted = new Set(data.acceptances.filter((item) => item.project_id === project?.id).map((item) => item.document_id))
  const legalReady = requiredDocuments.every((doc) => previouslyAccepted.has(doc.id) || acceptedChecks.has(doc.id))
  const authorizationReady = !selectedPlan?.requires_autopay_authorization || autoPayAccepted
  const checkoutReady = Boolean(project && selectedPlan && legalReady && authorizationReady)

  useEffect(() => {
    if (!project) return
    const currentPlan = data.plans.find((item) => item.project_id === project.id && ['accepted','active'].includes(item.status))
    setPlanChoice(currentPlan?.id ?? '')
    setOpenedDocuments(new Set())
    setAcceptedChecks(new Set())
    setAutoPayAccepted(false)
  }, [project?.id])

  const sendLogin = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setMessage('')
    try {
      await requestCommercialMagicLink(email)
      setLoginSent(true)
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to send secure sign-in link.') }
  }

  const openDocument = async (doc: PortalDocument) => {
    setOpenedDocuments((current) => new Set(current).add(doc.id))
    if (!doc.storage_path) { setMessage(`${doc.title} is registered but its PDF has not been published yet.`); return }
    try {
      const session = getCommercialSession()
      const supabase = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '')
      const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
      if (!session || !supabase || !anon) throw new Error('Secure document access is unavailable.')
      const encoded = doc.storage_path.split('/').map(encodeURIComponent).join('/')
      const response = await fetch(`${supabase}/storage/v1/object/authenticated/client-documents/${encoded}`, {
        headers: { Authorization: `Bearer ${session.accessToken}`, apikey: anon },
      })
      if (!response.ok) throw new Error('The document could not be downloaded.')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to open the document.') }
  }

  const continueToPayment = async () => {
    if (!project || !selectedPlan || !checkoutReady) return
    setProcessing(true); setError(''); setMessage('')
    try {
      for (const doc of requiredDocuments) {
        if (!previouslyAccepted.has(doc.id)) await acceptDocument(doc.id, `accept:${doc.document_type}:v${doc.version}`)
      }
      if (selectedPlan.status === 'offered') await selectPaymentPlan(selectedPlan.id)
      await beginStripeCheckout({ projectId: project.id, paymentPlanId: selectedPlan.id })
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Unable to continue to secure payment.')
      await refresh().catch(() => undefined)
    } finally { setProcessing(false) }
  }

  if (!sessionReady) return <PortalLogin email={email} setEmail={setEmail} sent={loginSent} onSubmit={sendLogin} error={error} />

  return <section className="commercial-shell">
    <aside className="commercial-rail">
      <a className="commercial-logo" href={hrefFor('/')}><img src={hrefFor('/assets/logo-light.svg')} alt="11-11 Tech" /></a>
      <div className="commercial-context"><small>CLIENT WORKSPACE</small><strong>{organization?.trading_name || organization?.legal_name || 'Your account'}</strong><span>Secure commercial record</span></div>
      <nav aria-label="Client workspace">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Overview</button>
        <button className={tab === 'documents' ? 'active' : ''} onClick={() => setTab('documents')}>Documents <span>{documents.length}</span></button>
        <button className={tab === 'billing' ? 'active' : ''} onClick={() => setTab('billing')}>Billing</button>
        <button className={tab === 'agreement' ? 'active' : ''} onClick={() => setTab('agreement')}>Agreement & pay</button>
      </nav>
      <div className="commercial-rail-bottom"><a href={hrefFor('/')}>← Public website</a><button onClick={() => { signOutCommercial(); setData(emptyData) }}>Sign out</button></div>
    </aside>

    <main className="commercial-main">
      <header className="commercial-topbar"><div><small>11-11 TECH · CLIENT</small><h1>{project?.title || 'Client workspace'}</h1></div>{data.projects.length > 1 && <select aria-label="Choose project" value={project?.id ?? ''} onChange={(event) => setActiveProjectId(event.target.value)}>{data.projects.map((item) => <option value={item.id} key={item.id}>{item.reference} · {item.title}</option>)}</select>}</header>
      {error && <div className="commercial-alert error" role="alert">{error}</div>}
      {message && <div className="commercial-alert" role="status">{message}</div>}
      {loading && <div className="commercial-loading">Loading your secure workspace…</div>}
      {!loading && !project && <EmptyWorkspace />}
      {project && tab === 'overview' && <Overview project={project} paid={paidMinor} outstanding={outstandingMinor} nextInstallment={nextInstallment} documentCount={documents.length} onPay={() => setTab('agreement')} />}
      {project && tab === 'documents' && <Documents documents={documents} accepted={previouslyAccepted} onOpen={openDocument} />}
      {project && tab === 'billing' && <Billing project={project} invoices={invoices} payments={payments} plans={projectPlans} selectedPlan={selectedPlan} installments={data.installments} paid={paidMinor} outstanding={outstandingMinor} onPay={() => setTab('agreement')} />}
      {project && tab === 'agreement' && <AgreementAndPayment
        project={project}
        plans={projectPlans}
        planChoice={selectedPlan?.id ?? planChoice}
        setPlanChoice={setPlanChoice}
        documents={requiredDocuments}
        previouslyAccepted={previouslyAccepted}
        opened={openedDocuments}
        checked={acceptedChecks}
        toggleCheck={(id) => setAcceptedChecks((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next })}
        onOpen={openDocument}
        selectedPlan={selectedPlan}
        autoPayAccepted={autoPayAccepted}
        setAutoPayAccepted={setAutoPayAccepted}
        ready={checkoutReady}
        processing={processing}
        paymentsConfigured={paymentsConfigured}
        onContinue={continueToPayment}
      />}
    </main>
  </section>
}

function PortalLogin({ email, setEmail, sent, onSubmit, error }: { email: string; setEmail: (value: string) => void; sent: boolean; onSubmit: (event: FormEvent) => void; error: string }) {
  return <section className="commercial-auth-page"><div className="commercial-auth-panel"><a href={hrefFor('/')}><img className="commercial-auth-logo" src={hrefFor('/assets/logo.svg')} alt="11-11 Tech" /></a><div className="kicker">Client workspace</div><h1>Your projects, agreements and payments in one place.</h1><p>Use the email address attached to your 11-11 Tech engagement. We will send a secure sign-in link—no password to remember.</p>{!commercialConfigured && <div className="commercial-alert error">Client authentication has not been connected on this deployment.</div>}{error && <div className="commercial-alert error">{error}</div>}{sent ? <div className="commercial-auth-success"><strong>Check your inbox.</strong><p>A secure sign-in link has been sent to {email}. Open it on this device to continue.</p></div> : <form onSubmit={onSubmit}><label htmlFor="client-email">Work email</label><input id="client-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@organisation.com"/><button className="btn primary" disabled={!commercialConfigured}>Send secure sign-in link ↗</button></form>}<div className="commercial-auth-links"><a href={hrefFor('/contact')}>Start a new project</a><a href={hrefFor('/pay')}>Pay an invoice</a></div></div></section>
}

function EmptyWorkspace() {
  return <div className="commercial-empty"><span>ACCOUNT READY</span><h2>No commercial project is attached yet.</h2><p>Your secure account is active. When 11-11 Tech issues a proposal or project invitation it will appear here automatically.</p><a className="btn primary" href={hrefFor('/contact')}>Start a project ↗</a></div>
}

function Overview({ project, paid, outstanding, nextInstallment, documentCount, onPay }: { project: PortalProject; paid: number; outstanding: number; nextInstallment?: { amount_minor: number; due_at: string | null }; documentCount: number; onPay: () => void }) {
  return <div className="commercial-stack"><section className="commercial-hero-card"><div><small>{project.reference}</small><h2>{project.title}</h2><p>{project.summary || 'Your authoritative 11-11 Tech commercial project record.'}</p></div><span className={`status-pill ${project.status}`}>{project.status.replaceAll('_',' ')}</span></section><section className="commercial-metrics"><article><span>Project value</span><strong>{money(project.contract_value_minor, project.currency)}</strong><small>Agreed / proposed value</small></article><article><span>Paid</span><strong>{money(paid, project.currency)}</strong><small>Confirmed payments</small></article><article className="accent"><span>Outstanding</span><strong>{money(outstanding, project.currency)}</strong><small>Current project balance</small></article><article><span>Next payment</span><strong>{nextInstallment ? money(nextInstallment.amount_minor - ('paid_minor' in nextInstallment ? Number(nextInstallment.paid_minor) : 0), project.currency) : '—'}</strong><small>{nextInstallment?.due_at ? shortDate(nextInstallment.due_at) : 'No scheduled payment'}</small></article></section><section className="commercial-action-grid"><article><small>ACTION</small><h3>{outstanding > 0 ? 'Review agreement & payment' : 'Account is paid up'}</h3><p>{outstanding > 0 ? 'Choose your approved payment option, review the required documents and continue securely.' : 'There is no outstanding project balance recorded.'}</p>{outstanding > 0 && <button className="btn primary" onClick={onPay}>Continue to agreement & pay ↗</button>}</article><article><small>DOCUMENT VAULT</small><h3>{documentCount} project document{documentCount === 1 ? '' : 's'}</h3><p>Issued commercial documents remain attached to this project and accessible from your private workspace.</p></article></section></div>
}

function Documents({ documents, accepted, onOpen }: { documents: PortalDocument[]; accepted: Set<string>; onOpen: (doc: PortalDocument) => void }) {
  return <section className="commercial-section"><div className="commercial-section-heading"><div><small>DOCUMENT VAULT</small><h2>Your commercial record.</h2></div><p>Issued versions remain tied to your project. Accepted versions are preserved as historical evidence.</p></div><div className="document-list">{documents.map((doc) => <article key={doc.id}><div className="document-icon">PDF</div><div><small>{doc.document_type.replaceAll('_',' ')} · V{doc.version}</small><h3>{doc.title}</h3><p>{documentPurpose[doc.document_type] || 'Project documentation issued by 11-11 Tech.'}</p><span>{doc.reference || '11-11 Tech document'} · {doc.issued_at ? shortDate(doc.issued_at) : 'Registered'}</span></div><div className="document-actions">{accepted.has(doc.id) && <span className="accepted-mark">✓ Accepted</span>}<button onClick={() => void onOpen(doc)}>View / download ↗</button></div></article>)}</div></section>
}

function Billing({ project, invoices, payments, plans, selectedPlan, installments, paid, outstanding, onPay }: any) {
  return <div className="commercial-stack"><section className="commercial-section"><div className="commercial-section-heading"><div><small>BILLING</small><h2>Paid, owing and due next.</h2></div><button className="btn primary" disabled={outstanding <= 0} onClick={onPay}>{outstanding > 0 ? 'Make a payment ↗' : 'Paid'}</button></div><div className="billing-balance"><div><span>Paid</span><strong>{money(paid, project.currency)}</strong></div><div><span>Outstanding</span><strong>{money(outstanding, project.currency)}</strong></div><div><span>Project value</span><strong>{money(project.contract_value_minor, project.currency)}</strong></div></div></section>{selectedPlan && <section className="commercial-section"><div className="commercial-section-heading"><div><small>PAYMENT PLAN</small><h2>{selectedPlan.name}</h2></div><span className="status-pill active">{selectedPlan.status}</span></div><div className="installment-list">{installments.filter((item: any) => item.payment_plan_id === selectedPlan.id).map((item: any) => <div key={item.id}><span>{String(item.sequence_no).padStart(2,'0')}</span><strong>{money(item.amount_minor, selectedPlan.currency)}</strong><small>{shortDate(item.due_at)}</small><em>{item.status.replaceAll('_',' ')}</em></div>)}</div></section>}<section className="commercial-two-col"><article className="commercial-section"><small>INVOICES</small><div className="compact-ledger">{invoices.length ? invoices.map((item: any) => <div key={item.id}><span><strong>{item.reference}</strong><small>{shortDate(item.due_at)}</small></span><span><strong>{money(item.amount_due_minor, item.currency)}</strong><small>{item.status.replaceAll('_',' ')}</small></span></div>) : <p>No invoice has been issued yet.</p>}</div></article><article className="commercial-section"><small>PAYMENTS & RECEIPTS</small><div className="compact-ledger">{payments.length ? payments.map((item: any) => <div key={item.id}><span><strong>{item.receipt_reference || 'Payment'}</strong><small>{shortDate(item.received_at || item.created_at)}</small></span><span><strong>{money(item.amount_minor, item.currency)}</strong><small>{item.method.replaceAll('_',' ')}</small></span></div>) : <p>No confirmed payment is recorded yet.</p>}</div></article></section></div>
}

function AgreementAndPayment({ project, plans, planChoice, setPlanChoice, documents, previouslyAccepted, opened, checked, toggleCheck, onOpen, selectedPlan, autoPayAccepted, setAutoPayAccepted, ready, processing, paymentsConfigured, onContinue }: any) {
  return <div className="commercial-stack"><section className="commercial-section"><div className="commercial-section-heading"><div><small>STEP 1 · PAYMENT OPTION</small><h2>Choose how you want to pay.</h2></div><p>Only payment structures approved for this project are shown.</p></div><div className="payment-plan-grid">{plans.filter((plan: PortalPlan) => ['offered','accepted','active'].includes(plan.status)).map((plan: PortalPlan) => <label key={plan.id} className={planChoice === plan.id ? 'payment-plan-card selected' : 'payment-plan-card'}><input type="radio" name="payment-plan" checked={planChoice === plan.id} onChange={() => setPlanChoice(plan.id)} disabled={['accepted','active'].includes(selectedPlan?.status) && selectedPlan?.id !== plan.id}/><span><small>{plan.plan_type.replaceAll('_',' ')}</small><strong>{plan.name}</strong><em>{money(plan.total_minor, plan.currency)}</em>{plan.allow_extra_payments && <p>Additional balance payments are allowed{plan.minimum_extra_payment_minor ? ` from ${money(plan.minimum_extra_payment_minor, plan.currency)}` : ''}.</p>}</span></label>)}</div>{!plans.length && <div className="commercial-empty-inline">11-11 Tech has not published a payment option for this project yet.</div>}</section>

    <section className="commercial-section"><div className="commercial-section-heading"><div><small>STEP 2 · REVIEW DOCUMENTS</small><h2>Know exactly what you are accepting.</h2></div><p>Open each mandatory document before acknowledging it. You can download and keep the issued PDF.</p></div><div className="agreement-docs">{documents.map((doc: PortalDocument) => { const done = previouslyAccepted.has(doc.id); const wasOpened = opened.has(doc.id) || done; return <article key={doc.id} className={done ? 'accepted' : ''}><div className="agreement-doc-title"><span>{done ? '✓' : 'PDF'}</span><div><small>{doc.document_type.replaceAll('_',' ')} · Version {doc.version}</small><h3>{doc.title}</h3><p>{documentPurpose[doc.document_type] || 'Applicable 11-11 Tech project terms.'}</p></div></div><button onClick={() => void onOpen(doc)}>Open document ↗</button><label className="agreement-checkbox"><input type="checkbox" checked={done || checked.has(doc.id)} disabled={done || !wasOpened} onChange={() => toggleCheck(doc.id)}/><span>{done ? 'Accepted and recorded.' : wasOpened ? 'I have reviewed this document and agree to the applicable terms.' : 'Open this document before accepting.'}</span></label></article> })}</div></section>

    {selectedPlan?.requires_autopay_authorization && <section className="commercial-section autopay-section"><div><small>STEP 3 · PAYMENT AUTHORISATION</small><h2>Scheduled payment authorization.</h2><p>You authorize 11-11 Tech to charge the payment method you provide according to the displayed payment schedule. This does not authorize arbitrary charges outside the accepted plan.</p></div><label className="agreement-checkbox important"><input type="checkbox" checked={autoPayAccepted} onChange={(event) => setAutoPayAccepted(event.target.checked)}/><span>I authorize the scheduled automatic charges in my selected payment plan.</span></label></section>}

    <section className="commercial-checkout-card"><img src={hrefFor('/assets/logo-light.svg')} alt="11-11 Tech"/><div><small>FINAL REVIEW</small><h2>{selectedPlan ? money(selectedPlan.total_minor, selectedPlan.currency) : money(project.contract_value_minor, project.currency)} project agreement</h2><p>Your acceptance evidence is recorded against the exact issued document versions. Card details are entered only on Stripe’s secure payment surface.</p><div className="checkout-flags"><span className={documents.every((doc: PortalDocument) => previouslyAccepted.has(doc.id) || checked.has(doc.id)) ? 'ok' : ''}>Required documents</span><span className={selectedPlan ? 'ok' : ''}>Payment option</span><span className={!selectedPlan?.requires_autopay_authorization || autoPayAccepted ? 'ok' : ''}>Payment authorization</span></div></div><button className="btn primary" disabled={!ready || processing || !paymentsConfigured} onClick={() => void onContinue()}>{processing ? 'Preparing secure payment…' : paymentsConfigured ? 'Continue to secure payment ↗' : 'Stripe connection pending'}</button></section>
  </div>
}
