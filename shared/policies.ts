export const publicPolicies = [
  { id: 'privacy', title: 'Privacy', summary: '11-11 Tech collects the minimum information needed to communicate, qualify opportunities, deliver work and operate public services. Secure intake is handled through a server-side boundary rather than public database access.' },
  { id: 'terms', title: 'Website & App Terms', summary: 'Public content, indicative pricing and project descriptions are general information. A commercial engagement exists only under the relevant accepted proposal, order form, SOW or signed agreement.' },
  { id: 'accessibility', title: 'Accessibility', summary: '11-11 Tech designs for readable contrast, keyboard/touch accessibility, semantic structure, reduced-motion preferences and responsive layouts. Engagement-specific targets are agreed in scope.' },
  { id: 'ai', title: 'Responsible AI', summary: 'AI is treated as an implementation capability rather than a single model or vendor. Consequential actions require appropriate human control, permissions, evaluation and monitoring.' },
  { id: 'security', title: 'Security & Disclosure', summary: 'Least privilege, environment separation, reviewable changes and evidence-led testing are applied proportionately to the service and agreed risk.' },
  { id: 'data', title: 'Data Principles', summary: 'The public product does not require advertising profiles or cross-site trackers. First-party measurement is bounded and abuse-control identifiers are pseudonymized server-side.' },
] as const

export const legalNotice = 'These public policies are operational information, not jurisdiction-specific legal advice. NDA, MSA, SOW, SLA, DPA, recruitment terms and other binding documents should receive appropriate review before production use.'
