import { z } from 'zod'

import { ZAmountType, ZAmountTypeXml } from '../../../udt/AmountTypeConverter'
import { ZDateTimeType, ZDateTimeTypeXml } from '../../../udt/DateTimeTypeConverter'
import { ZIdType, ZIdTypeXml } from '../../../udt/IdTypeConverter'
import {
    ZReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort,
    ZReferencedDocumentType_additionalDocument_lineLevel_comfort
} from '../../ReferencedDocumentType/ReferencedDocumentTypes'
import {
    ZComfortLineLevelTradeAllowanceChargeType,
    ZComfortLineLevelTradeAllowanceChargeTypeXml
} from '../../TradeAllowanceChargeType/ComfortLineLevelAllowanceChargeType'
import {
    ZBasicLineLevelTradeTaxType,
    ZBasicLineLevelTradeTaxTypeXml
} from '../../TradeTaxType/BasicLineLevelTradeTaxType'

export const ZComfortLineTradeSettlementType = z.object({
    tax: ZBasicLineLevelTradeTaxType.describe('BG-30'),
    billingPeriod: z
        .object({
            startDate: ZDateTimeType.optional().describe('BT-134'),
            endDate: ZDateTimeType.optional().describe('BT-135')
        })
        .optional()
        .describe('BG-26'),
    lineLevelAllowancesAndCharges: ZComfortLineLevelTradeAllowanceChargeType.optional(),
    lineTotals: z
        .object({
            netTotal: ZAmountType.describe('BT-131')
        })
        .describe('BT-131-00'),
    additionalReferences: ZReferencedDocumentType_additionalDocument_lineLevel_comfort.array()
        .max(1)
        .optional()
        .describe('BT-128-00'),
    accountingInformation: z
        .object({
            id: ZIdType.describe('BT-133')
        })
        .optional()
        .describe('BT-133-00')
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
    'ram:SpecifiedTradeAllowanceCharge': ZComfortLineLevelTradeAllowanceChargeTypeXml.optional(),
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
