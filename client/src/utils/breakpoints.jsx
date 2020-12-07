import { hideAt } from './make-responsive-component'

export const SmallAndBelow = hideAt({ min: '320px' })
export const MediumAndBelow = hideAt({ min: '960px' })
export const MediumOnly = hideAt({ max: '640px', min: '960px' })
export const MediumAndAbove = hideAt({ max: '640px' })
export const LargeAndAbove = hideAt({ max: '960px' })