import { ComfortProfile } from '../src/profiles/comfort'
import { PROFILES } from '../src/types/ProfileTypes'
import {
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    PAYMENT_MEANS_CODES,
    SUBJECT_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES
} from '../src/types/codes'

export const testDesignObjectKleinunternehmer: ComfortProfile = {
    profile: PROFILES.COMFORT,
    document: {
        id: 'TEST1234',
        type: '380' as DOCUMENT_TYPE_CODES,
        dateOfIssue: { year: 2025, month: 2, day: 18 },
        notes: [
            {
                content:
                    'Sehr geehrte Damen und Herren,\n' +
                    ' \n' +
                    'vielen Dank für Ihren Auftrag. Vereinbarungsgemäß berechnen wir Ihnen wie folgt:',
                subject: 'ACY' as SUBJECT_CODES
            },
            {
                content:
                    'Wenn nicht anders angegeben, entspricht das Leistungsdatum dem Rechnungsdatum.\n' +
                    'Für Rückfragen stehen wir Ihnen gerne zur Verfügung.\n' +
                    ' \n' +
                    'Mit freundlichen Grüßen'
            }
        ],
        currency: 'EUR' as CURRENCY_CODES
    },
    invoiceLines: [
        {
            generalLineData: { lineId: '1' },
            productDescription: {
                sellerProductId: '12345',
                name: 'Toller Artikel'
            },
            productPriceAgreement: {
                productPricing: {
                    basisPricePerItem: 10
                },
                productNetPricing: { netPricePerItem: 10 }
            },
            delivery: { itemQuantity: { quantity: 1, unit: 'NAR' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: 'E' as TAX_CATEGORY_CODES,
                    rateApplicablePercent: 0
                },
                lineLevelAllowancesAndCharges: {
                    allowances: [
                        {
                            actualAmount: 0.1,
                            reason: 'Rabatt Pos. 1'
                        }
                    ]
                },
                lineTotals: { netTotal: 9.9 }
            }
        }
    ],
    seller: {
        name: 'Muster GmbH',
        tradeContact: [
            {
                personName: 'Max Mustermann',
                telephoneNumber: '01789191919191',
                email: 'max@mustermann.com'
            }
        ],
        postalAddress: {
            postcode: '654321',
            addressLineOne: 'Musterstraße 17',
            city: 'Musterort',
            country: 'DE' as COUNTRY_ID_CODES
        },
        specifiedLegalOrganization: {
            id: { id: 'HR-12345678' }
        },
        taxIdentification: { vatId: 'DE124356788' },
        otherLegalInformation: 'Geschäftsführer: Max Mustermann\nUnternehmenssitz: Stuttgart\nAmtsgericht Stuttgart'
    },
    buyer: {
        name: 'Paul Peter',

        postalAddress: {
            postcode: '70188',
            addressLineOne: 'Mercedesstr. 24',
            city: 'Stuttgart',
            country: 'DE' as COUNTRY_ID_CODES
        }
    },
    delivery: {},
    paymentInformation: {
        paymentMeans: [
            {
                paymentType: '58' as PAYMENT_MEANS_CODES,
                payeeBankAccount: {
                    iban: 'DE02120300000000202051',
                    accountName: 'Max Mustermann',
                    bic: 'BYLADEM1001'
                },
                description: 'ING DiBa'
            }
        ],
        paymentTerms: {
            dueDate: { year: 2025, month: 2, day: 25 },
            description: 'Bitte begleichen Sie den Rechnungsbetrag bis zum 25.02.2025.'
        }
    },
    totals: {
        taxBreakdown: [
            {
                calculatedAmount: 0,
                typeCode: 'VAT' as TAX_TYPE_CODE,
                exemptionReason: 'Umsatzsteuerbefreit nach §19 UStG',
                basisAmount: 9.9,
                categoryCode: 'E' as TAX_CATEGORY_CODES,
                rateApplicablePercent: 0
            }
        ],
        sumWithoutAllowancesAndCharges: 9.9,
        chargeTotalAmount: 0,
        allowanceTotalAmount: 0,
        netTotal: 9.9,
        taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
        grossTotal: 9.9,
        prepaidAmount: 9.9,
        openAmount: 0
    }
}
