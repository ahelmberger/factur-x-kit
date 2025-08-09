import { FacturX } from '../../src';
import { ComfortProfile } from '../../src/profiles/comfort';
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    EXEMPTION_REASON_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES
} from '../../src/types/codes';
import { IPSIInvoice, IPSINoTaxInvoice } from './ruleObjects.ts/IPSI';
import { reverseChargeInvoice } from './ruleObjects.ts/reverseCharge';

describe('BR-IP', () => {
    describe('BR-IP-1', () => {
        test('BR-IP-1 positive test: VAT Breakdown available', async () => {
            const instance = await FacturX.fromObject(IPSIInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-1 negative test: VAT breakdown with wrong tax-category', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...reverseChargeInvoice.totals
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBeGreaterThan(1); // When there is no tax breakdown the sum will also be incorrect --> BR-IP-8 will also fail
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-1] An Invoice that contains an Invoice line (BG-25), a Document level allowance (BG-20) or a Document level charge (BG-21) where the VAT category code (BT-151, BT-95 or BT-102) is "IPSI" shall contain in the VAT breakdown (BG-23) at least one VAT category code (BT-118) equal with "IPSI".'
            );
        });
    });

    describe('BR-IP-2', () => {
        test('BR-IP-2 positive test: Seller VAT ID available', async () => {
            const instance = await FacturX.fromObject(IPSINoTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-2 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...IPSINoTaxInvoice,
                seller: { ...IPSINoTaxInvoice.seller, taxIdentification: undefined },
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
                    ...IPSINoTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: undefined,
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0,
                    sumWithoutAllowancesAndCharges: 135,
                    netTotal: 135,
                    taxBreakdown: [
                        {
                            ...IPSINoTaxInvoice.totals.taxBreakdown[0],
                            basisAmount: 135
                        }
                    ],
                    taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 135,
                    prepaidAmount: 0,
                    openAmount: 135
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-2 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...IPSINoTaxInvoice,
                seller: { ...IPSINoTaxInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...IPSINoTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: undefined,
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0,
                    sumWithoutAllowancesAndCharges: 135,
                    netTotal: 135,
                    taxBreakdown: [
                        {
                            ...IPSINoTaxInvoice.totals.taxBreakdown[0],
                            basisAmount: 135
                        }
                    ],
                    taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 135,
                    prepaidAmount: 0,
                    openAmount: 135
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "IPSI" shall contain the Seller VAT Identifier (BT-31), the Seller tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).'
            );
        });

        test('BR-IP-2 positive test: Only seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...IPSINoTaxInvoice,
                seller: { ...IPSINoTaxInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...IPSINoTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: undefined,
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0,
                    sumWithoutAllowancesAndCharges: 135,
                    netTotal: 135,
                    taxBreakdown: [
                        {
                            ...IPSINoTaxInvoice.totals.taxBreakdown[0],
                            basisAmount: 135
                        }
                    ],
                    taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 135,
                    prepaidAmount: 0,
                    openAmount: 135
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();
            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors?.length).toBeUndefined();
        });
    });

    describe('BR-IP-3', () => {
        test('BR-IP-3 positive test: Seller VAT available', async () => {
            const instance = await FacturX.fromObject(IPSINoTaxInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-3 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...IPSINoTaxInvoice,
                seller: { ...IPSINoTaxInvoice.seller, taxIdentification: undefined },
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
                    ...IPSINoTaxInvoice.totals,

                    documentLevelAllowancesAndCharges: {
                        ...IPSINoTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 15,
                    chargeTotalAmount: 0,
                    sumWithoutAllowancesAndCharges: 135,
                    netTotal: 120,
                    taxBreakdown: [
                        {
                            ...IPSINoTaxInvoice.totals.taxBreakdown[0],
                            basisAmount: 120
                        }
                    ],
                    taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 120,
                    prepaidAmount: 0,
                    openAmount: 120
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-3 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...IPSINoTaxInvoice,
                seller: { ...IPSINoTaxInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...IPSINoTaxInvoice.totals,

                    documentLevelAllowancesAndCharges: {
                        ...IPSINoTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 15,
                    chargeTotalAmount: 0,
                    sumWithoutAllowancesAndCharges: 135,
                    netTotal: 120,
                    taxBreakdown: [
                        {
                            ...IPSINoTaxInvoice.totals.taxBreakdown[0],
                            basisAmount: 120
                        }
                    ],
                    taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 120,
                    prepaidAmount: 0,
                    openAmount: 120
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(2);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-3] An Invoice that contains a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "IPSI" shall contain the Seller VAT Identifier (BT-31), the Seller tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).'
            );
        });

        test('BR-IP-3 positive test: only seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...IPSINoTaxInvoice,
                seller: { ...IPSINoTaxInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...IPSINoTaxInvoice.totals,

                    documentLevelAllowancesAndCharges: {
                        ...IPSINoTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 15,
                    chargeTotalAmount: 0,
                    sumWithoutAllowancesAndCharges: 135,
                    netTotal: 120,
                    taxBreakdown: [
                        {
                            ...IPSINoTaxInvoice.totals.taxBreakdown[0],
                            basisAmount: 120
                        }
                    ],
                    taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 120,
                    prepaidAmount: 0,
                    openAmount: 120
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors?.length).toBeUndefined();
        });
    });
    describe('BR-IP-4', () => {
        test('BR-IP-4 positive test: Seller VAT available', async () => {
            const instance = await FacturX.fromObject(IPSIInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-4 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...IPSINoTaxInvoice,
                seller: { ...IPSINoTaxInvoice.seller, taxIdentification: undefined },
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
                    ...IPSINoTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...IPSINoTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0.5,
                    sumWithoutAllowancesAndCharges: 135,
                    netTotal: 135.5,
                    taxBreakdown: [
                        {
                            ...IPSINoTaxInvoice.totals.taxBreakdown[0],
                            basisAmount: 135.5
                        }
                    ],
                    taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 135.5,
                    prepaidAmount: 0,
                    openAmount: 135.5
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-4 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...IPSINoTaxInvoice,
                seller: { ...IPSINoTaxInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...IPSINoTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...IPSINoTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0.5,
                    sumWithoutAllowancesAndCharges: 135,
                    netTotal: 135.5,
                    taxBreakdown: [
                        {
                            ...IPSINoTaxInvoice.totals.taxBreakdown[0],
                            basisAmount: 135.5
                        }
                    ],
                    taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 135.5,
                    prepaidAmount: 0,
                    openAmount: 135.5
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(2);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-4] An Invoice that contains a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "IPSI" shall contain the Seller VAT Identifier (BT-31), the Seller Tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).'
            );
        });

        test('BR-IP-4 positive test: only seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...IPSINoTaxInvoice,
                seller: { ...IPSINoTaxInvoice.seller, taxIdentification: { localTaxId: 'TaxID' } },
                totals: {
                    ...IPSINoTaxInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...IPSINoTaxInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0.5,
                    sumWithoutAllowancesAndCharges: 135,
                    netTotal: 135.5,
                    taxBreakdown: [
                        {
                            ...IPSINoTaxInvoice.totals.taxBreakdown[0],
                            basisAmount: 135.5
                        }
                    ],
                    taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 135.5,
                    prepaidAmount: 0,
                    openAmount: 135.5
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors?.length).toBeUndefined();
        });
    });

    describe('BR-IP-5', () => {
        test('BR-IP-5 positive test: Tax Rate in Line equals 0 or >0', async () => {
            const instance = await FacturX.fromObject(IPSIInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-5 negative test: Tax Rate in Line is undefined', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                invoiceLines: [
                    ...IPSIInvoice.invoiceLines,
                    {
                        generalLineData: { lineId: '4' },
                        productDescription: {
                            name: 'Premium Filter Cartridges'
                        },
                        productPriceAgreement: {
                            productNetPricing: {
                                netPricePerItem: 15
                            }
                        },
                        delivery: { itemQuantity: { quantity: 0, unit: 'KGM' as UNIT_CODES } },
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: TAX_CATEGORY_CODES.IPSI,
                                rateApplicablePercent: undefined
                            },
                            lineTotals: { netTotal: 0 }
                        }
                    }
                ]
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-5] In an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "IPSI" the invoiced item VAT rate (BT-152) shall be greater than 0 (zero).'
            );
        });

        test('BR-IP-5 negative test: Tax Rate in Line is negative', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                invoiceLines: [
                    ...IPSIInvoice.invoiceLines,
                    {
                        generalLineData: { lineId: '4' },
                        productDescription: {
                            name: 'Premium Filter Cartridges'
                        },
                        productPriceAgreement: {
                            productNetPricing: {
                                netPricePerItem: 15
                            }
                        },
                        delivery: { itemQuantity: { quantity: 0, unit: 'KGM' as UNIT_CODES } },
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: TAX_CATEGORY_CODES.IPSI,
                                rateApplicablePercent: -1
                            },
                            lineTotals: { netTotal: 0 }
                        }
                    }
                ]
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-5] In an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "IPSI" the invoiced item VAT rate (BT-152) shall be greater than 0 (zero).'
            );
        });
    });

    describe('BR-IP-6', () => {
        test('BR-IP-6 positive test: Tax Rate in allowance equals 0 or is >0', async () => {
            const instance = await FacturX.fromObject(IPSIInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-6 negative test: Tax Rate in allowance is <0', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...IPSIInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...IPSIInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            ...IPSIInvoice.totals.documentLevelAllowancesAndCharges!.allowances!,
                            {
                                actualAmount: 0,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.IPSI,
                                    rateApplicablePercent: -1
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
                '[BR-IP-6] In a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "IPSI" the Document level allowance VAT rate (BT-96) shall be 0 (zero) or greater than zero.'
            );
        });

        test('BR-IP-6 negative test: Tax Rate in allowance is undefined', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...IPSIInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...IPSIInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            ...IPSIInvoice.totals.documentLevelAllowancesAndCharges!.allowances!,
                            {
                                actualAmount: 0,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.IPSI,
                                    rateApplicablePercent: undefined
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
                '[BR-IP-6] In a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "IPSI" the Document level allowance VAT rate (BT-96) shall be 0 (zero) or greater than zero.'
            );
        });
    });

    describe('BR-IP-7', () => {
        test('BR-IP-7 positive test: Tax Rate in charge equals 0 or is >0', async () => {
            const instance = await FacturX.fromObject(IPSIInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-7 negative test: Tax Rate in charge is <0', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...IPSIInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...IPSIInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            ...IPSIInvoice.totals.documentLevelAllowancesAndCharges!.charges!,
                            {
                                actualAmount: 0,
                                reasonCode: CHARGE_REASONS_CODES.Acceptance,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.IPSI,
                                    rateApplicablePercent: -1
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
                '[BR-IP-7] In a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "IPSI" the Document level charge VAT rate (BT-103) shall be 0 (zero) or greater than zero.'
            );
        });

        test('BR-IP-7 negative test: Tax Rate in charge is undefined', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...IPSIInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...IPSIInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            ...IPSIInvoice.totals.documentLevelAllowancesAndCharges!.charges!,
                            {
                                actualAmount: 0,
                                reasonCode: CHARGE_REASONS_CODES.Acceptance,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.IPSI,
                                    rateApplicablePercent: undefined
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
                '[BR-IP-7] In a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "IPSI" the Document level charge VAT rate (BT-103) shall be 0 (zero) or greater than zero.'
            );
        });
    });

    describe('BR-IP-8', () => {
        test('BR-IP-8 positive test: tax basis is the correct sum', async () => {
            const instance = await FacturX.fromObject(IPSIInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-8 negative test: tax basis is not the correct sum of lines allowances and charges', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...IPSIInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 23.09,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 121.5,
                            categoryCode: TAX_CATEGORY_CODES.IPSI,
                            rateApplicablePercent: 19,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        },
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 35,
                            categoryCode: TAX_CATEGORY_CODES.IPSI,
                            rateApplicablePercent: 0,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        }
                    ]
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-8] For each different value of VAT category rate (BT-119) where the VAT category code (BT-118) is "IPSI", the VAT category taxable amount (BT-116) in a VAT breakdown (BG-23) shall equal the sum of Invoice line net amounts (BT-131) plus the sum of document level charge amounts (BT-99) minus the sum of document level allowance amounts (BT-92) where the VAT category code (BT-151, BT-102, BT-95) is "IPSI" and the VAT rate (BT-152, BT-103, BT-96) equals the VAT category rate (BT-119)..'
            );
        });

        test('BR-IP-8 negative test: tax breakdown is missing for a tax rate', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...IPSIInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 23.09,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 121.5,
                            categoryCode: TAX_CATEGORY_CODES.IPSI,
                            rateApplicablePercent: 19,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        }
                    ]
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-8] For each different value of VAT category rate (BT-119) where the VAT category code (BT-118) is "IPSI", the VAT category taxable amount (BT-116) in a VAT breakdown (BG-23) shall equal the sum of Invoice line net amounts (BT-131) plus the sum of document level charge amounts (BT-99) minus the sum of document level allowance amounts (BT-92) where the VAT category code (BT-151, BT-102, BT-95) is "IPSI" and the VAT rate (BT-152, BT-103, BT-96) equals the VAT category rate (BT-119)..'
            );
        });
    });

    describe('BR-IP-9', () => {
        test('BR-IP-9 positive test: tax calculated amount is correctly calculated', async () => {
            const instance = await FacturX.fromObject(IPSIInvoice);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });

        test('BR-IP-9 negative test: tax sum is not correctly calculated', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...IPSIInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 24.09,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 121.5,
                            categoryCode: TAX_CATEGORY_CODES.IPSI,
                            rateApplicablePercent: 19,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        },
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 30,
                            categoryCode: TAX_CATEGORY_CODES.IPSI,
                            rateApplicablePercent: 0,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        }
                    ],
                    taxTotal: [{ amount: 24.09, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 175.59,
                    prepaidAmount: 0,
                    roundingAmount: 0,
                    openAmount: 175.59
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();
            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(2); // BR-CO-17 checks the same, therefore 2 errors
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-9] The VAT category tax amount (BT-117) in a VAT breakdown (BG-23) where VAT category code (BT-118) is "IPSI" shall equal the VAT category taxable amount (BT-116) multiplied by the VAT category rate (BT-119).'
            );
        });
    });

    describe('BR-IP-10', () => {
        test('BR-IP-10 negative test: tax exemption reason is given', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...IPSIInvoice.totals,
                    taxBreakdown: [
                        { ...IPSIInvoice.totals.taxBreakdown[0] },
                        {
                            ...IPSIInvoice.totals.taxBreakdown[1],
                            exemptionReason: 'No Tax required here'
                        }
                    ]
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-10] A VAT Breakdown (BG-23) with VAT Category code (BT-118) "IPSI" shall not have a VAT exemption reason code (BT-121) or VAT exemption reason text (BT-120).'
            );
        });

        test('BR-IP-10 negative test: tax exemption reason code is given', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice,
                totals: {
                    ...IPSIInvoice.totals,
                    taxBreakdown: [
                        { ...IPSIInvoice.totals.taxBreakdown[0] },
                        {
                            ...IPSIInvoice.totals.taxBreakdown[1],
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Export_outside_the_EU
                        }
                    ]
                }
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();

            expect(validationResult.valid).toBeFalsy();
            expect(validationResult.errors?.length).toBe(1);
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-IP-10] A VAT Breakdown (BG-23) with VAT Category code (BT-118) "IPSI" shall not have a VAT exemption reason code (BT-121) or VAT exemption reason text (BT-120).'
            );
        });

        test('BR-IP-10 positive test: neither reason nor reason code is given', async () => {
            const data: ComfortProfile = {
                ...IPSIInvoice
            };
            const instance = await FacturX.fromObject(data);
            const validationResult = instance.validate();
            expect(validationResult.valid).toBeTruthy();
            expect(validationResult.errors).toBeUndefined();
        });
    });
});
