import { useMemo, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { ProjectDialog } from '../components/ProjectDialog'
import { ProjectMark } from '../components/ProjectMark'
import { categories, projects, type Project } from '../data/projects'
import { media } from '../lib/media'

export function Work() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const visible = useMemo(() => filter === 'All' ? projects : projects.filter((project) => project.category === filter), [filter])
  const open = (slug: string) => setSelected(projects.find((project) => project.slug === slug) ?? null)

  return <>
    <PageHero index="01" kicker="Portfolio" title={<>Products with <span className="soft">operational gravity.</span></>}>Mobility, media, community, education and marketplace systems—shown with their real maturity and operating context.</PageHero>

    <section className="editorial-media reveal"><img src={media.intelligence} alt="Connected product intelligence objects in a dark spatial system"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>11-11 / PRODUCT SYSTEMS</span><h2>Interfaces are only the visible layer.</h2></div></section>

    <section className="section"><div className="wrap"><div className="media-cases featured-work">
      <button className="media-case project-media-card reveal" type="button" onClick={() => open('church-os')}><img src={media.systems} alt="Layered systems infrastructure" loading="lazy"/><div className="media-case-copy"><span>Community OS · Global</span><h3>Church OS</h3><p>Governance, shared context and multi-surface operations.</p><b>Open project ↗</b></div></button>
      <button className="media-case project-media-card reveal" type="button" onClick={() => open('morning-pulse')}><img src={media.global} alt="Connected nighttime information infrastructure" loading="lazy"/><div className="media-case-copy"><span>Media · Zimbabwe</span><h3>Morning Pulse</h3><p>AI-assisted news discovery and newsroom operations.</p><b>Open project ↗</b></div></button>
      <button className="media-case project-media-card reveal" type="button" onClick={() => open('alt-game-center')}><img src={media.builders} alt="Human-centered technology studio" loading="lazy"/><div className="media-case-copy"><span>Education · Japan</span><h3>ALT Game Center</h3><p>Classroom software built for real moderator constraints.</p><b>Open project ↗</b></div></button>
    </div></div></section>

    <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Portfolio archive</div><h2>Explore the wider system map.</h2></div><p>Filter by domain. Open an entry when you want the implementation detail.</p></div>
      <div className="filters reveal" role="group" aria-label="Filter projects">{categories.map((category) => <button key={category} type="button" className={filter === category ? 'active' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>
      <p className="results-count" aria-live="polite">Showing {visible.length} of {projects.length} projects.</p>
      <div className="project-mosaic">{visible.map((project) => <article className="project-tile reveal" key={project.slug}><ProjectMark project={project} /><div className="project-tile-copy"><span>{project.category} · {project.region}</span><h3>{project.name}</h3><small>{project.status}</small><button className="project-open" type="button" onClick={() => setSelected(project)} aria-label={`View details for ${project.name}`}>View details <span aria-hidden="true">↗</span></button></div></article>)}</div>
    </div></section>

    <section className="full-bleed-media compact-media reveal"><img src={media.systems} alt="Blue signal paths moving through transparent infrastructure" loading="lazy"/><div className="full-bleed-shade"/><div className="wrap full-bleed-copy"><div className="kicker">Evidence before theatre</div><h2>Prototype, pilot and production are different states.</h2><p>We label them that way.</p></div></section>
    <ProjectDialog project={selected} onClose={() => setSelected(null)} />
  </>
}
