import { useMemo, useState } from 'react'
import { Link } from '../components/Link'
import { Disclosure } from '../components/Disclosure'
import { CapabilityVisual } from '../components/CapabilityVisual'
import { ProjectDialog } from '../components/ProjectDialog'
import { projects, type Project } from '../data/projects'
import { getCapability, type CapabilityId } from '../data/portfolio'

const commercialProofStatuses = new Set(['Active build', 'Advanced build', 'Client review', 'Product build', 'Pilot readiness', 'In use / evolving'])

export function CapabilityDetail({ capabilityId }: { capabilityId: string }) {
  const capability = getCapability(capabilityId)
  const [selected, setSelected] = useState<Project | null>(null)
  const proof = useMemo(() => capability ? capability.proof.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean) as Project[] : [], [capability])
  const selectedProof = proof.filter((project) => commercialProofStatuses.has(project.status)).slice(0, 4)

  if (!capability) return <section className="page-hero"><div className="wrap"><div className="kicker">Service</div><h1>Service not found.</h1><Link className="btn primary" to="/capabilities">Return to IT services ↗</Link></div></section>

  return <>
    <section className="capability-hero"><div className="wrap capability-hero-grid"><div className="reveal"><div className="kicker">{capability.index} / 07 · IT Service</div><h1>{capability.title}</h1><p className="capability-lede">{capability.proposition}</p><div className="hero-actions"><Link className="btn primary" to={`/contact?capability=${capability.id}`}>Discuss this service ↗</Link><Link className="btn ghost" to="/pricing">See pricing</Link></div></div><CapabilityVisual id={capability.id as CapabilityId}/></div></section>

    <section className="section"><div className="wrap narrative-grid">
      <article className="narrative-card problem reveal"><span>01 / SEE THE PROBLEM</span><h2>When clients usually call us.</h2><p>{capability.problem}</p></article>
      <article className="narrative-card transform reveal"><span>02 / SEE THE TRANSFORMATION</span><h2>What we change.</h2><p>{capability.transformation}</p><div className="before-after"><div><small>BEFORE</small><strong>Fragmented · manual · hard to see</strong></div><i aria-hidden="true">→</i><div><small>AFTER</small><strong>Connected · clear · measurable</strong></div></div></article>
    </div></section>

    <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">03 / How we think about it</div><h2>The visible interface is only one layer.</h2></div><p>We design the relationships between people, workflows, systems, data, controls and outcomes.</p></div><div className="system-thinking-grid reveal">{capability.systemThinking.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2,'0')}</span><strong>{item}</strong></article>)}</div></div></section>

    <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">04 / Services inside this area</div><h2>Open the detailed service catalogue.</h2></div><p>Read the headline first. Open a service when you need examples, pricing and a specific next step.</p></div><div className="service-catalogue">{capability.services.map((service, index) => {
      const serviceProof = service.proof
        .map((slug) => projects.find((item) => item.slug === slug))
        .filter((project): project is Project => project !== undefined)
        .filter((project) => commercialProofStatuses.has(project.status))
      return <Disclosure key={service.name} eyebrow={`${String(index + 1).padStart(2,'0')} / ${capability.shortTitle}`} title={service.name} summary={`${service.summary} · ${service.price}`}>
        <div className="service-detail-grid"><div><h4>Examples</h4><ul className="plain-list">{service.examples.map((example) => <li key={example}>{example}</li>)}</ul></div><div><h4>Indicative investment</h4><strong className="price-big">{service.price}</strong><p>Final pricing depends on scope, integrations, data, timeline and delivery requirements.</p></div><div><h4>Supporting evidence</h4>{serviceProof.length ? <div className="proof-links">{serviceProof.map((project) => <button type="button" key={project.slug} onClick={() => setSelected(project)}>{project.name} ↗</button>)}</div> : <p>Relevant prototype or Lab evidence can be discussed during discovery without presenting it as a finished client deployment.</p>}</div></div>
        <Link className="btn primary" to={`/contact?capability=${capability.id}&service=${encodeURIComponent(service.name)}`}>Discuss {service.name} ↗</Link>
      </Disclosure>
    })}</div></div></section>

    <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">05 / Outcomes</div><h2>What changes for your organization.</h2></div><p>Technology is useful only when it changes the way people work, decide, serve or grow.</p></div><div className="outcome-grid">{capability.outcomes.map((outcome, index) => <article className="reveal" key={outcome}><span>{String(index + 1).padStart(2,'0')}</span><h3>{outcome}</h3></article>)}</div></div></section>

    <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">06 / Selected evidence</div><h2>Proof supports the service story.</h2></div><Link className="text-link" to="/work">Browse selected work by industry ↗</Link></div>{selectedProof.length ? <div className="proof-project-grid">{selectedProof.map((project) => <button className="proof-project reveal" type="button" key={project.slug} onClick={() => setSelected(project)}><span>{project.category} · {project.status}</span><h3>{project.name}</h3><p>{project.description}</p><b>Why it is relevant ↗</b></button>)}</div> : <div className="proof-explainer reveal"><div><h2>Evidence is available during discovery.</h2></div><p>This service area currently relies more heavily on advisory experience, reusable methods or Lab work than on public named case studies. We keep that distinction explicit.</p></div>}</div></section>

    <section className="section assurance-section"><div className="wrap assurance-grid"><div className="reveal"><div className="kicker">07 / Delivery & assurance</div><h2>Commercial clarity is part of the service.</h2><p>Confidentiality, quality, acceptance and support are discussed alongside implementation—not after the work becomes complicated.</p><Link className="text-link" to="/trust">View Trust & Contracting Standards ↗</Link></div><div className="assurance-list reveal">{capability.assurance.map((item) => <div key={item}><span>✓</span><p>{item}</p></div>)}</div></div></section>

    <section className="section"><div className="wrap investment-callout reveal"><div><div className="kicker">Typical investment</div><h2>{capability.typicalRange}</h2><p>Most engagements start with a defined discovery, improvement or implementation scope. Larger, multi-system or ongoing programmes are priced separately.</p></div><div><Link className="btn primary" to={`/contact?capability=${capability.id}`}>Get a scoped proposal ↗</Link><Link className="btn ghost" to="/pricing">How pricing works</Link></div></div></section>
    <ProjectDialog project={selected} onClose={() => setSelected(null)} />
  </>
}
