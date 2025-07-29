import { FacturX } from '../../src/index'
import { ComfortProfile } from '../../src/profiles/comfort'
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    TIME_REFERENCE_CODES,
    UNIT_CODES
} from '../../src/types/codes'
import { noTaxEasy } from './ruleObjects.ts/noTaxEasy'
import { standardTestObject } from './ruleObjects.ts/standardFull'

let instance: FacturX

describe('br-co-3', () => {
    test('BR-CO-3 positive test: tax point date only', async () => {
        const data = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                taxBreakdown: [
                    {
                        calculatedAmount: 23.09,
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        basisAmount: 121.5,
                        categoryCode: 'S' as TAX_CATEGORY_CODES,
                        rateApplicablePercent: 19,
                        taxPointDate: { year: 2024, month: 1, day: 15 }
                    }
                ]
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-3 positive test: tax point date code only', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                taxBreakdown: [
                    {
                        calculatedAmount: 23.09,
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        basisAmount: 121.5,
                        categoryCode: 'S' as TAX_CATEGORY_CODES,
                        rateApplicablePercent: 19,
                        dueDateTypeCode: TIME_REFERENCE_CODES.DATE_OF_INVOICE
                    }
                ]
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-3 negative test', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,
            totals: {
                ...standardTestObject.totals,
                taxBreakdown: [
                    {
                        calculatedAmount: 23.09,
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        basisAmount: 121.5,
                        categoryCode: 'S' as TAX_CATEGORY_CODES,
                        rateApplicablePercent: 19,
                        taxPointDate: { year: 2024, month: 1, day: 15 },
                        dueDateTypeCode: TIME_REFERENCE_CODES.DATE_OF_INVOICE
                    }
                ]
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            '[BR-CO-3] Value added tax point date (BT-7) and value added tax point date code (BT-8) are mutually exclusive.'
        )
    })
})

