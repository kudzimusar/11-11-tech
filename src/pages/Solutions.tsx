import { useMemo, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { Link } from '../components/Link'
import { capabilities, type CapabilityId } from '../data/portfolio'

export function Solutions() {
  const [filter, setFilter] = useState<CapabilityId | 'all'>('all')
  const services = useMemo(() => capabilities.flatMap((capability) => capability.services.map((service) => ({ capability, service }))).filter((item) => filter === 'all' || item.capability.id === filter), [filter])
  return <>
    <PageHero index="03" kicker="Solutions" title={<>Start with the <span className="soft">problem you need solved.</span></>}>A client should not need to know our internal structure before finding the right engagement. Browse specific solutions, then trace them back to capability, proof, pricing and delivery.</PageHero>
    <section className="section"><div className="wrap">
      <div className="filters solution-filters" role="group" aria-label="Filter solutions by capability"><button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All solutions</button>{capabilities.map((capability) => <button key={capability.id} type="button" className={filter === capability.id ? 'active' : ''} onClick={() => setFilter(capability.id)}>{capability.shortTitle}</button>)}</div>
      <div className="solution-catalogue-grid">{services.map(({ capability, service }) => <article className="solution-card reveal" key={`${capability.id}-${service.name}`}><span>{capability.shortTitle}</span><h2>{service.name}</h2><p>{service.summary}</p><div className="solution-card-meta"><strong>{service.price}</strong><small>{service.examples.slice(0,3).join(' · ')}</small></div><div className="inline-actions"><Link className="text-link" to={`/capabilities/${capability.id}`}>Explore capability ↗</Link><Link className="text-link" to={`/contact?capability=${capability.id}&service=${encodeURIComponent(service.name)}`}>Start enquiry ↗</Link></div></article>)}</div>
    </div></section>
  </>
}
