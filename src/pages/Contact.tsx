import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { PageHero } from '../components/PageHero'
import { capabilities, businessOutcomes, industries } from '../data/portfolio'

const emailAddress = 'kudzimusar@gmail.com'

type Inquiry = {
  name: string
  email: string
  organization: string
  region: string
  website: string
  industry: string
  capability: string
  service: string
  outcome: string
  currentSystem: string
  goals: string
  budget: string
  timeline: string
  engagement: string
  nda: boolean
  msa: boolean
  dpa: boolean
  security: boolean
  sla: boolean
  procurement: boolean
  consent: boolean
}

function queryValue(key: string) {
  return new URLSearchParams(window.location.search).get(key) ?? ''
}

export function Contact() {
  const initialCapability = queryValue('capability')
  const initial: Inquiry = {
    name: '', email: '', organization: '', region: '', website: '',
    industry: queryValue('industry'), capability: initialCapability, service: queryValue('service'), outcome: queryValue('outcome'),
    currentSystem: '', goals: '', budget: 'I need help determining the budget', timeline: 'Exploring', engagement: 'Not sure yet',
    nda: queryValue('procurement') === 'true', msa: false, dpa: false, security: false, sla: false, procurement: queryValue('procurement') === 'true', consent: false,
  }
  const [step, setStep] = useState(0)
  const [inquiry, setInquiry] = useState(initial)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const capability = capabilities.find((item) => item.id === inquiry.capability)
  const selectedOutcome = businessOutcomes.find((item) => item.id === inquiry.outcome)
  const recommended = capability ?? (selectedOutcome ? capabilities.find((item) => selectedOutcome.capabilityIds.includes(item.id)) : undefined)
  const reference = `11T-${(inquiry.capability || 'DISCOVERY').toUpperCase().replace(/[^A-Z0-9]+/g,'-')}`
  const legalNeeds = [
    ['NDA', inquiry.nda],
    ['MSA', inquiry.msa],
    ['DPA', inquiry.dpa],
    ['Security review', inquiry.security],
    ['SLA', inquiry.sla],
    ['Vendor onboarding', inquiry.procurement],
  ] as const

  const summary = useMemo(() => [
    `11-11 Tech inquiry classification: ${reference}`,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Organization: ${inquiry.organization || '—'}`,
    `Region: ${inquiry.region || '—'}`,
    `Industry: ${inquiry.industry || '—'}`,
    `Project URL: ${inquiry.website || '—'}`,
    `Capability: ${capabilities.find((item) => item.id === inquiry.capability)?.title || 'Needs discovery'}`,
    `Service: ${inquiry.service || 'Needs discovery'}`,
    `Business outcome: ${businessOutcomes.find((item) => item.id === inquiry.outcome)?.label || '—'}`,
    `Current systems: ${inquiry.currentSystem || '—'}`,
    `Budget: ${inquiry.budget}`,
    `Timeline: ${inquiry.timeline}`,
    `Engagement: ${inquiry.engagement}`,
    `Procurement / legal: ${legalNeeds.filter((item) => item[1]).map((item) => item[0]).join(', ') || 'None specified'}`,
    '', 'What should change?', inquiry.goals,
  ].join('\n'), [inquiry, reference])

  const mailtoSubject = `${reference} — ${inquiry.organization || inquiry.name || 'New opportunity'}`
  const mailto = `mailto:${emailAddress}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(summary)}`

  const update = (key: keyof Inquiry) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target instanceof HTMLInputElement && event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setInquiry((current) => ({ ...current, [key]: value } as Inquiry))
  }

  const next = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) { event.currentTarget.reportValidity(); setError('Please complete the required fields before continuing.'); return }
    setError(''); setStatus('')
    if (step < 4) setStep((value) => value + 1)
    else window.location.href = mailto
  }

  const copySummary = async () => {
    try { await navigator.clipboard.writeText(summary); setStatus('Project brief copied. You can paste it into email or your procurement workflow.') }
    catch { setStatus('Clipboard access was unavailable. Use “Open email draft” instead.') }
  }

  return <>
    <PageHero index="08" kicker="Start a project" title={<>Tell us what needs to <span className="soft">change.</span></>}>The intake classifies your need by outcome, capability, service, budget and procurement requirements so the first conversation starts with useful context.</PageHero>
    <section className="section"><div className="wrap contact-layout v2-intake"><aside className="contact-aside reveal"><div className="kicker">Client intake · 11-11 Tech</div><h2>From problem to a correctly routed opportunity.</h2><p>The current GitHub Pages release creates a structured project brief and a prefilled email draft. No hidden form database or exposed API key is used.</p>{recommended && <div className="recommendation-card"><small>Current direction</small><strong>{recommended.title}</strong><span>{recommended.typicalRange}</span><p>{recommended.proposition}</p></div>}<div className="contact-card"><strong>Email</strong><a href={`mailto:${emailAddress}`}>{emailAddress}</a></div><div className="contact-card"><strong>Trust</strong><span>NDA, MSA, DPA, SLA and procurement needs can be flagged in the intake.</span></div></aside>
      <div className="form-shell reveal"><form onSubmit={next}><div className="form-progress" aria-label={`Inquiry step ${step + 1} of 5`}>{[0,1,2,3,4].map((index) => <span key={index} className={step >= index ? 'active' : ''}/>)}</div>

        {step === 0 && <div className="form-step active"><h3>01. What are you trying to change?</h3><p>Start with the business outcome. We can help with the technology label later.</p><div className="choice-grid">{businessOutcomes.map((item) => <label className={inquiry.outcome === item.id ? 'choice-card selected' : 'choice-card'} key={item.id}><input type="radio" name="outcome" value={item.id} checked={inquiry.outcome === item.id} onChange={update('outcome')} required/><span>{item.label}</span></label>)}</div></div>}

        {step === 1 && <div className="form-step active"><h3>02. Route the opportunity.</h3><p>Choose a capability if you know it. “Not sure” is acceptable.</p><div className="field-grid"><div className="field"><label htmlFor="capability">Capability *</label><select id="capability" value={inquiry.capability} onChange={(event) => { setInquiry((current) => ({ ...current, capability: event.target.value, service: '' })) }} required><option value="">Select capability</option>{capabilities.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></div><div className="field"><label htmlFor="service">Specific service</label><select id="service" value={inquiry.service} onChange={update('service')}><option value="">Needs discovery</option>{capability?.services.map((service) => <option key={service.name}>{service.name}</option>)}</select></div><div className="field"><label htmlFor="industry">Industry</label><select id="industry" value={inquiry.industry} onChange={update('industry')}><option value="">Select / other</option>{industries.map((item) => <option key={item.id}>{item.name}</option>)}</select></div><div className="field"><label htmlFor="current">Current systems</label><input id="current" value={inquiry.currentSystem} onChange={update('currentSystem')} placeholder="e.g. Excel, HubSpot, Microsoft 365, legacy app"/></div><div className="field full"><label htmlFor="goals">What should change? *</label><textarea id="goals" minLength={20} value={inquiry.goals} onChange={update('goals')} required placeholder="Describe the current problem, who is affected and what a better state would look like."/></div></div></div>}

        {step === 2 && <div className="form-step active"><h3>03. Scope the practicalities.</h3><p>Ranges are enough. They help us suggest the right engagement model.</p><div className="field-grid"><div className="field"><label htmlFor="budget">Budget range</label><select id="budget" value={inquiry.budget} onChange={update('budget')}><option>US$2,000–3,500</option><option>US$3,500–5,000</option><option>US$5,000–7,500</option><option>US$7,500–10,000</option><option>US$10,000+</option><option>I need help determining the budget</option></select></div><div className="field"><label htmlFor="timeline">Timeline</label><select id="timeline" value={inquiry.timeline} onChange={update('timeline')}><option>Exploring</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>6+ months</option></select></div><div className="field full"><label htmlFor="engagement">Preferred engagement</label><select id="engagement" value={inquiry.engagement} onChange={update('engagement')}><option>Not sure yet</option><option>Discovery / audit</option><option>Fixed-scope project</option><option>Discovery + implementation</option><option>Monthly product / technology partnership</option><option>Recruitment / RPO</option><option>Enterprise custom</option></select></div></div></div>}

        {step === 3 && <div className="form-step active"><h3>04. Who are we speaking with?</h3><p>Contact, organization and procurement context.</p><div className="field-grid"><div className="field"><label htmlFor="name">Name *</label><input id="name" autoComplete="name" value={inquiry.name} onChange={update('name')} required/></div><div className="field"><label htmlFor="email">Work email *</label><input id="email" type="email" autoComplete="email" value={inquiry.email} onChange={update('email')} required/></div><div className="field"><label htmlFor="org">Organization</label><input id="org" autoComplete="organization" value={inquiry.organization} onChange={update('organization')}/></div><div className="field"><label htmlFor="region">Region</label><select id="region" value={inquiry.region} onChange={update('region')}><option value="">Select region</option><option>Japan</option><option>Africa</option><option>Europe</option><option>Americas</option><option>Other / Global</option></select></div><div className="field full"><label htmlFor="website">Existing product / website URL</label><input id="website" type="url" inputMode="url" placeholder="https://" value={inquiry.website} onChange={update('website')}/></div></div><h4 className="form-subhead">Legal / procurement needs</h4><div className="legal-choice-grid">{([['nda','NDA'],['msa','MSA review'],['dpa','DPA / data terms'],['security','Security assessment'],['sla','SLA'],['procurement','Vendor / procurement onboarding']] as const).map(([key,label]) => <label key={key}><input type="checkbox" checked={Boolean(inquiry[key])} onChange={update(key)}/><span>{label}</span></label>)}</div><div className="field full checkbox-field"><label><input type="checkbox" checked={inquiry.consent} onChange={update('consent')} required/> <span>I consent to being contacted about this inquiry. *</span></label></div></div>}

        {step === 4 && <div className="form-step active review-step"><div className="kicker">05 / Review</div><h3>Your project brief is classified.</h3><p>Nothing has left your device. Review the summary, then open a prefilled email draft or copy the brief.</p><div className="classification-badge">{reference}</div><dl className="inquiry-review"><div><dt>Outcome</dt><dd>{selectedOutcome?.label || '—'}</dd></div><div><dt>Capability</dt><dd>{capability?.title || 'Needs discovery'}</dd></div><div><dt>Service</dt><dd>{inquiry.service || 'Needs discovery'}</dd></div><div><dt>Budget</dt><dd>{inquiry.budget}</dd></div><div><dt>Timeline</dt><dd>{inquiry.timeline}</dd></div><div><dt>Organization</dt><dd>{inquiry.organization || '—'}</dd></div></dl><div className="review-goals"><strong>What should change?</strong><p>{inquiry.goals}</p></div><button type="button" className="text-action" onClick={copySummary}>Copy project brief</button></div>}

        <div className="form-error" role="alert">{error}</div><div className="form-status" aria-live="polite">{status}</div><div className="form-nav"><button type="button" className="btn ghost" onClick={() => { setStep(Math.max(0, step - 1)); setError(''); setStatus('') }} disabled={step === 0}>Back</button><button className="btn primary" type="submit">{step === 4 ? 'Open email draft' : 'Continue'} ↗</button></div>
      </form></div></div></section>
  </>
}
