import { z } from 'zod'

import { ZCodeType } from '../../CodeTypeConverter'
import { REFERENCED_DOCUMENT_TYPE_CODES, UNTDID_1153 } from '../../codes'
import { ZDateTimeTypeXml_qdt } from '../../qdt/DateTimeTypeConverter'
import { ZBinaryObjectType, ZBinaryObjectTypeXml } from '../../udt/BinaryObjectTypeConverter'
import { ZDateTimeType } from '../../udt/DateTimeTypeConverter'
import { ZIdType, ZIdTypeXml } from '../../udt/IdTypeConverter'
import { ZTextType, ZTextTypeXml } from '../../udt/TextTypeConverter'

export const ZReferencedDocumentType = z.object({
    documentId: ZIdType.optional(),
    uriid: ZIdType.optional(),
    lineId: ZIdType.optional(),
    typeCode: ZIdType.optional(),
    name: ZTextType.optional(),
    attachmentBinaryObject: ZBinaryObjectType.optional(),
    referenceTypeCode: ZCodeType(UNTDID_1153).optional(),
    issueDate: ZDateTimeType.optional()
})

export const ZReferencedDocumentTypeXml = z.object({
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

export const ZReferencedDocumentType_additionalDocument_lineLevel_comfort = ZReferencedDocumentType.pick({
    documentId: true,
    typeCode: true,
    referenceTypeCode: true
}).extend({
    documentId: ZIdType,
    typeCode: z.literal(REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet)
})

export type ReferencedDocumentType_additionalDocument_lineLevel_comfort = z.infer<
    typeof ZReferencedDocumentType_additionalDocument_lineLevel_comfort
>

export const ZReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort = ZReferencedDocumentTypeXml.pick({
    'ram:IssuerAssignedID': true,
    'ram:TypeCode': true,
    'ram:ReferenceTypeCode': true
}).extend({
    'ram:IssuerAssignedID': ZIdTypeXml,
    'ram:TypeCode': ZIdTypeXml
})

export type ReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort = z.infer<
    typeof ZReferencedDocumentTypeXml_additionalDocument_lineLevel_comfort
>
