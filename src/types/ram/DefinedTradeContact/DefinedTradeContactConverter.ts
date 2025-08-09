import { ExtendableBaseTypeConverter } from '../../ExtendableBaseTypeConverter';
import { TextTypeConverter } from '../../udt/TextTypeConverter';
import { TokenTypeConverter } from '../../xs/TokenConverter';
import {
    ComfortTradeContactType,
    ComfortTradeContactTypeXml,
    ZComfortTradeContactType,
    ZComfortTradeContactTypeXml
} from './ComfortTradeContactType';
import {
    ExtendedTradeContactType,
    ExtendedTradeContactTypeXml,
    ZExtendedTradeContactType,
    ZExtendedTradeContactTypeXml
} from './ExtendedTradeContactType';

export type allowedValueTypes_DefinedTradeContactConverter = ComfortTradeContactType | ExtendedTradeContactType;
export type allowedXmlTypes_DefinedTradeContactConverter = ComfortTradeContactTypeXml | ExtendedTradeContactType;

export class DefinedTradeContactConverter<
    ValueType extends allowedValueTypes_DefinedTradeContactConverter,
    XmlType extends allowedXmlTypes_DefinedTradeContactConverter
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    textTypeConverter = new TextTypeConverter();
    tokenTypeConverter = new TokenTypeConverter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            personName:
                xml['ram:PersonName'] != null ? this.textTypeConverter.toValue(xml['ram:PersonName']) : undefined,
            departmentName:
                xml['ram:DepartmentName'] != null
                    ? this.textTypeConverter.toValue(xml['ram:DepartmentName'])
                    : undefined,
            typeCode: xml['ram:TypeCode'] != null ? this.tokenTypeConverter.toValue(xml['ram:TypeCode']) : undefined,
            telephoneNumber:
                xml['ram:TelephoneUniversalCommunication']?.['ram:CompleteNumber'] != null
                    ? this.textTypeConverter.toValue(xml['ram:TelephoneUniversalCommunication']['ram:CompleteNumber'])
                    : undefined,
            faxNumber:
                xml['ram:FaxUniversalCommunication']?.['ram:CompleteNumber'] != null
                    ? this.textTypeConverter.toValue(xml['ram:FaxUniversalCommunication']['ram:CompleteNumber'])
                    : undefined,
            email:
                xml['ram:EmailURIUniversalCommunication']?.['ram:URIID'] != null
                    ? this.textTypeConverter.toValue(xml['ram:EmailURIUniversalCommunication']['ram:URIID'])
                    : undefined
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:PersonName': value.personName != null ? this.textTypeConverter.toXML(value.personName) : undefined,
            'ram:DepartmentName':
                value.departmentName != null ? this.textTypeConverter.toXML(value.departmentName) : undefined,
            'ram:TypeCode': value.typeCode != null ? this.tokenTypeConverter.toXML(value.typeCode) : undefined,
            'ram:TelephoneUniversalCommunication':
                value.telephoneNumber != null
                    ? { 'ram:CompleteNumber': this.textTypeConverter.toXML(value.telephoneNumber) }
                    : undefined,
            'ram:FaxUniversalCommunication':
                value.faxNumber != null
                    ? { 'ram:CompleteNumber': this.textTypeConverter.toXML(value.faxNumber) }
                    : undefined,
            'ram:EmailURIUniversalCommunication':
                value.email != null ? { 'ram:URIID': this.textTypeConverter.toXML(value.email) } : undefined
        };
    }

    public static comfort() {
        return new DefinedTradeContactConverter<ComfortTradeContactType, ComfortTradeContactTypeXml>(
            ZComfortTradeContactType,
            ZComfortTradeContactTypeXml
        );
    }

    public static extended() {
        return new DefinedTradeContactConverter<ExtendedTradeContactType, ExtendedTradeContactTypeXml>(
            ZExtendedTradeContactType,
            ZExtendedTradeContactTypeXml
        );
    }
}
