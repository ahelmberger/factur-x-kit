import { FacturX } from '../../src/index';
import { ComfortProfile } from '../../src/profiles/comfort';
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    CURRENCY_CODES,
    PAYMENT_MEANS_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE
} from '../../src/types/codes';
import { noTaxEasy } from './ruleObjects.ts/noTaxEasy';
import { standardTestObject } from './ruleObjects.ts/standardFull';

let instance: FacturX;

describe('br-16', () => {
    test('BR-16 positive test', async () => {
        instance = await FacturX.fromObject(standardTestObject);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-16 negative test', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [],
            totals: {
                netTotal: 0,
                sumWithoutAllowancesAndCharges: 0,
                taxBreakdown: [
                    {
                        typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                        categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                        basisAmount: 0,
                        calculatedAmount: 0,
                        rateApplicablePercent: 0,
                        exemptionReason: 'Exempt from tax'
                    }
                ],
                grossTotal: 0,
                openAmount: 0
            } // No invoice lines
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(1);
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-16] An Invoice (INVOICE) must contain at least one Invoice Line (invoiceLine - BG-25).'
        );
    });
});

describe('br-21', () => {
    test('BR-21 positive test', async () => {
        instance = await FacturX.fromObject(standardTestObject);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-21 negative test', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                { ...standardTestObject.invoiceLines[0], generalLineData: { lineId: '1' } },
                { ...standardTestObject.invoiceLines[1], generalLineData: { lineId: '1' } }
            ]
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(1);
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-21] Every Invoice Line (invoiceLine - BG-25) needs to have a unique lineId (BT-126).'
        );
    });
});

describe('br-27', () => {
    test('BR-27 positive test', async () => {
        instance = await FacturX.fromObject(noTaxEasy);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-27 negative test', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            invoiceLines: [
                {
                    ...noTaxEasy.invoiceLines[0],
                    productPriceAgreement: {
                        ...noTaxEasy.invoiceLines[0].productPriceAgreement,
                        productPricing: undefined,
                        productNetPricing: { netPricePerItem: -10 }
                    },
                    settlement: {
                        ...noTaxEasy.invoiceLines[0].settlement,
                        lineTotals: { netTotal: -10 }
                    }
                }
            ],
            totals: {
                taxBreakdown: [
                    {
                        calculatedAmount: 0,
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        exemptionReason: 'Umsatzsteuerbefreit nach §19 UStG',
                        basisAmount: -10,
                        categoryCode: 'E' as TAX_CATEGORY_CODES,
                        rateApplicablePercent: 0
                    }
                ],
                sumWithoutAllowancesAndCharges: -10,
                chargeTotalAmount: 0,
                allowanceTotalAmount: 0,
                netTotal: -10,
                taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: -10,
                prepaidAmount: 0,
                openAmount: -10
            }
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();

        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(1);
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-27] The netPricePerItem (BT-146) of each invoice line must not be negative.'
        );
    });
});

describe('br-28', () => {
    test('BR-28 positive test', async () => {
        instance = await FacturX.fromObject(noTaxEasy);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-28 negative test', async () => {
        // Weird case where the basisPricePerItem is negative, but the netPricePerItem is positive usually BR-27 will also always fail, but we want to test everyithing isolated here
        const data: ComfortProfile = {
            ...noTaxEasy,
            invoiceLines: [
                {
                    ...noTaxEasy.invoiceLines[0],
                    productPriceAgreement: {
                        ...noTaxEasy.invoiceLines[0].productPriceAgreement,
                        productPricing: {
                            basisPricePerItem: -10,
                            priceAllowancesAndCharges: {
                                allowances: [
                                    {
                                        actualAmount: -20
                                    }
                                ]
                            }
                        },
                        productNetPricing: { netPricePerItem: 10 }
                    },
                    settlement: {
                        ...noTaxEasy.invoiceLines[0].settlement,
                        lineTotals: { netTotal: 10 }
                    }
                }
            ],
            totals: {
                taxBreakdown: [
                    {
                        calculatedAmount: 0,
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        exemptionReason: 'Umsatzsteuerbefreit nach §19 UStG',
                        basisAmount: 10,
                        categoryCode: 'E' as TAX_CATEGORY_CODES,
                        rateApplicablePercent: 0
                    }
                ],
                sumWithoutAllowancesAndCharges: 10,
                chargeTotalAmount: 0,
                allowanceTotalAmount: 0,
                netTotal: 10,
                taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 10,
                prepaidAmount: 0,
                openAmount: 10
            }
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();

        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(1);
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-28] The basisPricePerItem (BT-148) of each invoice line must not be negative.'
        );
    });
});

