import { ComfortProfile } from '../../../src/profiles/comfort'
import { PROFILES } from '../../../src/types/ProfileTypes'
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    EXEMPTION_REASON_CODES,
    PAYMENT_MEANS_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES
} from '../../../src/types/codes'

export const exportOutsideEUInvoice: ComfortProfile = {
    profile: PROFILES.COMFORT,
    document: {
        id: 'TEST1234',
        type: '380' as DOCUMENT_TYPE_CODES,
        dateOfIssue: { year: 2025, month: 2, day: 18 },
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
                    basisPricePerItem: 5
                },
                productNetPricing: { netPricePerItem: 5 }
            },
            delivery: { itemQuantity: { quantity: 1, unit: 'NAR' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED,
                    rateApplicablePercent: 0
                },
                lineTotals: { netTotal: 5 }
            }
        },
        {
            generalLineData: { lineId: '2' },
            productDescription: {
                sellerProductId: '123456',
                name: 'Toller Artikel 2'
            },
            productPriceAgreement: {
                productPricing: {
                    basisPricePerItem: 5
                },
                productNetPricing: { netPricePerItem: 5 }
            },
            delivery: { itemQuantity: { quantity: 1, unit: 'NAR' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED,
                    rateApplicablePercent: 0
                },
                lineTotals: { netTotal: 5 }
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
        otherLegalInformation: 'Geschäftsführer: Max Mustermann\nUnternehmenssitz: Stuttgart\nAmtsgericht Stuttgart',
        taxIdentification: { vatId: 'DE124356788' }
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
                exemptionReason: 'Export outside EU',
                exemptionReasonCode: EXEMPTION_REASON_CODES.Export_outside_the_EU,
                basisAmount: 10,
                categoryCode: TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED,
                rateApplicablePercent: 0
            }
        ],
        sumWithoutAllowancesAndCharges: 10,
        documentLevelAllowancesAndCharges: {
            allowances: [
                {
                    actualAmount: 1,
                    reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                    categoryTradeTax: {
                        typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                        categoryCode: TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED,
                        rateApplicablePercent: 0
                    }
                }
            ],
            charges: [
                {
                    actualAmount: 1,
                    reasonCode: CHARGE_REASONS_CODES.Handling,
                    categoryTradeTax: {
                        typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                        categoryCode: TAX_CATEGORY_CODES.FREE_EXPORT_ITEM_TAX_NOT_CHARGED,
                        rateApplicablePercent: 0
                    }
                }
            ]
        },
        chargeTotalAmount: 1,
        allowanceTotalAmount: 1,
        netTotal: 10,
        taxTotal: [{ amount: 0, currency: 'EUR' as CURRENCY_CODES }],
        grossTotal: 10,
        prepaidAmount: 0,
        openAmount: 10
    }
}
