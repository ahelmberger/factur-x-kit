import { availableProfiles } from '../../core/factur-x'
import { isBasicWithoutLinesProfile } from '../basicwithoutlines'
import { isMinimumProfile } from '../minimum'

export function BR_16(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (isBasicWithoutLinesProfile(val)) return true

    if (!('invoiceLines' in val)) return false
    if (!val.invoiceLines) return false
    if (val.invoiceLines.length < 1) return false

    return true
}

export const BR_16_ERROR = {
    error: 'An Invoice (INVOICE) must contain at least one Invoice Line (invoiceLine - BG-25).'
}
