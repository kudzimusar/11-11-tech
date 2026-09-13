export type CapabilityId = 'ui-ux' | 'enterprise' | 'ai' | 'software-data-cloud' | 'transformation' | 'talent' | 'trust'

export type ServiceOffer = {
  name: string
  summary: string
  examples: string[]
  price: string
  proof: string[]
}

export type Capability = {
  id: CapabilityId
  index: string
  title: string
  shortTitle: string
  proposition: string
  problem: string
  transformation: string
  systemThinking: string[]
  implementation: string[]
  outcomes: string[]
  services: ServiceOffer[]
  proof: string[]
  assurance: string[]
  startingAt: string
  typicalRange: string
}

export const capabilities: Capability[] = [
  {
    id: 'ui-ux', index: '01', title: 'UI/UX & Front-End Engineering', shortTitle: 'UI/UX',
    proposition: 'Make complex technology easier, faster and better to use.',
    problem: 'Powerful products lose value when navigation is confusing, workflows are slow, mobile experiences break, interfaces drift and users cannot see what the system is doing.',
    transformation: 'We audit the current experience, redesign the critical journeys, create a coherent interface system and engineer the production front end.',
    systemThinking: ['User goals and task flows', 'Information architecture', 'Interaction and state design', 'Design systems and accessibility', 'Front-end architecture', 'Performance and responsive behavior'],
    implementation: ['UX audit', 'Journey mapping', 'Wireframes and prototypes', 'UI redesign', 'Design system', 'React / TypeScript front end', 'Accessibility and performance certification'],
    outcomes: ['Faster task completion', 'Clearer product journeys', 'Stronger mobile experience', 'Consistent interface language', 'Reduced user friction', 'Production-ready front end'],
    services: [
      { name: 'UX Audit & Assessment', summary: 'Find the usability, navigation, accessibility and workflow problems that create friction.', examples: ['Heuristic review', 'Journey analysis', 'Mobile UX review', 'Accessibility review'], price: '$2,000–$3,000', proof: ['carup', 'alt-game-center'] },
      { name: 'Product Experience Modernization', summary: 'Transform an existing application, SaaS product, dashboard, CRM or portal without automatically replacing the whole backend.', examples: ['Application redesign', 'Dashboard redesign', 'Legacy UI modernization'], price: '$3,500–$6,500', proof: ['healthtimes', 'church-os'] },
      { name: 'Front-End Engineering', summary: 'Engineer responsive, accessible and maintainable interfaces for serious products and systems.', examples: ['React / TypeScript', 'Complex forms', 'Dashboards', 'Real-time interfaces', 'PWAs'], price: '$5,000–$10,000', proof: ['carup', 'sessions', 'alt-game-center'] },
      { name: 'Design Systems', summary: 'Create one reusable visual and interaction language across products and teams.', examples: ['Tokens', 'Component libraries', 'Interaction standards', 'Reusable React components'], price: '$4,000–$7,500', proof: ['church-os', 'healthtimes'] },
      { name: 'Interaction & Motion', summary: 'Use purposeful motion to explain state, hierarchy, progress and system behavior.', examples: ['Microinteractions', 'Animated data', 'State transitions', 'Interactive storytelling'], price: '$2,500–$5,500', proof: ['alt-game-center', 'morning-pulse'] },
    ],
    proof: ['carup', 'church-os', 'sessions', 'healthtimes', 'alt-game-center', 'direkt'],
    assurance: ['Defined review cycles and acceptance criteria', 'Supported device and browser scope agreed before build', 'Accessibility target agreed per engagement', 'NDA available for confidential product reviews'],
    startingAt: '$2,000', typicalRange: '$2,000–$10,000+',
  },
  {
    id: 'enterprise', index: '02', title: 'Enterprise Systems & CRM', shortTitle: 'Enterprise Systems',
    proposition: 'Connect the people, relationships, workflows and information that run your organization.',
    problem: 'Organizations often run across spreadsheets, email, chat, disconnected databases and manual handoffs, leaving no dependable source of operational truth.',
    transformation: 'We model the relationships that matter, connect workflows and data, and create an operating environment that makes responsibility, history and action visible.',
    systemThinking: ['Relationship core', 'CRM / DRM / GRM patterns', 'Case and membership workflows', 'Portals and role-based access', 'Communications and documents', 'Reporting, analytics and AI layers'],
    implementation: ['Discovery and process mapping', 'Data model', 'Workflow design', 'Portal and dashboard UX', 'Integrations', 'Migration', 'UAT, rollout and support'],
    outcomes: ['One source of truth', 'Less manual administration', 'Clearer accountability', 'Connected communications', 'Better reporting', 'Scalable operating workflows'],
    services: [
      { name: 'CRM Implementation & Modernization', summary: 'Set up, redesign, integrate or build the customer relationship system around the way your organization actually works.', examples: ['Sales pipeline', 'Account history', 'Service workflows', 'CRM automation'], price: '$3,000–$10,000+', proof: ['church-os', 'carup'] },
      { name: 'DRM Systems', summary: 'Relationship systems for donors, dealers or distributors, shaped to the client domain rather than a generic CRM label.', examples: ['Donor journeys', 'Dealer networks', 'Distributor activity', 'Engagement history'], price: '$5,000–$10,000+', proof: ['church-os', 'carup'] },
      { name: 'GRM & Institutional Systems', summary: 'Manage government, institutional and stakeholder relationships, correspondence, approvals and engagement history.', examples: ['Stakeholder registry', 'Case workflow', 'Approvals', 'Institutional correspondence'], price: '$6,000–$10,000+', proof: ['direkt', 'church-os'] },
      { name: 'Case, Membership & Beneficiary Systems', summary: 'Structure people, cases, journeys and service delivery around a governed operational record.', examples: ['Membership', 'Case management', 'Beneficiary workflows', 'Service history'], price: '$5,000–$10,000+', proof: ['church-os', 'schoolrun'] },
      { name: 'Operational Portals', summary: 'Secure portals for customers, staff, partners, dealers, providers and suppliers.', examples: ['Customer portal', 'Staff workspace', 'Partner portal', 'Provider administration'], price: '$5,000–$9,000', proof: ['sessions', 'carup'] },
    ],
    proof: ['church-os', 'carup', 'sessions', 'schoolrun', 'wewed', 'tengasell', 'growhome'],
    assurance: ['Data migration controls agreed before cutover', 'Role and permission architecture documented', 'Integration responsibilities defined in the SOW', 'UAT and support SLA options available'],
    startingAt: '$2,000', typicalRange: '$3,000–$10,000+',
  },
  {
    id: 'ai', index: '03', title: 'AI & Intelligent Automation', shortTitle: 'AI & Automation',
    proposition: 'Apply AI where it can improve work, decisions, service and productivity.',
    problem: 'Teams lose time searching, copying, classifying, drafting, checking and moving information between tools while valuable organizational knowledge remains difficult to access.',
    transformation: 'We identify high-value AI use cases, select appropriate models and tools, connect approved organizational data, add human control and deploy measurable workflows.',
    systemThinking: ['Model and provider choice', 'RAG and permission-aware knowledge', 'Agents and tool use', 'Human approval boundaries', 'Business-system integration', 'Evaluation, monitoring and cost controls'],
    implementation: ['AI opportunity assessment', 'Prototype', 'Modeling and orchestration', 'RAG / data integration', 'Agent or assistant implementation', 'Evaluation', 'Production rollout and adoption'],
    outcomes: ['Less repetitive work', 'Faster access to knowledge', 'Higher service capacity', 'Better decision support', 'Connected workflows', 'Governed AI adoption'],
    services: [
      { name: 'AI Strategy & Readiness', summary: 'Identify where AI can create measurable value and what data, governance and systems are required.', examples: ['Use-case discovery', 'AI readiness', 'Model selection', 'Implementation roadmap'], price: '$2,000–$3,000', proof: ['agentic-ai', 'morning-pulse'] },
      { name: 'Custom AI Assistants', summary: 'Purpose-built assistants for employees, operations, sales, HR, management or specific domain work.', examples: ['Employee assistant', 'Sales copilot', 'Operations copilot', 'HR assistant'], price: '$3,500–$6,000', proof: ['jd2cv', 'church-os'] },
      { name: 'AI Agents', summary: 'Agents that reason through multi-step tasks, use approved tools and return control to humans at defined boundaries.', examples: ['Research agent', 'Operations agent', 'Scheduling agent', 'Customer-service agent'], price: '$5,000–$10,000', proof: ['agentic-ai', 'morning-pulse'] },
      { name: 'Chatbots & Conversational AI', summary: 'Customer, website or internal conversational systems with routing, escalation and multilingual possibilities.', examples: ['Support bot', 'Lead qualification', 'Internal service bot'], price: '$3,000–$5,000', proof: ['morning-pulse', 'church-os'] },
      { name: 'RAG & Knowledge Systems', summary: 'Ground AI in approved documents, policies, manuals, databases and knowledge sources.', examples: ['Knowledge assistant', 'Semantic search', 'Source-grounded answers', 'Permission-aware retrieval'], price: '$4,000–$7,000', proof: ['church-os', 'healthtimes'] },
      { name: 'Business Process Automation', summary: 'Combine AI with rules, approvals, APIs, notifications and business workflows.', examples: ['Document routing', 'CRM automation', 'Email workflows', 'Approvals'], price: '$4,500–$8,000', proof: ['billify', 'morning-pulse'] },
      { name: 'Document Intelligence', summary: 'Extract, classify, compare and summarize operational documents at scale.', examples: ['Invoice processing', 'CV processing', 'Application review', 'Document comparison'], price: '$4,000–$7,500', proof: ['billify', 'jd2cv'] },
      { name: 'Voice & Multimodal AI', summary: 'Combine voice, text, image, audio, video and documents inside intelligent workflows.', examples: ['Voice agents', 'Transcription', 'Image-assisted workflows', 'Call summaries'], price: '$5,000–$10,000', proof: ['characterforge', 'agentic-ai'] },
      { name: 'AI Governance & Evaluation', summary: 'Define permissions, human oversight, evaluation, privacy, auditability and quality controls for production AI.', examples: ['Evaluation harness', 'Human approvals', 'Access boundaries', 'Usage controls'], price: '$2,500–$6,000', proof: ['church-os', 'agentic-ai'] },
    ],
    proof: ['agentic-ai', 'morning-pulse', 'jd2cv', 'characterforge', 'billify', 'church-os', 'healthtimes'],
    assurance: ['Model and third-party dependencies documented', 'Client-data handling defined before implementation', 'Human-control points defined for consequential actions', 'Evaluation criteria agreed before production acceptance'],
    startingAt: '$2,000', typicalRange: '$2,000–$10,000+',
  },
  {
    id: 'software-data-cloud', index: '04', title: 'Software, Data & Cloud Engineering', shortTitle: 'Software, Data & Cloud',
    proposition: 'Engineer the digital infrastructure behind modern organizations.',
    problem: 'Disconnected software, brittle integrations, duplicate data and legacy architecture make it difficult to launch products or change operations safely.',
    transformation: 'We design and implement maintainable applications, APIs, data layers, integrations and delivery systems that can evolve with the organization.',
    systemThinking: ['Web and mobile surfaces', 'APIs and business logic', 'Identity and integration', 'Data models and pipelines', 'Cloud delivery', 'Observability and resilience'],
    implementation: ['Architecture', 'Application engineering', 'API integration', 'Data modeling', 'Cloud and CI/CD', 'Testing', 'Deployment and handover'],
    outcomes: ['Reliable product delivery', 'Connected systems', 'Cleaner data architecture', 'Faster deployment', 'Lower operational friction', 'Modernization without unnecessary replacement'],
    services: [
      { name: 'Custom Software & Platforms', summary: 'Web applications, mobile/PWA products, SaaS, marketplaces, portals and internal systems.', examples: ['SaaS', 'Marketplace', 'Internal application', 'Booking platform'], price: '$5,000–$10,000+', proof: ['carup', 'sessions', 'wewed'] },
      { name: 'API & Systems Integration', summary: 'Connect existing applications, third-party services, payments, communications and data sources.', examples: ['REST APIs', 'Middleware', 'Payment integration', 'Legacy integration'], price: '$3,000–$7,000', proof: ['carup', 'sessions'] },
      { name: 'Data Engineering & Analytics', summary: 'Design reliable data models, pipelines, dashboards and operational intelligence.', examples: ['PostgreSQL', 'Data pipelines', 'Dashboards', 'Operational reporting'], price: '$3,500–$7,500', proof: ['morning-pulse', 'carup'] },
      { name: 'Cloud & DevOps', summary: 'Build repeatable deployment, environment, monitoring and recovery practices.', examples: ['CI/CD', 'Environment control', 'Monitoring', 'Backups'], price: '$3,000–$8,000', proof: ['healthtimes', 'carup'] },
      { name: 'Platform Modernization', summary: 'Recover or modernize legacy products, environments, databases and front ends.', examples: ['Architecture cleanup', 'Database migration', 'Cloud migration', 'Platform consolidation'], price: '$5,000–$10,000', proof: ['healthtimes', 'church-os'] },
    ],
    proof: ['carup', 'sessions', 'healthtimes', 'direkt', 'wewed', 'morning-pulse'],
    assurance: ['Architecture and environment boundaries documented', 'Version-controlled implementation', 'Testing and release gates proportional to risk', 'Deployment and handover evidence'],
    startingAt: '$2,000', typicalRange: '$3,000–$10,000+',
  },
  {
    id: 'transformation', index: '05', title: 'Digital Transformation & Technology Advisory', shortTitle: 'Digital Transformation',
    proposition: 'Change how the organization works, not simply which software it uses.',
    problem: 'Many organizations know that operations are inefficient but do not yet know whether the answer is a new system, better process, AI, integration, redesign or a different operating model.',
    transformation: 'We map the current state, identify unnecessary friction and risk, design the target operating model and sequence the technology changes that matter most.',
    systemThinking: ['People', 'Process', 'Systems', 'Data', 'Automation', 'Intelligence and governance'],
    implementation: ['Technology audit', 'Process mapping', 'Target architecture', 'Roadmap', 'Prioritized implementation', 'Training and adoption', 'Measurement'],
    outcomes: ['Clear technology priorities', 'Reduced duplication', 'Better cross-team workflows', 'Modern operating model', 'Lower transformation risk', 'Measurable implementation roadmap'],
    services: [
      { name: 'Technology Audit', summary: 'Understand the systems, process problems, duplication, risk and technical debt that exist today.', examples: ['System inventory', 'Process review', 'Technical debt', 'Risk map'], price: '$2,000–$3,500', proof: ['healthtimes', 'church-os'] },
      { name: 'Digital Transformation Roadmap', summary: 'Create a sequenced plan connecting business outcomes to technology investments.', examples: ['Target operating model', 'Roadmap', 'Prioritization', 'Implementation sequencing'], price: '$3,000–$6,000', proof: ['healthtimes', 'carup'] },
      { name: 'Process & Workflow Redesign', summary: 'Simplify manual handoffs and redesign how work moves across teams and systems.', examples: ['Workflow mapping', 'Automation opportunities', 'Process simplification'], price: '$3,000–$5,500', proof: ['church-os', 'morning-pulse'] },
      { name: 'Fractional Technology Leadership', summary: 'Provide architecture, product and technology leadership where a full-time role is not yet required.', examples: ['Fractional CTO', 'Project recovery', 'Vendor management', 'Architecture review'], price: 'Custom monthly', proof: ['carup', 'healthtimes'] },
      { name: 'Training & Technology Enablement', summary: 'Help staff and administrators adopt the technology, AI and workflows being introduced.', examples: ['AI training', 'Admin onboarding', 'Playbooks', 'Operating manuals'], price: '$2,000–$5,000', proof: ['alt-game-center', 'church-os'] },
    ],
    proof: ['healthtimes', 'church-os', 'carup', 'morning-pulse'],
    assurance: ['Recommendations tied to stated business outcomes', 'Assumptions and dependencies documented', 'Roadmaps separate must-have work from optional expansion', 'Confidential discovery available under NDA'],
    startingAt: '$2,000', typicalRange: '$2,000–$10,000+',
  },
  {
    id: 'talent', index: '06', title: 'Technology Talent & IT Recruitment', shortTitle: 'Technology Talent',
    proposition: 'Build the technical workforce required to execute the strategy.',
    problem: 'Technology hiring fails when role definitions are vague, sourcing is generic, screening does not test the right skills and hiring managers carry too much coordination work.',
    transformation: 'We combine technology context, recruitment operations and structured assessment to make technical hiring more targeted and easier to manage.',
    systemThinking: ['Workforce need', 'Role and skill model', 'Sourcing strategy', 'Qualification and screening', 'Interview process', 'Placement and onboarding'],
    implementation: ['Role discovery', 'Talent mapping', 'Sourcing', 'Screening', 'Interview support', 'Pipeline reporting', 'Onboarding support'],
    outcomes: ['Clearer technical roles', 'Better candidate matching', 'Shorter hiring cycles', 'Reduced hiring-manager load', 'Visible recruitment pipeline', 'Stronger technical teams'],
    services: [
      { name: 'IT Recruitment', summary: 'Search and selection for software, cloud, data, AI, QA, UX and product roles.', examples: ['Engineers', 'Cloud / DevOps', 'AI / data', 'Product / UX'], price: 'From $2,000 + agreed success fee', proof: ['jd2cv', 'paid-refer'] },
      { name: 'Embedded RPO', summary: 'Embedded recruitment operations for organizations that need sustained technical hiring capacity.', examples: ['Pipeline management', 'Sourcing', 'Coordination', 'Reporting'], price: '$3,000–$8,000 / month', proof: ['paid-refer', 'jd2cv'] },
      { name: 'Technical Screening', summary: 'Structured assessment, interview design and portfolio review for technical roles.', examples: ['Assessment design', 'Technical interview', 'Portfolio review'], price: '$2,000–$5,000', proof: ['jd2cv'] },
      { name: 'Talent Intelligence & Mapping', summary: 'Map relevant talent markets, skills, availability and hiring constraints before launching a search.', examples: ['Market mapping', 'Skill availability', 'Compensation context', 'Competitor mapping'], price: '$2,000–$3,000', proof: ['jd2cv'] },
      { name: 'Build a Technical Team', summary: 'Design and execute a multi-role hiring programme around a product or transformation initiative.', examples: ['Role architecture', 'Multi-role sourcing', 'Assessment', 'Onboarding'], price: 'Custom', proof: ['paid-refer', 'jd2cv'] },
    ],
    proof: ['jd2cv', 'paid-refer'],
    assurance: ['Candidate confidentiality and data handling documented', 'Introduction and placement terms agreed before search', 'Screening criteria aligned with the role', 'RPO reporting cadence defined in the engagement'],
    startingAt: '$2,000', typicalRange: '$2,000–$8,000+ / placement or month',
  },
  {
    id: 'trust', index: '07', title: 'Trust, Security & Engineering Assurance', shortTitle: 'Trust & Assurance',
    proposition: 'Make digital systems trustworthy, resilient and production-ready.',
    problem: 'A system can look complete while permissions, evidence, privacy, testing, data isolation or operational recovery remain weak.',
    transformation: 'We make the boundaries explicit, build evidence and testing into delivery, and verify important journeys before release.',
    systemThinking: ['Identity', 'Authorization', 'Evidence', 'Audit', 'Privacy', 'Testing', 'Governance and recovery'],
    implementation: ['Architecture review', 'Identity and role design', 'Evidence and audit patterns', 'Automated tests', 'UAT', 'Release certification', 'Remediation'],
    outcomes: ['Clear access boundaries', 'Better evidence and auditability', 'Reduced release risk', 'More reliable deployments', 'Visible acceptance criteria', 'Higher operational confidence'],
    services: [
      { name: 'Product & Architecture Review', summary: 'Assess identity, access, data, architecture, reliability and delivery risk.', examples: ['Architecture risk', 'Technical debt', 'Permission review', 'Reliability'], price: '$2,000–$3,500', proof: ['carup', 'direkt'] },
      { name: 'Identity, Permissions & Privacy', summary: 'Design secure role, tenant, access and privacy boundaries.', examples: ['Authentication', 'Authorization', 'Tenant isolation', 'Privacy controls'], price: '$3,500–$7,000', proof: ['church-os', 'carup'] },
      { name: 'Trust & Verification Systems', summary: 'Build evidence, verification, ownership and audit patterns into product workflows.', examples: ['Verification', 'Evidence vaults', 'Ownership', 'Audit events'], price: '$5,000–$10,000', proof: ['direkt', 'reverse-verify', 'carup'] },
      { name: 'QA, UAT & Release Certification', summary: 'Create automated and human evidence that critical journeys are ready to release.', examples: ['E2E tests', 'Regression', 'UAT', 'Release gates'], price: '$2,000–$6,000', proof: ['carup', 'healthtimes'] },
      { name: 'Engineering Assurance Programme', summary: 'Ongoing release, reliability and remediation support for larger products.', examples: ['Continuous QA', 'Release certification', 'Operational checks'], price: '$6,000–$10,000+', proof: ['carup', 'church-os'] },
    ],
    proof: ['direkt', 'carup', 'reverse-verify', 'rentguarantee', 'pay-pass'],
    assurance: ['Controls proportional to risk and scope', 'Findings tied to evidence', 'Acceptance and release criteria documented', 'Detailed security or compliance requirements scoped separately when material'],
    startingAt: '$2,000', typicalRange: '$2,000–$10,000+',
  },
]

