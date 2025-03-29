import { z } from 'zod'

import { ZAmountType, ZAmountTypeXml } from '../../../udt/AmountTypeConverter'
import { ZDateTimeType, ZDateTimeTypeXml } from '../../../udt/DateTimeTypeConverter'
import { ZBasicLineLevelTradeAllowanceChargeTypeXml } from '../../TradeAllowanceChargeType/BasicLineLevelAllowanceChargeType'
import {
    ZBasicLineLevelTradeTaxType,
    ZBasicLineLevelTradeTaxTypeXml
} from '../../TradeTaxType/BasicLineLevelTradeTaxType'

export const ZBasicLineTradeSettlementType = z.object({
    tax: ZBasicLineLevelTradeTaxType,
    billingPeriod: z
        .object({
            startDate: ZDateTimeType.optional(),
            endDate: ZDateTimeType.optional()
        })
        .optional(),
    lineLevelAllowancesAndCharges: ZBasicLineLevelTradeAllowanceChargeTypeXml.optional(),
    lineTotals: z.object({
        netTotal: ZAmountType
    })
})

export type BasicLineTradeSettlementType = z.infer<typeof ZBasicLineTradeSettlementType>

export const ZBasicLineTradeSettlementTypeXml = z.object({
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
    })
})

export type BasicLineTradeSettlementTypeXml = z.infer<typeof ZBasicLineTradeSettlementTypeXml>
