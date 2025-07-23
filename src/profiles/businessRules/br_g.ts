import { availableProfiles } from '../../core/factur-x'
import { printError } from '../../types/Errors'
import { PROFILES } from '../../types/ProfileTypes'
import { EXEMPTION_REASON_CODES, TAX_CATEGORY_CODES } from '../../types/codes'
import { BusinessRuleWithError } from './br_co'

export function BR_G_1(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    let linesWithExportOutsideEUTaxExisting = false
    if ('invoiceLines' in val && val.invoiceLines) {
        linesWithExportOutsideEUTaxExisting = val.invoiceLines.some(
            line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
        )
    }

    const allowancesWithExportOutsideEUTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )

    const chargesWithExportOutsideEUTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )
    if (
        !linesWithExportOutsideEUTaxExisting &&
        !allowancesWithExportOutsideEUTaxExisting &&
        !chargesWithExportOutsideEUTaxExisting
    )
        return true

    const taxBreakdownWithExportOutsideEU = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )

    if (taxBreakdownWithExportOutsideEU.length === 1) {
        return true
    }
    return false
}

export const BR_G_1_ERROR = {
    message:
        '[BR-G-1] An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value Export outside the EU specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Export outside the EU.',
    path: ['totals', 'taxBreakdown']
}

export function BR_G_2(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithExportOutsideEUTaxExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )
    if (!linesWithExportOutsideEUTaxExisting) return true

    if (val.seller.taxIdentification?.vatId || val.sellerTaxRepresentative?.taxIdentification?.vatId) {
        return true
    }

    return false
}

export const BR_G_2_ERROR = {
    message:
        '[BR-G-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Export outside the EU" shall contain the Seller VAT Identifier (BT-31) or the Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
}

export function BR_G_3(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const allowancesWithExportOutsideEUTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )
    if (!allowancesWithExportOutsideEUTaxExisting) return true

    if (val.seller.taxIdentification?.vatId || val.sellerTaxRepresentative?.taxIdentification?.vatId) {
        return true
    }

    return false
}

export const BR_G_3_ERROR = {
    message:
        '[BR-G-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value Export outside the EU, either the Seller VAT identifier (BT-31) or Seller tax representative VAT identifier (BT-63) must be present.',
    path: ['seller', 'taxIdentification']
}

export function BR_G_4(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const chargesWithExportOutsideEUTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )
    if (!chargesWithExportOutsideEUTaxExisting) return true

    if (val.seller.taxIdentification?.vatId || val.sellerTaxRepresentative?.taxIdentification?.vatId) {
        return true
    }

    return false
}

export const BR_G_4_ERROR = {
    message:
        '[BR-G-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value Export outside the EU, either the Seller VAT identifier (BT-31) or Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
}

export function BR_G_5(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (line.settlement.tax.categoryCode !== TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED) continue
        if (line.settlement.tax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-E-5 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            return false
        }
    }

    return true
}

export const BR_G_5_ERROR = {
    message:
        '[BR-G-5] In an INVOICE LINE (BG-25), where Invoiced item VAT category code (BT-151) has the value Export outside the EU, Invoiced item VAT rate (BT-152) must be equal to 0.',
    path: ['invoceLines', 'settlement', 'tax', 'rateApplicablePercent']
}