export const pricingBands = [
  { label: 'Discover / Improve', range: '$2,000–$3,500', detail: 'Audit, assessment, prototype, targeted improvement or small implementation.' },
  { label: 'Design / Implement', range: '$3,500–$6,000', detail: 'Defined system, redesign, integration or automation project.' },
  { label: 'Build / Transform', range: '$6,000–$10,000', detail: 'Substantial product, system, AI implementation or transformation.' },
  { label: 'Enterprise / Custom', range: 'From $10,000', detail: 'Complex platforms, multiple integrations, multi-department work or long-running programmes.' },
]

export const industries = [
  { id: 'automotive', name: 'Automotive & Mobility', summary: 'Marketplaces, dealer systems, verification, asset identity and mobility operations.', capabilities: ['ui-ux','enterprise','software-data-cloud','trust'] as CapabilityId[], projects: ['carup','schoolrun'] },
  { id: 'nonprofit', name: 'Nonprofits, NGOs & Membership', summary: 'Donor/member relationships, beneficiaries, case management, reporting, communications and AI knowledge.', capabilities: ['enterprise','ai','transformation','trust'] as CapabilityId[], projects: ['church-os','healthtimes','direkt'] },
  { id: 'media', name: 'Media & Publishing', summary: 'Editorial experience, newsroom operations, subscriber systems, automation and information intelligence.', capabilities: ['ui-ux','ai','software-data-cloud','transformation'] as CapabilityId[], projects: ['healthtimes','morning-pulse'] },
  { id: 'education', name: 'Education & Training', summary: 'Interactive learning, moderator tools, practice systems and technology enablement.', capabilities: ['ui-ux','software-data-cloud','transformation'] as CapabilityId[], projects: ['alt-game-center','count-with-dad','kotsu-sensei','phonics-kids-pro'] },
  { id: 'commerce', name: 'Commerce & Marketplaces', summary: 'Booking, sellers, vendors, payments, referrals and multi-sided marketplace operations.', capabilities: ['ui-ux','enterprise','software-data-cloud','trust'] as CapabilityId[], projects: ['sessions','wewed','tengasell','pay-pass','paid-refer','carup'] },
  { id: 'property', name: 'Property Technology', summary: 'Discovery, tenancy, guarantee, risk and property lifecycle systems.', capabilities: ['enterprise','software-data-cloud','trust'] as CapabilityId[], projects: ['growhome','rentguarantee'] },
  { id: 'talent', name: 'HR & Recruitment', summary: 'Technical recruitment, candidate intelligence, referrals and recruitment-process automation.', capabilities: ['talent','ai','enterprise'] as CapabilityId[], projects: ['jd2cv','paid-refer'] },
  { id: 'institutional', name: 'Institutional & Regulated Operations', summary: 'Registries, verification, case workflows, permissions, evidence and controlled operating systems.', capabilities: ['enterprise','trust','transformation','software-data-cloud'] as CapabilityId[], projects: ['direkt','reverse-verify','carup'] },
]

