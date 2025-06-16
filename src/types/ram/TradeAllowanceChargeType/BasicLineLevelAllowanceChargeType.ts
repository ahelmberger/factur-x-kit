import { z } from 'zod'

import { ZCodeType } from '../../CodeTypeConverter'
import { ALLOWANCE_REASONS_CODES, CHARGE_REASONS_CODES } from '../../codes'
import {
    ZTradeAllowanceChargeBasisType,
    ZTradeAllowanceChargeBasisTypeXml
} from './BasicDocumentLevelAllowanceChargeType'

const ZTradeAllowanceChargeBasisType_BasicLineLevel = ZTradeAllowanceChargeBasisType.pick({
    actualAmount: true,
    reasonCode: true,
    reason: true
})

const ZTradeAllowanceType = ZTradeAllowanceChargeBasisType_BasicLineLevel.extend({
    reasonCode: ZCodeType(ALLOWANCE_REASONS_CODES).optional()
})

const ZTradeChargeType = ZTradeAllowanceChargeBasisType_BasicLineLevel.extend({
    reasonCode: ZCodeType(CHARGE_REASONS_CODES).optional()
})

export const ZBasicLineLevelTradeAllowanceChargeType = z.object({
    allowances: ZTradeAllowanceType.array().optional().describe('BG-27'),
    charges: ZTradeChargeType.array().optional().describe('BG-28')
})

export type BasicLineLevelTradeAllowanceChargeType = z.infer<typeof ZBasicLineLevelTradeAllowanceChargeType>

const ZTradeAllowanceChargeBasisTypeXml_BasicLineLevel = ZTradeAllowanceChargeBasisTypeXml.pick({
    'ram:ChargeIndicator': true,
    'ram:ActualAmount': true,
    'ram:ReasonCode': true,
    'ram:Reason': true
})

export const ZBasicLineLevelTradeAllowanceChargeTypeXml = z.union([
    ZTradeAllowanceChargeBasisTypeXml_BasicLineLevel,
    ZTradeAllowanceChargeBasisTypeXml_BasicLineLevel.array()
])

export type BasicLineLevelTradeAllowanceChargeTypeXml = z.infer<typeof ZBasicLineLevelTradeAllowanceChargeTypeXml>
