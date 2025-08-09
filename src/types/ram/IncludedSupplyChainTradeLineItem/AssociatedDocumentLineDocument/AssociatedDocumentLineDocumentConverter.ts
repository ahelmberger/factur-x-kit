import { z } from 'zod';

import { ExtendableBaseTypeConverter } from '../../../ExtendableBaseTypeConverter';
import { IdTypeConverter } from '../../../udt/IdTypeConverter';
import {
    NoteTypeConverter,
    allowedValueTypes_NoteTypeConverter,
    allowedXmlTypes_NoteTypeConverter
} from '../../NoteType/NoteTypeConverter';
import {
    BasicAssociatedDocumentLineDocumentType,
    BasicAssociatedDocumentLineDocumentTypeXml,
    ZBasicAssociatedDocumentLineDocumentType,
    ZBasicAssociatedDocumentLineDocumentTypeXml
} from './BasicAssociatedDocumentLineDocumentType';

export type allowedValueTypes_AssociatedDocumentLineDocumentConverter = BasicAssociatedDocumentLineDocumentType;
export type allowedXmlTypes_AssociatedDocumentLineDocumentConverter = BasicAssociatedDocumentLineDocumentTypeXml;

export class AssociatedDocumentLineDocumentConverter<
    ValueType extends allowedValueTypes_AssociatedDocumentLineDocumentConverter,
    XmlType extends allowedXmlTypes_AssociatedDocumentLineDocumentConverter
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    idTypeConverter = new IdTypeConverter();
    noteTypeConverter: NoteTypeConverter<allowedValueTypes_NoteTypeConverter, allowedXmlTypes_NoteTypeConverter>;

    constructor(
        associatedDocumentLineDocumentType: z.ZodType<ValueType>,
        associatedDocumentLineDocumentTypeXml: z.ZodType<XmlType>,
        noteTypeConverter: NoteTypeConverter<allowedValueTypes_NoteTypeConverter, allowedXmlTypes_NoteTypeConverter>
    ) {
        super(associatedDocumentLineDocumentType, associatedDocumentLineDocumentTypeXml);
        this.noteTypeConverter = noteTypeConverter;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            lineId: xml['ram:LineID'] != null ? this.idTypeConverter.toValue(xml['ram:LineID']) : undefined,
            lineNote:
                xml['ram:IncludedNote'] != null ? this.noteTypeConverter.toValue(xml['ram:IncludedNote']) : undefined
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:LineID': value.lineId != null ? this.idTypeConverter.toXML(value.lineId) : undefined,
            'ram:IncludedNote': value.lineNote != null ? this.noteTypeConverter.toXML(value.lineNote) : undefined
        };
    }

    public static basic() {
        return new AssociatedDocumentLineDocumentConverter<
            BasicAssociatedDocumentLineDocumentType,
            BasicAssociatedDocumentLineDocumentTypeXml
        >(
            ZBasicAssociatedDocumentLineDocumentType,
            ZBasicAssociatedDocumentLineDocumentTypeXml,
            NoteTypeConverter.basicLineLevel()
        );
    }
}
