import { z } from 'zod'

import {
    ZQuantityWithRequiredUnitType,
    ZQuantityWithRequiredUnitTypeXml
} from '../../../udt/QuantityWithRequiredUnitTypeConverter'

export const ZBasicLineTradeDeliveryType = z.object({
    itemQuantity: ZQuantityWithRequiredUnitType.describe('BT-129')
})

export type BasicLineTradeDeliveryType = z.infer<typeof ZBasicLineTradeDeliveryType>

export const ZBasicLineTradeDeliveryTypeXml = z.object({
    'ram:BilledQuantity': ZQuantityWithRequiredUnitTypeXml
})

export type BasicLineTradeDeliveryTypeXml = z.infer<typeof ZBasicLineTradeDeliveryTypeXml>
