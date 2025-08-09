import { ExtendableBaseTypeConverter } from '../../../../ExtendableBaseTypeConverter';
import { TextTypeConverter } from '../../../../udt/TextTypeConverter';
import {
    ComfortApplicableProductCharacteristicType,
    ComfortApplicableProductCharacteristicTypeXml,
    ZComfortApplicableProductCharacteristicType,
    ZComfortApplicableProductCharacteristicTypeXml
} from './ComfortApplicableProductCharacteristicType';

export type allowedValueTypes_ApplicableProductCharacteristic = ComfortApplicableProductCharacteristicType;
export type allowedXmlTypes_ApplicableProductCharacteristic = ComfortApplicableProductCharacteristicTypeXml;

export class ApplicableProductCharacteristicTypeConverter<
    ValueType extends allowedValueTypes_ApplicableProductCharacteristic,
    XmlType extends allowedXmlTypes_ApplicableProductCharacteristic
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    textTypeConverter = new TextTypeConverter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            characteristic: xml['ram:Description'] ? this.textTypeConverter.toValue(xml['ram:Description']) : undefined,
            value: xml['ram:Value'] != null ? this.textTypeConverter.toValue(xml['ram:Value']) : undefined
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:Description': value.characteristic ? this.textTypeConverter.toXML(value.characteristic) : undefined,
            'ram:Value': value.value != null ? this.textTypeConverter.toXML(value.value) : undefined
        };
    }

    public static comfort(): ApplicableProductCharacteristicTypeConverter<
        ComfortApplicableProductCharacteristicType,
        ComfortApplicableProductCharacteristicTypeXml
    > {
        return new ApplicableProductCharacteristicTypeConverter(
            ZComfortApplicableProductCharacteristicType,
            ZComfortApplicableProductCharacteristicTypeXml
        );
    }
}
