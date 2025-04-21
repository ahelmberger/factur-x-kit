import { z } from 'zod'

import { ZReferencedDocumentTypeXml_lineId, ZReferencedDocumentType_lineId } from '../../ReferencedDocumentConverter'
import {
    ZBasicGrossPriceProductTradePriceType,
    ZBasicGrossPriceProductTradePriceTypeXml
} from './GrossPriceProductTradePrice/BasicGrossPriceProductTradePriceType'
import {
    ZBasicNetPriceProductTradePriceType,
    ZBasicNetPriceProductTradePriceTypeXml
} from './NetPriceProductTradePrice/BasicNetPriceProductTradePriceType'

export const ZComfortLineTradeAgreementType = z.object({
    referencedOrder: ZReferencedDocumentType_lineId.optional(), // BT-123-0
    productGrossPricing: ZBasicGrossPriceProductTradePriceType.optional(),
    productNetPricing: ZBasicNetPriceProductTradePriceType
})

export type ComfortLineTradeAgreementType = z.infer<typeof ZComfortLineTradeAgreementType>

export const ZComfortLineTradeAgreementTypeXml = z.object({
    'ram:BuyerOrderReferencedDocument': ZReferencedDocumentTypeXml_lineId.optional(),
    'ram:GrossPriceProductTradePrice': ZBasicGrossPriceProductTradePriceTypeXml.optional(), // BG-29-0
    'ram:NetPriceProductTradePrice': ZBasicNetPriceProductTradePriceTypeXml // BT-146-00
})

export type ComfortLineTradeAgreementTypeXml = z.infer<typeof ZComfortLineTradeAgreementTypeXml>
