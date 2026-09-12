import { useMemo, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { ProjectDialog } from '../components/ProjectDialog'
import { ProjectMark } from '../components/ProjectMark'
import { PortfolioConstellation } from '../components/PortfolioConstellation'
import { projects, type Project } from '../data/projects'
import { projectTaxonomy } from '../data/projectTaxonomy'
import { capabilities, type CapabilityId } from '../data/portfolio'
import { media } from '../lib/media'

export function Work() {
  const [filter, setFilter] = useState<CapabilityId | 'all'>('all')
  const [selected, setSelected] = useState<Project | null>(null)
  const visible = useMemo(() => projects.filter((project) => filter === 'all' || projectTaxonomy[project.slug]?.capabilities.includes(filter)), [filter])
  const open = (slug: string) => setSelected(projects.find((project) => project.slug === slug) ?? null)

  return <>
    <PageHero index="01" kicker="Work · Proof Center" title={<>22 projects. <span className="soft">One connected body of technology evidence.</span></>}>Browse the portfolio by the capability you need. Product status remains explicit: experiment, prototype, pilot, active build and client review are not presented as the same thing.</PageHero>

    <section className="editorial-media reveal"><img src={media.intelligence} alt="Connected product intelligence objects in a dark spatial system"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>CAPABILITY → PROOF → TRANSFERABILITY</span><h2>Find the work that helps answer your question.</h2></div></section>

    <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Portfolio constellation</div><h2>See how the projects connect.</h2></div><p>Select a capability and the relevant technology initiatives come forward.</p></div><PortfolioConstellation onOpen={open}/></div></section>

    <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Proof archive</div><h2>Filter by commercial capability.</h2></div><p>Open any project for its current maturity, focus and source information.</p></div>
      <div className="filters reveal" role="group" aria-label="Filter projects by capability"><button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All 22</button>{capabilities.map((capability) => <button key={capability.id} type="button" className={filter === capability.id ? 'active' : ''} onClick={() => setFilter(capability.id)}>{capability.shortTitle}</button>)}</div>
      <p className="results-count" aria-live="polite">Showing {visible.length} of {projects.length} projects.</p>
      <div className="project-mosaic">{visible.map((project) => { const meta = projectTaxonomy[project.slug]; return <article className="project-tile reveal" key={project.slug}><ProjectMark project={project}/><div className="project-tile-copy"><span>{project.category} · {project.region}</span><h3>{project.name}</h3><small>{project.status}</small>{meta && <div className="project-proof-tags">{meta.capabilities.slice(0,3).map((id) => <b key={id}>{capabilities.find((item) => item.id === id)?.shortTitle}</b>)}</div>}<button className="project-open" type="button" onClick={() => setSelected(project)} aria-label={`View details for ${project.name}`}>View proof <span aria-hidden="true">↗</span></button></div></article> })}</div>
    </div></section>

    <section className="section"><div className="wrap"><div className="proof-explainer reveal"><div><div className="kicker">How to read this portfolio</div><h2>Product work is evidence, not a claim that every project was a paid client engagement.</h2></div><p>11-11 Tech separates internal product work, prototypes, experiments, active builds and client-review work. The value for a buyer is the engineering pattern, product thinking and transferable capability demonstrated by the work.</p></div></div></section>

    <section className="full-bleed-media compact-media reveal"><img src={media.systems} alt="Blue signal paths moving through transparent infrastructure" loading="lazy"/><div className="full-bleed-shade"/><div className="wrap full-bleed-copy"><div className="kicker">Evidence before theatre</div><h2>Prototype, pilot and production are different states.</h2><p>We label them that way—and connect what we learned to the next client problem.</p></div></section>
    <ProjectDialog project={selected} onClose={() => setSelected(null)} />
  </>
}
