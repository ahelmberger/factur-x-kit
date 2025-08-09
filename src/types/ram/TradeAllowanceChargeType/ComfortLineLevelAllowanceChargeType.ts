import { z } from 'zod';

import { ZCodeType } from '../../CodeTypeConverter';
import { ALLOWANCE_REASONS_CODES, CHARGE_REASONS_CODES } from '../../codes';
import {
    ZTradeAllowanceChargeBasisType,
    ZTradeAllowanceChargeBasisTypeXml
} from './BasicDocumentLevelAllowanceChargeType';

const ZTradeAllowanceChargeBasisType_ComfortLineLevel = ZTradeAllowanceChargeBasisType.pick({
    calculationPercent: true,
    basisAmount: true,
    actualAmount: true,
    reasonCode: true,
    reason: true
});

const ZTradeAllowanceType = ZTradeAllowanceChargeBasisType_ComfortLineLevel.extend({
    reasonCode: ZCodeType(ALLOWANCE_REASONS_CODES).optional()
});

const ZTradeChargeType = ZTradeAllowanceChargeBasisType_ComfortLineLevel.extend({
    reasonCode: ZCodeType(CHARGE_REASONS_CODES).optional()
});

export const ZComfortLineLevelTradeAllowanceChargeType = z.object({
    allowances: ZTradeAllowanceType.array().optional(),
    charges: ZTradeChargeType.array().optional()
});

export type ComfortLineLevelTradeAllowanceChargeType = z.infer<typeof ZComfortLineLevelTradeAllowanceChargeType>;

const ZTradeAllowanceChargeBasisTypeXml_ComfortLineLevel = ZTradeAllowanceChargeBasisTypeXml.pick({
    'ram:ChargeIndicator': true,
    'ram:CalculationPercent': true,
    'ram:BasisAmount': true,
    'ram:ActualAmount': true,
    'ram:ReasonCode': true,
    'ram:Reason': true
});

export const ZComfortLineLevelTradeAllowanceChargeTypeXml = z.union([
    ZTradeAllowanceChargeBasisTypeXml_ComfortLineLevel,
    ZTradeAllowanceChargeBasisTypeXml_ComfortLineLevel.array()
]);

export type ComfortLineLevelTradeAllowanceChargeTypeXml = z.infer<typeof ZComfortLineLevelTradeAllowanceChargeTypeXml>;