describe('br-co-9', () => {
    test('BR-CO-9 positive test: seller tax id', async () => {
        for (const code of Object.values(COUNTRY_ID_CODES)) {
            const taxId = `${code}123456789`
            const data: ComfortProfile = {
                ...standardTestObject,
                seller: {
                    ...standardTestObject.seller,
                    taxIdentification: {
                        vatId: taxId
                    }
                }
            }
            instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        }

        const taxId = `EL123456789`
        const data: ComfortProfile = {
            ...standardTestObject,
            seller: {
                ...standardTestObject.seller,
                taxIdentification: {
                    vatId: taxId
                }
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-9 positive test: buyer tax id', async () => {
        for (const code of Object.values(COUNTRY_ID_CODES)) {
            const taxId = `${code}123456789`
            const data: ComfortProfile = {
                ...standardTestObject,
                buyer: {
                    ...standardTestObject.buyer,
                    taxIdentification: {
                        vatId: taxId
                    }
                }
            }
            instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        }

        const taxId = `EL123456789`
        const data: ComfortProfile = {
            ...standardTestObject,
            buyer: {
                ...standardTestObject.buyer,
                taxIdentification: {
                    vatId: taxId
                }
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-9 positive test: seller-tax-representative tax id', async () => {
        for (const code of Object.values(COUNTRY_ID_CODES)) {
            const taxId = `${code}123456789`
            const data: ComfortProfile = {
                ...standardTestObject,
                sellerTaxRepresentative: {
                    ...standardTestObject.sellerTaxRepresentative!,
                    taxIdentification: {
                        vatId: taxId
                    }
                }
            }
            instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        }

        const taxId = `EL123456789`
        const data: ComfortProfile = {
            ...standardTestObject,
            sellerTaxRepresentative: {
                ...standardTestObject.sellerTaxRepresentative!,
                taxIdentification: {
                    vatId: taxId
                }
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-9 negative test for buyer', async () => {
        const taxId = `123456789`
        const data: ComfortProfile = {
            ...standardTestObject,
            buyer: {
                ...standardTestObject.buyer,
                taxIdentification: {
                    vatId: taxId
                }
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-9] Seller VAT identifier (BT-31), Seller tax representative VAT identifier (BT-63), and Buyer VAT identifier (BT-48) must each be prefixed by a country code from ISO 3166-1 alpha-2 (with 'EL' permitted for Greece) to identify the Member State that issued them."
        )
    })

    test('BR-CO-9 negative test for seller', async () => {
        const taxId = `123456789`
        const data: ComfortProfile = {
            ...standardTestObject,
            seller: {
                ...standardTestObject.seller,
                taxIdentification: {
                    vatId: taxId
                }
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-9] Seller VAT identifier (BT-31), Seller tax representative VAT identifier (BT-63), and Buyer VAT identifier (BT-48) must each be prefixed by a country code from ISO 3166-1 alpha-2 (with 'EL' permitted for Greece) to identify the Member State that issued them."
        )
    })

    test('BR-CO-9 negative test for seller tax representative', async () => {
        const taxId = `123456789`
        const data: ComfortProfile = {
            ...standardTestObject,
            sellerTaxRepresentative: {
                ...standardTestObject.sellerTaxRepresentative!,
                taxIdentification: {
                    vatId: taxId
                }
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-9] Seller VAT identifier (BT-31), Seller tax representative VAT identifier (BT-63), and Buyer VAT identifier (BT-48) must each be prefixed by a country code from ISO 3166-1 alpha-2 (with 'EL' permitted for Greece) to identify the Member State that issued them."
        )
    })
})

describe('br-co-10', () => {
    test('BR-CO-10 positive test', async () => {
        instance = await FacturX.fromObject(noTaxEasy)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-10 negative test: sum net amount too high', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            invoiceLines: [
                {
                    generalLineData: { lineId: '1' },
                    productDescription: {
                        sellerProductId: '12345',
                        name: 'Toller Artikel'
                    },
                    productPriceAgreement: {
                        productPricing: {
                            basisPricePerItem: 5
                        },
                        productNetPricing: { netPricePerItem: 5 }
                    },
                    delivery: { itemQuantity: { quantity: 1, unit: UNIT_CODES.ONE } },
                    settlement: {
                        tax: {
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            categoryCode: 'E' as TAX_CATEGORY_CODES,
                            rateApplicablePercent: 0
                        },
                        lineTotals: { netTotal: 5 }
                    }
                }
            ],

            totals: {
                ...noTaxEasy.totals,
                sumWithoutAllowancesAndCharges: 10,
                taxBreakdown: [
                    {
                        calculatedAmount: 0,
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        exemptionReason: 'Umsatzsteuerbefreit nach §19 UStG',
                        basisAmount: 5,
                        categoryCode: 'E' as TAX_CATEGORY_CODES,
                        rateApplicablePercent: 0
                    }
                ]
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-10] The content of 'Sum of Invoice line net amount' (BT-106) must equal the sum of all 'Invoice line net amount' (BT-131) values."
        )
    })

    test('BR-CO-10 negative test: sum net amount too low', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            invoiceLines: [
                {
                    generalLineData: { lineId: '1' },
                    productDescription: {
                        sellerProductId: '12345',
                        name: 'Toller Artikel'
                    },
                    productPriceAgreement: {
                        productPricing: {
                            basisPricePerItem: 5
                        },
                        productNetPricing: { netPricePerItem: 5 }
                    },
                    delivery: { itemQuantity: { quantity: 1, unit: UNIT_CODES.ONE } },
                    settlement: {
                        tax: {
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            categoryCode: 'E' as TAX_CATEGORY_CODES,
                            rateApplicablePercent: 0
                        },
                        lineTotals: { netTotal: 5 }
                    }
                },

                {
                    generalLineData: { lineId: '2' },
                    productDescription: {
                        sellerProductId: '12346',
                        name: 'Toller Artikel 2'
                    },
                    productPriceAgreement: {
                        productPricing: {
                            basisPricePerItem: 15
                        },
                        productNetPricing: { netPricePerItem: 15 }
                    },
                    delivery: { itemQuantity: { quantity: 1, unit: UNIT_CODES.ONE } },
                    settlement: {
                        tax: {
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            categoryCode: 'E' as TAX_CATEGORY_CODES,
                            rateApplicablePercent: 0
                        },
                        lineTotals: { netTotal: 15 }
                    }
                }
            ],
            totals: {
                ...noTaxEasy.totals,
                sumWithoutAllowancesAndCharges: 10,
                taxBreakdown: [
                    {
                        calculatedAmount: 0,
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        exemptionReason: 'Umsatzsteuerbefreit nach §19 UStG',
                        basisAmount: 20,
                        categoryCode: 'E' as TAX_CATEGORY_CODES,
                        rateApplicablePercent: 0
                    }
                ]
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-10] The content of 'Sum of Invoice line net amount' (BT-106) must equal the sum of all 'Invoice line net amount' (BT-131) values."
        )
    })
})

describe('br-co-11', () => {
    test('BR-CO-11 positive test', async () => {
        instance = await FacturX.fromObject(standardTestObject)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-11 negative test: sum of document level allowances too low', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                documentLevelAllowancesAndCharges: {
                    ...standardTestObject.totals.documentLevelAllowancesAndCharges,
                    allowances: [
                        {
                            actualAmount: 14,
                            reasonCode: '95' as ALLOWANCE_REASONS_CODES, // Discount
                            reason: 'Loyalty Program Discount',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        },
                        {
                            actualAmount: 0.05, // small changes in amount do not affect the rules for taxBreakdown
                            reason: 'Free 0.05 Euro',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                },
                allowanceTotalAmount: 14
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-11] The content of 'Sum of allowances on document level' (BT-107) must equal the sum of all 'Document level allowance amount' (BT-92) values."
        )
    })

    test('BR-CO-11 negative test: sum of document level allowances too high', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                documentLevelAllowancesAndCharges: {
                    ...standardTestObject.totals.documentLevelAllowancesAndCharges,
                    allowances: [
                        {
                            actualAmount: 13.9,
                            reasonCode: '95' as ALLOWANCE_REASONS_CODES, // Discount
                            reason: 'Loyalty Program Discount',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        },
                        {
                            actualAmount: 0.05, // small changes in amount do not affect the rules for taxBreakdown
                            reason: 'Free 0.05 Euro',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                },
                allowanceTotalAmount: 14
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-11] The content of 'Sum of allowances on document level' (BT-107) must equal the sum of all 'Document level allowance amount' (BT-92) values."
        )
    })
})

