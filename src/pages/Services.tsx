import { PageHero } from '../components/PageHero'
import { media } from '../lib/media'

const services = [
  ['01','Product strategy','Actors, journeys, authority, commercial boundaries and roadmap.'],
  ['02','Web & applications','Responsive products, PWAs, dashboards and mobile-first interaction.'],
  ['03','Platform modernization','Recover drift, reconcile environments and restore an authoritative state.'],
  ['04','UI/UX systems','Editorial interfaces, design systems, accessibility and interaction logic.'],
  ['05','AI product design','Assistants, interpretation and automation constrained by product truth.'],
  ['06','Documentation','BRDs, architecture records, migration packs and operating manuals.'],
  ['07','QA & certification','Automated gates, UAT evidence and release-readiness programmes.'],
  ['08','Deployment systems','CI/CD, environment control, cloud delivery and production handoff.'],
]

export function Services(){return <>
  <PageHero index="02" kicker="Services" title={<>Strategy to <span className="soft">running system.</span></>}>One studio across product framing, engineering, intelligence, documentation and release discipline.</PageHero>

  <section className="editorial-media reveal"><img src={media.systems} alt="Cinematic digital infrastructure with moving signal pathways"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>ARCHITECTURE / DELIVERY / OPERATIONS</span><h2>Build the visible product and the system beneath it.</h2></div></section>

  <section className="section"><div className="wrap"><div className="service-lines reveal">{services.map(([n,title,text])=><div className="service-row" key={n}><span className="num">{n} / 08</span><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

  <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Technology</div><h2>Tools in service of system truth.</h2></div><p>Modern where it helps. Boring where reliability matters.</p></div><div className="tech-orbit reveal" aria-label="Core technology stack"><span>React</span><span>TypeScript</span><span>Node</span><span>Supabase</span><span>PostgreSQL</span><span>Cloudflare</span><span>GitHub Actions</span><span>Playwright</span><span>OpenAI</span><span>Higgsfield</span><span>ElevenLabs</span></div></div></section>

  <section className="full-bleed-media compact-media reveal"><img src={media.intelligence} alt="Connected intelligence and evidence objects" loading="lazy"/><div className="full-bleed-shade"/><div className="wrap full-bleed-copy"><div className="kicker">Creative intelligence</div><h2>Image. Voice. Video. Reasoning. Boundaries.</h2><p>Generative tools become production capability when they are directed, reviewed and attached to a real product purpose.</p></div></section>
</>}
