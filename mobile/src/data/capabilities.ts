export type CapabilityId = 'ui-ux' | 'enterprise' | 'ai' | 'software-data-cloud' | 'transformation' | 'talent' | 'trust'

export type Capability = {
  id: CapabilityId
  index: string
  title: string
  shortTitle: string
  verb: string
  proposition: string
  problem: string
  implementation: string[]
  projects: string[]
}

export const capabilities: Capability[] = [
  { id: 'ui-ux', index: '01', title: 'UI/UX & Front-End Engineering', shortTitle: 'UI/UX', verb: 'Improve an experience', proposition: 'Make complex technology easier, faster and better to use.', problem: 'Powerful products lose value when navigation is confusing, workflows are slow, mobile experiences break and users cannot see what the system is doing.', implementation: ['UX audit and journey mapping', 'Product interface redesign', 'Design systems and accessibility', 'Production React / TypeScript front ends'], projects: ['carup', 'healthtimes', 'alt-game-center'] },
  { id: 'enterprise', index: '02', title: 'Enterprise Systems & CRM', shortTitle: 'Enterprise Systems', verb: 'Connect operations', proposition: 'Connect the people, relationships, workflows and information that run your organization.', problem: 'Organizations often run across spreadsheets, email, chat, disconnected databases and manual handoffs with no dependable source of operational truth.', implementation: ['Process and relationship modeling', 'CRM / DRM / GRM workflows', 'Role-based portals', 'Migration, reporting and integrations'], projects: ['church-os', 'carup', 'sessions'] },
  { id: 'ai', index: '03', title: 'AI & Intelligent Automation', shortTitle: 'AI & Automation', verb: 'Automate intelligent work', proposition: 'Apply AI where it can improve work, decisions, service and productivity.', problem: 'Teams lose time searching, copying, classifying, drafting, checking and moving information between tools while useful knowledge stays hard to access.', implementation: ['AI opportunity assessment', 'Assistants, agents and RAG', 'Human approval boundaries', 'Evaluation, monitoring and cost controls'], projects: ['morning-pulse', 'church-os', 'healthtimes'] },
  { id: 'software-data-cloud', index: '04', title: 'Software, Data & Cloud Engineering', shortTitle: 'Software & Cloud', verb: 'Build digital infrastructure', proposition: 'Engineer the digital infrastructure behind modern organizations.', problem: 'Disconnected software, brittle integrations, duplicate data and legacy architecture make it difficult to launch products or change operations safely.', implementation: ['Application architecture', 'APIs and systems integration', 'Data models and pipelines', 'Cloud delivery, CI/CD and testing'], projects: ['carup', 'sessions', 'healthtimes'] },
  { id: 'transformation', index: '05', title: 'Digital Transformation & Technology Advisory', shortTitle: 'Transformation', verb: 'Modernise how work happens', proposition: 'Change how the organization works, not simply which software it uses.', problem: 'Many organizations know operations are inefficient but do not yet know whether the answer is a new system, better process, AI, integration or a different operating model.', implementation: ['Technology audit', 'Process mapping', 'Target architecture and roadmap', 'Prioritized implementation and adoption'], projects: ['healthtimes', 'church-os', 'morning-pulse'] },
  { id: 'talent', index: '06', title: 'Technology Talent & IT Recruitment', shortTitle: 'Technology Talent', verb: 'Build a technical team', proposition: 'Build the technical workforce required to execute the strategy.', problem: 'Technology hiring fails when role definitions are vague, sourcing is generic and hiring managers carry too much coordination work.', implementation: ['Role discovery and skill modeling', 'Talent mapping and sourcing', 'Technical screening', 'Pipeline reporting and onboarding support'], projects: [] },
  { id: 'trust', index: '07', title: 'Trust, Security & Engineering Assurance', shortTitle: 'Trust & Assurance', verb: 'Make a system trustworthy', proposition: 'Make digital systems trustworthy, resilient and production-ready.', problem: 'A system can look complete while permissions, evidence, privacy, testing, data isolation or operational recovery remain weak.', implementation: ['Architecture and permission review', 'Evidence and audit patterns', 'Automated tests and UAT', 'Release certification and remediation'], projects: ['carup', 'healthtimes'] },
]

export function getCapability(id?: string) { return capabilities.find((item) => item.id === id) }
