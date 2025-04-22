import { z } from 'zod'

import { CodeTypeConverter, ZCodeType } from '../CodeTypeConverter'
import { ExtendableBaseTypeConverter } from '../ExtendableBaseTypeConverter'
import { UNTDID_1153 } from '../codes'
import { DateTimeTypeConverter_qdt, ZDateTimeTypeXml_qdt } from '../qdt/DateTimeTypeConverter'
import { BinaryObjectTypeConverter, ZBinaryObjectType, ZBinaryObjectTypeXml } from '../udt/BinaryObjectTypeConverter'
import { ZDateTimeType } from '../udt/DateTimeTypeConverter'
import { ZIdType, ZIdTypeXml } from '../udt/IdTypeConverter'
import { TextTypeConverter, ZTextType, ZTextTypeXml } from '../udt/TextTypeConverter'
import { TokenTypeConverter } from '../xs/TokenConverter'

const ZReferencedDocumentType = z.object({
    documentId: ZIdType.optional(),
    uriid: ZIdType.optional(),
    lineId: ZIdType.optional(),
    //--> TODO: Delete typecode and replace by default
    typeCode: ZIdType.optional(),
    name: ZTextType.optional(),
    attachmentBinaryObject: ZBinaryObjectType.optional(),
    referenceTypeCode: ZCodeType(UNTDID_1153).optional(),
    issueDate: ZDateTimeType.optional()
})

const ZReferencedDocumentTypeXml = z.object({
    'ram:IssuerAssignedID': ZIdTypeXml.optional(),
    'ram:URIID': ZIdTypeXml.optional(),
    'ram:LineID': ZIdTypeXml.optional(),
    'ram:TypeCode': ZIdTypeXml.optional(),
    'ram:Name': ZTextTypeXml.optional(),
    'ram:AttachmentBinaryObject': ZBinaryObjectTypeXml.optional(),
    'ram:ReferenceTypeCode': ZIdTypeXml.optional(),
    'ram:FormattedIssueDateTime': ZDateTimeTypeXml_qdt.optional()
})

export const ZReferencedDocumentType_docId_issueDate = ZReferencedDocumentType.pick({
    documentId: true,
    issueDate: true
})

export type ReferencedDocumentType_docId_issueDate = z.infer<typeof ZReferencedDocumentType_docId_issueDate>

export const ZReferencedDocumentTypeXml_docId_issueDate = ZReferencedDocumentTypeXml.pick({
    'ram:IssuerAssignedID': true,
    'ram:FormattedIssueDateTime': true
})

export type ReferencedDocumentTypeXml_docId_issueDate = z.infer<typeof ZReferencedDocumentTypeXml_docId_issueDate>

export const ZReferencedDocumentType_lineId = ZReferencedDocumentType.pick({
    lineId: true
})

export type ReferencedDocumentType_lineId = z.infer<typeof ZReferencedDocumentType_lineId>

export const ZReferencedDocumentTypeXml_lineId = ZReferencedDocumentTypeXml.pick({
    'ram:LineID': true
})

export type ReferencedDocumentTypeXml_lineId = z.infer<typeof ZReferencedDocumentTypeXml_lineId>

export const ZReferencedDocumentType_documentId = ZReferencedDocumentType.pick({
    documentId: true
})

export type ReferencedDocumentType_documentId = z.infer<typeof ZReferencedDocumentType_documentId>

export const ZReferencedDocumentTypeXml_documentId = ZReferencedDocumentTypeXml.pick({
    'ram:IssuerAssignedID': true
})

export type ReferencedDocumentTypeXml_documentId = z.infer<typeof ZReferencedDocumentTypeXml_documentId>

export const ZReferencedDocumentType_issuerId_type_referenceType = ZReferencedDocumentType.pick({
    documentId: true,
    typeCode: true,
    referenceTypeCode: true
})

export type ReferencedDocumentType_issuerId_type_referenceType = z.infer<
    typeof ZReferencedDocumentType_issuerId_type_referenceType
>

export const ZReferencedDocumentTypeXml_issuerId_type_referenceType = ZReferencedDocumentTypeXml.pick({
    'ram:IssuerAssignedID': true,
    'ram:TypeCode': true,
    'ram:ReferenceTypeCode': true
})

export type ReferencedDocumentTypeXml_issuerId_type_referenceType = z.infer<
    typeof ZReferencedDocumentTypeXml_issuerId_type_referenceType
>

export type allowedValueTypes_ReferencedDocumentType =
    | ReferencedDocumentType_docId_issueDate
    | ReferencedDocumentType_lineId
export type allowedXmlTypes_ReferencedDocumentType =
    | ReferencedDocumentTypeXml_docId_issueDate
    | ReferencedDocumentTypeXml_lineId

