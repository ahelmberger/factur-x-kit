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
import { notSubjectToVatInvoice } from './ruleObjects.ts/notSubjectToVat'

describe('BR-O', () => {
    describe('BR-O-1', () => {
        test('BR-O-1 positive test: VAT Breakdown available', async () => {
            const instance = await FacturX.fromObject(notSubjectToVatInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-O-1 negative test: VAT breakdown with wrong tax-category', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
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
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(2) // When there is no tax breakdown the sum will also be incorrect --> BR-O-8 will also fail
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-O-1] An Invoice (INVOICE) that contains an item, an allowance, or a charge at the document level, where the VAT category code of the invoiced item (Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95) or Document level charge VAT category code (BT-102)) has the value "Not subject to VAT" specified, must contain exactly one VAT BREAKDOWN (BG-23) with the VAT category code (BT-118) having the value "Not subject to VAT".'
            )
        })
    })

    describe('BR-O-2', () => {
        test('BR-O-2 positive test: No Seller/Seller Representative/Buyer VAT ID available', async () => {
            const instance = await FacturX.fromObject(notSubjectToVatInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-O-2 positive test: Seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                seller: { ...notSubjectToVatInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...notSubjectToVatInvoice.totals,
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

        test('BR-O-2 positive test: Buyer local tax id available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                buyer: { ...notSubjectToVatInvoice.buyer, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...notSubjectToVatInvoice.totals,
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

        test('BR-O-2 negative test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
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
                    ...notSubjectToVatInvoice.totals,
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
                '[BR-O-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-46).'
            )
        })

        test('BR-O-2 negative test: Seller Tax ID available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                seller: {
                    ...notSubjectToVatInvoice.seller,
                    taxIdentification: {
                        vatId: 'DE123456789'
                    }
                },
                totals: {
                    ...notSubjectToVatInvoice.totals,
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
                '[BR-O-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-46).'
            )
        })

        test('BR-O-2 negative test: Buyer Tax ID available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                buyer: {
                    ...notSubjectToVatInvoice.buyer,
                    taxIdentification: {
                        vatId: 'DE123456789'
                    }
                },
                totals: {
                    ...notSubjectToVatInvoice.totals,
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
                '[BR-O-2] An Invoice that contains an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-46).'
            )
        })
    })
    describe('BR-O-3', () => {
        test('BR-O-3 positive test: No Seller/Seller Representative/Buyer VAT-ID available', async () => {
            const instance = await FacturX.fromObject(notSubjectToVatInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-O-3 positive test: Seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                seller: { ...notSubjectToVatInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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

        test('BR-O-3 positive test: Seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                buyer: { ...notSubjectToVatInvoice.buyer, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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

        test('BR-O-3 negative test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
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
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-O-3] An Invoice that contains a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-48).'
            )
        })

        test('BR-O-3 negative test: Seller Tax ID available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                seller: {
                    ...notSubjectToVatInvoice.seller,
                    taxIdentification: {
                        vatId: 'DE123456789'
                    }
                },
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-O-3] An Invoice that contains a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-48).'
            )
        })

        test('BR-O-3 negative test: Buyer Tax ID available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                buyer: {
                    ...notSubjectToVatInvoice.buyer,
                    taxIdentification: {
                        vatId: 'DE123456789'
                    }
                },
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 9 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-O-3] An Invoice that contains a Document level allowance (BG-20) where the Document level allowance VAT category code (BT-95) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-48).'
            )
        })
    })
    describe('BR-O-4', () => {
        test('BR-O-4 positive test: No Seller/Seller Representative/Buyer VAT-ID available', async () => {
            const instance = await FacturX.fromObject(notSubjectToVatInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-O-4 positive test: Seller local tax id available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                seller: { ...notSubjectToVatInvoice.seller, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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

        test('BR-O-4 positive test: Buyer local tax id available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                buyer: { ...notSubjectToVatInvoice.buyer, taxIdentification: { localTaxId: '345 612 3' } },
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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

        test('BR-O-4 negative test: Seller tax representative VAT id available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
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
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-O-4] An Invoice that contains a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-48).'
            )
        })

        test('BR-O-4 negative test: Seller Tax ID available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                seller: {
                    ...notSubjectToVatInvoice.seller,
                    taxIdentification: {
                        vatId: 'DE1234567811'
                    }
                },
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-O-4] An Invoice that contains a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-48).'
            )
        })

        test('BR-O-4 negative test: Buyer Tax ID available', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                buyer: {
                    ...notSubjectToVatInvoice.buyer,
                    taxIdentification: {
                        vatId: 'DE1234567811'
                    }
                },
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [{ ...notSubjectToVatInvoice.totals.taxBreakdown[0], basisAmount: 11 }],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
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
                '[BR-O-4] An Invoice that contains a Document level charge (BG-21) where the Document level charge VAT category code (BT-102) is "Not subject to VAT" shall not contain the Seller VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or the Buyer VAT identifier (BT-48).'
            )
        })
    })

    describe('BR-O-5', () => {
        test('BR-O-5 positive test: Tax Rate in Line is undefined', async () => {
            const instance = await FacturX.fromObject(notSubjectToVatInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-O-5 negative test: Tax Rate in Line is >0', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                invoiceLines: [
                    {
                        ...notSubjectToVatInvoice.invoiceLines[0],
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
                                rateApplicablePercent: 1
                            },
                            lineTotals: { netTotal: 5 }
                        }
                    },
                    { ...notSubjectToVatInvoice.invoiceLines[1] }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-O-5] An Invoice line (BG-25) where the VAT category code (BT-151) is "Not subject to VAT" shall not contain an Invoiced item VAT rate (BT-152).'
            )
        })

        test('BR-O-5 negative test: Tax Rate in Line is 0', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                invoiceLines: [
                    {
                        ...notSubjectToVatInvoice.invoiceLines[0],
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
                                rateApplicablePercent: 0
                            },
                            lineTotals: { netTotal: 5 }
                        }
                    },
                    { ...notSubjectToVatInvoice.invoiceLines[1] }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-O-5] An Invoice line (BG-25) where the VAT category code (BT-151) is "Not subject to VAT" shall not contain an Invoiced item VAT rate (BT-152).'
            )
        })
    })

    describe('BR-O-6', () => {
        test('BR-O-6 positive test: Tax Rate in allowance is undefined', async () => {
            const instance = await FacturX.fromObject(notSubjectToVatInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-O-6 negative test: Tax Rate in allowance is 0', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            {
                                actualAmount: 1,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
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
                '[BR-O-6] A Document level allowance (BG-20) where VAT category code (BT-95) is "Not subject to VAT" shall not contain a Document level allowance VAT rate (BT-96).'
            )
        })

        test('BR-O-6 negative test: Tax Rate in allowance is >0', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            {
                                actualAmount: 1,
                                reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
                                    rateApplicablePercent: 10
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
                '[BR-O-6] A Document level allowance (BG-20) where VAT category code (BT-95) is "Not subject to VAT" shall not contain a Document level allowance VAT rate (BT-96).'
            )
        })
    })

    describe('BR-O-7', () => {
        test('BR-O-7 positive test: Tax Rate in allowance is undefined', async () => {
            const instance = await FacturX.fromObject(notSubjectToVatInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-O-7 negative test: Tax Rate in allowance is > 0', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            {
                                actualAmount: 1,
                                reasonCode: CHARGE_REASONS_CODES.Fitting,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
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
                '[BR-O-7] A Document level charge (BG-21) where the VAT category code (BT-102) is "Not subject to VAT" shall not contain a Document level charge VAT rate (BT-103).'
            )
        })

        test('BR-O-7 negative test: Tax Rate in allowance is 0', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            {
                                actualAmount: 1,
                                reasonCode: CHARGE_REASONS_CODES.Fitting,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
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
                '[BR-O-7] A Document level charge (BG-21) where the VAT category code (BT-102) is "Not subject to VAT" shall not contain a Document level charge VAT rate (BT-103).'
            )
        })
    })

    describe('BR-O-8', () => {
        test('BR-O-8 positive test: tax basis is the correct sum', async () => {
            const instance = await FacturX.fromObject(notSubjectToVatInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-O-8 negative test: tax basis is not the correct sum of lines allowances and charges', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'No Tax needed',
                            basisAmount: 12,
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
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
                '[BR-O-8] In a VAT BREAKDOWN (BG-23), where the VAT category code (BT-118) has the value "Not subject to VAT" specified, the VAT category taxable amount (BT-116) must be equal to the sum of the Invoice line net amount (BT-131) minus the Document level allowance amount (BT-92) plus the Document level charge amount (BT-99), where Invoiced item VAT category code (BT-151), Document level allowance VAT category code (BT-95), and Document level charge VAT category code (BT-102) each have the value "Not subject to VAT" specified.'
            )
        })
    })

    describe('BR-O-9', () => {
        test('BR-O-9 positive test: tax sum is 0', async () => {
            const instance = await FacturX.fromObject(notSubjectToVatInvoice)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-O-9 negative test: tax sum is not 0', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 1,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'No Tax needed',
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
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
                '[BR-O-9] The VAT category tax amount (BT-117) must be equal to 0 in a VAT BREAKDOWN (BG-23) where the VAT category code (BT-118) has the value "Not subject to VAT".'
            )
        })
    })

    describe('BR-O-10', () => {
        test('BR-O-10 positive test: tax exemption reason is given', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'No Tax needed',
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
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

        test('BR-O-10 positive test: correct tax exemption reason code is given', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: undefined,
                            exemptionReasonCode: EXEMPTION_REASON_CODES.Not_subject_to_VAT,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
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

        test('BR-O-10 negative test: neither reason nor reason code is given', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: undefined,
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
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
                '[BR-O-10] A VAT Breakdown (BG-23) with VAT Category code (BT-118) " Not subject to VAT" shall have a VAT exemption reason code (BT-121), meaning " Not subject to VAT" or a VAT exemption reason text (BT-120) " Not subject to VAT" (or the equivalent standard text in another language).'
            )
        })
    })

    describe('BR-O-11', () => {
        test('BR-O-11 negative test: multiple VAT Breakdowns', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Not Subject to VAT',
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
                            rateApplicablePercent: 0
                        },
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Not Subject to VAT',
                            exemptionReasonCode: undefined,
                            basisAmount: 0,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
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
                '[BR-O-11] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain other VAT breakdown groups (BG-23).'
            )
        })
    })

    describe('BR-O-12', () => {
        test('BR-O-12 negative test: other tax types in lines', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                invoiceLines: [
                    ...notSubjectToVatInvoice.invoiceLines,
                    {
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                                rateApplicablePercent: 0
                            },
                            lineTotals: { netTotal: 0 }
                        },
                        generalLineData: {
                            lineId: '3'
                        },
                        productDescription: {
                            name: 'thing'
                        },
                        productPriceAgreement: {
                            productNetPricing: {
                                netPricePerItem: 0
                            }
                        },
                        delivery: {
                            itemQuantity: {
                                quantity: 1,
                                unit: UNIT_CODES.GROUP
                            }
                        }
                    }
                ],
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Not Subject to VAT',
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
                            rateApplicablePercent: 0
                        },
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Not Subject to VAT',
                            exemptionReasonCode: undefined,
                            basisAmount: 0,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                            rateApplicablePercent: 0
                        }
                    ]
                }
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(3)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-O-11] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain other VAT breakdown groups (BG-23).'
            )
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-O-12] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain an Invoice line (BG-25) where the Invoiced item VAT category code (BT-151) is not "Not subject to VAT".'
            )
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-2] An Invoice (INVOICE) that contains an item where the Invoiced item VAT category code (BT-151) has the value Exempt from VAT specified, must contain the Seller VAT identifier (BT-31), the Seller tax registration identifier (BT-32) or the Seller tax representative VAT identifier (BT-63).'
            )
        })
    })

    describe('BR-O-13', () => {
        test('BR-O-13 negative test: other tax types in allowances', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Not Subject to VAT',
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
                            rateApplicablePercent: 0
                        },
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Not Subject to VAT',
                            exemptionReasonCode: undefined,
                            basisAmount: 0,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                            rateApplicablePercent: 0
                        }
                    ],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
                        allowances: [
                            ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges!.allowances!,
                            {
                                actualAmount: 0,
                                reasonCode: ALLOWANCE_REASONS_CODES.Point_of_sales_threshold_allowance,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
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
            expect(validationResult.errors?.length).toBe(3)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-O-11] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain other VAT breakdown groups (BG-23).'
            )
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-O-13] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain Document level allowances (BG-20) where Document level allowance VAT category code (BT-95) is not "Not subject to VAT".'
            )
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-3] In an Invoice that contains a DOCUMENT LEVEL ALLOWANCES (BG-20) group, where the Document level allowance VAT category code (BT-95) has the value Exempt from VAT, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) must be present.'
            )
        })
    })

    describe('BR-O-14', () => {
        test('BR-O-14 negative test: other tax types in charges', async () => {
            const data: ComfortProfile = {
                ...notSubjectToVatInvoice,
                totals: {
                    ...notSubjectToVatInvoice.totals,
                    taxBreakdown: [
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Not Subject to VAT',
                            exemptionReasonCode: undefined,
                            basisAmount: 10,
                            categoryCode: TAX_CATEGORY_CODES.NOT_SUBJECT_TO_VAT,
                            rateApplicablePercent: 0
                        },
                        {
                            calculatedAmount: 0,
                            typeCode: 'VAT' as TAX_TYPE_CODE,
                            exemptionReason: 'Not Subject to VAT',
                            exemptionReasonCode: undefined,
                            basisAmount: 0,
                            categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
                            rateApplicablePercent: 0
                        }
                    ],
                    documentLevelAllowancesAndCharges: {
                        ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges,
                        charges: [
                            ...notSubjectToVatInvoice.totals.documentLevelAllowancesAndCharges!.charges!,
                            {
                                actualAmount: 0,
                                reasonCode: CHARGE_REASONS_CODES.Handling_of_hazardous_cargo,
                                categoryTradeTax: {
                                    typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                                    categoryCode: TAX_CATEGORY_CODES.EXEMPT_FROM_TAX,
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
            expect(validationResult.errors?.length).toBe(3)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-O-11] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain other VAT breakdown groups (BG-23).'
            )
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-O-14] An Invoice that contains a VAT breakdown group (BG-23) with a VAT category code (BT-118) "Not subject to VAT" shall not contain Document level charges (BG-21) where Document level charge VAT category code (BT-102) is not "Not subject to VAT".'
            )
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-E-4] In an Invoice that contains a DOCUMENT LEVEL CHARGES (BG-21) group, where the Document level charge VAT category code (BT-102) has the value Exempt from VAT, either the Seller VAT identifier (BT-31), Seller tax registration identifier (BT-32) or Seller tax representative VAT identifier (BT-63) must be present.'
            )
        })
    })
})
