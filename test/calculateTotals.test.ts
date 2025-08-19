import { Schema } from 'node-schematron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { validateXML } from 'xmllint-wasm';

import { FacturX } from '../src';
import { TotalsCalculatorInputType } from '../src/adapter/totalsCalculator/easyInputType';
import { totalsCalculator } from '../src/adapter/totalsCalculator/totalsCalculator';
import { TAX_CATEGORY_CODES, UNIT_CODES } from '../src/types/codes';
import { designTestObject_preCalc } from './design_test_object_preCalc';
import './profiles/codeDb/xPathDocumentFunction';

describe('calculate totals', () => {
    test.todo('Make proper unit tests for totalsCalculator functions');
    test('System Test: calculate totals for comfort profile with every Tax but "Not subject to VAT Tax" ', async () => {
        const invoiceData = totalsCalculator(designTestObject_preCalc);
        const instance = await FacturX.fromObject(invoiceData);
        const checkProfile = instance.validate();
        expect(checkProfile.valid).toBeTruthy();
    });

    test('System Test: calculate totals for comfort profile with "Not subject to VAT" Tax', async () => {
        const data: TotalsCalculatorInputType = {
            ...designTestObject_preCalc,
            seller: { ...designTestObject_preCalc.seller, taxIdentification: undefined },
            buyer: { ...designTestObject_preCalc.buyer, taxIdentification: undefined },
            invoiceLines: [
                {
                    generalLineData: { lineId: '3' },
                    productDescription: {
                        name: 'Item StandardRate'
                    },
                    productPriceAgreement: {
                        productPricing: {
                            basisPricePerItem: 15
                        }
                    },
                    delivery: { itemQuantity: { quantity: 2, unit: 'KGM' as UNIT_CODES } },
                    settlement: {
                        tax: {
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT
                        }
                    }
                }
            ],
            totals: { ...designTestObject_preCalc.totals, documentLevelAllowancesAndCharges: undefined }
        };
        const invoiceData = totalsCalculator(data);
        const instance = await FacturX.fromObject(invoiceData);

        const checkProfile = instance.validate();
        expect(checkProfile.valid).toBeTruthy();
    });

    describe('Build and check XML', () => {
        test('Check XML against XSD Schemes', async () => {
            const invoiceData = totalsCalculator(designTestObject_preCalc);
            const instance = await FacturX.fromObject(invoiceData);

            const convertedXML = await instance.getXML();
            if (!convertedXML) {
                throw new Error('XSD Check could not be performed as XML conversion failed');
            }

            const xsd = await fs.readFile(
                path.join(__dirname, 'profiles', 'xsdSchemes', 'COMFORT', 'Factur-X_1.0.07_EN16931.xsd'),
                'utf-8'
            );

            const xsdImports = [
                'Factur-X_1.0.07_EN16931_urn_un_unece_uncefact_data_standard_QualifiedDataType_100.xsd',
                'Factur-X_1.0.07_EN16931_urn_un_unece_uncefact_data_standard_ReusableAggregateBusinessInformationEntity_100.xsd',
                'Factur-X_1.0.07_EN16931_urn_un_unece_uncefact_data_standard_UnqualifiedDataType_100.xsd'
            ];

            const preload: { fileName: string; contents: string }[] = [];

            for (const fileName of xsdImports) {
                const contents = await fs.readFile(
                    path.join(__dirname, 'profiles', 'xsdSchemes', 'COMFORT', fileName),
                    'utf-8'
                );
                preload.push({
                    fileName,
                    contents
                });
            }
            const result = await validateXML({
                xml: [
                    {
                        fileName: 'e-invoice.xml',
                        contents: convertedXML
                    }
                ],
                schema: [xsd],
                preload
            });

            if (!result.valid) console.log(result.errors);
            expect(result.valid).toBe(true);
        });

        test('Builds Valid XML According to SCHEMATRON Schema', async () => {
            const invoiceData = totalsCalculator(designTestObject_preCalc);
            const instance = await FacturX.fromObject(invoiceData);

            const convertedXML = await instance.getXML();

            const schematron = (
                await fs.readFile(
                    path.join(__dirname, 'profiles', 'schematronSchemes', 'Factur-X_1.0.07_EN16931.sch'),
                    'utf-8'
                )
            ).toString();

            const schema = Schema.fromString(schematron);

            const result = schema.validateString(convertedXML);

            if (result.length > 0) console.log(result.map(res => res.message?.trim()));

            expect(result.length).toBe(0);
        });
    });
});