export class ReferencedDocumentTypeConverter<
    ValueType extends allowedValueTypes_ReferencedDocumentType,
    XmlType extends allowedXmlTypes_ReferencedDocumentType
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    idTypeConverter = new TokenTypeConverter()
    dateTimeTypeConverter = new DateTimeTypeConverter_qdt()
    textTypeConverter = new TextTypeConverter()
    binaryObjectTypeConverter = new BinaryObjectTypeConverter()
    referenceTypeCodeTypeConverter = new CodeTypeConverter(UNTDID_1153)

    constructor(valueSchema?: z.ZodType<ValueType>, xmlSchema?: z.ZodType<XmlType>) {
        if (!valueSchema) {
            valueSchema = ZReferencedDocumentType_docId_issueDate as unknown as z.ZodType<
                ValueType,
                z.ZodTypeDef,
                ValueType
            >
        }
        if (!xmlSchema) {
            xmlSchema = ZReferencedDocumentTypeXml_docId_issueDate as unknown as z.ZodType<
                XmlType,
                z.ZodTypeDef,
                XmlType
            >
        }
        super(
            valueSchema ?? ZReferencedDocumentType_docId_issueDate,
            xmlSchema ?? ZReferencedDocumentTypeXml_docId_issueDate
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            documentId:
                xml['ram:IssuerAssignedID'] != null
                    ? this.idTypeConverter.toValue(xml['ram:IssuerAssignedID'])
                    : undefined,
            uriid: xml['ram:'] != null ? this.idTypeConverter.toValue(xml['ram:']) : undefined,
            lineId: xml['ram:LineID'] != null ? this.idTypeConverter.toValue(xml['ram:LineID']) : undefined,
            typeCode: xml['ram:TypeCode'] != null ? this.idTypeConverter.toValue(xml['ram:TypeCode']) : undefined,
            name: xml['ram:Name'] != null ? this.textTypeConverter.toValue(xml['ram:Name']) : undefined,
            attachmentBinaryObject:
                xml['ram:AttachmentBinaryObject'] != null
                    ? this.binaryObjectTypeConverter.toValue(xml['ram:AttachmentBinaryObject'])
                    : undefined,
            referenceTypeCode:
                xml['ram:ReferenceTypeCode'] != null
                    ? this.referenceTypeCodeTypeConverter.toValue(xml['ram:ReferenceTypeCode'])
                    : undefined,
            issueDate:
                xml['ram:FormattedIssueDateTime'] != null
                    ? this.dateTimeTypeConverter.toValue(xml['ram:FormattedIssueDateTime'])
                    : undefined
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:IssuerAssignedID': value.documentId != null ? this.idTypeConverter.toXML(value.documentId) : undefined,
            'ram:URIID': value.uriid != null ? this.idTypeConverter.toXML(value.uriid) : undefined,
            'ram:LineID': value.lineId != null ? this.idTypeConverter.toXML(value.lineId) : undefined,
            'ram:TypeCode': value.typeCode != null ? this.idTypeConverter.toXML(value.typeCode) : undefined,
            'ram:Name': value.name != null ? this.textTypeConverter.toXML(value.name) : undefined,
            'ram:AttachmentBinaryObject':
                value.attachmentBinaryObject != null
                    ? this.binaryObjectTypeConverter.toXML(value.attachmentBinaryObject)
                    : undefined,
            'ram:ReferenceTypeCode':
                value.referenceTypeCode != null
                    ? this.referenceTypeCodeTypeConverter.toXML(value.referenceTypeCode)
                    : undefined,
            'ram:FormattedIssueDateTime':
                value.issueDate != null ? this.dateTimeTypeConverter.toXML(value.issueDate) : undefined
        }
    }

    public static docId_issueDate() {
        return new ReferencedDocumentTypeConverter<
            ReferencedDocumentType_docId_issueDate,
            ReferencedDocumentTypeXml_docId_issueDate
        >(ZReferencedDocumentType_docId_issueDate, ZReferencedDocumentTypeXml_docId_issueDate)
    }

    public static lineId() {
        return new ReferencedDocumentTypeConverter<ReferencedDocumentType_lineId, ReferencedDocumentTypeXml_lineId>(
            ZReferencedDocumentType_lineId,
            ZReferencedDocumentTypeXml_lineId
        )
    }

    public static issuerId_type_referenceType() {
        return new ReferencedDocumentTypeConverter<
            ReferencedDocumentType_issuerId_type_referenceType,
            ReferencedDocumentTypeXml_issuerId_type_referenceType
        >(ZReferencedDocumentType_issuerId_type_referenceType, ZReferencedDocumentTypeXml_issuerId_type_referenceType)
    }

    public static documentId() {
        return new ReferencedDocumentTypeConverter<
            ReferencedDocumentType_documentId,
            ReferencedDocumentTypeXml_documentId
        >(ZReferencedDocumentType_documentId, ZReferencedDocumentTypeXml_documentId)
    }
}
