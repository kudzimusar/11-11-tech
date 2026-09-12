import { useMemo, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { Link } from '../components/Link'
import { capabilities, type CapabilityId } from '../data/portfolio'
import { media } from '../lib/media'

export function Solutions() {
  const [filter, setFilter] = useState<CapabilityId | 'all'>('all')
  const services = useMemo(() => capabilities
    .flatMap((capability) => capability.services.map((service) => ({ capability, service })))
    .filter((item) => filter === 'all' || item.capability.id === filter), [filter])

  return <>
    <PageHero index="03" kicker="Solutions" title={<>Start with what <span className="soft">needs to change.</span></>}>Browse specific IT solutions, then open only the scope that matches your problem.</PageHero>

    <section className="editorial-media solutions-media-v21 reveal"><img src={media.systems} alt="Connected systems moving information between operational layers"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>PROBLEM → SOLUTION → OUTCOME</span><h2>You do not need to know the technical answer before you talk to us.</h2></div></section>

    <section className="section solutions-v21"><div className="wrap">
      <div className="editorial-heading reveal"><div><div className="kicker">Solution catalogue</div><h2>Find the work.</h2></div><p>Filter by capability. Open a row for examples, price and the next step.</p></div>
      <div className="filters solution-filters solution-filter-v21" role="group" aria-label="Filter solutions by capability"><button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>{capabilities.map((capability) => <button key={capability.id} type="button" className={filter === capability.id ? 'active' : ''} onClick={() => setFilter(capability.id)}>{capability.shortTitle}</button>)}</div>
      <div className="solution-index-v21">{services.map(({ capability, service }, index) => <details className="solution-row-v21 reveal" key={`${capability.id}-${service.name}`}>
        <summary><span>{String(index + 1).padStart(2,'0')}</span><small>{capability.shortTitle}</small><strong>{service.name}</strong><b>{service.price}</b><i>+</i></summary>
        <div className="solution-row-body-v21"><div><p>{service.summary}</p><div className="solution-example-line">{service.examples.map((example) => <span key={example}>{example}</span>)}</div></div><div className="inline-actions"><Link className="text-link" to={`/capabilities/${capability.id}`}>See capability ↗</Link><Link className="btn primary" to={`/contact?capability=${capability.id}&service=${encodeURIComponent(service.name)}`}>Start enquiry ↗</Link></div></div>
      </details>)}</div>
    </div></section>
  </>
}
