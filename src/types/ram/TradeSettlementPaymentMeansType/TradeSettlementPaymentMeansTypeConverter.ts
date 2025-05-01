import { CodeTypeConverter } from '../../CodeTypeConverter'
import { ExtendableBaseTypeConverter } from '../../ExtendableBaseTypeConverter'
import { PAYMENT_MEANS_CODES } from '../../codes'
import { TextTypeConverter } from '../../udt/TextTypeConverter'
import { TokenTypeConverter } from '../../xs/TokenConverter'
import {
    BasicPaymentMeansType,
    BasicPaymentMeansTypeXml,
    ZBasicPaymentMeansType,
    ZBasicPaymentMeansTypeXml
} from './BasicTradeSettlementPaymentMeansType'
import {
    ComfortPaymentMeansType,
    ComfortPaymentMeansTypeXml,
    ZComfortPaymentMeansType,
    ZComfortPaymentMeansTypeXml
} from './ComfortTradeSettlementPaymentMeansType'

export type allowedValueTypes_TradeSettlementPaymentMeansType = BasicPaymentMeansType | ComfortPaymentMeansType
export type allowedXmlTypes_TradeSettlementPaymentMeansType = BasicPaymentMeansTypeXml | ComfortPaymentMeansTypeXml

export class TradeSettlementPaymentMeansTypeConverter<
    ValueType extends allowedValueTypes_TradeSettlementPaymentMeansType,
    XmlType extends allowedXmlTypes_TradeSettlementPaymentMeansType
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    private tokenTypeConverter = new TokenTypeConverter()
    private paymentMeansCodeTypeConverter = new CodeTypeConverter(PAYMENT_MEANS_CODES)
    private textTypeConverter = new TextTypeConverter()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            paymentType: xml['ram:TypeCode']
                ? this.paymentMeansCodeTypeConverter.toValue(xml['ram:TypeCode'])
                : undefined,
            description: xml['ram:Information'] ? this.textTypeConverter.toValue(xml['ram:Information']) : undefined,
            financialCard: xml['ram:ApplicableTradeSettlementFinancialCard']
                ? {
                      finalDigitsOfCard: xml['ram:ApplicableTradeSettlementFinancialCard']['ram:ID']
                          ? this.tokenTypeConverter.toValue(xml['ram:ApplicableTradeSettlementFinancialCard']['ram:ID'])
                          : undefined,
                      cardholderName: xml['ram:ApplicableTradeSettlementFinancialCard']['ram:CardholderName']
                          ? this.textTypeConverter.toValue(
                                xml['ram:ApplicableTradeSettlementFinancialCard']['ram:CardholderName']
                            )
                          : undefined
                  }
                : undefined,
            payerBankAccount: xml['ram:PayerPartyDebtorFinancialAccount']
                ? {
                      iban: xml['ram:PayerPartyDebtorFinancialAccount']?.['ram:IBANID']
                          ? this.tokenTypeConverter.toValue(xml['ram:PayerPartyDebtorFinancialAccount']?.['ram:IBANID'])
                          : undefined
                  }
                : undefined,
            payeeBankAccount: xml['ram:PayeePartyCreditorFinancialAccount']
                ? {
                      iban: xml['ram:PayeePartyCreditorFinancialAccount']?.['ram:IBANID']
                          ? this.tokenTypeConverter.toValue(
                                xml['ram:PayeePartyCreditorFinancialAccount']?.['ram:IBANID']
                            )
                          : undefined,
                      propriataryId: xml['ram:PayeePartyCreditorFinancialAccount']?.['ram:ProprietaryID']
                          ? this.tokenTypeConverter.toValue(
                                xml['ram:PayeePartyCreditorFinancialAccount']?.['ram:ProprietaryID']
                            )
                          : undefined,
                      accountName: xml['ram:PayeePartyCreditorFinancialAccount']['ram:AccountName']
                          ? this.textTypeConverter.toValue(
                                xml['ram:PayeePartyCreditorFinancialAccount']['ram:AccountName']
                            )
                          : undefined,
                      bic: xml['ram:PayeeSpecifiedCreditorFinancialInstitution']?.['ram:BICID']
                          ? this.tokenTypeConverter.toValue(
                                xml['ram:PayeeSpecifiedCreditorFinancialInstitution']['ram:BICID']
                            )
                          : undefined
                  }
                : undefined
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:TypeCode':
                value.paymentType != null ? this.paymentMeansCodeTypeConverter.toXML(value.paymentType) : undefined,
            'ram:Information': value.description != null ? this.textTypeConverter.toXML(value.description) : undefined,
            'ram:ApplicableTradeSettlementFinancialCard': value.financialCard
                ? {
                      'ram:ID':
                          value.financialCard.finalDigitsOfCard != null
                              ? this.tokenTypeConverter.toXML(value.financialCard.finalDigitsOfCard)
                              : undefined,
                      'ram:CardholderName':
                          value.financialCard.cardholderName != null
                              ? this.textTypeConverter.toXML(value.financialCard.cardholderName)
                              : undefined
                  }
                : undefined,
            'ram:PayerPartyDebtorFinancialAccount': value.payerBankAccount
                ? {
                      'ram:IBANID':
                          value.payerBankAccount.iban != null
                              ? this.tokenTypeConverter.toXML(value.payerBankAccount.iban)
                              : undefined
                  }
                : undefined,
            'ram:PayeePartyCreditorFinancialAccount': value.payeeBankAccount
                ? {
                      'ram:IBANID':
                          value.payerBankAccount.iban != null
                              ? this.tokenTypeConverter.toXML(value.payeeBankAccount.iban)
                              : undefined,
                      'ram:AccountName':
                          value.payeeBankAccount.accountName != null
                              ? this.textTypeConverter.toXML(value.payeeBankAccount.accountName)
                              : undefined,
                      'ram:ProprietaryID':
                          value.payeeBankAccount.propriataryId != null
                              ? this.tokenTypeConverter.toXML(value.payeeBankAccount.propriataryId)
                              : undefined
                  }
                : undefined,
            'ram:PayeeSpecifiedCreditorFinancialInstitution':
                value.payeeBankAccount?.bic != null
                    ? {
                          'ram:BICID':
                              value.payeeBankAccount.bic != null
                                  ? this.tokenTypeConverter.toXML(value.payeeBankAccount.bic)
                                  : undefined
                      }
                    : undefined
        }
    }

    public static basic() {
        return new TradeSettlementPaymentMeansTypeConverter<BasicPaymentMeansType, BasicPaymentMeansTypeXml>(
            ZBasicPaymentMeansType,
            ZBasicPaymentMeansTypeXml
        )
    }

    public static comfort() {
        return new TradeSettlementPaymentMeansTypeConverter<ComfortPaymentMeansType, ComfortPaymentMeansTypeXml>(
            ZComfortPaymentMeansType,
            ZComfortPaymentMeansTypeXml
        )
    }
}
/*{
    _toValue(xml: BasicTradeSettlementPaymentMeansTypeXml) {
        const { success: success_xml } = ZBasicTradeSettlementPaymentMeansTypeXml.safeParse(xml)
        if (!success_xml) {
            throw new TypeConverterError('INVALID_XML')
        }

        const value = {
            paymentType: xml['ram:TypeCode']?.['#text'],
            payerIBAN: xml['ram:PayerPartyDebtorFinancialAccount']?.['ram:IBANID'],
            payeeIBAN: xml['ram:PayeePartyCreditorFinancialAccount']?.['ram:IBANID'],
            payeeProprietaryID: xml['ram:PayeePartyCreditorFinancialAccount']?.['ram:ProprietaryID']
        }

        const { success: success_value, data } = ZBasicPaymentMeansType.safeParse(value)

        if (!success_value) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        return data
    }

    _toXML(value: BasicPaymentMeansType): BasicTradeSettlementPaymentMeansTypeXml {
        const { success, data } = ZBasicPaymentMeansType.safeParse(value)

        if (!success) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        const xml: BasicTradeSettlementPaymentMeansTypeXml = {
            'ram:TypeCode': {
                '#text': data.paymentType
            },
            'ram:PayerPartyDebtorFinancialAccount': data.payerIBAN
                ? {
                      'ram:IBANID': {
                          '#text': data.payerIBAN
                      }
                  }
                : undefined,
            'ram:PayeePartyCreditorFinancialAccount': {
                'ram:IBANID': data.payeeIBAN
                    ? {
                          '#text': data.payeeIBAN
                      }
                    : undefined,
                'ram:ProprietaryID': data.payeeProprietaryID
                    ? {
                          '#text': data.payeeProprietaryID
                      }
                    : undefined
            }
        }
        return xml
    }
}
    */