export const businessOutcomes = [
  { id: 'experience', label: 'Improve customer or user experience', capabilityIds: ['ui-ux'] as CapabilityId[] },
  { id: 'operations', label: 'Run our organization better', capabilityIds: ['enterprise','transformation'] as CapabilityId[] },
  { id: 'ai', label: 'Introduce AI', capabilityIds: ['ai'] as CapabilityId[] },
  { id: 'automation', label: 'Replace manual work', capabilityIds: ['ai','enterprise','transformation'] as CapabilityId[] },
  { id: 'build', label: 'Build or modernize software', capabilityIds: ['software-data-cloud','ui-ux'] as CapabilityId[] },
  { id: 'data', label: 'Connect systems or understand our data', capabilityIds: ['software-data-cloud','enterprise'] as CapabilityId[] },
  { id: 'talent', label: 'Hire technology talent', capabilityIds: ['talent'] as CapabilityId[] },
  { id: 'trust', label: 'Improve security, trust or release quality', capabilityIds: ['trust'] as CapabilityId[] },
  { id: 'unknown', label: "We're not sure yet", capabilityIds: ['transformation'] as CapabilityId[] },
]

export const deliveryLifecycle = ['Discover', 'Design', 'Build', 'Launch', 'Operate', 'Improve']

export const accelerators = [
  { name: '11-11 UX Health', description: 'A structured product-experience audit and prioritized modernization plan.' },
  { name: '11-11 AI Ready', description: 'AI opportunity, readiness, governance and implementation assessment.' },
  { name: '11-11 Relationship Core', description: 'Reusable relationship and workflow patterns for CRM, DRM and GRM programmes.' },
  { name: '11-11 Trust Layer', description: 'Reusable identity, evidence, permissions and audit patterns for trustworthy products.' },
  { name: '11-11 Launch Gate', description: 'QA, UAT and release-certification framework for critical journeys.' },
  { name: '11-11 Talent Map', description: 'Technology workforce, role and talent-market assessment for hiring programmes.' },
]

export function getCapability(id: string) {
  return capabilities.find((capability) => capability.id === id)
}
