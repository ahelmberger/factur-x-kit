import { z } from 'zod'

import { ExtendableBaseTypeConverter } from '../../../../ExtendableBaseTypeConverter'
import { AmountTypeConverter } from '../../../../udt/AmountTypeConverter'
import { QuantityTypeConverter } from '../../../../udt/QuantityTypeConverter'
import {
    BasicNetPriceProductTradePriceType,
    BasicNetPriceProductTradePriceTypeXml,
    ZBasicNetPriceProductTradePriceType,
    ZBasicNetPriceProductTradePriceTypeXml
} from './BasicNetPriceProductTradePriceType'

export type allowedValueTypes_NetPriceProductTradePrice = BasicNetPriceProductTradePriceType
export type allowedXmlTypes_NetPriceProductTradePrice = BasicNetPriceProductTradePriceTypeXml

export class NetPriceProductTradePriceConverter<
    ValueType extends allowedValueTypes_NetPriceProductTradePrice,
    XmlType extends allowedXmlTypes_NetPriceProductTradePrice
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    amountTypeConverter = new AmountTypeConverter()
    quantityTypeConverter = new QuantityTypeConverter()

    constructor(
        netPriceProductTradePriceType: z.ZodType<ValueType>,
        netPriceProductTradePriceTypeXml: z.ZodType<XmlType>
    ) {
        super(netPriceProductTradePriceType, netPriceProductTradePriceTypeXml)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any): any {
        return {
            netPricePerItem: this.amountTypeConverter.toValue(xml['ram:ChargeAmount']),
            priceBaseQuantity:
                xml['ram:BasisQuantity'] != null
                    ? this.quantityTypeConverter.toValue(xml['ram:BasisQuantity'])
                    : undefined
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any): any {
        return {
            'ram:ChargeAmount': value.netPricePerItem
                ? this.amountTypeConverter.toXML(value.netPricePerItem)
                : undefined,
            'ram:BasisQuantity':
                value.priceBaseQuantity != null ? this.quantityTypeConverter.toXML(value.priceBaseQuantity) : undefined
        }
    }

    public static basic(): NetPriceProductTradePriceConverter<
        BasicNetPriceProductTradePriceType,
        BasicNetPriceProductTradePriceTypeXml
    > {
        return new NetPriceProductTradePriceConverter(
            ZBasicNetPriceProductTradePriceType,
            ZBasicNetPriceProductTradePriceTypeXml
        )
    }
}
