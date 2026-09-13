export const deliveryLifecycle = [
  { id: 'discover', index: '01', title: 'Discover', summary: 'Understand the problem, users, operating context, systems, constraints and commercial objective.' },
  { id: 'design', index: '02', title: 'Design', summary: 'Map journeys, relationships, authority, data, architecture, interfaces and measurable acceptance criteria.' },
  { id: 'build', index: '03', title: 'Build', summary: 'Implement in controlled lanes with versioned decisions, visible evidence and proportionate security controls.' },
  { id: 'launch', index: '04', title: 'Launch', summary: 'Certify critical journeys, complete UAT, document known gaps and deploy with a clear handover.' },
  { id: 'operate', index: '05', title: 'Operate', summary: 'Support the real system after launch: incidents, updates, adoption, usage, model/tool dependencies and service commitments.' },
  { id: 'improve', index: '06', title: 'Improve', summary: 'Use evidence, client feedback and operating data to prioritize the next product, UX, AI or platform improvement.' },
] as const

export const engagementControls = [
  { title: 'Scope', summary: 'Define the problem, deliverables, exclusions, dependencies and acceptance criteria before implementation becomes expensive.' },
  { title: 'Truth', summary: 'Establish one reviewable source of truth for code, environments, data, permissions and business rules.' },
  { title: 'Evidence', summary: 'Attach automation, UAT and release evidence to the system rather than assuming quality from appearance.' },
  { title: 'Handover', summary: 'Make architecture, decisions, operating notes and unresolved risk portable beyond the person who built them.' },
] as const

export const clientSuccessJourney = [
  { index: '01', title: 'Onboarding', summary: 'Confirm stakeholders, communication, access, constraints, scope and the first measurable milestone.' },
  { index: '02', title: 'Milestone visibility', summary: 'Keep decisions, dependencies, demos, risks and delivery evidence visible throughout the engagement.' },
  { index: '03', title: 'Review & UAT', summary: 'Put important journeys in front of the client before final acceptance rather than relying on launch-day surprise.' },
  { index: '04', title: 'Handover & training', summary: 'Transfer operating knowledge, documentation, administrator guidance and agreed source access.' },
  { index: '05', title: 'Warranty / support', summary: 'Separate defect correction, paid support and contractual SLA commitments so expectations stay clear.' },
  { index: '06', title: 'Continuous improvement', summary: 'Use recurring reviews, product evidence and operational feedback to decide what should change next.' },
] as const
