import { z } from 'zod'

import { ZIdType, ZIdTypeXml } from '../../../udt/IdTypeConverter'
import {
    ZBasicGrossPriceProductTradePriceType,
    ZBasicGrossPriceProductTradePriceTypeXml
} from './GrossPriceProductTradePrice/BasicGrossPriceProductTradePriceType'
import {
    ZBasicNetPriceProductTradePriceType,
    ZBasicNetPriceProductTradePriceTypeXml
} from './NetPriceProductTradePrice/BasicNetPriceProductTradePriceType'

export const ZComfortLineTradeAgreementType = z.object({
    referencedOrderLineId: ZIdType.optional(), // BT-123-0
    productGrossPricing: ZBasicGrossPriceProductTradePriceType.optional(),
    productNetPricing: ZBasicNetPriceProductTradePriceType
})

export type ComfortLineTradeAgreementType = z.infer<typeof ZComfortLineTradeAgreementType>

export const ZComfortLineTradeAgreementTypeXml = z.object({
    'ram:BuyerOrderReferencedDocument': z
        .object({
            'ram:LineID': ZIdTypeXml.optional() // BT-123-0
        })
        .optional(),
    'ram:GrossPriceProductTradePrice': ZBasicGrossPriceProductTradePriceTypeXml.optional(), // BG-29-0
    'ram:NetPriceProductTradePrice': ZBasicNetPriceProductTradePriceTypeXml // BT-146-00
})

export type ComfortLineTradeAgreementTypeXml = z.infer<typeof ZComfortLineTradeAgreementTypeXml>
