import { z } from 'zod'

import { ZAmountType, ZAmountTypeXml } from '../../../../udt/AmountTypeConverter'
import { ZQuantityType, ZQuantityTypeXml } from '../../../../udt/QuantityTypeConverter'
import {
    ZBasicPriceAllowanceType,
    ZBasicPriceAllowanceTypeXml
} from '../../../TradeAllowanceChargeType/BasicPriceAllowanceType'

export const ZBasicGrossPriceProductTradePriceType = z.object({
    grossPricePerItem: ZAmountType, // BT-148
    priceBaseQuantity: ZQuantityType.optional(), // BT-149-1
    priceAllowancesAndCharges: ZBasicPriceAllowanceType.optional()
})

export type BasicGrossPriceProductTradePriceType = z.infer<typeof ZBasicGrossPriceProductTradePriceType>

export const ZBasicGrossPriceProductTradePriceTypeXml = z.object({
    'ram:ChargeAmount': ZAmountTypeXml, // BT-148
    'ram:BasisQuantity': ZQuantityTypeXml.optional(), // BT-149-1
    'ram:AppliedTradeAllowanceCharge': ZBasicPriceAllowanceTypeXml.optional()
})

export type BasicGrossPriceProductTradePriceTypeXml = z.infer<typeof ZBasicGrossPriceProductTradePriceTypeXml>
