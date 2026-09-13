export * from '../../../shared/portfolio'
import { capabilities } from '../../../shared/portfolio'
export function getCapability(id?: string) { return capabilities.find((item) => item.id === id) }
