import { availableProfiles } from '../../core/factur-x'
import { PROFILES } from '../../types/ProfileTypes'
import { EXEMPTION_REASON_CODES, TAX_CATEGORY_CODES } from '../../types/codes'
import { BusinessRuleWithError } from './br_co'

export function BR_O_1(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    let linesWithNotSubjectToVatExisting = false
    if ('invoiceLines' in val && val.invoiceLines) {
        linesWithNotSubjectToVatExisting = val.invoiceLines.some(
            line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
        )
    }

    const allowancesWithNotSubjectToVatExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    const chargesWithNotSubjectToVatExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )
    if (
        !linesWithNotSubjectToVatExisting &&
        !allowancesWithNotSubjectToVatExisting &&
        !chargesWithNotSubjectToVatExisting
    )
        return true

    const taxBreakdownForNotSubjectToVat = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    if (taxBreakdownForNotSubjectToVat.length === 1) {
        return true
    }
    return false
}

export const BR_O_1_ERROR = {
    message:
        '[BR-O-1] An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value "Not subject to VAT" specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value "Not subject to VAT".',
    path: ['totals', 'taxBreakdown']
}

export function BR_O_2(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithNotSubjectToVatExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )
    if (!linesWithNotSubjectToVatExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId ||
        (val.buyer.taxIdentification &&
            (('vatId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.vatId) ||
                ('localTaxId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.localTaxId)))
    ) {
        return false
    }

    return true
}

export const BR_O_2_ERROR = {
    message:
        '[BR-O-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-46).',
    path: ['seller', 'taxIdentification']
}

export function BR_O_3(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const allowancesWithNotSubjectToVatExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )
    if (!allowancesWithNotSubjectToVatExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId ||
        (val.buyer.taxIdentification &&
            (('vatId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.vatId) ||
                ('localTaxId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.localTaxId)))
    ) {
        return false
    }

    return true
}

export const BR_O_3_ERROR = {
    message:
        '[BR-O-3] An Invoice that contains a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-48).',
    path: ['seller', 'taxIdentification']
}

export function BR_O_4(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const chargesWithNotSubjectToVatExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )
    if (!chargesWithNotSubjectToVatExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId ||
        (val.buyer.taxIdentification &&
            (('vatId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.vatId) ||
                ('localTaxId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.localTaxId)))
    ) {
        return false
    }

    return true
}

export const BR_O_4_ERROR = {
    message:
        '[BR-O-4] An Invoice that contains a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-48).',
    path: ['seller', 'taxIdentification']
}

export function BR_O_5(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (line.settlement.tax.categoryCode !== TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX) continue
        if (line.settlement.tax.rateApplicablePercent != null) {
            //printError(`Business Rule BR-O-5 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            return false
        }
    }

    return true
}

export const BR_O_5_ERROR = {
    message:
        '[BR-O-5] An Invoice line (BG-25) where the VAT category code (BT-151) is "Not subject to VAT" shall not contain an Invoiced item VAT rate (BT-152).',
    path: ['invoceLines', 'settlement', 'tax', 'rateApplicablePercent']
}

export function BR_O_6(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.allowances) return true
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (allowance.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX) continue
        if (allowance.categoryTradeTax.rateApplicablePercent != null) {
            //printError(`Business Rule BR-O-6 is being violated in allowance with amount ${allowance.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_O_6_ERROR = {
    message:
        '[BR-O-6] A Document level allowance (BG-20) where VAT category code (BT-95) is "Not subject to VAT" shall not contain a Document level allowance VAT rate (BT-96).',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_O_7(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.charges) return true
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (charge.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX) continue
        if (charge.categoryTradeTax.rateApplicablePercent != null) {
            //printError(`Business Rule BR-O-7 is being violated in charge with amount ${charge.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_O_7_ERROR = {
    message:
        '[BR-O-7] A Document level charge (BG-21) where the VAT category code (BT-102) is "Not subject to VAT" shall not contain a Document level charge VAT rate (BT-103).',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_O_8(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithNotSubjectToVatTaxExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )
    const allowancesWithNotSubjectToVatTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )
    const chargesWithNotSubjectToVatTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    if (
        !linesWithNotSubjectToVatTaxExisting &&
        !allowancesWithNotSubjectToVatTaxExisting &&
        !chargesWithNotSubjectToVatTaxExisting
    )
        return true

    const sumOfLinesWithNotSubjectToVat = val.invoiceLines.reduce((sum, line) => {
        if (line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX) {
            return sum + line.settlement.lineTotals.netTotal
        }
        return sum
    }, 0)

    const sumOfDocumentLevelAllowancesWithNotSubjectToVat =
        val.totals.documentLevelAllowancesAndCharges?.allowances?.reduce((sum, allowance) => {
            if (allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX) {
                return sum + allowance.actualAmount
            }
            return sum
        }, 0) || 0

    const sumOfDocumentLevelChargesWithNotSubjectToVat =
        val.totals.documentLevelAllowancesAndCharges?.charges?.reduce((sum, charge) => {
            if (charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX) {
                return sum + charge.actualAmount
            }
            return sum
        }, 0) || 0

    const totalExpectedNotSubjectToVatAmount =
        sumOfLinesWithNotSubjectToVat -
        sumOfDocumentLevelAllowancesWithNotSubjectToVat +
        sumOfDocumentLevelChargesWithNotSubjectToVat

    const taxBreakdownForNotSubjectToVat = val.totals.taxBreakdown.find(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    if (!taxBreakdownForNotSubjectToVat) {
        return false
    }

    const totalProvidedNotSubjectToVatAmount = taxBreakdownForNotSubjectToVat.basisAmount

    if (
        totalProvidedNotSubjectToVatAmount - 1 <= totalExpectedNotSubjectToVatAmount &&
        totalProvidedNotSubjectToVatAmount + 1 >= totalExpectedNotSubjectToVatAmount
    ) {
        return true
    }

    return false
}

export const BR_O_8_ERROR = {
    message:
        '[BR-O-8] In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value "Not subject to VAT" specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value "Not subject to VAT" specified.',
    path: ['totals', 'taxBreakdown', 'basisAmount']
}

export function BR_O_9(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsForNotSubjectToVat = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    if (taxBreakdownsForNotSubjectToVat.length === 0) return true

    for (const taxBreakdown of taxBreakdownsForNotSubjectToVat) {
        if (taxBreakdown.calculatedAmount !== 0) return false
    }

    return true
}

export const BR_O_9_ERROR = {
    message:
        '[BR-O-9] The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value "Not subject to VAT".',
    path: ['totals', 'taxBreakdown', 'calculatedAmount']
}

export function BR_O_10(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsForNotSubjectToVat = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    if (taxBreakdownsForNotSubjectToVat.length === 0) return true

    for (const taxBreakdown of taxBreakdownsForNotSubjectToVat) {
        if (!taxBreakdown.exemptionReason && !taxBreakdown.exemptionReasonCode) return false
        if (
            taxBreakdown.exemptionReasonCode &&
            taxBreakdown.exemptionReasonCode !== EXEMPTION_REASON_CODES.Not_subject_to_VAT
        )
            return false
    }

    return true
}

export const BR_O_10_ERROR = {
    message:
        '[BR-O-10] A VAT Breakdown (BG-23) with VAT Category code (BT-118) " Not subject to VAT" shall have a VAT exemption reason code (BT-121), meaning " Not subject to VAT" or a VAT exemption reason text (BT-120) " Not subject to VAT" (or the equivalent standard text in another language).',
    path: ['totals', 'taxBreakdown', 'exemptionReason']
}

export function BR_O_11(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownForNotSubjectToVatAvailable = val.totals.taxBreakdown.some(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    if (!taxBreakdownForNotSubjectToVatAvailable) return true

    if (val.totals.taxBreakdown.length === 1) return true

    return false
}

export const BR_O_11_ERROR = {
    message:
        '[BR-O-11] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain other VAT breakdown groups (BG-23).',
    path: ['totals', 'taxBreakdown']
}

export function BR_O_12(val: availableProfiles): boolean {
    if (!('invoiceLines' in val) || !val.invoiceLines || val.invoiceLines.length === 0) {
        return true
    }
    const taxBreakdownForNotSubjectToVatAvailable = val.totals.taxBreakdown.some(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    if (!taxBreakdownForNotSubjectToVatAvailable) return true

    for (const line of val.invoiceLines) {
        if (line.settlement.tax.categoryCode !== TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX) {
            //printError(`Business Rule BR-O-12 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            return false
        }
    }

    return true
}

export const BR_O_12_ERROR = {
    message:
        '[BR-O-12] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is not "Not subject to VAT".',
    path: ['invoiceLines', 'settlement', 'tax', 'categoryCode']
}

export function BR_O_13(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownForNotSubjectToVatAvailable = val.totals.taxBreakdown.some(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    if (!taxBreakdownForNotSubjectToVatAvailable) return true

    const allowancesWithOtherCategoriesAvailable = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )
    if (allowancesWithOtherCategoriesAvailable) return false

    return true
}

export const BR_O_13_ERROR = {
    message:
        '[BR-O-13] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain Document level allowances (BG-20) where Document level allowance VAT category code (BT-95) is not "Not subject to VAT".',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'categoryCode']
}

export function BR_O_14(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownForNotSubjectToVatAvailable = val.totals.taxBreakdown.some(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )

    if (!taxBreakdownForNotSubjectToVatAvailable) return true

    const chargesWithOtherCategoriesAvailable = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.SERVICE_OUTSIDE_SCOPE_OF_TAX
    )
    if (chargesWithOtherCategoriesAvailable) return false

    return true
}

export const BR_O_14_ERROR = {
    message:
        '[BR-O-14] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain Document level charges (BG-21) where Document level charge VAT category code (BT-102) is not "Not subject to VAT".',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'categoryCode']
}

export const BR_O: BusinessRuleWithError[] = [
    { rule: BR_O_1, error: BR_O_1_ERROR },
    { rule: BR_O_2, error: BR_O_2_ERROR },
    { rule: BR_O_3, error: BR_O_3_ERROR },
    { rule: BR_O_4, error: BR_O_4_ERROR },
    { rule: BR_O_5, error: BR_O_5_ERROR },
    { rule: BR_O_6, error: BR_O_6_ERROR },
    { rule: BR_O_7, error: BR_O_7_ERROR },
    { rule: BR_O_8, error: BR_O_8_ERROR },
    { rule: BR_O_9, error: BR_O_9_ERROR },
    { rule: BR_O_10, error: BR_O_10_ERROR },
    { rule: BR_O_11, error: BR_O_11_ERROR },
    { rule: BR_O_12, error: BR_O_12_ERROR },
    { rule: BR_O_13, error: BR_O_13_ERROR },
    { rule: BR_O_14, error: BR_O_14_ERROR }
]
