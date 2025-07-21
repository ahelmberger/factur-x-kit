import fs from 'node:fs'
import path from 'node:path'

import { FacturX } from '../../src/index'
import { ComfortProfile, isComfortProfile } from '../../src/profiles/comfort/ComfortProfile'
import { PROFILES } from '../../src/types/ProfileTypes'
import {
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES
} from '../../src/types/codes'

type TestCases = Record<string, ComfortProfile | undefined>

const testCases: TestCases = Object.fromEntries(
    ['EN16931_Einfach_DueDate', 'EN16931_Elektron'].map(name => [name, undefined])
)

beforeAll(async () => {
    for (const name of Object.keys(testCases)) {
        const facturX = await FacturX.fromPDF(fs.readFileSync(path.join(__dirname, 'pdf', `${name}.pdf`)))
        const result = await facturX.getObject()
        if (!isComfortProfile(result)) throw new Error('The profile was not properly chosen')

        testCases[name] = result
    }
})

describe('Factur-X EN16931_Elektron', () => {
    describe('7.2.2 - ExchangedDocumentContext - Page 43/85 f.', () => {
        describe('BG-2 - PROCESS CONTROL', () => {
            test('BT-23 - Business process type', () => {
                expect(testCases['EN16931_Elektron']?.businessProcessType).toBe('Baurechnung')
            })
            test('BT-24 - Specification identifier', () => {
                expect(testCases['EN16931_Elektron']?.profile).toBe(PROFILES.COMFORT)
            })
        })
    })

    describe('7.2.2 - ExchangedDocument - Page 44/85.', () => {
        test('BT-1 - Invoice number', () => {
            expect(testCases['EN16931_Elektron']?.document.id).toBe('181301674')
        })

        test('BT-3 - Type Code', () => {
            expect(testCases['EN16931_Elektron']?.document.type).toBe('204')
            expect(testCases['EN16931_Elektron']?.document.type).toBe(DOCUMENT_TYPE_CODES.PAYMENT_VALUATION)
        })

        test('BT-2 - Invoice issue date', () => {
            const dateOfIssue = testCases['EN16931_Elektron']?.document.dateOfIssue
            if (!dateOfIssue) {
                throw new Error('Document Date undefined')
            }
            expect(dateOfIssue).toEqual({ year: 2024, month: 11, day: 15 })
        })

        test('BG-1 - INCLUDED NOTE', () => {
            const notes = testCases['EN16931_Elektron']?.document.notes
            expect(notes).toHaveLength(1)
            expect(notes?.[0].content).toBe(
                `Rapport-Nr.: 42389 vom 01.11.2024\n\nIm 2. OG BT1 Besprechungsraum eine Beamerhalterung an die Decke montiert. Dafür eine Deckenplatte ausgesägt. Beamerhalterung zur Montage auseinander gebaut. Ein Stromkabel für den Beamer, ein HDMI Kabel und ein VGA Kabel durch die Halterung gezogen. Beamerhalterung wieder zusammengebaut und Beamer montiert. Beamer verkabelt und ausgerichtet. Decke geschlossen.`
            )
            expect(notes?.[0].subject).toBeUndefined()
        })
    })

    describe('7.3.3 - SupplyChainTradeTransaction - Page 44/85 ff.', () => {
        describe('7.3.3.1 - ApplicableHeaderTradeAgreement', () => {
            test('BT-10-00 - Buyer reference', () => {
                expect(testCases['EN16931_Elektron']?.buyer.reference).toBe('Liselotte Müller-Lüdenscheidt')
            })

            describe('BG-4 - SELLER', () => {
                test('BT-29 - Seller identifier', () => {
                    expect(testCases['EN16931_Elektron']?.seller.id).toEqual(['549910'])
                })
                test('BT-27 - Seller name', () => {
                    expect(testCases['EN16931_Elektron']?.seller.name).toBe('ELEKTRON Industrieservice GmbH')
                })
                test('Seller other legal information (Description)', () => {
                    expect(testCases['EN16931_Elektron']?.seller.otherLegalInformation).toBe(
                        'Geschäftsführer Egon Schrempp Amtsgericht Stuttgart HRB 1234'
                    )
                })
                test('BT-30-00 - Seller legal registration', () => {
                    expect(testCases['EN16931_Elektron']?.seller.specifiedLegalOrganization?.id).toBeUndefined()
                })
                describe('BG-5 - SELLER POSTAL ADDRESS', () => {
                    test('BT-37 - Seller address line 1', () => {
                        expect(testCases['EN16931_Elektron']?.seller.postalAddress.addressLineOne).toBe(
                            'Erfurter Strasse 13'
                        )
                    })
                    test('Seller address line 2', () => {
                        expect(testCases['EN16931_Elektron']?.seller.postalAddress.addressLineTwo).toBeUndefined()
                    })
                    test('Seller address line 3', () => {
                        expect(testCases['EN16931_Elektron']?.seller.postalAddress.addressLineThree).toBeUndefined()
                    })
                    test('BT-38 - Seller city', () => {
                        expect(testCases['EN16931_Elektron']?.seller.postalAddress.city).toBe('Demoort')
                    })
                    test('BT-36 - Seller postcode', () => {
                        expect(testCases['EN16931_Elektron']?.seller.postalAddress.postcode).toBe('74465')
                    })
                    test('BT-40 - Seller country code', () => {
                        expect(testCases['EN16931_Elektron']?.seller.postalAddress.country).toBe(
                            COUNTRY_ID_CODES.GERMANY
                        )
                    })
                    test('Seller country subdivision', () => {
                        expect(testCases['EN16931_Elektron']?.seller.postalAddress.countrySubDivision).toBeUndefined()
                    })
                })
                test('BT-31-00 - Seller VAT identifier', () => {
                    expect(testCases['EN16931_Elektron']?.seller.taxIdentification?.localTaxId).toBeUndefined()
                    expect(testCases['EN16931_Elektron']?.seller.taxIdentification?.vatId).toBe('DE136695976')
                })
            })
            describe('BG-7 - BUYER', () => {
                test('BT-46 - Buyer identifier', () => {
                    expect(testCases['EN16931_Elektron']?.buyer.id).toBe('16259')
                })
                test('BT-44 - Buyer name', () => {
                    expect(testCases['EN16931_Elektron']?.buyer.name).toBe('ConsultingService GmbH')
                })
                test('BT-47-00 - Buyer legal registration', () => {
                    expect(testCases['EN16931_Elektron']?.buyer.specifiedLegalOrganization?.id).toBeUndefined()
                })
                describe('BG-8 - BUYER POSTAL ADDRESS', () => {
                    test('BT-52 - Buyer address line 1', () => {
                        expect(testCases['EN16931_Elektron']?.buyer.postalAddress.addressLineOne).toBe('Musterstr. 18')
                    })
                    test('Buyer address line 2', () => {
                        expect(testCases['EN16931_Elektron']?.buyer.postalAddress.addressLineTwo).toBeUndefined()
                    })
                    test('Buyer address line 3', () => {
                        expect(testCases['EN16931_Elektron']?.buyer.postalAddress.addressLineThree).toBeUndefined()
                    })
                    test('BT-53 - Buyer city', () => {
                        expect(testCases['EN16931_Elektron']?.buyer.postalAddress.city).toBe('Karlsruhe')
                    })
                    test('BT-51 - Buyer postcode', () => {
                        expect(testCases['EN16931_Elektron']?.buyer.postalAddress.postcode).toBe('76138')
                    })
                    test('BT-55 - Buyer country code', () => {
                        expect(testCases['EN16931_Elektron']?.buyer.postalAddress.country).toBe(
                            COUNTRY_ID_CODES.GERMANY
                        )
                    })
                    test('Buyer country subdivision', () => {
                        expect(testCases['EN16931_Elektron']?.buyer.postalAddress.countrySubDivision).toBeUndefined()
                    })
                })
            })
            test('BT-13-00 - BuyerOrderReferencedDocument (SellerOrderReferencedDocument in XML)', () => {
                expect(testCases['EN16931_Elektron']?.referencedDocuments?.orderConfirmationReference?.documentId).toBe(
                    'per Mail vom 01.09.2024'
                )
            })

            test('BG-24 - ADDITIONAL SUPPORTING DOCUMENTS', () => {
                const supportingDocs =
                    testCases['EN16931_Elektron']?.referencedDocuments?.additionalReferences?.invoiceSupportingDocuments
                expect(supportingDocs).toHaveLength(2)

                if (supportingDocs) {
                    // Guard for type safety
                    expect(supportingDocs[0].documentId).toBe('13130162')
                    expect(supportingDocs[0].uriid).toBe('#ef=Aufmass.png')

                    expect(supportingDocs[1].documentId).toBe('42389')
                    expect(supportingDocs[1].uriid).toBe('#ef=ElektronRapport_neu-red.pdf')
                }
            })

            test('BT-17-00 - PROJECT REFERENCE', () => {
                expect(testCases['EN16931_Elektron']?.referencedDocuments?.projectReference?.id).toBe('13130162')
                expect(testCases['EN16931_Elektron']?.referencedDocuments?.projectReference?.name).toBe('Projekt')
            })
        })

        describe('7.3.3.2 - ApplicableHeaderTradeDelivery', () => {
            test('BT-73 - Actual delivery date', () => {
                const deliveryDate = testCases['EN16931_Elektron']?.delivery?.deliveryDate
                if (!deliveryDate) {
                    throw new Error('Delivery date undefined')
                }
                expect(deliveryDate).toEqual({ year: 2024, month: 11, day: 1 })
            })
        })

        describe('BG-19 ApplicableHeaderTradeSettlement', () => {
            test('BT-5 - InvoiceCurrencyCode', () => {
                expect(testCases['EN16931_Elektron']?.document.currency).toBe(CURRENCY_CODES.Euro)
            })

            test('BT-20 - Payment reference', () => {
                expect(testCases['EN16931_Elektron']?.paymentInformation?.paymentReference).toBe('Rechnung 181301674')
            })

            describe('BG-16 - PAYMENT MEANS', () => {
                test('BT-81 - Payment means type code', () => {
                    const paymentMeans = testCases['EN16931_Elektron']?.paymentInformation?.paymentMeans?.[0]
                    expect(paymentMeans?.paymentType).toBe('58')
                })
                test('BT-84 - Payee financial account IBAN', () => {
                    const paymentMeans = testCases['EN16931_Elektron']?.paymentInformation?.paymentMeans?.[0]
                    expect(paymentMeans?.payeeBankAccount?.iban).toBe('DE91100000000123456789')
                })
            })

            describe('BG-20 - PAYMENT TERMS', () => {
                test('BT-20 - Payment terms description', () => {
                    expect(testCases['EN16931_Elektron']?.paymentInformation?.paymentTerms?.description).toBe(
                        'Zahlbar sofort rein netto'
                    )
                })
            })

            describe('BG-22 SpecifiedTradeSettlementHeaderMonetarySummation', () => {
                test('BT-106 - Sum of Invoice line net amount', () => {
                    expect(testCases['EN16931_Elektron']?.totals.sumWithoutAllowancesAndCharges).toBe(252.1)
                })
                test('BT-107 - Document level allowance total amount', () => {
                    expect(testCases['EN16931_Elektron']?.totals.allowanceTotalAmount).toBe(0)
                })
                test('BT-108 - Document level charge total amount', () => {
                    expect(testCases['EN16931_Elektron']?.totals.chargeTotalAmount).toBe(0)
                })
                test('BT-109 - Invoice total amount without VAT (TaxBasisTotalAmount)', () => {
                    expect(testCases['EN16931_Elektron']?.totals.netTotal).toBe(252.1)
                })

                describe('BG-23 DOCUMENT LEVEL APPLICABLE TRADE TAX', () => {
                    test('All tax breakdown checks', () => {
                        // Grouped for brevity as they all depend on taxBreakdown[0]
                        const taxBreakdown = testCases['EN16931_Elektron']?.totals?.taxBreakdown?.[0]
                        if (!taxBreakdown) throw new Error('Tax breakdown is undefined')

                        expect(taxBreakdown.basisAmount).toBe(252.1) // BT-116
                        expect(taxBreakdown.calculatedAmount).toBe(47.9) // BT-117
                        expect(taxBreakdown.categoryCode).toBe(TAX_CATEGORY_CODES.STANDARD_RATE) // BT-95
                        expect(taxBreakdown.typeCode).toBe(TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT) // BT-96 (conceptually)
                        expect(taxBreakdown.exemptionReason).toBeUndefined() // BT-102
                        expect(taxBreakdown.exemptionReasonCode).toBeUndefined() // BT-103
                        expect(taxBreakdown.rateApplicablePercent).toBe(19) // BT-102_BT-103 (ZUGFeRD mapping)
                        expect(taxBreakdown.taxPointDate).toBeUndefined()
                    })
                })

                test('BT-110 - VAT total amount (TaxTotalAmount)', () => {
                    const taxTotal = testCases['EN16931_Elektron']?.totals.taxTotal
                    const taxTotalNormalized = Array.isArray(taxTotal) ? taxTotal[0] : taxTotal
                    expect(taxTotalNormalized?.amount).toBe(47.9)
                    expect(taxTotalNormalized?.currency).toBe(CURRENCY_CODES.Euro)
                })
                test('BT-111 - Invoice total amount with VAT (GrandTotalAmount)', () => {
                    expect(testCases['EN16931_Elektron']?.totals.grossTotal).toBe(300)
                })
                test('BT-113 - Paid amount', () => {
                    expect(testCases['EN16931_Elektron']?.totals.prepaidAmount).toBe(0)
                })
                test('BT-114 - Rounding amount', () => {
                    expect(testCases['EN16931_Elektron']?.totals.roundingAmount).toBeUndefined()
                })
                test('BT-115 - Amount due for payment (DuePayableAmount)', () => {
                    expect(testCases['EN16931_Elektron']?.totals.openAmount).toBe(300)
                })
            })
            test('BT-89 - Receivable specified trade accounting account', () => {
                expect(testCases['EN16931_Elektron']?.paymentInformation?.specifiedTradeAccountingAccount).toBe('420')
            })
        })
    })

    describe('BG-25 - INVOICE LINE', () => {
        test('Number of invoice lines', () => {
            const invoiceLines = testCases['EN16931_Elektron']?.invoiceLines
            expect(invoiceLines).toHaveLength(2)
        })

        describe('Invoice Line 1', () => {
            // It's often cleaner to get the specific line once at the start of the describe for this line
            // but to strictly adhere to "no constants in describe", we access it in each test.
            // As a compromise, one could define 'line' inside each 'test' block for this specific line.
            // For this example, I'll repeat the access path.

            test('BT-126 - Line ID', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[0].generalLineData.lineId).toBe('01')
            })
            test('BT-127 - Line note', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[0].generalLineData.lineNote?.content).toBe(
                    '01 Beamermontage\nFür die doppelte Verlegung, falls erforderlich.'
                )
            })
            test('BT-153 - Item name', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[0].productDescription.name).toBe(
                    'TGA Obermonteur/Monteur'
                )
            })
            test('BT-146 - Item net price', () => {
                expect(
                    testCases['EN16931_Elektron']?.invoiceLines?.[0].productPriceAgreement.productNetPricing
                        ?.netPricePerItem
                ).toBe(43.2)
            })
            test('BT-150 - Item gross price', () => {
                expect(
                    testCases['EN16931_Elektron']?.invoiceLines?.[0].productPriceAgreement.productPricing
                        ?.basisPricePerItem
                ).toBe(43.2)
            })
            test('BT-129 - Invoiced quantity', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[0].delivery.itemQuantity.quantity).toBe(3)
            })
            test('BT-130 - Invoiced quantity unit of measure', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[0].delivery.itemQuantity.unit).toBe(
                    UNIT_CODES.HOUR
                )
            })
            describe('Line Tax Information', () => {
                test('All line tax checks', () => {
                    const tax = testCases['EN16931_Elektron']?.invoiceLines?.[0].settlement.tax
                    if (!tax) throw new Error('Line 1 tax information is undefined')
                    expect(tax.categoryCode).toBe(TAX_CATEGORY_CODES.STANDARD_RATE) // BT-151
                    expect(tax.typeCode).toBe(TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT)
                    expect(tax.rateApplicablePercent).toBe(19) // BT-152
                })
            })
            test('BT-131 - Invoice line net amount', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[0].settlement.lineTotals.netTotal).toBe(129.6)
            })
        })

        describe('Invoice Line 2', () => {
            test('BT-126 - Line ID', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[1].generalLineData.lineId).toBe('02')
            })
            test('BT-127 - Line note', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[1].generalLineData.lineNote?.content).toBe(
                    '02 Außerhalb Angebot'
                )
            })
            test('BT-153 - Item name', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[1].productDescription.name).toBe(
                    'Beamer-Deckenhalterung'
                )
            })
            test('BT-146 - Item net price', () => {
                expect(
                    testCases['EN16931_Elektron']?.invoiceLines?.[1].productPriceAgreement.productNetPricing
                        ?.netPricePerItem
                ).toBe(122.5)
            })
            test('BT-150 - Item gross price', () => {
                expect(
                    testCases['EN16931_Elektron']?.invoiceLines?.[1].productPriceAgreement.productPricing
                        ?.basisPricePerItem
                ).toBe(122.5)
            })
            test('BT-129 - Invoiced quantity', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[1].delivery.itemQuantity.quantity).toBe(1)
            })
            test('BT-130 - Invoiced quantity unit of measure', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[1].delivery.itemQuantity.unit).toBe(
                    UNIT_CODES.PIECE
                )
            })
            describe('Line Tax Information', () => {
                test('All line tax checks', () => {
                    const tax = testCases['EN16931_Elektron']?.invoiceLines?.[1].settlement.tax
                    if (!tax) throw new Error('Line 2 tax information is undefined')
                    expect(tax.categoryCode).toBe(TAX_CATEGORY_CODES.STANDARD_RATE)
                    expect(tax.typeCode).toBe(TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT)
                    expect(tax.rateApplicablePercent).toBe(19)
                })
            })
            test('BT-131 - Invoice line net amount', () => {
                expect(testCases['EN16931_Elektron']?.invoiceLines?.[1].settlement.lineTotals.netTotal).toBe(122.5)
            })
        })
    })
})

