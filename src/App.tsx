import { useEffect, useState } from 'react'
import { SiteShell } from './components/SiteShell'
import { Link } from './components/Link'
import { Home } from './pages/Home'
import { Work } from './pages/Work'
import { Capabilities } from './pages/Capabilities'
import { CapabilityDetail } from './pages/CapabilityDetail'
import { Solutions } from './pages/Solutions'
import { Industries } from './pages/Industries'
import { Pricing } from './pages/Pricing'
import { Trust } from './pages/Trust'
import { Insights } from './pages/Insights'
import { About } from './pages/About'
import { Vision } from './pages/Vision'
import { Method } from './pages/Method'
import { Contact } from './pages/Contact'
import { Policies } from './pages/Policies'
import { normalizeRoute } from './lib/site'

const base = import.meta.env.BASE_URL
const getLocation = () => ({ path: normalizeRoute(window.location.pathname, base), search: window.location.search })

export default function App() {
  const [location, setLocation] = useState(getLocation)

  useEffect(() => {
    const onRouteChange = () => setLocation(getLocation())
    window.addEventListener('popstate', onRouteChange)
    window.addEventListener('app:navigate', onRouteChange)
    return () => {
      window.removeEventListener('popstate', onRouteChange)
      window.removeEventListener('app:navigate', onRouteChange)
    }
  }, [])

  const { path, search } = location
  let page
  if (path.startsWith('/capabilities/')) page = <CapabilityDetail capabilityId={path.split('/')[2] ?? ''} />
  else switch (path) {
    case '/': page = <Home />; break
    case '/work': page = <Work />; break
    case '/capabilities': page = <Capabilities />; break
    case '/services': page = <Capabilities />; break
    case '/solutions': page = <Solutions />; break
    case '/industries': page = <Industries />; break
    case '/pricing': page = <Pricing />; break
    case '/trust': page = <Trust />; break
    case '/insights': page = <Insights />; break
    case '/about': page = <About />; break
    case '/vision': page = <Vision />; break
    case '/method': page = <Method />; break
    case '/contact': page = <Contact />; break
    case '/policies': page = <Policies />; break
    default: page = <NotFound />
  }

  return <SiteShell path={path}><div className="route-view" key={`${path}${search}`}>{page}</div></SiteShell>
}

function NotFound() {
  return <section className="page-hero"><div className="wrap"><div className="kicker">404</div><h1>That page <span className="soft">is not here.</span></h1><p>The route does not exist in the 11-11 Tech site.</p><Link className="btn primary" to="/">Return home ↗</Link></div></section>
}
