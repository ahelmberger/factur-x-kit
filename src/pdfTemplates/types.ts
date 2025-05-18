import { PDFDocument } from 'pdf-lib'

import { availableProfiles } from '../core/factur-x'
import { TranslatedTexts } from './texts/types'

export type SupportedLocales = keyof TranslatedTexts<string>

export type ZugferdKitPDFTemplate = (
    data: availableProfiles,
    pdfDoc: PDFDocument,
    locale: SupportedLocales
) => Promise<PDFDocument>

export const mmToPt = 74.0 / 25.4
export const ptToMm = 25.4 / 74.0
export const dinA4Width = 210
export const dinA4Height = 297
