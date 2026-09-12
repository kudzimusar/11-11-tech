import { PageHero } from '../components/PageHero'
import { Link } from '../components/Link'
import { capabilities, industries } from '../data/portfolio'
import { projects } from '../data/projects'

export function Industries() {
  return <>
    <PageHero index="04" kicker="Industries" title={<>Technology that understands <span className="soft">your operating environment.</span></>}>Start with your industry. See the services most relevant to the way your organization works, then go deeper into implementation, pricing and selected proof only when you need it.</PageHero>

    <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Industry solutions</div><h2>We do not ask every organization to buy the same technology.</h2></div><p>A dealer, nonprofit, newsroom, school, property business and recruitment team have different users, workflows, trust requirements and commercial pressures. We shape the technology around that context.</p></div>
      <div className="industry-grid">{industries.map((industry) => <article className="industry-card reveal" id={industry.id} key={industry.id}><span>{industry.name}</span><h2>{industry.summary}</h2><div className="industry-service-label">Services commonly relevant here</div><div className="industry-capabilities">{industry.capabilities.map((id) => { const capability = capabilities.find((item) => item.id === id); return capability ? <Link key={id} to={`/capabilities/${id}`}>{capability.shortTitle}</Link> : null })}</div><div className="industry-actions"><Link className="btn primary" to={`/contact?industry=${encodeURIComponent(industry.name)}`}>Discuss {industry.name} ↗</Link><Link className="btn ghost" to="/pricing">View pricing</Link></div><details className="industry-proof-disclosure"><summary>See selected supporting proof</summary><p>Project evidence is intentionally secondary to the service and industry story. Maturity is shown honestly.</p><div className="proof-logo-rail">{industry.projects.map((slug) => { const project = projects.find((item) => item.slug === slug); return project ? <span key={slug}><strong>{project.name}</strong><small>{project.status}</small></span> : null })}</div></details></article>)}</div>
    </div></section>

    <section className="section alt-section"><div className="wrap"><div className="proof-explainer reveal"><div><div className="kicker">How industry proof works</div><h2>The industry is the headline. The project is evidence.</h2></div><p>11-11 Tech uses selected product and project work to demonstrate patterns such as marketplace UX, relationship management, AI workflows, verification, booking, publishing and operations. We do not present unfinished experiments as finished corporate deployments.</p></div></div></section>
  </>
}
