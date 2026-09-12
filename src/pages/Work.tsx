import { useState } from 'react'
import { PageHero } from '../components/PageHero'
import { ProjectDialog } from '../components/ProjectDialog'
import { ProjectMark } from '../components/ProjectMark'
import { Link } from '../components/Link'
import { projects, type Project } from '../data/projects'
import { capabilities, industries } from '../data/portfolio'
import { industryMedia, media } from '../lib/media'

const selectedStatuses = new Set(['Active build', 'Advanced build', 'Client review', 'Product build', 'Pilot readiness', 'In use / evolving'])
const selectedWork = projects.filter((project) => selectedStatuses.has(project.status))
const labWork = projects.filter((project) => !selectedStatuses.has(project.status))

export function Work() {
  const [selected, setSelected] = useState<Project | null>(null)

  return <>
    <PageHero index="01" kicker="Selected Work" title={<>Experience across industries, <span className="soft">not a wall of project names.</span></>}>Our public work section is organized around the industries and technology problems clients recognize. Product names are supporting evidence, and experiments are kept separate from stronger commercial proof.</PageHero>

    <section className="editorial-media reveal"><img src={media.abstractEditorial} alt="Sculptural forms representing people, data and connected systems"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>INDUSTRY → CAPABILITY → EVIDENCE</span><h2>Start with the kind of organization or problem you have.</h2></div></section>

    <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Browse by industry</div><h2>Where our experience is relevant.</h2></div><p>Each industry connects to the services that matter there. Supporting projects stay behind the industry story until a buyer chooses to inspect them.</p></div><div className="work-industry-grid work-industry-grid-v22">{industries.map((industry) => <article className="work-industry-card work-industry-card-v22 reveal" key={industry.id}><figure><img src={industryMedia[industry.id as keyof typeof industryMedia]} alt={`${industry.name} technology environment`} loading="lazy"/></figure><span>{industry.name}</span><h3>{industry.summary}</h3><div className="industry-capabilities">{industry.capabilities.slice(0,4).map((id) => { const capability = capabilities.find((item) => item.id === id); return capability ? <Link key={id} to={`/capabilities/${id}`}>{capability.shortTitle}</Link> : null })}</div><details><summary>Selected evidence</summary><div className="proof-logo-rail">{industry.projects.map((slug) => { const project = selectedWork.find((item) => item.slug === slug); return project ? <button type="button" key={slug} onClick={() => setSelected(project)}><strong>{project.name}</strong><small>{project.status}</small></button> : null })}</div></details></article>)}</div></div></section>

    <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Selected technology work</div><h2>Proof we are comfortable putting in front of a serious buyer.</h2></div><p>These entries are still labelled by their real maturity. A current build, pilot-ready product and client-review implementation are not described as the same thing.</p></div><div className="selected-proof-rail">{selectedWork.map((project) => <button className="proof-logo-card reveal" type="button" key={project.slug} onClick={() => setSelected(project)} aria-label={`View selected evidence for ${project.name}`}><ProjectMark project={project}/><span>{project.category}</span><strong>{project.name}</strong><small>{project.status}</small></button>)}</div></div></section>

    <section className="section"><div className="wrap"><div className="lab-boundary reveal"><div><div className="kicker">11-11 Lab boundary</div><h2>Experiments and prototypes are useful R&D, not client claims.</h2><p>We deliberately separate early product exploration from the selected work above. This protects the meaning of our commercial proof while still showing the breadth of technology being explored.</p></div><details className="lab-projects"><summary>Explore {labWork.length} Lab / prototype initiatives</summary><div className="lab-mini-grid">{labWork.map((project) => <button type="button" key={project.slug} onClick={() => setSelected(project)}><strong>{project.name}</strong><span>{project.category}</span><small>{project.status}</small></button>)}</div></details></div></div></section>

    <section className="full-bleed-media compact-media reveal"><img src={media.crossCulture} alt="International technology team collaborating around digital systems" loading="lazy"/><div className="full-bleed-shade"/><div className="wrap full-bleed-copy"><div className="kicker">Proof without theatre</div><h2>What matters is the capability a project demonstrates and how that learning transfers to the next client problem.</h2><p>Ask us for the most relevant evidence for your industry, system or service.</p></div></section>
    <ProjectDialog project={selected} onClose={() => setSelected(null)} />
  </>
}
