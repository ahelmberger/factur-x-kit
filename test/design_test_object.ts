import { ComfortProfile } from '../src/profiles/comfort'
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    EAS_SCHEME_CODES,
    ISO6523_CODES,
    MIME_CODES,
    PAYMENT_MEANS_CODES,
    REFERENCED_DOCUMENT_TYPE_CODES,
    SUBJECT_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES,
    UNTDID_1153,
    UNTDID_7143
} from '../src/types/codes'

export const designTestObject: ComfortProfile = {
    meta: {
        guidelineSpecifiedDocumentContextParameter: 'urn:cen.eu:en16931:2017'
    },
    document: {
        id: 'DOC-12345',
        type: '380' as DOCUMENT_TYPE_CODES,
        dateOfIssue: { year: 2023, month: 10, day: 1 },
        notes: [
            {
                content:
                    'A Vielen Dank für Ihren Einkauf! Hiermit stellen wir die folgenden Leistungen in Rechnung. Dies ist ein Dummy\nText mit Zeilenumbruch',
                subject: 'ACY' as SUBJECT_CODES
            },
            {
                content: 'Vielen Dank für Ihren Einkauf! Hiermit stellen wir die folgenden Leistungen in Rechnung',
                subject: 'ACY' as SUBJECT_CODES
            },
            { content: 'Note 2', subject: 'AEA' as SUBJECT_CODES }
        ],
        currency: 'EUR' as CURRENCY_CODES
    },
    seller: {
        id: ['SELLER-1', 'SELLER-2'],
        globalId: [
            { id: 'GLOBAL-1', scheme: '0204' as ISO6523_CODES },
            { id: 'GLOBAL-2', scheme: '0131' as ISO6523_CODES }
        ],
        name: 'VfB Stuttgart 1893 e.V.',
        specifiedLegalOrganization: {
            id: { id: 'LEGAL-1', scheme: '0060' as ISO6523_CODES },
            tradingBusinessName: 'Seller Trading Name'
        },
        postalAddress: {
            postcode: '70372',
            addressLineOne: 'Mercedesstraße 109',
            city: 'Stuttgart (Bad Cannstatt)',
            country: 'DE' as COUNTRY_ID_CODES,
            countrySubDivision: 'Baden-Württemberg'
        },
        universalCommunicationAddressURI: { id: 'seller@example.com', scheme: '0088' as EAS_SCHEME_CODES },
        taxIdentification: { vatId: 'DE123456789' },
        otherLegalInformation: 'Verkauf',
        tradeContact: [
            {
                personName: 'Hans Müller',
                telephoneNumber: '+49 111222333',
                email: 'hans@firma.de'
            }
        ]
    },
    buyer: {
        reference: 'Buyer Reference',
        id: 'BUYER-1',
        globalId: { id: 'GLOBAL-BUYER-1', scheme: '0204' as ISO6523_CODES },
        name: 'Bayern München AG',
        specifiedLegalOrganization: {
            id: { id: 'LEGAL-BUYER-1', scheme: '0060' as ISO6523_CODES },
            tradingBusinessName: 'Erika GmbH'
        },
        postalAddress: {
            postcode: '80939',
            addressLineOne: 'Franz-Beckenbauer-Platz 5',
            addressLineTwo: 'Allianz Arena',
            city: 'München',
            country: 'DE' as COUNTRY_ID_CODES,
            countrySubDivision: 'Bayern'
        },
        universalCommunicationAddressURI: { id: 'buyer@example.com', scheme: '0088' as EAS_SCHEME_CODES },
        taxIdentification: { vatId: 'DE987654321' },
        tradeContact: [
            {
                personName: 'Manuel Neuer',
                telephoneNumber: '+49 444555666',
                email: 'neuer@bayern-muenchen.de'
            }
        ]
    },
    sellerTaxRepresentative: {
        name: 'Seller Tax Representative',
        postalAddress: {
            postcode: '54321',
            addressLineOne: '789 Tax St',
            addressLineTwo: 'Suite 300',
            addressLineThree: 'Building C',
            city: 'Tax City',
            country: 'DE' as COUNTRY_ID_CODES,
            countrySubDivision: 'Tax State'
        },
        taxIdentification: { vatId: 'DE111111111' }
    },
    referencedDocuments: {
        orderReference: { documentId: 'SO-98765' },
        contractReference: { documentId: 'CON-54321' },
        advanceShippingNotice: { documentId: 'ASN-12345' },
        referencedInvoice: [
            {
                documentId: 'INV-12345',
                issueDate: { year: 2023, month: 9, day: 1 }
            },
            {
                documentId: 'INV-67890',
                issueDate: { year: 2023, month: 9, day: 15 }
            }
        ],
        additionalReferences: {
            invoiceSupportingDocuments: [
                {
                    documentId: '1234',
                    name: 'Rapport',
                    uriid: 'https://example.com/rapport.pdf',
                    attachmentBinaryObject: { mimeCode: 'application/pdf' as MIME_CODES, fileName: 'rapport.pdf' }
                }
            ],
            tenderOrLotReferenceDetails: [{ documentId: 'LOT-001' }, { documentId: 'LOT-002' }],
            invoiceItemDetails: [
                { documentId: 'ITEM-001', referenceTypeCode: 'AVN' as UNTDID_1153 },
                { documentId: 'ITEM-002', referenceTypeCode: 'ACI' as UNTDID_1153 }
            ]
        },
        projectReference: { id: 'PRJ-001', name: 'Procuring Project XY' }
    },
    delivery: {
        recipient: {
            id: 'RECIPIENT-1',
            globalId: { id: 'GLOBAL-RECIPIENT-1', scheme: '0204' as ISO6523_CODES },
            name: 'Recipient Company',
            postalAddress: {
                postcode: '98765',
                addressLineOne: '123 Recipient St',
                city: 'Recipient City',
                country: 'GB' as COUNTRY_ID_CODES,
                countrySubDivision: 'Recipient State'
            }
        },
        deliveryDate: { year: 2023, month: 10, day: 5 }
    },
    paymentInformation: {
        creditorReference: 'CREDITOR-12345',
        paymentReference: 'PAYMENT-12345',
        payee: {
            id: 'PAYEE-1',
            globalId: { id: 'GLOBAL-PAYEE-1', scheme: '0080' as ISO6523_CODES },
            name: 'Payee Company',
            specifiedLegalOrganization: { id: { id: 'LEGAL-PAYEE-1', scheme: '0060' as ISO6523_CODES } }
        },
        paymentMeans: [
            {
                paymentType: '59' as PAYMENT_MEANS_CODES,
                payerBankAccount: { iban: 'DE89370400440532013000' },
                payeeBankAccount: {
                    iban: 'DE89370400440532013001',
                    propriataryId: 'PAYEE-PROP-1'
                }
            },
            {
                paymentType: '59' as PAYMENT_MEANS_CODES,
                payerBankAccount: { iban: 'DE89370400440532013002' },
                payeeBankAccount: {
                    iban: 'DE89370400440532013003',
                    propriataryId: 'PAYEE-PROP-2'
                }
            },
            {
                description: 'Credit Card Payment',
                paymentType: '54' as PAYMENT_MEANS_CODES,
                financialCard: {
                    finalDigitsOfCard: '****1111',
                    cardholderName: 'Max Mustermann'
                }
            },
            {
                description: 'Bank Transfer with BIC',
                paymentType: '59' as PAYMENT_MEANS_CODES,
                payeeBankAccount: {
                    iban: 'DE89370400440532013000',
                    bic: 'DEUTDEDBFRA',
                    accountName: 'Max Mustermann'
                }
            }
        ],
        billingPeriod: {
            startDate: { year: 2024, month: 1, day: 1 },
            endDate: { year: 2024, month: 1, day: 31 }
        },
        paymentTerms: {
            description: 'Payment due in 30 days',
            dueDate: { year: 2024, month: 2, day: 1 },
            directDebitMandateID: 'DDI-001'
        },
        specifiedTradeAccountingAccount: 'ACCOUNT-12345'
    },
    totals: {
        sumWithoutAllowancesAndCharges: 135,
        documentLevelAllowancesAndCharges: {
            allowances: [
                {
                    calculationPercent: 10,
                    basisAmount: 135,
                    actualAmount: 13.5,
                    reasonCode: '95' as ALLOWANCE_REASONS_CODES,
                    reason: 'Discount',
                    categoryTradeTax: {
                        typeCode: 'VAT' as TAX_TYPE_CODE,
                        categoryCode: 'S' as TAX_CATEGORY_CODES,
                        rateApplicablePercent: 19
                    }
                }
            ]
        },
        allowanceTotalAmount: 13.5,
        chargeTotalAmount: 0,
        netTotal: 121.5,
        taxBreakdown: [
            {
                calculatedAmount: 23.09,
                typeCode: 'VAT' as TAX_TYPE_CODE,
                basisAmount: 121.5,
                categoryCode: 'S' as TAX_CATEGORY_CODES,
                rateApplicablePercent: 19,
                taxPointDate: { year: 2024, month: 1, day: 15 }
            }
        ],
        taxTotal: [{ amount: 23.09, currency: 'EUR' as CURRENCY_CODES }],
        grossTotal: 144.59,
        prepaidAmount: 0,
        openAmount: 144.6,
        roundingAmount: 0.01
    },
    invoiceLines: [
        {
            generalLineData: {
                lineId: 'LINE-001',
                lineNote: { content: 'First item line note' }
            },
            productDescription: {
                globalId: { id: '12345678', scheme: '0160' as ISO6523_CODES },
                sellerProductId: 'COMP-XYZ-123',
                name: 'Premium Schrauben 1kg',
                description: 'Präzisionsgefertigte Komponente aus Edelstahl V4A.',
                productCharacteristic: [
                    { characteristic: 'Material', value: 'Edelstahl 1.4404' },
                    { characteristic: 'Oberfläche', value: 'Gebürstet' }
                ],
                productClassification: [
                    {
                        productClass: {
                            code: '27111708',
                            codeScheme: 'TST' as UNTDID_7143,
                            codeSchemeVersion: 'v23.0501'
                        }
                    }
                ],
                originTradeCountry: 'DE' as COUNTRY_ID_CODES
            },
            productPriceAgreement: {
                referencedOrder: { lineId: 'CUST-PO-12345-LN10' },
                productGrossPricing: {
                    grossPricePerItem: 23.8,
                    priceBaseQuantity: { quantity: 1, unit: 'KGM' as UNIT_CODES },
                    priceAllowancesAndCharges: { allowances: [{ actualAmount: 1 }] }
                },
                productNetPricing: {
                    netPricePerItem: 20,
                    priceBaseQuantity: { quantity: 1, unit: 'KGM' as UNIT_CODES }
                }
            },
            delivery: { itemQuantity: { quantity: 5, unit: 'KGM' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: 'S' as TAX_CATEGORY_CODES,
                    rateApplicablePercent: 19
                },
                lineLevelAllowancesAndCharges: {
                    allowances: [
                        {
                            actualAmount: 5,
                            reasonCode: '95' as ALLOWANCE_REASONS_CODES,
                            reason: 'Volume discount'
                        }
                    ]
                },
                lineTotals: { netTotal: 90 },
                additionalReferences: [
                    {
                        documentId: 'Lieferschein LS-9876',
                        typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet,
                        referenceTypeCode: 'LS' as UNTDID_1153
                    }
                ],
                accountingInformation: { id: 'Projekt P-100-A' }
            }
        },
        {
            generalLineData: { lineId: 'LINE-002' },
            productDescription: {
                buyerProductId: 'MAINT-PLAN-BASIC',
                name: 'Organic Tea Leaves 500g'
            },
            productPriceAgreement: { productNetPricing: { netPricePerItem: 15 } },
            delivery: { itemQuantity: { quantity: 2, unit: 'KGM' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: 'S' as TAX_CATEGORY_CODES,
                    rateApplicablePercent: 19
                },
                billingPeriod: {
                    startDate: { year: 2024, month: 1, day: 1 },
                    endDate: { year: 2024, month: 1, day: 31 }
                },
                lineLevelAllowancesAndCharges: {
                    charges: [
                        {
                            actualAmount: 15,
                            reasonCode: 'ZZZ' as CHARGE_REASONS_CODES,
                            reason: 'Express-Zuschlag'
                        }
                    ]
                },
                lineTotals: { netTotal: 45 },
                additionalReferences: [
                    { documentId: 'Vertrag V-2024-001', typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet }
                ]
            }
        }
    ]
}
