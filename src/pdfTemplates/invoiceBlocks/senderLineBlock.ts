import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib';

import { availableProfiles } from '../../core/factur-x';
import { SupportedLocales, dinA4Height, mmToPt } from '../types';

export default async function addSenderLineBlock(
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
    let addressLineOne = '';
    let addressLineTwo = '';
    let addressLineThree = '';
    let postcodeAndCity = '';

    if ('city' in data.seller.postalAddress) {
        addressLineOne = data.seller.postalAddress.addressLineOne
            ? `${data.seller.postalAddress.addressLineOne} · `
            : '';
        addressLineTwo = data.seller.postalAddress.addressLineTwo
            ? `${data.seller.postalAddress.addressLineTwo} · `
            : '';
        addressLineThree = data.seller.postalAddress.addressLineThree
            ? `${data.seller.postalAddress.addressLineThree} · `
            : '';

        const postcode = data.seller.postalAddress.postcode ? `${data.seller.postalAddress.postcode}` : '';
        const city = data.seller.postalAddress.city ? `${data.seller.postalAddress.city}` : '';
        postcodeAndCity = `${postcode} ${city}${postcode || city ? '' : ' · '}`;
    }

    const customerAddress = `${data.seller.name} · ${addressLineOne}${addressLineTwo}${addressLineThree}${postcodeAndCity}`;
    const yPosition = options?.position?.y || (dinA4Height - 55) * mmToPt;
    const fontSize = options?.fontSize || 6;
    page.drawText(customerAddress, {
        x: options?.position?.x || 25 * mmToPt, // Default 25 mm --> Fitting for DIN window Envelope
        y: yPosition, // Default 55 mm --> Fitting for DIN window Envelope
        font: font,
        size: fontSize,
        lineHeight: fontSize,
        color: options?.color || rgb(0, 0, 0)
    });

    return yPosition;
}
