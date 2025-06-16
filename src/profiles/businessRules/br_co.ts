import { availableProfiles } from '../../core/factur-x'
import { COUNTRY_ID_CODES } from '../../types/codes'
import { isMinimumProfile } from '../minimum'

const TOLERANCE = 0.005

export function BR_CO_9(val: availableProfiles): boolean {
    const countryCodePrefixes = Object.values(COUNTRY_ID_CODES) // ['AD', 'AE', 'AF', ...]
    const validGreekPrefix = 'EL'

    const checkVatId = (vatId: string | undefined): boolean => {
        if (!vatId) {
            return true // If no VAT ID is provided, the rule doesn't apply to it.
        }
        const prefix = vatId.substring(0, 2).toUpperCase()
        if (prefix === validGreekPrefix) {
            return true
        }
        return countryCodePrefixes.includes(prefix as COUNTRY_ID_CODES)
    }

    let sellerVatValid = true
    if (val.seller.taxIdentification?.vatId) {
        sellerVatValid = checkVatId(val.seller.taxIdentification.vatId)
    }

    if (isMinimumProfile(val)) return sellerVatValid

    let sellerTaxRepVatValid = true
    if (val.sellerTaxRepresentative?.taxIdentification) {
        // taxIdentification can be an object with vatId or localTaxId
        const taxIdObj = val.sellerTaxRepresentative.taxIdentification
        if ('vatId' in taxIdObj && taxIdObj.vatId) {
            sellerTaxRepVatValid = checkVatId(taxIdObj.vatId)
        }
    }

    let buyerVatValid = true
    if (val.buyer.taxIdentification) {
        const taxIdObj = val.buyer.taxIdentification
        if ('vatId' in taxIdObj && taxIdObj.vatId) {
            buyerVatValid = checkVatId(taxIdObj.vatId)
        }
    }

    return sellerVatValid && sellerTaxRepVatValid && buyerVatValid
}

export const BR_CO_9_ERROR = {
    error: "Seller VAT identifier (BT-31), Seller tax representative VAT identifier (BT-63), and Buyer VAT identifier (BT-48) must each be prefixed by a country code from ISO 3166-1 alpha-2 (with 'EL' permitted for Greece) to identify the Member State that issued them."
}

export function BR_CO_10(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true // --> This rule does not apply to Minimum or Basic WL Scheme

    let sumOfLineNetAmounts = 0

    for (const line of val.invoiceLines) {
        if (line.settlement && line.settlement.lineTotals && typeof line.settlement.lineTotals.netTotal === 'number') {
            sumOfLineNetAmounts += line.settlement.lineTotals.netTotal
        } else {
            console.warn("BR-CO-10: Invoice line is missing settlement.lineTotals.netTotal or it's not a number.")
            return false
        }
    }

    return Math.abs(val.totals.sumWithoutAllowancesAndCharges - sumOfLineNetAmounts) < TOLERANCE
}

export const BR_CO_10_ERROR = {
    error: "The content of 'Sum of Invoice line net amount' (BT-106) must equal the sum of all 'Invoice line net amount' (BT-131) values."
}

export function BR_CO_11(val: availableProfiles): boolean {
    if (!('documentLevelAllowancesAndCharges' in val.totals) && !('allowanceTotalAmount' in val.totals)) return true // --> does not apply to Minimum Profile

    let sumOfDocumentLevelAllowanceAmounts = 0

    if (val.totals.documentLevelAllowancesAndCharges?.allowances) {
        for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
            sumOfDocumentLevelAllowanceAmounts += allowance.actualAmount
        }
    }

    const allowanceTotalAmount = val.totals.allowanceTotalAmount ?? 0

    return Math.abs(allowanceTotalAmount - sumOfDocumentLevelAllowanceAmounts) < TOLERANCE
}

export const BR_CO_11_ERROR = {
    error: "The content of 'Sum of allowances on document level' (BT-107) must equal the sum of all 'Document level allowance amount' (BT-92) values."
}

