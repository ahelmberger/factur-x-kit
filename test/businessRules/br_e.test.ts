import { FacturX } from '../../src';
import { ComfortProfile } from '../../src/profiles/comfort';
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    EXEMPTION_REASON_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE
} from '../../src/types/codes';
import { exemptFromTaxInvoice } from './ruleObjects.ts/exemptFromVat';

describe('BR-E', () => {
    describe('BR-E-1', () => {
        test('BR-E-1 positive test: VAT Breakdown available', async () => {
            const instance = await FacturX.fromObject(exemptFromTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-1 negative test: VAT breakdown with wrong tax-category', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'No Tax needed',
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(2); // When there is no tax breakdown the sum will also be incorrect --> BR-E-8 will also fail
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-1] An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value Exempt from VAT specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Exempt from VAT.'
            );
        });
    });

    describe('BR-E-2', () => {
        test('BR-E-2 positive test: Seller VAT ID available', async () => {
            const instance = await FacturX.fromObject(exemptFromTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-2 positive test: Seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                seller: { ...exemptFromTaxInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: undefined,
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-2 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                seller: { ...exemptFromTaxInvoice.seller, taxIdentification: undefined },
                sellerTaxRepresentative: {
                    name: 'Tax Representative',
                    postalAddress: {
                        country: COUNTRY_ID_CODES.GERMANY
                    },
                    taxIdentification: {
                        vatId: 'DE123456789'
                    }
                },
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: undefined,
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-2 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                seller: { ...exemptFromTaxInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: undefined,
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();
            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-2] An Invoice (INVOICE) that contains an item where the Invoiced item VAT category code (BT-151) has the value Exempt from VAT specified, must contain the Seller VAT identifier (BT-31), the Seller tax registration identifier (BT-32) or the Seller tax representative VAT identifier (BT-63).'
            );
        });
    });
    describe('BR-E-3', () => {
        test('BR-E-3 positive test: Seller VAT available', async () => {
            const instance = await FacturX.fromObject(exemptFromTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-3 positive test: Seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                seller: { ...exemptFromTaxInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [{ ...exemptFromTaxInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...exemptFromTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 1,
                    chargeTotalAmount: 0,
                    netTotal: 9,
                    grossTotal: 9,
                    prepaidAmount: 0,
                    openAmount: 9
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-3 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                seller: { ...exemptFromTaxInvoice.seller, taxIdentification: undefined },
                sellerTaxRepresentative: {
                    name: 'Tax Representative',
                    postalAddress: {
                        country: COUNTRY_ID_CODES.GERMANY
                    },
                    taxIdentification: {
                        vatId: 'DE123456789'
                    }
                },
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [{ ...exemptFromTaxInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...exemptFromTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 1,
                    chargeTotalAmount: 0,
                    netTotal: 9,
                    grossTotal: 9,
                    prepaidAmount: 0,
                    openAmount: 9
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-3 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                seller: { ...exemptFromTaxInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [{ ...exemptFromTaxInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...exemptFromTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 1,
                    chargeTotalAmount: 0,
                    netTotal: 9,
                    grossTotal: 9,
                    prepaidAmount: 0,
                    openAmount: 9
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(2);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value Exempt from VAT, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) must be present.'
            );
        });
    });
    describe('BR-E-4', () => {
        test('BR-E-4 positive test: Seller VAT available', async () => {
            const instance = await FacturX.fromObject(exemptFromTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-4 positive test: Seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                seller: { ...exemptFromTaxInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [{ ...exemptFromTaxInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...exemptFromTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 1,
                    netTotal: 11,
                    grossTotal: 11,
                    prepaidAmount: 0,
                    openAmount: 11
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-4 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                seller: { ...exemptFromTaxInvoice.seller, taxIdentification: undefined },
                sellerTaxRepresentative: {
                    name: 'Tax Representative',
                    postalAddress: {
                        country: COUNTRY_ID_CODES.GERMANY
                    },
                    taxIdentification: {
                        vatId: 'DE1234567811'
                    }
                },
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [{ ...exemptFromTaxInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...exemptFromTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 1,
                    netTotal: 11,
                    grossTotal: 11,
                    prepaidAmount: 0,
                    openAmount: 11
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-4 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                seller: { ...exemptFromTaxInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [{ ...exemptFromTaxInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...exemptFromTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 1,
                    netTotal: 11,
                    grossTotal: 11,
                    prepaidAmount: 0,
                    openAmount: 11
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(2);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value Exempt from VAT, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) must be present.'
            );
        });
    });

    describe('BR-E-5', () => {
        test('BR-E-5 positive test: Tax Rate in Line equals 0', async () => {
            const instance = await FacturX.fromObject(exemptFromTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-5 negative test: Tax Rate in Line is not 0', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                invoiceLines: [
                    {
                        ...exemptFromTaxInvoice.invoiceLines[0],
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                                rateApplicablePercent: 1
                            },
                            lineTotals: { netTotal: 5 }
                        }
                    },
                    { ...exemptFromTaxInvoice.invoiceLines[1] }
                ]
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-5] In an INVOICE LINE (BG-25), where Invoiced item VAT category code (BT-151) has the value Exempt from VAT, Invoiced item VAT rate (BT-152) must be equal to 0.'
            );
        });
    });

    describe('BR-E-6', () => {
        test('BR-E-6 positive test: Tax Rate in allowance equals 0', async () => {
            const instance = await FacturX.fromObject(exemptFromTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-6 negative test: Tax Rate in allowance is not 0', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...exemptFromTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            {
                                actualAmount: 1,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                                    rateApplicablePercent: 1
                                }
                            }
                        ]
                    }
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-6] In a DOCUMENT LEVEL ALLOWANCES (BG-20), where Document level allowance VAT category code (BT-95) has the value Exempt from VAT, Document level allowance VAT rate (BT-96) must be equal to 0.'
            );
        });
    });

    describe('BR-E-7', () => {
        test('BR-E-7 positive test: Tax Rate in allowance equals 0', async () => {
            const instance = await FacturX.fromObject(exemptFromTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-7 negative test: Tax Rate in allowance is not 0', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...exemptFromTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            {
                                actualAmount: 1,
                                reasonCode: CHARGE_REASONS_CODES.Fitting,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                                    rateApplicablePercent: 1
                                }
                            }
                        ]
                    }
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-7] In a DOCUMENT LEVEL CHARGES (BG-21), where Document level charge VAT category code (BT-102) has the value Exempt from VAT, Document level charge VAT rate (BT-103) must be equal to 0.'
            );
        });
    });

    describe('BR-E-8', () => {
        test('BR-E-8 positive test: tax basis is the correct sum', async () => {
            const instance = await FacturX.fromObject(exemptFromTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-8 negative test: tax basis is not the correct sum of lines allowances and charges', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'No Tax needed',
                            exemptionReasonCode:
                                EXEMPTION_REASON_CODES.Exempt_based_on_article_132_of_Council_Directive_2006_112_EC,
                            basisAmount: 12,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-8] In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value Exempt from VAT specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value Exempt from VAT specified.'
            );
        });
    });

    describe('BR-E-9', () => {
        test('BR-E-9 positive test: tax sum is 0', async () => {
            const instance = await FacturX.fromObject(exemptFromTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-9 negative test: tax sum is not 0', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 1,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'No Tax needed',
                            exemptionReasonCode:
                                EXEMPTION_REASON_CODES.Exempt_based_on_article_132_of_Council_Directive_2006_112_EC,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                            rateApplicablePercent: 0
                        }
                    ],

                    netTotal: 10,
                    taxTotal: [{ amount: 1, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 11,
                    prepaidAmount: 0,
                    openAmount: 11
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();
            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-9] The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value Exempt from VAT.'
            );
        });
    });

    describe('BR-E-10', () => {
        test('BR-E-10 positive test: tax exemption reason is given', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'No Tax needed',
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-10 positive test: correct tax exemption reason code is given', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: undefined,
                            exemptionReasonCode:
                                EXEMPTION_REASON_CODES.Exempt_based_on_article_132_of_Council_Directive_2006_112_EC,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-E-10 negative test: neither reason nor reason code is given', async () => {
            const data: ComfortProfile = {
                ...exemptFromTaxInvoice,
                totals: {
                    ...exemptFromTaxInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: undefined,
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();
            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-10] A VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Exempt from VAT must contain a VAT exemption reason code (BT-121) or a VAT exemption reason text (BT-120).'
            );
        });
    });
});
