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
import { exportOutsideEUInvoice } from './ruleObjects.ts/exportOutsideEU';

describe('BR-G', () => {
    describe('BR-G-1', () => {
        test('BR-G-1 positive test: VAT Breakdown available', async () => {
            const instance = await FacturX.fromObject(exportOutsideEUInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-G-1 negative test: VAT breakdown with wrong tax-category', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                totals: {
                    ...exportOutsideEUInvoice.totals,
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
            expect(validationResult.errors?.length).toBe(2); // When there is no tax breakdown the sum will also be incorrect --> BR-G-8 will also fail
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-G-1] An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value Export outside the EU specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Export outside the EU.'
            );
        });
    });

    describe('BR-G-2', () => {
        test('BR-G-2 positive test: Seller VAT ID available', async () => {
            const instance = await FacturX.fromObject(exportOutsideEUInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-G-2 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                seller: { ...exportOutsideEUInvoice.seller, taxIdentification: undefined },
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
                    ...exportOutsideEUInvoice.totals,
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

        test('BR-G-2 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                seller: { ...exportOutsideEUInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...exportOutsideEUInvoice.totals,
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
                '[BR-G-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Export outside the EU" shall contain the Seller VAT Identifier (BT-31) or the Seller tax representative VAT identifier (BT-63).'
            );
        });

        test('BR-G-2 negative test: Only seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                seller: { ...exportOutsideEUInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...exportOutsideEUInvoice.totals,
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
                '[BR-G-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Export outside the EU" shall contain the Seller VAT Identifier (BT-31) or the Seller tax representative VAT identifier (BT-63).'
            );
        });
    });
    describe('BR-G-3', () => {
        test('BR-G-3 positive test: Seller VAT available', async () => {
            const instance = await FacturX.fromObject(exportOutsideEUInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-G-3 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                seller: { ...exportOutsideEUInvoice.seller, taxIdentification: undefined },
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
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [{ ...exportOutsideEUInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...exportOutsideEUInvoice.totals.documentLevelAllowancesAndCharges,
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

        test('BR-G-3 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                seller: { ...exportOutsideEUInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [{ ...exportOutsideEUInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...exportOutsideEUInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-G-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value Export outside the EU, either the Seller VAT identifier (BT-31) or Seller tax representative VAT identifier (BT-63) must be present.'
            );
        });

        test('BR-G-3 negative test: only seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                seller: { ...exportOutsideEUInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [{ ...exportOutsideEUInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...exportOutsideEUInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-G-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value Export outside the EU, either the Seller VAT identifier (BT-31) or Seller tax representative VAT identifier (BT-63) must be present.'
            );
        });
    });
    describe('BR-G-4', () => {
        test('BR-G-4 positive test: Seller VAT available', async () => {
            const instance = await FacturX.fromObject(exportOutsideEUInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-G-4 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                seller: { ...exportOutsideEUInvoice.seller, taxIdentification: undefined },
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
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [{ ...exportOutsideEUInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...exportOutsideEUInvoice.totals.documentLevelAllowancesAndCharges,
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

        test('BR-G-4 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                seller: { ...exportOutsideEUInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [{ ...exportOutsideEUInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...exportOutsideEUInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-G-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value Export outside the EU, either the Seller VAT identifier (BT-31) or Seller tax representative VAT identifier (BT-63).'
            );
        });

        test('BR-G-4 negative test: only seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                seller: { ...exportOutsideEUInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [{ ...exportOutsideEUInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...exportOutsideEUInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-G-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value Export outside the EU, either the Seller VAT identifier (BT-31) or Seller tax representative VAT identifier (BT-63).'
            );
        });
    });

    describe('BR-G-5', () => {
        test('BR-G-5 positive test: Tax Rate in Line equals 0', async () => {
            const instance = await FacturX.fromObject(exportOutsideEUInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-G-5 negative test: Tax Rate in Line is not 0', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                invoiceLines: [
                    {
                        ...exportOutsideEUInvoice.invoiceLines[0],
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED,
                                rateApplicablePercent: 1
                            },
                            lineTotals: { netTotal: 5 }
                        }
                    },
                    { ...exportOutsideEUInvoice.invoiceLines[1] }
                ]
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-G-5] In an INVOICE LINE (BG-25), where Invoiced item VAT category code (BT-151) has the value Export outside the EU, Invoiced item VAT rate (BT-152) must be equal to 0.'
            );
        });
    });

    describe('BR-G-6', () => {
        test('BR-G-6 positive test: Tax Rate in allowance equals 0', async () => {
            const instance = await FacturX.fromObject(exportOutsideEUInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-G-6 negative test: Tax Rate in allowance is not 0', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...exportOutsideEUInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            {
                                actualAmount: 1,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED,
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
                '[BR-G-6] In a DOCUMENT LEVEL ALLOWANCES (BG-20), where Document level allowance VAT category code (BT-95) has the value Export outside the EU, Document level allowance VAT rate (BT-96) must be equal to 0.'
            );
        });
    });

    describe('BR-G-7', () => {
        test('BR-G-7 positive test: Tax Rate in allowance equals 0', async () => {
            const instance = await FacturX.fromObject(exportOutsideEUInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-G-7 negative test: Tax Rate in allowance is not 0', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...exportOutsideEUInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            {
                                actualAmount: 1,
                                reasonCode: CHARGE_REASONS_CODES.Fitting,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED,
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
                '[BR-G-7] In a DOCUMENT LEVEL CHARGES (BG-21), where Document level charge VAT category code (BT-102) has the value Export outside the EU, Document level charge VAT rate (BT-103) must be equal to 0.'
            );
        });
    });

    describe('BR-G-8', () => {
        test('BR-G-8 positive test: tax basis is the correct sum', async () => {
            const instance = await FacturX.fromObject(exportOutsideEUInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-G-8 negative test: tax basis is not the correct sum of lines allowances and charges', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'No Tax needed',
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Export_outside_the_EU,
                            basisAmount: 12,
                            categoryCode: TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED,
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
                '[BR-G-8] In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value Export outside the EU specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value Export outside the EU specified.'
            );
        });
    });

    describe('BR-G-9', () => {
        test('BR-G-9 positive test: tax sum is 0', async () => {
            const instance = await FacturX.fromObject(exportOutsideEUInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-G-9 negative test: tax sum is not 0', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 1,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Export Outside EU',
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Export_outside_the_EU,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED,
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
                '[BR-G-9] The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value Export outside the EU.'
            );
        });
    });

    describe('BR-G-10', () => {
        test('BR-G-10 positive test: tax exemption reason is given', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'No Tax needed',
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED,
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

        test('BR-G-10 positive test: correct tax exemption reason code is given', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: undefined,
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Export_outside_the_EU,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED,
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

        test('BR-G-10 negative test: neither reason nor reason code is given', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: undefined,
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED,
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
                '[BR-G-10] A VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Export outside the EU must contain a VAT exemption reason code (BT-121) with the value Export outside the EU or a VAT exemption reason text (BT-120) with the value Export outside the EU (or the equivalent in another language).'
            );
        });

        test('BR-G-10 negative test: wrong reason code is given', async () => {
            const data: ComfortProfile = {
                ...exportOutsideEUInvoice,
                totals: {
                    ...exportOutsideEUInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'export outside eu',
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Reverse_charge,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXPORT_TAX_NOT_CHARGED,
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
                '[BR-G-10] A VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Export outside the EU must contain a VAT exemption reason code (BT-121) with the value Export outside the EU or a VAT exemption reason text (BT-120) with the value Export outside the EU (or the equivalent in another language).'
            );
        });
    });
});
