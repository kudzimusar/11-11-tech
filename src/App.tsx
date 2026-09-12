import { useEffect, useState } from 'react'
import { SiteShell } from './components/SiteShell'
import { Link } from './components/Link'
import { Home } from './pages/Home'
import { Work } from './pages/Work'
import { Services } from './pages/Services'
import { About } from './pages/About'
import { Vision } from './pages/Vision'
import { Method } from './pages/Method'
import { Contact } from './pages/Contact'
import { Policies } from './pages/Policies'
import { normalizeRoute } from './lib/site'

const base = import.meta.env.BASE_URL
const getPath = () => normalizeRoute(window.location.pathname, base)

export default function App() {
  const [path, setPath] = useState(getPath)

  useEffect(() => {
    const onRouteChange = () => setPath(getPath())
    window.addEventListener('popstate', onRouteChange)
    window.addEventListener('app:navigate', onRouteChange)
    return () => {
      window.removeEventListener('popstate', onRouteChange)
      window.removeEventListener('app:navigate', onRouteChange)
    }
  }, [])

  let page
  switch (path) {
    case '/': page = <Home />; break
    case '/work': page = <Work />; break
    case '/services': page = <Services />; break
    case '/about': page = <About />; break
    case '/vision': page = <Vision />; break
    case '/method': page = <Method />; break
    case '/contact': page = <Contact />; break
    case '/policies': page = <Policies />; break
    default: page = <NotFound />
  }

  return <SiteShell path={path}><div className="route-view" key={path}>{page}</div></SiteShell>
}

function NotFound() {
  return <section className="page-hero"><div className="wrap"><div className="kicker">404</div><h1>That page <span className="soft">is not here.</span></h1><p>The route does not exist in the 11-11 Tech site.</p><Link className="btn primary" to="/">Return home ↗</Link></div></section>
}
