import { useMemo, useState } from 'react'
import { businessOutcomes, capabilities } from '../data/portfolio'
import { Link } from './Link'

export function SolutionFinder() {
  const [selected, setSelected] = useState(businessOutcomes[0].id)
  const outcome = businessOutcomes.find((item) => item.id === selected) ?? businessOutcomes[0]
  const matches = useMemo(() => capabilities.filter((capability) => outcome.capabilityIds.includes(capability.id)), [outcome])

  return <div className="solution-finder reveal">
    <div className="finder-options" role="list" aria-label="Business outcomes">
      {businessOutcomes.map((item) => <button key={item.id} type="button" className={item.id === selected ? 'active' : ''} onClick={() => setSelected(item.id)}>{item.label}</button>)}
    </div>
    <div className="finder-result" aria-live="polite">
      <span className="kicker">Recommended direction</span>
      <h3>{matches.map((item) => item.shortTitle).join(' + ')}</h3>
      <p>{matches[0]?.proposition}</p>
      <div className="finder-result-grid">
        {matches.map((capability) => <article key={capability.id}><strong>{capability.title}</strong><span>{capability.typicalRange}</span><small>{capability.services.slice(0,3).map((service) => service.name).join(' · ')}</small><Link className="text-link" to={`/capabilities/${capability.id}`}>Explore capability ↗</Link></article>)}
      </div>
      <Link className="btn primary" to={`/contact?outcome=${encodeURIComponent(outcome.id)}&capability=${matches[0]?.id ?? ''}`}>Design my engagement ↗</Link>
    </div>
  </div>
}
