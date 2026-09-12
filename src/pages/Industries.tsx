import { PageHero } from '../components/PageHero'
import { Link } from '../components/Link'
import { capabilities, industries } from '../data/portfolio'
import { projects } from '../data/projects'
import { industryMedia, media } from '../lib/media'

export function Industries() {
  return <>
    <PageHero index="04" kicker="Industries" title={<>Built around <span className="soft">the way your world works.</span></>}>Choose your sector. See the most relevant services, then open the detail only if you need it.</PageHero>

    <section className="editorial-media industry-media-v21 reveal"><img src={media.globalBridge} alt="Tokyo and African business environments connected through a shared technology perspective"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>SECTOR / USERS / WORKFLOW / SYSTEM / OUTCOME</span><h2>The technology changes when the operating environment changes.</h2></div></section>

    <section className="section editorial-light industries-page-v21"><div className="wrap">
      <div className="editorial-heading light-heading reveal"><div><div className="kicker">Industry solutions</div><h2>Find your context.</h2></div><p>Open a sector for the services and selected proof most relevant to it.</p></div>

      <div className="industry-visual-grid-v22 reveal" aria-label="Industry visual index">
        {industries.map((industry) => <a className="industry-visual-tile-v22" href={`#${industry.id}`} key={industry.id}>
          <img src={industryMedia[industry.id as keyof typeof industryMedia]} alt={`${industry.name} technology environment`} loading="lazy" />
          <span>{industry.name}</span>
        </a>)}
      </div>

      <div className="industry-accordion-v21">
        {industries.map((industry, index) => <details className="industry-detail-v21 reveal" id={industry.id} key={industry.id}>
          <summary><span>{String(index + 1).padStart(2,'0')}</span><strong>{industry.name}</strong><div>{industry.capabilities.slice(0,3).map((id) => { const capability = capabilities.find((item) => item.id === id); return capability ? <small key={id}>{capability.shortTitle}</small> : null })}</div><b>+</b></summary>
          <div className="industry-detail-body-v21 industry-detail-body-v22">
            <figure className="industry-detail-image-v22"><img src={industryMedia[industry.id as keyof typeof industryMedia]} alt={`${industry.name} editorial scene`} loading="lazy" /></figure>
            <div><span className="industry-detail-label">Where we help</span><h2>{industry.summary}</h2></div>
            <div><span className="industry-detail-label">Relevant services</span><div className="industry-capabilities">{industry.capabilities.map((id) => { const capability = capabilities.find((item) => item.id === id); return capability ? <Link key={id} to={`/capabilities/${id}`}>{capability.shortTitle}</Link> : null })}</div><div className="industry-actions"><Link className="btn primary" to={`/contact?industry=${encodeURIComponent(industry.name)}`}>Discuss this industry ↗</Link><Link className="btn ghost dark-ghost" to="/pricing">Pricing</Link></div></div>
            <details className="industry-proof-disclosure"><summary>Selected supporting proof</summary><div className="proof-logo-rail">{industry.projects.map((slug) => { const project = projects.find((item) => item.slug === slug); return project ? <span key={slug}><strong>{project.name}</strong><small>{project.status}</small></span> : null })}</div></details>
          </div>
        </details>)}
      </div>
    </div></section>

    <section className="section industry-proof-note-v21"><div className="wrap"><div className="proof-explainer reveal"><div><div className="kicker">Proof, in context</div><h2>The industry is the headline.</h2></div><p>Projects sit behind the service story as supporting evidence. Lab work and unfinished products are kept separate from mature proof.</p></div></div></section>
  </>
}
