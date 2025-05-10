import { z } from 'zod'

import { ZCodeType } from '../../types/CodeTypeConverter'
import { CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../types/codes'
import { ZComfortTradeContactType } from '../../types/ram/DefinedTradeContact/ComfortTradeContactType'
import { ZComfortTradeLineItem } from '../../types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem'
import { ZBasicDocumentLevelNoteType } from '../../types/ram/NoteType/BasicDocumentLevelNoteType'
import { ZAdditionalReferencedDocumentType_comfort } from '../../types/ram/ReferencedDocumentType/AdditionalReferencedDocumentConverter/ComfortAdditonalReferencedDocumentTypes'
import {
    ZReferencedDocumentType_docId_issueDate,
    ZReferencedDocumentType_documentId
} from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes'
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter'
import { ZSpecifiedTaxRegistrationsType } from '../../types/ram/SpecifiedTaxRegistrationsTypeConverter'
import { ZBasicDocumentLevelTradeAllowanceChargeType } from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType'
import { ZComfortPaymentMeansType } from '../../types/ram/TradeSettlementPaymentMeansType/ComfortTradeSettlementPaymentMeansType'
import { ZComfortDocumentLevelTradeTaxType } from '../../types/ram/TradeTaxType/ComfortDocumentLevelTradeTaxType'
import { ZAmountType } from '../../types/udt/AmountTypeConverter'
import { ZAmountTypeWithRequiredCurrency } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter'
import { ZDateTimeType } from '../../types/udt/DateTimeTypeConverter'
import { ZIdType } from '../../types/udt/IdTypeConverter'
import { ZIdTypeWithOptionalScheme } from '../../types/udt/IdTypeWithOptionalSchemeConverter'
import { ZIdTypeWithRequiredScheme } from '../../types/udt/IdTypeWithRequiredlSchemeConverter'
import { ZTextType } from '../../types/udt/TextTypeConverter'
import { ZTradePartyType } from '../basicwithoutlines/BasicWithoutLinesProfile'

export const ZComfortProfile = z.object({
    meta: z.object({
        businessProcessType: ZIdType.optional(),
        guidelineSpecifiedDocumentContextParameter: z.literal('urn:cen.eu:en16931:2017')
    }),
    document: z.object({
        id: ZIdType,
        type: ZCodeType(DOCUMENT_TYPE_CODES),
        dateOfIssue: ZDateTimeType,
        currency: ZCodeType(CURRENCY_CODES),
        notes: ZBasicDocumentLevelNoteType.array()
    }),
    seller: ZTradePartyType.extend({
        id: ZIdType.array().optional(),
        globalId: ZIdTypeWithRequiredScheme(ISO6523_CODES).array().optional(),
        specifiedLegalOrganization: z
            .object({
                id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional(),
                tradingBusinessName: ZTextType.optional()
            })
            .optional(),
        taxIdentification: ZSpecifiedTaxRegistrationsForSellerType.optional(),
        otherLegalInformation: ZTextType.optional(),
        tradeContact: ZComfortTradeContactType.array().max(1).optional()
    }),
    buyer: ZTradePartyType.extend({
        specifiedLegalOrganization: z
            .object({
                id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional(),
                tradingBusinessName: ZTextType.optional()
            })
            .optional(),
        reference: ZTextType.optional(),
        tradeContact: ZComfortTradeContactType.array().max(1).optional()
    }),
    sellerTaxRepresentative: ZTradePartyType.omit({
        id: true,
        globalId: true,
        specifiedLegalOrganization: true,
        universalCommunicationAddressURI: true
    })
        .extend({
            taxIdentification: ZSpecifiedTaxRegistrationsType
        })
        .optional(),
    invoiceLines: ZComfortTradeLineItem.array(),
    referencedDocuments: z
        .object({
            orderReference: ZReferencedDocumentType_documentId.optional(),
            contractReference: ZReferencedDocumentType_documentId.optional(),
            advanceShippingNotice: ZReferencedDocumentType_documentId.optional(),
            referencedInvoice: ZReferencedDocumentType_docId_issueDate.array().optional(),
            orderConfirmationReference: ZReferencedDocumentType_documentId.optional(),
            projectReference: z
                .object({
                    id: ZIdType,
                    name: ZTextType
                })
                .optional(),
            receivingAdviceReference: ZReferencedDocumentType_documentId.optional(),
            additionalReferences: ZAdditionalReferencedDocumentType_comfort.optional()
        })
        .optional(),
    delivery: z.object({
        recipient: ZTradePartyType.omit({
            specifiedLegalOrganization: true,
            universalCommunicationAddressURI: true,
            taxIdentification: true
        })
            .extend({ name: ZTextType.optional() })
            .optional(),
        deliveryDate: ZDateTimeType.optional()
    }),
    paymentInformation: z.object({
        creditorReference: ZIdType.optional(),
        paymentReference: ZTextType.optional(),
        payee: ZTradePartyType.pick({
            id: true,
            globalId: true,
            name: true,
            specifiedLegalOrganization: true
        }).optional(),
        paymentMeans: ZComfortPaymentMeansType.array().optional(),
        billingPeriod: z
            .object({
                startDate: ZDateTimeType.optional(),
                endDate: ZDateTimeType.optional()
            })
            .optional(),
        paymentTerms: z
            .object({
                description: ZTextType.optional(),
                dueDate: ZDateTimeType.optional(),
                directDebitMandateID: ZIdType.optional()
            })
            .optional(),
        specifiedTradeAccountingAccount: ZIdType.optional()
    }),
    totals: z.object({
        sumWithoutAllowancesAndCharges: ZAmountType,
        documentLevelAllowancesAndCharges: ZBasicDocumentLevelTradeAllowanceChargeType.optional(),
        allowanceTotalAmount: ZAmountType.optional(),
        chargeTotalAmount: ZAmountType.optional(),
        netTotal: ZAmountType,
        taxBreakdown: ZComfortDocumentLevelTradeTaxType.array(),
        taxTotal: ZAmountTypeWithRequiredCurrency.array().max(2).optional(),
        taxCurrency: ZCodeType(CURRENCY_CODES).optional(),
        roundingAmount: ZAmountType.optional(),
        grossTotal: ZAmountType,
        prepaidAmount: ZAmountType.optional(),
        openAmount: ZAmountType
    })
})

export type ComfortProfile = z.infer<typeof ZComfortProfile>

export function isComfortProfile(data: unknown): data is ComfortProfile {
    return ZComfortProfile.safeParse(data).success
}
