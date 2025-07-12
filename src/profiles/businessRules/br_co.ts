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
    message:
        "Seller VAT identifier (BT-31), Seller tax representative VAT identifier (BT-63), and Buyer VAT identifier (BT-48) must each be prefixed by a country code from ISO 3166-1 alpha-2 (with 'EL' permitted for Greece) to identify the Member State that issued them."
}

export function BR_CO_10(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true // --> This rule does not apply to Minimum or Basic WL Scheme

    let sumOfLineNetAmounts = 0

    for (const line of val.invoiceLines) {
        if (line.settlement && line.settlement.lineTotals) {
            sumOfLineNetAmounts += line.settlement.lineTotals.netTotal
        }
    }

    return Math.abs(val.totals.sumWithoutAllowancesAndCharges - sumOfLineNetAmounts) < TOLERANCE
}

export const BR_CO_10_ERROR = {
    message:
        "The content of 'Sum of Invoice line net amount' (BT-106) must equal the sum of all 'Invoice line net amount' (BT-131) values.",
    path: ['totals', 'sumWithoutAllowancesAndCharges']
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
    message:
        "The content of 'Sum of allowances on document level' (BT-107) must equal the sum of all 'Document level allowance amount' (BT-92) values.",
    path: ['totals', 'allowanceTotalAmount']
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
    message:
        "The content of 'Sum of charges on document level' (BT-108) must equal the sum of all 'Document level charge amount' (BT-99) values.",
    path: ['totals', 'chargeTotalAmount']
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
    message:
        "The content of 'Invoice total amount without VAT' (BT-109) must equal the 'Sum of Invoice line net amount' (BT-106) minus 'Sum of allowances on document level' (BT-107) plus 'Sum of charges on document level' (BT-108).",
    path: ['totals', 'netTotal']
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
    message:
        "The content of 'Invoice total VAT amount' (BT-110) must equal the sum of all 'VAT category tax amount' (BT-117) values.",
    path: ['totals', 'taxTotal']
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
    message:
        "The content of 'Invoice total amount with VAT' (BT-112) must equal the sum of 'Invoice total amount without VAT' (BT-109) and 'Invoice total VAT amount' (BT-110).",
    path: ['totals', 'grossTotal']
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
    message:
        "The content of 'Amount due for payment' (BT-115) must equal 'Invoice total amount with VAT' (BT-112) minus 'Paid amount' (BT-113) plus 'Rounding amount' (BT-114).",
    path: ['totals', 'openAmount']
}

export function BR_CO_17(val: availableProfiles): boolean {
    if (!('taxBreakdown' in val.totals)) return true
    if (!val.totals.taxBreakdown || val.totals.taxBreakdown.length === 0) return true
    for (const breakdown of val.totals.taxBreakdown) {
        if (!breakdown.rateApplicablePercent) continue
        const calculatedAmount = (breakdown.basisAmount * breakdown.rateApplicablePercent) / 100
        if (Math.abs(calculatedAmount - breakdown.calculatedAmount) >= TOLERANCE) {
            console.warn(
                `BR_CO_17 failed for rate ${breakdown.rateApplicablePercent}%, basis amount ${breakdown.basisAmount}, calculated amount ${breakdown.calculatedAmount}`
            )
            return false
        }
    }
    return true
}

export const BR_CO_17_ERROR = {
    message:
        "The content of 'VAT category tax amount' (calculatedAmount - BT-117) must equal „VAT category taxable amount“ (basisAmount - BT-116), multiplied with „VAT category rate“ (rateApplicablePercent - BT-119) divided by 100, rounded to two decimals.",
    path: ['totals', 'taxBreakdown', 'rateApplicablePercent']
}

export function BR_CO_18(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (!val.totals.taxBreakdown || val.totals.taxBreakdown.length === 0) return false
    return true
}

export const BR_CO_18_ERROR = {
    message: "An invoice needs ta have at least one item in 'TaxBreakdown' (BG-23)",
    path: ['totals', 'taxBreakdown']
}

export function BR_CO_19(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (!val.paymentInformation.billingPeriod) return true
    if (!val.paymentInformation.billingPeriod.startDate && !val.paymentInformation.billingPeriod.endDate) {
        return false
    }
    return true
}

export const BR_CO_19_ERROR = {
    message:
        "If the 'Invoicing period' group (billingPeriod - BG-14) is used, either the 'Invoicing period start date' (BT-73) or the 'Invoicing period end date' (BT-74) or both must be filled.",
    path: ['paymentInformation', 'billingPeriod']
}

export function BR_CO_20(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (val.invoiceLines.length === 0) return true
    for (const line of val.invoiceLines) {
        if (!line.settlement.billingPeriod) continue
        if (!line.settlement.billingPeriod.startDate && !line.settlement.billingPeriod.endDate) {
            console.warn(
                `BR_CO_20 failed for line with ID ${line.generalLineData.lineId}: Billing period start date and end date are both missing.`
            )
            return false
        }
    }
    return true
}

