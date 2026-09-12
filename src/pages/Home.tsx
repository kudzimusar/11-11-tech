import { Link } from '../components/Link'
import { MotionHero } from '../components/MotionHero'
import { SolutionFinder } from '../components/SolutionFinder'
import { BuyerPaths } from '../components/BuyerPaths'
import { capabilities, deliveryLifecycle, industries, pricingBands } from '../data/portfolio'
import { media } from '../lib/media'

const serviceHighlights = [
  { title: 'UI/UX Design & Front-End Development', text: 'Redesign applications, websites, dashboards and enterprise interfaces so they are clearer, faster, accessible and easier to use.', route: '/capabilities/ui-ux', items: ['UX audits', 'Application redesign', 'Design systems', 'React front-end', 'Mobile UX'] },
  { title: 'AI & Automation', text: 'Put AI into real business work through agents, assistants, RAG knowledge systems, chatbots, document intelligence and automation.', route: '/capabilities/ai', items: ['AI agents', 'Custom assistants', 'RAG', 'Chatbots', 'Workflow automation'] },
  { title: 'CRM & Business Systems', text: 'Connect customers, donors, dealers, members, partners, staff and operational workflows in one dependable business system.', route: '/capabilities/enterprise', items: ['CRM', 'DRM', 'GRM', 'Case management', 'Portals'] },
  { title: 'Software & App Development', text: 'Build web applications, mobile/PWA products, SaaS platforms, marketplaces, portals and internal business software.', route: '/capabilities/software-data-cloud', items: ['Web apps', 'Mobile/PWA', 'SaaS', 'Marketplaces', 'Internal tools'] },
  { title: 'Data, Cloud & Integrations', text: 'Connect systems, improve data structures, build APIs, automate deployments and create reliable reporting and cloud operations.', route: '/capabilities/software-data-cloud', items: ['APIs', 'Databases', 'Dashboards', 'Cloud', 'CI/CD'] },
  { title: 'Digital Transformation & IT Consulting', text: 'Work out what should change before buying more technology: audit systems, redesign processes, create roadmaps and guide implementation.', route: '/capabilities/transformation', items: ['Technology audit', 'Process redesign', 'Roadmaps', 'Fractional CTO', 'Training'] },
  { title: 'IT Recruitment & Technical Teams', text: 'Find and assess engineers, AI/data specialists, UX professionals, product talent and other technology roles.', route: '/capabilities/talent', items: ['IT recruitment', 'RPO', 'Technical screening', 'Talent mapping', 'Team build'] },
  { title: 'Security, QA & Trust', text: 'Make digital systems safer and more dependable through permissions, privacy, verification, testing, UAT and release assurance.', route: '/capabilities/trust', items: ['Identity & access', 'Verification', 'QA', 'UAT', 'Release assurance'] },
]

const starterOffers = [
  ['UX / UI Audit', 'From $2,000', '/capabilities/ui-ux'],
  ['AI Opportunity Assessment', 'From $2,000', '/capabilities/ai'],
  ['CRM / Systems Discovery', 'From $2,000', '/capabilities/enterprise'],
  ['Application Redesign', '$3,500–$6,500', '/capabilities/ui-ux'],
  ['AI Implementation', '$4,000–$10,000', '/capabilities/ai'],
  ['Software / Business System Build', '$5,000–$10,000+', '/capabilities/software-data-cloud'],
] as const

const reasons = [
  ['Design + engineering together', 'We can move from user journey and interface design into the production front end instead of handing the work between disconnected teams.'],
  ['Business systems, not just websites', 'CRM, workflows, portals, AI, data and operational software are part of the same technology portfolio.'],
  ['AI tied to real work', 'AI implementation is connected to approved data, tools, human controls, evaluation and measurable business workflows.'],
  ['Clear commercial starting points', 'Indicative pricing, delivery stages, quality expectations and procurement information are visible before a proposal.'],
  ['Cross-market product thinking', 'Tokyo operating discipline combines with Africa-aware and globally distributed product context.'],
  ['Truthful proof', 'Experiments, active builds and client-review work are not presented as if they were all finished client deployments.'],
] as const

