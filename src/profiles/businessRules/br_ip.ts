import { availableProfiles } from '../../core/factur-x'
import { printError } from '../../types/Errors'
import { TAX_CATEGORY_CODES } from '../../types/codes'
import { isMinimumProfile } from '../minimum'
import { BusinessRuleWithError } from './br_co'

export function BR_IP_1(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true

    let linesWithIPSITaxExisting = false
    if ('invoiceLines' in val && val.invoiceLines) {
        linesWithIPSITaxExisting = val.invoiceLines.some(
            line =>
                line.settlement.tax.categoryCode ===
                TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
        )
    }

    const allowancesWithIPSITaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance =>
            allowance.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
    )

    const chargesWithIPSITaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge =>
            charge.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
    )
    if (!linesWithIPSITaxExisting && !allowancesWithIPSITaxExisting && !chargesWithIPSITaxExisting) return true

    const taxBreakdownWithIPSI = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
    )

    if (taxBreakdownWithIPSI.length >= 1) {
        return true
    }
    return false
}

export const BR_IP_1_ERROR = {
    message:
        'An Invoice that contains an Invoice line (BG-25), a Document level allowance (BG-20) or a Document level charge (BG-21) where the VAT category code (BT-151, BT-95 or BT-102) is "IPSI" shall contain in the VAT breakdown (BG-23) at least one VAT category code (BT-118) equal with "IPSI".',
    path: ['totals', 'taxBreakdown']
}

export function BR_IP_2(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithIPSITaxExisting = val.invoiceLines.some(
        line =>
            line.settlement.tax.categoryCode ===
            TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
    )
    if (!linesWithIPSITaxExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true
    }

    return false
}

export const BR_IP_2_ERROR = {
    message:
        'An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "IPSI" shall contain the Seller VAT Identifier (BT-31), the Seller tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
}

export function BR_IP_3(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true

    const allowancesWithIPSITaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance =>
            allowance.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
    )
    if (!allowancesWithIPSITaxExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true
    }

    return false
}

export const BR_IP_3_ERROR = {
    message:
        'An Invoice that contains a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "IPSI" shall contain the Seller VAT Identifier (BT-31), the Seller tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
}

export function BR_IP_4(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true

    const chargesWithIPSITaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge =>
            charge.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
    )
    if (!chargesWithIPSITaxExisting) return true

    if (
        val.seller.taxIdentification?.localTaxId ||
        val.seller.taxIdentification?.vatId ||
        val.sellerTaxRepresentative?.taxIdentification?.vatId
    ) {
        return true
    }

    return false
}

export const BR_IP_4_ERROR = {
    message:
        'An Invoice that contains a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "IPSI" shall contain the Seller VAT Identifier (BT-31), the Seller Tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).',
    path: ['seller', 'taxIdentification']
}

