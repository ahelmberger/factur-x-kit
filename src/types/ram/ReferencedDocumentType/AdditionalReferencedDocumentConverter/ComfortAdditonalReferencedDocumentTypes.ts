import { z } from 'zod';

import { REFERENCED_DOCUMENT_TYPE_CODES } from '../../../codes';
import { ZIdType, ZIdTypeXml } from '../../../udt/IdTypeConverter';
import { ZReferencedDocumentType, ZReferencedDocumentTypeXml } from '../ReferencedDocumentTypes';

export const ZReferencedDocumentType_comfort_additionalSupportingDocuments = ZReferencedDocumentType.pick({
    documentId: true,
    uriid: true,
    name: true,
    attachmentBinaryObject: true
}).extend({
    documentId: ZIdType
});

export type ReferencedDocumentType_comfort_additionalSupportingDocuments = z.infer<
    typeof ZReferencedDocumentType_comfort_additionalSupportingDocuments
>;

export const ZReferencedDocumentType_comfort_additionalSupportingDocuments_forConverter =
    ZReferencedDocumentType_comfort_additionalSupportingDocuments.extend({
        typeCode: z.literal(REFERENCED_DOCUMENT_TYPE_CODES.Reference_paper)
    });

export type ReferencedDocumentType_comfort_additionalSupportingDocuments_forConverter = z.infer<
    typeof ZReferencedDocumentType_comfort_additionalSupportingDocuments_forConverter
>;

export const ZReferencedDocumentTypeXml_comfort_additionalSupportingDocuments = ZReferencedDocumentTypeXml.pick({
    'ram:IssuerAssignedID': true,
    'ram:URIID': true,
    'ram:TypeCode': true,
    'ram:Name': true,
    'ram:AttachmentBinaryObject': true
}).extend({
    'ram:IssuerAssignedID': ZIdTypeXml,
    'ram:TypeCode': z.object({
        '#text': z.literal(REFERENCED_DOCUMENT_TYPE_CODES.Reference_paper)
    })
});

export type ReferencedDocumentTypeXml_comfort_additionalSupportingDocuments = z.infer<
    typeof ZReferencedDocumentTypeXml_comfort_additionalSupportingDocuments
>;

export const ZReferencedDocumentType_comfort_tenderOrLotReference = ZReferencedDocumentType.pick({
    documentId: true
}).extend({
    documentId: ZIdType
});

export type ReferencedDocumentType_comfort_tenderOrLotReference = z.infer<
    typeof ZReferencedDocumentType_comfort_tenderOrLotReference
>;

export const ZReferencedDocumentType_comfort_tenderOrLotReference_forConverter =
    ZReferencedDocumentType_comfort_tenderOrLotReference.extend({
        typeCode: z.literal(REFERENCED_DOCUMENT_TYPE_CODES.Validated_priced_tender)
    });

export type ReferencedDocumentType_comfort_tenderOrLotReference_forConverter = z.infer<
    typeof ZReferencedDocumentType_comfort_tenderOrLotReference_forConverter
>;

export const ZReferencedDocumentTypeXml_comfort_tenderOrLotReference = ZReferencedDocumentTypeXml.pick({
    'ram:IssuerAssignedID': true,
    'ram:TypeCode': true
}).extend({
    'ram:IssuerAssignedID': ZIdTypeXml,
    'ram:TypeCode': z.object({
        '#text': z.literal(REFERENCED_DOCUMENT_TYPE_CODES.Validated_priced_tender)
    })
});

export type ReferencedDocumentTypeXml_comfort_tenderOrLotReference = z.infer<
    typeof ZReferencedDocumentTypeXml_comfort_tenderOrLotReference
>;

export const ZReferencedDocumentType_comfort_invoicedObjectIdentifier = ZReferencedDocumentType.pick({
    documentId: true,
    referenceTypeCode: true
}).extend({
    documentId: ZIdType
});

export type ReferencedDocumentType_comfort_invoicedObjectIdentifier = z.infer<
    typeof ZReferencedDocumentType_comfort_invoicedObjectIdentifier
>;

export const ZReferencedDocumentType_comfort_invoicedObjectIdentifier_forConverter =
    ZReferencedDocumentType_comfort_invoicedObjectIdentifier.extend({
        typeCode: z.literal(REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet)
    });

export type ReferencedDocumentType_comfort_invoicedObjectIdentifier_forConverter = z.infer<
    typeof ZReferencedDocumentType_comfort_invoicedObjectIdentifier_forConverter
>;

export const ZReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier = ZReferencedDocumentTypeXml.pick({
    'ram:IssuerAssignedID': true,
    'ram:TypeCode': true,
    'ram:ReferenceTypeCode': true
}).extend({
    'ram:IssuerAssignedID': ZIdTypeXml,
    'ram:TypeCode': z.object({
        '#text': z.literal(REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet)
    })
});

export type ReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier = z.infer<
    typeof ZReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier
>;

export const ZAdditionalReferencedDocumentTypeXml_comfort_basis = z.union([
    ZReferencedDocumentTypeXml_comfort_additionalSupportingDocuments,
    ZReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier,
    ZReferencedDocumentTypeXml_comfort_tenderOrLotReference
]);

export const ZAdditionalReferencedDocumentTypeXml_comfort = z.union([
    ZAdditionalReferencedDocumentTypeXml_comfort_basis,
    ZAdditionalReferencedDocumentTypeXml_comfort_basis.array()
]);
export type AdditionalReferencedDocumentTypeXml_comfort = z.infer<typeof ZAdditionalReferencedDocumentTypeXml_comfort>;

export const ZAdditionalReferencedDocumentType_comfort = z.object({
    invoiceSupportingDocuments: ZReferencedDocumentType_comfort_additionalSupportingDocuments.array()
        .optional()
        .describe('BG-24'),
    tenderOrLotReferenceDetails: ZReferencedDocumentType_comfort_tenderOrLotReference.array()
        .optional()
        .describe('BT-17-00'),
    invoiceItemDetails: ZReferencedDocumentType_comfort_invoicedObjectIdentifier.array().optional().describe('BT-18-00')
});

export type AdditionalReferencedDocumentType_comfort = z.infer<typeof ZAdditionalReferencedDocumentType_comfort>;
