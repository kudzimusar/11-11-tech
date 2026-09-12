import { useMemo, useState } from 'react'
import { Link } from '../components/Link'
import { MotionHero } from '../components/MotionHero'
import { CapabilityVisual } from '../components/CapabilityVisual'
import { SolutionFinder } from '../components/SolutionFinder'
import { capabilities, deliveryLifecycle, industries, type CapabilityId } from '../data/portfolio'
import { capabilityMedia, industryMedia, media } from '../lib/media'

const capabilityLabels: Record<CapabilityId, string> = {
  'ui-ux': 'UI/UX & Front-End',
  enterprise: 'CRM & Business Systems',
  ai: 'AI & Automation',
  'software-data-cloud': 'Software, Data & Cloud',
  transformation: 'Digital Transformation',
  talent: 'IT Recruitment',
  trust: 'Security, QA & Trust',
}

const heroDisciplines = ['UI/UX', 'AI', 'CRM', 'Software', 'Cloud', 'Talent'] as const

const visualStories = [
  {
    label: 'DESIGN',
    title: 'Interfaces that explain themselves.',
    detail: 'Audit · redesign · design systems · front-end engineering',
    image: media.uiUxEditorial,
    alt: 'Editorial composition of digital interfaces across laptop, tablet and mobile devices',
    to: '/capabilities/ui-ux',
  },
  {
    label: 'SYSTEMS',
    title: 'Relationships and workflows in one view.',
    detail: 'CRM · portals · operations · integrations',
    image: media.crmEditorial,
    alt: 'Operations professional working with relationship and workflow systems',
    to: '/capabilities/enterprise',
  },
  {
    label: 'INTELLIGENCE',
    title: 'AI connected to real work.',
    detail: 'Agents · assistants · RAG · automation',
    image: media.aiEditorial,
    alt: 'Professional knowledge worker using AI with documents and human review',
    to: '/capabilities/ai',
  },
] as const

