import { PDFFont, PDFPage, RGB, rgb } from 'pdf-lib';

import { availableProfiles } from '../../core/factur-x';
import { ISO6523_CODES } from '../../types/codes';
import { textTranslations } from '../texts/textTranslations';
import { SupportedLocales, dinA4Height, mmToPt } from '../types';
import { getNumberOfLines } from './helpers';

export async function addCustomerAddressBlock(
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
    const lineHeight = fontSize * 1.5;
    const yPosition = options?.position?.y || (dinA4Height - 62) * mmToPt;

    const customerAddress = convertAddressBlockToString(data.buyer, locale, {
        useTradeContact: true,
        useTradingBusinessName: false
    });

    page.drawText(customerAddress, {
        x: options?.position?.x || 25 * mmToPt, // Default 25 mm --> Fitting for DIN window Envelope
        y: yPosition,
        font: font,
        size: fontSize,
        lineHeight: lineHeight,
        color: options?.color || rgb(0, 0, 0)
    });
    const numbersOfLines = getNumberOfLines(customerAddress) - 2; // -1 because there is a \n also at the end of the last line

    // returns the y-coordinate of the lower edge of the address field
    return yPosition - lineHeight * numbersOfLines;
}

interface AddressBlock {
    name: string;
    tradeContact?: {
        departmentName?: string;
        personName?: string;
    }[];
    postalAddress?: {
        addressLineOne?: string;
        addressLineTwo?: string;
        addressLineThree?: string;
        postcode?: string;
        city?: string;
        country?: string;
        countrySubDivision?: string;
    };
    specifiedLegalOrganization?: {
        id?: { id?: string; scheme?: ISO6523_CODES };
        tradingBusinessName?: string;
    };
}

export function convertAddressBlockToString(
    data: AddressBlock,
    locale: SupportedLocales,
    options?: { useTradeContact?: boolean; useTradingBusinessName?: boolean }
): string {
    const createCountryName = new Intl.DisplayNames([locale], { type: 'region', style: 'long', fallback: 'code' });

    let tradeContact = '';

    if ('tradeContact' in data && options?.useTradeContact) {
        const departmentName = data.tradeContact?.[0]?.departmentName
            ? `${data.tradeContact?.[0]?.departmentName}`
            : '';
        const personName = data.tradeContact?.[0]?.personName
            ? `${departmentName ? `${textTranslations[locale].ATTN} ` : ''}${data.tradeContact?.[0]?.personName}`
            : '';
        tradeContact = `${departmentName}${departmentName ? ' ' : ''}${personName}${departmentName || personName ? '\n' : ''}`;
    }

    let tradingBusinessName = '';
    if ('specifiedLegalOrganization' in data && options?.useTradingBusinessName) {
        tradingBusinessName = data.specifiedLegalOrganization?.tradingBusinessName
            ? `${data.specifiedLegalOrganization.tradingBusinessName}\n`
            : '';
    }

    let addressLineOne = '';
    let addressLineTwo = '';
    let addressLineThree = '';
    let postcodeAndCity = '';
    let countryAndSubdivision = '';

    if ('postalAddress' in data) {
        addressLineOne = data.postalAddress?.addressLineOne ? `${data.postalAddress?.addressLineOne}\n` : '';
        addressLineTwo = data.postalAddress?.addressLineTwo ? `${data.postalAddress?.addressLineTwo}\n` : '';
        addressLineThree = data.postalAddress?.addressLineThree ? `${data.postalAddress?.addressLineThree}\n` : '';

        const postcode = data.postalAddress?.postcode ? `${data.postalAddress?.postcode}` : '';
        const city = data.postalAddress?.city ? `${data.postalAddress?.city}` : '';
        postcodeAndCity = `${postcode}${postcode || city ? ' ' : ''}${city}${postcode || city ? '\n' : ''}`;

        const country = data.postalAddress?.country ? `${createCountryName.of(data.postalAddress?.country)}` : '';
        const countrySubdivision = data.postalAddress?.countrySubDivision
            ? `${data.postalAddress?.countrySubDivision.toUpperCase()}`
            : '';
        countryAndSubdivision = `${country}${country && countrySubdivision ? ' - ' : ''}${countrySubdivision}${country || countrySubdivision ? '\n' : ''}`;
    }

    return `${data.name}\n${tradingBusinessName}${tradeContact}${addressLineOne}${addressLineTwo}${addressLineThree}${postcodeAndCity}${countryAndSubdivision}`;
}