export const BR_CO_20_ERROR = {
    message:
        "If the 'Invoice line period' group (BG-26) is used, either the 'Invoice line period start date' (BT-134) or the 'Invoice line period end date' (BT-135) or both must be filled.",
    path: ['invoiceLines', 'settlement', 'billingPeriod']
}

export function BR_CO_21(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (!val.totals.documentLevelAllowancesAndCharges) return true
    if (!val.totals.documentLevelAllowancesAndCharges.allowances) return true
    if (val.totals.documentLevelAllowancesAndCharges.allowances.length === 0) return true
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (!allowance.reason && !allowance.reasonCode) {
            console.warn(
                `BR_CO_21 failed: Document level allowance with amount ${allowance.actualAmount} has neither reason nor reason code.`
            )
            return false
        }
    }
    return true
}

export const BR_CO_21_ERROR = {
    message:
        "Each 'Document level allowances' group (BG-20) must contain either a 'Document level allowance reason' (BT-97) or a 'Document level allowance reason code' (BT-98), or both.",
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'reason']
}

export function BR_CO_22(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (!val.totals.documentLevelAllowancesAndCharges) return true
    if (!val.totals.documentLevelAllowancesAndCharges.charges) return true
    if (val.totals.documentLevelAllowancesAndCharges.charges.length === 0) return true
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (!charge.reason && !charge.reasonCode) {
            console.warn(
                `BR_CO_22 failed: Document level charge with amount ${charge.actualAmount} has neither reason nor reason code.`
            )
            return false
        }
    }
    return true
}

export const BR_CO_22_ERROR = {
    message:
        "Each 'Document level allowances' group (BG-21) must contain either a 'Document level allowance reason' (BT-104) or a 'Document level allowance reason code' (BT-105), or both.",
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'reason']
}

export function BR_CO_23(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (val.invoiceLines.length === 0) return true
    for (const line of val.invoiceLines) {
        if (!line.settlement.lineLevelAllowancesAndCharges?.allowances) continue
        for (const allowance of line.settlement.lineLevelAllowancesAndCharges.allowances) {
            if (!allowance.reason && !allowance.reasonCode) {
                console.warn(
                    `BR_CO_23 failed: Invoice line allowance with amount ${allowance.actualAmount} in invoice line with id ${line.generalLineData.lineId} has neither reason nor reason code.`
                )
                return false
            }
        }
    }
    return true
}

export const BR_CO_23_ERROR = {
    message:
        "Each 'Invoice line allowances' group (BG-27) must contain either an 'Invoice line allowance reason' (BT-139) or an 'Invoice line allowance reason code' (BT-140), or both.",
    path: ['invoiceLines', 'settlement', 'lineLevelAllowancesAndCharges', 'allowances', 'reason']
}

export function BR_CO_24(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (val.invoiceLines.length === 0) return true
    for (const line of val.invoiceLines) {
        if (!line.settlement.lineLevelAllowancesAndCharges?.charges) continue
        for (const charge of line.settlement.lineLevelAllowancesAndCharges.charges) {
            if (!charge.reason && !charge.reasonCode) {
                console.warn(
                    `BR_CO_24 failed: Invoice line charge with amount ${charge.actualAmount} in invoice line with id ${line.generalLineData.lineId} has neither reason nor reason code.`
                )
                return false
            }
        }
    }
    return true
}

export const BR_CO_24_ERROR = {
    message:
        "Each 'Invoice line charge' group (BG-28) must contain either an 'Invoice line charge reason' (BT-144) or an 'Invoice line charge reason code' (BT-145), or both.",
    path: ['invoiceLines', 'settlement', 'lineLevelAllowancesAndCharges', 'charges', 'reason']
}

export function BR_CO_25(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (val.totals.openAmount <= 0) return true
    if (val.paymentInformation?.paymentTerms?.dueDate || val.paymentInformation?.paymentTerms?.description) return true
    return false
}

export const BR_CO_25_ERROR = {
    message:
        "If the 'Amount due for payment' (BT-115) is positive, either 'Payment due date' (BT-9) or 'Payment terms description' (BT-20) must be present.",
    path: ['invoiceLines', 'settlement', 'lineLevelAllowancesAndCharges', 'charges', 'reason']
}

export function BR_CO_26(val: availableProfiles): boolean {
    if (val.seller?.taxIdentification?.vatId || val.seller.specifiedLegalOrganization?.id) return true
    if (isMinimumProfile(val)) return false
    if (val.seller?.id) return true
    return false
}

export const BR_CO_26_ERROR = {
    message:
        "To allow the buyer to automatically identify the seller, either 'Seller identifier' (BT-29), 'Seller legal registration identifier' (BT-30), or 'Seller VAT identifier' (BT-31) must be present.",
    path: ['seller']
}
