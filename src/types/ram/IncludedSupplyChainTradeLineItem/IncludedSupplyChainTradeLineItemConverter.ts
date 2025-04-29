import { z } from 'zod'

import { ExtendableBaseTypeConverter } from '../../ExtendableBaseTypeConverter'
import {
    AssociatedDocumentLineDocumentConverter,
    allowedValueTypes_AssociatedDocumentLineDocumentConverter,
    allowedXmlTypes_AssociatedDocumentLineDocumentConverter
} from './AssociatedDocumentLineDocument/AssociatedDocumentLineDocumentConverter'
import {
    BasicTradeLineItem,
    BasicTradeLineItemXml,
    ZBasicTradeLineItem,
    ZBasicTradeLineItemXml
} from './BasicTradeLineItem'
import {
    ComfortTradeLineItem,
    ComfortTradeLineItemXml,
    ZComfortTradeLineItem,
    ZComfortTradeLineItemXml
} from './ComfortTradeLineItem'
import {
    LineTradeAgreementConverter,
    allowedValueTypes_LineTradeAgreement,
    allowedXmlTypes_LineTradeAgreement
} from './SpecifiedLineTradeAgreement/SpecifiedLineTradeAgreementConverter'
import {
    LineTradeDeliveryConverter,
    allowedValueTypes_LineTradeDelivery,
    allowedXmlTypes_LineTradeDelivery
} from './SpecifiedLineTradeDelivery/SpecifiedLineTradeDeliveryConverter'
import {
    LineTradeSettlementConverter,
    allowedValueTypes_LineTradeSettlement,
    allowedXmlTypes_LineTradeSettlement
} from './SpecifiedLineTradeSettlement/SpecifiedLineTradeSettlementConverter'
import {
    TradeProductTypeConverter,
    allowedValueTypes_TradeProduct,
    allowedXmlTypes_TradeProduct
} from './SpecifiedTradeProduct/SpecifiedTradeProductConverter'

export type allowedValueTypes_TradeLineItemConverter = BasicTradeLineItem | ComfortTradeLineItem
export type allowedXmlTypes_TradeLineItemConverter = BasicTradeLineItemXml | ComfortTradeLineItemXml

export class TradeLineItemConverter<
    ValueType extends allowedValueTypes_TradeLineItemConverter,
    XmlType extends allowedXmlTypes_TradeLineItemConverter
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    generalLineDataConverter: AssociatedDocumentLineDocumentConverter<
        allowedValueTypes_AssociatedDocumentLineDocumentConverter,
        allowedXmlTypes_AssociatedDocumentLineDocumentConverter
    >
    productDescriptionConverter: TradeProductTypeConverter<allowedValueTypes_TradeProduct, allowedXmlTypes_TradeProduct>
    productPriceAgreementConverter: LineTradeAgreementConverter<
        allowedValueTypes_LineTradeAgreement,
        allowedXmlTypes_LineTradeAgreement
    >
    deliveryConverter: LineTradeDeliveryConverter<
        allowedValueTypes_LineTradeDelivery,
        allowedXmlTypes_LineTradeDelivery
    >
    settlementConverter: LineTradeSettlementConverter<
        allowedValueTypes_LineTradeSettlement,
        allowedXmlTypes_LineTradeSettlement
    >

    constructor(
        tradeLineItemType: z.ZodType<ValueType>,
        tradeLineItemTypeXml: z.ZodType<XmlType>,
        generalLineDataConverter: AssociatedDocumentLineDocumentConverter<
            allowedValueTypes_AssociatedDocumentLineDocumentConverter,
            allowedXmlTypes_AssociatedDocumentLineDocumentConverter
        >,
        productDescriptionConverter: TradeProductTypeConverter<
            allowedValueTypes_TradeProduct,
            allowedXmlTypes_TradeProduct
        >,
        productPriceAgreementConverter: LineTradeAgreementConverter<
            allowedValueTypes_LineTradeAgreement,
            allowedXmlTypes_LineTradeAgreement
        >,
        deliveryConverter: LineTradeDeliveryConverter<
            allowedValueTypes_LineTradeDelivery,
            allowedXmlTypes_LineTradeDelivery
        >,
        settlementConverter: LineTradeSettlementConverter<
            allowedValueTypes_LineTradeSettlement,
            allowedXmlTypes_LineTradeSettlement
        >
    ) {
        super(tradeLineItemType, tradeLineItemTypeXml)
        this.generalLineDataConverter = generalLineDataConverter
        this.productDescriptionConverter = productDescriptionConverter
        this.productPriceAgreementConverter = productPriceAgreementConverter
        this.deliveryConverter = deliveryConverter
        this.settlementConverter = settlementConverter
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            generalLineData: this.generalLineDataConverter.toValue(xml['ram:AssociatedDocumentLineDocument']),
            productDescription: this.productDescriptionConverter.toValue(xml['ram:SpecifiedTradeProduct']),
            productPriceAgreement: this.productPriceAgreementConverter.toValue(xml['ram:SpecifiedLineTradeAgreement']),
            delivery: this.deliveryConverter.toValue(xml['ram:SpecifiedLineTradeDelivery']),
            settlement: this.settlementConverter.toValue(xml['ram:SpecifiedLineTradeSettlement'])
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:AssociatedDocumentLineDocument': this.generalLineDataConverter.toXML(value.generalLineData),
            'ram:SpecifiedTradeProduct': this.productDescriptionConverter.toXML(value.productDescription),
            'ram:SpecifiedLineTradeAgreement': this.productPriceAgreementConverter.toXML(value.productPriceAgreement),
            'ram:SpecifiedLineTradeDelivery': this.deliveryConverter.toXML(value.delivery),
            'ram:SpecifiedLineTradeSettlement': this.settlementConverter.toXML(value.settlement)
        }
    }

    public static basic() {
        return new TradeLineItemConverter<BasicTradeLineItem, BasicTradeLineItemXml>(
            ZBasicTradeLineItem,
            ZBasicTradeLineItemXml,
            AssociatedDocumentLineDocumentConverter.basic(),
            TradeProductTypeConverter.basic(),
            LineTradeAgreementConverter.basic(),
            LineTradeDeliveryConverter.basic(),
            LineTradeSettlementConverter.basic()
        )
    }

    public static comfort() {
        return new TradeLineItemConverter<ComfortTradeLineItem, ComfortTradeLineItemXml>(
            ZComfortTradeLineItem,
            ZComfortTradeLineItemXml,
            AssociatedDocumentLineDocumentConverter.basic(),
            TradeProductTypeConverter.comfort(),
            LineTradeAgreementConverter.comfort(),
            LineTradeDeliveryConverter.basic(),
            LineTradeSettlementConverter.basic()
        )
    }
}
