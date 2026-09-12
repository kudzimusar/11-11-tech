import { PageHero } from '../components/PageHero'
import { Disclosure } from '../components/Disclosure'
import { Link } from '../components/Link'
import { capabilities, deliveryLifecycle, pricingBands } from '../data/portfolio'
import { media } from '../lib/media'

export function Capabilities() {
  return <>
    <PageHero index="02" kicker="IT Services" title={<>Clear technology services. <span className="soft">Deeper expertise when you need it.</span></>}>11-11 Tech provides UI/UX and front-end development, AI implementation and automation, CRM and business systems, software/data/cloud engineering, digital transformation, IT recruitment, security and quality assurance.</PageHero>

    <section className="editorial-media reveal"><img src={media.systems} alt="Layered technology infrastructure with connected signal paths"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>DESIGN / BUILD / CONNECT / AUTOMATE / IMPROVE</span><h2>Tell us the problem in ordinary language. We will translate it into the right technology work.</h2></div></section>

    <section className="section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">Service portfolio</div><h2>What you can hire 11-11 Tech to do.</h2></div><p>Open a service area to see the exact services inside it, common client problems, likely outcomes and indicative pricing. Nothing important is hidden behind abstract terminology.</p></div>
      <div className="capability-disclosures">
        {capabilities.map((capability, index) => <Disclosure key={capability.id} eyebrow={`${capability.index} / 07`} title={capability.title} summary={capability.proposition} defaultOpen={index === 0}>
          <div className="capability-open-grid">
            <div><h4>When clients call us</h4><p>{capability.problem}</p><h4 className="subhead-gap">What changes</h4><ul className="plain-list">{capability.outcomes.slice(0,5).map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div>
            <div><h4>Services inside this area</h4><div className="service-name-stack">{capability.services.map((service) => <div key={service.name}><strong>{service.name}</strong><span>{service.summary}</span><small>{service.price}</small></div>)}</div></div>
            <div><h4>Typical investment</h4><strong className="price-big">{capability.typicalRange}</strong><p>Most engagements can start with a defined audit, discovery or implementation scope. Larger multi-system work is custom-priced.</p><h4 className="subhead-gap">How we deliver</h4><p>{capability.transformation}</p></div>
          </div>
          <div className="inline-actions"><Link className="btn primary" to={`/capabilities/${capability.id}`}>Full service details ↗</Link><Link className="btn ghost" to={`/contact?capability=${capability.id}`}>Discuss this work</Link></div>
        </Disclosure>)}
      </div>
    </div></section>

    <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Delivery lifecycle</div><h2>Discover → Design → Build → Launch → Operate → Improve.</h2></div><p>Clients can start with a small assessment or a full implementation. The relationship does not have to end when the product launches.</p></div><div className="lifecycle-rail reveal">{deliveryLifecycle.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2,'0')}</span><strong>{step}</strong></div>)}</div></div></section>

    <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Investment model</div><h2>Know the commercial range before the sales call.</h2></div><Link className="text-link" to="/pricing">Full pricing approach ↗</Link></div><div className="pricing-band-grid">{pricingBands.map((band) => <article className="pricing-band reveal" key={band.label}><span>{band.label}</span><strong>{band.range}</strong><p>{band.detail}</p></article>)}</div></div></section>
  </>
}
