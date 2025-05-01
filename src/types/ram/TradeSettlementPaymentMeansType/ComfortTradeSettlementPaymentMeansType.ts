import { z } from 'zod'

import { ZTextType, ZTextTypeXml } from '../../udt/TextTypeConverter'
import { ZTokenType, ZTokenTypeXml } from '../../xs/TokenConverter'
import { ZBasicPaymentMeansType, ZBasicPaymentMeansTypeXml } from './BasicTradeSettlementPaymentMeansType'

export const ZComfortPaymentMeansType = ZBasicPaymentMeansType.extend({
    description: ZTextType.optional(),
    financialCard: z
        .object({
            finalDigitsOfCard: ZTokenType,
            cardholderName: ZTextType.optional()
        })
        .optional(),
    payeeBankAccount: z
        .object({
            iban: ZTokenType.optional(),
            propriataryId: ZTokenType.optional(),
            accountName: ZTextType.optional(),
            bic: ZTokenType.optional()
        })
        .optional()
})

export type ComfortPaymentMeansType = z.infer<typeof ZComfortPaymentMeansType>

export const ZComfortPaymentMeansTypeXml = ZBasicPaymentMeansTypeXml.extend({
    'ram:Information': ZTextTypeXml.optional(),
    'ram:ApplicableTradeSettlementFinancialCard': z
        .object({
            'ram:ID': ZTokenTypeXml,
            'ram:CardholderName': ZTextTypeXml.optional()
        })
        .optional(),
    'ram:PayeePartyCreditorFinancialAccount': z
        .object({
            'ram:IBANID': ZTokenTypeXml.optional(),
            'ram:AccountName': ZTextTypeXml.optional(),
            'ram:ProprietaryID': ZTokenTypeXml.optional()
        })
        .optional(),
    'ram:PayeeSpecifiedCreditorFinancialInstitution': z
        .object({
            'ram:BICID': ZTokenTypeXml
        })
        .optional()
})

export type ComfortPaymentMeansTypeXml = z.infer<typeof ZComfortPaymentMeansTypeXml>
