import { z } from 'zod'

import { BaseTypeConverter, TypeConverterError } from '../../BaseTypeConverter'
import {
    BasicTradeProductType,
    BasicTradeProductTypeXml,
    ZBasicTradeProductType,
    ZBasicTradeProductTypeXml
} from './BasicTradeLineItem'

type allowedValueTypes = BasicTradeProductType
type allowedXmlTypes = BasicTradeProductTypeXml

export class TradeProductTypeConverter<
    ValueType extends allowedValueTypes,
    XmlType extends allowedXmlTypes
> extends BaseTypeConverter<ValueType, XmlType> {
    private valueSchema: z.ZodType<ValueType>
    private xmlSchema: z.ZodType<XmlType>

    constructor(valueSchema: z.ZodType<ValueType>, xmlSchema: z.ZodType<XmlType>) {
        super()
        this.valueSchema = valueSchema
        this.xmlSchema = xmlSchema
    }

    _toValue(xml: XmlType): ValueType {
        const { success } = this.xmlSchema.safeParse(xml)
        if (!success) {
            throw new TypeConverterError('INVALID_XML')
        }

        const value = this.mapXmlToValue(xml)

        const { success: successValue, data } = this.valueSchema.safeParse(value)

        if (!successValue) {
            throw new TypeConverterError('INVALID_XML')
        }

        return data as ValueType
    }

    mapXmlToValue(xml: any) {
        return
    }

    _toXML(value: ValueType): XmlType {
        const { success, data } = this.valueSchema.safeParse(value)
        if (!success) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        const xml = this.mapValueToXml(data)

        const { success: xmlSuccess, data: xmlData } = this.xmlSchema.safeParse(xml)
        if (!xmlSuccess) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        return xmlData as XmlType
    }

    mapValueToXml(value: any) {
        return
    }

    public static basic(): TradeProductTypeConverter<BasicTradeProductType, BasicTradeProductTypeXml> {
        return new TradeProductTypeConverter(ZBasicTradeProductType, ZBasicTradeProductTypeXml)
    }
}
