import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const dist = new URL('../dist/', import.meta.url)
const siteUrl = 'https://kudzimusar.github.io/11-11-tech'
const routes = {
  '/': ['11-11 Tech — Tokyo product engineering for global systems', '11-11 Tech builds trustworthy software, apps, marketplaces, operating systems and technical documentation from Tokyo for global markets.'],
  '/work': ['Work — 11-11 Tech', 'Explore 11-11 Tech product work across mobility, health, media, marketplaces, trust systems, education and community infrastructure.'],
  '/services': ['Services — 11-11 Tech', 'Product strategy, web and app engineering, platform recovery, AI product design, technical documentation, QA and deployment systems.'],
  '/about': ['About — 11-11 Tech', 'Meet 11-11 Tech, a Tokyo-based technology studio combining software, product strategy, documentation and cross-market operating experience.'],
  '/vision': ['11-11 Lab — 11-11 Tech', 'The 11-11 Tech long view: trustworthy digital infrastructure for mobility, commerce, information, education and community life.'],
  '/method': ['Method — 11-11 Tech', 'How 11-11 Tech discovers the real problem, establishes system truth, builds in controlled lanes and certifies important journeys.'],
  '/contact': ['Start a project — 11-11 Tech', 'Start a project with 11-11 Tech. Share the context, current state, goals, budget range and target timeline for your product or platform.'],
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
