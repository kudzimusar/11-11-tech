import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { PageHero } from '../components/PageHero'
import { capabilities, businessOutcomes, industries } from '../data/portfolio'
import { leadApiConfigured, submitLead, trackEvent } from '../lib/leadOps'

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
  preferredContact: string
  referralSource: string
  companyWebsite: string
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
    preferredContact: 'Email', referralSource: '', companyWebsite: '',
    nda: queryValue('procurement') === 'true', msa: false, dpa: false, security: false, sla: false, procurement: queryValue('procurement') === 'true', consent: false,
  }
  const [step, setStep] = useState(0)
  const [inquiry, setInquiry] = useState(initial)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submittedReference, setSubmittedReference] = useState('')

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

  useEffect(() => {
    trackEvent('intake_step_viewed', { step: String(step + 1), capability: inquiry.capability || 'unclassified' })
  }, [step])

  const summary = useMemo(() => [
    `11-11 Tech inquiry classification: ${submittedReference || reference}`,
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
    `Preferred contact: ${inquiry.preferredContact}`,
    `Referral / source: ${inquiry.referralSource || '—'}`,
    `Procurement / legal: ${legalNeeds.filter((item) => item[1]).map((item) => item[0]).join(', ') || 'None specified'}`,
    '', 'What should change?', inquiry.goals,
  ].join('\n'), [inquiry, reference, submittedReference])

  const mailtoSubject = `${submittedReference || reference} — ${inquiry.organization || inquiry.name || 'New opportunity'}`
  const mailto = `mailto:${emailAddress}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(summary)}`

  const update = (key: keyof Inquiry) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target instanceof HTMLInputElement && event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setInquiry((current) => ({ ...current, [key]: value } as Inquiry))
  }

  const next = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) { event.currentTarget.reportValidity(); setError('Please complete the required fields before continuing.'); return }
    setError(''); setStatus('')
    if (step < 4) { setStep((value) => value + 1); return }
    if (!leadApiConfigured) { trackEvent('lead_email_fallback', { capability: inquiry.capability || 'discovery' }); window.location.href = mailto; return }

    setSubmitting(true)
    try {
      const result = await submitLead({
        name: inquiry.name,
        email: inquiry.email,
        organization: inquiry.organization,
        region: inquiry.region,
        website: inquiry.website,
        industry: inquiry.industry,
        capability: inquiry.capability,
        service: inquiry.service,
        outcome: inquiry.outcome,
        currentSystem: inquiry.currentSystem,
        goals: inquiry.goals,
        budget: inquiry.budget,
        timeline: inquiry.timeline,
        engagement: inquiry.engagement,
        legalNeeds: legalNeeds.filter((item) => item[1]).map((item) => item[0]),
        consent: inquiry.consent,
        preferredContact: inquiry.preferredContact,
        referralSource: inquiry.referralSource,
        company_website: inquiry.companyWebsite,
      })
      setSubmittedReference(result.reference)
      setStatus(`Enquiry received securely. Reference: ${result.reference}. We now have the structured brief needed for follow-up.`)
      trackEvent('lead_success', { capability: inquiry.capability || 'discovery', reference: result.reference })
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : 'Secure submission was unavailable.'
      setError(message)
      setStatus('Your project brief is still available on this device. Use the email fallback below so the opportunity is not lost.')
    } finally {
      setSubmitting(false)
    }
  }

  const copySummary = async () => {
    try { await navigator.clipboard.writeText(summary); setStatus('Project brief copied. You can paste it into email or your procurement workflow.') }
    catch { setStatus('Clipboard access was unavailable. Use the email fallback instead.') }
  }

  return <>
    <PageHero index="08" kicker="Start a project" title={<>Tell us what needs to <span className="soft">change.</span></>}>The intake classifies your need by outcome, capability, service, budget and procurement requirements so the first conversation starts with useful context.</PageHero>
    <section className="section"><div className="wrap contact-layout v2-intake"><aside className="contact-aside reveal"><div className="kicker">Client intake · 11-11 Tech</div><h2>From problem to a correctly routed opportunity.</h2><p>{leadApiConfigured ? 'Your final brief is submitted through the secure 11-11 Tech lead endpoint, classified, stored and routed for follow-up.' : 'This deployment is currently using the safe email fallback until the dedicated lead API environment is connected. Your project brief remains structured and portable.'}</p>{recommended && <div className="recommendation-card"><small>Current direction</small><strong>{recommended.title}</strong><span>{recommended.typicalRange}</span><p>{recommended.proposition}</p></div>}<div className="contact-card"><strong>Email</strong><a href={`mailto:${emailAddress}`}>{emailAddress}</a></div><div className="contact-card"><strong>Trust</strong><span>NDA, MSA, DPA, SLA and procurement needs can be flagged in the intake.</span></div></aside>
      <div className="form-shell reveal"><form onSubmit={next}><input className="lead-honeypot-v23" type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={inquiry.companyWebsite} onChange={update('companyWebsite')}/><div className="form-progress" aria-label={`Inquiry step ${step + 1} of 5`}>{[0,1,2,3,4].map((index) => <span key={index} className={step >= index ? 'active' : ''}/>)}</div>

        {step === 0 && <div className="form-step active"><h3>01. What are you trying to change?</h3><p>Start with the business outcome. We can help with the technology label later.</p><div className="choice-grid">{businessOutcomes.map((item) => <label className={inquiry.outcome === item.id ? 'choice-card selected' : 'choice-card'} key={item.id}><input type="radio" name="outcome" value={item.id} checked={inquiry.outcome === item.id} onChange={update('outcome')} required/><span>{item.label}</span></label>)}</div></div>}

        {step === 1 && <div className="form-step active"><h3>02. Route the opportunity.</h3><p>Choose a capability if you know it. “Not sure” is acceptable.</p><div className="field-grid"><div className="field"><label htmlFor="capability">Capability *</label><select id="capability" value={inquiry.capability} onChange={(event) => { setInquiry((current) => ({ ...current, capability: event.target.value, service: '' })) }} required><option value="">Select capability</option>{capabilities.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></div><div className="field"><label htmlFor="service">Specific service</label><select id="service" value={inquiry.service} onChange={update('service')}><option value="">Needs discovery</option>{capability?.services.map((service) => <option key={service.name}>{service.name}</option>)}</select></div><div className="field"><label htmlFor="industry">Industry</label><select id="industry" value={inquiry.industry} onChange={update('industry')}><option value="">Select / other</option>{industries.map((item) => <option key={item.id}>{item.name}</option>)}</select></div><div className="field"><label htmlFor="current">Current systems</label><input id="current" value={inquiry.currentSystem} onChange={update('currentSystem')} placeholder="e.g. Excel, HubSpot, Microsoft 365, legacy app"/></div><div className="field full"><label htmlFor="goals">What should change? *</label><textarea id="goals" minLength={20} value={inquiry.goals} onChange={update('goals')} required placeholder="Describe the current problem, who is affected and what a better state would look like."/></div></div></div>}

        {step === 2 && <div className="form-step active"><h3>03. Scope the practicalities.</h3><p>Ranges are enough. They help us suggest the right engagement model.</p><div className="field-grid"><div className="field"><label htmlFor="budget">Budget range</label><select id="budget" value={inquiry.budget} onChange={update('budget')}><option>US$2,000–3,500</option><option>US$3,500–5,000</option><option>US$5,000–7,500</option><option>US$7,500–10,000</option><option>US$10,000+</option><option>I need help determining the budget</option></select></div><div className="field"><label htmlFor="timeline">Timeline</label><select id="timeline" value={inquiry.timeline} onChange={update('timeline')}><option>Exploring</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>6+ months</option></select></div><div className="field"><label htmlFor="engagement">Preferred engagement</label><select id="engagement" value={inquiry.engagement} onChange={update('engagement')}><option>Not sure yet</option><option>Discovery / audit</option><option>Fixed-scope project</option><option>Discovery + implementation</option><option>Monthly product / technology partnership</option><option>Recruitment / RPO</option><option>Enterprise custom</option></select></div><div className="field"><label htmlFor="preferred">Preferred contact</label><select id="preferred" value={inquiry.preferredContact} onChange={update('preferredContact')}><option>Email</option><option>Video call</option><option>WhatsApp / phone</option><option>No preference</option></select></div></div></div>}

        {step === 3 && <div className="form-step active"><h3>04. Who are we speaking with?</h3><p>Contact, organization, source and procurement context.</p><div className="field-grid"><div className="field"><label htmlFor="name">Name *</label><input id="name" autoComplete="name" value={inquiry.name} onChange={update('name')} required/></div><div className="field"><label htmlFor="email">Work email *</label><input id="email" type="email" autoComplete="email" value={inquiry.email} onChange={update('email')} required/></div><div className="field"><label htmlFor="org">Organization</label><input id="org" autoComplete="organization" value={inquiry.organization} onChange={update('organization')}/></div><div className="field"><label htmlFor="region">Region</label><select id="region" value={inquiry.region} onChange={update('region')}><option value="">Select region</option><option>Japan</option><option>Africa</option><option>Europe</option><option>Americas</option><option>Other / Global</option></select></div><div className="field"><label htmlFor="referral">How did you find 11-11 Tech?</label><select id="referral" value={inquiry.referralSource} onChange={update('referralSource')}><option value="">Select / prefer not to say</option><option>Search</option><option>Referral</option><option>Social media</option><option>GitHub / technical work</option><option>Existing professional relationship</option><option>Other</option></select></div><div className="field"><label htmlFor="website">Existing product / website URL</label><input id="website" type="url" inputMode="url" placeholder="https://" value={inquiry.website} onChange={update('website')}/></div></div><h4 className="form-subhead">Legal / procurement needs</h4><div className="legal-choice-grid">{([['nda','NDA'],['msa','MSA review'],['dpa','DPA / data terms'],['security','Security assessment'],['sla','SLA'],['procurement','Vendor / procurement onboarding']] as const).map(([key,label]) => <label key={key}><input type="checkbox" checked={Boolean(inquiry[key])} onChange={update(key)}/><span>{label}</span></label>)}</div><div className="field full checkbox-field"><label><input type="checkbox" checked={inquiry.consent} onChange={update('consent')} required/> <span>I consent to being contacted about this inquiry. *</span></label></div></div>}

        {step === 4 && <div className="form-step active review-step"><div className="kicker">05 / Review</div><h3>{submittedReference ? 'Your enquiry has been received.' : 'Your project brief is classified.'}</h3><p>{leadApiConfigured ? 'Review the brief, then submit it securely. A copy remains available for your records.' : 'Review the summary, then open a prefilled email draft or copy the brief.'}</p><div className="classification-badge">{submittedReference || reference}</div><dl className="inquiry-review"><div><dt>Contact</dt><dd>{inquiry.name}</dd></div><div><dt>Work email</dt><dd>{inquiry.email}</dd></div><div><dt>Organization</dt><dd>{inquiry.organization || '—'}</dd></div><div><dt>Region</dt><dd>{inquiry.region || '—'}</dd></div><div><dt>Outcome</dt><dd>{selectedOutcome?.label || '—'}</dd></div><div><dt>Capability</dt><dd>{capability?.title || 'Needs discovery'}</dd></div><div><dt>Service</dt><dd>{inquiry.service || 'Needs discovery'}</dd></div><div><dt>Budget</dt><dd>{inquiry.budget}</dd></div><div><dt>Timeline</dt><dd>{inquiry.timeline}</dd></div><div><dt>Preferred contact</dt><dd>{inquiry.preferredContact}</dd></div><div><dt>Legal / procurement</dt><dd>{legalNeeds.filter((item) => item[1]).map((item) => item[0]).join(', ') || 'None specified'}</dd></div></dl><div className="review-goals"><strong>What should change?</strong><p>{inquiry.goals}</p></div><div className="inline-actions"><button type="button" className="text-action" onClick={copySummary}>Copy project brief</button>{leadApiConfigured && <a className="text-action" href={mailto}>Open email fallback</a>}</div></div>}

        <div className="form-error" role="alert">{error}</div>{status && <div className={`form-status-v23 ${submittedReference ? 'success' : error ? 'error' : ''}`} aria-live="polite">{status}</div>}<div className="form-nav"><button type="button" className="btn ghost" onClick={() => { setStep(Math.max(0, step - 1)); setError(''); setStatus('') }} disabled={step === 0 || submitting}>Back</button><button className="btn primary" type="submit" disabled={submitting || Boolean(submittedReference)}>{step === 4 ? submittedReference ? 'Received' : submitting ? 'Submitting…' : leadApiConfigured ? 'Submit project brief' : 'Open email draft' : 'Continue'} {step < 4 || (!submittedReference && !submitting) ? '↗' : ''}</button></div>
        <p className="form-submit-note-v23">No advertising cookies. Conversion events are designed to be first-party, minimal and non-fingerprinting when the secure lead service is enabled.</p>
      </form></div></div></section>
  </>
}
