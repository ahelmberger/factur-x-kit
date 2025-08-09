import { CodeTypeConverter } from '../../CodeTypeConverter';
import { ExtendableBaseTypeConverter } from '../../ExtendableBaseTypeConverter';
import { SUBJECT_CODES } from '../../codes';
import { TextTypeConverter } from '../../udt/TextTypeConverter';
import {
    BasicDocumentLevelNoteType,
    BasicDocumentLevelNoteTypeXml,
    ZBasicDocumentLevelNoteType,
    ZBasicDocumentLevelNoteTypeXml
} from './BasicDocumentLevelNoteType';
import {
    BasicLineLevelNoteType,
    BasicLineLevelNoteTypeXml,
    ZBasicLineLevelNoteType,
    ZBasicLineLevelNoteTypeXml
} from './BasicLineLevelNoteType';

export type allowedValueTypes_NoteTypeConverter = BasicLineLevelNoteType | BasicDocumentLevelNoteType;
export type allowedXmlTypes_NoteTypeConverter = BasicLineLevelNoteTypeXml | BasicDocumentLevelNoteTypeXml;

export class NoteTypeConverter<
    ValueType extends allowedValueTypes_NoteTypeConverter,
    XmlType extends allowedXmlTypes_NoteTypeConverter
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    textTypeConverter = new TextTypeConverter();
    codeTypeConverter = new CodeTypeConverter(SUBJECT_CODES);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            content: xml['ram:Content'] != null ? this.textTypeConverter.toValue(xml['ram:Content']) : undefined,
            subject: xml['ram:SubjectCode'] != null ? this.codeTypeConverter.toValue(xml['ram:SubjectCode']) : undefined
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:Content': value.content != null ? this.textTypeConverter.toXML(value.content) : undefined,
            'ram:SubjectCode': value.subject != null ? this.codeTypeConverter.toXML(value.subject) : undefined
        };
    }

    public static basicDocumentLevel() {
        return new NoteTypeConverter<BasicDocumentLevelNoteType, BasicDocumentLevelNoteTypeXml>(
            ZBasicDocumentLevelNoteType,
            ZBasicDocumentLevelNoteTypeXml
        );
    }

    public static basicLineLevel() {
        return new NoteTypeConverter<BasicLineLevelNoteType, BasicLineLevelNoteTypeXml>(
            ZBasicLineLevelNoteType,
            ZBasicLineLevelNoteTypeXml
        );
    }
}
