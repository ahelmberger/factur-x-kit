import { FacturX } from '../../src'
import { ComfortProfile } from '../../src/profiles/comfort'
import { TAX_CATEGORY_CODES, TAX_TYPE_CODE, UNIT_CODES } from '../../src/types/codes'
import { noTaxEasy } from './ruleObjects.ts/noTaxEasy'

describe('BR-OWN', () => {
    describe('BR-OWN-1', () => {
        test('BR-OWN-1 positive test: netPricePerItem equals basisPricePerItem minus allowances', async () => {
            const data = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productPricing: {
                                basisPricePerItem: 11,
                                priceAllowancesAndCharges: {
                                    allowances: [{ actualAmount: 1 }]
                                }
                            },
                            productNetPricing: { netPricePerItem: 10 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-OWN-1 negative test: netPricePerItem does not equal basisPricePerItem minus allowances', async () => {
            const data = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productPricing: {
                                basisPricePerItem: 10,
                                priceAllowancesAndCharges: {
                                    allowances: [{ actualAmount: 1 }]
                                }
                            },
                            productNetPricing: { netPricePerItem: 10 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-OWN-1] The netPricePerItem (BT-146) must be equal to the basisPricePerItem (BT-148) minus the sum of all priceAllowances (BT-147) in each invoiceLine (BG-25)'
            )
        })
    })

    describe('BR-OWN-2', () => {
        test('BR-OWN-2 positive test: priceBaseQuantity unit matches itemQuantity unit', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productPricing: {
                                basisPricePerItem: 10
                            },
                            productNetPricing: {
                                netPricePerItem: 10,
                                priceBaseQuantity: { quantity: 1, unit: UNIT_CODES.ONE }
                            }
                        },
                        delivery: { itemQuantity: { quantity: 1, unit: UNIT_CODES.ONE } }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-OWN-2 positive test: priceBaseQuantity unit does not match itemQuantity unit', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productPricing: {
                                basisPricePerItem: 10
                            },
                            productNetPricing: {
                                netPricePerItem: 10,
                                priceBaseQuantity: { quantity: 1, unit: UNIT_CODES.ONE }
                            }
                        },
                        delivery: { itemQuantity: { quantity: 1, unit: UNIT_CODES.KILOGRAM } }
                    }
                ]
            }

            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-OWN-2] The unit of measure of the item price base quantity (BT-150) must be the same as the unit of measure of the invoiced quantity (BT-130) in each invoiceLine.'
            )
        })
    })

    describe('BR-OWN-3', () => {
        test('BR-OWN-3 positive test: priceBaseQuantity of netPrices matches priceBaseQuantity of productPrice', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productPricing: {
                                basisPricePerItem: 10,
                                priceBaseQuantity: { quantity: 1, unit: UNIT_CODES.ONE }
                            },
                            productNetPricing: {
                                netPricePerItem: 10,
                                priceBaseQuantity: { quantity: 1, unit: UNIT_CODES.ONE }
                            }
                        },
                        delivery: { itemQuantity: { quantity: 1, unit: UNIT_CODES.ONE } }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-OWN-3 positive test: priceBaseQuantity of productPrice does not match priceBaseQuantity of netPrice', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productPricing: {
                                basisPricePerItem: 10,
                                priceBaseQuantity: { quantity: 2, unit: UNIT_CODES.ONE }
                            },
                            productNetPricing: {
                                netPricePerItem: 10,
                                priceBaseQuantity: { quantity: 1, unit: UNIT_CODES.ONE }
                            }
                        },
                        delivery: { itemQuantity: { quantity: 1, unit: UNIT_CODES.ONE } }
                    }
                ]
            }

            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-OWN-3] If an item price base quantity is specified for the Gross Price, then both its quantity (BT-149-1) and its unit of measure (BT-150-1) must be identical to the item price base quantity (BT-149 and BT-150) of the Net Item Price in each invoiceLine.'
            )
        })

        test('BR-OWN-3 positive test: priceBaseQuantity unit of productPrice does not match priceBaseQuantity unit of netPrice', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productPricing: {
                                basisPricePerItem: 10,
                                priceBaseQuantity: { quantity: 1, unit: UNIT_CODES.KILOGRAM }
                            },
                            productNetPricing: {
                                netPricePerItem: 10,
                                priceBaseQuantity: { quantity: 1, unit: UNIT_CODES.ONE }
                            }
                        },
                        delivery: { itemQuantity: { quantity: 1, unit: UNIT_CODES.ONE } }
                    }
                ]
            }

            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()

            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-OWN-3] If an item price base quantity is specified for the Gross Price, then both its quantity (BT-149-1) and its unit of measure (BT-150-1) must be identical to the item price base quantity (BT-149 and BT-150) of the Net Item Price in each invoiceLine.'
            )
        })
    })

    describe('BR-OWN-4', () => {
        test('BR-OWN-4 positive test: lineTotals equals itemQuantity times netPricePerItem divided by netPriceBaseQuantity', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productNetPricing: {
                                netPricePerItem: 5,
                                priceBaseQuantity: { quantity: 3, unit: UNIT_CODES.KILOGRAM }
                            }
                        },
                        delivery: { itemQuantity: { quantity: 6, unit: UNIT_CODES.KILOGRAM } },
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'E' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 0
                            },
                            lineTotals: { netTotal: 10 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-OWN-4 positive test: lineTotals equals itemQuantity times netPricePerItem without netPriceBaseQuantity', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productNetPricing: {
                                netPricePerItem: 1
                            }
                        },
                        delivery: { itemQuantity: { quantity: 10, unit: UNIT_CODES.KILOGRAM } },
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'E' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 0
                            },
                            lineTotals: { netTotal: 10 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-OWN-4 positive test: lineTotals with allowances and charges', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productNetPricing: {
                                netPricePerItem: 5.5,
                                priceBaseQuantity: { quantity: 3, unit: UNIT_CODES.KILOGRAM }
                            }
                        },
                        delivery: { itemQuantity: { quantity: 6, unit: UNIT_CODES.KILOGRAM } },
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'E' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 0
                            },
                            lineLevelAllowancesAndCharges: {
                                allowances: [{ actualAmount: 2, reason: 'Test Allowance' }],
                                charges: [{ actualAmount: 1, reason: 'Test Charge' }]
                            },
                            lineTotals: { netTotal: 10 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeTruthy()
            expect(validationResult.errors).toBeUndefined()
        })

        test('BR-OWN-4 negativ test: netPricePerItem does not equal itemQuantity times netPriceBaseQuantity', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productNetPricing: {
                                netPricePerItem: 5,
                                priceBaseQuantity: { quantity: 3, unit: UNIT_CODES.KILOGRAM }
                            }
                        },
                        delivery: { itemQuantity: { quantity: 9, unit: UNIT_CODES.KILOGRAM } },
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'E' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 0
                            },
                            lineTotals: { netTotal: 10 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-OWN-4] The netTotal (BT-131) of each line must be the netPricePerItem (BT-146) multiplied with the itemQuantity (BT-129) divided by the priceBaseQuantity (BT-149, if available. Default for priceBaseQuantity is 1). Minus the sum of all lineLevelAllowances (BT-136) plus the sum of all lineLevelCharges (BT-141).'
            )
        })

        test('BR-OWN-4 negative test: lineTotals with allowances and charges', async () => {
            const data: ComfortProfile = {
                ...noTaxEasy,
                invoiceLines: [
                    {
                        ...noTaxEasy.invoiceLines[0],
                        productPriceAgreement: {
                            productNetPricing: {
                                netPricePerItem: 5,
                                priceBaseQuantity: { quantity: 3, unit: UNIT_CODES.KILOGRAM }
                            }
                        },
                        delivery: { itemQuantity: { quantity: 6, unit: UNIT_CODES.KILOGRAM } },
                        settlement: {
                            tax: {
                                typeCode: 'VAT' as TAX_TYPE_CODE,
                                categoryCode: 'E' as TAX_CATEGORY_CODES,
                                rateApplicablePercent: 0
                            },
                            lineLevelAllowancesAndCharges: {
                                allowances: [{ actualAmount: 2, reason: 'Test Allowance' }],
                                charges: [{ actualAmount: 1, reason: 'Test Charge' }]
                            },
                            lineTotals: { netTotal: 10 }
                        }
                    }
                ]
            }
            const instance = await FacturX.fromObject(data)
            const validationResult = instance.validate()
            expect(validationResult.valid).toBeFalsy()
            expect(validationResult.errors?.length).toBe(1)
            expect(validationResult.errors?.map(error => error?.message)).toContain(
                '[BR-OWN-4] The netTotal (BT-131) of each line must be the netPricePerItem (BT-146) multiplied with the itemQuantity (BT-129) divided by the priceBaseQuantity (BT-149, if available. Default for priceBaseQuantity is 1). Minus the sum of all lineLevelAllowances (BT-136) plus the sum of all lineLevelCharges (BT-141).'
            )
        })
    })
})
