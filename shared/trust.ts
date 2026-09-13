export const publicTrustStandards = [
  { title: 'Quality & Delivery Standard', summary: 'Defined scope, acceptance criteria, version control, testing, UAT, deployment evidence and documented handover are applied proportionately to the engagement.' },
  { title: 'Confidentiality', summary: 'A mutual NDA can be used before detailed discovery when sensitive product, business, architecture or operational information needs to be shared.' },
  { title: 'Security & Privacy', summary: 'Access, data handling, permissions and security controls are defined according to the service, risk and agreed scope.' },
  { title: 'Responsible AI', summary: 'AI projects define model/provider dependencies, data boundaries, human oversight, evaluation criteria and production controls before launch.' },
  { title: 'Intellectual Property', summary: 'Ownership, licensing, pre-existing IP and reusable delivery assets are documented in the relevant agreement and Statement of Work.' },
  { title: 'Accessibility', summary: 'Accessibility expectations are agreed for the engagement and implemented proportionately to product context, audience and scope.' },
] as const

export const trustOnRequest = ['Mutual NDA template','Sample Master Services Agreement (MSA)','Sample Statement of Work (SOW)','Sample Service Level Agreement (SLA)','Data Processing Agreement (DPA)','Security / procurement information pack','Detailed AI and data-handling appendix'] as const
export const trustProjectSpecific = ['Executed NDA / MSA','Final Statement of Work','Final SLA or support schedule','Order form / purchase order','DPA and project-specific data terms','Change orders','Acceptance / handover records'] as const

export const serviceCommitments = [
  { title: 'Warranty', summary: 'Defects against agreed scope may be corrected during a defined post-acceptance period included in project terms.' },
  { title: 'Support', summary: 'Ongoing paid assistance may cover maintenance, updates, minor changes, technical support and product improvement.' },
  { title: 'SLA', summary: 'Measurable response, availability, escalation and maintenance-window commitments apply only where agreed.' },
  { title: 'Procurement', summary: 'NDA, security review, DPA, vendor registration, insurance or purchase-order requirements can be planned early.' },
] as const
