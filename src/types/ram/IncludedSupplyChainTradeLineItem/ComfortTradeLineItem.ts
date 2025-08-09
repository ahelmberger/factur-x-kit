import { z } from 'zod';

import {
    ZBasicAssociatedDocumentLineDocumentType,
    ZBasicAssociatedDocumentLineDocumentTypeXml
} from './AssociatedDocumentLineDocument/BasicAssociatedDocumentLineDocumentType';
import {
    ZComfortLineTradeAgreementType,
    ZComfortLineTradeAgreementTypeXml
} from './SpecifiedLineTradeAgreement/ComfortLineTradeAgreementType';
import {
    ZBasicLineTradeDeliveryType,
    ZBasicLineTradeDeliveryTypeXml
} from './SpecifiedLineTradeDelivery/BasicLineTradeDeliveryType';
import {
    ZComfortLineTradeSettlementType,
    ZComfortLineTradeSettlementTypeXml
} from './SpecifiedLineTradeSettlement/ComfortLineTradeSettlementType';
import { ZComfortTradeProductType, ZComfortTradeProductTypeXml } from './SpecifiedTradeProduct/ComfortTradeProduct';

export const ZComfortTradeLineItem = z.object({
    generalLineData: ZBasicAssociatedDocumentLineDocumentType.describe('BT-126-00'),
    productDescription: ZComfortTradeProductType.describe('BG-31'),
    productPriceAgreement: ZComfortLineTradeAgreementType.describe('BG-29'),
    delivery: ZBasicLineTradeDeliveryType.describe('BT-129-00'),
    settlement: ZComfortLineTradeSettlementType.describe('BG-30-00')
});

export type ComfortTradeLineItem = z.infer<typeof ZComfortTradeLineItem>;

export const ZComfortTradeLineItemXml = z.object({
    'ram:AssociatedDocumentLineDocument': ZBasicAssociatedDocumentLineDocumentTypeXml,
    'ram:SpecifiedTradeProduct': ZComfortTradeProductTypeXml,
    'ram:SpecifiedLineTradeAgreement': ZComfortLineTradeAgreementTypeXml,
    'ram:SpecifiedLineTradeDelivery': ZBasicLineTradeDeliveryTypeXml,
    'ram:SpecifiedLineTradeSettlement': ZComfortLineTradeSettlementTypeXml
});

export type ComfortTradeLineItemXml = z.infer<typeof ZComfortTradeLineItemXml>;
