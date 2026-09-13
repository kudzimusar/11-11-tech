import { Link } from './Link'

export function CommercialUtilityNav() {
  return <nav className="commercial-utility-nav" aria-label="Client and billing access">
    <div className="wrap commercial-utility-inner">
      <span>Already working with 11-11 Tech?</span>
      <div><Link to="/pay">Pay an invoice</Link><Link to="/client">Client login ↗</Link></div>
    </div>
  </nav>
}
