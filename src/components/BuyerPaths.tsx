import { useState } from 'react'
import { Link } from './Link'
import { capabilities, type CapabilityId } from '../data/portfolio'

const buyerPaths: { role: string; question: string; capabilities: CapabilityId[]; outcomes: string[] }[] = [
  { role: 'CEO / Founder', question: 'How do we use technology to grow or change the organization?', capabilities: ['transformation','enterprise','ai'], outcomes: ['Transformation roadmap','Connected operating model','New technology opportunities'] },
  { role: 'CTO / CIO', question: 'How do we build, modernize and govern the technology stack?', capabilities: ['software-data-cloud','ai','trust'], outcomes: ['Modern architecture','Reliable delivery','Governed AI and security'] },
  { role: 'COO / Operations', question: 'How do we remove manual work and make operations visible?', capabilities: ['enterprise','ai','transformation'], outcomes: ['Connected workflows','Automation','Operational reporting'] },
  { role: 'Product Leader', question: 'How do we make the product easier to use and faster to evolve?', capabilities: ['ui-ux','software-data-cloud','trust'], outcomes: ['Better UX','Design system','Production-ready front end'] },
  { role: 'HR / Talent', question: 'How do we hire technical people and improve recruitment operations?', capabilities: ['talent','ai','enterprise'], outcomes: ['Technical search','Recruitment automation','Talent intelligence'] },
  { role: 'Customer / Marketing', question: 'How do we improve customer journeys, relationships and service?', capabilities: ['ui-ux','enterprise','ai'], outcomes: ['Customer experience','CRM','AI-assisted service'] },
]

export function BuyerPaths() {
  const [role, setRole] = useState(buyerPaths[0].role)
  const selected = buyerPaths.find((item) => item.role === role) ?? buyerPaths[0]
  return <div className="buyer-paths reveal">
    <div className="buyer-tabs" role="tablist" aria-label="Browse by buyer role">{buyerPaths.map((item) => <button key={item.role} type="button" role="tab" aria-selected={role === item.role} className={role === item.role ? 'active' : ''} onClick={() => setRole(item.role)}>{item.role}</button>)}</div>
    <div className="buyer-result" role="tabpanel">
      <small>FOR {selected.role.toUpperCase()}</small>
      <h3>{selected.question}</h3>
      <div className="buyer-outcomes">{selected.outcomes.map((outcome) => <span key={outcome}>{outcome}</span>)}</div>
      <div className="buyer-capabilities">{selected.capabilities.map((id) => { const capability = capabilities.find((item) => item.id === id); return capability ? <Link key={id} to={`/capabilities/${id}`}><strong>{capability.shortTitle}</strong><span>{capability.proposition}</span></Link> : null })}</div>
      <Link className="btn primary" to={`/contact?capability=${selected.capabilities[0]}`}>Discuss this objective ↗</Link>
    </div>
  </div>
}
