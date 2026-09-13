export type Project = {
  slug: string
  name: string
  category: string
  status: string
  region: string
  description: string
  focus: string[]
  accent: string
}

export const projects: Project[] = [
  { slug: 'carup', name: 'CarUp', category: 'Mobility', status: 'Active build', region: 'Zimbabwe / diaspora', accent: '#FF8E1E', description: 'Automotive marketplace and trust network connecting listings with vehicle identity, evidence, seller workflows and intelligence.', focus: ['Vehicle Digital Passport and evidence-led trust', 'Seller, buyer, garage and marketplace lifecycle', 'Zimbabwe and diaspora market context'] },
  { slug: 'church-os', name: 'Church OS', category: 'Community', status: 'Advanced build', region: 'Global', accent: '#E9692B', description: 'A multi-surface operating system for church operations, member journeys, communications, care, governance and shared AI context.', focus: ['Member journey and pastoral-care operations', 'Tenant, privacy and privileged-security boundaries', 'Shared AI context with operational governance'] },
  { slug: 'sessions', name: 'Sessions', category: 'Commerce', status: 'Active build', region: 'Zimbabwe', accent: '#F0B323', description: 'Mobile-first rehearsal infrastructure marketplace with studio discovery, provider operations, booking integrity and marketplace governance.', focus: ['Real studio registry and provider ownership', 'Room availability, booking integrity and settlement controls', 'Customer, provider and corporate surfaces on one product domain'] },
  { slug: 'healthtimes', name: 'HealthTimes 2.1', category: 'Media', status: 'Client review', region: 'Zimbabwe', accent: '#72AF4C', description: 'Modernized premium health publication with newsroom workflows, mobile UX, subscriber systems, advertising and HealthTimes Intelligence.', focus: ['Premium reader and publication experience', 'Role-governed newsroom and advertising operations', 'PWA/mobile packaging and client-review certification'] },
  { slug: 'morning-pulse', name: 'Morning Pulse', category: 'Media', status: 'Product build', region: 'Zimbabwe / diaspora', accent: '#00C6C1', description: 'AI-assisted news platform combining an interactive news experience with a full digital newsroom and editorial workflow.', focus: ['Interactive news discovery and AI-assisted Q&A', 'Editorial workflow and stakeholder operations', 'Zimbabwe-first media product model'] },
  { slug: 'direkt', name: 'DIREKT', category: 'Trust', status: 'Pilot readiness', region: 'Zambia', accent: '#00ECFF', description: 'Verification-led local services marketplace for trusted discovery of plumbers, electricians, mechanics and other providers.', focus: ['Evidence-backed verification rather than generic badges', 'Android-first customer/provider experience with web/PWA parity', 'Controlled pilot and operations readiness'] },
  { slug: 'alt-game-center', name: 'ALT Game Center', category: 'Education', status: 'In use / evolving', region: 'Japan', accent: '#CBFAFF', description: 'Moderator-first classroom games for ALTs in Japan, built around fast keyboard control, visible scoring, hints and reusable grammar activities.', focus: ['Classroom-first keyboard moderation', 'Reusable JHS activities across grades and grammar targets', 'Fast visual interaction for projector-based teaching'] },
]

export function getProject(slug?: string) { return projects.find((item) => item.slug === slug) }
