import { useState, type FormEvent } from 'react'
import { Link } from '../components/Link'
import { PageHero } from '../components/PageHero'

export function PayInvoice() {
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const continueToPortal = (event: FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams({ reference: reference.trim(), email: email.trim() })
    window.history.pushState({}, '', `${import.meta.env.BASE_URL.replace(/\/$/,'')}/client?${params.toString()}`)
    window.dispatchEvent(new Event('app:navigate'))
    setSubmitted(true)
  }
  if (submitted) return null
  return <>
    <PageHero index="PAY" kicker="Secure billing" title={<>Pay an invoice <span className="soft">or project balance.</span></>}>Start here if 11-11 Tech has already issued your project or invoice reference. We verify your email before exposing any commercial information.</PageHero>
    <section className="section pay-entry-section"><div className="wrap pay-entry-grid"><div className="pay-entry-copy"><img src={`${import.meta.env.BASE_URL}assets/logo.svg`} alt="11-11 Tech"/><h2>Your payment remains attached to the right project and agreement.</h2><p>We never show a project balance from an anonymous reference alone. After this step you receive a secure email sign-in link, review the exact invoice or approved project payment option and applicable terms, then continue to Stripe.</p><ol><li><strong>Identify</strong><span>Project/invoice reference + billing email</span></li><li><strong>Review</strong><span>Exact invoice, project balance, agreement and payment schedule</span></li><li><strong>Pay</strong><span>Stripe-hosted secure payment</span></li><li><strong>Keep</strong><span>Receipt, invoice and agreement package in your client workspace</span></li></ol></div><form className="pay-entry-card" onSubmit={continueToPortal}><small>PAY / MANAGE A PROJECT</small><h2>Find your billing record.</h2><label htmlFor="payment-reference">Invoice or project reference</label><input id="payment-reference" required value={reference} onChange={(event)=>setReference(event.target.value)} placeholder="11T-INV-2026-00042" autoCapitalize="characters"/><label htmlFor="payment-email">Billing email</label><input id="payment-email" required type="email" value={email} onChange={(event)=>setEmail(event.target.value)} placeholder="accounts@organisation.com"/><button className="btn primary">Continue securely ↗</button><p className="pay-entry-note">No card information is collected on this page.</p><div className="pay-entry-alt">Starting something new? <Link to="/contact">Start a project</Link>. Already have access? <Link to="/client">Client login</Link>.</div></form></div></section>
  </>
}

export function PaymentResult({ success }: { success: boolean }) {
  const nativeHref = `eleveneleven://client?payment=${success ? 'success' : 'cancelled'}`
  return <section className="payment-result-page"><div className="payment-result-card"><img src={`${import.meta.env.BASE_URL}assets/logo.svg`} alt="11-11 Tech"/><span className={success ? 'result-mark success' : 'result-mark'}>{success ? '✓' : '↩'}</span><small>{success ? 'PAYMENT CONFIRMATION' : 'PAYMENT NOT COMPLETED'}</small><h1>{success ? 'Your payment has been submitted securely.' : 'No payment was completed.'}</h1><p>{success ? 'Stripe will confirm the transaction to 11-11 Tech. Your client workspace is the authoritative place to see the confirmed amount, remaining balance, invoice and receipt.' : 'Your project and agreement remain unchanged. You can return to your workspace and continue when ready.'}</p><div className="payment-result-actions"><Link className="btn primary" to="/client">Open web client workspace ↗</Link><a className="btn secondary" href={nativeHref}>Return to native app</a><Link className="btn secondary" to="/">Return to website</Link></div><p className="pay-entry-note">The native-app link is optional. If the app is not installed, continue in the secure web workspace.</p></div></section>
}
