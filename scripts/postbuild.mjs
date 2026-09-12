import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const dist = new URL('../dist/', import.meta.url)
const siteUrl = 'https://kudzimusar.github.io/11-11-tech'
const routes = {
  '/': ['11-11 Tech — UI/UX, AI, CRM, software and IT services', '11-11 Tech is a Tokyo-based IT services and technology implementation company providing UI/UX and front-end development, AI and automation, CRM and business systems, software/data/cloud engineering, digital transformation, IT recruitment and engineering assurance.'],
  '/work': ['Selected work by industry — 11-11 Tech', 'Explore selected 11-11 Tech technology work by industry, with product evidence separated from prototypes and Lab experiments.'],
  '/capabilities': ['IT Services — 11-11 Tech', 'Explore 11-11 Tech IT services: UI/UX and front-end, CRM and enterprise systems, AI and automation, software/data/cloud, digital transformation, IT recruitment, security and quality assurance.'],
  '/services': ['IT Services — 11-11 Tech', 'Explore the full 11-11 Tech IT service portfolio, implementation examples, outcomes, indicative pricing and delivery standards.'],
  '/capabilities/ui-ux': ['UI/UX & Front-End Engineering — 11-11 Tech', 'UX audits, product modernization, application and website redesign, front-end engineering, design systems, accessibility and interaction design.'],
  '/capabilities/enterprise': ['CRM & Enterprise Systems — 11-11 Tech', 'CRM, DRM, GRM, operational systems, portals, relationship management, workflow, reporting and enterprise integration.'],
  '/capabilities/ai': ['AI & Automation — 11-11 Tech', 'AI strategy, assistants, agents, chatbots, RAG, business automation, document intelligence, voice, multimodal AI and governance.'],
  '/capabilities/software-data-cloud': ['Software, Data & Cloud Engineering — 11-11 Tech', 'Custom software, web and mobile apps, APIs, integrations, data engineering, analytics, cloud, DevOps and platform modernization.'],
  '/capabilities/transformation': ['Digital Transformation & IT Consulting — 11-11 Tech', 'Technology audits, process redesign, roadmaps, architecture, fractional technology leadership, training and adoption.'],
  '/capabilities/talent': ['IT Recruitment & Technology Teams — 11-11 Tech', 'IT recruitment, RPO, technical screening, talent mapping and technical team building.'],
  '/capabilities/trust': ['Security, QA & Engineering Assurance — 11-11 Tech', 'Identity, permissions, verification, privacy, QA, UAT, architecture review and engineering assurance.'],
  '/solutions': ['Technology solutions — 11-11 Tech', 'Browse practical technology solutions including UX modernization, CRM, AI agents, RAG, automation, software, data, recruitment and assurance.'],
  '/industries': ['Industries — 11-11 Tech', 'IT services and technology solutions for automotive, nonprofit, media, education, commerce, property, recruitment and institutional operations.'],
  '/pricing': ['IT services pricing — 11-11 Tech', 'Indicative 11-11 Tech engagement pricing, typically from US$2,000 to US$10,000+, with custom enterprise scope available.'],
  '/trust': ['Trust Center — 11-11 Tech', 'Quality, confidentiality, security, contracting, NDA, MSA, SOW, SLA, DPA and procurement information for 11-11 Tech engagements.'],
  '/insights': ['Insights — 11-11 Tech', 'Practical thinking on UI/UX, CRM, enterprise systems, AI, transformation, marketplaces and trustworthy technology.'],
  '/about': ['About 11-11 Tech — IT services and technology implementation', '11-11 Tech is a Tokyo-based IT services company combining UI/UX, CRM and enterprise systems, AI implementation, software/data/cloud engineering, digital transformation, technology recruitment and assurance.'],
  '/vision': ['11-11 Lab — 11-11 Tech', 'Emerging technology, prototypes, experiments and product thinking from 11-11 Tech, clearly separated from commercial proof.'],
  '/method': ['How we work — 11-11 Tech', 'How 11-11 Tech discovers, designs, builds, launches, operates and improves technology with evidence and release discipline.'],
  '/contact': ['Start a technology project — 11-11 Tech', 'Tell 11-11 Tech what needs to change, select a service area, share scope and budget range, flag procurement requirements and create a structured project brief.'],
  '/policies': ['Public policies — 11-11 Tech', '11-11 Tech public policies covering privacy, website terms, accessibility, responsible AI, security and data principles.'],
}

const indexPath = join(dist.pathname, 'index.html')
const baseHtml = await readFile(indexPath, 'utf8')

function htmlFor(route, title, description) {
  const canonical = `${siteUrl}${route === '/' ? '/' : route + '/'}`
  return baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
}

for (const [route, [title, description]] of Object.entries(routes)) {
  if (route === '/') {
    await writeFile(indexPath, htmlFor(route, title, description))
    continue
  }
  const routeDir = join(dist.pathname, route.slice(1))
  await mkdir(routeDir, { recursive: true })
  await writeFile(join(routeDir, 'index.html'), htmlFor(route, title, description))
}

console.log(`Generated ${Object.keys(routes).length} GitHub Pages route documents.`)
