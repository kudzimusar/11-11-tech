export { capabilities, pricingBands, industries, businessOutcomes, deliveryLifecycle, accelerators } from '../../../shared/portfolio'
export type { Capability, CapabilityId, ServiceOffer } from '../../../shared/portfolio'
import { capabilities } from '../../../shared/portfolio'
export function getCapability(id?: string) { return capabilities.find((item) => item.id === id) }