describe('br-29', () => {
    test('BR-29 positive test: Start before End', async () => {
        const dataStartBeforeEnd: ComfortProfile = {
            ...noTaxEasy,
            delivery: {
                ...noTaxEasy.delivery,
                billingPeriod: {
                    startDate: {
                        year: 2025,
                        month: 7,
                        day: 24
                    },
                    endDate: {
                        year: 2025,
                        month: 7,
                        day: 25
                    } // End date before start date
                }
            }
        };
        instance = await FacturX.fromObject(dataStartBeforeEnd);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-29 positive test: Start and End same', async () => {
        const dataStartEqualsEnd: ComfortProfile = {
            ...noTaxEasy,
            delivery: {
                ...noTaxEasy.delivery,
                billingPeriod: {
                    startDate: {
                        year: 2025,
                        month: 7,
                        day: 24
                    },
                    endDate: {
                        year: 2025,
                        month: 7,
                        day: 24
                    } // End date before start date
                }
            }
        };
        instance = await FacturX.fromObject(dataStartEqualsEnd);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-29 negative test', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            delivery: {
                ...noTaxEasy.delivery,
                billingPeriod: {
                    startDate: {
                        year: 2025,
                        month: 7,
                        day: 25
                    },
                    endDate: {
                        year: 2025,
                        month: 7,
                        day: 24
                    } // End date before start date
                }
            }
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();

        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(1);
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-29] If start- and end date of the billing Period is given, the endDate (BT-74) must be on or after the startDate (BT-73).'
        );
    });
});

describe('br-30', () => {
    test('BR-29 positive test: Start before End', async () => {
        const dataStartBeforeEnd: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                { ...standardTestObject.invoiceLines[0] },
                {
                    ...standardTestObject.invoiceLines[1],
                    settlement: {
                        ...standardTestObject.invoiceLines[1].settlement,
                        billingPeriod: {
                            startDate: {
                                year: 2025,
                                month: 7,
                                day: 23
                            },
                            endDate: {
                                year: 2025,
                                month: 7,
                                day: 24
                            }
                        }
                    }
                }
            ]
        };
        instance = await FacturX.fromObject(dataStartBeforeEnd);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-30 positive test: Start and End same', async () => {
        const dataStartEqualsEnd: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                { ...standardTestObject.invoiceLines[0] },
                {
                    ...standardTestObject.invoiceLines[1],
                    settlement: {
                        ...standardTestObject.invoiceLines[1].settlement,
                        billingPeriod: {
                            startDate: {
                                year: 2025,
                                month: 7,
                                day: 24
                            },
                            endDate: {
                                year: 2025,
                                month: 7,
                                day: 24
                            }
                        }
                    }
                }
            ]
        };
        instance = await FacturX.fromObject(dataStartEqualsEnd);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-30 negative test', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                { ...standardTestObject.invoiceLines[0] },
                {
                    ...standardTestObject.invoiceLines[1],
                    settlement: {
                        ...standardTestObject.invoiceLines[1].settlement,
                        billingPeriod: {
                            startDate: {
                                year: 2025,
                                month: 7,
                                day: 24
                            },
                            endDate: {
                                year: 2025,
                                month: 7,
                                day: 23
                            }
                        }
                    }
                }
            ]
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();

        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(1);
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-30] If the start and end dates of the invoice line period are given, the Invoice line period end date (BT-135) must be on or after the Invoice line period start date (BT-134).'
        );
    });
});

describe('br-33', () => {
    test('BR-33 positive test: allowoance reason only', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                documentLevelAllowancesAndCharges: {
                    ...standardTestObject.totals.documentLevelAllowancesAndCharges,
                    allowances: [
                        {
                            actualAmount: 14,
                            reason: 'Test reason',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                }
            }
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-33 positive test: allowoance reason code only', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                documentLevelAllowancesAndCharges: {
                    ...standardTestObject.totals.documentLevelAllowancesAndCharges,
                    allowances: [
                        {
                            actualAmount: 14,
                            reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                }
            }
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-33 negative test', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                documentLevelAllowancesAndCharges: {
                    ...standardTestObject.totals.documentLevelAllowancesAndCharges,
                    allowances: [
                        {
                            actualAmount: 14,
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                }
            }
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();

        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(2); //This is 2 because BR-33 and BR-CO-21 are checking the exact same thing. Therefore no exclusive check of BR-33 possible
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-33] Any DOCUMENT LEVEL ALLOWANCES (BG-20) for the invoice as a whole must have a Document level allowance reason (BT-97) or a corresponding Document level allowance reason code (BT-98).'
        );
    });
});

