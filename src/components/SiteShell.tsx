import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { Link, hrefFor } from './Link'
import { capabilities } from '../data/portfolio'
import { routeMeta, siteUrl, type RoutePath } from '../lib/site'

const nav = [
  ['/solutions', 'Solutions'], ['/industries', 'Industries'], ['/work', 'Work'], ['/insights', 'Insights'], ['/about', 'Company'],
] as const

function setMeta(selector: string, attribute: string, value: string) {
  const element = document.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)
  element?.setAttribute(attribute, value)
}

export function SiteShell({ children, path }: PropsWithChildren<{ path: string }>) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement | null>(null)
  const mobileMenu = useRef<HTMLElement | null>(null)

  const closeMenu = (restoreFocus = false) => {
    setMenuOpen(false)
    if (restoreFocus) requestAnimationFrame(() => menuButton.current?.focus())
  }

  useEffect(() => {
    setMenuOpen(false)
    const capability = path.startsWith('/capabilities/') ? capabilities.find((item) => item.id === path.split('/')[2]) : undefined
    const meta = capability ? {
      title: `${capability.title} — 11-11 Tech`,
      description: `${capability.proposition} Explore services, examples, indicative pricing, proof, delivery and assurance.`,
    } : routeMeta[path as RoutePath] ?? {
      title: 'Page not found — 11-11 Tech',
      description: 'The requested page does not exist on the 11-11 Tech website.',
    }
    const canonical = `${siteUrl}${path === '/' ? '/' : `${path}/`}`
    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[property="og:url"]', 'content', canonical)
    setMeta('meta[name="twitter:title"]', 'content', meta.title)
    setMeta('meta[name="twitter:description"]', 'content', meta.description)
    setMeta('link[rel="canonical"]', 'href', canonical)
  }, [path])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((node) => node.classList.add('in'))
      return
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in')
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.1, rootMargin: '0px 0px -24px' })
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [path])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const menu = mobileMenu.current
    const getFocusable = () => Array.from(menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])
    getFocusable()[0]?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); return }
      if (event.key !== 'Tab') return
      const focusable = getFocusable()
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }

    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKey) }
  }, [menuOpen])

  return <>
    <a className="skip" href="#main">Skip to content</a>
    <div className="noise" aria-hidden="true" />
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand" to="/" aria-label="11-11 Tech home"><img src={hrefFor('/assets/logo-mark.svg')} alt=""/><span>11-11 Tech</span></Link>
        <nav className="nav-links v2-nav" aria-label="Primary">
          <details className="nav-mega"><summary aria-current={path.startsWith('/capabilities') || path === '/services' ? 'page' : undefined}>Capabilities</summary><div className="nav-mega-panel"><div className="nav-mega-intro"><small>Seven practices</small><strong>From experience to enterprise systems, AI, talent and trust.</strong><Link to="/capabilities">View all capabilities ↗</Link></div><div className="nav-mega-links">{capabilities.map((capability) => <Link key={capability.id} to={`/capabilities/${capability.id}`}><span>{capability.index}</span><strong>{capability.shortTitle}</strong><small>{capability.proposition}</small></Link>)}</div></div></details>
          {nav.map(([route, label]) => <Link key={route} to={route} aria-current={path === route ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <Link className="nav-cta" to="/contact">Start a project <span aria-hidden="true">↗</span></Link>
        <button ref={menuButton} className={`menu-btn ${menuOpen ? 'open' : ''}`} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((value) => !value)}><span /></button>
      </div>
      {menuOpen && <div className="mobile-backdrop" aria-hidden="true" onClick={() => closeMenu(true)} />}
      <nav ref={mobileMenu} id="mobile-menu" className={`mobile-panel ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        <Link to="/capabilities">Capabilities</Link>{capabilities.map((capability) => <Link className="mobile-sub" key={capability.id} to={`/capabilities/${capability.id}`}>{capability.shortTitle}</Link>)}
        {nav.map(([route, label]) => <Link key={route} to={route} aria-current={path === route ? 'page' : undefined}>{label}</Link>)}
        <Link to="/pricing">Pricing</Link><Link to="/trust">Trust Center</Link><Link to="/contact">Start a project</Link>
      </nav>
    </header>
    <main id="main" tabIndex={-1}>{children}</main>

    <section className="cta" aria-label="Start a project"><div className="wrap"><div className="cta-box reveal"><div><div className="kicker">Start with the problem</div><h2>Tell us what needs to change.</h2></div><div><p>We will route it to the right capability, service family, investment range and delivery path.</p><Link className="btn primary" to="/contact">Design my engagement ↗</Link></div></div></div></section>

    <footer className="footer footer-v2"><div className="wrap">
      <div className="footer-grid footer-grid-v2">
        <div className="footer-brand"><img src={hrefFor('/assets/logo-light.svg')} alt="11-11 Tech"/><p>UI/UX, enterprise systems, AI implementation, software, transformation, technology talent and trustworthy engineering.</p><strong>Tokyo-built · Africa-aware · Global by design.</strong></div>
        <div><h4>Capabilities</h4><Link to="/capabilities/ui-ux">UI/UX & Front-End</Link><Link to="/capabilities/enterprise">Enterprise Systems & CRM</Link><Link to="/capabilities/ai">AI & Automation</Link><Link to="/capabilities/software-data-cloud">Software, Data & Cloud</Link><Link to="/capabilities/transformation">Digital Transformation</Link><Link to="/capabilities/talent">Technology Talent</Link><Link to="/capabilities/trust">Trust & Assurance</Link></div>
        <div><h4>Find a solution</h4><Link to="/solutions">Solution catalogue</Link><Link to="/industries">Industries</Link><Link to="/pricing">Pricing</Link><Link to="/work">22-project proof</Link><Link to="/method">Delivery method</Link><Link to="/insights">Insights</Link></div>
        <div><h4>Company</h4><Link to="/about">About 11-11 Tech</Link><Link to="/vision">11-11 Lab</Link><Link to="/trust">Trust Center</Link><Link to="/policies">Public policies</Link><Link to="/contact?procurement=true">Legal / procurement</Link><Link to="/contact">Start a project</Link></div>
        <div><h4>Contact & data</h4><a href="mailto:kudzimusar@gmail.com">kudzimusar@gmail.com</a><span>Tokyo, Japan</span><span>Japan · Africa · Europe · Americas</span><a href="https://github.com/kudzimusar/11-11-tech" target="_blank" rel="noreferrer">GitHub ↗</a><Link to="/trust">Data & contracting information</Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} 11-11 Tech.</span><span>Build what matters. Prove what works.</span></div>
    </div></footer>
  </>
}
