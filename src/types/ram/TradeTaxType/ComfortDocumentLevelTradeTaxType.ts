import { z } from 'zod'

import { ZCodeType } from '../../CodeTypeConverter'
import { EXEMPTION_REASON_CODES, TAX_CATEGORY_CODES, TAX_TYPE_CODE, TIME_REFERENCE_CODES } from '../../codes'
import { ZAmountType, ZAmountTypeXml } from '../../udt/AmountTypeConverter'
import { ZDateTimeType } from '../../udt/DateTimeTypeConverter'
import { ZPercentType, ZPercentTypeXml } from '../../udt/PercentTypeConverter'
import { ZTextType, ZTextTypeXml } from '../../udt/TextTypeConverter'

export const ZComfortDocumentLevelTradeTaxType = z.object({
    calculatedAmount: ZAmountType,
    typeCode: ZCodeType(TAX_TYPE_CODE),
    exemptionReason: ZTextType.optional(),
    basisAmount: ZAmountType,
    categoryCode: ZCodeType(TAX_CATEGORY_CODES),
    exemptionReasonCode: ZCodeType(EXEMPTION_REASON_CODES).optional(),
    taxPointDate: ZDateTimeType.optional(),
    dueDateTypeCode: ZCodeType(TIME_REFERENCE_CODES).optional(),
    rateApplicablePercent: ZPercentType.optional()
})

export type ComfortDocumentLevelTradeTaxType = z.infer<typeof ZComfortDocumentLevelTradeTaxType>

export const ZComfortDocumentLevelTradeTaxTypeXml = z.object({
    'ram:CalculatedAmount': ZAmountTypeXml,
    'ram:TypeCode': ZTextTypeXml,
    'ram:ExemptionReason': ZTextTypeXml.optional(),
    'ram:BasisAmount': ZAmountTypeXml,
    'ram:CategoryCode': ZTextTypeXml,
    'ram:ExemptionReasonCode': ZTextTypeXml.optional(),
    'ram:TaxPointDate': ZDateTimeType.optional(),
    'ram:DueDateTypeCode': ZTextTypeXml.optional(),
    'ram:RateApplicablePercent': ZPercentTypeXml.optional()
})

export type ComfortDocumentLevelTradeTaxTypeXml = z.infer<typeof ZComfortDocumentLevelTradeTaxTypeXml>
