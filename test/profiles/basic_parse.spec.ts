import fs from 'node:fs'
import path from 'node:path'

import { FacturX } from '../../src/index'
import { BasicProfile, isBasicProfile } from '../../src/profiles/basic/BasicProfile'
import {
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE
} from '../../src/types/codes'

type TestCases = Record<string, BasicProfile | undefined>

const testCases: TestCases = Object.fromEntries(['BASIC_Einfach', 'BASIC_Taxifahrt'].map(name => [name, undefined]))

beforeAll(async () => {
    for (const name of Object.keys(testCases)) {
        const facturX = await FacturX.fromPDF(fs.readFileSync(path.join(__dirname, 'pdf', `${name}.pdf`)))
        const result = await facturX.getObject()
        if (!isBasicProfile(result)) throw new Error('The profile was not properly chosen')

        testCases[name] = result
    }
})

describe('7.2.2 - ExchangedDocumentContext - Page 43/85 f.', () => {
    describe('BG-2 - PROCESS CONTROL', () => {
        test('BT-23 - Business process type', () => {
            expect(testCases['BASIC_Taxifahrt']?.businessProcessType).toBe(undefined)
        })
        test('BT-24 - Specification identifier', () => {
            expect(testCases['BASIC_Taxifahrt']?.profile).toBe(
                'urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic'
            )
        })
    })
})

describe('7.2.2 - ExchangedDocument - Page 44/85.', () => {
    test('BT-1 - Invoice number', () => {
        expect(testCases['BASIC_Taxifahrt']?.document.id).toBe('TX-471102')
    })

    test('BT-3 - Type Code', () => {
        expect(testCases['BASIC_Taxifahrt']?.document.type).toBe('380')
        expect(testCases['BASIC_Taxifahrt']?.document.type).toBe(DOCUMENT_TYPE_CODES.COMMERCIAL_INVOICE)
    })
    test('BT-2 - Invoice issue date', () => {
        if (!testCases['BASIC_Taxifahrt']?.document.dateOfIssue) {
            throw new Error('PDF or Document Date undefined')
        }
        expect(testCases['BASIC_Taxifahrt'].document.dateOfIssue).toEqual({ year: 2024, month: 11, day: 15 })
    })
})

describe('7.3.3 - SupplyChainTradeTransaction - Page 44/85 ff.', () => {
    describe('7.3.3.1 - ApplicableHeaderTradeAgreement', () => {
        test('BT-10-00 - Buyer reference', () => {
            expect(testCases['BASIC_Taxifahrt']?.buyer.reference).toBeUndefined()
        })
        describe('BG-4 - SELLER', () => {
            test('BT-27 - Seller name', () => {
                expect(testCases['BASIC_Taxifahrt']?.seller.name).toBe('Taxiunternehmen TX GmbH')
            })
            test('BT-30-00 - Seller legal registration', () => {
                expect(testCases['BASIC_Taxifahrt']?.seller.specifiedLegalOrganization?.id).toBeUndefined()
            })
            describe('BG-5 - SELLER POSTAL ADDRESS', () => {
                test('BT-40 - Seller country code', () => {
                    expect(testCases['BASIC_Taxifahrt']?.seller.postalAddress.country).toBe(COUNTRY_ID_CODES.GERMANY)
                })
            })
            test('BT-31-00 - Seller VAT identifier', () => {
                expect(testCases['BASIC_Taxifahrt']?.seller.taxIdentification?.localTaxId).toBeUndefined()
                expect(testCases['BASIC_Taxifahrt']?.seller.taxIdentification?.vatId).toBe('DE123456789')
            })
        })
        describe('BG-5 - BUYER', () => {
            test('BT-44 - Buyer name', () => {
                expect(testCases['BASIC_Taxifahrt']?.buyer.name).toBe('Taxi-Gast AG Mitte')
            })
            test('BT-47-00 - Buyer legal registration', () => {
                expect(testCases['BASIC_Taxifahrt']?.buyer.specifiedLegalOrganization?.id).toBeUndefined()
            })
        })
        test('BT-13-00 - BuyerOrderReferencedDocument', () => {
            expect(testCases['BASIC_Taxifahrt']?.referencedDocuments?.orderReference).toBeUndefined()
        })
    })
    describe('BG-19 ApplicableHeaderTradeSettlement', () => {
        test('BT-5 - InvoiceCurrencyCode', () => {
            expect(testCases['BASIC_Taxifahrt']?.document.currency).toBe(CURRENCY_CODES.Euro)
        })

        describe('7.3.3.3 - ApplicableHeaderTradeSettlement', () => {
            describe('BG-22 SpecifiedTradeSettlementHeaderMonetarySummation', () => {
                test('BT-109 - TaxBasisTotalAmount', () => {
                    expect(testCases['BASIC_Taxifahrt']?.totals.netTotal).toBe(16.9)
                })
                test('BG-23 Applicable Trade Tax', () => {
                    const taxBreakdown = testCases['BASIC_Taxifahrt']?.totals?.taxBreakdown?.[0]
                    if (taxBreakdown) {
                        const {
                            calculatedAmount,
                            typeCode,
                            exemptionReason,
                            basisAmount,
                            categoryCode,
                            exemptionReasonCode,
                            dueDateTypeCode,
                            rateApplicablePercent
                        } = taxBreakdown
                        expect(calculatedAmount).toBe(1.18)
                        expect(typeCode).toBe(TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT)
                        expect(exemptionReason).toBeUndefined()
                        expect(basisAmount).toBe(16.9)
                        expect(categoryCode).toBe(TAX_CATEGORY_CODES.STANDARD_RATE)
                        expect(exemptionReasonCode).toBeUndefined()
                        expect(dueDateTypeCode).toBeUndefined()
                        expect(rateApplicablePercent).toBe(7)
                    } else {
                        throw new Error('Tax breakdown is undefined')
                    }
                })

                test('BT-110 - TaxTotalAmount', () => {
                    const taxTotal = testCases['BASIC_Taxifahrt']?.totals.taxTotal
                    const taxTotalNormalized = Array.isArray(taxTotal) ? taxTotal[0] : taxTotal
                    const taxTotalAmount = taxTotalNormalized?.amount
                    const taxTotalCurrency = taxTotalNormalized?.currency
                    expect(taxTotalAmount).toBe(1.18)
                    expect(taxTotalCurrency).toBe(CURRENCY_CODES.Euro)
                })
                test('BT-110-0 - TaxCurrencyCode', () => {
                    expect(testCases['BASIC_Taxifahrt']?.totals.taxCurrency).toBeUndefined()
                })
                test('BT-112 - GrandTotalAmount', () => {
                    expect(testCases['BASIC_Taxifahrt']?.totals.grossTotal).toBe(18.08)
                })
                test('BT-115 - DuePayableAmount', () => {
                    expect(testCases['BASIC_Taxifahrt']?.totals.openAmount).toBe(18.08)
                })
            })
        })
    })
})
