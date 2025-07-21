import { ArrayConverter } from '../../types/ArrayConverter'
import { CodeTypeConverter } from '../../types/CodeTypeConverter'
import { CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../types/codes'
import { ReferencedDocumentTypeConverter } from '../../types/ram/ReferencedDocumentType/ReferencedDocumentConverter'
import { SpecifiedTaxRegistrationsForSellerTypeConverter } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter'
import { AmountTypeConverter } from '../../types/udt/AmountTypeConverter'
import { AmountTypeWithRequiredCurrencyConverter } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter'
import { DateTimeTypeConverter } from '../../types/udt/DateTimeTypeConverter'
import { IdTypeConverter } from '../../types/udt/IdTypeConverter'
import { IdTypeWithOptionalSchemeConverter } from '../../types/udt/IdTypeWithOptionalSchemeConverter'
import { TextTypeConverter } from '../../types/udt/TextTypeConverter'
import type { MappingItem } from '../convert'
import { MinimumProfile } from './MinimumProfile'
import { MinimumProfileXml } from './MinimumProfileXml'

const mapping: MappingItem<MinimumProfile, MinimumProfileXml>[] = [
    //const mapping: MappingItem<MinimumProfile, MinimumProfileXml>[] = [
    {
        obj: 'businessProcessType',
        xml: 'rsm:CrossIndustryInvoice.rsm:ExchangedDocumentContext.ram:BusinessProcessSpecifiedDocumentContextParameter.ram:ID',
        converter: new IdTypeConverter()
    },
    {
        obj: 'profile',
        xml: 'rsm:CrossIndustryInvoice.rsm:ExchangedDocumentContext.ram:GuidelineSpecifiedDocumentContextParameter.ram:ID',
        converter: new IdTypeConverter()
    },
    {
        obj: 'document.id',
        xml: 'rsm:CrossIndustryInvoice.rsm:ExchangedDocument.ram:ID',
        converter: new IdTypeConverter()
    },
    {
        obj: 'document.type',
        xml: 'rsm:CrossIndustryInvoice.rsm:ExchangedDocument.ram:TypeCode',
        converter: new CodeTypeConverter(DOCUMENT_TYPE_CODES)
    },
    {
        obj: 'document.dateOfIssue',
        xml: 'rsm:CrossIndustryInvoice.rsm:ExchangedDocument.ram:IssueDateTime',
        converter: new DateTimeTypeConverter()
    },
    {
        obj: 'buyer.reference',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerReference',
        converter: new TextTypeConverter()
    },
    {
        obj: 'seller.name',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:Name',
        converter: new TextTypeConverter()
    },
    {
        obj: 'seller.specifiedLegalOrganization.id',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:SpecifiedLegalOrganization.ram:ID',
        converter: new IdTypeWithOptionalSchemeConverter(ISO6523_CODES)
    },
    {
        obj: 'seller.postalAddress.country',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:PostalTradeAddress.ram:CountryID',
        converter: new TextTypeConverter()
    },
    {
        obj: 'seller.taxIdentification',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:SellerTradeParty.ram:SpecifiedTaxRegistration',
        converter: new SpecifiedTaxRegistrationsForSellerTypeConverter()
    },
    {
        obj: 'buyer.name',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:Name',
        converter: new TextTypeConverter()
    },
    {
        obj: 'buyer.specifiedLegalOrganization.id',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerTradeParty.ram:SpecifiedLegalOrganization.ram:ID',
        converter: new IdTypeWithOptionalSchemeConverter(ISO6523_CODES)
    },
    {
        obj: 'referencedDocuments.orderReference',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeAgreement.ram:BuyerOrderReferencedDocument',
        converter: ReferencedDocumentTypeConverter.documentId()
    },
    {
        obj: 'document.currency',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:InvoiceCurrencyCode',
        converter: new CodeTypeConverter(CURRENCY_CODES)
    },
    {
        obj: 'totals.netTotal',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:TaxBasisTotalAmount',
        converter: new AmountTypeConverter()
    },
    {
        obj: 'totals.taxTotal',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:TaxTotalAmount',
        converter: new ArrayConverter(new AmountTypeWithRequiredCurrencyConverter())
    },
    {
        obj: 'totals.grossTotal',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:GrandTotalAmount',
        converter: new AmountTypeConverter()
    },
    {
        obj: 'totals.openAmount',
        xml: 'rsm:CrossIndustryInvoice.rsm:SupplyChainTradeTransaction.ram:ApplicableHeaderTradeSettlement.ram:SpecifiedTradeSettlementHeaderMonetarySummation.ram:DuePayableAmount',
        converter: new AmountTypeConverter()
    }
]

export default mapping