describe('br-38', () => {
    test('BR-38 positive test: charge reason only', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                documentLevelAllowancesAndCharges: {
                    ...standardTestObject.totals.documentLevelAllowancesAndCharges,
                    charges: [
                        {
                            actualAmount: 0.5,
                            reason: 'Standard Shipping Fee',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                }
            }
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-38 positive test: allowoance reason code only', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                documentLevelAllowancesAndCharges: {
                    ...standardTestObject.totals.documentLevelAllowancesAndCharges,
                    charges: [
                        {
                            actualAmount: 0.5,
                            reasonCode: 'FC' as CHARGE_REASONS_CODES, // Freight charges
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                }
            }
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-38 negative test', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                documentLevelAllowancesAndCharges: {
                    ...standardTestObject.totals.documentLevelAllowancesAndCharges,
                    charges: [
                        {
                            actualAmount: 0.5,
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                }
            }
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();

        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(2); //This is 2 because BR-38 and BR-CO-22 are checking the exact same thing. Therefore no exclusive check of BR-33 possible
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-38] Each Document level charge (BG-21) must include a Document level charge reason (BT-104) or a corresponding Document level charge reason code (BT-105).'
        );
    });
});

describe('br-42', () => {
    test('BR-42 positive test: allowoance reason only', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                {
                    ...standardTestObject.invoiceLines[0],
                    settlement: {
                        ...standardTestObject.invoiceLines[0].settlement,
                        lineLevelAllowancesAndCharges: {
                            ...standardTestObject.invoiceLines[0].settlement.lineLevelAllowancesAndCharges,
                            allowances: [
                                {
                                    actualAmount: 6,
                                    reason: 'Volume Discount Applied'
                                }
                            ]
                        }
                    }
                },
                { ...standardTestObject.invoiceLines[1] }
            ]
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-42 positive test: allowoance reason code only', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                {
                    ...standardTestObject.invoiceLines[0],
                    settlement: {
                        ...standardTestObject.invoiceLines[0].settlement,
                        lineLevelAllowancesAndCharges: {
                            ...standardTestObject.invoiceLines[0].settlement.lineLevelAllowancesAndCharges,
                            allowances: [
                                {
                                    actualAmount: 6,
                                    reasonCode: '95' as ALLOWANCE_REASONS_CODES
                                }
                            ]
                        }
                    }
                },
                { ...standardTestObject.invoiceLines[1] }
            ]
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-42 negative test', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                {
                    ...standardTestObject.invoiceLines[0],
                    settlement: {
                        ...standardTestObject.invoiceLines[0].settlement,
                        lineLevelAllowancesAndCharges: {
                            ...standardTestObject.invoiceLines[0].settlement.lineLevelAllowancesAndCharges,
                            allowances: [
                                {
                                    actualAmount: 6
                                }
                            ]
                        }
                    }
                },
                { ...standardTestObject.invoiceLines[1] }
            ]
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();

        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(2); //This is 2 because BR-42 and BR-CO-23 are checking the exact same thing. Therefore no exclusive check of BR-42 possible
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-42] Each Invoice line âllowance (BG-27) must include an Invoice line allowance reason (BT-139) or a corresponding Invoice line allowance reason code (BT-140).'
        );
    });
});

