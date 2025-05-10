import { z } from 'zod'

import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter'
import { DateTimeType, DateTimeTypeConverter, ZDateTimeType } from '../udt/DateTimeTypeConverter'

export const ZDateTimeTypeXml_qdt = z.object({
    'qdt:DateTimeString': z.object({
        '#text': z.string(),
        '@format': z.literal('102')
    })
})

export type DateTimeTypeXml_qdt = z.infer<typeof ZDateTimeTypeXml_qdt>

export class DateTimeTypeConverter_qdt extends BaseTypeConverter<DateTimeType, DateTimeTypeXml_qdt> {
    _toValue(xml: DateTimeTypeXml_qdt) {
        const { success, data } = ZDateTimeTypeXml_qdt.safeParse(xml)
        if (!success) {
            throw new TypeConverterError('INVALID_XML')
        }

        const dateString = data['qdt:DateTimeString']['#text']

        const dateObject = DateTimeTypeConverter.convertDateString102ToDateObject(dateString)

        const { success: success_value, data: data_value } = ZDateTimeType.safeParse(dateObject)
        if (!success_value) {
            throw new TypeConverterError('INVALID_VALUE')
        }
        return data_value
    }

    _toXML(value: DateTimeType): DateTimeTypeXml_qdt {
        const { success, data } = ZDateTimeType.safeParse(value)

        if (!success) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        const dt = DateTimeTypeConverter.convertDateObjectToDateString102(data)

        return {
            'qdt:DateTimeString': {
                '#text': dt,
                '@format': '102'
            }
        }
    }
}
