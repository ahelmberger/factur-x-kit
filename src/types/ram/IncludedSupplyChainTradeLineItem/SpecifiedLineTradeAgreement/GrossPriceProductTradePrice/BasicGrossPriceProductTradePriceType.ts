import { z } from 'zod'

import { ZAmountType, ZAmountTypeXml } from '../../../../udt/AmountTypeConverter'
import { ZQuantityType, ZQuantityTypeXml } from '../../../../udt/QuantityTypeConverter'
import {
    ZBasicPriceAllowanceType,
    ZBasicPriceAllowanceTypeXml
} from '../../../TradeAllowanceChargeType/BasicPriceAllowanceType'

export const ZBasicPriceProductTradePriceType = z.object({
    basisPricePerItem: ZAmountType.describe('BT-148'),
    priceBaseQuantity: ZQuantityType.optional().describe('BT-149-1'),
    priceAllowancesAndCharges: ZBasicPriceAllowanceType.optional().describe('BT-147-00')
})

export type BasicPriceProductTradePriceType = z.infer<typeof ZBasicPriceProductTradePriceType>

export const ZBasicPriceProductTradePriceTypeXml = z.object({
    'ram:ChargeAmount': ZAmountTypeXml, // BT-148
    'ram:BasisQuantity': ZQuantityTypeXml.optional(), // BT-149-1
    'ram:AppliedTradeAllowanceCharge': ZBasicPriceAllowanceTypeXml.optional()
})

export type BasicPriceProductTradePriceTypeXml = z.infer<typeof ZBasicPriceProductTradePriceTypeXml>
