import { PageHero } from '../components/PageHero'
import { Disclosure } from '../components/Disclosure'
import { Link } from '../components/Link'
import { capabilities, deliveryLifecycle, pricingBands } from '../data/portfolio'
import { media } from '../lib/media'

export function Capabilities() {
  return <>
    <PageHero index="02" kicker="Capabilities" title={<>Seven practices. <span className="soft">One technology partner.</span></>}>Start with the problem. Open only the level of detail you need. Every capability connects to implementation, proof, pricing, quality and a clear next step.</PageHero>

    <section className="editorial-media reveal"><img src={media.systems} alt="Layered technology infrastructure with connected signal paths"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>EXPERIENCE / SYSTEMS / AI / DATA / TALENT / TRUST</span><h2>We engineer the technology behind organizations.</h2></div></section>

    <section className="section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">Capability portfolio</div><h2>Understand us in seconds. Go deeper when it matters.</h2></div><p>Each practice expands into its service catalogue without turning the page into a wall of text.</p></div>
      <div className="capability-disclosures">
        {capabilities.map((capability, index) => <Disclosure key={capability.id} eyebrow={`${capability.index} / 07`} title={capability.title} summary={capability.proposition} defaultOpen={index === 0}>
          <div className="capability-open-grid">
            <div><h4>What changes</h4><p>{capability.transformation}</p><ul className="plain-list">{capability.outcomes.slice(0,4).map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div>
            <div><h4>What we implement</h4><div className="mini-chip-grid">{capability.services.slice(0,6).map((service) => <span key={service.name}>{service.name}</span>)}</div></div>
            <div><h4>Typical investment</h4><strong className="price-big">{capability.typicalRange}</strong><p>Custom scope available for larger or unusual engagements.</p></div>
          </div>
          <div className="inline-actions"><Link className="btn primary" to={`/capabilities/${capability.id}`}>Explore {capability.shortTitle} ↗</Link><Link className="btn ghost" to={`/contact?capability=${capability.id}`}>Discuss this capability</Link></div>
        </Disclosure>)}
      </div>
    </div></section>

    <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Delivery lifecycle</div><h2>Discover → improve.</h2></div><p>The engagement does not have to end at launch.</p></div><div className="lifecycle-rail reveal">{deliveryLifecycle.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2,'0')}</span><strong>{step}</strong></div>)}</div></div></section>

    <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Investment model</div><h2>Useful transparency before the sales call.</h2></div><Link className="text-link" to="/pricing">Full pricing approach ↗</Link></div><div className="pricing-band-grid">{pricingBands.map((band) => <article className="pricing-band reveal" key={band.label}><span>{band.label}</span><strong>{band.range}</strong><p>{band.detail}</p></article>)}</div></div></section>
  </>
}
