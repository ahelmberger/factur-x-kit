import { z } from 'zod'

import { ZBasicGrossPriceProductTradePriceTypeXml } from './GrossPriceProductTradePrice/BasicGrossPriceProductTradePriceType'
import { ZBasicNetPriceProductTradePriceTypeXml } from './NetPriceProductTradePrice/BasicNetPriceProductTradePriceType'

export const ZBasicSpecifiedLineTradeAgreementTypeXml = z.object({
    'ram:GrossPriceProductTradePrice': ZBasicGrossPriceProductTradePriceTypeXml.optional(), // BG-29-0
    'ram:NetPriceProductTradePrice': ZBasicNetPriceProductTradePriceTypeXml // BT-146-00
})
