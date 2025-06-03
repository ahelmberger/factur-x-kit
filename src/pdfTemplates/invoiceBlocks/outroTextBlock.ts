import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib'

import { availableProfiles } from '../../core/factur-x'
import { SUBJECT_CODES } from '../../types/codes'
import noteSubjects from '../texts/codeTranslations/noteSubjects'
import { SupportedLocales, dinA4Height, dinA4Width, mmToPt } from '../types'
import { getNumberOfLines } from './helpers'

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
    let fontSize = options?.fontSize || 10
    const lineHeight = fontSize * 1.25
    const color = options?.color || rgb(0, 0, 0)
    const yPosition = options?.position?.y || (dinA4Height - 200) * mmToPt
    const xPosition = options?.position?.x || 25 * mmToPt
    const maxWidth = dinA4Width * mmToPt - xPosition - 15 * mmToPt

    if (!('notes' in data.document)) return yPosition
    const notes = data.document.notes.filter(note => note.subject == undefined)
    let currentY = yPosition
    for (const note of notes) {
        page.drawText(note.content, {
            x: xPosition, // Default 25 mm --> Fitting for DIN window Envelope
            y: currentY,
            font: font,
            size: fontSize,
            lineHeight: lineHeight,
            maxWidth: maxWidth,
            color: color
        })
        const numbersOfLines = getNumberOfLines(note.content, fontSize, font, maxWidth)
        currentY = currentY - numbersOfLines * lineHeight
    }

    const notesWithSubject = data.document.notes.filter(
        note => note.subject && note.subject !== SUBJECT_CODES.INTRODUCTION
    )

    fontSize = fontSize * 0.8

    const widthOfSpace = font.widthOfTextAtSize(' ', fontSize)

    for (const note of notesWithSubject) {
        const subject = note.subject ? `${noteSubjects[locale][note.subject]}: ` : ''
        page.drawText(subject, {
            x: xPosition, // Default 25 mm --> Fitting for DIN window Envelope
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
            x: xPosition, // Default 25 mm --> Fitting for DIN window Envelope
            y: currentY,
            font: font,
            size: fontSize,
            lineHeight: lineHeight,
            maxWidth: maxWidth,
            color: color
        })
        const numbersOfLines = getNumberOfLines(content, fontSize, font, maxWidth)
        currentY = currentY - numbersOfLines * lineHeight
    }

    return currentY + lineHeight
}
