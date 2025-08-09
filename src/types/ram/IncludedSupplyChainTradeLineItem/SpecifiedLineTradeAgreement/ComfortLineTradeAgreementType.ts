import { z } from 'zod';

import {
    ZReferencedDocumentTypeXml_lineId,
    ZReferencedDocumentType_lineId
} from '../../ReferencedDocumentType/ReferencedDocumentTypes';
import {
    ZBasicPriceProductTradePriceType,
    ZBasicPriceProductTradePriceTypeXml
} from './GrossPriceProductTradePrice/BasicGrossPriceProductTradePriceType';
import {
    ZBasicNetPriceProductTradePriceType,
    ZBasicNetPriceProductTradePriceTypeXml
} from './NetPriceProductTradePrice/BasicNetPriceProductTradePriceType';

export const ZComfortLineTradeAgreementType = z.object({
    referencedOrder: ZReferencedDocumentType_lineId.optional().describe('BT-132-00'),
    productPricing: ZBasicPriceProductTradePriceType.optional().describe('BT-148-00'),
    productNetPricing: ZBasicNetPriceProductTradePriceType.describe('BT-146-00')
});

export type ComfortLineTradeAgreementType = z.infer<typeof ZComfortLineTradeAgreementType>;

export const ZComfortLineTradeAgreementTypeXml = z.object({
    'ram:BuyerOrderReferencedDocument': ZReferencedDocumentTypeXml_lineId.optional(),
    'ram:GrossPriceProductTradePrice': ZBasicPriceProductTradePriceTypeXml.optional(), // BG-29-0
    'ram:NetPriceProductTradePrice': ZBasicNetPriceProductTradePriceTypeXml // BT-146-00
});

export type ComfortLineTradeAgreementTypeXml = z.infer<typeof ZComfortLineTradeAgreementTypeXml>;
