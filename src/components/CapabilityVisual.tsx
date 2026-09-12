import type { CapabilityId } from '../data/portfolio'

const Pulse = () => <i className="cv-pulse" aria-hidden="true" />

function UiUxVisual() {
  return <div className="cv-scene cv-uiux">
    <div className="cv-scene-label"><span>EXPERIENCE MODERNIZATION</span><strong>Before → After</strong></div>
    <div className="cv-uiux-stage">
      <div className="cv-window cv-window-before"><div className="cv-window-top"><i/><i/><i/></div><div className="cv-bad-nav"/><div className="cv-bad-grid"><span/><span/><span/><span/><span/><span/></div><small>FRICTION</small></div>
      <div className="cv-uiux-arrow">→</div>
      <div className="cv-window cv-window-after"><div className="cv-window-top"><i/><i/><i/></div><div className="cv-good-hero"><b>01</b><span/></div><div className="cv-good-grid"><span/><span/><span/></div><small>CLEAR JOURNEY</small><Pulse/></div>
    </div>
    <div className="cv-footline"><span>Audit</span><span>Journey</span><span>Design system</span><span>Front end</span></div>
  </div>
}

function EnterpriseVisual() {
  const nodes = ['CUSTOMER','DONOR','MEMBER','PARTNER','STAFF','VENDOR']
  return <div className="cv-scene cv-enterprise">
    <div className="cv-scene-label"><span>RELATIONSHIP SYSTEM</span><strong>One operating record</strong></div>
    <div className="cv-relationship-map">
      {nodes.map((node, index) => <div className={`cv-rel-node node-${index + 1}`} key={node}><small>{String(index + 1).padStart(2,'0')}</small><b>{node}</b></div>)}
      <div className="cv-rel-core"><span>11-11</span><strong>RELATIONSHIP<br/>CORE</strong><Pulse/></div>
      <div className="cv-rel-ring" aria-hidden="true"/>
    </div>
    <div className="cv-footline"><span>CRM</span><span>Workflow</span><span>Portal</span><span>Reporting</span></div>
  </div>
}

function AiVisual() {
  const steps = ['INPUT','KNOWLEDGE','MODEL','TOOLS','HUMAN','ACTION']
  return <div className="cv-scene cv-ai">
    <div className="cv-scene-label"><span>INTELLIGENT WORKFLOW</span><strong>AI with boundaries</strong></div>
    <div className="cv-ai-flow">{steps.map((step, index) => <div className="cv-ai-step" key={step}><small>{String(index + 1).padStart(2,'0')}</small><b>{step}</b>{index < steps.length - 1 && <i aria-hidden="true">→</i>}</div>)}<Pulse/></div>
    <div className="cv-ai-control"><span>APPROVED DATA</span><span>PERMISSIONS</span><span>EVALUATION</span><span>HUMAN CONTROL</span></div>
  </div>
}

function SoftwareVisual() {
  const layers = [['01','WEB / MOBILE'],['02','API'],['03','BUSINESS LOGIC'],['04','DATA'],['05','CLOUD']]
  return <div className="cv-scene cv-software">
    <div className="cv-scene-label"><span>PLATFORM ARCHITECTURE</span><strong>Built in layers</strong></div>
    <div className="cv-stack">{layers.map(([index, label]) => <div className="cv-stack-layer" key={label}><small>{index}</small><b>{label}</b><span/></div>)}<Pulse/></div>
    <div className="cv-footline"><span>Integrate</span><span>Deploy</span><span>Observe</span><span>Improve</span></div>
  </div>
}

function TransformationVisual() {
  return <div className="cv-scene cv-transform">
    <div className="cv-scene-label"><span>OPERATING MODEL</span><strong>Fragmented → Connected</strong></div>
    <div className="cv-transform-stage">
      <div className="cv-transform-side"><small>TODAY</small><div className="cv-fragments"><span>EMAIL</span><span>SHEETS</span><span>CHAT</span><span>FILES</span><span>MANUAL</span></div></div>
      <div className="cv-transform-arrow">→</div>
      <div className="cv-transform-side target"><small>TARGET STATE</small><div className="cv-target-flow"><span>PEOPLE</span><i>→</i><span>PROCESS</span><i>→</i><span>SYSTEMS</span><i>→</i><span>DATA</span><i>→</i><span>INTELLIGENCE</span></div><Pulse/></div>
    </div>
  </div>
}

function TalentVisual() {
  const skills = ['FRONT-END','AI / DATA','CLOUD','PRODUCT','UX','QA']
  return <div className="cv-scene cv-talent">
    <div className="cv-scene-label"><span>TECHNOLOGY TALENT</span><strong>Need → Match → Team</strong></div>
    <div className="cv-talent-stage"><div className="cv-role-need"><small>ROLE NEED</small><strong>BUILD THE<br/>RIGHT TEAM</strong></div><div className="cv-skill-field">{skills.map((skill, index) => <span className={index < 3 ? 'matched' : ''} key={skill}>{skill}</span>)}</div><div className="cv-match-score"><small>MATCH</small><strong>92</strong><i>%</i><Pulse/></div></div>
    <div className="cv-footline"><span>Source</span><span>Assess</span><span>Match</span><span>Onboard</span></div>
  </div>
}

function TrustVisual() {
  const checks = ['IDENTITY','ACCESS','EVIDENCE','AUDIT','TEST','VERIFY']
  return <div className="cv-scene cv-trust">
    <div className="cv-scene-label"><span>ENGINEERING ASSURANCE</span><strong>Trust is a chain</strong></div>
    <div className="cv-trust-chain">{checks.map((check, index) => <div key={check}><small>{String(index + 1).padStart(2,'0')}</small><b>{check}</b><span>✓</span></div>)}<Pulse/></div>
    <div className="cv-trust-result"><span>RELEASE STATE</span><strong>VERIFIED</strong></div>
  </div>
}

export function CapabilityVisual({ id }: { id: CapabilityId }) {
  return <div className={`capability-visual capability-visual-v21 visual-${id}`} aria-label={`${id} service model`}>
    {id === 'ui-ux' && <UiUxVisual />}
    {id === 'enterprise' && <EnterpriseVisual />}
    {id === 'ai' && <AiVisual />}
    {id === 'software-data-cloud' && <SoftwareVisual />}
    {id === 'transformation' && <TransformationVisual />}
    {id === 'talent' && <TalentVisual />}
    {id === 'trust' && <TrustVisual />}
  </div>
}
