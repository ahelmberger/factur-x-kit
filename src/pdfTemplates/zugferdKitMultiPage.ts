import * as fs from 'fs'
import { table } from 'console'
import { PageSizes, drawLine, rgb } from 'pdf-lib'
import { PDFDocument } from 'pdf-lib'

import { availableProfiles } from '../core/factur-x'
import addCustomerAddressBlock from './invoiceBlocks/customerAddressBlock'
import addIntroTextBlock from './invoiceBlocks/introTextBlock'
import addItemTable from './invoiceBlocks/itemTable/itemTable'
import addMetaBlock from './invoiceBlocks/metaDataBlock'
import addMonetarySummary from './invoiceBlocks/monetarySummary'
import addSenderLineBlock from './invoiceBlocks/senderLineBlock'
import addTitleBlock from './invoiceBlocks/titleBlock'
import { SupportedLocales, dinA4Height, mmToPt } from './types'

export default async function zugferdKitMultiPage(
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

    /*page.drawRectangle({
        x: 20 * mmToPt,
        y: (dinA4Height - 50 - 45) * mmToPt,
        width: 90 * mmToPt,
        height: 45 * mmToPt,
        borderWidth: 5,
        borderColor: rgb(0.75, 0.2, 0.2),
        color: rgb(1, 1, 1),
        opacity: 0,
        borderOpacity: 1
    })*/
    await addSenderLineBlock(data, page, openSansRegular, locale)
    const yCustomerAddress = await addCustomerAddressBlock(data, page, openSansRegular, locale)
    const yMetaBlock = await addMetaBlock(data, page, openSansRegular, openSansBold, locale)
    const yTitleBlock = await addTitleBlock(data, page, openSansBold, locale, {
        position: { y: yCustomerAddress - 50 }
    })
    const yIntroNoteBlock = await addIntroTextBlock(data, page, openSansRegular, locale, {
        position: { y: yTitleBlock - 20 }
    })

    page.drawLine({
        start: { x: 25 * mmToPt, y: yIntroNoteBlock - 15 },
        end: { x: page.getWidth() - 20 * mmToPt, y: yIntroNoteBlock - 15 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
        opacity: 1
    })

    const yMonetarySummary = await addMonetarySummary(data, page, openSansRegular, openSansBold, locale, {
        position: { y: yIntroNoteBlock - 30 }
    })

    page.drawLine({
        start: { x: 25 * mmToPt, y: yMonetarySummary - 6 },
        end: { x: page.getWidth() - 20 * mmToPt, y: yMonetarySummary - 6 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
        opacity: 1
    })

    const page2 = pdfDoc.addPage(PageSizes.A4) // Add a new page for the item table

    const [yItemTable, tableInformation] = await addItemTable(data, page2, openSansRegular, openSansBold, locale, {
        position: { y: (dinA4Height - 25) * mmToPt }
    })
    /*page.drawLine({
        start: { x: 0, y: yIntroNoteBlock },
        end: { x: 800, y: yIntroNoteBlock },
        thickness: 1,
        color: rgb(0.75, 0.2, 0.2),
        opacity: 1
    })*/

    return pdfDoc
}
