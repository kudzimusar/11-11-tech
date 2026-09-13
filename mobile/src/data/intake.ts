import type { CapabilityId } from './capabilities'

export const businessOutcomes = [
  { id: 'experience', label: 'Improve customer or user experience', capability: 'ui-ux' as CapabilityId },
  { id: 'operations', label: 'Run our organization better', capability: 'enterprise' as CapabilityId },
  { id: 'ai', label: 'Introduce AI', capability: 'ai' as CapabilityId },
  { id: 'automation', label: 'Replace manual work', capability: 'ai' as CapabilityId },
  { id: 'build', label: 'Build or modernize software', capability: 'software-data-cloud' as CapabilityId },
  { id: 'talent', label: 'Hire technology talent', capability: 'talent' as CapabilityId },
  { id: 'trust', label: 'Improve security, trust or release quality', capability: 'trust' as CapabilityId },
  { id: 'unknown', label: "We're not sure yet", capability: 'transformation' as CapabilityId },
]

export const budgetOptions = ['US$2,000–3,500', 'US$3,500–5,000', 'US$5,000–7,500', 'US$7,500–10,000', 'US$10,000+', 'I need help determining the budget']
export const timelineOptions = ['Exploring', 'Within 1 month', '1–3 months', '3–6 months', '6+ months']
export const engagementOptions = ['Not sure yet', 'Discovery / audit', 'Fixed-scope project', 'Discovery + implementation', 'Monthly product / technology partnership', 'Recruitment / RPO', 'Enterprise custom']
export const contactOptions = ['Email', 'Video call', 'WhatsApp / phone', 'No preference']
