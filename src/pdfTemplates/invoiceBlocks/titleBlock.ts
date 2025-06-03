import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib'

import { availableProfiles } from '../../core/factur-x'
import documentTypes from '../texts/codeTranslations/documentTypes'
import { formatCustomDate } from '../texts/formatCustomDate'
import { invoiceReferenceTranslations } from '../texts/translationTemplates/invoiceReference'
import { SupportedLocales, dinA4Height, mmToPt } from '../types'

export default async function addTitleBlock(
    data: availableProfiles,
    page: PDFPage,
    font: PDFFont,
    locale: SupportedLocales,
    options?: {
        position?: { x?: number; y?: number }
        fontSize?: number
        color?: RGB
    }
): Promise<number> {
    const fontSize = options?.fontSize || 16
    const color = options?.color || rgb(0, 0, 0)
    let yPosition = options?.position?.y || (dinA4Height - 85) * mmToPt
    const xPosition = options?.position?.x || 25 * mmToPt
    page.drawText(documentTypes[locale][data.document.type], {
        x: xPosition, // Default 25 mm --> Fitting for DIN window Envelope
        y: yPosition,
        font: font,
        size: fontSize,
        lineHeight: fontSize,
        color: color
    })

    if (
        data.referencedDocuments &&
        'referencedInvoice' in data.referencedDocuments &&
        data.referencedDocuments?.referencedInvoice &&
        data.referencedDocuments?.referencedInvoice.length > 0
    ) {
        yPosition -= (fontSize / 1.6) * 1.5
        page.drawText(
            invoiceReferenceTranslations[locale](
                data.referencedDocuments.referencedInvoice[0].documentId,
                data.referencedDocuments.referencedInvoice[0].issueDate
                    ? formatCustomDate(data.referencedDocuments.referencedInvoice[0].issueDate, locale, true)
                    : ''
            ),
            {
                x: xPosition, // Default 25 mm --> Fitting for DIN window Envelope
                y: yPosition,
                font: font,
                size: fontSize / 1.6,
                lineHeight: fontSize / 1.6,
                color: color
            }
        )
    }

    return yPosition
}
