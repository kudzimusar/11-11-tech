import { useState } from 'react'
import { Link } from '../components/Link'
import { MotionHero } from '../components/MotionHero'
import { SystemField } from '../components/SystemField'
import { SolutionFinder } from '../components/SolutionFinder'
import { PortfolioConstellation } from '../components/PortfolioConstellation'
import { ProjectDialog } from '../components/ProjectDialog'
import { projects, type Project } from '../data/projects'
import { accelerators, capabilities, deliveryLifecycle, pricingBands } from '../data/portfolio'
import { media } from '../lib/media'

export function Home() {
  const [selected, setSelected] = useState<Project | null>(null)
  const openProject = (slug: string) => setSelected(projects.find((project) => project.slug === slug) ?? null)

  return <>
    <section className="media-hero home-v2-hero">
      <MotionHero />
      <div className="wrap media-hero-copy reveal">
        <span className="eyebrow">11-11 Tech · Tokyo · Technology transformation</span>
        <h1>Technology for how modern organizations <span className="soft">actually work.</span></h1>
        <p>UI/UX. Enterprise systems. AI. Software, data and cloud. Transformation. Technology talent. Trust.</p>
        <div className="hero-actions"><Link className="btn primary" to="/capabilities">Explore capabilities ↗</Link><Link className="btn glass" to="/contact">Design my engagement</Link></div>
        <div className="hero-proof" aria-label="Core capabilities">{capabilities.map((capability) => <span key={capability.id}>{capability.shortTitle.toUpperCase()}</span>)}</div>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span />EXPLORE THE SYSTEM</div>
    </section>

    <section className="band"><div className="wrap band-inner"><span className="band-label">11-11 Tech 2.0</span><div className="marquee"><span>Experience</span><i>◆</i><span>Enterprise systems</span><i>◆</i><span>AI implementation</span><i>◆</i><span>Data + cloud</span><i>◆</i><span>Technology talent</span><i>◆</i><span>Trust + assurance</span></div></div></section>

    <section className="section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">What we do</div><h2>Seven practices. Open only what matters to you.</h2></div><p>Every practice expands into a real service catalogue, pricing, proof, outcomes and contracting standards.</p></div>
      <div className="home-capability-grid">{capabilities.map((capability) => <article className="home-capability reveal" key={capability.id}><span>{capability.index} / 07</span><h3>{capability.title}</h3><p>{capability.proposition}</p><div className="home-capability-meta"><strong>{capability.startingAt}</strong><small>starting point</small></div><div className="mini-chip-grid">{capability.services.slice(0,4).map((service) => <span key={service.name}>{service.name}</span>)}</div><Link className="text-link" to={`/capabilities/${capability.id}`}>Open capability ↗</Link></article>)}</div>
    </div></section>

    <section className="section alt-section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">What are you trying to change?</div><h2>Start with your problem, not our jargon.</h2></div><p>The site routes the problem to the most relevant capability, services, price range and proof.</p></div>
      <SolutionFinder />
    </div></section>

    <section className="section system-section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">The system is the product</div><h2>Experience, data, AI, operations and trust move together.</h2></div><p>We do not treat the website, application or AI assistant as an isolated surface. We design the operating relationships underneath.</p></div>
      <SystemField />
    </div></section>

    <section className="section visual-story"><div className="wrap"><div className="visual-story-grid">
      <article className="visual-story-card wide reveal"><img src={media.builders} alt="Technology builders working with spatial prototypes in a Tokyo studio" loading="lazy"/><div className="visual-story-overlay"><span>EXPERIENCE</span><h3>Design the journey. Engineer the interface.</h3><p>UI/UX · design systems · front-end</p></div></article>
      <article className="visual-story-card reveal"><img src={media.systems} alt="Abstract glass infrastructure with blue data signals" loading="lazy"/><div className="visual-story-overlay"><span>SYSTEMS</span><h3>Connect the organization.</h3><p>CRM · DRM · GRM · workflows</p></div></article>
      <article className="visual-story-card reveal"><img src={media.intelligence} alt="Connected intelligence and evidence objects" loading="lazy"/><div className="visual-story-overlay"><span>INTELLIGENCE</span><h3>Put AI inside real work.</h3><p>Agents · RAG · automation · governance</p></div></article>
    </div></div></section>

    <section className="section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">22-project proof system</div><h2>Find work relevant to the problem you have.</h2></div><p>Filter by capability. Each project is evidence attached to the service portfolio, not an isolated gallery item.</p></div>
      <PortfolioConstellation onOpen={openProject} />
      <div className="center-action"><Link className="btn ghost" to="/work">Open full portfolio ↗</Link></div>
    </div></section>

    <section className="section alt-section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">How engagements move</div><h2>Discover → design → build → operate → improve.</h2></div><p>A project can begin with a focused audit and grow only when the next stage is justified.</p></div>
      <div className="lifecycle-rail reveal">{deliveryLifecycle.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2,'0')}</span><strong>{step}</strong></div>)}</div>
      <div className="accelerator-grid">{accelerators.map((accelerator) => <article className="reveal" key={accelerator.name}><span>11-11 ACCELERATOR</span><h3>{accelerator.name}</h3><p>{accelerator.description}</p></article>)}</div>
    </div></section>

    <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Typical investment</div><h2>Useful range before the proposal.</h2></div><Link className="text-link" to="/pricing">Pricing detail ↗</Link></div><div className="pricing-band-grid">{pricingBands.map((band) => <article className="pricing-band reveal" key={band.label}><span>{band.label}</span><strong>{band.range}</strong><p>{band.detail}</p></article>)}</div></div></section>

    <section className="full-bleed-media reveal"><img src={media.global} alt="Connected urban infrastructure spanning global regions" loading="lazy"/><div className="full-bleed-shade" aria-hidden="true"/><div className="wrap full-bleed-copy"><div className="kicker">Tokyo → world</div><h2>Local reality. Global engineering standards.</h2><p>Japan-based, Africa-aware and designed for globally distributed organizations.</p><div className="route-dots"><span>Japan</span><span>Africa</span><span>Europe</span><span>Americas</span><span>Global teams</span></div></div></section>

    <section className="section"><div className="wrap"><div className="trust-strip reveal"><div><span>QUALITY</span><strong>Defined acceptance</strong></div><div><span>CONFIDENTIALITY</span><strong>NDA available</strong></div><div><span>CONTRACTING</span><strong>MSA + SOW</strong></div><div><span>SERVICE</span><strong>SLA options</strong></div><div><span>PROCUREMENT</span><strong>Corporate-ready path</strong></div><Link className="text-link" to="/trust">Trust Center ↗</Link></div></div></section>

    <ProjectDialog project={selected} onClose={() => setSelected(null)} />
  </>
}
