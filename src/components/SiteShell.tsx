import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { Link, hrefFor } from './Link'
import { capabilities } from '../data/portfolio'
import { media } from '../lib/media'
import { routeMeta, siteUrl, type RoutePath } from '../lib/site'

const nav = [
  ['/solutions', 'Solutions'], ['/industries', 'Industries'], ['/pricing', 'Pricing'], ['/work', 'Work'], ['/insights', 'Insights'], ['/about', 'Company'],
] as const

const footerNav = [
  ['/capabilities', 'Services'], ['/industries', 'Industries'], ['/solutions', 'Solutions'], ['/about', 'About'], ['/pricing', 'Pricing'], ['/insights', 'Insights'], ['/contact', 'Contact'],
] as const

const sectorMarks = ['AUTOMOTIVE', 'NONPROFITS', 'MEDIA', 'EDUCATION', 'COMMERCE', 'PROPERTY']

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
          <details className="nav-mega"><summary aria-current={path.startsWith('/capabilities') || path === '/services' ? 'page' : undefined}>Services</summary><div className="nav-mega-panel"><div className="nav-mega-intro"><small>IT Services</small><strong>Design, AI, CRM, software, transformation, talent and assurance.</strong><p>Start with the service you recognize. Go deeper into process, examples, pricing and delivery when needed.</p><Link to="/capabilities">View all IT services ↗</Link></div><div className="nav-mega-links">{capabilities.map((capability) => <Link key={capability.id} to={`/capabilities/${capability.id}`}><span>{capability.index}</span><strong>{capability.shortTitle}</strong><small>{capability.proposition}</small></Link>)}</div></div></details>
          {nav.map(([route, label]) => <Link key={route} to={route} aria-current={path === route ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <Link className="nav-cta" to="/contact">Start a project <span aria-hidden="true">↗</span></Link>
        <button ref={menuButton} className={`menu-btn ${menuOpen ? 'open' : ''}`} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((value) => !value)}><span /></button>
      </div>
      {menuOpen && <div className="mobile-backdrop" aria-hidden="true" onClick={() => closeMenu(true)} />}
      <nav ref={mobileMenu} id="mobile-menu" className={`mobile-panel ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        <Link to="/capabilities">IT Services</Link>{capabilities.map((capability) => <Link className="mobile-sub" key={capability.id} to={`/capabilities/${capability.id}`}>{capability.shortTitle}</Link>)}
        {nav.map(([route, label]) => <Link key={route} to={route} aria-current={path === route ? 'page' : undefined}>{label}</Link>)}
        <Link to="/trust">Trust Center</Link><Link to="/contact">Start a project</Link>
      </nav>
    </header>
    <main id="main" tabIndex={-1}>{children}</main>

    <section className="footer-trust-strip-v23" aria-label="Sectors we design for">
      <div className="wrap footer-trust-grid-v23">
        <div className="footer-trust-copy-v23"><span>BUILT ACROSS SECTORS</span><h2>Technology shaped for the organisations moving forward.</h2></div>
        <div className="footer-sector-marks-v23" aria-label="Selected industries">{sectorMarks.map((sector) => <span key={sector}>{sector}</span>)}</div>
      </div>
    </section>

    <section className="footer-cta-v23" aria-label="Start a conversation">
      <img src={media.globalBridge} alt="Connected global cities and infrastructure at night" loading="lazy" />
      <div className="footer-cta-shade-v23" />
      <div className="wrap footer-cta-grid-v23">
        <div className="footer-cta-copy-v23 reveal"><h2>What’s next for your organisation?</h2><p>Let’s build it together.</p><div className="footer-cta-actions-v23"><Link className="footer-primary-v23" to="/contact">Start a conversation <span aria-hidden="true">→</span></Link><Link className="footer-secondary-v23" to="/work">See our work</Link></div></div>
        <div className="footer-cta-manifest-v23" aria-label="11-11 Tech operating focus"><span>TECHNOLOGY</span><span>PEOPLE</span><span>PROCESS</span><span>A BETTER SYSTEM</span></div>
      </div>
    </section>

    <footer className="corporate-footer-v23">
      <div className="wrap corporate-footer-main-v23">
        <div className="corporate-footer-brand-v23">
          <Link to="/" aria-label="11-11 Tech home" className="corporate-footer-logo-v23"><img src={hrefFor('/assets/logo-mark.svg')} alt=""/><span><strong>11-11 Tech</strong><small>BUILD · PROVE · GROW</small></span></Link>
        </div>
        <nav className="corporate-footer-nav-v23" aria-label="Footer navigation">{footerNav.map(([route, label]) => <Link key={route} to={route}>{label}</Link>)}</nav>
        <div className="corporate-footer-social-v23" aria-label="11-11 Tech links">
          <a href="https://github.com/kudzimusar/11-11-tech" target="_blank" rel="noreferrer" aria-label="11-11 Tech on GitHub">GH</a>
          <a href="mailto:kudzimusar@gmail.com" aria-label="Email 11-11 Tech">@</a>
          <Link to="/trust" aria-label="11-11 Tech Trust Center">T</Link>
          <Link to="/contact" aria-label="Contact 11-11 Tech">↗</Link>
        </div>
      </div>
      <div className="wrap corporate-footer-rule-v23" />
      <div className="wrap corporate-footer-bottom-v23">
        <span>© {new Date().getFullYear()} 11-11 Tech. All rights reserved.</span>
        <div className="corporate-footer-legal-v23"><a href={hrefFor('/policies#privacy')}>Privacy</a><a href={hrefFor('/policies#terms')}>Terms</a><Link to="/trust">Legal</Link><a href={hrefFor('/sitemap.xml')}>Sitemap</a></div>
        <div className="corporate-footer-locations-v23"><span>Tokyo</span><i>·</i><span>Harare</span><i>·</i><span>Global</span></div>
      </div>
    </footer>
  </>
}
