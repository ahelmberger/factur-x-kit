import { z } from 'zod'

import { ZCodeType } from '../../types/CodeTypeConverter'
import { CURRENCY_CODES, DOCUMENT_TYPE_CODES, ISO6523_CODES } from '../../types/codes'
import { ZReferencedDocumentType_documentId } from '../../types/ram/ReferencedDocumentType/ReferencedDocumentTypes'
import { ZSpecifiedTaxRegistrationsForSellerType } from '../../types/ram/SpecifiedTaxRegistrationsForSellerTypeConverter'
import { ZAmountType } from '../../types/udt/AmountTypeConverter'
import { ZAmountTypeWithRequiredCurrency } from '../../types/udt/AmountTypeWithRequiredCurrencyConverter'
import { ZDateTimeType } from '../../types/udt/DateTimeTypeConverter'
import { ZIdType } from '../../types/udt/IdTypeConverter'
import { ZIdTypeWithOptionalScheme } from '../../types/udt/IdTypeWithOptionalSchemeConverter'
import { ZTextType } from '../../types/udt/TextTypeConverter'
import { BR_CO_9, BR_CO_9_ERROR } from '../businessRules/br_co'

export const ZMinimumProfileStructure = z.object({
    meta: z.object({
        businessProcessType: ZIdType.optional(),
        guidelineSpecifiedDocumentContextParameter: z.literal('urn:factur-x.eu:1p0:minimum')
    }),
    document: z.object({
        id: ZIdType,
        type: ZCodeType(DOCUMENT_TYPE_CODES),
        currency: ZCodeType(CURRENCY_CODES),
        dateOfIssue: ZDateTimeType
    }),
    seller: z.object({
        name: ZTextType,
        specifiedLegalOrganization: z.object({ id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional() }).optional(),
        postalAddress: z.object({
            country: ZTextType
        }),
        taxIdentification: ZSpecifiedTaxRegistrationsForSellerType
    }),
    buyer: z.object({
        reference: ZTextType.optional(), // Explanation @https://www.e-rechnung-bund.de/faq/leitweg-id/
        name: ZTextType,
        specifiedLegalOrganization: z.object({ id: ZIdTypeWithOptionalScheme(ISO6523_CODES).optional() }).optional()
    }),
    referencedDocuments: z
        .object({
            orderReference: ZReferencedDocumentType_documentId.optional()
        })
        .optional(),
    totals: z.object({
        netTotal: ZAmountType,
        taxTotal: ZAmountTypeWithRequiredCurrency.array().max(1).optional(),
        grossTotal: ZAmountType,
        openAmount: ZAmountType
    })
})

export type MinimumProfile = z.infer<typeof ZMinimumProfileStructure>

export const ZMinimumProfile = ZMinimumProfileStructure.refine(BR_CO_9, BR_CO_9_ERROR) // TODO ADD ALL VALID BRs

export function isMinimumProfile(data: unknown): data is MinimumProfile {
    return ZMinimumProfileStructure.safeParse(data).success
}

export function isValidMinimumProfile(data: unknown): { valid: boolean; errors?: string[] } {
    const result = ZMinimumProfile.safeParse(data)
    if (!result.success) {
        return {
            valid: false,
            errors: result.error.issues.map(issue => issue.message)
        }
    }
    return { valid: result.success }
}
