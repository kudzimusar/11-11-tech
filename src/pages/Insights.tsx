import { PageHero } from '../components/PageHero'
import { Link } from '../components/Link'

const insights = [
  ['UI/UX','When your company needs a UX redesign—not a new backend','How to separate experience problems from architecture problems before committing to a rebuild.'],
  ['Enterprise Systems','What a serious CRM transformation should actually deliver','A practical view of relationship data, workflows, reporting, automation and adoption.'],
  ['AI','RAG vs AI agent vs automation','A buyer-friendly framework for choosing the right intelligent system pattern.'],
  ['Transformation','How to replace spreadsheet-based operations without creating a bigger mess','Start with the operating model, not the software logo.'],
  ['Trust','What makes a digital marketplace trustworthy','Identity, evidence, permissions, auditability and operational controls beyond badges.'],
  ['AI','AI adoption for SMEs: where to start','Find high-value, governable use cases before buying tools for every employee.'],
  ['Product','Tokyo-to-Africa product design','Designing digital products across different infrastructure, trust and operating realities.'],
]

export function Insights() {
  return <>
    <PageHero index="07" kicker="Insights" title={<>Useful thinking <span className="soft">before the engagement.</span></>}>Research, guides and practical frameworks that help buyers understand technology choices before they are ready to commission work.</PageHero>
    <section className="section"><div className="wrap insights-grid">{insights.map(([category,title,summary], index) => <article className="insight-card reveal" key={title}><span>{String(index + 1).padStart(2,'0')} · {category}</span><h2>{title}</h2><p>{summary}</p><small>Editorial programme · 11-11 Tech 2.0</small></article>)}</div></section>
    <section className="section alt-section"><div className="wrap investment-callout reveal"><div><div className="kicker">Need an answer for your organization?</div><h2>Turn the question into a scoped technology conversation.</h2><p>Insights are public. Specific recommendations require context about your users, systems, data and constraints.</p></div><Link className="btn primary" to="/contact">Start with your problem ↗</Link></div></section>
  </>
}
