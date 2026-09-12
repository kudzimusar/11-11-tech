import { useMemo, useState } from 'react'
import { capabilities } from '../data/portfolio'
import { Link } from './Link'

export function ProjectEstimator() {
  const [capabilityId, setCapabilityId] = useState(capabilities[0].id)
  const capability = capabilities.find((item) => item.id === capabilityId) ?? capabilities[0]
  const [serviceName, setServiceName] = useState(capability.services[0].name)
  const service = useMemo(() => capability.services.find((item) => item.name === serviceName) ?? capability.services[0], [capability, serviceName])

  const chooseCapability = (id: string) => {
    const next = capabilities.find((item) => item.id === id) ?? capabilities[0]
    setCapabilityId(next.id)
    setServiceName(next.services[0].name)
  }

  return <div className="project-estimator reveal">
    <div className="estimator-form">
      <div className="field"><label htmlFor="estimate-capability">Capability</label><select id="estimate-capability" value={capabilityId} onChange={(event) => chooseCapability(event.target.value)}>{capabilities.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></div>
      <div className="field"><label htmlFor="estimate-service">Service</label><select id="estimate-service" value={serviceName} onChange={(event) => setServiceName(event.target.value)}>{capability.services.map((item) => <option value={item.name} key={item.name}>{item.name}</option>)}</select></div>
      <p>Choose the closest service. The range is indicative and becomes a scoped quotation only after the requirements, integrations, data, timeline and procurement obligations are understood.</p>
    </div>
    <div className="estimator-result" aria-live="polite"><small>INDICATIVE INVESTMENT</small><strong>{service.price}</strong><h3>{service.name}</h3><p>{service.summary}</p><div className="mini-chip-grid">{service.examples.map((example) => <span key={example}>{example}</span>)}</div><Link className="btn primary" to={`/contact?capability=${capability.id}&service=${encodeURIComponent(service.name)}`}>Turn this into a scoped brief ↗</Link></div>
  </div>
}
