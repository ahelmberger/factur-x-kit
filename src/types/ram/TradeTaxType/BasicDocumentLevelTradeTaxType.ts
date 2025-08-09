import { z } from 'zod';

import { ZCodeType } from '../../CodeTypeConverter';
import { EXEMPTION_REASON_CODES, TAX_CATEGORY_CODES, TAX_TYPE_CODE, TIME_REFERENCE_CODES } from '../../codes';
import { ZAmountType, ZAmountTypeXml } from '../../udt/AmountTypeConverter';
import { ZPercentType, ZPercentTypeXml } from '../../udt/PercentTypeConverter';
import { ZTextType, ZTextTypeXml } from '../../udt/TextTypeConverter';

export const ZBasicDocumentLevelTradeTaxType = z.object({
    calculatedAmount: ZAmountType,
    typeCode: ZCodeType(TAX_TYPE_CODE),
    exemptionReason: ZTextType.optional(),
    basisAmount: ZAmountType,
    categoryCode: ZCodeType(TAX_CATEGORY_CODES),
    exemptionReasonCode: ZCodeType(EXEMPTION_REASON_CODES).optional(),
    dueDateTypeCode: ZCodeType(TIME_REFERENCE_CODES).optional(),
    rateApplicablePercent: ZPercentType.optional()
});

export type BasicDocumentLevelTradeTaxType = z.infer<typeof ZBasicDocumentLevelTradeTaxType>;

export const ZBasicDocumentLevelTradeTaxTypeXml = z.object({
    'ram:CalculatedAmount': ZAmountTypeXml,
    'ram:TypeCode': ZTextTypeXml,
    'ram:ExemptionReason': ZTextTypeXml.optional(),
    'ram:BasisAmount': ZAmountTypeXml,
    'ram:CategoryCode': ZTextTypeXml,
    'ram:ExemptionReasonCode': ZTextTypeXml.optional(),
    'ram:DueDateTypeCode': ZTextTypeXml.optional(),
    'ram:RateApplicablePercent': ZPercentTypeXml.optional()
});

export type BasicDocumentLevelTradeTaxTypeXml = z.infer<typeof ZBasicDocumentLevelTradeTaxTypeXml>;
