import { z } from 'zod'

import {
    ZBasicAssociatedDocumentLineDocumentType,
    ZBasicAssociatedDocumentLineDocumentTypeXml
} from './AssociatedDocumentLineDocument/BasicAssociatedDocumentLineDocumentType'
import { ZBasicLineTradeAgreementTypeXml } from './SpecifiedLineTradeAgreement/BasicLineTradeAgreementType'
import { ZBasicLineTradeDeliveryType } from './SpecifiedLineTradeDelivery/BasicLineTradeDeliveryType'
import { ZBasicLineTradeSettlementTypeXml } from './SpecifiedLineTradeSettlement/BasicLineTradeSettlementType'
import { ZBasicTradeProductTypeXml } from './SpecifiedTradeProduct/BasicTradeProduct'

export const ZBasicTradeLineItem = z.object({
    generalLineData: ZBasicAssociatedDocumentLineDocumentType,
    productDescription: ZBasicTradeProductTypeXml,
    productPriceAgreement: ZBasicLineTradeAgreementTypeXml,
    delivery: ZBasicLineTradeDeliveryType,
    settlement: ZBasicLineTradeSettlementTypeXml
})

export type BasicTradeLineItem = z.infer<typeof ZBasicTradeLineItem>

export const ZBasicTradeLineItemXml = z.object({
    'ram:AssociatedDocumentLineDocument': ZBasicAssociatedDocumentLineDocumentTypeXml,
    'ram:SpecifiedTradeProduct': ZBasicTradeProductTypeXml,
    'ram:SpecifiedLineTradeAgreement': ZBasicLineTradeAgreementTypeXml,
    'ram:SpecifiedLineTradeDelivery': ZBasicLineTradeAgreementTypeXml,
    'ram:SpecifiedLineTradeSettlement': ZBasicLineTradeSettlementTypeXml
})

export type BasicTradeLineItemXml = z.infer<typeof ZBasicTradeLineItemXml>
