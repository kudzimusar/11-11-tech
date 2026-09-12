import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { PageHero } from '../components/PageHero'

const emailAddress = 'kudzimusar@gmail.com'

type Inquiry = {
  name: string
  email: string
  organization: string
  region: string
  website: string
  projectType: string
  goals: string
  budget: string
  timeline: string
  engagement: string
  consent: boolean
}

const initialInquiry: Inquiry = {
  name: '', email: '', organization: '', region: '', website: '', projectType: '', goals: '',
  budget: 'Not decided', timeline: 'Exploring', engagement: 'Not sure yet', consent: false,
}

export function Contact() {
  const [step, setStep] = useState(0)
  const [inquiry, setInquiry] = useState(initialInquiry)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const summary = useMemo(() => [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Organization: ${inquiry.organization || '—'}`,
    `Region: ${inquiry.region}`,
    `Project URL: ${inquiry.website || '—'}`,
    `Project type: ${inquiry.projectType}`,
    `Budget: ${inquiry.budget}`,
    `Timeline: ${inquiry.timeline}`,
    `Preferred engagement: ${inquiry.engagement}`,
    '',
    'What should change?',
    inquiry.goals,
  ].join('\n'), [inquiry])

  const mailto = `mailto:${emailAddress}?subject=${encodeURIComponent(`11-11 Tech project inquiry — ${inquiry.name || 'New project'}`)}&body=${encodeURIComponent(summary)}`

  const update = (key: keyof Inquiry) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target instanceof HTMLInputElement && event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setInquiry((current) => ({ ...current, [key]: value } as Inquiry))
  }

  const next = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      setError('Please complete the required fields before continuing.')
      return
    }
    setError('')
    setStatus('')
    if (step < 2) setStep((value) => value + 1)
    else if (step === 2) setStep(3)
    else window.location.href = mailto
  }

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setStatus('Inquiry summary copied. You can paste it into email or another messaging tool.')
    } catch {
      setStatus('Clipboard access was unavailable. Use “Open email draft” instead.')
    }
  }

  return <>
    <PageHero index="06" kicker="Start a project" title={<>Tell us what <span className="soft">is difficult.</span></>}>A useful first conversation starts with context: what exists, what is failing, who it serves, and what would make the work successful.</PageHero>
    <section className="section"><div className="wrap contact-layout"><aside className="contact-aside reveal"><div className="kicker">11-11 Tech · Tokyo</div><h2>A useful first conversation starts with context.</h2><p>This GitHub Pages release keeps your inquiry on your device. When you are ready, it creates a prefilled email draft—no hidden database and no exposed API key.</p><div className="contact-card"><strong>Email</strong><a href={`mailto:${emailAddress}`}>{emailAddress}</a></div><div className="contact-card"><strong>Service regions</strong><span>Japan · Africa · Europe · Americas</span></div><div className="contact-card"><strong>Privacy</strong><span>No inquiry data is transmitted by this website in the current static-host phase.</span></div></aside>
      <div className="form-shell reveal"><form onSubmit={next}><div className="form-progress" aria-label={`Inquiry step ${Math.min(step + 1, 4)} of 4`}>{[0,1,2,3].map((index) => <span key={index} className={step >= index ? 'active' : ''}/>)}</div>
        {step === 0 && <div className="form-step active"><h3>01. Who are we speaking with?</h3><p>Basic contact and organization context.</p><div className="field-grid"><div className="field"><label htmlFor="name">Name *</label><input id="name" autoComplete="name" value={inquiry.name} onChange={update('name')} required /></div><div className="field"><label htmlFor="email">Email *</label><input id="email" type="email" autoComplete="email" value={inquiry.email} onChange={update('email')} required /></div><div className="field"><label htmlFor="org">Organization</label><input id="org" autoComplete="organization" value={inquiry.organization} onChange={update('organization')} /></div><div className="field"><label htmlFor="region">Region *</label><select id="region" value={inquiry.region} onChange={update('region')} required><option value="" disabled>Select region</option><option>Japan</option><option>Africa</option><option>Europe</option><option>Americas</option><option>Other / Global</option></select></div><div className="field full"><label htmlFor="website">Existing project or website URL</label><input id="website" type="url" inputMode="url" placeholder="https://" value={inquiry.website} onChange={update('website')} /></div></div></div>}
        {step === 1 && <div className="form-step active"><h3>02. What are we building or fixing?</h3><p>Give enough context for a useful first response.</p><div className="field full"><label htmlFor="type">Project type *</label><select id="type" value={inquiry.projectType} onChange={update('projectType')} required><option value="" disabled>Select</option><option>New product / MVP</option><option>Existing product improvement</option><option>Platform recovery / audit</option><option>UI/UX redesign</option><option>Documentation / BRD</option><option>QA / certification</option><option>Other</option></select></div><div className="field full"><label htmlFor="goals">What should change? *</label><textarea id="goals" minLength={20} placeholder="Describe the current state, the main problem and what success should look like." value={inquiry.goals} onChange={update('goals')} required /></div></div>}
        {step === 2 && <div className="form-step active"><h3>03. Scope the practicalities.</h3><p>Ranges are enough. They help shape the right engagement without forcing premature precision.</p><div className="field-grid"><div className="field"><label htmlFor="budget">Budget range</label><select id="budget" value={inquiry.budget} onChange={update('budget')}><option>Not decided</option><option>Under US$2,500</option><option>US$2,500–10,000</option><option>US$10,000–25,000</option><option>US$25,000+</option></select></div><div className="field"><label htmlFor="timeline">Timeline</label><select id="timeline" value={inquiry.timeline} onChange={update('timeline')}><option>Exploring</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>6+ months</option></select></div><div className="field full"><label htmlFor="engagement">Preferred engagement</label><select id="engagement" value={inquiry.engagement} onChange={update('engagement')}><option>Not sure yet</option><option>Fixed project</option><option>Audit / recovery sprint</option><option>Ongoing product partnership</option><option>Documentation / advisory engagement</option></select></div><div className="field full checkbox-field"><label><input type="checkbox" checked={inquiry.consent} onChange={update('consent')} required /> <span>I consent to being contacted about this inquiry. *</span></label></div></div></div>}
        {step === 3 && <div className="form-step active review-step"><div className="kicker">Review</div><h3>04. Ready to send.</h3><p>Nothing has left your device. Review the summary below, then open a prefilled email draft or copy the text.</p><dl className="inquiry-review"><div><dt>Name</dt><dd>{inquiry.name}</dd></div><div><dt>Email</dt><dd>{inquiry.email}</dd></div><div><dt>Region</dt><dd>{inquiry.region}</dd></div><div><dt>Project</dt><dd>{inquiry.projectType}</dd></div><div><dt>Budget</dt><dd>{inquiry.budget}</dd></div><div><dt>Timeline</dt><dd>{inquiry.timeline}</dd></div></dl><div className="review-goals"><strong>What should change?</strong><p>{inquiry.goals}</p></div><button type="button" className="text-action" onClick={copySummary}>Copy inquiry summary</button></div>}
        <div className="form-error" role="alert">{error}</div><div className="form-status" aria-live="polite">{status}</div><div className="form-nav"><button type="button" className="btn ghost" onClick={() => { setStep(Math.max(0, step - 1)); setError(''); setStatus('') }} disabled={step === 0}>Back</button><button className="btn primary" type="submit">{step === 3 ? 'Open email draft' : step === 2 ? 'Review inquiry' : 'Continue'} ↗</button></div>
      </form></div></div></section>
  </>
}
