import { PDFFont } from 'pdf-lib'

import { BasicLineLevelTradeAllowanceChargeType } from '../../types/ram/TradeAllowanceChargeType/BasicLineLevelAllowanceChargeType'
import textTranslations from '../texts/textTranslations'
import { SupportedLocales } from '../types'

export function getNumberOfLines(text: string): number
export function getNumberOfLines(text: string, fontSize: number, font: PDFFont, maxWidth: number): number
export function getNumberOfLines(text: string, fontSize?: number, font?: PDFFont, maxWidth?: number): number {
    const lines = text.split('\n')
    if (maxWidth == null || fontSize == null || font == null) return lines.length
    let numbersOfLines = 0
    for (const line of lines) {
        const textWidth = font.widthOfTextAtSize(line, fontSize)
        if (textWidth <= maxWidth) numbersOfLines++
        else numbersOfLines = numbersOfLines + wrapText(line, fontSize, font, maxWidth).length
    }
    return numbersOfLines
}

export function wrapText(text: string, fontSize: number, font: PDFFont, maxWidth: number): string[] {
    const paragraphs = text.split('\n')
    const wrappedText = paragraphs.reduce<string[]>((cumm, currentParagraph) => {
        if (font.widthOfTextAtSize(currentParagraph, fontSize) <= maxWidth) return [...cumm, currentParagraph]
        const spaceWidth = font.widthOfTextAtSize(' ', fontSize)
        const lineArray = []
        let line = ''
        let linePosition = 0
        const words = currentParagraph.split(' ')
        for (const word of words) {
            const lengthOfWord = font.widthOfTextAtSize(word, fontSize)
            if (linePosition === 0) {
                if (lengthOfWord > maxWidth) {
                    lineArray.push(word)
                    continue
                }
                line = `${word} `
                linePosition = lengthOfWord + spaceWidth
            } else {
                if (linePosition + spaceWidth + lengthOfWord > maxWidth) {
                    lineArray.push(line)
                    line = word
                    linePosition = lengthOfWord
                    continue
                }
                line = `${line} ${word}`
                linePosition = linePosition + spaceWidth + lengthOfWord
            }
        }
        if (line !== '') lineArray.push(line)
        return [...cumm, ...lineArray]
    }, [])

    return wrappedText
}

export function convertAllowancesAndChargesToString(
    allowanceAndCharge: BasicLineLevelTradeAllowanceChargeType | undefined,
    currencyConverter: Intl.NumberFormat,
    locale: SupportedLocales,
    newLineAtStart?: boolean,
    addReason?: boolean
): string {
    if (!allowanceAndCharge) return ''
    const formattedAllowances =
        allowanceAndCharge.allowances?.map(allowance => {
            return `\n${addReason ? `${allowance.reason ? allowance.reason : textTranslations[locale]['ALLOWANCE']}:\n` : ''}- ${currencyConverter.format(allowance.actualAmount)}`
        }) || []
    const formattedCharges =
        allowanceAndCharge.charges?.map(charge => {
            return `\n${addReason ? `${charge.reason ? charge.reason : textTranslations[locale]['CHARGE']}:\n` : ''}+ ${currencyConverter.format(charge.actualAmount)}`
        }) || []
    const allowanceAndChargeString = `${formattedAllowances.join('')}${formattedCharges.join('')}`
    if (newLineAtStart) return allowanceAndChargeString
    return allowanceAndChargeString.replace(/^\n+/, '')
}
