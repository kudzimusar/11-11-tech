import { PageHero } from '../components/PageHero'
import { Link } from '../components/Link'
import { capabilities, industries } from '../data/portfolio'
import { projects } from '../data/projects'

export function Industries() {
  return <>
    <PageHero index="04" kicker="Industries" title={<>Technology has to understand <span className="soft">the operating context.</span></>}>Browse the portfolio by the environment in which the technology has to work, not only by the tools used to build it.</PageHero>
    <section className="section"><div className="wrap industry-grid">{industries.map((industry) => <article className="industry-card reveal" key={industry.id}><span>{industry.name}</span><h2>{industry.summary}</h2><div className="industry-capabilities">{industry.capabilities.map((id) => { const capability = capabilities.find((item) => item.id === id); return capability ? <Link key={id} to={`/capabilities/${id}`}>{capability.shortTitle}</Link> : null })}</div><div className="industry-proof"><small>Relevant portfolio proof</small>{industry.projects.map((slug) => { const project = projects.find((item) => item.slug === slug); return project ? <strong key={slug}>{project.name}</strong> : null })}</div><Link className="btn ghost" to={`/contact?industry=${encodeURIComponent(industry.name)}`}>Discuss {industry.name} ↗</Link></article>)}</div></section>
  </>
}
