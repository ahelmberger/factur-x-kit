import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib'

import { availableProfiles } from '../../core/factur-x'
import { formatCustomDate } from '../texts/formatCustomDate'
import textTranslations, { translations_en } from '../texts/textTranslations'
import { SupportedLocales, dinA4Height, mmToPt } from '../types'

interface TextLineSettingsObject {
    page: PDFPage
    font: PDFFont
    boldFont: PDFFont
    x1: number
    x2: number
    fontSize: number
    color: RGB
}

export default async function addMetaBlock(
    data: availableProfiles,
    page: PDFPage,
    font: PDFFont,
    boldFont: PDFFont,
    locale: SupportedLocales,
    options?: {
        position?: { x?: number; y?: number }
        fontSize?: number
        color?: RGB
    }
): Promise<number> {
    const x1 = options?.position?.x || 125 * mmToPt
    const textLineSettings: TextLineSettingsObject = {
        page,
        font,
        boldFont,
        fontSize: options?.fontSize || 10,
        color: options?.color || rgb(0, 0, 0),
        x1,
        x2: x1 + (locale == 'fr-FR' ? 45 : 40) * mmToPt
    }
    const lineHeight = textLineSettings.fontSize * 1.5
    let deliveryDate

    if ('delivery' in data) {
        deliveryDate = data.delivery.deliveryDate ? formatCustomDate(data.delivery.deliveryDate, locale) : undefined
    }

    const metaDataContent = {
        INVOICE_ID: data.document.id,
        INVOICE_DATE: formatCustomDate(data.document.dateOfIssue, locale),
        ORDER_ID: data.referencedDocuments?.orderReference?.documentId,
        DELIVERY_DATE: deliveryDate
    }

    let y = options?.position?.y || (dinA4Height - 62) * mmToPt

    for (const [key, value] of Object.entries(metaDataContent)) {
        if (value && typeof value === 'string' && key in textTranslations[locale]) {
            const validKey = key as keyof typeof translations_en
            drawTextLine(textTranslations[locale][validKey], value, y, textLineSettings)
            y = y - lineHeight
        }
    }

    return y + lineHeight
}

function drawTextLine(title: string, content: string, yPosition: number, textSettings: TextLineSettingsObject): void {
    textSettings.page.drawText(`${title}:`, {
        x: textSettings.x1,
        y: yPosition,
        font: textSettings.boldFont,
        size: textSettings.fontSize,
        color: textSettings.color
    })

    textSettings.page.drawText(content, {
        x: textSettings.x2,
        y: yPosition,
        font: textSettings.font,
        size: textSettings.fontSize,
        color: textSettings.color
    })
}
