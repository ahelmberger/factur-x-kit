import { ComfortProfile } from '../src/profiles/comfort'
import {
    ALLOWANCE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    EAS_SCHEME_CODES,
    ISO6523_CODES,
    MIME_CODES,
    PAYMENT_MEANS_CODES,
    SUBJECT_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES,
    UNTDID_1153
} from '../src/types/codes'

export const designTestObject_easy: ComfortProfile = {
    meta: {
        guidelineSpecifiedDocumentContextParameter: 'urn:cen.eu:en16931:2017'
    },
    document: {
        id: 'DOC-12345',
        type: '380' as DOCUMENT_TYPE_CODES,
        dateOfIssue: { year: 2023, month: 10, day: 1 },
        notes: [
            {
                content: 'Vielen Dank für Ihren Einkauf! Hiermit stellen wir die folgenden Leistungen in Rechnung',
                subject: 'ACY' as SUBJECT_CODES
            },
            {
                content:
                    'da sie als native Funktionen in der JavaScript-Engine implementiert sind. Eine manuell geschriebene Schleife in JavaScript wäre in der Regel langsamer, da sie im User-Space Code läuft und mehr Overheads hat',
                subject: 'AEA' as SUBJECT_CODES
            },
            { content: 'Danke Danke Danke!' }
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
        netTotal: 135,
        taxBreakdown: [
            {
                calculatedAmount: 25.65,
                typeCode: 'VAT' as TAX_TYPE_CODE,
                basisAmount: 135,
                categoryCode: 'S' as TAX_CATEGORY_CODES,
                rateApplicablePercent: 19,
                taxPointDate: { year: 2024, month: 1, day: 15 }
            }
        ],
        taxTotal: [{ amount: 25.65, currency: 'EUR' as CURRENCY_CODES }],
        grossTotal: 160.65,
        prepaidAmount: 0,
        openAmount: 160.65
    },
    invoiceLines: [
        {
            generalLineData: {
                lineId: '1'
            },
            productDescription: {
                sellerProductId: '01234567',
                name: 'Premium Schrauben',
                description: 'Präzisionsgefertigte Komponente aus Edelstahl V4A.'
            },
            productPriceAgreement: {
                referencedOrder: { lineId: 'CUST-PO-12345-LN10' },
                productGrossPricing: {
                    grossPricePerItem: 23.8,
                    priceBaseQuantity: { quantity: 1, unit: 'KGM' as UNIT_CODES }
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
                lineTotals: { netTotal: 90 }
            }
        },
        {
            generalLineData: { lineId: '2' },
            productDescription: {
                sellerProductId: '22222222',
                name: 'Organic Tea Leaves'
            },
            productPriceAgreement: {
                productNetPricing: {
                    netPricePerItem: 15
                }
            },
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
                lineTotals: { netTotal: 45 }
            }
        }
    ]
}