describe('Tests for EN16931_Einfach_DueDate', () => {
    const testCaseKey = 'EN16931_Einfach_DueDate' // Diese Definition ist OK, da sie nicht von Testdaten abhängt.

    describe('7.2.2 - ExchangedDocumentContext - Page 43/85 f.', () => {
        describe('BG-2 - PROCESS CONTROL', () => {
            test('BT-23 - Business process type', () => {
                expect(testCases[testCaseKey]?.businessProcessType).toBeUndefined()
            })
            test('BT-24 - Specification identifier', () => {
                expect(testCases[testCaseKey]?.profile).toBe(PROFILES.COMFORT)
            })
        })
    })

    describe('7.2.2 - ExchangedDocument - Page 44/85.', () => {
        test('BT-1 - Invoice number', () => {
            expect(testCases[testCaseKey]?.document.id).toBe('471102')
        })

        test('BT-3 - Type Code', () => {
            expect(testCases[testCaseKey]?.document.type).toBe('380')
            expect(testCases[testCaseKey]?.document.type).toBe(DOCUMENT_TYPE_CODES.COMMERCIAL_INVOICE)
        })

        test('BT-2 - Invoice issue date', () => {
            const dateOfIssue = testCases[testCaseKey]?.document.dateOfIssue
            if (!dateOfIssue) {
                throw new Error('Document Date undefined')
            }
            expect(dateOfIssue).toEqual({ year: 2024, month: 11, day: 15 })
        })

        test('BG-1 - INCLUDED NOTE', () => {
            const notes = testCases[testCaseKey]?.document.notes
            expect(notes).toHaveLength(2)

            if (notes) {
                expect(notes[0].content).toBe('Rechnung gemäß Bestellung vom 01.11.2018.')
                expect(notes[0].subject).toBeUndefined()

                expect(notes[1].content).toBe(`Lieferant GmbH				
Lieferantenstraße 20				
80333 München				
Deutschland				
Geschäftsführer: Hans Muster
Handelsregisternummer: H A 123`)
                expect(notes[1].subject).toBe('REG')
            }
        })
    })

    describe('7.3.3 - SupplyChainTradeTransaction - Page 44/85 ff.', () => {
        describe('7.3.3.1 - ApplicableHeaderTradeAgreement', () => {
            test('BT-10-00 - Buyer reference', () => {
                expect(testCases[testCaseKey]?.buyer.reference).toBeUndefined()
            })

            describe('BG-4 - SELLER', () => {
                test('BT-29 - Seller identifier (Party ID)', () => {
                    expect(testCases[testCaseKey]?.seller.id).toEqual(['549910'])
                })
                test('BT-29-1 - Seller identifier (Global ID)', () => {
                    const globalId = testCases[testCaseKey]?.seller.globalId?.find(id => id.scheme === '0088')
                    expect(globalId?.id).toBe('4000001123452')
                })
                test('BT-27 - Seller name', () => {
                    expect(testCases[testCaseKey]?.seller.name).toBe('Lieferant GmbH')
                })
                test('BT-30-00 - Seller legal registration', () => {
                    expect(testCases[testCaseKey]?.seller.specifiedLegalOrganization?.id).toBeUndefined()
                })
                describe('BG-5 - SELLER POSTAL ADDRESS', () => {
                    test('BT-37 - Seller address line 1', () => {
                        expect(testCases[testCaseKey]?.seller.postalAddress?.addressLineOne).toBe(
                            'Lieferantenstraße 20'
                        )
                    })
                    test('BT-38 - Seller city', () => {
                        expect(testCases[testCaseKey]?.seller.postalAddress?.city).toBe('München')
                    })
                    test('BT-36 - Seller postcode', () => {
                        expect(testCases[testCaseKey]?.seller.postalAddress?.postcode).toBe('80333')
                    })
                    test('BT-40 - Seller country code', () => {
                        expect(testCases[testCaseKey]?.seller.postalAddress?.country).toBe(COUNTRY_ID_CODES.GERMANY)
                    })
                })
                test('BT-31-00 - Seller VAT identifier', () => {
                    expect(testCases[testCaseKey]?.seller.taxIdentification?.vatId).toBe('DE123456789')
                })
                test('BT-32-00 - Seller tax registration identifier (Local/FC)', () => {
                    const localTaxId = testCases[testCaseKey]?.seller.taxIdentification?.localTaxId
                    expect(localTaxId).toBe('201/113/40209')
                })
            })
            describe('BG-7 - BUYER', () => {
                test('BT-46 - Buyer identifier', () => {
                    expect(testCases[testCaseKey]?.buyer.id).toBe('GE2020211')
                })
                test('BT-44 - Buyer name', () => {
                    expect(testCases[testCaseKey]?.buyer.name).toBe('Kunden AG Mitte')
                })
                describe('BG-8 - BUYER POSTAL ADDRESS', () => {
                    test('BT-52 - Buyer address line 1', () => {
                        expect(testCases[testCaseKey]?.buyer.postalAddress?.addressLineOne).toBe('Kundenstraße 15')
                    })
                    test('BT-53 - Buyer city', () => {
                        expect(testCases[testCaseKey]?.buyer.postalAddress?.city).toBe('Frankfurt')
                    })
                    test('BT-51 - Buyer postcode', () => {
                        expect(testCases[testCaseKey]?.buyer.postalAddress?.postcode).toBe('69876')
                    })
                    test('BT-55 - Buyer country code', () => {
                        expect(testCases[testCaseKey]?.buyer.postalAddress?.country).toBe(COUNTRY_ID_CODES.GERMANY)
                    })
                })
            })
            test('BT-13-00 - BuyerOrderReferencedDocument', () => {
                expect(testCases[testCaseKey]?.referencedDocuments?.orderReference).toBeUndefined()
                expect(testCases[testCaseKey]?.referencedDocuments?.orderConfirmationReference).toBeUndefined()
            })
        })

        describe('7.3.3.2 - ApplicableHeaderTradeDelivery', () => {
            test('BT-73 - Actual delivery date', () => {
                const deliveryDate = testCases[testCaseKey]?.delivery?.deliveryDate
                if (!deliveryDate) {
                    throw new Error('Delivery date undefined')
                }
                expect(deliveryDate).toEqual({ year: 2024, month: 11, day: 14 })
            })
        })

        describe('BG-19 ApplicableHeaderTradeSettlement', () => {
            test('BT-5 - InvoiceCurrencyCode', () => {
                expect(testCases[testCaseKey]?.document.currency).toBe(CURRENCY_CODES.Euro)
            })

            test('BT-20 - Payment reference', () => {
                expect(testCases[testCaseKey]?.paymentInformation?.paymentReference).toBeUndefined()
            })

            describe('BG-20 - PAYMENT TERMS', () => {
                test('BT-9 - Payment due date', () => {
                    const dueDate = testCases[testCaseKey]?.paymentInformation?.paymentTerms?.dueDate
                    if (!dueDate) {
                        throw new Error('Due date undefined')
                    }
                    expect(dueDate).toEqual({ year: 2024, month: 12, day: 15 })
                })
                test('BT-20 - Payment terms description', () => {
                    expect(testCases[testCaseKey]?.paymentInformation?.paymentTerms?.description).toBeUndefined()
                })
            })

            describe('BG-22 SpecifiedTradeSettlementHeaderMonetarySummation', () => {
                test('BT-106 - Sum of Invoice line net amount', () => {
                    expect(testCases[testCaseKey]?.totals?.sumWithoutAllowancesAndCharges).toBe(473.0)
                })
                test('BT-107 - Document level allowance total amount', () => {
                    expect(testCases[testCaseKey]?.totals?.allowanceTotalAmount).toBe(0.0)
                })
                test('BT-108 - Document level charge total amount', () => {
                    expect(testCases[testCaseKey]?.totals?.chargeTotalAmount).toBe(0.0)
                })
                test('BT-109 - Invoice total amount without VAT (TaxBasisTotalAmount)', () => {
                    expect(testCases[testCaseKey]?.totals?.netTotal).toBe(473.0)
                })

                describe('BG-23 DOCUMENT LEVEL APPLICABLE TRADE TAX', () => {
                    test('Number of tax breakdowns', () => {
                        expect(testCases[testCaseKey]?.totals?.taxBreakdown).toHaveLength(2)
                    })

                    test('Tax Breakdown 1 (7%)', () => {
                        const taxBreakdown = testCases[testCaseKey]?.totals?.taxBreakdown?.find(
                            tb => tb.rateApplicablePercent === 7
                        )
                        if (!taxBreakdown) throw new Error('Tax breakdown for 7% not found')

                        expect(taxBreakdown.basisAmount).toBe(275.0)
                        expect(taxBreakdown.calculatedAmount).toBe(19.25)
                        expect(taxBreakdown.categoryCode).toBe(TAX_CATEGORY_CODES.STANDARD_RATE)
                        expect(taxBreakdown.typeCode).toBe(TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT)
                        expect(taxBreakdown.rateApplicablePercent).toBe(7.0)
                    })

                    test('Tax Breakdown 2 (19%)', () => {
                        const taxBreakdown = testCases[testCaseKey]?.totals?.taxBreakdown?.find(
                            tb => tb.rateApplicablePercent === 19
                        )
                        if (!taxBreakdown) throw new Error('Tax breakdown for 19% not found')

                        expect(taxBreakdown.basisAmount).toBe(198.0)
                        expect(taxBreakdown.calculatedAmount).toBe(37.62)
                        expect(taxBreakdown.categoryCode).toBe(TAX_CATEGORY_CODES.STANDARD_RATE)
                        expect(taxBreakdown.typeCode).toBe(TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT)
                        expect(taxBreakdown.rateApplicablePercent).toBe(19.0)
                    })
                })

                test('BT-110 - VAT total amount (TaxTotalAmount)', () => {
                    const taxTotal = testCases[testCaseKey]?.totals?.taxTotal
                    const taxTotalNormalized = Array.isArray(taxTotal) ? taxTotal[0] : taxTotal
                    expect(taxTotalNormalized?.amount).toBe(56.87)
                    expect(taxTotalNormalized?.currency).toBe(CURRENCY_CODES.Euro)
                })
                test('BT-111 - Invoice total amount with VAT (GrandTotalAmount)', () => {
                    expect(testCases[testCaseKey]?.totals?.grossTotal).toBe(529.87)
                })
                test('BT-113 - Paid amount', () => {
                    expect(testCases[testCaseKey]?.totals?.prepaidAmount).toBe(0.0)
                })
                test('BT-115 - Amount due for payment (DuePayableAmount)', () => {
                    expect(testCases[testCaseKey]?.totals?.openAmount).toBe(529.87)
                })
            })
        })
    })

    describe('BG-25 - INVOICE LINE', () => {
        test('Number of invoice lines', () => {
            const invoiceLines = testCases[testCaseKey]?.invoiceLines
            expect(invoiceLines).toHaveLength(2)
        })

        describe('Invoice Line 1', () => {
            test('BT-126 - Line ID', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[0].generalLineData.lineId).toBe('1')
            })
            test('BT-154 - Item Seller Assigned ID', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[0].productDescription.sellerProductId).toBe('TB100A4')
            })
            test('BT-155 - Item Global ID', () => {
                const globalId = testCases[testCaseKey]?.invoiceLines?.[0].productDescription.globalId
                expect(globalId?.id).toBe('4012345001235')
                expect(globalId?.scheme).toBe('0160')
            })
            test('BT-153 - Item name', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[0].productDescription.name).toBe('Trennblätter A4')
            })
            test('BT-146 - Item net price', () => {
                expect(
                    testCases[testCaseKey]?.invoiceLines?.[0].productPriceAgreement.productNetPricing?.netPricePerItem
                ).toBe(9.9)
            })
            test('BT-150 - Item gross price', () => {
                expect(
                    testCases[testCaseKey]?.invoiceLines?.[0].productPriceAgreement.productPricing?.basisPricePerItem
                ).toBe(9.9)
            })
            test('BT-129 - Invoiced quantity', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[0].delivery.itemQuantity.quantity).toBe(20.0)
            })
            test('BT-130 - Invoiced quantity unit of measure', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[0].delivery.itemQuantity.unit).toBe(UNIT_CODES.PIECE) // H87
            })
            describe('Line Tax Information', () => {
                test('All line tax checks', () => {
                    const tax = testCases[testCaseKey]?.invoiceLines?.[0].settlement.tax
                    if (!tax) throw new Error('Line 1 tax information is undefined for EN16931_Einfach_DueDate')
                    expect(tax.categoryCode).toBe(TAX_CATEGORY_CODES.STANDARD_RATE)
                    expect(tax.typeCode).toBe(TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT)
                    expect(tax.rateApplicablePercent).toBe(19.0)
                })
            })
            test('BT-131 - Invoice line net amount', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[0].settlement.lineTotals.netTotal).toBe(198.0)
            })
        })

        describe('Invoice Line 2', () => {
            test('BT-126 - Line ID', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[1].generalLineData.lineId).toBe('2')
            })
            test('BT-154 - Item Seller Assigned ID', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[1].productDescription.sellerProductId).toBe('ARNR2')
            })
            test('BT-155 - Item Global ID', () => {
                const globalId = testCases[testCaseKey]?.invoiceLines?.[1].productDescription.globalId
                expect(globalId?.id).toBe('4000050986428')
                expect(globalId?.scheme).toBe('0160')
            })
            test('BT-153 - Item name', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[1].productDescription.name).toBe('Joghurt Banane')
            })
            test('BT-146 - Item net price', () => {
                expect(
                    testCases[testCaseKey]?.invoiceLines?.[1].productPriceAgreement.productNetPricing?.netPricePerItem
                ).toBe(5.5)
            })
            test('BT-150 - Item gross price', () => {
                expect(
                    testCases[testCaseKey]?.invoiceLines?.[1].productPriceAgreement.productPricing?.basisPricePerItem
                ).toBe(5.5)
            })
            test('BT-129 - Invoiced quantity', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[1].delivery.itemQuantity.quantity).toBe(50.0)
            })
            test('BT-130 - Invoiced quantity unit of measure', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[1].delivery.itemQuantity.unit).toBe(UNIT_CODES.PIECE) // H87
            })
            describe('Line Tax Information', () => {
                test('All line tax checks', () => {
                    const tax = testCases[testCaseKey]?.invoiceLines?.[1].settlement.tax
                    if (!tax) throw new Error('Line 2 tax information is undefined for EN16931_Einfach_DueDate')
                    expect(tax.categoryCode).toBe(TAX_CATEGORY_CODES.STANDARD_RATE)
                    expect(tax.typeCode).toBe(TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT)
                    expect(tax.rateApplicablePercent).toBe(7.0)
                })
            })
            test('BT-131 - Invoice line net amount', () => {
                expect(testCases[testCaseKey]?.invoiceLines?.[1].settlement.lineTotals.netTotal).toBe(275.0)
            })
        })
    })
})
