import { z } from 'zod'

import { BaseTypeConverter, TypeConverterError } from '../../BaseTypeConverter'
import { CodeTypeConverter } from '../../CodeTypeConverter'
import { ALLOWANCE_REASONS_CODES, CHARGE_REASONS_CODES, TAX_CATEGORY_CODES, TAX_TYPE_CODE } from '../../codes'
import { AmountTypeConverter } from '../../udt/AmountTypeConverter'
import { IndicatorTypeConverter } from '../../udt/IndicatorTypeConverter'
import { PercentTypeConverter } from '../../udt/PercentTypeConverter'
import { TextTypeConverter } from '../../udt/TextTypeConverter'
import {
    BasicDocumentLevelTradeAllowanceChargeType,
    BasicDocumentLevelTradeAllowanceChargeTypeXml,
    ZBasicDocumentLevelTradeAllowanceChargeType,
    ZBasicDocumentLevelTradeAllowanceChargeTypeXml
} from './BasicDocumentLevelAllowanceChargeType'
import {
    BasicLineLevelTradeAllowanceChargeType,
    BasicLineLevelTradeAllowanceChargeTypeXml,
    ZBasicLineLevelTradeAllowanceChargeType,
    ZBasicLineLevelTradeAllowanceChargeTypeXml
} from './BasicLineLevelAllowanceChargeType'
import {
    BasicPriceAllowanceType,
    BasicPriceAllowanceTypeXml,
    ZBasicPriceAllowanceType,
    ZBasicPriceAllowanceTypeXml
} from './BasicPriceAllowanceType'

export type allowedValueTypes_TradeAllowanceChargeType =
    | BasicDocumentLevelTradeAllowanceChargeType
    | BasicLineLevelTradeAllowanceChargeType
    | BasicPriceAllowanceType
export type allowedXmlTypes_TradeAllowanceChargeType =
    | BasicDocumentLevelTradeAllowanceChargeTypeXml
    | BasicLineLevelTradeAllowanceChargeTypeXml
    | BasicPriceAllowanceTypeXml

export class TradeAllowanceChargeTypeConverter<
    ValueType extends allowedValueTypes_TradeAllowanceChargeType,
    XmlType extends allowedXmlTypes_TradeAllowanceChargeType
