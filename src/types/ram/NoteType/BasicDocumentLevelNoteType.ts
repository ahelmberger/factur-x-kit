import { z } from 'zod'

import { ZCodeType, ZCodeTypeXml } from '../../CodeTypeConverter'
import { SUBJECT_CODES } from '../../codes'
import { ZTextType, ZTextTypeXml } from '../../udt/TextTypeConverter'

export const ZBasicDocumentLevelNoteType = z.object({
    content: ZTextType,
    subject: ZCodeType(SUBJECT_CODES).optional()
})

export type BasicDocumentLevelNoteType = z.infer<typeof ZBasicDocumentLevelNoteType>

export const ZBasicDocumentLevelNoteTypeXml = z.object({
    'ram:Content': ZTextTypeXml,
    'ram:SubjectCode': ZCodeTypeXml.optional()
})

export type BasicDocumentLevelNoteTypeXml = z.infer<typeof ZBasicDocumentLevelNoteTypeXml>
