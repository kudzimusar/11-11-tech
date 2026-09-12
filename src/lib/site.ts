export const siteUrl = 'https://kudzimusar.github.io/11-11-tech'

export const routes = [
  '/',
  '/work',
  '/capabilities',
  '/services',
  '/solutions',
  '/industries',
  '/pricing',
  '/trust',
  '/insights',
  '/about',
  '/vision',
  '/method',
  '/contact',
  '/policies',
] as const

export type RoutePath = (typeof routes)[number]

export const routeMeta: Record<RoutePath, { title: string; description: string }> = {
  '/': { title: '11-11 Tech — UI/UX, AI, CRM, software and IT services', description: '11-11 Tech is a Tokyo-based IT services and technology implementation company providing UI/UX and front-end development, AI and automation, CRM and business systems, software/data/cloud engineering, digital transformation, IT recruitment and engineering assurance.' },
  '/work': { title: 'Selected work by industry — 11-11 Tech', description: 'Explore selected 11-11 Tech technology work by industry, with product evidence separated from prototypes and Lab experiments.' },
  '/capabilities': { title: 'IT Services — 11-11 Tech', description: 'Explore 11-11 Tech IT services: UI/UX and front-end, CRM and enterprise systems, AI and automation, software/data/cloud, digital transformation, IT recruitment, security and quality assurance.' },
  '/services': { title: 'IT Services — 11-11 Tech', description: 'Explore the full 11-11 Tech IT service portfolio, implementation examples, outcomes, indicative pricing and delivery standards.' },
  '/solutions': { title: 'Technology solutions — 11-11 Tech', description: 'Browse practical technology solutions including UX modernization, CRM, AI agents, RAG, automation, custom software, data, recruitment and engineering assurance.' },
  '/industries': { title: 'Industries — 11-11 Tech', description: 'IT services and technology solutions for automotive, nonprofit, media, education, commerce, property, recruitment and institutional operations.' },
  '/pricing': { title: 'IT services pricing — 11-11 Tech', description: 'Indicative 11-11 Tech engagement pricing, typically from US$2,000 to US$10,000+, with custom enterprise scope available.' },
  '/trust': { title: 'Trust Center — 11-11 Tech', description: '11-11 Tech quality, confidentiality, security, contracting, NDA, MSA, SOW, SLA, DPA and procurement information.' },
  '/insights': { title: 'Insights — 11-11 Tech', description: 'Practical thinking on UI/UX, enterprise systems, CRM, AI, digital transformation, marketplaces and trustworthy technology.' },
  '/about': { title: 'About 11-11 Tech — IT services and technology implementation', description: '11-11 Tech is a Tokyo-based IT services company combining UI/UX, CRM and enterprise systems, AI implementation, software/data/cloud engineering, digital transformation, technology recruitment and assurance.' },
  '/vision': { title: '11-11 Lab — 11-11 Tech', description: 'Emerging technology, prototypes, experiments and product thinking from 11-11 Tech, clearly separated from commercial proof.' },
  '/method': { title: 'How we work — 11-11 Tech', description: 'How 11-11 Tech discovers, designs, builds, launches, operates and improves technology with evidence and release discipline.' },
  '/contact': { title: 'Start a technology project — 11-11 Tech', description: 'Tell 11-11 Tech what needs to change, select a service area, share scope and budget range, flag procurement requirements and create a structured project brief.' },
  '/policies': { title: 'Public policies — 11-11 Tech', description: '11-11 Tech public policies covering privacy, website terms, accessibility, responsible AI, security and data principles.' },
}

export function normalizeRoute(pathname: string, basePath: string): string {
  let path = pathname
  const base = basePath.replace(/\/$/, '')
  if (base && path.startsWith(base)) path = path.slice(base.length)
  if (!path || path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}`
}
