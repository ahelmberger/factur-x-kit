import { z } from 'zod'

import { ZIdType, ZIdTypeXml } from '../../../udt/IdTypeConverter'
import { ZBasicLineLevelNoteType, ZBasicLineLevelNoteTypeXml } from '../../NoteType/BasicLineLevelNoteType'

export const ZBasicAssociatedDocumentLineDocumentType = z.object({
    lineId: ZIdType,
    lineNote: ZBasicLineLevelNoteType.optional()
})

export type BasicAssociatedDocumentLineDocumentType = z.infer<typeof ZBasicAssociatedDocumentLineDocumentType>

export const ZBasicAssociatedDocumentLineDocumentTypeXml = z.object({
    'ram:LineID': ZIdTypeXml,
    'ram:IncludedNote': ZBasicLineLevelNoteTypeXml.optional()
})

export type BasicAssociatedDocumentLineDocumentTypeXml = z.infer<typeof ZBasicAssociatedDocumentLineDocumentTypeXml>
