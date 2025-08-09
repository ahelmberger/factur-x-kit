import { z } from 'zod';

import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter';

export const ZDateTimeType = z.object({
    year: z.number().int().min(1900).max(2200),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31)
});
export type DateTimeType = z.infer<typeof ZDateTimeType>;

export const ZDateTimeTypeXml = z.object({
    'udt:DateTimeString': z.object({
        '#text': z.string(),
        '@format': z.literal('102')
    })
});

export type DateTimeTypeXml = z.infer<typeof ZDateTimeTypeXml>;

export class DateTimeTypeConverter extends BaseTypeConverter<DateTimeType, DateTimeTypeXml> {
    _toValue(xml: DateTimeTypeXml) {
        const { success, data } = ZDateTimeTypeXml.safeParse(xml);
        if (!success) {
            throw new TypeConverterError('INVALID_XML');
        }

        const dateString = data['udt:DateTimeString']['#text'];

        const dateObject = DateTimeTypeConverter.convertDateString102ToDateObject(dateString);

        const { success: success_value, data: data_value } = ZDateTimeType.safeParse(dateObject);
        if (!success_value) {
            throw new TypeConverterError('INVALID_VALUE');
        }
        return data_value;
    }

    _toXML(value: DateTimeType): DateTimeTypeXml {
        const { success, data, error } = ZDateTimeType.safeParse(value);

        if (!success) {
            console.error('Invalid value:', value);
            throw new TypeConverterError('INVALID_VALUE');
        }

        const dt = DateTimeTypeConverter.convertDateObjectToDateString102(data);

        return {
            'udt:DateTimeString': {
                '#text': dt,
                '@format': '102'
            }
        };
    }

    static convertDateString102ToDateObject(dateString: string): DateTimeType {
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10);
        const day = parseInt(dateString.substring(6, 8), 10);
        return { year, month, day };
    }

    static convertDateObjectToDateString102(date: DateTimeType): string {
        const year = date.year.toString().padStart(4, '0');
        const month = date.month.toString().padStart(2, '0');
        const day = date.day.toString().padStart(2, '0');
        return `${year}${month}${day}`;
    }
}
