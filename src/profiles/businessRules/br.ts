import { availableProfiles } from '../../core/factur-x'
import { PROFILES } from '../../types/ProfileTypes'
import { PAYMENT_MEANS_CODES } from '../../types/codes'
import { DateTimeType } from '../../types/udt/DateTimeTypeConverter'
import { BusinessRuleWithError } from './br_co'

export function BR_16(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (val.profile === PROFILES.BASIC_WITHOUT_LINES) return true

    if (!('invoiceLines' in val)) return false
    if (!val.invoiceLines) return false
    if (val.invoiceLines.length < 1) return false

    return true
}

export const BR_16_ERROR = {
    message: '[BR-16] An Invoice (INVOICE) must contain at least one Invoice Line (invoiceLine - BG-25).',
    path: ['invoiceLines']
}

export function BR_21(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (val.profile === PROFILES.BASIC_WITHOUT_LINES) return true

    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true
    const lineIds = val.invoiceLines.map(line => line.generalLineData.lineId)
    const uniqueLineIds = new Set(lineIds)
    if (lineIds.length !== uniqueLineIds.size) {
        return false
    }

    return true
}

export const BR_21_ERROR = {
    message: '[BR-21] Every Invoice Line (invoiceLine - BG-25) needs to have a unique lineId (BT-126).',
    path: ['invoiceLines', 'generalLineData', 'lineId']
}

export function BR_27(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (val.profile === PROFILES.BASIC_WITHOUT_LINES) return true

    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (line.productPriceAgreement.productNetPricing.netPricePerItem < 0) {
            return false
        }
    }
    return true
}

export const BR_27_ERROR = {
    message: '[BR-27] The netPricePerItem (BT-146) of each invoice line must not be negative.',
    path: ['invoiceLines', 'productPriceAgreement', 'productNetPricing', 'netPricePerItem']
}

export function BR_28(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (val.profile === PROFILES.BASIC_WITHOUT_LINES) return true

    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (!line.productPriceAgreement.productPricing?.basisPricePerItem) continue
        if (line.productPriceAgreement.productPricing.basisPricePerItem < 0) {
            return false
        }
    }
    return true
}

export const BR_28_ERROR = {
    message: '[BR-28] The basisPricePerItem (BT-148) of each invoice line must not be negative.',
    path: ['invoiceLines', 'productPriceAgreement', 'productPricing', 'basisPricePerItem']
}

function startDateBeforeEndDate(startDate: DateTimeType, endDate: DateTimeType): boolean {
    const start = new Date(startDate.year, startDate.month - 1, startDate.day)
    const end = new Date(endDate.year, endDate.month - 1, endDate.day)
    return end >= start
}

export function BR_29(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!('delivery' in val)) return true
    if (!val.delivery) return true
    if (!('billingPeriod' in val.delivery)) return true
    if (!val.delivery?.billingPeriod) return true

    if (!val.delivery.billingPeriod.startDate || !val.delivery.billingPeriod.endDate) {
        return true
    }
    return startDateBeforeEndDate(val.delivery.billingPeriod.startDate, val.delivery.billingPeriod.endDate)
}

export const BR_29_ERROR = {
    message:
        '[BR-29] If start- and end date of the billing Period is given, the endDate (BT-74) must be on or after the startDate (BT-73).',
    path: ['delivery', 'billingPeriod']
}

export function BR_30(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (val.profile === PROFILES.BASIC_WITHOUT_LINES) return true

    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (!line.settlement?.billingPeriod) continue
        if (!line.settlement.billingPeriod.startDate || !line.settlement.billingPeriod.endDate) {
            continue
        }
        if (!startDateBeforeEndDate(line.settlement.billingPeriod.startDate, line.settlement.billingPeriod.endDate))
            return false
    }
    return true
}

export const BR_30_ERROR = {
    message:
        '[BR-30] If the start and end dates of the invoice line period are given, the Invoice line period end date (BT-135) must be on or after the Invoice line period start date (BT-134).',
    path: ['invoiceLines', 'settlement', 'billingPeriod']
}

interface allowanceAndChargeReasonCheckerType {
    reason?: string
    reasonCode?: string
}

function checkAllowanceAndChargeReasons(val: allowanceAndChargeReasonCheckerType): boolean {
    if (!val) return true
    return !!(val.reason || val.reasonCode)
}

export function BR_33(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges) return true
    if (!val.totals.documentLevelAllowancesAndCharges.allowances) return true
    if (val.totals.documentLevelAllowancesAndCharges.allowances.length === 0) return true
    for (const allowance of val.totals.documentLevelAllowancesAndCharges.allowances) {
        if (!checkAllowanceAndChargeReasons(allowance)) {
            return false
        }
    }
    return true
}

export const BR_33_ERROR = {
    message:
        '[BR-33] Any DOCUMENT LEVEL ALLOWANCES (BG-20) for the invoice as a whole must have a Document level allowance reason (BT-97) or a corresponding Document level allowance reason code (BT-98).',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'allowances', 'reason']
}

