import { useMemo, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { ProjectDialog } from '../components/ProjectDialog'
import { hrefFor } from '../components/Link'
import { ProjectMark } from '../components/ProjectMark'
import { categories, projects, type Project } from '../data/projects'

export function Work() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const visible = useMemo(() => filter === 'All' ? projects : projects.filter((project) => project.category === filter), [filter])

  return <>
    <PageHero index="01" kicker="Portfolio" title={<>One studio. <span className="soft">Many difficult systems.</span></>}>Flagship product work, active builds, prototypes and earlier experiments—presented with their real status rather than flattened into a single “shipped” claim.</PageHero>
    <section className="section"><div className="wrap">
      <div className="feature-split reveal"><div className="feature-media"><img src={hrefFor('/assets/scenes/church-os.svg')} alt="Church OS system visual"/></div><div className="feature-copy"><span className="eyebrow">Flagship system · Global</span><h3>Church OS</h3><p>A multi-surface operating system spanning member journeys, pastoral care, communications, governance, shared AI context, privileged security and corporate/tenant intelligence separation.</p><div className="tags"><span className="tag">Community OS</span><span className="tag">Multi-tenant</span><span className="tag">AI context</span></div><button className="text-link button-link" onClick={() => setSelected(projects.find((project) => project.slug === 'church-os') ?? null)}>Project details</button></div></div>
      <div className="feature-split reverse reveal"><div className="feature-media"><img src={hrefFor('/assets/scenes/morning-pulse.svg')} alt="Morning Pulse media visual"/></div><div className="feature-copy"><span className="eyebrow">Media product · Zimbabwe</span><h3>Morning Pulse</h3><p>An AI-assisted news product pairing interactive news discovery with a professional newsroom workflow, stakeholder management and editorial operations.</p><button className="text-link button-link" onClick={() => setSelected(projects.find((project) => project.slug === 'morning-pulse') ?? null)}>Project details</button></div></div>
      <div className="feature-split reveal"><div className="feature-media"><img src={hrefFor('/assets/scenes/education.svg')} alt="Education software visual"/></div><div className="feature-copy"><span className="eyebrow">Education products · Japan</span><h3>ALT Game Center + learning tools</h3><p>Classroom-first software designed for real teaching constraints: fast moderator controls, keyboard-driven flow, visible scoring, hint systems and reusable language activities.</p><button className="text-link button-link" onClick={() => setSelected(projects.find((project) => project.slug === 'alt-game-center') ?? null)}>Project details</button></div></div>
    </div></section>
    <section className="section"><div className="wrap"><div className="section-head reveal"><div><div className="kicker">Portfolio archive</div><h2>Browse the wider portfolio.</h2></div><p>Filter by product domain, then open any entry for status, focus and a public repository link where one is intentionally available.</p></div>
      <div className="filters reveal" role="group" aria-label="Filter projects">{categories.map((category) => <button key={category} type="button" className={filter === category ? 'active' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>
      <p className="results-count" aria-live="polite">Showing {visible.length} of {projects.length} projects.</p>
      <div className="project-list">{visible.map((project) => <article className="project-row reveal" key={project.slug}><ProjectMark project={project} /><div><h3>{project.name}</h3><p>{project.description}</p><div className="project-tags"><span>{project.category}</span><span>{project.status}</span></div><button className="project-open" type="button" onClick={() => setSelected(project)} aria-label={`View details for ${project.name}`}>View details <span aria-hidden="true">↗</span></button></div><div className="region">{project.region}</div></article>)}</div>
    </div></section>
    <section className="section"><div className="wrap"><div className="manifesto reveal"><blockquote>Professional experience <span className="accent">beyond the studio.</span></blockquote><div className="copy"><p>The founder’s wider experience includes product, talent, training and technology work in Japan and international environments. Where a formal 11-11 Tech commercial client relationship is not established, the site deliberately describes this as professional experience—not as a fabricated client roster.</p><p>That distinction is part of the brand: evidence before theatre.</p></div></div></div></section>
    <ProjectDialog project={selected} onClose={() => setSelected(null)} />
  </>
}