describe('br-co-12', () => {
    test('BR-CO-12 positive test', async () => {
        instance = await FacturX.fromObject(standardTestObject)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-12 negative test: sum of document level allowances too low', async () => {
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
                            reason: 'Standard Shipping Fee',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        },
                        {
                            actualAmount: 0.05,
                            reason: 'Random Fee',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                },
                chargeTotalAmount: 0.5
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-12] The content of 'Sum of charges on document level' (BT-108) must equal the sum of all 'Document level charge amount' (BT-99) values."
        )
    })

    test('BR-CO-12 negative test: sum of document level allowances too high', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                documentLevelAllowancesAndCharges: {
                    ...standardTestObject.totals.documentLevelAllowancesAndCharges,
                    charges: [
                        {
                            actualAmount: 0.4,
                            reasonCode: 'FC' as CHARGE_REASONS_CODES, // Freight charges
                            reason: 'Standard Shipping Fee',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        },
                        {
                            actualAmount: 0.05,
                            reason: 'Random Fee',
                            categoryTradeTax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'S' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 19
                            }
                        }
                    ]
                },
                chargeTotalAmount: 0.5
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-12] The content of 'Sum of charges on document level' (BT-108) must equal the sum of all 'Document level charge amount' (BT-99) values."
        )
    })
})

describe('br-co-13', () => {
    test('BR-CO-13 positive test', async () => {
        instance = await FacturX.fromObject(standardTestObject)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-13 negative test: net total too low', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                sumWithoutAllowancesAndCharges: 135,
                allowanceTotalAmount: 14,
                chargeTotalAmount: 0.5,
                netTotal: 120.5,
                taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 143.59,
                prepaidAmount: 0,
                openAmount: 143.59,
                roundingAmount: 0
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-13] The content of 'Invoice total amount without VAT' (BT-109) must equal the 'Sum of Invoice line net amount' (BT-106) minus 'Sum of allowances on document level' (BT-107) plus 'Sum of charges on document level' (BT-108)."
        )
    })

    test('BR-CO-13 negative test: net total too high', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                sumWithoutAllowancesAndCharges: 135,
                allowanceTotalAmount: 14,
                chargeTotalAmount: 0.5,
                netTotal: 122.5,
                taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 145.59,
                prepaidAmount: 0,
                openAmount: 145.59,
                roundingAmount: 0
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-13] The content of 'Invoice total amount without VAT' (BT-109) must equal the 'Sum of Invoice line net amount' (BT-106) minus 'Sum of allowances on document level' (BT-107) plus 'Sum of charges on document level' (BT-108)."
        )
    })
})

