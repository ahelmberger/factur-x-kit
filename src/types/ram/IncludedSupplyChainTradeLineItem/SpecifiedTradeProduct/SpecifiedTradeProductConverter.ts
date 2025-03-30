import { ExtendableBaseTypeConverter } from '../../../ExtendableBaseTypeConverter'
import { ISO6523_CODES } from '../../../codes'
import { IdTypeWithRequiredSchemeConverter } from '../../../udt/IdTypeWithRequiredlSchemeConverter'
import { TextTypeConverter } from '../../../udt/TextTypeConverter'
import {
    BasicTradeProductType,
    BasicTradeProductTypeXml,
    ZBasicTradeProductType,
    ZBasicTradeProductTypeXml
} from './BasicTradeProduct'

export type allowedValueTypes_TradeProduct = BasicTradeProductType
export type allowedXmlTypes_TradeProduct = BasicTradeProductTypeXml

export class TradeProductTypeConverter<
    ValueType extends allowedValueTypes_TradeProduct,
    XmlType extends allowedXmlTypes_TradeProduct
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    globalIdConverter = new IdTypeWithRequiredSchemeConverter(ISO6523_CODES)
    textTypeConverter = new TextTypeConverter()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            globalId: xml['ram:GlobalID'] ? this.globalIdConverter.toValue(xml['ram:GlobalID']) : undefined,
            name: xml['ram:Name'] != null ? this.textTypeConverter.toValue(xml['ram:Name']) : undefined
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:GlobalID': value.globalId ? this.globalIdConverter.toXML(value.globalId) : undefined,
            'ram:Name': value.name != null ? this.textTypeConverter.toXML(value.name) : undefined
        }
    }

    public static basic(): TradeProductTypeConverter<BasicTradeProductType, BasicTradeProductTypeXml> {
        return new TradeProductTypeConverter(ZBasicTradeProductType, ZBasicTradeProductTypeXml)
    }
}
