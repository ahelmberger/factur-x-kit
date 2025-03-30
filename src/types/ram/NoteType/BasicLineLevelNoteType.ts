import { z } from 'zod'

import { ZTextType, ZTextTypeXml } from '../../udt/TextTypeConverter'

export const ZBasicLineLevelNoteType = z.object({
    content: ZTextType
})

export type BasicLineLevelNoteType = z.infer<typeof ZBasicLineLevelNoteType>

export const ZBasicLineLevelNoteTypeXml = z.object({
    'ram:Content': ZTextTypeXml
})

export type BasicLineLevelNoteTypeXml = z.infer<typeof ZBasicLineLevelNoteTypeXml>
