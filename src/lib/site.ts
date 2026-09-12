export const siteUrl = 'https://kudzimusar.github.io/11-11-tech'

export const routes = [
  '/',
  '/work',
  '/services',
  '/about',
  '/vision',
  '/method',
  '/contact',
  '/policies',
] as const

export type RoutePath = (typeof routes)[number]

export const routeMeta: Record<RoutePath, { title: string; description: string }> = {
  '/': {
    title: '11-11 Tech — Tokyo product engineering for global systems',
    description: '11-11 Tech builds trustworthy software, apps, marketplaces, operating systems and technical documentation from Tokyo for global markets.',
  },
  '/work': {
    title: 'Work — 11-11 Tech',
    description: 'Explore 11-11 Tech product work across mobility, health, media, marketplaces, trust systems, education and community infrastructure.',
  },
  '/services': {
    title: 'Services — 11-11 Tech',
    description: 'Product strategy, web and app engineering, platform recovery, AI product design, technical documentation, QA and deployment systems.',
  },
  '/about': {
    title: 'About — 11-11 Tech',
    description: 'Meet 11-11 Tech, a Tokyo-based technology studio combining software, product strategy, documentation and cross-market operating experience.',
  },
  '/vision': {
    title: '11-11 Lab — 11-11 Tech',
    description: 'The 11-11 Tech long view: trustworthy digital infrastructure for mobility, commerce, information, education and community life.',
  },
  '/method': {
    title: 'Method — 11-11 Tech',
    description: 'How 11-11 Tech discovers the real problem, establishes system truth, builds in controlled lanes and certifies important journeys.',
  },
  '/contact': {
    title: 'Start a project — 11-11 Tech',
    description: 'Start a project with 11-11 Tech. Share the context, current state, goals, budget range and target timeline for your product or platform.',
  },
  '/policies': {
    title: 'Public policies — 11-11 Tech',
    description: '11-11 Tech public policies covering privacy, website terms, accessibility, responsible AI, security and data principles.',
  },
}

export function normalizeRoute(pathname: string, basePath: string): string {
  let path = pathname
  const base = basePath.replace(/\/$/, '')
  if (base && path.startsWith(base)) path = path.slice(base.length)
  if (!path || path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}`
}