export function BR_G_6(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.allowances) return true
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (allowance.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED) continue
        if (allowance.categoryTradeTax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-E-6 is being violated in allowance with amount ${allowance.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_G_6_ERROR = {
    message:
        '[BR-G-6] In a DOCUMENT LEVEL ALLOWANCES (BG-20), where Document level allowance VAT category code (BT-95) has the value Export outside the EU, Document level allowance VAT rate (BT-96) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_G_7(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.charges) return true
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (charge.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED) continue
        if (charge.categoryTradeTax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-E-7 is being violated in charge with amount ${charge.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_G_7_ERROR = {
    message:
        '[BR-G-7] In a DOCUMENT LEVEL CHARGES (BG-21), where Document level charge VAT category code (BT-102) has the value Export outside the EU, Document level charge VAT rate (BT-103) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_G_8(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithExportOutsideEuTaxExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )
    const allowancesWithExportOutsideEuTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )
    const chargesWithExportOutsideEuTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )

    if (
        !linesWithExportOutsideEuTaxExisting &&
        !allowancesWithExportOutsideEuTaxExisting &&
        !chargesWithExportOutsideEuTaxExisting
    )
        return true

    const sumOfLinesWithExportOutsideEUTax = val.invoiceLines.reduce((sum, line) => {
        if (line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED) {
            return sum + line.settlement.lineTotals.netTotal
        }
        return sum
    }, 0)

    const sumOfDocumentLevelAllowancesWithExportOutsideEUTax =
        val.totals.documentLevelAllowancesAndCharges?.allowances?.reduce((sum, allowance) => {
            if (allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED) {
                return sum + allowance.actualAmount
            }
            return sum
        }, 0) || 0

    const sumOfDocumentLevelChargesWithExportOutsideEUTax =
        val.totals.documentLevelAllowancesAndCharges?.charges?.reduce((sum, charge) => {
            if (charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED) {
                return sum + charge.actualAmount
            }
            return sum
        }, 0) || 0

    const totalExpectedExportOutsideEUTaxAmount =
        sumOfLinesWithExportOutsideEUTax -
        sumOfDocumentLevelAllowancesWithExportOutsideEUTax +
        sumOfDocumentLevelChargesWithExportOutsideEUTax

    const taxBreakdownWithExportOutsideEU = val.totals.taxBreakdown.find(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )

    if (!taxBreakdownWithExportOutsideEU) {
        return false
    }

    const totalProvidedExportOutsideEUTaxAmount = taxBreakdownWithExportOutsideEU.basisAmount

    if (
        totalProvidedExportOutsideEUTaxAmount - 1 <= totalExpectedExportOutsideEUTaxAmount &&
        totalProvidedExportOutsideEUTaxAmount + 1 >= totalExpectedExportOutsideEUTaxAmount
    ) {
        return true
    }

    return false
}

export const BR_G_8_ERROR = {
    message:
        '[BR-G-8] In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value Export outside the EU specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value Export outside the EU specified.',
    path: ['totals', 'taxBreakdown', 'basisAmount']
}

export function BR_G_9(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsWithExportOutsideEU = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )

    if (taxBreakdownsWithExportOutsideEU.length === 0) return true

    for (const taxBreakdown of taxBreakdownsWithExportOutsideEU) {
        if (taxBreakdown.calculatedAmount !== 0) return false
    }

    return true
}

export const BR_G_9_ERROR = {
    message:
        '[BR-G-9] The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value Export outside the EU.',
    path: ['totals', 'taxBreakdown', 'calculatedAmount']
}

export function BR_G_10(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsWithExportOutsideEU = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED
    )

    if (taxBreakdownsWithExportOutsideEU.length === 0) return true

    for (const taxBreakdown of taxBreakdownsWithExportOutsideEU) {
        if (!taxBreakdown.exemptionReason && !taxBreakdown.exemptionReasonCode) return false

        if (
            taxBreakdown.exemptionReasonCode &&
            taxBreakdown.exemptionReasonCode !== EXEMPTION_REASON_CODES.Export_outside_the_EU
        )
            return false

        // TODO: Check if the exemptionReason is equal to "Export outside the EU" in the current language or any other language
    }

    return true
}

export const BR_G_10_ERROR = {
    message:
        '[BR-G-10] A VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Export outside the EU must contain a VAT exemption reason code (BT-121) with the value Export outside the EU or a VAT exemption reason text (BT-120) with the value Export outside the EU (or the equivalent in another language).',
    path: ['totals', 'taxBreakdown', 'exemptionReason']
}

export const BR_G: BusinessRuleWithError[] = [
    { rule: BR_G_1, error: BR_G_1_ERROR },
    { rule: BR_G_2, error: BR_G_2_ERROR },
    { rule: BR_G_3, error: BR_G_3_ERROR },
    { rule: BR_G_4, error: BR_G_4_ERROR },
    { rule: BR_G_5, error: BR_G_5_ERROR },
    { rule: BR_G_6, error: BR_G_6_ERROR },
    { rule: BR_G_7, error: BR_G_7_ERROR },
    { rule: BR_G_8, error: BR_G_8_ERROR },
    { rule: BR_G_9, error: BR_G_9_ERROR },
    { rule: BR_G_10, error: BR_G_10_ERROR }
]
