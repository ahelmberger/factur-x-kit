import { z } from 'zod';

import { ZAmountType, ZAmountTypeXml } from '../../../../udt/AmountTypeConverter';
import { ZQuantityType, ZQuantityTypeXml } from '../../../../udt/QuantityTypeConverter';

export const ZBasicNetPriceProductTradePriceType = z.object({
    netPricePerItem: ZAmountType.describe('BT-146'), // BT-146
    priceBaseQuantity: ZQuantityType.optional().describe('BT-149') // BT-149
});

export type BasicNetPriceProductTradePriceType = z.infer<typeof ZBasicNetPriceProductTradePriceType>;

export const ZBasicNetPriceProductTradePriceTypeXml = z.object({
    'ram:ChargeAmount': ZAmountTypeXml, // BT-146
    'ram:BasisQuantity': ZQuantityTypeXml.optional() // BT-149-1
});

export type BasicNetPriceProductTradePriceTypeXml = z.infer<typeof ZBasicNetPriceProductTradePriceTypeXml>;