export function BR_IP_5(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (
            line.settlement.tax.categoryCode !==
            TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
        )
            continue
        if (line.settlement.tax.rateApplicablePercent == null || line.settlement.tax.rateApplicablePercent < 0) {
            printError(`Business Rule BR-IP-5 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            return false
        }
    }

    return true
}

export const BR_IP_5_ERROR = {
    message:
        'In an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "IPSI" the invoiced item VAT rate (BT-152) shall be greater than 0 (zero).',
    path: ['invoceLines', 'settlement', 'tax', 'rateApplicablePercent']
}

export function BR_IP_6(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.allowances) return true
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (
            allowance.categoryTradeTax.categoryCode !==
            TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
        )
            continue
        if (
            allowance.categoryTradeTax.rateApplicablePercent == null ||
            allowance.categoryTradeTax.rateApplicablePercent < 0
        ) {
            printError(`Business Rule BR-IP-6 is being violated in allowance with amount ${allowance.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_IP_6_ERROR = {
    message:
        'In a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "IPSI" the Document level allowance VAT rate (BT-96) shall be 0 (zero) or greater than zero.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_IP_7(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.charges) return true
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (
            charge.categoryTradeTax.categoryCode !==
            TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
        )
            continue
        if (
            charge.categoryTradeTax.rateApplicablePercent == null ||
            charge.categoryTradeTax.rateApplicablePercent < 0
        ) {
            printError(`Business Rule BR-IP-7 is being violated in charge with amount ${charge.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_IP_7_ERROR = {
    message:
        'In a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "IPSI" the Document level charge VAT rate (BT-103) shall be 0 (zero) or greater than zero.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_IP_8(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const sumOfLinesWithIPSITax = val.invoiceLines.reduce((sum, line) => {
        if (
            line.settlement.tax.categoryCode ===
            TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
        ) {
            return sum + line.settlement.lineTotals.netTotal
        }
        return sum
    }, 0)

    const sumOfDocumentLevelAllowancesWithIPSITax =
        val.totals.documentLevelAllowancesAndCharges?.allowances?.reduce((sum, allowance) => {
            if (
                allowance.categoryTradeTax.categoryCode ===
                TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
            ) {
                return sum + allowance.actualAmount
            }
            return sum
        }, 0) || 0

    const sumOfDocumentLevelChargesWithIPSITax =
        val.totals.documentLevelAllowancesAndCharges?.charges?.reduce((sum, charge) => {
            if (
                charge.categoryTradeTax.categoryCode ===
                TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
            ) {
                return sum + charge.actualAmount
            }
            return sum
        }, 0) || 0

    const totalExpectedIPSITaxAmount =
        sumOfLinesWithIPSITax - sumOfDocumentLevelAllowancesWithIPSITax + sumOfDocumentLevelChargesWithIPSITax

    const taxBreakdownWithIPSI = val.totals.taxBreakdown.find(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
    )

    if (!taxBreakdownWithIPSI) {
        return false
    }

    const totalProvidedIPSITaxAmount = taxBreakdownWithIPSI.basisAmount

    if (
        totalProvidedIPSITaxAmount - 1 <= totalExpectedIPSITaxAmount &&
        totalProvidedIPSITaxAmount + 1 >= totalExpectedIPSITaxAmount
    ) {
        return true
    }

    return false
}

export const BR_IP_8_ERROR = {
    message:
        'In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value IPSI specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value IPSI specified.',
    path: ['totals', 'taxBreakdown', 'basisAmount']
}

export function BR_IP_9(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    const taxBreakdownsWithIPSI = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
    )

    if (taxBreakdownsWithIPSI.length === 0) return true

    for (const taxBreakdown of taxBreakdownsWithIPSI) {
        if (taxBreakdown.rateApplicablePercent == null) return false
        const expectedAmount = taxBreakdown.basisAmount * (taxBreakdown.rateApplicablePercent / 100)
        if (Math.abs(taxBreakdown.calculatedAmount - expectedAmount) > 0.01) return false
    }

    return true
}

export const BR_IP_9_ERROR = {
    message:
        'The VAT category tax amount (BT-117) in a VAT breakdown (BG-23) where VAT category code (BT-118) is "IPSI" shall equal the VAT category taxable amount (BT-116) multiplied by the VAT category rate (BT-119).',
    path: ['totals', 'taxBreakdown', 'calculatedAmount']
}

export function BR_IP_10(val: availableProfiles): boolean {
    if (isMinimumProfile(val)) return true
    const taxBreakdownsWithIPSI = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.TAX_FOR_PRODUCTION_SERVICES_AND_IMPORTATION_IN_CEUTA_AND_MELILLA
    )

    if (taxBreakdownsWithIPSI.length === 0) return true

    for (const taxBreakdown of taxBreakdownsWithIPSI) {
        if (taxBreakdown.exemptionReason || taxBreakdown.exemptionReasonCode) return false
    }

    return true
}

export const BR_IP_10_ERROR = {
    message:
        'A VAT Breakdown (BG-23) with VAT Category code (BT-118) "IPSI" shall not have a VAT exemption reason code (BT-121) or VAT exemption reason text (BT-120).',
    path: ['totals', 'taxBreakdown', 'exemptionReason']
}

export const BR_IP: BusinessRuleWithError[] = [
    { rule: BR_IP_1, error: BR_IP_1_ERROR },
    { rule: BR_IP_2, error: BR_IP_2_ERROR },
    { rule: BR_IP_3, error: BR_IP_3_ERROR },
    { rule: BR_IP_4, error: BR_IP_4_ERROR },
    { rule: BR_IP_5, error: BR_IP_5_ERROR },
    { rule: BR_IP_6, error: BR_IP_6_ERROR },
    { rule: BR_IP_7, error: BR_IP_7_ERROR },
    { rule: BR_IP_8, error: BR_IP_8_ERROR },
    { rule: BR_IP_9, error: BR_IP_9_ERROR },
    { rule: BR_IP_10, error: BR_IP_10_ERROR }
]
