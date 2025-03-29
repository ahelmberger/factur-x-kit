import { CodeTypeConverter } from '../../CodeTypeConverter'
import { ExtendableBaseTypeConverter } from '../../ExtendableBaseTypeConverter'
import { EXEMPTION_REASON_CODES, TAX_CATEGORY_CODES, TAX_TYPE_CODE, TIME_REFERENCE_CODES } from '../../codes'
import { AmountTypeConverter } from '../../udt/AmountTypeConverter'
import { PercentTypeConverter } from '../../udt/PercentTypeConverter'
import { TextTypeConverter } from '../../udt/TextTypeConverter'
import {
    BasicDocumentLevelTradeTaxType,
    BasicDocumentLevelTradeTaxTypeXml,
    ZBasicDocumentLevelTradeTaxType,
    ZBasicDocumentLevelTradeTaxTypeXml
} from './BasicDocumentLevelTradeTaxType'

export type allowedValueTypes_TradeTax = BasicDocumentLevelTradeTaxType
export type allowedXmlTypes_TradeTax = BasicDocumentLevelTradeTaxTypeXml

export class TradeTaxTypeConverter<
    ValueType extends allowedValueTypes_TradeTax,
    XmlType extends BasicDocumentLevelTradeTaxTypeXml
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    amountTypeConverter = new AmountTypeConverter()
    textTypeConverter = new TextTypeConverter()

    taxTypeCodeConverter = new CodeTypeConverter(TAX_TYPE_CODE)
    taxCategoryCodeConverter = new CodeTypeConverter(TAX_CATEGORY_CODES)
    exemptionReasonCodeConverter = new CodeTypeConverter(EXEMPTION_REASON_CODES)
    timeReferenceCodeConvereter = new CodeTypeConverter(TIME_REFERENCE_CODES)

    percentTypeConverter = new PercentTypeConverter()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            calculatedAmount:
                xml['ram:CalculatedAmount'] != null
                    ? this.amountTypeConverter.toValue(xml['ram:CalculatedAmount'])
                    : undefined,
            typeCode: xml['ram:TypeCode'] != null ? this.taxTypeCodeConverter.toValue(xml['ram:TypeCode']) : undefined,
            exemptionReason:
                xml['ram:ExemptionReason'] != null
                    ? this.textTypeConverter.toValue(xml['ram:ExemptionReason'])
                    : undefined,
            basisAmount:
                xml['ram:BasisAmount'] != null ? this.amountTypeConverter.toValue(xml['ram:BasisAmount']) : undefined,
            categoryCode:
                xml['ram:CategoryCode'] != null
                    ? this.taxCategoryCodeConverter.toValue(xml['ram:CategoryCode'])
                    : undefined,
            exemptionReasonCode:
                xml['ram:ExemptionReasonCode'] != null
                    ? this.exemptionReasonCodeConverter.toValue(xml['ram:ExemptionReasonCode'])
                    : undefined,
            dueDateTypeCode:
                xml['ram:DueDateTypeCode'] != null
                    ? this.timeReferenceCodeConvereter.toValue(xml['ram:DueDateTypeCode'])
                    : undefined,
            rateApplicablePercent:
                xml['ram:RateApplicablePercent'] != null
                    ? this.percentTypeConverter.toValue(xml['ram:RateApplicablePercent'])
                    : undefined
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:CalculatedAmount':
                value.calculatedAmount != null ? this.amountTypeConverter.toXML(value.calculatedAmount) : undefined,
            'ram:TypeCode': value.typeCode != null ? this.taxTypeCodeConverter.toXML(value.typeCode) : undefined,
            'ram:ExemptionReason':
                value.exemptionReason != null ? this.textTypeConverter.toXML(value.exemptionReason) : undefined,
            'ram:BasisAmount':
                value.basisAmount != null ? this.amountTypeConverter.toXML(value.basisAmount) : undefined,
            'ram:CategoryCode':
                value.categoryCode != null ? this.taxCategoryCodeConverter.toXML(value.categoryCode) : undefined,
            'ram:ExemptionReasonCode':
                value.exemptionReasonCode != null
                    ? this.exemptionReasonCodeConverter.toXML(value.exemptionReasonCode)
                    : undefined,
            'ram:DueDateTypeCode':
                value.dueDateTypeCode != null
                    ? this.timeReferenceCodeConvereter.toXML(value.dueDateTypeCode)
                    : undefined,
            'ram:RateApplicablePercent':
                value.rateApplicablePercent != null
                    ? this.percentTypeConverter.toXML(value.rateApplicablePercent)
                    : undefined
        }
    }

    public static basicDocumentLevel() {
        return new TradeTaxTypeConverter<BasicDocumentLevelTradeTaxType, BasicDocumentLevelTradeTaxTypeXml>(
            ZBasicDocumentLevelTradeTaxType,
            ZBasicDocumentLevelTradeTaxTypeXml
        )
    }
}