export function Home() {
  return <>
    <section className="media-hero home-v2-hero home-commercial-hero">
      <MotionHero />
      <div className="wrap media-hero-copy reveal">
        <span className="eyebrow">11-11 Tech · IT Services & Technology Implementation</span>
        <h1>UI/UX, AI, CRM and software engineering <span className="soft">for organizations ready to work better.</span></h1>
        <p className="hero-definition"><strong>11-11 Tech is a technology services company.</strong> We design better digital experiences, build business systems, implement AI and automation, modernize software and help organizations assemble the technical teams needed to run them.</p>
        <div className="hero-actions"><Link className="btn primary" to="/capabilities">Explore IT services ↗</Link><Link className="btn glass" to="/contact">Tell us what you need</Link></div>
        <div className="hero-service-rail" aria-label="11-11 Tech services"><span>UI/UX</span><span>AI & Automation</span><span>CRM</span><span>Software</span><span>Data & Cloud</span><span>Transformation</span><span>IT Recruitment</span><span>Security & QA</span></div>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span />SEE WHAT WE DO</div>
    </section>

    <section className="definition-band"><div className="wrap definition-band-grid reveal"><div><span className="kicker">What is 11-11 Tech?</span><h2>A practical IT partner from strategy and design through implementation and improvement.</h2></div><p>Come to us when an application is difficult to use, a company wants AI, a CRM no longer fits, systems do not connect, manual work is slowing teams down, software needs rebuilding, or a technology team needs strengthening.</p></div></section>

    <section className="section" id="services"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">IT services</div><h2>What you can hire us to do.</h2></div><p>No hidden terminology. Open a service to see the process, detailed offer list, examples, outcomes, pricing and delivery standards.</p></div>
      <div className="plain-service-grid">{serviceHighlights.map((service, index) => <article className="plain-service-card reveal" key={service.title}><span>{String(index + 1).padStart(2,'0')}</span><h3>{service.title}</h3><p>{service.text}</p><div className="mini-chip-grid">{service.items.map((item) => <span key={item}>{item}</span>)}</div><Link className="text-link" to={service.route}>Services, process & pricing ↗</Link></article>)}</div>
    </div></section>

    <section className="section alt-section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">Not sure which service?</div><h2>Start with the business problem.</h2></div><p>Choose what is going wrong or what you want to improve. We will show the most relevant service, likely approach and starting investment.</p></div>
      <SolutionFinder />
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">Industries</div><h2>Technology shaped around the environment where it has to work.</h2></div><p>We market the capability through the client's industry first. Product names sit behind this layer as supporting evidence, not as the company story.</p></div>
      <div className="home-industry-grid">{industries.map((industry) => <article className="home-industry-card reveal" key={industry.id}><span>{industry.name}</span><h3>{industry.summary}</h3><div className="industry-capabilities">{industry.capabilities.slice(0,4).map((id) => { const capability = capabilities.find((item) => item.id === id); return capability ? <Link key={id} to={`/capabilities/${id}`}>{capability.shortTitle}</Link> : null })}</div><Link className="text-link" to={`/industries#${industry.id}`}>Explore {industry.name} ↗</Link></article>)}</div>
      <div className="center-action"><Link className="btn ghost" to="/industries">View all industries</Link></div>
    </div></section>

    <section className="section visual-story"><div className="wrap"><div className="visual-story-grid">
      <article className="visual-story-card wide reveal"><img src={media.builders} alt="Technology builders working with spatial prototypes in a Tokyo studio" loading="lazy"/><div className="visual-story-overlay"><span>UI/UX + FRONT-END</span><h3>See the problem. Redesign the journey. Engineer the interface.</h3><p>Audit · prototype · design system · production front end</p></div></article>
      <article className="visual-story-card reveal"><img src={media.systems} alt="Abstract glass infrastructure with blue data signals" loading="lazy"/><div className="visual-story-overlay"><span>CRM + SYSTEMS</span><h3>Turn disconnected work into one operating flow.</h3><p>People · relationships · workflow · reporting</p></div></article>
      <article className="visual-story-card reveal"><img src={media.intelligence} alt="Connected intelligence and evidence objects" loading="lazy"/><div className="visual-story-overlay"><span>AI + AUTOMATION</span><h3>Give AI approved knowledge, tools and human boundaries.</h3><p>Agents · RAG · documents · automation</p></div></article>
    </div></div></section>

    <section className="section alt-section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">How we work</div><h2>From unclear problem to working technology.</h2></div><p>Clients can start small with an audit or discovery engagement and continue only when the next stage is justified.</p></div>
      <div className="lifecycle-rail reveal">{deliveryLifecycle.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2,'0')}</span><strong>{step}</strong></div>)}</div>
      <div className="approach-explainer reveal"><strong>Our approach:</strong><span>understand the business problem</span><i>→</i><span>design the user and system journey</span><i>→</i><span>implement</span><i>→</i><span>test and launch</span><i>→</i><span>operate and improve</span></div>
      <div className="center-action"><Link className="btn ghost" to="/method">See the delivery method ↗</Link></div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">Typical investment</div><h2>Know the likely range before you contact us.</h2></div><p>Most engagements begin between US$2,000 and US$10,000. Larger or multi-system work is custom-scoped.</p></div>
      <div className="starter-offer-grid">{starterOffers.map(([name, price, route]) => <Link className="starter-offer reveal" key={name} to={route}><span>{name}</span><strong>{price}</strong><small>See scope and details ↗</small></Link>)}</div>
      <div className="pricing-band-grid home-price-bands">{pricingBands.map((band) => <article className="pricing-band reveal" key={band.label}><span>{band.label}</span><strong>{band.range}</strong><p>{band.detail}</p></article>)}</div>
      <div className="center-action"><Link className="btn primary" to="/pricing">View service pricing ↗</Link></div>
    </div></section>

    <section className="section why-section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">Why 11-11 Tech</div><h2>One partner across experience, systems, intelligence and people.</h2></div><p>We combine the disciplines that often become disconnected when organizations hire design, engineering, AI, consulting and recruitment separately.</p></div>
      <div className="reason-grid">{reasons.map(([title, text]) => <article className="reason-card reveal" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
    </div></section>

    <section className="section alt-section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">For decision-makers</div><h2>Enter through the responsibility you own.</h2></div><p>Executives, technology leaders, operations, product, HR and customer teams can explore the services most relevant to their role.</p></div>
      <BuyerPaths />
    </div></section>

    <section className="section"><div className="wrap"><div className="proof-by-industry reveal"><div><div className="kicker">Selected proof</div><h2>Evidence sits behind the industry and service story.</h2><p>We maintain selected case-study evidence and a separate Lab for experiments and prototypes. We do not ask a new client to judge the company by unfinished product names on the home page.</p></div><div className="proof-sector-list"><span>Automotive & Mobility</span><span>Nonprofits & Membership</span><span>Media & Publishing</span><span>Education</span><span>Commerce & Marketplaces</span><span>Property & Housing</span><span>Recruitment & HR</span><span>Trust & Regulated Operations</span></div><Link className="btn ghost" to="/work">View selected work ↗</Link></div></div></section>

    <section className="full-bleed-media reveal"><img src={media.global} alt="Connected urban infrastructure spanning global regions" loading="lazy"/><div className="full-bleed-shade" aria-hidden="true"/><div className="wrap full-bleed-copy"><div className="kicker">Tokyo → world</div><h2>Tokyo-built. Africa-aware. Global by design.</h2><p>Japan-based technology services for organizations working across different markets, infrastructure realities and distributed teams.</p><div className="route-dots"><span>Japan</span><span>Africa</span><span>Europe</span><span>Americas</span><span>Global teams</span></div></div></section>

    <section className="section"><div className="wrap"><div className="trust-strip reveal"><div><span>QUALITY</span><strong>Defined acceptance</strong></div><div><span>CONFIDENTIALITY</span><strong>NDA available</strong></div><div><span>CONTRACTING</span><strong>MSA + SOW</strong></div><div><span>SERVICE</span><strong>SLA options</strong></div><div><span>PROCUREMENT</span><strong>Corporate-ready path</strong></div><Link className="text-link" to="/trust">Trust & contracting ↗</Link></div></div></section>
  </>
}
