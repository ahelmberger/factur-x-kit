import { availableProfiles } from '../../core/factur-x'
import { PROFILES } from '../../types/ProfileTypes'
import { EXEMPTION_REASON_CODES, TAX_CATEGORY_CODES } from '../../types/codes'
import { BusinessRuleWithError } from './br_co'

export function BR_IC_1(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    let linesWithIntraCommunityTaxExisting = false
    if ('invoiceLines' in val && val.invoiceLines) {
        linesWithIntraCommunityTaxExisting = val.invoiceLines.some(
            line =>
                line.settlement.tax.categoryCode ===
                TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
        )
    }

    const allowancesWithIntraCommunityTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance =>
            allowance.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )

    const chargesWithIntraCommunityTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge =>
            charge.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )
    if (
        !linesWithIntraCommunityTaxExisting &&
        !allowancesWithIntraCommunityTaxExisting &&
        !chargesWithIntraCommunityTaxExisting
    )
        return true

    const taxBreakdownWithIntraCommunity = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )

    if (taxBreakdownWithIntraCommunity.length === 1) {
        return true
    }
    return false
}

export const BR_IC_1_ERROR = {
    message:
        '[BR-IC-1] An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value intra-community supply specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value intra-community supply.',
    path: ['totals', 'taxBreakdown']
}

export function BR_IC_2(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithIntraCommunityTaxExisting = val.invoiceLines.some(
        line =>
            line.settlement.tax.categoryCode ===
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )
    if (!linesWithIntraCommunityTaxExisting) return true

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

export const BR_IC_2_ERROR = {
    message:
        '[BR-IC-2] An Invoice (INVOICE) that contains an item where the Invoiced item VAT category code (BT-151) has the value intra-community supply specified, must contain the Seller VAT identifier (BT-31), the Seller tax registration identifier (BT-32) or the Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier.',
    path: ['seller', 'taxIdentification']
}

export function BR_IC_3(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const allowancesWithIntraCommunityTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance =>
            allowance.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )
    if (!allowancesWithIntraCommunityTaxExisting) return true

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

export const BR_IC_3_ERROR = {
    message:
        '[BR-IC-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value intra-community supply, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier must be present.',
    path: ['seller', 'taxIdentification']
}

export function BR_IC_4(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true

    const chargesWithIntraCommunityTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge =>
            charge.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )
    if (!chargesWithIntraCommunityTaxExisting) return true

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

export const BR_IC_4_ERROR = {
    message:
        '[BR-IC-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value intra-community supply, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier must be present.',
    path: ['seller', 'taxIdentification']
}

export function BR_IC_5(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (
            line.settlement.tax.categoryCode !==
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
        )
            continue
        if (line.settlement.tax.rateApplicablePercent !== 0) {
            //printError(`Business Rule BR-E-5 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            return false
        }
    }

    return true
}

export const BR_IC_5_ERROR = {
    message:
        '[BR-IC-5] In an INVOICE LINE (BG-25), where Invoiced item VAT category code (BT-151) has the value intra-community supply, Invoiced item VAT rate (BT-152) must be equal to 0.',
    path: ['invoceLines', 'settlement', 'tax', 'rateApplicablePercent']
}

export function BR_IC_6(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.allowances) return true
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (
            allowance.categoryTradeTax.categoryCode !==
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
        )
            continue
        if (allowance.categoryTradeTax.rateApplicablePercent !== 0) {
            //printError(`Business Rule BR-E-6 is being violated in allowance with amount ${allowance.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_IC_6_ERROR = {
    message:
        '[BR-IC-6] In a DOCUMENT LEVEL ALLOWANCES (BG-20), where Document level allowance VAT category code (BT-95) has the value intra-community supply, Document level allowance VAT rate (BT-96) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_IC_7(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges?.charges) return true
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (
            charge.categoryTradeTax.categoryCode !==
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
        )
            continue
        if (charge.categoryTradeTax.rateApplicablePercent !== 0) {
            //printError(`Business Rule BR-E-7 is being violated in charge with amount ${charge.actualAmount}`)
            return false
        }
    }

    return true
}