describe('br-44', () => {
    test('BR-44 positive test: charge reason only', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                {
                    ...standardTestObject.invoiceLines[0],
                    settlement: {
                        ...standardTestObject.invoiceLines[0].settlement,
                        lineLevelAllowancesAndCharges: {
                            ...standardTestObject.invoiceLines[0].settlement.lineLevelAllowancesAndCharges,
                            charges: [
                                {
                                    actualAmount: 1,
                                    reason: 'Special Handling Fee'
                                }
                            ]
                        }
                    }
                },
                { ...standardTestObject.invoiceLines[1] }
            ]
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-44 positive test: charge reason code only', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                {
                    ...standardTestObject.invoiceLines[0],
                    settlement: {
                        ...standardTestObject.invoiceLines[0].settlement,
                        lineLevelAllowancesAndCharges: {
                            ...standardTestObject.invoiceLines[0].settlement.lineLevelAllowancesAndCharges,
                            charges: [
                                {
                                    actualAmount: 1,
                                    reasonCode: 'ZZZ' as CHARGE_REASONS_CODES
                                }
                            ]
                        }
                    }
                },
                { ...standardTestObject.invoiceLines[1] }
            ]
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-44 negative test', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            invoiceLines: [
                {
                    ...standardTestObject.invoiceLines[0],
                    settlement: {
                        ...standardTestObject.invoiceLines[0].settlement,
                        lineLevelAllowancesAndCharges: {
                            ...standardTestObject.invoiceLines[0].settlement.lineLevelAllowancesAndCharges,
                            charges: [
                                {
                                    actualAmount: 1
                                }
                            ]
                        }
                    }
                },
                { ...standardTestObject.invoiceLines[1] }
            ]
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();

        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(2); //This is 2 because BR-42 and BR-CO-24 are checking the exact same thing. Therefore no exclusive check of BR-42 possible
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-44] Each Invoice line charges (BG-28) must include an Invoice line charge reason (BT-144) or a corresponding Invoice line charge reason code (BT-145).'
        );
    });
});

describe('br-53', () => {
    test('BR-53 positive test: no tax currency', async () => {
        const data: ComfortProfile = standardTestObject;

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-53 positive test: tax currency with tax in tax currency', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                taxCurrency: CURRENCY_CODES.USDollar,
                taxTotal: [
                    { amount: 23.09, currency: 'EUR' as CURRENCY_CODES },
                    { amount: 27.12, currency: CURRENCY_CODES.USDollar }
                ]
            }
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-53 negative test: tax currency without tax in tax currency', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                taxCurrency: CURRENCY_CODES.USDollar,
                taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }]
            }
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(1);
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-53] If a currency for VAT accounting has been specified, the Invoice total VAT amount in accounting currency (BT-111) must be provided.'
        );
    });
});

describe('br-61', () => {
    test('BR-61 positive test: Non-SEPA Credit Transfer with payee bank account', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            paymentInformation: {
                ...standardTestObject.paymentInformation,
                paymentMeans: [
                    {
                        description: 'International Commerce Bank',
                        paymentType: PAYMENT_MEANS_CODES.Credit_transfer,
                        payeeBankAccount: {
                            iban: 'GB29NWBK60161331926819',
                            bic: 'NWBKGB2L',
                            accountName: 'Apex Solutions Ltd.'
                        }
                    }
                ]
            }
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-61 positive test: SEPA Credit Transfer with payee bank account', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            paymentInformation: {
                ...standardTestObject.paymentInformation,
                paymentMeans: [
                    {
                        description: 'International Commerce Bank',
                        paymentType: PAYMENT_MEANS_CODES.SEPA_credit_transfer,
                        payeeBankAccount: {
                            iban: 'GB29NWBK60161331926819',
                            bic: 'NWBKGB2L',
                            accountName: 'Apex Solutions Ltd.'
                        }
                    }
                ]
            }
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-61 positive test: Other Payment Mean without payee bank account', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            paymentInformation: {
                ...standardTestObject.paymentInformation,
                paymentMeans: [
                    {
                        description: 'International Commerce Bank',
                        paymentType: PAYMENT_MEANS_CODES.Direct_debit
                    }
                ]
            }
        };

        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.errors).toBeUndefined();
    });

    test('BR-61 negative test: SEPA Credit Transfer without payee bank account', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            paymentInformation: {
                ...standardTestObject.paymentInformation,
                paymentMeans: [
                    {
                        description: 'International Commerce Bank',
                        paymentType: PAYMENT_MEANS_CODES.SEPA_credit_transfer
                    }
                ]
            }
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(1);
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-61] If the payment means type is SEPA, local credit transfer, or non-SEPA credit transfer, the Payment account identifier (BT-84) of the payee must be provided.'
        );
    });

    test('BR-61 negative test: Non-SEPA Credit Transfer without payee bank account', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            paymentInformation: {
                ...standardTestObject.paymentInformation,
                paymentMeans: [
                    {
                        description: 'International Commerce Bank',
                        paymentType: PAYMENT_MEANS_CODES.Credit_transfer
                    }
                ]
            }
        };
        instance = await FacturX.fromObject(data);
        const validationResult = instance.validate();
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.errors?.length).toBe(1);
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-61] If the payment means type is SEPA, local credit transfer, or non-SEPA credit transfer, the Payment account identifier (BT-84) of the payee must be provided.'
        );
    });
});
