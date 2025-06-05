import * as fs from 'fs/promises'
import * as path from 'path'
import { PDFImage, PDFPage } from 'pdf-lib'

export interface ImageDimensions {
    width: number
    height: number
}

export async function addHeaderImage(imagePath: string, dimensions: ImageDimensions, page: PDFPage): Promise<void> {
    try {
        const imageBytes = await fs.readFile(imagePath)

        const pdfDoc = page.doc
        let embeddedImage: PDFImage

        const fileExtension = path.extname(imagePath).toLowerCase()
        if (fileExtension === '.png') {
            embeddedImage = await pdfDoc.embedPng(imageBytes)
        } else if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
            embeddedImage = await pdfDoc.embedJpg(imageBytes)
        } else {
            throw new Error('Unsupported image type. Only PNG and JPG/JPEG are supported.')
        }

        const pageWidth = page.getWidth()
        const pageHeight = page.getHeight()

        const x = pageWidth - dimensions.width
        const y = pageHeight - dimensions.height

        page.drawImage(embeddedImage, {
            x: x,
            y: y,
            width: dimensions.width,
            height: dimensions.height
        })
    } catch (error) {
        console.error('Error when trying to print header to pdf:', error)
        throw error
    }
}
