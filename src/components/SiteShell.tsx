import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { Link, hrefFor } from './Link'
import { routeMeta, siteUrl, type RoutePath } from '../lib/site'

const nav = [
  ['/', 'Home'], ['/work', 'Work'], ['/services', 'Services'], ['/about', 'About'],
  ['/vision', 'Vision'], ['/method', 'Method'], ['/contact', 'Contact'],
] as const

function setMeta(selector: string, attribute: string, value: string) {
  const element = document.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)
  element?.setAttribute(attribute, value)
}

export function SiteShell({ children, path }: PropsWithChildren<{ path: string }>) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement | null>(null)
  const mobileMenu = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setMenuOpen(false)
    const meta = routeMeta[path as RoutePath] ?? {
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
    mobileMenu.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return <>
    <a className="skip" href="#main">Skip to content</a>
    <div className="noise" aria-hidden="true" />
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand" to="/" aria-label="11-11 Tech home"><img src={hrefFor('/assets/logo-mark.svg')} alt="" /><span>11-11 Tech</span></Link>
        <nav className="nav-links" aria-label="Primary">
          {nav.map(([route, label]) => <Link key={route} to={route} aria-current={path === route ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <Link className="nav-cta" to="/contact">Start a project <span aria-hidden="true">↗</span></Link>
        <button ref={menuButton} className={`menu-btn ${menuOpen ? 'open' : ''}`} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((value) => !value)}><span /></button>
      </div>
      {menuOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <nav ref={mobileMenu} id="mobile-menu" className={`mobile-panel ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        {nav.map(([route, label]) => <Link key={route} to={route} aria-current={path === route ? 'page' : undefined}>{label}</Link>)}
        <Link to="/policies">Policies</Link>
      </nav>
    </header>
    <main id="main" tabIndex={-1}>{children}</main>
    <section className="cta" aria-label="Start a project">
      <div className="wrap"><div className="cta-box reveal"><div><div className="kicker">Start a conversation</div><h2>Bring the complicated thing.</h2></div><div><p>New product, stalled build, platform recovery, documentation programme or a difficult system that needs clarity.</p><Link className="btn primary" to="/contact">Start a project ↗</Link></div></div></div>
    </section>
    <footer className="footer"><div className="wrap"><div className="footer-grid">
      <div className="footer-brand"><img src={hrefFor('/assets/logo-light.svg')} alt="11-11 Tech" /><p>Tokyo-based product engineering, app development and technical documentation for Africa, Europe, the Americas and globally distributed teams.</p></div>
      <div><h4>Explore</h4><Link to="/work">Work</Link><Link to="/services">Services</Link><Link to="/method">Method</Link></div>
      <div><h4>Company</h4><Link to="/about">About</Link><Link to="/vision">11-11 Lab</Link><Link to="/contact">Contact</Link></div>
      <div><h4>Trust</h4><Link to="/policies">Policies</Link><a href="mailto:kudzimusar@gmail.com">Email</a><a href="https://github.com/kudzimusar/11-11-tech" target="_blank" rel="noreferrer">GitHub ↗</a></div>
    </div><div className="footer-bottom"><span>© {new Date().getFullYear()} 11-11 Tech. Tokyo, Japan.</span><span>Tokyo-built · Africa-aware · Global by design.</span></div></div></footer>
  </>
}
