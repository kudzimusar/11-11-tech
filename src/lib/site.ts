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
  '/': { title: '11-11 Tech — UI/UX, enterprise systems, AI and technology transformation', description: '11-11 Tech is a Tokyo-based technology company spanning UI/UX, front-end engineering, enterprise systems, AI implementation, software, data, cloud, transformation, technology talent and trust.' },
  '/work': { title: 'Work & proof — 11-11 Tech', description: 'Explore 22 technology initiatives mapped to UI/UX, enterprise systems, AI, software, transformation, talent and trust capabilities.' },
  '/capabilities': { title: 'Capabilities — 11-11 Tech', description: 'Explore 11-11 Tech capabilities across UI/UX, CRM and enterprise systems, AI and automation, software/data/cloud, transformation, IT recruitment and engineering assurance.' },
  '/services': { title: 'Capabilities — 11-11 Tech', description: 'Explore the full 11-11 Tech service portfolio, implementation examples, outcomes, pricing and proof.' },
  '/solutions': { title: 'Solutions — 11-11 Tech', description: 'Browse specific technology solutions including UX modernization, CRM, AI agents, RAG, automation, custom software, data, recruitment and assurance.' },
  '/industries': { title: 'Industries — 11-11 Tech', description: 'Technology solutions for automotive, nonprofit, media, education, commerce, property, recruitment and institutional operations.' },
  '/pricing': { title: 'Pricing — 11-11 Tech', description: 'Indicative 11-11 Tech engagement pricing, typically from US$2,000 to US$10,000+, with custom enterprise scope available.' },
  '/trust': { title: 'Trust Center — 11-11 Tech', description: '11-11 Tech quality, confidentiality, security, contracting, NDA, MSA, SOW, SLA, DPA and procurement information.' },
  '/insights': { title: 'Insights — 11-11 Tech', description: 'Practical thinking on UI/UX, enterprise systems, AI, digital transformation, marketplaces and trustworthy technology.' },
  '/about': { title: 'Company — 11-11 Tech', description: 'Meet 11-11 Tech, a Tokyo-based technology company combining product experience, software, AI, transformation and cross-market operating experience.' },
  '/vision': { title: '11-11 Lab — 11-11 Tech', description: 'Emerging technology, experimentation and product thinking from 11-11 Tech.' },
  '/method': { title: 'Method — 11-11 Tech', description: 'How 11-11 Tech discovers, designs, builds, launches, operates and improves technology with evidence and release discipline.' },
  '/contact': { title: 'Start a project — 11-11 Tech', description: 'Classify your technology need, select a capability, share scope and budget range, flag procurement requirements and create a structured project brief.' },
  '/policies': { title: 'Public policies — 11-11 Tech', description: '11-11 Tech public policies covering privacy, website terms, accessibility, responsible AI, security and data principles.' },
}

export function normalizeRoute(pathname: string, basePath: string): string {
  let path = pathname
  const base = basePath.replace(/\/$/, '')
  if (base && path.startsWith(base)) path = path.slice(base.length)
  if (!path || path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}`
}