describe('br-co-14', () => {
    test('BR-CO-14 positive test', async () => {
        instance = await FacturX.fromObject(standardTestObject)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-14 negative test: tax total too high', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                sumWithoutAllowancesAndCharges: 135,
                allowanceTotalAmount: 14,
                chargeTotalAmount: 0.5,
                netTotal: 121.5,
                taxTotal: [{ amount: 24.09, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 145.59,
                prepaidAmount: 0,
                openAmount: 145.59,
                roundingAmount: 0
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-14] The content of 'Invoice total VAT amount' (BT-110) must equal the sum of all 'VAT category tax amount' (BT-117) values."
        )
    })

    test('BR-CO-14 negative test: tax total too low', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                sumWithoutAllowancesAndCharges: 135,
                allowanceTotalAmount: 14,
                chargeTotalAmount: 0.5,
                netTotal: 121.5,
                taxTotal: [{ amount: 22.09, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 143.59,
                prepaidAmount: 0,
                openAmount: 143.59,
                roundingAmount: 0
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-14] The content of 'Invoice total VAT amount' (BT-110) must equal the sum of all 'VAT category tax amount' (BT-117) values."
        )
    })
})

describe('br-co-15', () => {
    test('BR-CO-15 positive test', async () => {
        instance = await FacturX.fromObject(standardTestObject)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-15 negative test: gross total too high', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                sumWithoutAllowancesAndCharges: 135,
                allowanceTotalAmount: 14,
                chargeTotalAmount: 0.5,
                netTotal: 121.5,
                taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 145.59,
                prepaidAmount: 0,
                openAmount: 145.59,
                roundingAmount: 0
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-15] The content of 'Invoice total amount with VAT' (BT-112) must equal the sum of 'Invoice total amount without VAT' (BT-109) and 'Invoice total VAT amount' (BT-110)."
        )
    })

    test('BR-CO-15 negative test: gross total too low', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                sumWithoutAllowancesAndCharges: 135,
                allowanceTotalAmount: 14,
                chargeTotalAmount: 0.5,
                netTotal: 121.5,
                taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 143.59,
                prepaidAmount: 0,
                openAmount: 143.59,
                roundingAmount: 0
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-15] The content of 'Invoice total amount with VAT' (BT-112) must equal the sum of 'Invoice total amount without VAT' (BT-109) and 'Invoice total VAT amount' (BT-110)."
        )
    })
})

describe('br-co-16', () => {
    test('BR-CO-16 positive test', async () => {
        instance = await FacturX.fromObject(standardTestObject)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-16 negative test: open amount too high', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                sumWithoutAllowancesAndCharges: 135,
                allowanceTotalAmount: 14,
                chargeTotalAmount: 0.5,
                netTotal: 121.5,
                taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 144.59,
                prepaidAmount: 10,
                openAmount: 144.6,
                roundingAmount: 0.01
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-16] The content of 'Amount due for payment' (BT-115) must equal 'Invoice total amount with VAT' (BT-112) minus 'Paid amount' (BT-113) plus 'Rounding amount' (BT-114)."
        )
    })

    test('BR-CO-16 negative test: open too low', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                sumWithoutAllowancesAndCharges: 135,
                allowanceTotalAmount: 14,
                chargeTotalAmount: 0.5,
                netTotal: 121.5,
                taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 144.59,
                prepaidAmount: 10,
                openAmount: 114.6,
                roundingAmount: 0.01
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1)
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-16] The content of 'Amount due for payment' (BT-115) must equal 'Invoice total amount with VAT' (BT-112) minus 'Paid amount' (BT-113) plus 'Rounding amount' (BT-114)."
        )
    })
})

describe('br-co-17', () => {
    test('BR-CO-17 positive test', async () => {
        instance = await FacturX.fromObject(standardTestObject)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-17 negative test: tax calculation not correct', async () => {
        const data: ComfortProfile = {
            ...standardTestObject,

            totals: {
                ...standardTestObject.totals,
                netTotal: 121.5,
                taxBreakdown: [
                    {
                        calculatedAmount: 22.09,
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        basisAmount: 121.5,
                        categoryCode: 'S' as TAX_CATEGORY_CODES,
                        rateApplicablePercent: 19,
                        taxPointDate: { year: 2024, month: 1, day: 15 }
                    }
                ],
                taxTotal: [{ amount: 22.09, currency: 'EUR' as CURRENCY_CODES }],
                grossTotal: 143.59,
                prepaidAmount: 0,
                openAmount: 143.59,
                roundingAmount: 0.0
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(2) // [BR-S-9] tests the exact same, therefore it needs to throw two br errors
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-17] The content of 'VAT category tax amount' (calculatedAmount - BT-117) must equal „VAT category taxable amount“ (basisAmount - BT-116), multiplied with „VAT category rate“ (rateApplicablePercent - BT-119) divided by 100, rounded to two decimals."
        )
    })
})

