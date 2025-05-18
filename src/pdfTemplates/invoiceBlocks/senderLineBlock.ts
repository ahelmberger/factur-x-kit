import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib'

import { availableProfiles } from '../../core/factur-x'
import { SupportedLocales, dinA4Height, mmToPt } from '../types'

export default function addSenderLineBlock(
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
    let addressLineOne = ''
    let addressLineTwo = ''
    let addressLineThree = ''
    let postcodeAndCity = ''

    if ('city' in data.seller.postalAddress) {
        addressLineOne = data.seller.postalAddress.addressLineOne
            ? `${data.seller.postalAddress.addressLineOne} · `
            : ''
        addressLineTwo = data.seller.postalAddress.addressLineTwo
            ? `${data.seller.postalAddress.addressLineTwo} · `
            : ''
        addressLineThree = data.seller.postalAddress.addressLineThree
            ? `${data.seller.postalAddress.addressLineThree} · `
            : ''

        const postcode = data.seller.postalAddress.postcode ? `${data.seller.postalAddress.postcode}` : ''
        const city = data.seller.postalAddress.city ? `${data.seller.postalAddress.city}` : ''
        postcodeAndCity = `${postcode} ${city}${postcode || city ? '' : ' · '}`
    }

    const customerAddress = `${data.seller.name} · ${addressLineOne}${addressLineTwo}${addressLineThree}${postcodeAndCity}`
    page.drawText(customerAddress, {
        x: options?.position?.x || 25 * mmToPt, // Default 25 mm --> Fitting for DIN window Envelope
        y: options?.position?.y || (dinA4Height - 55) * mmToPt, // Default 55 mm --> Fitting for DIN window Envelope
        font: font,
        size: options?.fontSize || 6,
        lineHeight: (options?.fontSize || 6) * 1.5,
        color: options?.color || rgb(0, 0, 0),
        maxWidth: 90 * mmToPt // Default 80 mm --> Fitting for DIN window Envelope
    })
    return Promise.resolve()
}
