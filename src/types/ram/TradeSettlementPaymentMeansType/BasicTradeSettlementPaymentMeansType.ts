import { z } from 'zod'

import { ZCodeType, ZCodeTypeXml } from '../../CodeTypeConverter'
import { PAYMENT_MEANS_CODES } from '../../codes'
import { ZTokenType, ZTokenTypeXml } from '../../xs/TokenConverter'

export const ZBasicPaymentMeansType = z.object({
    paymentType: ZCodeType(PAYMENT_MEANS_CODES),
    payerBankAccount: z.object({ iban: ZTokenType.optional() }).optional(),
    payeeBankAccount: z.object({ iban: ZTokenType.optional(), propriataryId: ZTokenType.optional() }).optional()
})

export type BasicPaymentMeansType = z.infer<typeof ZBasicPaymentMeansType>

export const ZBasicPaymentMeansTypeXml = z.object({
    'ram:TypeCode': ZCodeTypeXml,
    'ram:PayerPartyDebtorFinancialAccount': z
        .object({
            'ram:IBANID': ZTokenTypeXml.optional()
        })
        .optional(),
    'ram:PayeePartyCreditorFinancialAccount': z
        .object({
            'ram:IBANID': ZTokenTypeXml.optional(),
            'ram:ProprietaryID': ZTokenTypeXml.optional()
        })
        .optional()
})

export type BasicPaymentMeansTypeXml = z.infer<typeof ZBasicPaymentMeansTypeXml>
