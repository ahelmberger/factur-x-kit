import { FacturX } from '../src';
import { TotalsCalculatorInputType } from '../src/adapter/totalsCalculator/easyInputType';
import { totalsCalculator } from '../src/adapter/totalsCalculator/totalsCalculator';
import { TAX_CATEGORY_CODES, UNIT_CODES } from '../src/types/codes';
import { designTestObject_preCalc } from './design_test_object_preCalc';

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
});
