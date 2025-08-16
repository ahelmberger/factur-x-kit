import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib';

import { availableProfiles } from '../../core/factur-x';
import { SUBJECT_CODES } from '../../types/codes';
import { SupportedLocales, dinA4Height, dinA4Width, mmToPt } from '../types';
import { getNumberOfLines } from './helpers';

export async function addIntroTextBlock(
    data: availableProfiles,
    page: PDFPage,
    font: PDFFont,
    locale: SupportedLocales,
    options?: {
        position?: { x?: number; y?: number };
        fontSize?: number;
        color?: RGB;
    }
): Promise<number> {
    const fontSize = options?.fontSize || 10;
    const lineHeight = fontSize * 1.25;
    const color = options?.color || rgb(0, 0, 0);
    const yPosition = options?.position?.y || (dinA4Height - 85) * mmToPt;
    const xPosition = options?.position?.x || 25 * mmToPt;
    const maxWidth = dinA4Width * mmToPt - xPosition - 15 * mmToPt;

    if (!('notes' in data.document) || !data.document.notes) return yPosition;
    const introNotes = data.document.notes.filter(note => note.subject === SUBJECT_CODES.INTRODUCTION);
    let currentY = yPosition;
    for (const note of introNotes) {
        page.drawText(note.content, {
            x: xPosition, // Default 25 mm --> Fitting for DIN window Envelope
            y: currentY,
            font: font,
            size: fontSize,
            lineHeight: lineHeight,
            maxWidth: maxWidth,
            color: color
        });
        const numbersOfLines = getNumberOfLines(note.content, fontSize, font, maxWidth);
        currentY = currentY - numbersOfLines * lineHeight;
    }

    return currentY + lineHeight;
}
