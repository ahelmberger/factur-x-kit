import { z } from 'zod'

import { BaseTypeConverter, TypeConverterError } from '../../../BaseTypeConverter'
import { REFERENCED_DOCUMENT_TYPE_CODES } from '../../../codes'
import { ReferencedDocumentTypeConverter } from '../ReferencedDocumentConverter'
import {
    AdditionalReferencedDocumentTypeXml_comfort,
    AdditionalReferencedDocumentType_comfort,
    ReferencedDocumentTypeXml_comfort_additionalSupportingDocuments,
    ReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier,
    ReferencedDocumentTypeXml_comfort_tenderOrLotReference,
    ReferencedDocumentType_comfort_additionalSupportingDocuments_forConverter,
    ReferencedDocumentType_comfort_invoicedObjectIdentifier_forConverter,
    ReferencedDocumentType_comfort_tenderOrLotReference_forConverter,
    ZAdditionalReferencedDocumentTypeXml_comfort,
    ZAdditionalReferencedDocumentType_comfort,
    ZReferencedDocumentTypeXml_comfort_additionalSupportingDocuments,
    ZReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier,
    ZReferencedDocumentTypeXml_comfort_tenderOrLotReference,
    ZReferencedDocumentType_comfort_additionalSupportingDocuments_forConverter,
    ZReferencedDocumentType_comfort_invoicedObjectIdentifier_forConverter,
    ZReferencedDocumentType_comfort_tenderOrLotReference_forConverter
} from './ComfortAdditonalReferencedDocumentTypes'

export type allowedValueTypes_AdditionalReferencedDocumentType = AdditionalReferencedDocumentType_comfort
export type allowedXmlTypes_AdditionalReferencedDocumentType = AdditionalReferencedDocumentTypeXml_comfort

type TenderOrLotConverterTypes = ReferencedDocumentType_comfort_tenderOrLotReference_forConverter
type TenderOrLotConverterTypesXml = ReferencedDocumentTypeXml_comfort_tenderOrLotReference
type AdditionalSupportingDocumentsTypeConverter =
    ReferencedDocumentType_comfort_additionalSupportingDocuments_forConverter
type AdditionalSupportingDocumentsTypeConverterXml = ReferencedDocumentTypeXml_comfort_additionalSupportingDocuments
type InvoicedObjectIdentifierTypeConverter = ReferencedDocumentType_comfort_invoicedObjectIdentifier_forConverter
type InvoicedObjectIdentifierTypeConverterXml = ReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier

export class AdditionalReferencedDocumentConverter<
    ValueType extends allowedValueTypes_AdditionalReferencedDocumentType,
    XmlType extends allowedXmlTypes_AdditionalReferencedDocumentType
