import { PageHero } from '../components/PageHero'
import { Disclosure } from '../components/Disclosure'
import { Link } from '../components/Link'
import { capabilities, deliveryLifecycle, pricingBands } from '../data/portfolio'
import { capabilityMedia, media } from '../lib/media'

export function Capabilities() {
  return <>
    <PageHero index="02" kicker="IT Services" title={<>Clear services. <span className="soft">Depth on demand.</span></>}>Design, AI, CRM, software, data, transformation, talent and trust—explained in language a business can use.</PageHero>

    <section className="editorial-media reveal"><img src={media.crossCulture} alt="International technology professionals collaborating around digital systems"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>DESIGN / BUILD / CONNECT / AUTOMATE / IMPROVE</span><h2>Start with the problem. Open the detail only when you need it.</h2></div></section>

    <section className="section capabilities-index-v21"><div className="wrap">
      <div className="editorial-heading reveal"><div><div className="kicker">Service portfolio</div><h2>Seven ways we help.</h2></div><p>Each row opens into scope, outcomes, pricing and a route to start the work.</p></div>

      <div className="capability-visual-ribbon-v22 reveal" aria-label="11-11 Tech service areas">
        {capabilities.map((capability) => <Link to={`/capabilities/${capability.id}`} className={`capability-visual-tile-v22 capability-${capability.id}`} key={capability.id}>
          <img src={capabilityMedia[capability.id]} alt={`${capability.shortTitle} editorial service scene`} loading="lazy"/>
          <span>{capability.index}</span><strong>{capability.shortTitle}</strong>
        </Link>)}
      </div>

      <div className="capability-disclosures">
        {capabilities.map((capability) => <Disclosure key={capability.id} eyebrow={`${capability.index} / 07`} title={capability.title} summary={capability.proposition}>
          <div className="capability-open-grid">
            <div><h4>When this helps</h4><p>{capability.problem}</p><h4 className="subhead-gap">What changes</h4><ul className="plain-list">{capability.outcomes.slice(0,5).map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div>
            <div><h4>Services</h4><div className="service-name-stack">{capability.services.map((service) => <div key={service.name}><strong>{service.name}</strong><span>{service.summary}</span><small>{service.price}</small></div>)}</div></div>
            <div><h4>Typical investment</h4><strong className="price-big">{capability.typicalRange}</strong><p>Start with a defined audit, discovery or implementation scope. Multi-system work is custom-priced.</p></div>
          </div>
          <div className="inline-actions"><Link className="btn primary" to={`/capabilities/${capability.id}`}>Explore this capability ↗</Link><Link className="btn ghost" to={`/contact?capability=${capability.id}`}>Discuss this work</Link></div>
        </Disclosure>)}
      </div>
    </div></section>

    <section className="section editorial-light capability-method-v21"><div className="wrap"><div className="editorial-heading light-heading reveal"><div><div className="kicker">Delivery</div><h2>Discover → Improve.</h2></div><Link className="text-link dark-link" to="/method">Full method ↗</Link></div><div className="lifecycle-rail reveal">{deliveryLifecycle.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2,'0')}</span><strong>{step}</strong></div>)}</div></div></section>

    <section className="section capability-pricing-v21"><div className="wrap"><div className="editorial-heading reveal"><div><div className="kicker">Investment</div><h2>Know the range.</h2></div><Link className="text-link" to="/pricing">Pricing details ↗</Link></div><div className="pricing-band-grid">{pricingBands.map((band) => <article className="pricing-band reveal" key={band.label}><span>{band.label}</span><strong>{band.range}</strong><p>{band.detail}</p></article>)}</div></div></section>
  </>
}
