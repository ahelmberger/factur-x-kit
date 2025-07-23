import { availableProfiles } from '../../core/factur-x'
import { printError } from '../../types/Errors'
import { PROFILES } from '../../types/ProfileTypes'
import { TAX_CATEGORY_CODES } from '../../types/codes'
import { BusinessRuleWithError } from './br_co'

export function BR_Z_1(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    let linesWithZeroRatedTaxExisting = false
    if ('invoiceLines' in val && val.invoiceLines) {
        linesWithZeroRatedTaxExisting = val.invoiceLines.some(
            line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
        )
    }

    const allowancesWithZeroRatedTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )

    const chargesWithZeroRatedTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )
    if (!linesWithZeroRatedTaxExisting && !allowancesWithZeroRatedTaxExisting && !chargesWithZeroRatedTaxExisting)
        return true

    const taxBreakdownForZeroRated = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )

    if (taxBreakdownForZeroRated.length === 1) {
        return true
    }
    return false
}

export const BR_Z_1_ERROR = {
    message:
        '[BR-Z-1] An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value "Zero rated" specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value "Zero rated".',
    path: ['totals', 'taxBreakdown']
}

export function BR_Z_2(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithZeroRatedTaxExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )
    if (!linesWithZeroRatedTaxExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true
    }

    return false
}

export const BR_Z_2_ERROR = {
    message:
        '[BR-Z-2] An Invoice (INVOICE) that contains an item where the Invoiced item VAT category code (BT-151) has the value "Zero rated" specified, must contain the Seller VAT identifier (BT-31), the Seller tax registration identifier (BT-32) or the Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
}

export function BR_Z_3(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const allowancesWithZeroRatedTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )
    if (!allowancesWithZeroRatedTaxExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true
    }

    return false
}

export const BR_Z_3_ERROR = {
    message:
        '[BR-Z-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value "Zero rated", either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) must be present.',
    path: ['seller', 'taxIdentification']
}

export function BR_Z_4(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const chargesWithZeroRatedTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )
    if (!chargesWithZeroRatedTaxExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true
    }

    return false
}

export const BR_Z_4_ERROR = {
    message:
        '[BR-Z-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value "Zero rated", either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) must be present.',
    path: ['seller', 'taxIdentification']
}

export function BR_Z_5(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (line.settlement.tax.categoryCode !== TAX_CATEGORY_CODES.ZERO_RATED_GOODS) continue
        if (line.settlement.tax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-Z-5 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            return false
        }
    }

    return true
}

export const BR_Z_5_ERROR = {
    message:
        '[BR-Z-5] In an INVOICE LINE (BG-25), where Invoiced item VAT category code (BT-151) has the value "Zero rated", Invoiced item VAT rate (BT-152) must be equal to 0.',
    path: ['invoceLines', 'settlement', 'tax', 'rateApplicablePercent']
}

