import { availableProfiles } from '../../core/factur-x'
import { printError } from '../../types/Errors'
import { PROFILES } from '../../types/ProfileTypes'
import { EXEMPTION_REASON_CODES, TAX_CATEGORY_CODES } from '../../types/codes'
import { BusinessRuleWithError } from './br_co'

export function BR_AE_1(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    let linesWithReverseChargeTaxExisting = false
    if ('invoiceLines' in val && val.invoiceLines) {
        linesWithReverseChargeTaxExisting = val.invoiceLines.some(
            line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
        )
    }

    const allowancesWithReverseChargeTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )

    const chargesWithReverseChargeTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )
    if (
        !linesWithReverseChargeTaxExisting &&
        !allowancesWithReverseChargeTaxExisting &&
        !chargesWithReverseChargeTaxExisting
    )
        return true

    const taxBreakdownWithReverseCharge = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )

    if (taxBreakdownWithReverseCharge.length === 1) {
        return true
    }
    return false
}

export const BR_AE_1_ERROR = {
    message:
        '[BR-AE-1] An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value Reverse charge specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Reverse charge.',
    path: ['totals', 'taxBreakdown']
}

export function BR_AE_2(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithReverseChargeTaxExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )
    if (!linesWithReverseChargeTaxExisting) return true

    if (
        (val.seller.taxIdentification?.localTaxId ||
            val.seller.taxIdentification?.vatId ||
            val.sellerTaxRepresentative?.taxIdentification?.vatId) &&
        val.buyer.taxIdentification &&
        (('vatId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.vatId) ||
            ('localTaxId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.localTaxId))
    ) {
        return true
    }

    return false
}

export const BR_AE_2_ERROR = {
    message:
        '[BR-AE-2] An Invoice (INVOICE) that contains an item where the Invoiced item VAT category code (BT-151) has the value Reverse charge specified, must contain the Seller VAT identifier (BT-31), the Seller tax registration identifier (BT-32) or the Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier.',
    path: ['seller', 'taxIdentification']
}

export function BR_AE_3(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const allowancesWithReverseChargeTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )
    if (!allowancesWithReverseChargeTaxExisting) return true

    if (
        (val.seller.taxIdentification?.localTaxId ||
            val.seller.taxIdentification?.vatId ||
            val.sellerTaxRepresentative?.taxIdentification?.vatId) &&
        val.buyer.taxIdentification &&
        (('vatId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.vatId) ||
            ('localTaxId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.localTaxId))
    ) {
        return true
    }

    return false
}

export const BR_AE_3_ERROR = {
    message:
        '[BR-AE-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value Reverse charge, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier must be present.',
    path: ['seller', 'taxIdentification']
}

export function BR_AE_4(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const chargesWithReverseChargeTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )
    if (!chargesWithReverseChargeTaxExisting) return true

    if (
        (val.seller.taxIdentification?.localTaxId ||
            val.seller.taxIdentification?.vatId ||
            val.sellerTaxRepresentative?.taxIdentification?.vatId) &&
        val.buyer.taxIdentification &&
        (('vatId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.vatId) ||
            ('localTaxId' in val.buyer.taxIdentification && val.buyer.taxIdentification?.localTaxId))
    ) {
        return true
    }

    return false
}

export const BR_AE_4_ERROR = {
    message:
        '[BR-AE-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value Reverse charge, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier must be present.',
    path: ['seller', 'taxIdentification']
}

export function BR_AE_5(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (line.settlement.tax.categoryCode !== TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE) continue
        if (line.settlement.tax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-AE-5 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            return false
        }
    }

    return true
}

export const BR_AE_5_ERROR = {
    message:
        '[BR-AE-5] In an INVOICE LINE (BG-25), where Invoiced item VAT category code (BT-151) has the value Reverse charge, Invoiced item VAT rate (BT-152) must be equal to 0.',
    path: ['invoceLines', 'settlement', 'tax', 'rateApplicablePercent']
}

export function BR_AE_6(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.allowances) return true
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (allowance.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE) continue
        if (allowance.categoryTradeTax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-AE-6 is being violated in allowance with amount ${allowance.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_AE_6_ERROR = {
    message:
        '[BR-AE-6] In a DOCUMENT LEVEL ALLOWANCES (BG-20), where Document level allowance VAT category code (BT-95) has the value Reverse charge, Document level allowance VAT rate (BT-96) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_AE_7(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.charges) return true
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (charge.categoryTradeTax.categoryCode !== TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE) continue
        if (charge.categoryTradeTax.rateApplicablePercent !== 0) {
            printError(`Business Rule BR-AE-7 is being violated in charge with amount ${charge.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_AE_7_ERROR = {
    message:
        '[BR-AE-7] In a DOCUMENT LEVEL CHARGES (BG-21), where Document level charge VAT category code (BT-102) has the value Reverse charge, Document level charge VAT rate (BT-103) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_AE_8(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true
    if (val.invoiceLines.length === 0) return true

    const linesWithReverseChargeTaxExisting = val.invoiceLines.some(
        line => line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )
    const allowancesWithReverseChargeTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance => allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )
    const chargesWithReverseChargeTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge => charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )

    if (
        !linesWithReverseChargeTaxExisting &&
        !allowancesWithReverseChargeTaxExisting &&
        !chargesWithReverseChargeTaxExisting
    )
        return true

    const sumOfLinesWithReverseChargeTax =
        val.invoiceLines.reduce((sum, line) => {
            if (line.settlement.tax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE) {
                return sum + line.settlement.lineTotals.netTotal
            }
            return sum
        }, 0) || 0

    const sumOfDocumentLevelAllowancesWithReverseChargeTax =
        val.totals.documentLevelAllowancesAndCharges?.allowances?.reduce((sum, allowance) => {
            if (allowance.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE) {
                return sum + allowance.actualAmount
            }
            return sum
        }, 0) || 0

    const sumOfDocumentLevelChargesWithReverseChargeTax =
        val.totals.documentLevelAllowancesAndCharges?.charges?.reduce((sum, charge) => {
            if (charge.categoryTradeTax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE) {
                return sum + charge.actualAmount
            }
            return sum
        }, 0) || 0

    const totalExpectedReverseChargeTaxAmount =
        sumOfLinesWithReverseChargeTax -
        sumOfDocumentLevelAllowancesWithReverseChargeTax +
        sumOfDocumentLevelChargesWithReverseChargeTax

    const taxBreakdownWithReverseCharge = val.totals.taxBreakdown.find(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )

    if (!taxBreakdownWithReverseCharge) {
        return false
    }

    const totalProvidedReverseChargeTaxAmount = taxBreakdownWithReverseCharge.basisAmount

    if (
        totalProvidedReverseChargeTaxAmount - 1 <= totalExpectedReverseChargeTaxAmount &&
        totalProvidedReverseChargeTaxAmount + 1 >= totalExpectedReverseChargeTaxAmount
    ) {
        return true
    }

    return false
}

export const BR_AE_8_ERROR = {
    message:
        '[BR-AE-8] In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value Reverse charge specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value Reverse charge specified.',
    path: ['totals', 'taxBreakdown', 'basisAmount']
}

export function BR_AE_9(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsWithReverseCharge = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )

    if (taxBreakdownsWithReverseCharge.length === 0) return true

    for (const taxBreakdown of taxBreakdownsWithReverseCharge) {
        if (taxBreakdown.calculatedAmount !== 0) return false
    }

    return true
}

export const BR_AE_9_ERROR = {
    message:
        '[BR-AE-9] The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value Reverse charge.',
    path: ['totals', 'taxBreakdown', 'calculatedAmount']
}

export function BR_AE_10(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsWithReverseCharge = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE
    )

    if (taxBreakdownsWithReverseCharge.length === 0) return true

    for (const taxBreakdown of taxBreakdownsWithReverseCharge) {
        if (!taxBreakdown.exemptionReason && !taxBreakdown.exemptionReasonCode) return false

        if (
            taxBreakdown.exemptionReasonCode &&
            taxBreakdown.exemptionReasonCode !== EXEMPTION_REASON_CODES.Reverse_charge
        )
            return false

        // TODO: Check if the exemptionReason is equal to "Reverse charge" in the current language or any other language
    }

    return true
}

export const BR_AE_10_ERROR = {
    message:
        '[BR-AE-10] A VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Reverse charge must contain a VAT exemption reason code (BT-121) with the value Reverse charge or a VAT exemption reason text (BT-120) with the value Reverse charge (or the equivalent in another language).',
    path: ['totals', 'taxBreakdown', 'exemptionReason']
}

export const BR_AE: BusinessRuleWithError[] = [
    { rule: BR_AE_1, error: BR_AE_1_ERROR },
    { rule: BR_AE_2, error: BR_AE_2_ERROR },
    { rule: BR_AE_3, error: BR_AE_3_ERROR },
    { rule: BR_AE_4, error: BR_AE_4_ERROR },
    { rule: BR_AE_5, error: BR_AE_5_ERROR },
    { rule: BR_AE_6, error: BR_AE_6_ERROR },
    { rule: BR_AE_7, error: BR_AE_7_ERROR },
    { rule: BR_AE_8, error: BR_AE_8_ERROR },
    { rule: BR_AE_9, error: BR_AE_9_ERROR },
    { rule: BR_AE_10, error: BR_AE_10_ERROR }
]