> extends BaseTypeConverter<ValueType, XmlType> {
    amountTypeConverter = new AmountTypeConverter()
    textTypeConverter = new TextTypeConverter()
    taxTypeCodeConverter = new CodeTypeConverter(TAX_TYPE_CODE)
    taxCategoryCodeConverter = new CodeTypeConverter(TAX_CATEGORY_CODES)
    allowanceReasonCodeConverter = new CodeTypeConverter(ALLOWANCE_REASONS_CODES)
    chargeReasonCodeConvereter = new CodeTypeConverter(CHARGE_REASONS_CODES)
    percentTypeConverter = new PercentTypeConverter()
    indicatorTypeConverter = new IndicatorTypeConverter()

    private valueSchema: z.ZodType<ValueType>
    private xmlSchema: z.ZodType<XmlType>

    constructor(valueSchema: z.ZodType<ValueType>, xmlSchema: z.ZodType<XmlType>) {
        super()
        this.valueSchema = valueSchema
        this.xmlSchema = xmlSchema
    }

    _toValue(xml: XmlType): ValueType {
        const { success } = this.xmlSchema.safeParse(xml)
        if (!success) {
            throw new TypeConverterError('INVALID_XML')
        }

        const xml_arr = Array.isArray(xml) ? xml : [xml]

        const xmlAllowances = xml_arr.filter(item => {
            return !this.indicatorTypeConverter.toValue(item['ram:ChargeIndicator'])
        })
        const xmlCharges = xml_arr.filter(item => {
            return this.indicatorTypeConverter.toValue(item['ram:ChargeIndicator'])
        })
        const value = {
            allowances: xmlAllowances.map(xml => this.mapXmlToValue(xml, false)),
            charges: xmlCharges.map(xml => this.mapXmlToValue(xml, true))
        }

        const { success: successValue, data } = this.valueSchema.safeParse(value)

        if (!successValue) {
            throw new TypeConverterError('INVALID_XML')
        }

        return data as ValueType
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any, allowance_false_charge_true: boolean) {
        const allowanceChargeReasonCodeConverter = allowance_false_charge_true
            ? this.chargeReasonCodeConvereter
            : this.allowanceReasonCodeConverter
        return {
            calculationPercent: xml['ram:CalculationPercent']
                ? this.percentTypeConverter.toValue(xml['ram:CalculationPercent'])
                : undefined,
            basisAmount: xml['ram:BasisAmount'] ? this.amountTypeConverter.toValue(xml['ram:BasisAmount']) : undefined,
            actualAmount: xml['ram:ActualAmount']
                ? this.amountTypeConverter.toValue(xml['ram:ActualAmount'])
                : undefined,
            reasonCode: xml['ram:ReasonCode']
                ? allowanceChargeReasonCodeConverter.toValue(xml['ram:ReasonCode'])
                : undefined,
            reason: xml['ram:Reason'] ? this.textTypeConverter.toValue(xml['ram:Reason']) : undefined,
            categoryTradeTax: xml['ram:CategoryTradeTax']
                ? {
                      typeCode: xml['ram:CategoryTradeTax']['ram:TypeCode']
                          ? this.taxTypeCodeConverter.toValue(xml['ram:CategoryTradeTax']['ram:TypeCode'])
                          : undefined,
                      categoryCode: xml['ram:CategoryTradeTax']['ram:CategoryCode']
                          ? this.taxCategoryCodeConverter.toValue(xml['ram:CategoryTradeTax']['ram:CategoryCode'])
                          : undefined,
                      rateApplicablePercent: xml['ram:CategoryTradeTax']['ram:RateApplicablePercent']
                          ? this.percentTypeConverter.toValue(xml['ram:CategoryTradeTax']['ram:RateApplicablePercent'])
                          : undefined
                  }
                : undefined
        }
    }

    _toXML(value: ValueType): XmlType {
        const { success, data } = this.valueSchema.safeParse(value)
        if (!success) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        const xml_allowances = data.allowances
            ? data.allowances.map(obj => {
                  return this.mapValueToXml(obj, false)
              })
            : []

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let xml_charges: any[] = []
        if ('charges' in data) {
            xml_charges = data.charges
                ? data.charges.map(obj => {
                      return this.mapValueToXml(obj, true)
                  })
                : []
        }
        const { success: xmlSuccess, data: xmlData } = this.xmlSchema.safeParse([...xml_allowances, ...xml_charges])
        if (!xmlSuccess) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        return xmlData as XmlType
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any, allowance_false_charge_true: boolean) {
        const allowanceChargeReasonCodeConverter = allowance_false_charge_true
            ? this.chargeReasonCodeConvereter
            : this.allowanceReasonCodeConverter
        return {
            'ram:ChargeIndicator': this.indicatorTypeConverter.toXML(allowance_false_charge_true),
            'ram:CalculationPercent':
                value.calculationPercent != undefined
                    ? this.percentTypeConverter.toXML(value.calculationPercent)
                    : undefined,
            'ram:BasisAmount':
                value.basisAmount != undefined ? this.amountTypeConverter.toXML(value.basisAmount) : undefined,
            'ram:ActualAmount': this.amountTypeConverter.toXML(value.actualAmount),
            'ram:ReasonCode': value.reasonCode ? allowanceChargeReasonCodeConverter.toXML(value.reasonCode) : undefined,
            'ram:Reason': value.reason ? this.textTypeConverter.toXML(value.reason) : undefined,
            'ram:CategoryTradeTax': value.categoryTradeTax
                ? {
                      'ram:TypeCode': value.categoryTradeTax.typeCode
                          ? this.taxTypeCodeConverter.toXML(value.categoryTradeTax.typeCode)
                          : undefined,
                      'ram:CategoryCode': value.categoryTradeTax.categoryCode
                          ? this.taxCategoryCodeConverter.toXML(value.categoryTradeTax.categoryCode)
                          : undefined,
                      'ram:RateApplicablePercent':
                          value.categoryTradeTax.rateApplicablePercent != undefined
                              ? this.percentTypeConverter.toXML(value.categoryTradeTax.rateApplicablePercent)
                              : undefined
                  }
                : undefined
        }
    }

    public static basicDocumentLevel(): TradeAllowanceChargeTypeConverter<
        BasicDocumentLevelTradeAllowanceChargeType,
        BasicDocumentLevelTradeAllowanceChargeTypeXml
    > {
        return new TradeAllowanceChargeTypeConverter(
            ZBasicDocumentLevelTradeAllowanceChargeType,
            ZBasicDocumentLevelTradeAllowanceChargeTypeXml
        )
    }

    public static basicItemLevel(): TradeAllowanceChargeTypeConverter<
        BasicLineLevelTradeAllowanceChargeType,
        BasicLineLevelTradeAllowanceChargeTypeXml
    > {
        return new TradeAllowanceChargeTypeConverter(
            ZBasicLineLevelTradeAllowanceChargeType,
            ZBasicLineLevelTradeAllowanceChargeTypeXml
        )
    }

    public static basicPriceAllowanceLevel(): TradeAllowanceChargeTypeConverter<
        BasicPriceAllowanceType,
        BasicPriceAllowanceTypeXml
    > {
        return new TradeAllowanceChargeTypeConverter(ZBasicPriceAllowanceType, ZBasicPriceAllowanceTypeXml)
    }
}
