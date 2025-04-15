import { ExtendableBaseTypeConverter } from '../../../../ExtendableBaseTypeConverter'
import { TextTypeConverter } from '../../../../udt/TextTypeConverter'
import {
    ComfortDesignatedProductClassificationType,
    ComfortDesignatedProductClassificationTypeXml,
    ZComfortDesignatedProductClassificationType,
    ZComfortDesignatedProductClassificationTypeXml
} from './ComfortDesignatedProductClassificationType'

export type allowedValueTypes_ApplicableProductCharacteristic = ComfortDesignatedProductClassificationType
export type allowedXmlTypes_ApplicableProductCharacteristic = ComfortDesignatedProductClassificationTypeXml

export class ApplicableProductCharacteristicTypeConverter<
    ValueType extends allowedValueTypes_ApplicableProductCharacteristic,
    XmlType extends allowedXmlTypes_ApplicableProductCharacteristic
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    textTypeConverter = new TextTypeConverter()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            characteristic: xml['ram:Description'] ? this.textTypeConverter.toValue(xml['ram:Description']) : undefined,
            value: xml['ram:Value'] != null ? this.textTypeConverter.toValue(xml['ram:Value']) : undefined
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:Description': value.characteristic ? this.textTypeConverter.toXML(value.characteristic) : undefined,
            'ram:Value': value.value != null ? this.textTypeConverter.toXML(value.value) : undefined
        }
    }

    public static comfort(): ApplicableProductCharacteristicTypeConverter<
        ComfortDesignatedProductClassificationType,
        ComfortDesignatedProductClassificationTypeXml
    > {
        return new ApplicableProductCharacteristicTypeConverter(
            ZComfortDesignatedProductClassificationType,
            ZComfortDesignatedProductClassificationTypeXml
        )
    }
}
