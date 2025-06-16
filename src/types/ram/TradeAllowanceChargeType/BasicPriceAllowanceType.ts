import { z } from 'zod'

import { ZAmountType, ZAmountTypeXml } from '../../udt/AmountTypeConverter'
import { ZIndicatorTypeXml } from '../../udt/IndicatorTypeConverter'

const ZInnerBasicPriceAllowanceType = z.object({
    actualAmount: ZAmountType.describe('BT-147')
})

export const ZBasicPriceAllowanceType = z.object({
    allowances: ZInnerBasicPriceAllowanceType.array().max(1).optional()
})

export type BasicPriceAllowanceType = z.infer<typeof ZBasicPriceAllowanceType>

const ZBasicPriceAllowanceTypeXmlBasis = z.object({
    'ram:ChargeIndicator': ZIndicatorTypeXml,
    'ram:ActualAmount': ZAmountTypeXml
})

export const ZBasicPriceAllowanceTypeXml = z.union([
    ZBasicPriceAllowanceTypeXmlBasis,
    ZBasicPriceAllowanceTypeXmlBasis.array()
])

export type BasicPriceAllowanceTypeXml = z.infer<typeof ZBasicPriceAllowanceTypeXml>
