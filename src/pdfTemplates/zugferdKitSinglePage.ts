import * as fs from 'fs'
import { PageSizes, rgb } from 'pdf-lib'
import { PDFDocument } from 'pdf-lib'

import { availableProfiles } from '../core/factur-x'
import addCustomerAddressBlock from './invoiceBlocks/customerAddressBlock'
import addSenderLineBlock from './invoiceBlocks/senderLineBlock'
import { SupportedLocales, dinA4Height, mmToPt } from './types'

export default async function zugferdKitSinglePage(
    data: availableProfiles,
    pdfDoc: PDFDocument,
    locale: SupportedLocales
): Promise<PDFDocument> {
    const openSansRegularBytes = fs.readFileSync('./assets/fonts/OpenSans/OpenSans-Regular.ttf')
    const openSansBoldBytes = fs.readFileSync('./assets/fonts/OpenSans/OpenSans-Bold.ttf')
    const openSansLightBytes = fs.readFileSync('./assets/fonts/OpenSans/OpenSans-Light.ttf')

    const page = pdfDoc.addPage(PageSizes.A4)
    const openSansRegular = await pdfDoc.embedFont(openSansRegularBytes)
    const openSansBold = await pdfDoc.embedFont(openSansBoldBytes)
    const openSansLight = await pdfDoc.embedFont(openSansLightBytes)

    page.drawRectangle({
        x: 20 * mmToPt,
        y: (dinA4Height - 50 - 45) * mmToPt,
        width: 90 * mmToPt,
        height: 45 * mmToPt,
        borderWidth: 5,
        borderColor: rgb(0.75, 0.2, 0.2),
        color: rgb(1, 1, 1),
        opacity: 0,
        borderOpacity: 1
    })

    await addCustomerAddressBlock(data, page, openSansRegular, locale)
    await addSenderLineBlock(data, page, openSansRegular, locale)

    return pdfDoc
}
