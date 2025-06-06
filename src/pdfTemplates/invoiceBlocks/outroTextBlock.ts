import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib'

import { availableProfiles } from '../../core/factur-x'
import { SUBJECT_CODES } from '../../types/codes'
import noteSubjects from '../texts/codeTranslations/noteSubjects'
import vatExemptions from '../texts/codeTranslations/vatExemptions'
import textTranslations from '../texts/textTranslations'
import { SupportedLocales, dinA4Height, dinA4Width, mmToPt } from '../types'
import { getNumberOfLines } from './helpers'

interface Settings {
    page: PDFPage
    font: PDFFont
    fontBold: PDFFont
    locale: SupportedLocales
    fontSize: number
    lineHeight: number
    xPosition: number
    maxWidth: number
    color: RGB
}

export default async function addOutroTextBlock(
    data: availableProfiles,
    page: PDFPage,
    font: PDFFont,
    fontBold: PDFFont,
    locale: SupportedLocales,
    options?: {
        position?: { x?: number; y?: number }
        fontSize?: number
        color?: RGB
    }
): Promise<number> {
    const fontSize = options?.fontSize || 10
    const lineHeight = fontSize * 1.25
    const color = options?.color || rgb(0, 0, 0)
    const yPosition = options?.position?.y || (dinA4Height - 200) * mmToPt
    const xPosition = options?.position?.x || 25 * mmToPt
    const maxWidth = dinA4Width * mmToPt - xPosition - 15 * mmToPt

    const settings: Settings = {
        page: page,
        font: font,
        fontBold: fontBold,
        locale: locale,
        fontSize: fontSize,
        lineHeight: lineHeight,
        xPosition: xPosition,
        maxWidth: maxWidth,
        color: color
    }

    let currentY = addVATExemptionReason(data, yPosition, settings)
    currentY = addPaymentTerms(data, currentY, settings)
    currentY = addNotes(data, currentY, settings)
    return currentY + lineHeight
}

function addPaymentTerms(data: availableProfiles, currentY: number, settings: Settings): number {
    const { page, font, fontSize, lineHeight, xPosition, maxWidth, color, locale } = settings
    if (data.totals.openAmount === 0) {
        page.drawText(textTranslations[locale].ALREADY_PAID, {
            x: xPosition,
            y: currentY,
            font: font,
            size: fontSize,
            lineHeight: lineHeight,
            maxWidth: maxWidth,
            color: color
        })
        return currentY - lineHeight * 1.5
    }
    if (!('paymentInformation' in data)) return currentY
    if (!('paymentTerms' in data.paymentInformation)) return currentY
    if (data.paymentInformation.paymentTerms?.description == undefined) return currentY
    page.drawText(data.paymentInformation.paymentTerms.description, {
        x: xPosition,
        y: currentY,
        font: font,
        size: fontSize,
        lineHeight: lineHeight,
        maxWidth: maxWidth,
        color: color
    })
    const numbersOfLines = getNumberOfLines(data.paymentInformation.paymentTerms.description, fontSize, font, maxWidth)
    return currentY - numbersOfLines * lineHeight - lineHeight * 0.5
}

function addVATExemptionReason(data: availableProfiles, currentY: number, settings: Settings): number {
    const { page, font, fontSize, lineHeight, xPosition, maxWidth, color, locale } = settings
    if (!('taxBreakdown' in data.totals)) return currentY
    const taxBreakdown = data.totals.taxBreakdown || []
    for (const tax of taxBreakdown) {
        if (!tax.exemptionReason && !tax.exemptionReasonCode) continue
        const exemptionReason =
            tax.exemptionReason ||
            `${textTranslations[locale].VAT_EXMPTION_REASON}: ${tax.exemptionReasonCode && vatExemptions[locale][tax.exemptionReasonCode]}`

        page.drawText(exemptionReason, {
            x: xPosition,
            y: currentY,
            font: font,
            size: fontSize,
            lineHeight: lineHeight,
            maxWidth: maxWidth,
            color: color
        })
        const numbersOfLines = getNumberOfLines(exemptionReason, fontSize, font, maxWidth)
        currentY = currentY - numbersOfLines * lineHeight - lineHeight * 0.5
        continue
    }
    return currentY
}

function addNotes(data: availableProfiles, currentY: number, settings: Settings): number {
    let { fontSize, lineHeight } = settings
    const { page, font, fontBold, locale, xPosition, maxWidth, color } = settings

    if (!('notes' in data.document)) return currentY
    const notes = data.document.notes.filter(note => note.subject == undefined)
    for (const note of notes) {
        page.drawText(note.content, {
            x: xPosition,
            y: currentY,
            font: font,
            size: fontSize,
            lineHeight: lineHeight,
            maxWidth: maxWidth,
            color: color
        })
        const numbersOfLines = getNumberOfLines(note.content, fontSize, font, maxWidth)
        currentY = currentY - numbersOfLines * lineHeight - lineHeight * 0.5
    }

    const notesWithSubject = data.document.notes.filter(
        note => note.subject && note.subject !== SUBJECT_CODES.INTRODUCTION
    )

    fontSize = fontSize * 0.8
    lineHeight = lineHeight * 0.8

    const widthOfSpace = font.widthOfTextAtSize(' ', fontSize)

    for (const note of notesWithSubject) {
        if (note.subject === SUBJECT_CODES.INTRODUCTION) continue
        const subject = note.subject ? `${noteSubjects[locale][note.subject]}: ` : ''
        page.drawText(subject, {
            x: xPosition,
            y: currentY,
            font: fontBold,
            size: fontSize,
            lineHeight: lineHeight,
            maxWidth: maxWidth,
            color: color
        })
        const widthOfSubject = fontBold.widthOfTextAtSize(subject || '', fontSize)
        const numbersOfSpaces = widthOfSubject / widthOfSpace
        const content = note.content.padStart(note.content.length + Math.ceil(numbersOfSpaces), ' ')
        page.drawText(content, {
            x: xPosition,
            y: currentY,
            font: font,
            size: fontSize,
            lineHeight: lineHeight,
            maxWidth: maxWidth,
            color: color
        })
        const numbersOfLines = getNumberOfLines(content, fontSize, font, maxWidth)
        currentY = currentY - numbersOfLines * lineHeight - lineHeight * 0.5
    }

    return currentY
}