> extends BaseTypeConverter<ValueType, XmlType> {
    private valueSchema: z.ZodType<ValueType>
    private xmlSchema: z.ZodType<XmlType>

    private tenderOrLotTypeConverter: ReferencedDocumentTypeConverter<
        TenderOrLotConverterTypes,
        TenderOrLotConverterTypesXml
    >

    private additionalSupportingDocumentsTypeConverter: ReferencedDocumentTypeConverter<
        AdditionalSupportingDocumentsTypeConverter,
        AdditionalSupportingDocumentsTypeConverterXml
    >

    private invoicedObjectIdentifierTypeConverter: ReferencedDocumentTypeConverter<
        InvoicedObjectIdentifierTypeConverter,
        InvoicedObjectIdentifierTypeConverterXml
    >

    constructor(
        valueSchema: z.ZodType<ValueType>,
        xmlSchema: z.ZodType<XmlType>,
        additionalSupportingDocumentsTypeConverter: ReferencedDocumentTypeConverter<
            AdditionalSupportingDocumentsTypeConverter,
            AdditionalSupportingDocumentsTypeConverterXml
        >,
        tenderOrLotTypeConverter: ReferencedDocumentTypeConverter<
            TenderOrLotConverterTypes,
            TenderOrLotConverterTypesXml
        >,
        invoicedObjectIdentifierTypeConverter: ReferencedDocumentTypeConverter<
            InvoicedObjectIdentifierTypeConverter,
            InvoicedObjectIdentifierTypeConverterXml
        >
    ) {
        super()
        this.valueSchema = valueSchema
        this.xmlSchema = xmlSchema
        this.additionalSupportingDocumentsTypeConverter = additionalSupportingDocumentsTypeConverter
        this.tenderOrLotTypeConverter = tenderOrLotTypeConverter
        this.invoicedObjectIdentifierTypeConverter = invoicedObjectIdentifierTypeConverter
    }

    _toValue(xml: XmlType): ValueType {
        const { success } = this.xmlSchema.safeParse(xml)
        if (!success) {
            throw new TypeConverterError('INVALID_XML')
        }

        const xml_arr = Array.isArray(xml) ? xml : [xml]

        const XmlAdditionalSupportingDocuments = xml_arr.filter(item => {
            return item['ram:TypeCode']['#text'] === REFERENCED_DOCUMENT_TYPE_CODES.Reference_paper
        })
        const XmlTenderOrLotReferences = xml_arr.filter(item => {
            return item['ram:TypeCode']['#text'] === REFERENCED_DOCUMENT_TYPE_CODES.Validated_priced_tender
        })
        const XmlInvoicedObjectIdentifiers = xml_arr.filter(item => {
            return item['ram:TypeCode']['#text'] === REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet
        })

        const value = {
            invoiceSupportingDocuments: XmlAdditionalSupportingDocuments.map(item => {
                return this.additionalSupportingDocumentsTypeConverter.toValue(item)
            }),
            tenderOrLotReferenceDetails: XmlTenderOrLotReferences.map(item => {
                return this.tenderOrLotTypeConverter.toValue(item)
            }),
            invoiceItemDetails: XmlInvoicedObjectIdentifiers.map(item => {
                return this.invoicedObjectIdentifierTypeConverter.toValue(item)
            })
        }

        const { success: successValue, data } = this.valueSchema.safeParse(value)

        if (!successValue) {
            throw new TypeConverterError('INVALID_XML')
        }

        return data as ValueType
    }
    _toXML(value: ValueType): XmlType {
        const { success, data } = this.valueSchema.safeParse(value)
        if (!success) {
            throw new TypeConverterError('INVALID_VALUE')
        }

        const XmlAdditionalSupportingDocuments =
            data.invoiceSupportingDocuments != null
                ? data.invoiceSupportingDocuments.map(obj => {
                      return this.additionalSupportingDocumentsTypeConverter._toXML({
                          ...obj,
                          typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Reference_paper
                      })
                  })
                : []

        const XmlTenderOrLotReferences = data.tenderOrLotReferenceDetails
            ? data.tenderOrLotReferenceDetails.map(obj => {
                  return this.tenderOrLotTypeConverter._toXML({
                      ...obj,
                      typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Validated_priced_tender
                  })
              })
            : []

        const XmlInvoicedObjectIdentifiers = data.invoiceItemDetails
            ? data.invoiceItemDetails.map(obj => {
                  return this.invoicedObjectIdentifierTypeConverter._toXML({
                      ...obj,
                      typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet
                  })
              })
            : []

        const {
            success: xmlSuccess,
            data: xmlData,
            error: xmlError
        } = this.xmlSchema.safeParse([
            ...XmlAdditionalSupportingDocuments,
            ...XmlTenderOrLotReferences,
            ...XmlInvoicedObjectIdentifiers
        ])
        if (!xmlSuccess) {
            console.error(xmlError.message)
            throw new TypeConverterError('INVALID_VALUE')
        }

        return xmlData as XmlType
    }

    public static comfort(): AdditionalReferencedDocumentConverter<
        AdditionalReferencedDocumentType_comfort,
        AdditionalReferencedDocumentTypeXml_comfort
    > {
        return new AdditionalReferencedDocumentConverter(
            ZAdditionalReferencedDocumentType_comfort,
            ZAdditionalReferencedDocumentTypeXml_comfort,
            new ReferencedDocumentTypeConverter(
                ZReferencedDocumentType_comfort_additionalSupportingDocuments_forConverter,
                ZReferencedDocumentTypeXml_comfort_additionalSupportingDocuments
            ),
            new ReferencedDocumentTypeConverter(
                ZReferencedDocumentType_comfort_tenderOrLotReference_forConverter,
                ZReferencedDocumentTypeXml_comfort_tenderOrLotReference
            ),
            new ReferencedDocumentTypeConverter(
                ZReferencedDocumentType_comfort_invoicedObjectIdentifier_forConverter,
                ZReferencedDocumentTypeXml_comfort_invoicedObjectIdentifier
            )
        )
    }
}
