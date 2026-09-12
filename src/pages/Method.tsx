import { PageHero } from '../components/PageHero'
import { Link } from '../components/Link'
import { media } from '../lib/media'

const steps = [
  ['01','Discover','Understand the problem, users, operating context, systems, constraints and commercial objective.'],
  ['02','Design','Map journeys, relationships, authority, data, architecture, interfaces and measurable acceptance criteria.'],
  ['03','Build','Implement in controlled lanes with versioned decisions, visible evidence and proportionate security controls.'],
  ['04','Launch','Certify critical journeys, complete UAT, document known gaps and deploy with a clear handover.'],
  ['05','Operate','Support the real system after launch: incidents, updates, adoption, usage, model/tool dependencies and service commitments.'],
  ['06','Improve','Use evidence, client feedback and operating data to prioritize the next product, UX, AI or platform improvement.'],
]

const success = [
  ['01','Onboarding','Confirm stakeholders, communication, access, constraints, scope and the first measurable milestone.'],
  ['02','Milestone visibility','Keep decisions, dependencies, demos, risks and delivery evidence visible throughout the engagement.'],
  ['03','Review & UAT','Put important journeys in front of the client before final acceptance rather than relying on a launch-day surprise.'],
  ['04','Handover & training','Transfer operating knowledge, documentation, administrator guidance and agreed source access.'],
  ['05','Warranty / support','Separate defect correction, paid support and contractual SLA commitments so expectations stay clear.'],
  ['06','Continuous improvement','Use recurring reviews, product evidence and operational feedback to decide what should change next.'],
]

export function Method(){return <>
  <PageHero index="10" kicker="Method" title={<>Discover. Design. Build. <span className="soft">Then keep improving.</span></>}>11-11 Tech treats launch as a milestone, not the end of the technology relationship.</PageHero>

  <section className="editorial-media reveal"><img src={media.systems} alt="Transparent digital infrastructure carrying blue signals"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>DISCOVER / DESIGN / BUILD / LAUNCH / OPERATE / IMPROVE</span><h2>From ambiguity to an operating system that can keep changing safely.</h2></div></section>

  <section className="section"><div className="wrap"><div className="method-grid">{steps.map(([n,title,text])=><div className="method-step reveal" key={n}><div className="glyph">{n}</div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

  <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Engagement controls</div><h2>Clarity before velocity.</h2></div><p>The level of ceremony changes with the size and risk of the engagement. The principle does not.</p></div><div className="commercial-model-grid"><article><span>SCOPE</span><h3>Define what success means.</h3><p>Problem, deliverables, exclusions, dependencies and acceptance criteria are written before implementation becomes expensive.</p></article><article><span>TRUTH</span><h3>Establish authoritative state.</h3><p>Code, environments, data, permissions and business rules need one reviewable source of truth.</p></article><article><span>EVIDENCE</span><h3>Test important journeys.</h3><p>Automation, UAT and release evidence are attached to the system rather than assumed from appearance.</p></article><article><span>HANDOVER</span><h3>Make the system portable.</h3><p>Architecture, decisions, operating notes and unresolved risk should survive the person who built them.</p></article></div></div></section>

  <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Client success</div><h2>What happens after you become a client.</h2></div><p>A mature technology relationship needs more than a kickoff and a final invoice.</p></div><div className="client-success-grid">{success.map(([n,title,text]) => <article className="reveal" key={n}><span>{n} / CLIENT JOURNEY</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

  <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Documentation</div><h2>Make system truth portable.</h2></div><p>Plans, decisions and evidence should survive the person who wrote them.</p></div><div className="artifact-strip reveal"><div className="artifact"><h4>System truth register</h4><pre>{`SOURCE OF TRUTH\nAUTHORITY\nJOURNEY\nEVIDENCE\nKNOWN GAPS`}</pre></div><div className="artifact"><h4>Certification signal</h4><div className="bars animated-bars" aria-label="Illustrative certification progress bars">{Array.from({length:8},(_,i)=><span key={i}/>)}</div></div></div></div></section>

  <section className="section assurance-section"><div className="wrap investment-callout reveal"><div><div className="kicker">Need a starting point?</div><h2>Discovery can be the engagement.</h2><p>A paid audit, UX review, AI readiness assessment or technology roadmap can create useful clarity even when implementation is not yet approved.</p></div><div><Link className="btn primary" to="/contact?outcome=unknown">Start with discovery ↗</Link><Link className="btn ghost" to="/pricing">See investment ranges</Link></div></div></section>
</>}
