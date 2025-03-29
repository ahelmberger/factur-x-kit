import { z } from 'zod'

import { ExtendableBaseTypeConverter } from '../../../ExtendableBaseTypeConverter'
import { AmountTypeConverter } from '../../../udt/AmountTypeConverter'
import { DateTimeTypeConverter } from '../../../udt/DateTimeTypeConverter'
import {
    TradeAllowanceChargeTypeConverter,
    allowedValueTypes_TradeAllowanceChargeType,
    allowedXmlTypes_TradeAllowanceChargeType
} from '../../TradeAllowanceChargeType/TradeAllowanceChargeTypeConverter'
import {
    TradeTaxTypeConverter,
    allowedValueTypes_TradeTax,
    allowedXmlTypes_TradeTax
} from '../../TradeTaxType/TradeTaxTypeConverter'
import {
    BasicLineTradeSettlementType,
    BasicLineTradeSettlementTypeXml,
    ZBasicLineTradeSettlementType,
    ZBasicLineTradeSettlementTypeXml
} from './BasicLineTradeSettlementType'

export type allowedValueTypes_LineTradeSettlement = BasicLineTradeSettlementType
export type allowedXmlTypes_LineTradeSettlement = BasicLineTradeSettlementTypeXml

export class LineTradeSettlementConverter<
    ValueType extends allowedValueTypes_LineTradeSettlement,
    XmlType extends allowedXmlTypes_LineTradeSettlement
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    lineLevelTradeTaxTypeConverter: TradeTaxTypeConverter<allowedValueTypes_TradeTax, allowedXmlTypes_TradeTax>
    tradeAllowanceChargeTypeConverter: TradeAllowanceChargeTypeConverter<
        allowedValueTypes_TradeAllowanceChargeType,
        allowedXmlTypes_TradeAllowanceChargeType
    >

    amountTypeConverter = new AmountTypeConverter()
    dateTimeTypeConverter = new DateTimeTypeConverter()

    constructor(
        valueSchema: z.ZodType<ValueType>,
        xmlSchema: z.ZodType<XmlType>,
        lineLevelTradeTaxTypeConverter: TradeTaxTypeConverter<allowedValueTypes_TradeTax, allowedXmlTypes_TradeTax>,
        tradeAllowanceChargeTypeConverter: TradeAllowanceChargeTypeConverter<
            allowedValueTypes_TradeAllowanceChargeType,
            allowedXmlTypes_TradeAllowanceChargeType
        >
    ) {
        super(valueSchema, xmlSchema)
        this.lineLevelTradeTaxTypeConverter = lineLevelTradeTaxTypeConverter
        this.tradeAllowanceChargeTypeConverter = tradeAllowanceChargeTypeConverter
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any): any {
        return {
            tax:
                xml['ram:ApplicableTradeTax'] != null
                    ? this.lineLevelTradeTaxTypeConverter.toValue(xml['ram:ApplicableTradeTax'])
                    : undefined,
            billingPeriod:
                xml['ram:BillingSpecifiedPeriod'] != null
                    ? {
                          startDate:
                              xml['ram:BillingSpecifiedPeriod']['ram:StartDateTime'] != null
                                  ? this.dateTimeTypeConverter.toValue(
                                        xml['ram:BillingSpecifiedPeriod']['ram:StartDateTime']
                                    )
                                  : undefined,
                          endDate:
                              xml['ram:BillingSpecifiedPeriod']['ram:EndDateTime'] != null
                                  ? this.dateTimeTypeConverter.toValue(
                                        xml['ram:BillingSpecifiedPeriod']['ram:EndDateTime']
                                    )
                                  : undefined
                      }
                    : undefined,
            lineLevelAllowancesAndCharges:
                xml['ram:SpecifiedTradeAllowanceCharge'] != null
                    ? this.tradeAllowanceChargeTypeConverter.toValue(xml['ram:SpecifiedTradeAllowanceCharge'])
                    : undefined,
            lineTotals:
                xml['ram:SpecifiedTradeSettlementLineMonetarySummation'] != null
                    ? {
                          netTotal:
                              xml['ram:SpecifiedTradeSettlementLineMonetarySummation']['ram:LineTotalAmount'] != null
                                  ? this.amountTypeConverter.toValue(
                                        xml['ram:SpecifiedTradeSettlementLineMonetarySummation']['ram:LineTotalAmount']
                                    )
                                  : undefined
                      }
                    : undefined
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: BasicLineTradeSettlementType): any {
        return {
            'ram:ApplicableTradeTax':
                value.tax != null ? this.lineLevelTradeTaxTypeConverter.toXML(value.tax) : undefined,
            'ram:BillingSpecifiedPeriod':
                value.billingPeriod != null
                    ? {
                          'ram:StartDateTime':
                              value.billingPeriod.startDate != null
                                  ? this.dateTimeTypeConverter.toXML(value.billingPeriod.startDate)
                                  : undefined,
                          'ram:EndDateTime':
                              value.billingPeriod.endDate != null
                                  ? this.dateTimeTypeConverter.toXML(value.billingPeriod.endDate)
                                  : undefined
                      }
                    : undefined,
            'ram:SpecifiedTradeAllowanceCharge':
                value.lineLevelAllowancesAndCharges != null
                    ? this.tradeAllowanceChargeTypeConverter.toXML(value.lineLevelAllowancesAndCharges)
                    : undefined,
            'ram:SpecifiedTradeSettlementLineMonetarySummation':
                value.lineTotals != null
                    ? {
                          'ram:LineTotalAmount':
                              value.lineTotals.netTotal != null
                                  ? this.amountTypeConverter.toXML(value.lineTotals.netTotal)
                                  : undefined
                      }
                    : undefined
        }
    }

    public static basic() {
        return new LineTradeSettlementConverter<BasicLineTradeSettlementType, BasicLineTradeSettlementTypeXml>(
            ZBasicLineTradeSettlementType,
            ZBasicLineTradeSettlementTypeXml,
            TradeTaxTypeConverter.basicLineLevel(),
            TradeAllowanceChargeTypeConverter.basicItemLevel()
        )
    }
}
