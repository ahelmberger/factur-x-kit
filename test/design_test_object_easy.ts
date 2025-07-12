import { ComfortProfile } from '../src/profiles/comfort'
import {
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    EAS_SCHEME_CODES,
    ISO6523_CODES,
    PAYMENT_MEANS_CODES,
    SUBJECT_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES
} from '../src/types/codes'

export const designTestObject_easy: ComfortProfile = {
    meta: {
        guidelineSpecifiedDocumentContextParameter: 'urn:cen.eu:en16931:2017'
    },
    document: {
        id: 'INV-2023-EASY-001',
        type: '380' as DOCUMENT_TYPE_CODES,
        dateOfIssue: { year: 2023, month: 10, day: 1 },
        notes: [
            {
                content: 'Thank you for your purchase! We hereby invoice the following services/products.',
                subject: 'ACY' as SUBJECT_CODES
            },
            { content: 'Kind regards,\nYour Service Team' },
            {
                content:
                    'Delivery usually takes place within 3-5 working days after receipt of payment. If you have any questions or concerns, please do not hesitate to contact us.',
                subject: 'DEL' as SUBJECT_CODES
            }
        ],
        currency: 'EUR' as CURRENCY_CODES
    },
    seller: {
        name: 'Global Goods Inc.',
        specifiedLegalOrganization: {
            id: { id: 'CoReg12345UK' },
            tradingBusinessName: 'Global Goods Retail'
        },
        postalAddress: {
            postcode: 'M1 1AA',
            addressLineOne: '789 Commerce Street',
            city: 'Manchester',
            country: 'GB' as COUNTRY_ID_CODES,
            countrySubDivision: 'ENG'
        },
        universalCommunicationAddressURI: { id: 'info@globalgoods.co.uk', scheme: '0088' as EAS_SCHEME_CODES },
        taxIdentification: { vatId: 'GB123456789' },
        otherLegalInformation: 'Director: Olivia Green\nRegistered in England No. 1234567\nVAT Reg. No. GB123456789',
        tradeContact: [
            {
                personName: 'Robert Brown',
                telephoneNumber: '+44 161 496 0101',
                email: 'r.brown@globalgoods.co.uk'
            }
        ]
    },
    buyer: {
        id: 'CUST-IE-001',
        name: 'Prime Tech Solutions',
        specifiedLegalOrganization: {
            id: { id: 'CRO987654', scheme: '0060' as ISO6523_CODES },
            tradingBusinessName: 'Prime Tech Procurement'
        },
        postalAddress: {
            postcode: 'D02 XA00',
            addressLineOne: '10 Tech Park Avenue',
            city: 'Dublin',
            country: 'IE' as COUNTRY_ID_CODES,
            countrySubDivision: 'Leinster'
        },
        universalCommunicationAddressURI: { id: 'purchasing@primetech.ie', scheme: '0088' as EAS_SCHEME_CODES },
        taxIdentification: { vatId: 'IE9876543W' },
        tradeContact: [
            {
                personName: 'Aoife Kelly',
                telephoneNumber: '+353 1 234 5678',
                email: 'a.kelly@primetech.ie'
            }
        ]
    },
    referencedDocuments: {
        orderReference: { documentId: 'PO-BUYER-7788' }
    },
    delivery: {
        deliveryDate: { year: 2023, month: 10, day: 5 }
    },
    paymentInformation: {
        paymentMeans: [
            {
                description: 'North Star Bank',
                paymentType: '58' as PAYMENT_MEANS_CODES,
                payeeBankAccount: {
                    iban: 'GB99NWBK60161312345678',
                    bic: 'NWBKGB2LXXX',
                    accountName: 'Global Goods Inc.'
                }
            }
        ],
        billingPeriod: {
            startDate: { year: 2024, month: 1, day: 1 },
            endDate: { year: 2024, month: 1, day: 31 }
        },
        paymentTerms: {
            description: 'Please pay the given amount within 30 days from invoice date.',
            dueDate: { year: 2024, month: 2, day: 1 }
        }
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
                sellerProductId: 'GG-SCRW-A4-01',
                name: 'High-Grade Screws'
            },
            productPriceAgreement: {
                productPricing: {
                    basisPricePerItem: 20,
                    priceAllowancesAndCharges: {
                        allowances: [
                            {
                                actualAmount: 2
                            }
                        ]
                    }
                },
                productNetPricing: {
                    netPricePerItem: 18
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
                sellerProductId: 'GG-BRKT-STD-05',
                name: 'Standard Mounting Brackets'
            },
            productPriceAgreement: {
                productNetPricing: {
                    netPricePerItem: 15,
                    priceBaseQuantity: { quantity: 3, unit: UNIT_CODES.KILOGRAM }
                }
            },
            delivery: { itemQuantity: { quantity: 9, unit: UNIT_CODES.KILOGRAM } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: 'S' as TAX_CATEGORY_CODES,
                    rateApplicablePercent: 19
                },
                lineTotals: { netTotal: 45 }
            }
        }
    ]
}
