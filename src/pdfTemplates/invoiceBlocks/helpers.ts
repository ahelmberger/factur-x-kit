import { PDFFont } from 'pdf-lib'

export function getNumberOfLines(text: string): number
export function getNumberOfLines(text: string, fontSize: number, font: PDFFont, maxWidth: number): number
export function getNumberOfLines(text: string, fontSize?: number, font?: PDFFont, maxWidth?: number): number {
    const lines = text.split('\n')
    if (maxWidth == null || fontSize == null || font == null) return lines.length
    let numbersOfLines = 0
    for (const line of lines) {
        const textWidth = font.widthOfTextAtSize(line, fontSize)
        numbersOfLines = numbersOfLines + Math.ceil(textWidth / maxWidth)
    }
    return numbersOfLines
}
