import { PageHero } from '../components/PageHero'
import { Link } from '../components/Link'
import { ProjectEstimator } from '../components/ProjectEstimator'
import { capabilities, pricingBands } from '../data/portfolio'

export function Pricing() {
  return <>
    <PageHero index="05" kicker="Pricing" title={<>Know the range <span className="soft">before the proposal.</span></>}>Most defined engagements begin between US$2,000 and US$10,000. Larger or ongoing work is custom-scoped.</PageHero>

    <section className="section pricing-opening-v21"><div className="wrap"><div className="pricing-band-grid">{pricingBands.map((band) => <article className="pricing-band reveal" key={band.label}><span>{band.label}</span><strong>{band.range}</strong><p>{band.detail}</p></article>)}</div></div></section>

    <section className="section editorial-light pricing-estimator-v21"><div className="wrap"><div className="editorial-heading light-heading reveal"><div><div className="kicker">Scope guide</div><h2>Choose. Estimate. Decide.</h2></div><p>A planning range—not a manufactured quotation.</p></div><ProjectEstimator /></div></section>

    <section className="section pricing-services-v21"><div className="wrap"><div className="editorial-heading reveal"><div><div className="kicker">By capability</div><h2>Open the detail.</h2></div><p>Only expand the service area you are actually considering.</p></div><div className="pricing-accordion-v21">{capabilities.map((capability) => <details className="pricing-detail-v21 reveal" key={capability.id}><summary><span>{capability.index}</span><strong>{capability.title}</strong><b>{capability.typicalRange}</b><i>+</i></summary><div className="pricing-detail-body-v21"><p>{capability.proposition}</p><div className="price-service-list">{capability.services.map((service) => <div key={service.name}><span>{service.name}</span><b>{service.price}</b></div>)}</div><Link className="btn primary" to={`/contact?capability=${capability.id}`}>Estimate this work ↗</Link></div></details>)}</div></div></section>

    <section className="section pricing-model-v21"><div className="wrap"><div className="commercial-model-grid reveal"><article><span>Fixed scope</span><h3>Defined deliverable.</h3></article><article><span>Discovery + implementation</span><h3>Pay for clarity first.</h3></article><article><span>Monthly partnership</span><h3>Operate and improve.</h3></article><article><span>Enterprise custom</span><h3>Scope the real complexity.</h3></article></div></div></section>

    <section className="section assurance-section"><div className="wrap assurance-grid"><div><div className="kicker">Commercial notes</div><h2>Transparent, not simplistic.</h2></div><div className="assurance-list"><div><span>✓</span><p>Third-party cloud, model, API, software-license or media usage fees are normally separate unless explicitly included.</p></div><div><span>✓</span><p>Standard contracting and reasonable procurement support are part of the commercial process.</p></div><div><span>✓</span><p>Material client-specific compliance, certification, infrastructure or legal requirements may change scope and price.</p></div><div><span>✓</span><p>Custom pricing is available when a predefined range does not fit the engagement.</p></div></div></div></section>
  </>
}
