import { ExtendableBaseTypeConverter } from '../../../ExtendableBaseTypeConverter';
import { QuantityWithRequiredUnitTypeConverter } from '../../../udt/QuantityWithRequiredUnitTypeConverter';
import {
    BasicLineTradeDeliveryType,
    BasicLineTradeDeliveryTypeXml,
    ZBasicLineTradeDeliveryType,
    ZBasicLineTradeDeliveryTypeXml
} from './BasicLineTradeDeliveryType';

export type allowedValueTypes_LineTradeDelivery = BasicLineTradeDeliveryType;
export type allowedXmlTypes_LineTradeDelivery = BasicLineTradeDeliveryTypeXml;

export class LineTradeDeliveryConverter<
    ValueType extends allowedValueTypes_LineTradeDelivery,
    XmlType extends allowedXmlTypes_LineTradeDelivery
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    quantityWithRequiredTypeConverter = new QuantityWithRequiredUnitTypeConverter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any): any {
        return {
            itemQuantity:
                xml['ram:BilledQuantity'] != null
                    ? this.quantityWithRequiredTypeConverter.toValue(xml['ram:BilledQuantity'])
                    : undefined
        };
    }

    mapValueToXml(value: BasicLineTradeDeliveryType) {
        return {
            'ram:BilledQuantity':
                value.itemQuantity != null
                    ? this.quantityWithRequiredTypeConverter.toXML(value.itemQuantity)
                    : undefined
        };
    }

    public static basic() {
        return new LineTradeDeliveryConverter<BasicLineTradeDeliveryType, BasicLineTradeDeliveryTypeXml>(
            ZBasicLineTradeDeliveryType,
            ZBasicLineTradeDeliveryTypeXml
        );
    }
}