export const BR_IC_7_ERROR = {
    message:
        '[BR-IC-7] In a DOCUMENT LEVEL CHARGES (BG-21), where Document level charge VAT category code (BT-102) has the value intra-community supply, Document level charge VAT rate (BT-103) must be equal to 0.',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'categoryTradeTax', 'rateApplicablePercent']
}

export function BR_IC_8(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    const linesWithIntraCommunityTaxExisting = val.invoiceLines.some(
        line =>
            line.settlement.tax.categoryCode ===
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )
    const allowancesWithIntraCommunityTaxExisting = val.totals.documentLevelAllowancesAndCharges?.allowances?.some(
        allowance =>
            allowance.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )
    const chargesWithIntraCommunityTaxExisting = val.totals.documentLevelAllowancesAndCharges?.charges?.some(
        charge =>
            charge.categoryTradeTax.categoryCode ===
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )

    if (
        !linesWithIntraCommunityTaxExisting &&
        !allowancesWithIntraCommunityTaxExisting &&
        !chargesWithIntraCommunityTaxExisting
    )
        return true

    const sumOfLinesWithIntraCommunityTax = val.invoiceLines.reduce((sum, line) => {
        if (
            line.settlement.tax.categoryCode ===
            TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
        ) {
            return sum + line.settlement.lineTotals.netTotal
        }
        return sum
    }, 0)

    const sumOfDocumentLevelAllowancesWithIntraCommunityTax =
        val.totals.documentLevelAllowancesAndCharges?.allowances?.reduce((sum, allowance) => {
            if (
                allowance.categoryTradeTax.categoryCode ===
                TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
            ) {
                return sum + allowance.actualAmount
            }
            return sum
        }, 0) || 0

    const sumOfDocumentLevelChargesWithIntraCommunityTax =
        val.totals.documentLevelAllowancesAndCharges?.charges?.reduce((sum, charge) => {
            if (
                charge.categoryTradeTax.categoryCode ===
                TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
            ) {
                return sum + charge.actualAmount
            }
            return sum
        }, 0) || 0

    const totalExpectedIntraCommunityTaxAmount =
        sumOfLinesWithIntraCommunityTax -
        sumOfDocumentLevelAllowancesWithIntraCommunityTax +
        sumOfDocumentLevelChargesWithIntraCommunityTax

    const taxBreakdownWithIntraCommunity = val.totals.taxBreakdown.find(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )

    if (!taxBreakdownWithIntraCommunity) {
        return false
    }

    const totalProvidedIntraCommunityTaxAmount = taxBreakdownWithIntraCommunity.basisAmount

    if (
        totalProvidedIntraCommunityTaxAmount - 0.1 <= totalExpectedIntraCommunityTaxAmount &&
        totalProvidedIntraCommunityTaxAmount + 0.1 >= totalExpectedIntraCommunityTaxAmount
    ) {
        return true
    }

    return false
}

export const BR_IC_8_ERROR = {
    message:
        '[BR-IC-8] In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value intra-community supply specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value intra-community supply specified.',
    path: ['totals', 'taxBreakdown', 'basisAmount']
}

export function BR_IC_9(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsWithIntraCommunity = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )

    if (taxBreakdownsWithIntraCommunity.length === 0) return true

    for (const taxBreakdown of taxBreakdownsWithIntraCommunity) {
        if (taxBreakdown.calculatedAmount !== 0) return false
    }

    return true
}

export const BR_IC_9_ERROR = {
    message:
        '[BR-IC-9] The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value intra-community supply.',
    path: ['totals', 'taxBreakdown', 'calculatedAmount']
}

