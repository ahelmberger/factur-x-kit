import { z } from 'zod';

import {
    ZBasicPriceProductTradePriceType,
    ZBasicPriceProductTradePriceTypeXml
} from './GrossPriceProductTradePrice/BasicGrossPriceProductTradePriceType';
import {
    ZBasicNetPriceProductTradePriceType,
    ZBasicNetPriceProductTradePriceTypeXml
} from './NetPriceProductTradePrice/BasicNetPriceProductTradePriceType';

export const ZBasicLineTradeAgreementType = z.object({
    productPricing: ZBasicPriceProductTradePriceType.optional(),
    productNetPricing: ZBasicNetPriceProductTradePriceType
});

export type BasicLineTradeAgreementType = z.infer<typeof ZBasicLineTradeAgreementType>;

export const ZBasicLineTradeAgreementTypeXml = z.object({
    'ram:GrossPriceProductTradePrice': ZBasicPriceProductTradePriceTypeXml.optional(), // BG-29-0
    'ram:NetPriceProductTradePrice': ZBasicNetPriceProductTradePriceTypeXml // BT-146-00
});

export type BasicLineTradeAgreementTypeXml = z.infer<typeof ZBasicLineTradeAgreementTypeXml>;
