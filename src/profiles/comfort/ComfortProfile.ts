import { z } from 'zod'

import { ZCodeType } from '../../types/CodeTypeConverter.js'
import { CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../types/codes.js'
import { ZComfortTradeContactType } from '../../types/ram/DefinedTradeContact/ComfortTradeContactType.js'
import { ZComfortTradeLineItem } from '../../types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem.js'
import { ZBasicDocumentLevelNoteType } from '../../types/ram/NoteType/BasicDocumentLevelNoteType.js'
import {
    ZReferencedDocumentType_docId_issueDate,
    ZReferencedDocumentType_documentId
} from '../../types/ram/ReferencedDocumentConverter.js'
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter.js'
import { ZSpecifiedTaxRegistrationsType } from '../../types/ram/SpecifiedTaxRegistrationsTypeConverter.js'
import { ZBasicDocumentLevelTradeAllowanceChargeType } from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType.js'
import { ZPaymentMeansType } from '../../types/ram/TradeSettlementPaymentMeansTypeConverter.js'
import { ZBasicDocumentLevelTradeTaxType } from '../../types/ram/TradeTaxType/BasicDocumentLevelTradeTaxType.js'
import { ZAmountType } from '../../types/udt/AmountTypeConverter.js'
import { ZAmountTypeWithRequiredCurrency } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter.js'
import { ZDateTimeType } from '../../types/udt/DateTimeTypeConverter.js'
import { ZIdType } from '../../types/udt/IdTypeConverter.js'
import { ZIdTypeWithOptionalScheme } from '../../types/udt/IdTypeWithOptionalSchemeConverter.js'
import { ZIdTypeWithRequiredScheme } from '../../types/udt/IdTypeWithRequiredlSchemeConverter.js'
import { ZTextType } from '../../types/udt/TextTypeConverter.js'
import { ZTradePartyType } from '../basicwithoutlines/BasicWithoutLinesProfile.js'

export const ZComfortProfile = z.object({
    meta: z.object({
        businessProcessType: ZIdType.optional(),
        guidelineSpecifiedDocumentContextParameter: z.literal(
            'urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic'
        )
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
            orderConfirmationReference: ZReferencedDocumentType_documentId.optional()
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
        deliveryDate: z.date()
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
        paymentMeans: ZPaymentMeansType.array().optional(),
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
        taxBreakdown: ZBasicDocumentLevelTradeTaxType.array(),
        taxTotal: ZAmountTypeWithRequiredCurrency.array().max(2).optional(),
        taxCurrency: ZCodeType(CURRENCY_CODES).optional(),
        grossTotal: ZAmountType,
        prepaidAmount: ZAmountType.optional(),
        openAmount: ZAmountType
    })
})

export type ComfortProfile = z.infer<typeof ZComfortProfile>

export function isComfortProfile(data: unknown): data is ComfortProfile {
    return ZComfortProfile.safeParse(data).success
}
