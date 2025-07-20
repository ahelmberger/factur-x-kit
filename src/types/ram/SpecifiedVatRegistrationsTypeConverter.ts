import { z } from 'zod'

import { BaseTypeConverter, TypeConverterError } from '../BaseTypeConverter'
import { ZIdType } from '../udt/IdTypeConverter'
import { ZIdTypeWithRequiredSchemeXml } from '../udt/IdTypeWithRequiredlSchemeConverter'

export const ZSpecifiedVatRegistrationsType = z.object({
    vatId: ZIdType // BT-63
})

export type SpecifiedVatRegistrationsType = z.infer<typeof ZSpecifiedVatRegistrationsType>

export const ZSpecifiedVatRegistrationsTypeXml = z.object({
    'ram:ID': ZIdTypeWithRequiredSchemeXml
})

export type SpecifiedVatRegistrationsTypeXml = z.infer<typeof ZSpecifiedVatRegistrationsTypeXml>

export class SpecifiedVatRegistrationsTypeConverter extends BaseTypeConverter<
    SpecifiedVatRegistrationsType,
    SpecifiedVatRegistrationsTypeXml
> {
    _toValue(xml: SpecifiedVatRegistrationsTypeXml) {
        const { success, data } = ZSpecifiedVatRegistrationsTypeXml.safeParse(xml)
        if (!success) {
            throw new TypeConverterError('INVALID_XML')
        }

        if (xml['ram:ID']['@schemeID'] === 'VA') {
            return {
                vatId: data['ram:ID']['#text']
            }
        }

        throw new TypeConverterError('INVALID_XML')
    }

    _toXML(value: SpecifiedVatRegistrationsType): SpecifiedVatRegistrationsTypeXml {
        const { success, data } = ZSpecifiedVatRegistrationsType.safeParse(value)
        if (!success) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        if ('vatId' in data) {
            return {
                'ram:ID': {
                    '#text': data.vatId,
                    '@schemeID': 'VA'
                }
            }
        }

        throw new TypeConverterError('INVALID_VALUE')
    }
}
