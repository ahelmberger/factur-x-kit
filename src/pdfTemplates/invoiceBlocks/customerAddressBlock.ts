import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib'

import { availableProfiles } from '../../core/factur-x'
import textTranslations from '../texts/textTranslations'
import { SupportedLocales, dinA4Height, mmToPt } from '../types'
import { getNumberOfLines } from './helpers'

export default async function addCustomerAddressBlock(
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
    const createCountryName = new Intl.DisplayNames([locale], { type: 'region', style: 'long', fallback: 'code' })

    let tradeContact = ''

    if ('tradeContact' in data.buyer) {
        const departmentName = data.buyer.tradeContact?.[0]?.departmentName
            ? `${data.buyer.tradeContact?.[0]?.departmentName}`
            : ''
        const personName = data.buyer.tradeContact?.[0]?.personName
            ? `${departmentName ? `${textTranslations[locale].ATTN} ` : ''}${data.buyer.tradeContact?.[0]?.personName}`
            : ''
        tradeContact = `${departmentName}${departmentName ? ' ' : ''}${personName}${departmentName || personName ? '\n' : ''}`
    }

    let addressLineOne = ''
    let addressLineTwo = ''
    let addressLineThree = ''
    let postcodeAndCity = ''
    let countryAndSubdivision = ''

    if ('postalAddress' in data.buyer) {
        addressLineOne = data.buyer.postalAddress.addressLineOne ? `${data.buyer.postalAddress.addressLineOne}\n` : ''
        addressLineTwo = data.buyer.postalAddress.addressLineTwo ? `${data.buyer.postalAddress.addressLineTwo}\n` : ''
        addressLineThree = data.buyer.postalAddress.addressLineThree
            ? `${data.buyer.postalAddress.addressLineThree}\n`
            : ''

        const postcode = data.buyer.postalAddress.postcode ? `${data.buyer.postalAddress.postcode}` : ''
        const city = data.buyer.postalAddress.city ? `${data.buyer.postalAddress.city}` : ''
        postcodeAndCity = `${postcode}${postcode || city ? ' ' : ''}${city}${postcode || city ? '\n' : ''}`

        const country = data.buyer.postalAddress.country
            ? `${createCountryName.of(data.buyer.postalAddress.country)}`
            : ''
        const countrySubdivision = data.buyer.postalAddress.countrySubDivision
            ? `${data.buyer.postalAddress.countrySubDivision.toUpperCase()}`
            : ''
        countryAndSubdivision = `${country}${country && countrySubdivision ? ' - ' : ''}${countrySubdivision}${country || countrySubdivision ? '\n' : ''}`
    }

    const customerAddress = `${data.buyer.name}\n${tradeContact}${addressLineOne}${addressLineTwo}${addressLineThree}${postcodeAndCity}${countryAndSubdivision}`

    const fontSize = options?.fontSize || 10
    const lineHeight = fontSize * 1.5
    const yPosition = options?.position?.y || (dinA4Height - 62) * mmToPt

    page.drawText(customerAddress, {
        x: options?.position?.x || 25 * mmToPt, // Default 25 mm --> Fitting for DIN window Envelope
        y: yPosition,
        font: font,
        size: fontSize,
        lineHeight: lineHeight,
        color: options?.color || rgb(0, 0, 0)
    })
    const numbersOfLines = getNumberOfLines(customerAddress) - 2 // -1 because there is a \n also at the end of the last line

    // returns the y-coordinate of the lower edge of the address field
    return yPosition - lineHeight * numbersOfLines
}
