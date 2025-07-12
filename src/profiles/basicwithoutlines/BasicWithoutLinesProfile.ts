import { z } from 'zod'

import { ZCodeType } from '../../types/CodeTypeConverter'
import {
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    EAS_SCHEME_CODES,
    ISO6523_CODES
} from '../../types/codes'
import { ZBasicDocumentLevelNoteType } from '../../types/ram/NoteType/BasicDocumentLevelNoteType'
import {
    ZReferencedDocumentType_docId_issueDate,
    ZReferencedDocumentType_documentId
} from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes'
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter'
import { ZSpecifiedTaxRegistrationsType } from '../../types/ram/SpecifiedTaxRegistrationsTypeConverter'
import { ZBasicDocumentLevelTradeAllowanceChargeType } from '../../types/ram/TradeAllowanceChargeType/BasicDocumentLevelAllowanceChargeType'
import { ZBasicPaymentMeansType } from '../../types/ram/TradeSettlementPaymentMeansType/BasicTradeSettlementPaymentMeansType'
import { ZBasicDocumentLevelTradeTaxType } from '../../types/ram/TradeTaxType/BasicDocumentLevelTradeTaxType'
import { ZAmountType } from '../../types/udt/AmountTypeConverter'
import { ZAmountTypeWithRequiredCurrency } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter'
import { ZDateTimeType } from '../../types/udt/DateTimeTypeConverter'
import { ZIdType } from '../../types/udt/IdTypeConverter'
import { ZIdTypeWithOptionalScheme } from '../../types/udt/IdTypeWithOptionalSchemeConverter'
import { ZIdTypeWithRequiredScheme } from '../../types/udt/IdTypeWithRequiredlSchemeConverter'
import { ZTextType } from '../../types/udt/TextTypeConverter'
import { ZTokenType } from '../../types/xs/TokenConverter'
import {
    BR_16,
    BR_16_ERROR,
    BR_21,
    BR_21_ERROR,
    BR_27,
    BR_27_ERROR,
    BR_28,
    BR_28_ERROR,
    BR_29,
    BR_29_ERROR,
    BR_30,
    BR_30_ERROR,
    BR_33,
    BR_33_ERROR,
    BR_38,
    BR_38_ERROR,
    BR_42,
    BR_42_ERROR,
    BR_44,
    BR_44_ERROR,
    BR_53,
    BR_53_ERROR,
    BR_61,
    BR_61_ERROR
} from '../businessRules/br'
import {
    BR_CO_9,
    BR_CO_9_ERROR,
    BR_CO_10,
    BR_CO_10_ERROR,
    BR_CO_11,
    BR_CO_11_ERROR,
    BR_CO_12,
    BR_CO_12_ERROR,
    BR_CO_13,
    BR_CO_13_ERROR,
    BR_CO_14,
    BR_CO_14_ERROR,
    BR_CO_15,
    BR_CO_15_ERROR,
    BR_CO_16,
    BR_CO_16_ERROR
} from '../businessRules/br_co'
import {
    BR_OWN_1,
    BR_OWN_1_ERROR,
    BR_OWN_2,
    BR_OWN_2_ERROR,
    BR_OWN_3,
    BR_OWN_3_ERROR,
    BR_OWN_4,
    BR_OWN_4_ERROR
} from '../businessRules/br_own'

export const ZTradePartyType = z.object({
    id: ZIdType.optional(), // in seller this could be an array
    globalId: ZIdTypeWithRequiredScheme(ISO6523_CODES).optional(), // in seller this could be an array
    name: ZTextType, // may be optional on some specific trade parties
    specifiedLegalOrganization: z.object({ id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional() }).optional(),
    postalAddress: z.object({
        postcode: ZTokenType.optional(),
        addressLineOne: ZTextType.optional(),
        addressLineTwo: ZTextType.optional(),
        addressLineThree: ZTextType.optional(),
        city: ZTextType.optional(),
        country: ZCodeType(COUNTRY_ID_CODES),
        countrySubDivision: ZTextType.optional()
    }),
    universalCommunicationAddressURI: ZIdTypeWithRequiredScheme(EAS_SCHEME_CODES).optional(),
    taxIdentification: ZSpecifiedTaxRegistrationsType.optional()
})

