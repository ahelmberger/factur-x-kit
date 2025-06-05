import { Schema } from 'node-schematron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { printNode, zodToTs } from 'zod-to-ts'

import { FacturX } from '../src/core/factur-x'
import zugferdKitMultiPage from '../src/pdfTemplates/zugferdKitMultiPage'
import { ZBasicWithoutLinesProfile } from '../src/profiles/basicwithoutlines/BasicWithoutLinesProfile'
import { ZBasicWithoutLinesProfileXml } from '../src/profiles/basicwithoutlines/BasicWithoutLinesProfileXml'
import { ZComfortProfile } from '../src/profiles/comfort'
import { ZBasicTradeLineItem } from '../src/types/ram/IncludedSupplyChainTradeLineItem/BasicTradeLineItem'
import { ZComfortTradeLineItem } from '../src/types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem'
import { designTestObject } from './design_test_object'
import { designTestObject_easy } from './design_test_object_easy'
import { testDesignObjectKleinunternehmer } from './design_test_object_kleinunternehmer'
import './profiles/codeDb/xPathDocumentFunction'
import { testComfortProfile } from './profiles/comfort_test_objects'

// This is just a testcase which helps me printing out the ts-objects which are built from the zod types

describe('playground', () => {
    it('shall run', () => {
        const identifier = 'User'
        const { node } = zodToTs(ZBasicWithoutLinesProfile, identifier)
        const nodeString = printNode(node)
        //console.log(nodeString)

        const identifier2 = 'bas'
        const { node: node2 } = zodToTs(ZBasicWithoutLinesProfileXml, identifier2)
        const nodeString2 = printNode(node2)
        // console.log(nodeString2)

        const identifier3 = 'Line'
        const { node: node3 } = zodToTs(ZComfortTradeLineItem, identifier3)
        //console.log(printNode(node3))

        const identifier4 = 'comfort'
        const { node: node4 } = zodToTs(ZComfortProfile, identifier4)
        const nodeString4 = printNode(node4)
        //console.log(nodeString4)
    })
})

describe('factur-x validity check', () => {
    let xml: string
    beforeAll(async () => {
        xml = await fs.readFile('C:/Users/User/Documents/factur-x_bwl.xml', 'utf-8')
    })

    test('Builds Valid XML According to SCHEMATRON Schema', async () => {
        const schematron = (
            await fs.readFile(
                path.join(__dirname, 'profiles', 'schematronSchemes', 'Factur-X_1.0.07_BASICWL.sch'),
                'utf-8'
            )
        ).toString()

        const schema = Schema.fromString(schematron)

        const result = schema.validateString(xml)

        if (result.length > 0) console.log(result.map(res => res.message?.trim()))

        expect(result.length).toBe(0)
    })
})

describe.only('pdf-creation', () => {
    test.only('pdf creation', async () => {
        const instance = await FacturX.fromObject(designTestObject_easy)
        const pdfBytesDE = await instance.getPDF({
            locale: 'de-DE'
        })
        expect(pdfBytesDE).toBeDefined()
        await fs.writeFile(path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_DE.pdf'), pdfBytesDE)

        const pdfBytesEN = await instance.getPDF({
            locale: 'en-US'
        })
        expect(pdfBytesEN).toBeDefined()
        await fs.writeFile(path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_EN.pdf'), pdfBytesEN)

        const pdfBytesFR = await instance.getPDF({
            locale: 'fr-FR'
        })
        expect(pdfBytesFR).toBeDefined()
        await fs.writeFile(path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_FR.pdf'), pdfBytesFR)

        const complexInstance = await FacturX.fromObject(designTestObject)
        const pdfBytesDE_multiPage = await complexInstance.getPDF({
            locale: 'de-DE'
        })
        expect(pdfBytesDE_multiPage).toBeDefined()
        await fs.writeFile(
            path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_DE_MultiPage.pdf'),
            pdfBytesDE_multiPage
        )

        const kleinunternehmerInstance = await FacturX.fromObject(testDesignObjectKleinunternehmer)
        const pdfBytesDE_Kleinunternehmer = await kleinunternehmerInstance.getPDF({
            locale: 'de-DE'
        })
        expect(pdfBytesDE_Kleinunternehmer).toBeDefined()
        await fs.writeFile(
            path.join(__dirname, 'pdfs', 'createdPDFs', 'PDF_DESIGN_DE_Kleinunternehmer.pdf'),
            pdfBytesDE_Kleinunternehmer
        )
    })
})