describe('br-co-18', () => {
    test('BR-CO-18 positive test', async () => {
        instance = await FacturX.fromObject(noTaxEasy)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-18 negative test: no taxBreakdown', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,

            totals: {
                ...noTaxEasy.totals,
                taxBreakdown: []
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(3) // Not individually testable, because if there is no tax breakdown there will be issues in the tax business rules, too
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-18] An invoice needs to have at least one item in 'TaxBreakdown' (BG-23)"
        )
    })
})

describe('br-co-19', () => {
    test('BR-CO-19 positive test: start date only', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            delivery: {
                billingPeriod: {
                    startDate: {
                        year: 2025,
                        month: 3,
                        day: 10
                    }
                }
            }
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-19 positive test: end date only', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            delivery: {
                billingPeriod: {
                    endDate: {
                        year: 2025,
                        month: 3,
                        day: 10
                    }
                }
            }
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-19 positive test: both dates', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            delivery: {
                billingPeriod: {
                    startDate: {
                        year: 2025,
                        month: 3,
                        day: 10
                    },
                    endDate: {
                        year: 2025,
                        month: 3,
                        day: 10
                    }
                }
            }
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-19 negative test: neither start date nor end date', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            delivery: {
                billingPeriod: {}
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1) // Not individually testable, because if there is no tax breakdown there will be issues in the tax business rules, too
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-19] If the 'Invoicing period' group (billingPeriod - BG-14) is used, either the 'Invoicing period start date' (BT-73) or the 'Invoicing period end date' (BT-74) or both must be filled."
        )
    })
})

describe('br-co-20', () => {
    test('BR-CO-20 positive test: start date only', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            invoiceLines: [
                {
                    ...noTaxEasy.invoiceLines[0],
                    settlement: {
                        ...noTaxEasy.invoiceLines[0].settlement,
                        billingPeriod: {
                            startDate: {
                                year: 2025,
                                month: 3,
                                day: 10
                            }
                        }
                    }
                }
            ]
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-20 positive test: end date only', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            invoiceLines: [
                {
                    ...noTaxEasy.invoiceLines[0],
                    settlement: {
                        ...noTaxEasy.invoiceLines[0].settlement,
                        billingPeriod: {
                            endDate: {
                                year: 2025,
                                month: 3,
                                day: 10
                            }
                        }
                    }
                }
            ]
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-20 positive test: both dates', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            invoiceLines: [
                {
                    ...noTaxEasy.invoiceLines[0],
                    settlement: {
                        ...noTaxEasy.invoiceLines[0].settlement,
                        billingPeriod: {
                            startDate: {
                                year: 2025,
                                month: 3,
                                day: 1
                            },

                            endDate: {
                                year: 2025,
                                month: 3,
                                day: 10
                            }
                        }
                    }
                }
            ]
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-20 negative test: neither start date nor end date', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            invoiceLines: [
                {
                    ...noTaxEasy.invoiceLines[0],
                    settlement: {
                        ...noTaxEasy.invoiceLines[0].settlement,
                        billingPeriod: {}
                    }
                }
            ]
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1) // Not individually testable, because if there is no tax breakdown there will be issues in the tax business rules, too
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-20] If the 'Invoice line period' group (BG-26) is used, either the 'Invoice line period start date' (BT-134) or the 'Invoice line period end date' (BT-135) or both must be filled."
        )
    })
})

describe('BR-CO-21', () => {
    test('BR-CO-21 positive test: allowoance reason only', async () => {
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
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-21 positive test: allowoance reason code only', async () => {
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
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-21 negative test', async () => {
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
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(2) //This is 2 because BR-33 and BR-CO-21 are checking the exact same thing. Therefore no exclusive check of BR-CO-21 possible
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-21] Each 'Document level allowances' group (BG-20) must contain either a 'Document level allowance reason' (BT-97) or a 'Document level allowance reason code' (BT-98), or both."
        )
    })
})

describe('BR-CO-22', () => {
    test('BR-CO-22 positive test: charge reason only', async () => {
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
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-22 positive test: allowoance reason code only', async () => {
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
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-22 negative test', async () => {
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
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(2) //This is 2 because BR-CO-22 and BR-38 are checking the exact same thing. Therefore no exclusive check of BR-33 possible
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-22] Each 'Document level charge' group (BG-21) must contain either a 'Document level charge reason' (BT-104) or a 'Document level charge reason code' (BT-105), or both."
        )
    })
})