export function BR_38(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!val.totals.documentLevelAllowancesAndCharges) return true
    if (!val.totals.documentLevelAllowancesAndCharges.charges) return true
    if (val.totals.documentLevelAllowancesAndCharges.charges.length === 0) return true
    for (const charge of val.totals.documentLevelAllowancesAndCharges.charges) {
        if (!checkAllowanceAndChargeReasons(charge)) {
            return false
        }
    }
    return true
}

export const BR_38_ERROR = {
    message:
        '[BR-38] Each Document level charge (BG-21) must include a Document level charge reason (BT-104) or a corresponding Document level charge reason code (BT-105).',
    path: ['totals', 'documentLevelAllowancesAndCharges', 'charges', 'reason']
}

export function BR_42(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (!line.settlement.lineLevelAllowancesAndCharges) return true
        if (!line.settlement.lineLevelAllowancesAndCharges.allowances) return true
        if (line.settlement.lineLevelAllowancesAndCharges.allowances.length === 0) return true
        for (const allowance of line.settlement.lineLevelAllowancesAndCharges.allowances) {
            if (!checkAllowanceAndChargeReasons(allowance)) {
                return false
            }
        }
    }
    return true
}

export const BR_42_ERROR = {
    message:
        '[BR-42] Each Invoice line âllowance (BG-27) must include an Invoice line allowance reason (BT-139) or a corresponding Invoice line allowance reason code (BT-140).',
    path: ['invoiceLines', 'settlement', 'lineLevelAllowancesAndCharges', 'allowances', 'reason']
}

export function BR_44(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true
    if (!val.invoiceLines) return true

    for (const line of val.invoiceLines) {
        if (!line.settlement.lineLevelAllowancesAndCharges) return true
        if (!line.settlement.lineLevelAllowancesAndCharges.charges) return true
        if (line.settlement.lineLevelAllowancesAndCharges.charges.length === 0) return true
        for (const charge of line.settlement.lineLevelAllowancesAndCharges.charges) {
            if (!checkAllowanceAndChargeReasons(charge)) {
                return false
            }
        }
    }
    return true
}

export const BR_44_ERROR = {
    message:
        '[BR-44] Each Invoice line charges (BG-28) must include an Invoice line charge reason (BT-144) or a corresponding Invoice line charge reason code (BT-145).',
    path: ['invoiceLines', 'settlement', 'lineLevelAllowancesAndCharges', 'charges', 'reason']
}

export function BR_53(val: availableProfiles): boolean {
    if (!('taxCurrency' in val.totals)) return true
    if (!val.totals.taxCurrency) return true
    const taxCurrency = val.totals.taxCurrency
    if (!val.totals.taxTotal) return false
    const taxInTaxCurrency = val.totals.taxTotal.find(tax => tax.currency === taxCurrency)
    if (!taxInTaxCurrency) return false
    return true
}

export const BR_53_ERROR = {
    message:
        '[BR-53] If a currency for VAT accounting has been specified, the Invoice total VAT amount in accounting currency (BT-111) must be provided.',
    path: ['totals', 'taxTotal']
}

export function BR_61(val: availableProfiles): boolean {
    if (val.profile === PROFILES.MINIMUM) return true
    if (!('paymentMeans' in val.paymentInformation)) return true
    if (!val.paymentInformation.paymentMeans) return true
    if (val.paymentInformation.paymentMeans.length === 0) return true
    for (const paymentMeans of val.paymentInformation.paymentMeans) {
        if (
            paymentMeans.paymentType !== PAYMENT_MEANS_CODES.SEPA_credit_transfer &&
            paymentMeans.paymentType !== PAYMENT_MEANS_CODES.Credit_transfer
        ) {
            continue
        }
        if (!paymentMeans.payeeBankAccount?.iban && !paymentMeans.payeeBankAccount?.propriataryId) {
            return false
        }
    }
    return true
}

export const BR_61_ERROR = {
    message:
        '[BR-61] If the payment means type is SEPA, local credit transfer, or non-SEPA credit transfer, the Payment account identifier (BT-84) of the payee must be provided.',
    path: ['paymentInformation', 'paymentMeans', 'payeeBankAccount']
}

export const BR: BusinessRuleWithError[] = [
    { rule: BR_16, error: BR_16_ERROR },
    { rule: BR_21, error: BR_21_ERROR },
    { rule: BR_27, error: BR_27_ERROR },
    { rule: BR_28, error: BR_28_ERROR },
    { rule: BR_29, error: BR_29_ERROR },
    { rule: BR_30, error: BR_30_ERROR },
    { rule: BR_33, error: BR_33_ERROR },
    { rule: BR_38, error: BR_38_ERROR },
    { rule: BR_42, error: BR_42_ERROR },
    { rule: BR_44, error: BR_44_ERROR },
    { rule: BR_53, error: BR_53_ERROR },
    { rule: BR_61, error: BR_61_ERROR }
]
