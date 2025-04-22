import { z } from 'zod'

import {
    ZBasicAssociatedDocumentLineDocumentType,
    ZBasicAssociatedDocumentLineDocumentTypeXml
} from './AssociatedDocumentLineDocument/BasicAssociatedDocumentLineDocumentType'
import {
    ZComfortLineTradeAgreementType,
    ZComfortLineTradeAgreementTypeXml
} from './SpecifiedLineTradeAgreement/ComfortLineTradeAgreementType'
import {
    ZBasicLineTradeDeliveryType,
    ZBasicLineTradeDeliveryTypeXml
} from './SpecifiedLineTradeDelivery/BasicLineTradeDeliveryType'
import {
    ZComfortLineTradeSettlementType,
    ZComfortLineTradeSettlementTypeXml
} from './SpecifiedLineTradeSettlement/ComfortLineTradeSettlementType'
import { ZComfortTradeProductType, ZComfortTradeProductTypeXml } from './SpecifiedTradeProduct/ComfortTradeProduct'

export const ZComfortTradeLineItem = z.object({
    generalLineData: ZBasicAssociatedDocumentLineDocumentType,
    productDescription: ZComfortTradeProductType,
    productPriceAgreement: ZComfortLineTradeAgreementType,
    delivery: ZBasicLineTradeDeliveryType,
    settlement: ZComfortLineTradeSettlementType
})

export type ComfortTradeLineItem = z.infer<typeof ZComfortTradeLineItem>

export const ZComfortTradeLineItemXml = z.object({
    'ram:AssociatedDocumentLineDocument': ZBasicAssociatedDocumentLineDocumentTypeXml,
    'ram:SpecifiedTradeProduct': ZComfortTradeProductTypeXml,
    'ram:SpecifiedLineTradeAgreement': ZComfortLineTradeAgreementTypeXml,
    'ram:SpecifiedLineTradeDelivery': ZBasicLineTradeDeliveryTypeXml,
    'ram:SpecifiedLineTradeSettlement': ZComfortLineTradeSettlementTypeXml
})

export type ComfortTradeLineItemXml = z.infer<typeof ZComfortTradeLineItemXml>