describe('BR-CO-23', () => {
    test('BR-CO-23 positive test: allowoance reason only', async () => {
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
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-23 positive test: allowoance reason code only', async () => {
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
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-23 negative test', async () => {
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
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(2) //This is 2 because BR-42 and BR-CO-23 are checking the exact same thing. Therefore no exclusive check of BR-CO-23 possible
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-23] Each 'Invoice line allowances' group (BG-27) must contain either an 'Invoice line allowance reason' (BT-139) or an 'Invoice line allowance reason code' (BT-140), or both."
        )
    })
})

describe('BR-CO-24', () => {
    test('BR-CO-24 positive test: charge reason only', async () => {
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
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-24 positive test: charge reason code only', async () => {
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
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-24 negative test', async () => {
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
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(2) //This is 2 because BR-44 and BR-CO-24 are checking the exact same thing. Therefore no exclusive check of BR-CO-24 possible
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-24] Each 'Invoice line charge' group (BG-28) must contain either an 'Invoice line charge reason' (BT-144) or an 'Invoice line charge reason code' (BT-145), or both."
        )
    })
})

describe('br-co-25', () => {
    test('BR-CO-25 positive test: payment terms description is given', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            paymentInformation: {
                ...noTaxEasy.paymentInformation,
                paymentTerms: {
                    description: 'Pay whenever you want'
                }
            }
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-25 positive test: payment due date is given', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            paymentInformation: {
                ...noTaxEasy.paymentInformation,
                paymentTerms: {
                    dueDate: {
                        year: 2030,
                        month: 1,
                        day: 1
                    }
                }
            }
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-25 positive test: open amount is negative', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            paymentInformation: {
                ...noTaxEasy.paymentInformation,
                paymentTerms: undefined
            },
            totals: {
                ...noTaxEasy.totals,
                prepaidAmount: 20,
                openAmount: -10
            }
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-25 negative test: neither due date nor description is given', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            paymentInformation: {
                ...noTaxEasy.paymentInformation,
                paymentTerms: undefined
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1) // Not individually testable, because if there is no tax breakdown there will be issues in the tax business rules, too
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-25] If the 'Amount due for payment' (BT-115) is positive, either 'Payment due date' (BT-9) or 'Payment terms description' (BT-20) must be present."
        )
    })
})

describe('br-co-26', () => {
    test('BR-CO-26 positive test: Seller identifier is given', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            seller: {
                ...noTaxEasy.seller,
                id: ['ThisIsAnID'],
                specifiedLegalOrganization: undefined,
                taxIdentification: { localTaxId: 'DE124356788' }
            }
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        console.log(validationResult.errors)

        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-26 positive test: Seller legal registration identifier is given', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            seller: {
                ...noTaxEasy.seller,
                id: undefined,
                specifiedLegalOrganization: {
                    id: { id: 'HR-12345678' }
                },
                taxIdentification: { localTaxId: 'DE124356788' }
            }
        }

        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-26 positive test: Seller VAT identifier is given', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            seller: {
                ...noTaxEasy.seller,
                id: undefined,
                specifiedLegalOrganization: undefined,
                taxIdentification: { vatId: 'DE124356788' }
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()
        expect(validationResult.valid).toBeTruthy()
        expect(validationResult.errors).toBeUndefined()
    })

    test('BR-CO-26 negative test: none of the identification data for seller is given', async () => {
        const data: ComfortProfile = {
            ...noTaxEasy,
            seller: {
                ...noTaxEasy.seller,
                id: undefined,
                specifiedLegalOrganization: undefined,
                taxIdentification: { localTaxId: '123' }
            }
        }
        instance = await FacturX.fromObject(data)
        const validationResult = instance.validate()

        expect(validationResult.valid).toBeFalsy()
        expect(validationResult.errors?.length).toBe(1) // Not individually testable, because if there is no tax breakdown there will be issues in the tax business rules, too
        expect(validationResult.errors?.map(error => error?.message)).toContain(
            "[BR-CO-26] To allow the buyer to automatically identify the seller, either 'Seller identifier' (BT-29), 'Seller legal registration identifier' (BT-30), or 'Seller VAT identifier' (BT-31) must be present."
        )
    })
})
