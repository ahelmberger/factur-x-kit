import { z } from 'zod'

import { ExtendableBaseTypeConverter } from '../../../../ExtendableBaseTypeConverter'
import { AmountTypeConverter } from '../../../../udt/AmountTypeConverter'
import { QuantityTypeConverter } from '../../../../udt/QuantityTypeConverter'
import {
    TradeAllowanceChargeTypeConverter,
    allowedValueTypes_TradeAllowanceChargeType,
    allowedXmlTypes_TradeAllowanceChargeType
} from '../../../TradeAllowanceChargeType/TradeAllowanceChargeTypeConverter'
import {
    BasicPriceProductTradePriceType,
    BasicPriceProductTradePriceTypeXml,
    ZBasicPriceProductTradePriceType,
    ZBasicPriceProductTradePriceTypeXml
} from './BasicGrossPriceProductTradePriceType'

export type allowedValueTypes_GrossPriceProductTradePrice = BasicPriceProductTradePriceType
export type allowedXmlTypes_GrossPriceProductTradePrice = BasicPriceProductTradePriceTypeXml

export class GrossPriceProductTradePriceConverter<
    ValueType extends allowedValueTypes_GrossPriceProductTradePrice,
    XmlType extends allowedXmlTypes_GrossPriceProductTradePrice
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    amountTypeConverter = new AmountTypeConverter()
    quantityTypeConverter = new QuantityTypeConverter()
    priceAllowanceAndChargeTypeConverter: TradeAllowanceChargeTypeConverter<
        allowedValueTypes_TradeAllowanceChargeType,
        allowedXmlTypes_TradeAllowanceChargeType
    >

    constructor(
        grossPriceProductTradePriceType: z.ZodType<ValueType>,
        grossPriceProductTradePriceTypeXml: z.ZodType<XmlType>,
        priceAllowanceAndChargeTypeConverter: TradeAllowanceChargeTypeConverter<
            allowedValueTypes_TradeAllowanceChargeType,
            allowedXmlTypes_TradeAllowanceChargeType
        >
    ) {
        super(grossPriceProductTradePriceType, grossPriceProductTradePriceTypeXml)
        this.priceAllowanceAndChargeTypeConverter = priceAllowanceAndChargeTypeConverter
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any): any {
        const val = {
            basisPricePerItem: this.amountTypeConverter.toValue(xml['ram:ChargeAmount']),
            priceBaseQuantity:
                xml['ram:BasisQuantity'] != null
                    ? this.quantityTypeConverter.toValue(xml['ram:BasisQuantity'])
                    : undefined,
            priceAllowancesAndCharges:
                xml['ram:AppliedTradeAllowanceCharge'] != null
                    ? this.priceAllowanceAndChargeTypeConverter.toValue(xml['ram:AppliedTradeAllowanceCharge'])
                    : undefined
        }

        return val
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any): any {
        return {
            'ram:ChargeAmount': value.basisPricePerItem
                ? this.amountTypeConverter.toXML(value.basisPricePerItem)
                : undefined,
            'ram:BasisQuantity':
                value.priceBaseQuantity != null ? this.quantityTypeConverter.toXML(value.priceBaseQuantity) : undefined,
            'ram:AppliedTradeAllowanceCharge':
                value.priceAllowancesAndCharges != null
                    ? this.priceAllowanceAndChargeTypeConverter.toXML(value.priceAllowancesAndCharges)
                    : undefined
        }
    }

    public static basic(): GrossPriceProductTradePriceConverter<
        BasicPriceProductTradePriceType,
        BasicPriceProductTradePriceTypeXml
    > {
        return new GrossPriceProductTradePriceConverter(
            ZBasicPriceProductTradePriceType,
            ZBasicPriceProductTradePriceTypeXml,
            TradeAllowanceChargeTypeConverter.basicPriceAllowanceLevel()
        )
    }
}