export function Home() {
  const [activeCapability, setActiveCapability] = useState<CapabilityId>('ui-ux')
  const selected = useMemo(() => capabilities.find((item) => item.id === activeCapability) ?? capabilities[0], [activeCapability])
  const selectedImage = capabilityMedia[selected.id]

  return <>
    <section className="media-hero home-v21-hero">
      <MotionHero />
      <div className="wrap media-hero-copy reveal">
        <span className="eyebrow">11-11 Tech · IT Services</span>
        <h1>Technology that makes <span className="soft">business work better.</span></h1>
        <p className="home-v21-deck">We design, build and improve the digital systems organizations depend on.</p>
        <div className="hero-actions"><Link className="btn primary" to="/contact">Start a project ↗</Link><Link className="btn text-button" to="/capabilities">Explore services</Link></div>
        <div className="hero-discipline-line" aria-label="Core IT services">{heroDisciplines.map((item) => <span key={item}>{item}</span>)}</div>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span />EXPLORE</div>
    </section>

    <section className="section editorial-light home-human-intro-v22"><div className="wrap">
      <div className="human-intro-grid-v22 reveal">
        <div className="human-intro-copy-v22"><span className="kicker">People · places · systems</span><h2>Technology has to fit the world where people actually use it.</h2><p>International perspective, local context and practical engineering in the same engagement.</p></div>
        <figure className="human-intro-main-v22"><img src={media.crossCulture} alt="Japanese and African technology professionals collaborating in a modern studio" loading="lazy"/><figcaption>Cross-cultural product thinking</figcaption></figure>
        <div className="human-intro-pair-v22">
          <figure><img src={media.tokyoBusiness} alt="Contemporary Tokyo technology and business environment" loading="lazy"/><figcaption>Tokyo · precision</figcaption></figure>
          <figure><img src={media.harareBusiness} alt="Contemporary Harare technology and business environment" loading="lazy"/><figcaption>Harare · adaptability</figcaption></figure>
        </div>
      </div>
    </div></section>

    <section className="section home-service-theatre" id="services"><div className="wrap">
      <div className="editorial-heading reveal"><div><span className="kicker">What we do</span><h2>Choose a capability.</h2></div><Link className="text-link" to="/capabilities">View every service ↗</Link></div>
      <div className="service-theatre reveal">
        <div className="service-theatre-tabs" role="tablist" aria-label="11-11 Tech capabilities">
          {capabilities.map((capability) => <button
            type="button"
            role="tab"
            aria-selected={activeCapability === capability.id}
            className={activeCapability === capability.id ? 'active' : ''}
            onClick={() => setActiveCapability(capability.id)}
            key={capability.id}
          ><span>{capability.index}</span><strong>{capabilityLabels[capability.id]}</strong></button>)}
        </div>
        <div className="service-theatre-copy" role="tabpanel">
          <div className="service-theatre-meta"><span>{selected.title}</span><strong>{selected.typicalRange}</strong></div>
          <h3>{selected.proposition}</h3>
          <div className="service-theatre-list">{selected.services.slice(0, 5).map((service) => <span key={service.name}>{service.name}</span>)}</div>
          <Link className="text-link" to={`/capabilities/${selected.id}`}>See process, examples & pricing ↗</Link>
        </div>
        <div className={`service-theatre-stage-v22 capability-${selected.id}`}>
          <img key={selected.id} className="service-theatre-photo-v22" src={selectedImage} alt={`${selected.shortTitle} editorial service scene`} loading="lazy" />
          <div className="service-theatre-visual-v22"><CapabilityVisual id={selected.id} /></div>
        </div>
      </div>
    </div></section>

    <section className="section visual-story-v21"><div className="wrap">
      <div className="visual-story-v21-grid">
        {visualStories.map((story) => <Link className="visual-story-v21-card reveal" to={story.to} key={story.label}>
          <img src={story.image} alt={story.alt} loading="lazy" />
          <div className="visual-story-v21-shade" aria-hidden="true" />
          <div className="visual-story-v21-copy"><span>{story.label}</span><h3>{story.title}</h3><p>{story.detail}</p><b>Explore ↗</b></div>
        </Link>)}
      </div>
    </div></section>

    <section className="section decision-lab"><div className="wrap">
      <div className="editorial-heading reveal"><div><span className="kicker">Not sure what to ask for?</span><h2>Start with the problem.</h2></div><p>Pick the outcome you need. We will route you to the right service.</p></div>
      <SolutionFinder />
    </div></section>

    <section className="section editorial-light industries-v21"><div className="wrap">
      <div className="editorial-heading light-heading reveal"><div><span className="kicker">Industries</span><h2>Built for your environment.</h2></div><Link className="text-link dark-link" to="/work">Selected work ↗</Link></div>
      <div className="industry-photo-ribbon-v22 reveal" aria-label="Industries served">
        {industries.map((industry) => <Link to={`/industries#${industry.id}`} className="industry-photo-v22" key={industry.id}>
          <img src={industryMedia[industry.id as keyof typeof industryMedia]} alt={`${industry.name} editorial scene`} loading="lazy"/>
          <span>{industry.name}</span>
        </Link>)}
      </div>
      <div className="industry-index-v21">
        {industries.map((industry, index) => <Link className="industry-row-v21 reveal" to={`/industries#${industry.id}`} key={industry.id}>
          <span className="industry-row-number">{String(index + 1).padStart(2, '0')}</span>
          <strong>{industry.name}</strong>
          <div>{industry.capabilities.slice(0, 3).map((id) => { const cap = capabilities.find((item) => item.id === id); return cap ? <span key={id}>{cap.shortTitle}</span> : null })}</div>
          <b>↗</b>
        </Link>)}
      </div>
    </div></section>

    <section className="full-bleed-media home-global-pause reveal"><img src={media.globalBridge} alt="Editorial composition connecting Tokyo and contemporary African business environments" loading="lazy"/><div className="full-bleed-shade" aria-hidden="true"/><div className="wrap full-bleed-copy"><div className="kicker">Tokyo → world</div><h2>Tokyo-built. Africa-aware. Global by design.</h2></div></section>

    <section className="section commercial-snapshot"><div className="wrap">
      <div className="commercial-snapshot-grid reveal">
        <article><span className="kicker">How we work</span><div className="method-line-v21">{deliveryLifecycle.map((step, index) => <span key={step}><small>{String(index + 1).padStart(2, '0')}</small>{step}</span>)}</div><Link className="text-link" to="/method">Delivery method ↗</Link></article>
        <article><span className="kicker">Typical investment</span><strong className="commercial-big">From $2,000</strong><p>Most defined projects sit between $2,000 and $10,000. Enterprise work is custom.</p><Link className="text-link" to="/pricing">See pricing ↗</Link></article>
        <article><span className="kicker">Corporate-ready</span><div className="trust-word-list"><span>NDA</span><span>MSA + SOW</span><span>SLA options</span><span>QA + UAT</span></div><Link className="text-link" to="/trust">Trust & contracting ↗</Link></article>
      </div>
    </div></section>

    <section className="section closing-choice closing-choice-v22"><div className="wrap closing-choice-grid reveal"><div><span className="kicker">Start here</span><h2>What needs to work better?</h2></div><div><p>Tell us the business problem. We will help define the right technology response.</p><div className="hero-actions"><Link className="btn primary" to="/contact">Scope my project ↗</Link><Link className="btn ghost" to="/solutions">Explore solutions</Link></div></div></div></section>
  </>
}
