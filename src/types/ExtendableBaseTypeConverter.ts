import { z } from 'zod'

import { BaseTypeConverter, TypeConverterError } from './BaseTypeConverter'

export abstract class ExtendableBaseTypeConverter<ValueType, XmlType> extends BaseTypeConverter<ValueType, XmlType> {
    private valueSchema: z.ZodType<ValueType>
    private xmlSchema: z.ZodType<XmlType>

    constructor(valueSchema: z.ZodType<ValueType>, xmlSchema: z.ZodType<XmlType>) {
        super()
        this.valueSchema = valueSchema
        this.xmlSchema = xmlSchema
    }

    _toValue(xml: XmlType): ValueType {
        const { success, error: errorXml } = this.xmlSchema.safeParse(xml)
        if (!success) {
            console.log(errorXml.message)
            throw new TypeConverterError('INVALID_XML')
        }

        const value = this.mapXmlToValue(xml)

        const { success: successValue, data, error } = this.valueSchema.safeParse(value)

        if (!successValue) {
            console.log(error.message)
            throw new TypeConverterError('INVALID_XML')
        }

        return data as ValueType
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract mapXmlToValue(xml: any): any

    _toXML(value: ValueType): XmlType {
        const { success, data, error } = this.valueSchema.safeParse(value)
        if (!success) {
            console.log(error.message)
            throw new TypeConverterError('INVALID_VALUE')
        }

        const xml = this.mapValueToXml(data)

        const { success: xmlSuccess, data: xmlData, error: xmlError } = this.xmlSchema.safeParse(xml)
        if (!xmlSuccess) {
            console.log(xmlError.message)

            throw new TypeConverterError('INVALID_VALUE')
        }

        return xmlData as XmlType
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract mapValueToXml(value: any): any
}
