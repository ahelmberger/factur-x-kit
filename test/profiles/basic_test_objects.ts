import { BasicProfile } from '../../src/profiles/basic'
import {
    ALLOWANCE_REASONS_CODES,
    CURRENCY_CODES,
    ISO6523_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES
} from '../../src/types/codes'
import { BasicTradeLineItem } from '../../src/types/ram/IncludedSupplyChainTradeLineItem/BasicTradeLineItem'
import testBasicWLProfile from './basicwithoutlines_test_objects'

const testInvoiceLines: BasicTradeLineItem[] = [
    {
        generalLineData: {
            lineId: 'LINE-001',
            lineNote: {
                content: 'First item line note'
            }
        },
        productDescription: {
            globalId: {
                id: '12345678',
                scheme: ISO6523_CODES.GTIN_Global_Trade_Item_Number
            },
            name: 'Premium Coffee Beans 1kg'
        },
        productPriceAgreement: {
            productGrossPricing: {
                grossPricePerItem: 23.8,
                priceBaseQuantity: {
                    quantity: 1,
                    unit: UNIT_CODES.KILOGRAM
                },
                priceAllowancesAndCharges: {
                    allowances: [{ actualAmount: 1.0 }]
                }
            },
            productNetPricing: {
                netPricePerItem: 20.0,
                priceBaseQuantity: {
                    quantity: 1,
                    unit: UNIT_CODES.KILOGRAM
                }
            }
        },
        delivery: {
            itemQuantity: {
                quantity: 5,
                unit: UNIT_CODES.KILOGRAM
            }
        },
        settlement: {
            tax: {
                typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                rateApplicablePercent: 19
            },
            billingPeriod: {
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-01-31')
            },
            lineLevelAllowancesAndCharges: {
                allowances: [
                    {
                        actualAmount: 5.0,
                        reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                        reason: 'Volume discount'
                    }
                ]
            },
            lineTotals: {
                netTotal: 90.0 // ((20.00-1.00) * 5) - 5.00 allowance
            }
        }
    },
    {
        generalLineData: {
            lineId: 'LINE-002'
        },
        productDescription: {
            name: 'Organic Tea Leaves 500g'
        },
        productPriceAgreement: {
            productNetPricing: {
                netPricePerItem: 15.0
            }
        },
        delivery: {
            itemQuantity: {
                quantity: 3,
                unit: UNIT_CODES.KILOGRAM
            }
        },
        settlement: {
            tax: {
                typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                rateApplicablePercent: 19
            },
            lineTotals: {
                netTotal: 45.0 // 15.00 * 3
            }
        }
    }
]

export default testInvoiceLines

const testBasicProfile: BasicProfile = {
    ...testBasicWLProfile,
    meta: {
        guidelineSpecifiedDocumentContextParameter: 'urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic'
    },
    invoiceLines: testInvoiceLines,
    totals: {
        sumWithoutAllowancesAndCharges: 135, // 90 + 45
        documentLevelAllowancesAndCharges: {
            allowances: [
                {
                    calculationPercent: 10,
                    basisAmount: 135,
                    actualAmount: 13.5,
                    reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                    reason: 'Discount',
                    categoryTradeTax: {
                        typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                        categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                        rateApplicablePercent: 19
                    }
                }
            ],
            charges: []
        },
        allowanceTotalAmount: 13.5,
        chargeTotalAmount: 0,
        netTotal: 121.5, // 135 - 13.5
        taxBreakdown: [
            {
                calculatedAmount: 23.09, // 121.5 * 0.19
                typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
                basisAmount: 121.5,
                categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
                rateApplicablePercent: 19
            }
        ],
        taxTotal: [
            {
                amount: 23.09,
                currency: CURRENCY_CODES.Euro
            }
        ],
        grossTotal: 144.59, // 121.5 + 23.09
        prepaidAmount: 0,
        openAmount: 144.59
    }
}

export { testBasicProfile }
