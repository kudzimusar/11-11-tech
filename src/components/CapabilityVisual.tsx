import type { CapabilityId } from '../data/portfolio'

const visualNodes: Record<CapabilityId, string[]> = {
  'ui-ux': ['USER','JOURNEY','INTERFACE','STATE','SYSTEM','OUTCOME'],
  enterprise: ['CUSTOMER','MEMBER','PARTNER','WORKFLOW','DATA','ACTION'],
  ai: ['INPUT','MODEL','KNOWLEDGE','TOOLS','HUMAN','ACTION'],
  'software-data-cloud': ['WEB / MOBILE','API','LOGIC','DATA','CLOUD','OBSERVE'],
  transformation: ['PEOPLE','PROCESS','SYSTEMS','DATA','AUTOMATION','INTELLIGENCE'],
  talent: ['ROLE','SKILLS','SOURCE','ASSESS','MATCH','ONBOARD'],
  trust: ['IDENTITY','ACCESS','EVIDENCE','AUDIT','TEST','VERIFY'],
}

export function CapabilityVisual({ id }: { id: CapabilityId }) {
  return <div className={`capability-visual visual-${id}`} aria-label={`${id} system model`}>
    <div className="visual-core"><span>11-11</span><strong>{id === 'ui-ux' ? 'EXPERIENCE' : id === 'ai' ? 'INTELLIGENCE' : id === 'enterprise' ? 'RELATIONSHIP CORE' : id === 'talent' ? 'TALENT SYSTEM' : id === 'trust' ? 'TRUST LAYER' : id === 'transformation' ? 'TARGET STATE' : 'PLATFORM'}</strong></div>
    <div className="visual-orbit" aria-hidden="true" />
    <div className="visual-node-grid">{visualNodes[id].map((node, index) => <div className="visual-node" key={node}><i aria-hidden="true" /><span>{String(index + 1).padStart(2,'0')}</span><strong>{node}</strong></div>)}</div>
    <div className="visual-signal signal-a" aria-hidden="true"/><div className="visual-signal signal-b" aria-hidden="true"/>
  </div>
}
