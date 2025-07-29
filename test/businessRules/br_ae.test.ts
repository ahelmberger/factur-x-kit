import { FacturX } from '../../src'
import { ComfortProfile } from '../../src/profiles/comfort'
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    EXEMPTION_REASON_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE
} from '../../src/types/codes'
import { reverseChargeInvoice } from './ruleObjects.ts/reverseCharge'

describe('BR-AE', () => {
    describe('BR-AE-1', () => {
        test('BR-AE-1 positive test: VAT Breakdown available', async () => {
            const instance = await FacturX.fromObject(reverseChargeInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-1 negative test: VAT breakdown with wrong tax-category', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Reverse Charge',
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Reverse_charge,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2) // When there is no tax breakdown the sum will also be incorrect --> BR-AE-8 will also fail
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-1] An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value Reverse charge specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Reverse charge.'
            )
        })
    })

    describe('BR-AE-2', () => {
        test('BR-AE-2 positive test: Seller VAT and Buyer VAT ID available', async () => {
            const instance = await FacturX.fromObject(reverseChargeInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-2 positive test: Seller local tax id and Buyer VAT ID available', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                seller: { ...reverseChargeInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...reverseChargeInvoice.totals,
                    documentLevelAllowancesAndCharges: undefined,
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-2 positive test: Seller tax representative VAT id and Buyer VAT ID available', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                seller: { ...reverseChargeInvoice.seller, taxIdentification: undefined },
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
                    ...reverseChargeInvoice.totals,
                    documentLevelAllowancesAndCharges: undefined,
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-2 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                seller: { ...reverseChargeInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...reverseChargeInvoice.totals,
                    documentLevelAllowancesAndCharges: undefined,
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 0
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-2] An Invoice (INVOICE) that contains an item where the Invoiced item VAT category code (BT-151) has the value Reverse charge specified, must contain the Seller VAT identifier (BT-31), the Seller tax registration identifier (BT-32) or the Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier.'
            )
        })
    })
    describe('BR-AE-3', () => {
        test('BR-AE-3 positive test: Seller VAT and Buyer VAT ID available', async () => {
            const instance = await FacturX.fromObject(reverseChargeInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-3 positive test: Seller local tax id and Buyer VAT ID available', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                seller: { ...reverseChargeInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [{ ...reverseChargeInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 1,
                    chargeTotalAmount: 0,
                    netTotal: 9,
                    grossTotal: 9,
                    prepaidAmount: 0,
                    openAmount: 9
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-3 positive test: Seller tax representative VAT id and Buyer VAT ID available', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                seller: { ...reverseChargeInvoice.seller, taxIdentification: undefined },
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
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [{ ...reverseChargeInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 1,
                    chargeTotalAmount: 0,
                    netTotal: 9,
                    grossTotal: 9,
                    prepaidAmount: 0,
                    openAmount: 9
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-3 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                seller: { ...reverseChargeInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [{ ...reverseChargeInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 1,
                    chargeTotalAmount: 0,
                    netTotal: 9,
                    grossTotal: 9,
                    prepaidAmount: 0,
                    openAmount: 9
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value Reverse charge, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier must be present.'
            )
        })

        test('BR-AE-3 negative test: No buyer Tax ID', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                buyer: { ...reverseChargeInvoice.buyer, taxIdentification: undefined },
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [{ ...reverseChargeInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: undefined
                    },
                    allowanceTotalAmount: 1,
                    chargeTotalAmount: 0,
                    netTotal: 9,
                    grossTotal: 9,
                    prepaidAmount: 0,
                    openAmount: 9
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value Reverse charge, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier must be present.'
            )
        })
    })
    describe('BR-AE-4', () => {
        test('BR-AE-4 positive test: Seller VAT and Buyer VAT ID available', async () => {
            const instance = await FacturX.fromObject(reverseChargeInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-4 positive test: Seller local tax id and Buyer VAT ID available', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                seller: { ...reverseChargeInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [{ ...reverseChargeInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 1,
                    netTotal: 11,
                    grossTotal: 11,
                    prepaidAmount: 0,
                    openAmount: 11
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-4 positive test: Seller tax representative VAT id and Buyer VAT ID available', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                seller: { ...reverseChargeInvoice.seller, taxIdentification: undefined },
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
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [{ ...reverseChargeInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 1,
                    netTotal: 11,
                    grossTotal: 11,
                    prepaidAmount: 0,
                    openAmount: 11
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-4 negative test: No seller Tax ID', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                seller: { ...reverseChargeInvoice.seller, taxIdentification: undefined },
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [{ ...reverseChargeInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 1,
                    netTotal: 11,
                    grossTotal: 11,
                    prepaidAmount: 0,
                    openAmount: 11
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value Reverse charge, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier must be present.'
            )
        })

        test('BR-AE-4 negative test: No buyer Tax ID', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                buyer: { ...reverseChargeInvoice.buyer, taxIdentification: undefined },
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [{ ...reverseChargeInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: undefined
                    },
                    allowanceTotalAmount: 0,
                    chargeTotalAmount: 1,
                    netTotal: 11,
                    grossTotal: 11,
                    prepaidAmount: 0,
                    openAmount: 11
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value Reverse charge, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) as well as the Buyer VAT identifier (BT-48) or the Buyer tax registration identifier must be present.'
            )
        })
    })

    describe('BR-AE-5', () => {
        test('BR-AE-5 positive test: Tax Rate in Line equals 0', async () => {
            const instance = await FacturX.fromObject(reverseChargeInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-5 negative test: Tax Rate in Line is not 0', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                invoiceLines: [
                    {
                        ...reverseChargeInvoice.invoiceLines[0],
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                                rateApplicablePercent: 1
                            },
                            lineTotals: { netTotal: 5 }
                        }
                    },
                    { ...reverseChargeInvoice.invoiceLines[1] }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-5] In an INVOICE LINE (BG-25), where Invoiced item VAT category code (BT-151) has the value Reverse charge, Invoiced item VAT rate (BT-152) must be equal to 0.'
            )
        })
    })

    describe('BR-AE-6', () => {
        test('BR-AE-6 positive test: Tax Rate in allowance equals 0', async () => {
            const instance = await FacturX.fromObject(reverseChargeInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-6 negative test: Tax Rate in allowance is not 0', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                totals: {
                    ...reverseChargeInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            {
                                actualAmount: 1,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                                    rateApplicablePercent: 1
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
                '[BR-AE-6] In a DOCUMENT LEVEL ALLOWANCES (BG-20), where Document level allowance VAT category code (BT-95) has the value Reverse charge, Document level allowance VAT rate (BT-96) must be equal to 0.'
            )
        })
    })

    describe('BR-AE-7', () => {
        test('BR-AE-7 positive test: Tax Rate in allowance equals 0', async () => {
            const instance = await FacturX.fromObject(reverseChargeInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-7 negative test: Tax Rate in allowance is not 0', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                totals: {
                    ...reverseChargeInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...reverseChargeInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            {
                                actualAmount: 1,
                                reasonCode: CHARGE_REASONS_CODES.Fitting,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                                    rateApplicablePercent: 1
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
                '[BR-AE-7] In a DOCUMENT LEVEL CHARGES (BG-21), where Document level charge VAT category code (BT-102) has the value Reverse charge, Document level charge VAT rate (BT-103) must be equal to 0.'
            )
        })
    })

    describe('BR-AE-8', () => {
        test('BR-AE-8 positive test: tax basis is the correct sum', async () => {
            const instance = await FacturX.fromObject(reverseChargeInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-8 negative test: tax basis is not the correct sum of lines allowances and charges', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Reverse Charge',
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Reverse_charge,
                            basisAmount: 12,
                            categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-8] In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value Reverse charge specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value Reverse charge specified.'
            )
        })
    })

    describe('BR-AE-9', () => {
        test('BR-AE-9 positive test: tax sum is 0', async () => {
            const instance = await FacturX.fromObject(reverseChargeInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-9 negative test: tax sum is not 0', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 1,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Reverse Charge',
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Reverse_charge,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                            rateApplicablePercent: 0
                        }
                    ],

                    netTotal: 10,
                    taxTotal: [{ amount: 1, currency: 'EUR' as CURRENCY_CODES }],
                    grossTotal: 11,
                    prepaidAmount: 0,
                    openAmount: 11
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-9] The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value Reverse charge.'
            )
        })
    })

    describe('BR-AE-10', () => {
        test('BR-AE-10 positive test: tax exemption reason is given', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Reverse Charge',
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-10 positive test: correct tax exemption reason code is given', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: undefined,
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Reverse_charge,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-AE-10 negative test: neither reason nor reason code is given', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: undefined,
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-10] A VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Reverse charge must contain a VAT exemption reason code (BT-121) with the value Reverse charge or a VAT exemption reason text (BT-120) with the value Reverse charge (or the equivalent in another language).'
            )
        })

        test('BR-AE-10 negative test: wrong reason code is given', async () => {
            const data: ComfortProfile = {
                ...reverseChargeInvoice,
                totals: {
                    ...reverseChargeInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Reverse Charge',
                            exemptionReasonCode:
                                EXEMPTION_REASON_CODES.Exempt_based_on_article_309_of_Council_Directive_2006_112_EC_,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.VAT_REVERSE_CHARGE,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-AE-10] A VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value Reverse charge must contain a VAT exemption reason code (BT-121) with the value Reverse charge or a VAT exemption reason text (BT-120) with the value Reverse charge (or the equivalent in another language).'
            )
        })
    })
})