export const ZBasicWithoutLinesProfileStructure = z.object({
    meta: z.object({
        businessProcessType: ZIdType.optional(),
        guidelineSpecifiedDocumentContextParameter: z.literal('urn:factur-x.eu:1p0:basicwl')
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
        taxIdentification: ZSpecifiedTaxRegistrationsForSellerType.optional()
    }),

    buyer: ZTradePartyType.extend({
        reference: ZTextType.optional()
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
    referencedDocuments: z
        .object({
            orderReference: ZReferencedDocumentType_documentId.optional(),
            contractReference: ZReferencedDocumentType_documentId.optional(),
            advanceShippingNotice: ZReferencedDocumentType_documentId.optional(),
            referencedInvoice: ZReferencedDocumentType_docId_issueDate.array().optional()
        })
        .optional(),
    delivery: z
        .object({
            recipient: ZTradePartyType.omit({
                specifiedLegalOrganization: true,
                universalCommunicationAddressURI: true,
                taxIdentification: true
            })
                .extend({ name: ZTextType.optional() })
                .optional(),
            deliveryDate: ZDateTimeType.optional()
        })
        .optional(),
    paymentInformation: z.object({
        creditorReference: ZIdType.optional(),
        paymentReference: ZTextType.optional(),
        payee: ZTradePartyType.pick({
            id: true,
            globalId: true,
            name: true,
            specifiedLegalOrganization: true
        }).optional(),
        paymentMeans: ZBasicPaymentMeansType.array().optional(),
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

export type BasicWithoutLinesProfile = z.infer<typeof ZBasicWithoutLinesProfileStructure>

export const ZBasicWithoutLinesProfile = ZBasicWithoutLinesProfileStructure.refine(BR_OWN_1, BR_OWN_1_ERROR)
    .refine(BR_OWN_2, BR_OWN_2_ERROR)
    .refine(BR_OWN_3, BR_OWN_3_ERROR)
    .refine(BR_OWN_4, BR_OWN_4_ERROR)

    .refine(BR_CO_9, BR_CO_9_ERROR)
    .refine(BR_CO_10, BR_CO_10_ERROR)
    .refine(BR_CO_11, BR_CO_11_ERROR)
    .refine(BR_CO_12, BR_CO_12_ERROR)
    .refine(BR_CO_13, BR_CO_13_ERROR)
    .refine(BR_CO_14, BR_CO_14_ERROR)
    .refine(BR_CO_15, BR_CO_15_ERROR)
    .refine(BR_CO_16, BR_CO_16_ERROR)

    .refine(BR_16, BR_16_ERROR)
    .refine(BR_21, BR_21_ERROR)
    .refine(BR_27, BR_27_ERROR)
    .refine(BR_28, BR_28_ERROR)
    .refine(BR_29, BR_29_ERROR)
    .refine(BR_30, BR_30_ERROR)
    .refine(BR_33, BR_33_ERROR)
    .refine(BR_38, BR_38_ERROR)
    .refine(BR_42, BR_42_ERROR)
    .refine(BR_44, BR_44_ERROR)
    .refine(BR_53, BR_53_ERROR)
    .refine(BR_61, BR_61_ERROR)

export function isBasicWithoutLinesProfile(data: unknown): data is BasicWithoutLinesProfile {
    return ZBasicWithoutLinesProfileStructure.safeParse(data).success
}

export function isValidBasicWithoutLinesProfile(data: unknown): { valid: boolean; errors?: string[] } {
    const result = ZBasicWithoutLinesProfile.safeParse(data)
    if (!result.success) {
        return {
            valid: false,
            errors: result.error.issues.map(issue => issue.message)
        }
    }
    return { valid: result.success }
}
