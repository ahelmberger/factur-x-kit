import { z } from 'zod'

import { ExtendableBaseTypeConverter } from '../../../ExtendableBaseTypeConverter'
import { IdTypeConverter } from '../../../udt/IdTypeConverter'
import {
    BasicLineTradeAgreementType,
    BasicLineTradeAgreementTypeXml,
    ZBasicLineTradeAgreementType,
    ZBasicLineTradeAgreementTypeXml
} from './BasicLineTradeAgreementType'
import {
    ComfortLineTradeAgreementType,
    ComfortLineTradeAgreementTypeXml,
    ZComfortLineTradeAgreementType,
    ZComfortLineTradeAgreementTypeXml
} from './ComfortLineTradeAgreementType'
import {
    GrossPriceProductTradePriceConverter,
    allowedValueTypes_GrossPriceProductTradePrice,
    allowedXmlTypes_GrossPriceProductTradePrice
} from './GrossPriceProductTradePrice/GrossPriceProductTradePriceConverter'
import {
    NetPriceProductTradePriceConverter,
    allowedValueTypes_NetPriceProductTradePrice,
    allowedXmlTypes_NetPriceProductTradePrice
} from './NetPriceProductTradePrice/NetPriceProductTradePriceConverter'

export type allowedValueTypes_LineTradeAgreement = BasicLineTradeAgreementType | ComfortLineTradeAgreementType
export type allowedXmlTypes_LineTradeAgreement = BasicLineTradeAgreementTypeXml | ComfortLineTradeAgreementTypeXml

export class LineTradeAgreementConverter<
    ValueType extends allowedValueTypes_LineTradeAgreement,
    XmlType extends allowedXmlTypes_LineTradeAgreement
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    grossPriceProductTradePriceConverter: GrossPriceProductTradePriceConverter<
        allowedValueTypes_GrossPriceProductTradePrice,
        allowedXmlTypes_GrossPriceProductTradePrice
    >

    netPriceProductTradePriceConverter: NetPriceProductTradePriceConverter<
        allowedValueTypes_NetPriceProductTradePrice,
        allowedXmlTypes_NetPriceProductTradePrice
    >

    idTypeConverter = new IdTypeConverter()

    constructor(
        lineTradeAgreementType: z.ZodType<ValueType>,
        lineTradeAgreementTypeXml: z.ZodType<XmlType>,
        grossPriceProductTradePriceConverter: GrossPriceProductTradePriceConverter<
            allowedValueTypes_GrossPriceProductTradePrice,
            allowedXmlTypes_GrossPriceProductTradePrice
        >,
        netPriceProductTradePriceConverter: NetPriceProductTradePriceConverter<
            allowedValueTypes_NetPriceProductTradePrice,
            allowedXmlTypes_NetPriceProductTradePrice
        >
    ) {
        super(lineTradeAgreementType, lineTradeAgreementTypeXml)
        this.grossPriceProductTradePriceConverter = grossPriceProductTradePriceConverter
        this.netPriceProductTradePriceConverter = netPriceProductTradePriceConverter
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            referencedOrderLineId:
                xml['ram:BuyerOrderReferencedDocument'] != null &&
                xml['ram:BuyerOrderReferencedDocument']['ram:LineID'] != null
                    ? this.idTypeConverter.toValue(xml['ram:BuyerOrderReferencedDocument']['ram:LineID'])
                    : undefined,
            productGrossPricing:
                xml['ram:GrossPriceProductTradePrice'] != null
                    ? this.grossPriceProductTradePriceConverter.toValue(xml['ram:GrossPriceProductTradePrice'])
                    : undefined,
            productNetPricing:
                xml['ram:NetPriceProductTradePrice'] != null
                    ? this.netPriceProductTradePriceConverter.toValue(xml['ram:NetPriceProductTradePrice'])
                    : undefined
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any): any {
        return {
            'ram:BuyerOrderReferencedDocument':
                value.referencedOrderLineId != null
                    ? {
                          'ram:LineID': this.idTypeConverter.toXML(value.referencedOrderLineId)
                      }
                    : undefined,
            'ram:GrossPriceProductTradePrice': value.productGrossPricing
                ? this.grossPriceProductTradePriceConverter.toXML(value.productGrossPricing)
                : undefined,
            'ram:NetPriceProductTradePrice':
                value.productNetPricing != null
                    ? this.netPriceProductTradePriceConverter.toXML(value.productNetPricing)
                    : undefined
        }
    }

    public static basic(): LineTradeAgreementConverter<BasicLineTradeAgreementType, BasicLineTradeAgreementTypeXml> {
        return new LineTradeAgreementConverter(
            ZBasicLineTradeAgreementType,
            ZBasicLineTradeAgreementTypeXml,
            GrossPriceProductTradePriceConverter.basic(),
            NetPriceProductTradePriceConverter.basic()
        )
    }

    public static comfort(): LineTradeAgreementConverter<
        ComfortLineTradeAgreementType,
        ComfortLineTradeAgreementTypeXml
    > {
        return new LineTradeAgreementConverter(
            ZComfortLineTradeAgreementType,
            ZComfortLineTradeAgreementTypeXml,
            GrossPriceProductTradePriceConverter.basic(),
            NetPriceProductTradePriceConverter.basic()
        )
    }
}
