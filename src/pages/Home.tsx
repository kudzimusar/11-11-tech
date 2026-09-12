import { Link } from '../components/Link'
import { MotionHero } from '../components/MotionHero'
import { SystemField } from '../components/SystemField'
import { media } from '../lib/media'

export function Home() {
  return <>
    <section className="media-hero">
      <MotionHero />
      <div className="wrap media-hero-copy reveal">
        <span className="eyebrow">11-11 Tech · Tokyo</span>
        <h1>Systems that <span className="soft">move real life.</span></h1>
        <p>We engineer trustworthy digital products where identity, evidence, intelligence and operations have to work together.</p>
        <div className="hero-actions"><Link className="btn primary" to="/work">Explore the work ↗</Link><Link className="btn glass" to="/contact">Start a project</Link></div>
        <div className="hero-proof" aria-label="Core capabilities"><span>PRODUCT</span><span>PLATFORM</span><span>AI</span><span>TRUST</span></div>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span />SCROLL TO ENTER</div>
    </section>

    <section className="band"><div className="wrap band-inner"><span className="band-label">Building through</span><div className="marquee"><span>Product engineering</span><i>◆</i><span>AI workflows</span><i>◆</i><span>Trust infrastructure</span><i>◆</i><span>Mobile + web</span><i>◆</i><span>Certification</span><i>◆</i><span>Technical systems</span></div></div></section>

    <section className="section system-section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">The system is the product</div><h2>See the signals move.</h2></div><p>Interfaces are only one surface. We design the authority, evidence and operational movement underneath them.</p></div>
      <SystemField />
    </div></section>

    <section className="section visual-story"><div className="wrap">
      <div className="visual-story-grid">
        <article className="visual-story-card wide reveal"><img src={media.systems} alt="Abstract glass infrastructure with blue data signals" loading="lazy"/><div className="visual-story-overlay"><span>01 / SYSTEMS</span><h3>Complexity, made legible.</h3><p>Architecture · authority · flow</p></div></article>
        <article className="visual-story-card reveal"><img src={media.builders} alt="Technology builders working with spatial prototypes in a Tokyo studio" loading="lazy"/><div className="visual-story-overlay"><span>02 / HUMAN</span><h3>Technology with context.</h3><p>People · place · adoption</p></div></article>
        <article className="visual-story-card reveal"><img src={media.global} alt="Nighttime city infrastructure connected by luminous global routes" loading="lazy"/><div className="visual-story-overlay"><span>03 / SCALE</span><h3>Tokyo-built. Globally useful.</h3><p>Africa · Europe · Americas</p></div></article>
      </div>
    </div></section>

    <section className="section"><div className="wrap">
      <div className="section-head tight reveal"><div><div className="kicker">Selected systems</div><h2>Different markets. Same discipline.</h2></div><Link className="text-link" to="/work">Full portfolio ↗</Link></div>
      <div className="media-cases">
        <article className="media-case reveal"><img src={media.intelligence} alt="Sculptural digital system of devices, evidence and connected services" loading="lazy"/><div className="media-case-copy"><span>Mobility · Zimbabwe</span><h3>CarUp</h3><p>Vehicle identity, evidence and marketplace trust.</p></div></article>
        <article className="media-case reveal"><img src={media.builders} alt="Product builders in a modern technology studio" loading="lazy"/><div className="media-case-copy"><span>Commerce · Zimbabwe</span><h3>Sessions</h3><p>Studio discovery, booking integrity and provider operations.</p></div></article>
        <article className="media-case reveal"><img src={media.systems} alt="Layered blue digital infrastructure" loading="lazy"/><div className="media-case-copy"><span>Community · Global</span><h3>Church OS</h3><p>Shared context, governance and multi-surface operations.</p></div></article>
      </div>
    </div></section>

    <section className="full-bleed-media reveal">
      <img src={media.global} alt="Connected urban infrastructure spanning global regions" loading="lazy" />
      <div className="full-bleed-shade" aria-hidden="true" />
      <div className="wrap full-bleed-copy"><div className="kicker">Tokyo → world</div><h2>Local reality. Global engineering standards.</h2><div className="route-dots"><span>Japan</span><span>Zimbabwe</span><span>Zambia</span><span>Europe</span><span>Americas</span></div></div>
    </section>

    <section className="section compact"><div className="wrap"><div className="metric-rail reveal"><Metric big="22" text="product builds & experiments"/><Metric big="4" text="primary service regions"/><Metric big="1→N" text="one truth, many surfaces"/><Metric big="11:11" text="build what matters"/></div></div></section>

    <section className="section"><div className="wrap"><div className="manifesto media-manifesto reveal"><blockquote>Build what matters. <span className="accent">Prove what works.</span></blockquote><div className="copy"><p>Product strategy, engineering, AI, documentation and certification—held to the same source of truth.</p><Link className="btn ghost" to="/method">See the method ↗</Link></div></div></div></section>
  </>
}

function Metric({big,text}:{big:string;text:string}) { return <div className="metric"><strong>{big}</strong><span>{text}</span></div> }
