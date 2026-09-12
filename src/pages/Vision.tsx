import { useState } from 'react'
import { PageHero } from '../components/PageHero'
import { ProjectDialog } from '../components/ProjectDialog'
import { Link } from '../components/Link'
import { projects, type Project } from '../data/projects'
import { media } from '../lib/media'

const labSlugs = ['agentic-ai','characterforge','reverse-verify']

export function Vision(){
  const [selected, setSelected] = useState<Project | null>(null)
  const labProjects = labSlugs.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean) as Project[]
  return <>
  <PageHero index="12" kicker="11-11 Lab" title={<>Explore the next <span className="soft">technology pattern.</span></>}>The R&D layer of 11-11 Tech: agents, multimodal interaction, trust systems and reusable technology patterns tested before they become generic sales claims.</PageHero>

  <section className="editorial-media reveal"><img src={media.global} alt="Connected nighttime city infrastructure spanning global regions"/><div className="editorial-media-shade"/><div className="wrap editorial-media-copy"><span>R&D / PROTOTYPE / TRANSFER</span><h2>Useful experimentation, closer to real operating problems.</h2></div></section>

  <section className="section"><div className="wrap"><div className="vision-stage reveal"><div className="vision-copy"><div className="kicker">Future direction</div><h2>Build connective tissue.</h2><p>Reduce uncertainty. Give people agency. Make difficult systems understandable. Turn successful patterns into reusable capability.</p></div><div className="orbit"/><div className="vision-nodes"><div className="vision-node"><strong>Trust systems</strong><span>identity · evidence · reputation</span></div><div className="vision-node"><strong>Marketplace infrastructure</strong><span>mobility · services · venues</span></div><div className="vision-node"><strong>Responsible intelligence</strong><span>agents · tools · human boundaries</span></div><div className="vision-node"><strong>Multimodal access</strong><span>voice · image · media · interaction</span></div></div></div></div></section>

  <section className="section alt-section"><div className="wrap"><div className="section-head tight reveal"><div><div className="kicker">Active lab signals</div><h2>Experiments are labeled as experiments.</h2></div><p>The Lab demonstrates direction and engineering patterns. It does not convert prototypes into fabricated production deployments.</p></div><div className="proof-project-grid">{labProjects.map((project) => <button className="proof-project reveal" type="button" key={project.slug} onClick={() => setSelected(project)}><span>{project.category} · {project.status}</span><h3>{project.name}</h3><p>{project.description}</p><b>Open project evidence ↗</b></button>)}</div></div></section>

  <section className="section visual-story"><div className="wrap"><div className="visual-story-grid two-up"><article className="visual-story-card reveal"><img src={media.intelligence} alt="Connected evidence and intelligence objects" loading="lazy"/><div className="visual-story-overlay"><span>TRUST</span><h3>Evidence that can travel.</h3><p>Identity · provenance · reputation</p></div></article><article className="visual-story-card reveal"><img src={media.builders} alt="People building digital products in a modern studio" loading="lazy"/><div className="visual-story-overlay"><span>ACCESS</span><h3>AI that stays accountable.</h3><p>Voice · image · reasoning · boundaries</p></div></article></div></div></section>

  <section className="section assurance-section"><div className="wrap investment-callout reveal"><div><div className="kicker">From lab to client value</div><h2>Use the pattern when the problem justifies it.</h2><p>Lab work can inform a scoped AI, trust, product or automation engagement without forcing experimental technology into a client environment.</p></div><div><Link className="btn primary" to="/capabilities/ai">Explore AI capability ↗</Link><Link className="btn ghost" to="/work">See all proof</Link></div></div></section>
  <ProjectDialog project={selected} onClose={() => setSelected(null)}/>
</>}
