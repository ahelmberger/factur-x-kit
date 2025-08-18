import { TotalsCalculatorInputType } from '../src/adapter/totalsCalculator/easyInputType';
import {
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    EAS_SCHEME_CODES,
    ISO6523_CODES,
    PAYMENT_MEANS_CODES,
    SUBJECT_CODES,
    TAX_CATEGORY_CODES,
    UNIT_CODES
} from '../src/types/codes';

export const designTestObject_easy: TotalsCalculatorInputType = {
    document: {
        id: 'INV-2023-EASY-001',
        type: DOCUMENT_TYPE_CODES.COMMERCIAL_INVOICE,
        dateOfIssue: { year: 2023, month: 10, day: 1 },
        notes: [
            {
                content: 'Thank you for your purchase! We hereby invoice the following services/products.',
                subject: SUBJECT_CODES.INTRODUCTION
            },
            { content: 'Kind regards,\nYour Service Team' },
            {
                content:
                    'Delivery usually takes place within 3-5 working days after receipt of payment. If you have any questions or concerns, please do not hesitate to contact us.',
                subject: SUBJECT_CODES.DELIVERY_INFORMATION
            }
        ],
        currency: CURRENCY_CODES.Euro
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
            country: COUNTRY_ID_CODES.UNITED_KINGDOM_OF_GREAT_BRITAIN_AND_NORTHERN_IRELAND,
            countrySubDivision: 'ENG'
        },
        universalCommunicationAddressURI: {
            id: 'info@globalgoods.co.uk',
            scheme: EAS_SCHEME_CODES.Electronic_mail_SMPT
        },
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
            id: { id: 'CRO987654', scheme: ISO6523_CODES.Data_Universal_Numbering_System_DUNS_Number },
            tradingBusinessName: 'Prime Tech Procurement'
        },
        postalAddress: {
            postcode: 'D02 XA00',
            addressLineOne: '10 Tech Park Avenue',
            city: 'Dublin',
            country: COUNTRY_ID_CODES.IRELAND,
            countrySubDivision: 'Leinster'
        },
        universalCommunicationAddressURI: {
            id: 'purchasing@primetech.ie',
            scheme: EAS_SCHEME_CODES.Electronic_mail_SMPT
        },
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
        deliveryDate: { year: 2023, month: 10, day: 5 },
        billingPeriod: {
            startDate: { year: 2024, month: 1, day: 1 },
            endDate: { year: 2024, month: 1, day: 31 }
        }
    },
    paymentInformation: {
        paymentMeans: [
            {
                description: 'North Star Bank',
                paymentType: PAYMENT_MEANS_CODES.SEPA_credit_transfer,
                payeeBankAccount: {
                    iban: 'GB99NWBK60161312345678',
                    bic: 'NWBKGB2LXXX',
                    accountName: 'Global Goods Inc.'
                }
            }
        ],
        paymentTerms: {
            description: 'Please pay the given amount within 30 days from invoice date.',
            dueDate: { year: 2024, month: 2, day: 1 }
        }
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
                }
            },
            delivery: { itemQuantity: { quantity: 5, unit: UNIT_CODES.KILOGRAM } },
            settlement: {
                tax: {
                    categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                    rateApplicablePercent: 19
                }
            }
        },
        {
            generalLineData: { lineId: '2' },
            productDescription: {
                sellerProductId: 'GG-BRKT-STD-05',
                name: 'Standard Mounting Brackets'
            },
            productPriceAgreement: {
                productPricing: {
                    basisPricePerItem: 15,
                    priceBaseQuantity: { quantity: 3, unit: UNIT_CODES.KILOGRAM }
                }
            },
            delivery: { itemQuantity: { quantity: 9, unit: UNIT_CODES.KILOGRAM } },
            settlement: {
                tax: {
                    categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                    rateApplicablePercent: 19
                }
            }
        }
    ]
};
