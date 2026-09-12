import { PageHero } from '../components/PageHero'
import { media } from '../lib/media'

export function Vision(){return <>
  <PageHero index="04" kicker="11-11 Lab" title={<>Build the <span className="soft">infrastructure.</span></>}>The long view: useful digital infrastructure around trust, commerce, mobility, information, education and community life.</PageHero>

  <section className="editorial-media reveal"><img src={media.global} alt="Connected nighttime city infrastructure spanning global regions"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>2030 / DIRECTION</span><h2>Useful technology, closer to real life.</h2></div></section>

  <section className="section"><div className="wrap"><div className="vision-stage reveal"><div className="vision-copy"><div className="kicker">Future direction</div><h2>Build connective tissue.</h2><p>Reduce uncertainty. Give people agency. Make difficult systems understandable.</p></div><div className="orbit"/><div className="vision-nodes"><div className="vision-node"><strong>Trust systems</strong><span>identity · evidence · reputation</span></div><div className="vision-node"><strong>Marketplace infrastructure</strong><span>mobility · services · venues</span></div><div className="vision-node"><strong>Responsible intelligence</strong><span>AI with visible boundaries</span></div><div className="vision-node"><strong>Access</strong><span>classroom · voice · media</span></div></div></div></div></section>

  <section className="section visual-story"><div className="wrap"><div className="visual-story-grid two-up"><article className="visual-story-card reveal"><img src={media.intelligence} alt="Connected evidence and intelligence objects" loading="lazy"/><div className="visual-story-overlay"><span>TRUST</span><h3>Evidence that can travel.</h3><p>Identity · provenance · reputation</p></div></article><article className="visual-story-card reveal"><img src={media.builders} alt="People building digital products in a modern studio" loading="lazy"/><div className="visual-story-overlay"><span>ACCESS</span><h3>AI that stays accountable.</h3><p>Voice · image · reasoning · boundaries</p></div></article></div></div></section>
</>}