export function BR_Z_6(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.allowances) return true
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (allowance.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.ZERO_RATED_GOODS) continue
        if (allowance.categoryTradeTax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-Z-6 is being violated in allowance with amount ${allowance.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_Z_6_ERROR = {
    message:
        '[BR-Z-6] In a DOCUMENT LEVEL ALLOWANCES (BG-20), where Document level allowance VAT category code (BT-95) has the value "Zero rated", Document level allowance VAT rate (BT-96) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_Z_7(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.charges) return true
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (charge.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.ZERO_RATED_GOODS) continue
        if (charge.categoryTradeTax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-Z-7 is being violated in charge with amount ${charge.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_Z_7_ERROR = {
    message:
        '[BR-Z-7] In a DOCUMENT LEVEL CHARGES (BG-21), where Document level charge VAT category code (BT-102) has the value "Zero rated", Document level charge VAT rate (BT-103) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_Z_8(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithZeroRatedTaxExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )
    const allowancesWithZeroRatedTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )
    const chargesWithZeroRatedTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )

    if (!linesWithZeroRatedTaxExisting && !allowancesWithZeroRatedTaxExisting && !chargesWithZeroRatedTaxExisting)
        return true

    const sumOfLinesWithZeroRatedTax = val.invoiceLines.reduce((sum, line) => {
        if (line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS) {
            return sum + line.settlement.lineTotals.netTotal
        }
        return sum
    }, 0)

    const sumOfDocumentLevelAllowancesWithZeroRatedTax =
        val.totals.documentLevelAllowancesAndCharges?.allowances?.reduce((sum, allowance) => {
            if (allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS) {
                return sum + allowance.actualAmount
            }
            return sum
        }, 0) || 0

    const sumOfDocumentLevelChargesWithZeroRatedTax =
        val.totals.documentLevelAllowancesAndCharges?.charges?.reduce((sum, charge) => {
            if (charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS) {
                return sum + charge.actualAmount
            }
            return sum
        }, 0) || 0

    const totalExpectedZeroRatedTaxAmount =
        sumOfLinesWithZeroRatedTax -
        sumOfDocumentLevelAllowancesWithZeroRatedTax +
        sumOfDocumentLevelChargesWithZeroRatedTax

    const taxBreakdownForZeroRated = val.totals.taxBreakdown.find(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )

    if (!taxBreakdownForZeroRated) {
        return false
    }

    const totalProvidedZeroRatedTaxAmount = taxBreakdownForZeroRated.basisAmount

    if (
        totalProvidedZeroRatedTaxAmount - 1 <= totalExpectedZeroRatedTaxAmount &&
        totalProvidedZeroRatedTaxAmount + 1 >= totalExpectedZeroRatedTaxAmount
    ) {
        return true
    }

    return false
}

export const BR_Z_8_ERROR = {
    message:
        '[BR-Z-8] In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value "Zero rated" specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value "Zero rated" specified.',
    path: ['totals', 'taxBreakdown', 'basisAmount']
}

export function BR_Z_9(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsForZeroRated = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )

    if (taxBreakdownsForZeroRated.length === 0) return true

    for (const taxBreakdown of taxBreakdownsForZeroRated) {
        if (taxBreakdown.calculatedAmount !== 0) return false
    }

    return true
}

export const BR_Z_9_ERROR = {
    message:
        '[BR-Z-9] The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value "Zero rated".',
    path: ['totals', 'taxBreakdown', 'calculatedAmount']
}

export function BR_Z_10(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsForZeroRated = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.ZERO_RATED_GOODS
    )

    if (taxBreakdownsForZeroRated.length === 0) return true

    for (const taxBreakdown of taxBreakdownsForZeroRated) {
        if (taxBreakdown.exemptionReason || taxBreakdown.exemptionReasonCode) return false
    }

    return true
}

export const BR_Z_10_ERROR = {
    message:
        '[BR-Z-10] A VAT Breakdown (BG-23) with VAT Category code (BT-118) "Zero rated" shall not have a VAT exemption reason code (BT-121) or VAT exemption reason text (BT-120).',
    path: ['totals', 'taxBreakdown', 'exemptionReason']
}

export const BR_Z: BusinessRuleWithError[] = [
    { rule: BR_Z_1, error: BR_Z_1_ERROR },
    { rule: BR_Z_2, error: BR_Z_2_ERROR },
    { rule: BR_Z_3, error: BR_Z_3_ERROR },
    { rule: BR_Z_4, error: BR_Z_4_ERROR },
    { rule: BR_Z_5, error: BR_Z_5_ERROR },
    { rule: BR_Z_6, error: BR_Z_6_ERROR },
    { rule: BR_Z_7, error: BR_Z_7_ERROR },
    { rule: BR_Z_8, error: BR_Z_8_ERROR },
    { rule: BR_Z_9, error: BR_Z_9_ERROR },
    { rule: BR_Z_10, error: BR_Z_10_ERROR }
]
