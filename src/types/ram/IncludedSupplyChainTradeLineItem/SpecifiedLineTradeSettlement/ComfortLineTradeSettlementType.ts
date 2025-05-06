import { z } from 'zod'

import { ZAmountType, ZAmountTypeXml } from '../../../udt/AmountTypeConverter'
import { ZDateTimeType, ZDateTimeTypeXml } from '../../../udt/DateTimeTypeConverter'
import { ZIdType, ZIdTypeXml } from '../../../udt/IdTypeConverter'
import {
    ZReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort,
    ZReferencedDocumentType_additionalDocument_lineLevel_comfort
} from '../../ReferencedDocumentType/ReferencedDocumentTypes'
import {
    ZBasicLineLevelTradeAllowanceChargeType,
    ZBasicLineLevelTradeAllowanceChargeTypeXml
} from '../../TradeAllowanceChargeType/BasicLineLevelAllowanceChargeType'
import {
    ZBasicLineLevelTradeTaxType,
    ZBasicLineLevelTradeTaxTypeXml
} from '../../TradeTaxType/BasicLineLevelTradeTaxType'

export const ZComfortLineTradeSettlementType = z.object({
    tax: ZBasicLineLevelTradeTaxType,
    billingPeriod: z
        .object({
            startDate: ZDateTimeType.optional(),
            endDate: ZDateTimeType.optional()
        })
        .optional(),
    lineLevelAllowancesAndCharges: ZBasicLineLevelTradeAllowanceChargeType.optional(),
    lineTotals: z.object({
        netTotal: ZAmountType
    }),
    additionalReferences: ZReferencedDocumentType_additionalDocument_lineLevel_comfort.array().max(1).optional(),
    accountingInformation: z
        .object({
            id: ZIdType
        })
        .optional()
})

export type ComfortLineTradeSettlementType = z.infer<typeof ZComfortLineTradeSettlementType>

export const ZComfortLineTradeSettlementTypeXml = z.object({
    'ram:ApplicableTradeTax': ZBasicLineLevelTradeTaxTypeXml,
    'ram:BillingSpecifiedPeriod': z
        .object({
            'ram:StartDateTime': ZDateTimeTypeXml.optional(),
            'ram:EndDateTime': ZDateTimeTypeXml.optional()
        })
        .optional(),
    'ram:SpecifiedTradeAllowanceCharge': ZBasicLineLevelTradeAllowanceChargeTypeXml.optional(),
    'ram:SpecifiedTradeSettlementLineMonetarySummation': z.object({
        'ram:LineTotalAmount': ZAmountTypeXml
    }),
    'ram:AdditionalReferencedDocument': z
        .union([
            ZReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort,
            ZReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort.array()
        ])
        .optional(),
    'ram:ReceivableSpecifiedTradeAccountingAccount': z
        .object({
            'ram:ID': ZIdTypeXml
        })
        .optional()
})

export type ComfortLineTradeSettlementTypeXml = z.infer<typeof ZComfortLineTradeSettlementTypeXml>
