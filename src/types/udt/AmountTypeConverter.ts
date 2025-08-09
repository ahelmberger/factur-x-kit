import { z } from 'zod';

import { round } from '../../helper/calculation';
import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter';

export const ZAmountType = z.number();

export type AmountType = z.infer<typeof ZAmountType>;

export const ZAmountTypeXml = z.object({
    '#text': z.string(),
    '@currencyID': z.string().optional()
});

export type AmountTypeXml = z.infer<typeof ZAmountTypeXml>;

export class AmountTypeConverter extends BaseTypeConverter<AmountType, AmountTypeXml> {
    private decimalPlaces: number;

    constructor(decimalPlaces = 2) {
        super();
        this.decimalPlaces = decimalPlaces;
    }
    _toValue(xml: AmountTypeXml) {
        const { success, data, error } = ZAmountTypeXml.safeParse(xml);
        if (!success) {
            console.error(error.message);
            throw new TypeConverterError('INVALID_XML');
        }

        const amount = parseFloat(data['#text']);
        if (amount == null || isNaN(amount)) {
            throw new TypeConverterError('INVALID_XML');
        }

        return amount;
    }

    _toXML(value: any): AmountTypeXml {
        const { success, data, error } = ZAmountType.safeParse(value);

        if (!success) {
            console.error(error.message);
            throw new TypeConverterError('INVALID_VALUE');
        }
        return {
            '#text': round(data, this.decimalPlaces).toFixed(this.decimalPlaces)
        };
    }
}
