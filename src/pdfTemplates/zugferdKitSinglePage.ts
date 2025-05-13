import * as fs from 'fs'
import { rgb } from 'pdf-lib'
import { PDFDocument } from 'pdf-lib'

import { availableProfiles } from '../core/factur-x'

export default async function zugferdKitSinglePage(data: availableProfiles, pdfDoc: PDFDocument): Promise<PDFDocument> {
    const openSansRegularBytes = fs.readFileSync('./assets/fonts/OpenSans/OpenSans-Regular.ttf')

    const page = pdfDoc.addPage([600, 400])
    const openSansRegular = await pdfDoc.embedFont(openSansRegularBytes)
    page.drawText(`Invoice-ID: ${data.document.id}, Total: ${data.totals.grossTotal} ${data.document.currency}`, {
        x: 50,
        y: 350,
        size: 30,
        color: rgb(0, 0, 0),
        font: openSansRegular
    })

    return pdfDoc
}
