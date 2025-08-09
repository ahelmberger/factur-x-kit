import { z } from 'zod';

import { round } from '../../helper/calculation';
import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter';

export const ZPercentType = z.number();

export type PercentType = z.infer<typeof ZPercentType>;

export const ZPercentTypeXml = z.object({
    '#text': z.string()
});

export type PercentTypeXml = z.infer<typeof ZPercentTypeXml>;

export class PercentTypeConverter extends BaseTypeConverter<PercentType, PercentTypeXml> {
    _toValue(xml: PercentTypeXml) {
        const { success, data } = ZPercentTypeXml.safeParse(xml);
        if (!success) {
            throw new TypeConverterError('INVALID_XML');
        }

        const value = parseFloat(data['#text']);
        if (value == null || isNaN(value)) {
            throw new TypeConverterError('INVALID_XML');
        }

        return value;
    }

    _toXML(value: PercentType): PercentTypeXml {
        const { success, data } = ZPercentType.safeParse(value);
        if (!success) {
            throw new TypeConverterError('INVALID_VALUE');
        }

        return {
            '#text': round(data, 4).toFixed(4)
        };
    }
}
