import { availableProfiles } from '../../core/factur-x'
import { printError } from '../../types/Errors'
import { TAX_CATEGORY_CODES } from '../../types/codes'
import { isMinimumProfile } from '../minimum'
import { BusinessRuleWithError } from './br_co'

export function BR_E_1(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true

    let linesWithExemptTaxExisting = false
    if ('invoiceLines' in val && val.invoiceLines) {
        linesWithExemptTaxExisting = val.invoiceLines.some(
            line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
        )
    }

    const allowancesWithExemptTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
    )

    const chargesWithExemptTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
    )
    if (!linesWithExemptTaxExisting && !allowancesWithExemptTaxExisting && !chargesWithExemptTaxExisting) return true

    const taxBreakdownForExempt = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
    )

    if (taxBreakdownForExempt.length === 1) {
        return true
    }
    return false
}

export const BR_E_1_ERROR = {
    message:
        'An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value Exempt from VAT specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Exempt from VAT.',
    path: ['totals', 'taxBreakdown']
}

export function BR_E_2(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithExemptTaxExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
    )
    if (!linesWithExemptTaxExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true
    }

    return false
}

export const BR_E_2_ERROR = {
    message:
        'An Invoice (INVOICE) that contains an item where the Invoiced item VAT category code (BT-151) has the value Exempt from VAT specified, must contain the Seller VAT identifier (BT-31), the Seller tax registration identifier (BT-32) or the Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
}

export function BR_E_3(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true

    const allowancesWithExemptTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
    )
    if (!allowancesWithExemptTaxExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true
    }

    return false
}

export const BR_E_3_ERROR = {
    message:
        'In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value Exempt from VAT, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) must be present.',
    path: ['seller', 'taxIdentification']
}

export function BR_E_4(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true

    const chargesWithExemptTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
    )
    if (!chargesWithExemptTaxExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true
    }

    return false
}

export const BR_E_4_ERROR = {
    message:
        'In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value Exempt from VAT, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) must be present.',
    path: ['seller', 'taxIdentification']
}

export function BR_E_5(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (line.settlement.tax.categoryCode !== TAX_CATEGORY_CODES.EXEMPT_FROM_TAX) continue
        if (line.settlement.tax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-E-5 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            return false
        }
    }

    return true
}

export const BR_E_5_ERROR = {
    message:
        'In an INVOICE LINE (BG-25), where Invoiced item VAT category code (BT-151) has the value Exempt from VAT, Invoiced item VAT rate (BT-152) must be equal to 0.',
    path: ['invoceLines', 'settlement', 'tax', 'rateApplicablePercent']
}

export function BR_E_6(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.allowances) return true
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (allowance.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.EXEMPT_FROM_TAX) continue
        if (allowance.categoryTradeTax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-E-6 is being violated in allowance with amount ${allowance.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_E_6_ERROR = {
    message:
        'In a DOCUMENT LEVEL ALLOWANCES (BG-20), where Document level allowance VAT category code (BT-95) has the value Exempt from VAT, Document level allowance VAT rate (BT-96) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_E_7(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.charges) return true
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (charge.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.EXEMPT_FROM_TAX) continue
        if (charge.categoryTradeTax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-E-7 is being violated in charge with amount ${charge.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_E_7_ERROR = {
    message:
        'In a DOCUMENT LEVEL CHARGES (BG-21), where Document level charge VAT category code (BT-102) has the value Exempt from VAT, Document level charge VAT rate (BT-103) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_E_8(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const sumOfLinesWithExemptTax = val.invoiceLines.reduce((sum, line) => {
        if (line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX) {
            return sum + line.settlement.lineTotals.netTotal
        }
        return sum
    }, 0)

    const sumOfDocumentLevelAllowancesWithExemptTax =
        val.totals.documentLevelAllowancesAndCharges?.allowances?.reduce((sum, allowance) => {
            if (allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX) {
                return sum + allowance.actualAmount
            }
            return sum
        }, 0) || 0

    const sumOfDocumentLevelChargesWithExemptTax =
        val.totals.documentLevelAllowancesAndCharges?.charges?.reduce((sum, charge) => {
            if (charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX) {
                return sum + charge.actualAmount
            }
            return sum
        }, 0) || 0

    const totalExpectedExemptTaxAmount =
        sumOfLinesWithExemptTax - sumOfDocumentLevelAllowancesWithExemptTax + sumOfDocumentLevelChargesWithExemptTax

    const taxBreakdownForExempt = val.totals.taxBreakdown.find(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
    )

    if (!taxBreakdownForExempt) {
        return false
    }

    const totalProvidedExemptTaxAmount = taxBreakdownForExempt.basisAmount

    if (
        totalProvidedExemptTaxAmount - 1 <= totalExpectedExemptTaxAmount &&
        totalProvidedExemptTaxAmount + 1 >= totalExpectedExemptTaxAmount
    ) {
        return true
    }

    return false
}

export const BR_E_8_ERROR = {
    message:
        'In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value Exempt from VAT specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value Exempt from VAT specified.',
    path: ['totals', 'taxBreakdown', 'basisAmount']
}

export function BR_E_9(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    const taxBreakdownsForExempt = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
    )

    if (taxBreakdownsForExempt.length === 0) return true

    for (const taxBreakdown of taxBreakdownsForExempt) {
        if (taxBreakdown.calculatedAmount !== 0) return false
    }

    return true
}

export const BR_E_9_ERROR = {
    message:
        'The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value Exempt from VAT.',
    path: ['totals', 'taxBreakdown', 'calculatedAmount']
}

export function BR_E_10(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    const taxBreakdownsForExempt = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.EXEMPT_FROM_TAX
    )

    if (taxBreakdownsForExempt.length === 0) return true

    for (const taxBreakdown of taxBreakdownsForExempt) {
        if (!taxBreakdown.exemptionReason && !taxBreakdown.exemptionReasonCode) return false
    }

    return true
}

export const BR_E_10_ERROR = {
    message:
        'A VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Exempt from VAT must contain a VAT exemption reason code (BT-121) or a VAT exemption reason text (BT-120).',
    path: ['totals', 'taxBreakdown', 'exemptionReason']
}

export const BR_E: BusinessRuleWithError[] = [
    { rule: BR_E_1, error: BR_E_1_ERROR },
    { rule: BR_E_2, error: BR_E_2_ERROR },
    { rule: BR_E_3, error: BR_E_3_ERROR },
    { rule: BR_E_4, error: BR_E_4_ERROR },
    { rule: BR_E_5, error: BR_E_5_ERROR },
    { rule: BR_E_6, error: BR_E_6_ERROR },
    { rule: BR_E_7, error: BR_E_7_ERROR },
    { rule: BR_E_8, error: BR_E_8_ERROR },
    { rule: BR_E_9, error: BR_E_9_ERROR },
    { rule: BR_E_10, error: BR_E_10_ERROR }
]
