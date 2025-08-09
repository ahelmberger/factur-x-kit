import { z } from 'zod';

import { ZTextType, ZTextTypeXml } from '../../udt/TextTypeConverter';
import { ZTokenType, ZTokenTypeXml } from '../../xs/TokenConverter';

export const ZExtendedTradeContactType = z.object({
    personName: ZTextType.optional(),
    departmentName: ZTextType.optional(),
    typeCode: ZTokenType.optional(),
    telephoneNumber: ZTextType.optional(),
    faxNumber: ZTextType.optional(),
    email: ZTextType.optional()
});

export type ExtendedTradeContactType = z.infer<typeof ZExtendedTradeContactType>;

const ZUniversalCommunicationTypeXml = z.object({
    'ram:CompleteNumber': ZTextTypeXml
});

export const ZExtendedTradeContactTypeXml = z.object({
    'ram:PersonName': ZTextTypeXml.optional(),
    'ram:DepartmentName': ZTextTypeXml.optional(),
    'ram:TypeCode': ZTokenTypeXml.optional(),
    'ram:TelephoneUniversalCommunication': ZUniversalCommunicationTypeXml.optional(),
    'ram:FaxUniversalCommunication': ZUniversalCommunicationTypeXml.optional(),
    'ram:EmailURIUniversalCommunication': z
        .object({
            'ram:URIID': ZTextTypeXml
        })
        .optional()
});

export type ExtendedTradeContactTypeXml = z.infer<typeof ZExtendedTradeContactTypeXml>;