export function BR_CO_12(val: availableProfiles): boolean {
    if (!('documentLevelAllowancesAndCharges' in val.totals) && !('chargeTotalAmount' in val.totals)) return true // --> does not apply to Minimum Profile

    let sumOfDocumentLevelChargeAmounts = 0

    if (val.totals.documentLevelAllowancesAndCharges?.charges) {
        for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
            sumOfDocumentLevelChargeAmounts += charge.actualAmount
        }
    }

    const chargeTotalAmount = val.totals.chargeTotalAmount ?? 0

    return Math.abs(chargeTotalAmount - sumOfDocumentLevelChargeAmounts) < TOLERANCE
}

export const BR_CO_12_ERROR = {
    error: "The content of 'Sum of charges on document level' (BT-108) must equal the sum of all 'Document level charge amount' (BT-99) values."
}

export function BR_CO_13(val: availableProfiles): boolean {
    if (!('sumWithoutAllowancesAndCharges' in val.totals)) return true // rule does not apply to Minimum Profile

    const sumOfAllowancesOnDocumentLevel = val.totals.allowanceTotalAmount ?? 0
    const sumOfChargesOnDocumentLevel = val.totals.chargeTotalAmount ?? 0

    const calculatedNetTotal =
        val.totals.sumWithoutAllowancesAndCharges - sumOfAllowancesOnDocumentLevel + sumOfChargesOnDocumentLevel

    return Math.abs(val.totals.netTotal - calculatedNetTotal) < TOLERANCE
}

export const BR_CO_13_ERROR = {
    error: "The content of 'Invoice total amount without VAT' (BT-109) must equal the 'Sum of Invoice line net amount' (BT-106) minus 'Sum of allowances on document level' (BT-107) plus 'Sum of charges on document level' (BT-108)."
}

export function BR_CO_14(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true

    let sumOfVatCategoryTaxAmounts = 0

    if (val.totals.taxBreakdown) {
        for (const breakdown of val.totals.taxBreakdown) {
            sumOfVatCategoryTaxAmounts += breakdown.calculatedAmount
        }
    }

    let invoiceTotalVatAmount_BT110 = 0
    if (val.totals.taxTotal && val.totals.taxTotal.length > 0) {
        const entryInDocCurrency = val.totals.taxTotal.find(t => t.currency === val.document.currency)
        invoiceTotalVatAmount_BT110 = entryInDocCurrency?.amount || 0
    }

    return Math.abs(invoiceTotalVatAmount_BT110 - sumOfVatCategoryTaxAmounts) < TOLERANCE
}

export const BR_CO_14_ERROR = {
    error: "The content of 'Invoice total VAT amount' (BT-110) must equal the sum of all 'VAT category tax amount' (BT-117) values."
}

export function BR_CO_15(val: availableProfiles): boolean {
    let invoiceTotalVatAmount_BT110 = 0
    if (val.totals.taxTotal && val.totals.taxTotal.length > 0) {
        const entryInDocCurrency = val.totals.taxTotal.find(t => t.currency === val.document.currency)
        invoiceTotalVatAmount_BT110 = entryInDocCurrency?.amount || 0
    }

    const calculatedGross = invoiceTotalVatAmount_BT110 + val.totals.netTotal

    return Math.abs(calculatedGross - val.totals.grossTotal) < TOLERANCE
}

export const BR_CO_15_ERROR = {
    error: "The content of 'Invoice total amount with VAT' (BT-112) must equal the sum of 'Invoice total amount without VAT' (BT-109) and 'Invoice total VAT amount' (BT-110)."
}

export function BR_CO_16(val: availableProfiles): boolean {
    let prepaidAmount = 0
    let roundingAmount = 0

    if ('prepaidAmount' in val.totals) {
        prepaidAmount = val.totals.prepaidAmount || 0
    }

    if ('roundingAmount' in val.totals) {
        roundingAmount = val.totals.roundingAmount || 0
    }

    return val.totals.openAmount === val.totals.grossTotal + roundingAmount - prepaidAmount
}

export const BR_CO_16_ERROR = {
    error: "The content of 'Amount due for payment' (BT-115) must equal 'Invoice total amount with VAT' (BT-112) minus 'Paid amount' (BT-113) plus 'Rounding amount' (BT-114)."
}
