import type { CapabilityId } from './portfolio'

export const intakeOutcomes = [
  { id: 'experience', label: 'Improve a digital experience', capability: 'ui-ux' as CapabilityId },
  { id: 'operations', label: 'Connect operations and relationships', capability: 'enterprise' as CapabilityId },
  { id: 'ai', label: 'Introduce AI or intelligent automation', capability: 'ai' as CapabilityId },
  { id: 'platform', label: 'Build or modernize software, data or cloud', capability: 'software-data-cloud' as CapabilityId },
  { id: 'transform', label: 'Modernize how work happens', capability: 'transformation' as CapabilityId },
  { id: 'talent', label: 'Build a technical team', capability: 'talent' as CapabilityId },
  { id: 'trust', label: 'Improve security, QA or release confidence', capability: 'trust' as CapabilityId },
  { id: 'unknown', label: 'I am not sure yet', capability: undefined },
] as const
