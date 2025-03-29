import { z } from 'zod'

import { ExtendableBaseTypeConverter } from '../../../ExtendableBaseTypeConverter'
import {
    BasicLineTradeAgreementType,
    BasicLineTradeAgreementTypeXml,
    ZBasicLineTradeAgreementType,
    ZBasicLineTradeAgreementTypeXml
} from './BasicLineTradeAgreementType'
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

export type allowedValueTypes_LineTradeAgreement = BasicLineTradeAgreementType
export type allowedXmlTypes_LineTradeAgreement = BasicLineTradeAgreementTypeXml

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
    mapXmlToValue(xml: any): any {
        return {
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
    mapValueToXml(value: BasicLineTradeAgreementType): any {
        return {
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
}
