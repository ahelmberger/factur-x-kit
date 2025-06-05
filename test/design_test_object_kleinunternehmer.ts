import { ComfortProfile } from '../src/profiles/comfort'
import {
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    DOCUMENT_TYPE_CODES,
    EXEMPTION_REASON_CODES,
    PAYMENT_MEANS_CODES,
    SUBJECT_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES
} from '../src/types/codes'

export const testDesignObjectKleinunternehmer: ComfortProfile = {
    meta: {
        guidelineSpecifiedDocumentContextParameter: 'urn:cen.eu:en16931:2017'
    },
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
            },
            {
                content: 'Stuttgart',
                subject: 'AGW' as SUBJECT_CODES
            },
            {
                content: 'Freddy Merz',
                subject: 'AFV' as SUBJECT_CODES
            },
            {
                content: 'Amtsgericht Stuttgart',
                subject: 'LAN' as SUBJECT_CODES
            }
        ],
        currency: 'EUR' as CURRENCY_CODES
    },
    invoiceLines: [
        {
            generalLineData: { lineId: '1', lineNote: undefined },
            productDescription: {
                globalId: undefined,
                sellerProductId: '12345',
                buyerProductId: undefined,
                name: 'Toller Artikel',
                description: undefined,
                productCharacteristic: undefined,
                productClassification: undefined,
                originTradeCountry: undefined
            },
            productPriceAgreement: {
                referencedOrder: undefined,
                productGrossPricing: {
                    grossPricePerItem: 10,
                    priceBaseQuantity: undefined,
                    priceAllowancesAndCharges: undefined
                },
                productNetPricing: { netPricePerItem: 10, priceBaseQuantity: undefined }
            },
            delivery: { itemQuantity: { quantity: 1, unit: 'NAR' as UNIT_CODES } },
            settlement: {
                tax: {
                    typeCode: 'VAT' as TAX_TYPE_CODE,
                    categoryCode: 'E' as TAX_CATEGORY_CODES,
                    rateApplicablePercent: 0
                },
                billingPeriod: undefined,
                lineLevelAllowancesAndCharges: {
                    allowances: [
                        {
                            actualAmount: 0.1,
                            reasonCode: undefined,
                            reason: 'Rabatt Pos. 1'
                        }
                    ],
                    charges: undefined
                },
                lineTotals: { netTotal: 9.9 },
                additionalReferences: undefined,
                accountingInformation: undefined
            }
        }
    ],
    seller: {
        name: 'Muster GmbH',
        tradeContact: [
            {
                personName: 'Max Mustermann',
                departmentName: undefined,
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
        taxIdentification: { vatId: 'DE124356788', localTaxId: undefined }
    },
    buyer: {
        name: 'Peter',
        tradeContact: [
            {
                personName: 'Paulpa',
                departmentName: undefined,
                telephoneNumber: undefined,
                email: ''
            }
        ],
        postalAddress: {
            postcode: '70188',
            addressLineOne: 'Störzbachstraße 1',
            addressLineTwo: '1. Stock',
            city: 'Stuttgart',
            country: 'DE' as COUNTRY_ID_CODES
        }
    },
    delivery: { deliveryDate: { year: 2025, month: 2, day: 18 } },
    paymentInformation: {
        paymentMeans: [
            {
                paymentType: '58' as PAYMENT_MEANS_CODES,
                payerBankAccount: undefined,
                payeeBankAccount: {
                    iban: 'DE02120300000000202051',
                    propriataryId: undefined,
                    accountName: 'Max Mustermann',
                    bic: 'BYLADEM1001'
                },
                description: 'ING DiBa',
                financialCard: undefined
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
                exemptionReasonCode: undefined,
                taxPointDate: undefined,
                dueDateTypeCode: undefined,
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
