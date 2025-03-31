import { z } from 'zod'

import {
    ZBasicAssociatedDocumentLineDocumentType,
    ZBasicAssociatedDocumentLineDocumentTypeXml
} from './AssociatedDocumentLineDocument/BasicAssociatedDocumentLineDocumentType'
import {
    ZBasicLineTradeAgreementType,
    ZBasicLineTradeAgreementTypeXml
} from './SpecifiedLineTradeAgreement/BasicLineTradeAgreementType'
import {
    ZBasicLineTradeDeliveryType,
    ZBasicLineTradeDeliveryTypeXml
} from './SpecifiedLineTradeDelivery/BasicLineTradeDeliveryType'
import {
    ZBasicLineTradeSettlementType,
    ZBasicLineTradeSettlementTypeXml
} from './SpecifiedLineTradeSettlement/BasicLineTradeSettlementType'
import { ZBasicTradeProductType, ZBasicTradeProductTypeXml } from './SpecifiedTradeProduct/BasicTradeProduct'

export const ZBasicTradeLineItem = z.object({
    generalLineData: ZBasicAssociatedDocumentLineDocumentType,
    productDescription: ZBasicTradeProductType,
    productPriceAgreement: ZBasicLineTradeAgreementType,
    delivery: ZBasicLineTradeDeliveryType,
    settlement: ZBasicLineTradeSettlementType
})

export type BasicTradeLineItem = z.infer<typeof ZBasicTradeLineItem>

export const ZBasicTradeLineItemXml = z.object({
    'ram:AssociatedDocumentLineDocument': ZBasicAssociatedDocumentLineDocumentTypeXml,
    'ram:SpecifiedTradeProduct': ZBasicTradeProductTypeXml,
    'ram:SpecifiedLineTradeAgreement': ZBasicLineTradeAgreementTypeXml,
    'ram:SpecifiedLineTradeDelivery': ZBasicLineTradeDeliveryTypeXml,
    'ram:SpecifiedLineTradeSettlement': ZBasicLineTradeSettlementTypeXml
})

export type BasicTradeLineItemXml = z.infer<typeof ZBasicTradeLineItemXml>