export function BR_IC_10(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsWithIntraCommunity = val.totals.taxBreakdown.filter(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )

    if (taxBreakdownsWithIntraCommunity.length === 0) return true

    for (const taxBreakdown of taxBreakdownsWithIntraCommunity) {
        if (!taxBreakdown.exemptionReason && !taxBreakdown.exemptionReasonCode) return false

        if (
            taxBreakdown.exemptionReasonCode &&
            !(
                taxBreakdown.exemptionReasonCode === EXEMPTION_REASON_CODES.Intra_Community_supply ||
                taxBreakdown.exemptionReasonCode ===
                    EXEMPTION_REASON_CODES.Intra_Community_acquisition_from_second_hand_means_of_transport ||
                taxBreakdown.exemptionReasonCode ===
                    EXEMPTION_REASON_CODES.Intra_Community_acquisition_of_collectors_items_and_antiques ||
                taxBreakdown.exemptionReasonCode ===
                    EXEMPTION_REASON_CODES.Intra_Community_acquisition_of_second_hand_goods ||
                taxBreakdown.exemptionReasonCode === EXEMPTION_REASON_CODES.Intra_Community_acquisition_of_works_of_art
            )
        )
            return false

        // TODO: Check if the exemptionReason is equal to "intra-community supply" in the current language or any other language
    }

    return true
}

export const BR_IC_10_ERROR = {
    message:
        '[BR-IC-10] A VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value intra-community supply must contain a VAT exemption reason code (BT-121) with the value intra-community supply or a VAT exemption reason text (BT-120) with the value intra-community supply (or the equivalent in another language).',
    path: ['totals', 'taxBreakdown', 'exemptionReason']
}

export function BR_IC_11(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsWithIntraCommunityAvailable = val.totals.taxBreakdown.some(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )
    if (!taxBreakdownsWithIntraCommunityAvailable) return true

    if (!val.delivery?.deliveryDate && !val.delivery?.billingPeriod) return false

    return true
}

export const BR_IC_11_ERROR = {
    message:
        '[BR-IC-11] In an Invoice with a VAT breakdown (BG-23) where the VAT category code (BT-118) is "Intra-community supply" the Actual delivery date (BT-72) or the Invoicing period (BG-14) shall not be blank.',
    path: ['delivery', 'deliveryDate']
}

export function BR_IC_12(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    const taxBreakdownsWithIntraCommunityAvailable = val.totals.taxBreakdown.some(
        tax => tax.categoryCode === TAX_CATEGORY_CODES.VAT_EXEMPT_FOR_EEA_INTRA_COMMUNITY_SUPPLY_OF_GOODS_AND_SERVICES
    )
    if (!taxBreakdownsWithIntraCommunityAvailable) return true

    if (!val.delivery?.recipient?.postalAddress.country) return false

    return true
}

export const BR_IC_12_ERROR = {
    message:
        '[BR-IC-12] In an Invoice with a VAT breakdown (BG-23) where the VAT category code (BT-118) is "Intra-community supply" the Deliver to country code (BT-80) shall not be blank.',
    path: ['delivery', 'deliveryDate']
}

export const BR_IC: BusinessRuleWithError[] = [
    { rule: BR_IC_1, error: BR_IC_1_ERROR },
    { rule: BR_IC_2, error: BR_IC_2_ERROR },
    { rule: BR_IC_3, error: BR_IC_3_ERROR },
    { rule: BR_IC_4, error: BR_IC_4_ERROR },
    { rule: BR_IC_5, error: BR_IC_5_ERROR },
    { rule: BR_IC_6, error: BR_IC_6_ERROR },
    { rule: BR_IC_7, error: BR_IC_7_ERROR },
    { rule: BR_IC_8, error: BR_IC_8_ERROR },
    { rule: BR_IC_9, error: BR_IC_9_ERROR },
    { rule: BR_IC_10, error: BR_IC_10_ERROR },
    { rule: BR_IC_11, error: BR_IC_11_ERROR },
    { rule: BR_IC_12, error: BR_IC_12_ERROR }
]
