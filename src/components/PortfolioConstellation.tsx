import { useMemo, useState } from 'react'
import { projects } from '../data/projects'
import { projectTaxonomy } from '../data/projectTaxonomy'
import { capabilities } from '../data/portfolio'

export function PortfolioConstellation({ onOpen }: { onOpen?: (slug: string) => void }) {
  const [capability, setCapability] = useState<string>('all')
  const visible = useMemo(() => projects.filter((project) => capability === 'all' || projectTaxonomy[project.slug]?.capabilities.includes(capability as never)), [capability])

  return <div className="constellation reveal">
    <div className="constellation-controls" role="group" aria-label="Filter portfolio by capability">
      <button type="button" className={capability === 'all' ? 'active' : ''} onClick={() => setCapability('all')}>All 22</button>
      {capabilities.map((item) => <button type="button" key={item.id} className={capability === item.id ? 'active' : ''} onClick={() => setCapability(item.id)}>{item.shortTitle}</button>)}
    </div>
    <div className="constellation-stage" aria-live="polite">
      {visible.map((project, index) => {
        const meta = projectTaxonomy[project.slug]
        return <button key={project.slug} type="button" className="constellation-node" onClick={() => onOpen?.(project.slug)} aria-label={`Explore ${project.name}`}>
          <span className="node-index">{String(index + 1).padStart(2, '0')}</span>
          <strong>{project.name}</strong>
          <small>{meta?.capabilities.slice(0,2).map((id) => capabilities.find((item) => item.id === id)?.shortTitle).filter(Boolean).join(' · ') || project.category}</small>
        </button>
      })}
    </div>
  </div>
}
