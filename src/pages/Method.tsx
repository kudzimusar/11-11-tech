import { PageHero } from '../components/PageHero'
import { media } from '../lib/media'

const steps=[['01','Discover','Problem, actors, constraints.'],['02','Establish truth','Code, data, roles, environments.'],['03','Design journeys','States, authority, responsive interaction.'],['04','Build in lanes','Small coherent changes, visible decisions.'],['05','Certify','Automation plus evidence-led UAT.'],['06','Launch','Known gaps, clear controls, no theatre.']]

export function Method(){return <>
  <PageHero index="05" kicker="Method" title={<>Discover. <span className="soft">Establish truth.</span></>}>Understand the operating system around the product. Then build the right digital layer.</PageHero>

  <section className="editorial-media reveal"><img src={media.systems} alt="Transparent digital infrastructure carrying blue signals"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>METHOD / CONTROLLED FLOW</span><h2>From ambiguity to a certifiable system.</h2></div></section>

  <section className="section"><div className="wrap"><div className="method-grid">{steps.map(([n,title,text])=><div className="method-step reveal" key={n}><div className="glyph">{n}</div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

  <section className="section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Documentation</div><h2>Make system truth portable.</h2></div><p>Plans, decisions and evidence should survive the person who wrote them.</p></div><div className="artifact-strip reveal"><div className="artifact"><h4>System truth register</h4><pre>{`SOURCE OF TRUTH\nAUTHORITY\nJOURNEY\nEVIDENCE\nKNOWN GAPS`}</pre></div><div className="artifact"><h4>Certification signal</h4><div className="bars animated-bars" aria-label="Illustrative certification progress bars">{Array.from({length:8},(_,i)=><span key={i}/>)}</div></div></div></div></section>
</>}
