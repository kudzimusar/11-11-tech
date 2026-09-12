import { PageHero } from '../components/PageHero'
import { Disclosure } from '../components/Disclosure'
import { Link } from '../components/Link'

const publicItems = [
  ['Quality & Delivery Standard','Defined scope, acceptance criteria, version control, testing, UAT, deployment evidence and documented handover are applied proportionately to the engagement.'],
  ['Confidentiality','A mutual NDA can be used before detailed discovery when sensitive product, business, architecture or operational information needs to be shared. Client-provided NDAs can also be reviewed.'],
  ['Security & Privacy','Access, data handling, permissions and security controls are defined according to the service, risk and agreed scope.'],
  ['Responsible AI','AI projects define model/provider dependencies, data boundaries, human oversight, evaluation criteria and production controls before launch.'],
  ['Intellectual Property','Ownership, licensing, pre-existing IP and reusable delivery assets are documented in the relevant agreement and Statement of Work.'],
  ['Accessibility','Accessibility expectations are agreed for the engagement and implemented proportionately to product context, audience and scope.'],
]

const requested = ['Mutual NDA template','Sample Master Services Agreement (MSA)','Sample Statement of Work (SOW)','Sample Service Level Agreement (SLA)','Data Processing Agreement (DPA)','Security / procurement information pack','Detailed AI and data-handling appendix']
const projectSpecific = ['Executed NDA / MSA','Final Statement of Work','Final SLA or support schedule','Order form / purchase order','DPA and project-specific data terms','Change orders','Acceptance / handover records']

export function Trust() {
  return <>
    <PageHero index="06" kicker="Trust Center" title={<>Quality, confidentiality and contracting <span className="soft">before complexity arrives.</span></>}>Public standards explain how 11-11 Tech works. Detailed legal and procurement documents are shared when a real opportunity requires them. Binding project documents are agreed for the specific engagement.</PageHero>
    <section className="section"><div className="wrap"><div className="trust-level-grid">
      <article className="trust-level reveal"><span>01 / PUBLIC</span><h2>Available to everyone</h2><p>How we approach quality, security, privacy, AI, accessibility, IP and commercial delivery.</p></article>
      <article className="trust-level reveal"><span>02 / ON REQUEST</span><h2>For qualified prospects</h2><p>Standard contracting, security and procurement documents used during serious evaluation.</p></article>
      <article className="trust-level reveal"><span>03 / PROJECT-SPECIFIC</span><h2>Agreed for the engagement</h2><p>Executed agreements, final scope, SLA, data terms, change orders and acceptance records.</p></article>
    </div></div></section>

    <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Public standards</div><h2>Open the detail you need.</h2></div><p>These summaries are commercial information, not a substitute for signed legal terms.</p></div><div className="capability-disclosures">{publicItems.map(([title,summary]) => <Disclosure key={title} title={title} summary={summary}><p>{summary}</p><Link className="text-link" to="/policies">Read public policies ↗</Link></Disclosure>)}</div></div></section>

    <section className="section"><div className="wrap trust-document-grid"><article className="reveal"><div className="kicker">Available on request</div><h2>Contracting & procurement pack</h2><p>These documents do not need to be anonymously downloadable to every visitor. They can be shared with qualified clients, legal teams, security teams and procurement contacts.</p><ul className="plain-list">{requested.map((item) => <li key={item}>{item}</li>)}</ul><Link className="btn primary" to="/contact?procurement=true">Request contracting pack ↗</Link></article><article className="reveal"><div className="kicker">Project-specific</div><h2>Documents that bind real work</h2><p>These are prepared or finalized for the actual commercial relationship rather than published as generic web downloads.</p><ul className="plain-list">{projectSpecific.map((item) => <li key={item}>{item}</li>)}</ul></article></div></section>

    <section className="section assurance-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Warranty · support · SLA</div><h2>Three different commitments.</h2></div><p>They should not be treated as interchangeable.</p></div><div className="commercial-model-grid"><article><span>Warranty</span><h3>Defects against agreed scope.</h3><p>A defined post-acceptance correction period may be included in the project terms.</p></article><article><span>Support</span><h3>Ongoing paid assistance.</h3><p>Maintenance, updates, minor changes, technical support and product improvement.</p></article><article><span>SLA</span><h3>Measurable service commitments.</h3><p>Response times, availability, escalation, maintenance windows and related service measures where applicable.</p></article><article><span>Procurement</span><h3>Corporate onboarding.</h3><p>NDA, security review, DPA, vendor registration, insurance or purchase-order requirements can be planned early.</p></article></div></div></section>
  </>
}
