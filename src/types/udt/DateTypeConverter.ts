import { z } from 'zod';

import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter';
import { DateTimeTypeConverter, ZDateTimeType } from './DateTimeTypeConverter';

export const ZDateType = ZDateTimeType;
export type DateType = z.infer<typeof ZDateType>;

export const ZDateTypeXml = z.object({
    'udt:DateString': z.object({
        '#text': z.string(),
        '@format': z.literal('102')
    })
});

export type DateTypeXml = z.infer<typeof ZDateTypeXml>;

export class DateTypeConverter extends BaseTypeConverter<DateType, DateTypeXml> {
    _toValue(xml: DateTypeXml) {
        const { success, data } = ZDateTypeXml.safeParse(xml);
        if (!success) {
            throw new TypeConverterError('INVALID_XML');
        }

        const dateString = data['udt:DateString']['#text'];

        const dateObject = DateTimeTypeConverter.convertDateString102ToDateObject(dateString);

        const { success: success_value, data: data_value } = ZDateTimeType.safeParse(dateObject);
        if (!success_value) {
            throw new TypeConverterError('INVALID_VALUE');
        }
        return data_value;
    }

    _toXML(value: DateType): DateTypeXml {
        const { success, data } = ZDateType.safeParse(value);

        if (!success) {
            throw new TypeConverterError('INVALID_VALUE');
        }

        const dt = DateTimeTypeConverter.convertDateObjectToDateString102(data);

        return {
            'udt:DateString': {
                '#text': dt,
                '@format': '102'
            }
        };
    }
}
