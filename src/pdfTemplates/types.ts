import { PDFDocument } from 'pdf-lib'

import { availableProfiles } from '../core/factur-x'

export type ZugferdKitPDFTemplate = (data: availableProfiles, pdfDoc: PDFDocument) => Promise<PDFDocument>
