import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib'

import { availableProfiles } from '../../core/factur-x'
import textTranslations from '../texts/textTranslations'
import { SupportedLocales, dinA4Height, mmToPt } from '../types'

export default function addCustomerAddressBlock(
    data: availableProfiles,
    page: PDFPage,
    font: PDFFont,
    locale: SupportedLocales,
    options?: {
        position?: { x: number; y: number }
        fontSize?: number
        color?: RGB
    }
): Promise<void> {
    const createCountryName = new Intl.DisplayNames([locale], { type: 'region', style: 'long', fallback: 'code' })

    let tradeContact = ''
    let contactPhone = ''
    let contactEmail = ''

    if ('tradeContact' in data.buyer) {
        const departmentName = data.buyer.tradeContact?.[0]?.departmentName
            ? `${data.buyer.tradeContact?.[0]?.departmentName}`
            : ''
        const personName = data.buyer.tradeContact?.[0]?.personName
            ? `${departmentName ? `${textTranslations[locale].ATTN} ` : ''}${data.buyer.tradeContact?.[0]?.personName}`
            : ''
        tradeContact = `${departmentName}${departmentName ? ' ' : ''}${personName}${departmentName || personName ? '\n' : ''}`
        contactPhone = data.buyer.tradeContact?.[0]?.telephoneNumber
            ? `${textTranslations[locale].PHONE}: ${data.buyer.tradeContact?.[0]?.telephoneNumber}\n`
            : ''
        contactEmail = data.buyer.tradeContact?.[0]?.email
            ? `${textTranslations[locale].EMAIL}: ${data.buyer.tradeContact?.[0]?.email}\n`
            : ''
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
        const city = data.buyer.postalAddress.city ? `${data.buyer.postalAddress.city}\n` : ''
        postcodeAndCity = `${postcode} ${city}${postcode || city ? '' : '\n'}`

        const country = data.buyer.postalAddress.country
            ? `${createCountryName.of(data.buyer.postalAddress.country)}`
            : ''
        const countrySubdivision = data.buyer.postalAddress.countrySubDivision
            ? `${data.buyer.postalAddress.countrySubDivision.toUpperCase()}`
            : ''
        countryAndSubdivision = `${country}${country && countrySubdivision ? ' - ' : ''}${countrySubdivision}${country || countrySubdivision ? '\n' : ''}`
    }

    const customerAddress = `${data.buyer.name}\n${tradeContact}${addressLineOne}${addressLineTwo}${addressLineThree}${postcodeAndCity}${countryAndSubdivision}${contactPhone || contactEmail ? '\n \n' : ''}${contactPhone}${contactEmail}`
    page.drawText(customerAddress, {
        x: options?.position?.x || 25 * mmToPt, // Default 25 mm --> Fitting for DIN window Envelope
        y: options?.position?.y || (dinA4Height - 62) * mmToPt, // Default 55 mm --> Fitting for DIN window Envelope
        font: font,
        size: options?.fontSize || 10,
        lineHeight: (options?.fontSize || 10) * 1.5,
        color: options?.color || rgb(0, 0, 0),
        maxWidth: 80 * mmToPt // Default 80 mm --> Fitting for DIN window Envelope
    })
    return Promise.resolve()
}
