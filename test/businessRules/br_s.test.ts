import { FacturX } from '../../src'
import { ComfortProfile } from '../../src/profiles/comfort'
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    EXEMPTION_REASON_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES
} from '../../src/types/codes'
import {
    StandardInvoice,
    standardTotalsWithAllowance,
    standardTotalsWithCharge,
    standardTotalsWithoutAllowancesAndCharges
} from './ruleObjects.ts/standardTax'

describe('BR-S', () => {
    describe('BR-S-1', () => {
        test('BR-S-1 positive test: VAT Breakdown available', async () => {
            const instance = await FacturX.fromObject(StandardInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-1 negative test: VAT breakdown with wrong tax-category', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    taxBreakdown: [
                        {
                            ...StandardInvoice.totals.taxBreakdown[0],
                            categoryCode: TAX_CATEGORY_CODES.IGIC // Changed to a different tax category
                        },
                        {
                            ...StandardInvoice.totals.taxBreakdown[1],
                            categoryCode: TAX_CATEGORY_CODES.IGIC // Changed to a different tax category
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2) // When there is no tax breakdown the sum will also be incorrect --> BR-S-8 will also fail
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-1] An Invoice that contains an Invoice line (BG-25), a Document level allowance (BG-20) or a Document level charge (BG-21) where the VAT category code (BT-151, BT-95 or BT-102) is "Standard Rate" shall contain in the VAT breakdown (BG-23) at least one VAT category code (BT-118) equal with "Standard Rate".'
            )
        })
    })

    describe('BR-S-2', () => {
        test('BR-S-2 positive test: Seller VAT ID available', async () => {
            const instance = await FacturX.fromObject(StandardInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-2 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                seller: { ...StandardInvoice.seller, taxIdentification: undefined },
                sellerTaxRepresentative: {
                    name: 'Tax Representative',
                    postalAddress: {
                        country: COUNTRY_ID_CODES.GERMANY
                    },
                    taxIdentification: {
                        vatId: 'DE123456789'
                    }
                },
                totals: standardTotalsWithoutAllowancesAndCharges
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-2 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                seller: { ...StandardInvoice.seller, taxIdentification: undefined },
                totals: standardTotalsWithoutAllowancesAndCharges
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Standard Rate" shall contain the Seller VAT Identifier (BT-31), the Seller tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).'
            )
        })

        test('BR-S-2 positive test: Only seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                seller: { ...StandardInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: standardTotalsWithoutAllowancesAndCharges
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors?.length).toBeUndefined()
        })
    })

    describe('BR-S-3', () => {
        test('BR-S-3 positive test: Seller VAT available', async () => {
            const instance = await FacturX.fromObject(StandardInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-3 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                seller: { ...StandardInvoice.seller, taxIdentification: undefined },
                sellerTaxRepresentative: {
                    name: 'Tax Representative',
                    postalAddress: {
                        country: COUNTRY_ID_CODES.GERMANY
                    },
                    taxIdentification: {
                        vatId: 'DE123456789'
                    }
                },
                totals: standardTotalsWithAllowance
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-3 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                seller: { ...StandardInvoice.seller, taxIdentification: undefined },
                totals: standardTotalsWithAllowance
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-3] An Invoice that contains a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Standard Rate" shall contain the Seller VAT Identifier (BT-31), the Seller tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).'
            )
        })

        test('BR-S-3 positive test: only seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                seller: { ...StandardInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: standardTotalsWithAllowance
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors?.length).toBeUndefined()
        })
    })

    describe('BR-S-4', () => {
        test('BR-S-4 positive test: Seller VAT available', async () => {
            const instance = await FacturX.fromObject(StandardInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-4 positive test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                seller: { ...StandardInvoice.seller, taxIdentification: undefined },
                sellerTaxRepresentative: {
                    name: 'Tax Representative',
                    postalAddress: {
                        country: COUNTRY_ID_CODES.GERMANY
                    },
                    taxIdentification: {
                        vatId: 'DE123456789'
                    }
                },
                totals: standardTotalsWithCharge
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-4 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                seller: { ...StandardInvoice.seller, taxIdentification: undefined },
                totals: standardTotalsWithCharge
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-4] An Invoice that contains a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Standard Rate" shall contain the Seller VAT Identifier (BT-31), the Seller Tax registration identifier (BT-32) and/or the Seller tax representative VAT identifier (BT-63).'
            )
        })

        test('BR-S-4 positive test: only seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                seller: { ...StandardInvoice.seller, taxIdentification: { localTaxId: 'TaxID' } },
                totals: standardTotalsWithCharge
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors?.length).toBeUndefined()
        })
    })

    describe('BR-S-5', () => {
        test('BR-S-5 positive test: Tax Rate in Line is >0', async () => {
            const instance = await FacturX.fromObject(StandardInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-5 negative test: Tax Rate in Line is undefined', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                invoiceLines: [
                    ...StandardInvoice.invoiceLines,
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
                                categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                                rateApplicablePercent: undefined
                            },
                            lineTotals: { netTotal: 0 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-5] In an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Standard Rate" the invoiced item VAT rate (BT-152) shall be greater than 0 (zero).'
            )
        })

        test('BR-S-5 negative test: Tax Rate in Line is negative', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                invoiceLines: [
                    ...StandardInvoice.invoiceLines,
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
                                categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                                rateApplicablePercent: -1
                            },
                            lineTotals: { netTotal: 0 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-5] In an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Standard Rate" the invoiced item VAT rate (BT-152) shall be greater than 0 (zero).'
            )
        })

        test('BR-S-5 negative test: Tax Rate in Line is 0', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                invoiceLines: [
                    ...StandardInvoice.invoiceLines,
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
                                categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                                rateApplicablePercent: 0
                            },
                            lineTotals: { netTotal: 0 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-5] In an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Standard Rate" the invoiced item VAT rate (BT-152) shall be greater than 0 (zero).'
            )
        })
    })

    describe('BR-S-6', () => {
        test('BR-S-6 positive test: Tax Rate in allowance is >0', async () => {
            const instance = await FacturX.fromObject(StandardInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-6 negative test: Tax Rate in allowance is <0', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...StandardInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            ...StandardInvoice.totals.documentLevelAllowancesAndCharges!.allowances!,
                            {
                                actualAmount: 0,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                                    rateApplicablePercent: -1
                                }
                            }
                        ]
                    }
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-6] In a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Standard Rate" the Document level allowance VAT rate (BT-96) shall be greater than zero.'
            )
        })

        test('BR-S-6 negative test: Tax Rate in allowance is undefined', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...StandardInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            ...StandardInvoice.totals.documentLevelAllowancesAndCharges!.allowances!,
                            {
                                actualAmount: 0,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                                    rateApplicablePercent: undefined
                                }
                            }
                        ]
                    }
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-6] In a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Standard Rate" the Document level allowance VAT rate (BT-96) shall be greater than zero.'
            )
        })

        test('BR-S-6 negative test: Tax Rate in allowance is 0', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...StandardInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            ...StandardInvoice.totals.documentLevelAllowancesAndCharges!.allowances!,
                            {
                                actualAmount: 0,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                                    rateApplicablePercent: 0
                                }
                            }
                        ]
                    }
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-6] In a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Standard Rate" the Document level allowance VAT rate (BT-96) shall be greater than zero.'
            )
        })
    })

    describe('BR-S-7', () => {
        test('BR-S-7 positive test: Tax Rate in charge is >0', async () => {
            const instance = await FacturX.fromObject(StandardInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-7 negative test: Tax Rate in charge is <0', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...StandardInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            ...StandardInvoice.totals.documentLevelAllowancesAndCharges!.charges!,
                            {
                                actualAmount: 0,
                                reasonCode: CHARGE_REASONS_CODES.Acceptance,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                                    rateApplicablePercent: -1
                                }
                            }
                        ]
                    }
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-7] In a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Standard Rate" the Document level charge VAT rate (BT-103) shall be greater than zero.'
            )
        })

        test('BR-S-7 negative test: Tax Rate in charge is undefined', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...StandardInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            ...StandardInvoice.totals.documentLevelAllowancesAndCharges!.charges!,
                            {
                                actualAmount: 0,
                                reasonCode: CHARGE_REASONS_CODES.Acceptance,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                                    rateApplicablePercent: undefined
                                }
                            }
                        ]
                    }
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-7] In a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Standard Rate" the Document level charge VAT rate (BT-103) shall be greater than zero.'
            )
        })

        test('BR-S-7 negative test: Tax Rate in charge is 0', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...StandardInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            ...StandardInvoice.totals.documentLevelAllowancesAndCharges!.charges!,
                            {
                                actualAmount: 0,
                                reasonCode: CHARGE_REASONS_CODES.Acceptance,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                                    rateApplicablePercent: 0
                                }
                            }
                        ]
                    }
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-7] In a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Standard Rate" the Document level charge VAT rate (BT-103) shall be greater than zero.'
            )
        })
    })

    describe('BR-S-8', () => {
        test('BR-S-8 positive test: tax basis is the correct sum', async () => {
            const instance = await FacturX.fromObject(StandardInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-8 negative test: tax basis is not the correct sum of lines allowances and charges', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 24.7,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 130,
                            categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                            rateApplicablePercent: 19,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        },
                        {
                            calculatedAmount: 2.79,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 31,
                            categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                            rateApplicablePercent: 9,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        }
                    ],
                    taxTotal: [{ amount: 27.49, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 178.99,
                    prepaidAmount: 0,
                    openAmount: 178.99
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-8] For each different value of VAT category rate (BT-119) where the VAT category code (BT-118) is "Standard Rate", the VAT category taxable amount (BT-116) in a VAT breakdown (BG-23) shall equal the sum of Invoice line net amounts (BT-131) plus the sum of document level charge amounts (BT-99) minus the sum of document level allowance amounts (BT-92) where the VAT category code (BT-151, BT-102, BT-95) is "Standard Rate" and the VAT rate (BT-152, BT-103, BT-96) equals the VAT category rate (BT-119)..'
            )
        })

        test('BR-S-8 negative test: tax breakdown is missing for a tax rate', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 23.09,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 121.5,
                            categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                            rateApplicablePercent: 19,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        }
                    ],
                    taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 151.5 + 23.09,
                    prepaidAmount: 0,
                    openAmount: 151.5 + 23.09
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-8] For each different value of VAT category rate (BT-119) where the VAT category code (BT-118) is "Standard Rate", the VAT category taxable amount (BT-116) in a VAT breakdown (BG-23) shall equal the sum of Invoice line net amounts (BT-131) plus the sum of document level charge amounts (BT-99) minus the sum of document level allowance amounts (BT-92) where the VAT category code (BT-151, BT-102, BT-95) is "Standard Rate" and the VAT rate (BT-152, BT-103, BT-96) equals the VAT category rate (BT-119)..'
            )
        })
    })

    describe('BR-S-9', () => {
        test('BR-S-9 positive test: tax calculated amount is correctly calculated', async () => {
            const instance = await FacturX.fromObject(StandardInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-S-9 negative test: tax sum is not correctly calculated', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 20,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 121.5,
                            categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                            rateApplicablePercent: 19,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        },
                        {
                            calculatedAmount: 2.7,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            basisAmount: 30,
                            categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                            rateApplicablePercent: 9,
                            taxPointDate: { year: 2024, month: 1, day: 15 }
                        }
                    ],
                    taxTotal: [{ amount: 22.7, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 151.5 + 22.7,
                    prepaidAmount: 0,
                    openAmount: 151.5 + 22.7
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2) // BR-CO-17 checks the same, therefore 2 errors
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-9] The VAT category tax amount (BT-117) in a VAT breakdown (BG-23) where VAT category code (BT-118) is "Standard Rate" shall equal the VAT category taxable amount (BT-116) multiplied by the VAT category rate (BT-119).'
            )
        })
    })

    describe('BR-S-10', () => {
        test('BR-S-10 negative test: tax exemption reason is given', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    taxBreakdown: [
                        { ...StandardInvoice.totals.taxBreakdown[0] },
                        {
                            ...StandardInvoice.totals.taxBreakdown[1],
                            exemptionReason: 'No Tax required here'
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-10] A VAT Breakdown (BG-23) with VAT Category code (BT-118) "Standard Rate" shall not have a VAT exemption reason code (BT-121) or VAT exemption reason text (BT-120).'
            )
        })

        test('BR-S-10 negative test: tax exemption reason code is given', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice,
                totals: {
                    ...StandardInvoice.totals,
                    taxBreakdown: [
                        { ...StandardInvoice.totals.taxBreakdown[0] },
                        {
                            ...StandardInvoice.totals.taxBreakdown[1],
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Export_outside_the_EU
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-S-10] A VAT Breakdown (BG-23) with VAT Category code (BT-118) "Standard Rate" shall not have a VAT exemption reason code (BT-121) or VAT exemption reason text (BT-120).'
            )
        })

        test('BR-S-10 positive test: neither reason nor reason code is given', async () => {
            const data: ComfortProfile = {
                ...StandardInvoice
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })
    })
})
