import { DateTime } from 'luxon'
import { z } from 'zod'

import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter'

const DATE_FORMATS = {
    '102': 'yyyyMMdd'
}

export const ZDateType = z.date()
export type DateType = z.infer<typeof ZDateType>

export const ZDateTypeXml = z.object({
    'udt:DateString': z.object({
        '#text': z.string(),
        '@format': z.literal('102')
    })
})

export type DateTypeXml = z.infer<typeof ZDateTypeXml>

export class DateTypeConverter extends BaseTypeConverter<DateType, DateTypeXml> {
    _toValue(xml: DateTypeXml) {
        const { success, data } = ZDateTypeXml.safeParse(xml)
        if (!success) {
            throw new TypeConverterError('INVALID_XML')
        }

        const dt = DateTime.fromFormat(data['udt:DateString']['#text'], DATE_FORMATS[data['udt:DateString']['@format']])
        if (!dt || !dt.isValid) {
            throw new TypeConverterError('INVALID_XML')
        }

        return dt.toJSDate()
    }

    _toXML(value: DateType): DateTypeXml {
        const { success, data } = ZDateType.safeParse(value)

        if (!success) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        const dt = DateTime.fromJSDate(data)

        return {
            'udt:DateString': {
                '#text': dt.toFormat(DATE_FORMATS['102']),
                '@format': '102'
            }
        }
    }
}
