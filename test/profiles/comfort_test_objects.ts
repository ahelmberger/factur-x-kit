import { ComfortProfile } from '../../src/profiles/comfort'
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    ISO6523_CODES,
    MIME_CODES,
    PAYMENT_MEANS_CODES,
    REFERENCED_DOCUMENT_TYPE_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    UNIT_CODES,
    UNTDID_1153,
    UNTDID_7143
} from '../../src/types/codes'
import { ComfortTradeLineItem } from '../../src/types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem'
import testBasicProfile from './basicwithoutlines_test_objects'

// Neues Objekt, das exakt die Struktur von lineObject1 beibehält,
// aber dort vorhandene Werte mit den Werten aus dem gelieferten Objekt überschreibt.
// Werte, die im gelieferten Objekt nicht gesetzt sind, bleiben erhalten.

const lineObject1: ComfortTradeLineItem = {
    generalLineData: {
        // Überschrieben: lineId und lineNote aus dem gelieferten Objekt
        lineId: 'LINE-001',
        lineNote: {
            content: 'First item line note'
        }
    },
    productDescription: {
        // globalId und name werden aus dem gelieferten Objekt übernommen
        globalId: {
            id: '12345678',
            scheme: ISO6523_CODES.GTIN_Global_Trade_Item_Number
        },
        sellerProductId: 'COMP-XYZ-123', // bleibt erhalten (nicht im Delta)
        name: 'Premium Schrauben 1kg',
        description: 'Präzisionsgefertigte Komponente aus Edelstahl V4A.', // bleibt erhalten
        productCharacteristic: [
            { characteristic: 'Material', value: 'Edelstahl 1.4404' },
            { characteristic: 'Oberfläche', value: 'Gebürstet' }
        ],
        productClassification: [
            {
                productClass: {
                    code: '27111708',
                    codeScheme: UNTDID_7143.UNSPSC,
                    codeSchemeVersion: 'v23.0501'
                }
            }
        ],
        originTradeCountry: COUNTRY_ID_CODES.GERMANY // bleibt erhalten
    },
    productPriceAgreement: {
        referencedOrder: {
            lineId: 'CUST-PO-12345-LN10' // bleibt erhalten, da nicht im Delta
        },
        productGrossPricing: {
            // Werte aus dem gelieferten Objekt übernommen:
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
            // Werte aus dem gelieferten Objekt übernommen:
            netPricePerItem: 20.0,
            priceBaseQuantity: {
                quantity: 1,
                unit: UNIT_CODES.KILOGRAM
            }
        }
    },
    delivery: {
        // Delta-Werte übernommen
        itemQuantity: {
            quantity: 5,
            unit: UNIT_CODES.KILOGRAM
        }
    },
    settlement: {
        tax: {
            // Werte aus dem gelieferten Objekt übernommen:
            typeCode: TAX_TYPE_CODE.VALUE_ADDED_TAX_VAT,
            categoryCode: TAX_CATEGORY_CODES.STANDARD_RATE,
            rateApplicablePercent: 19
        },
        // billingPeriod wird nicht übernommen,
        // da lineObject1 diesen Schlüssel nicht enthält und somit unberührt bleiben soll.
        lineLevelAllowancesAndCharges: {
            // Überschrieben: allowances aktualisiert
            allowances: [
                {
                    actualAmount: 5.0,
                    reasonCode: ALLOWANCE_REASONS_CODES.Discount,
                    reason: 'Volume discount'
                }
            ]
        },
        lineTotals: {
            // Überschrieben: netTotal aktualisiert
            netTotal: 90.0
        },
        // Zusätzliche Felder aus lineObject1 werden beibehalten:
        additionalReferences: [
            {
                documentId: 'Lieferschein LS-9876',
                typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet,
                referenceTypeCode: UNTDID_1153.Bar_coded_label_serial_number
            }
        ],
        accountingInformation: {
            id: 'Projekt P-100-A'
        }
    }
}
export const lineObject2: ComfortTradeLineItem = {
    generalLineData: {
        lineId: 'LINE-002'
    },
    productDescription: {
        buyerProductId: 'MAINT-PLAN-BASIC',
        name: 'Organic Tea Leaves 500g',
        productClassification: [{}]
    },
    productPriceAgreement: {
        productNetPricing: {
            netPricePerItem: 15.0
        }
    },
    delivery: {
        itemQuantity: {
            quantity: 2,
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
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31')
        },
        lineLevelAllowancesAndCharges: {
            charges: [
                {
                    actualAmount: 15.0,
                    reasonCode: CHARGE_REASONS_CODES.Mutually_defined,
                    reason: 'Express-Zuschlag'
                }
            ]
        },
        lineTotals: {
            netTotal: 45.0
        },
        additionalReferences: [
            {
                documentId: 'Vertrag V-2024-001',
                typeCode: REFERENCED_DOCUMENT_TYPE_CODES.Invoice_data_sheet
            }
        ]
    }
}

// Wir erweitern das bestehende Basic-WithoutLines-Objekt (testBasicProfile) um alle neuen Felder,
// die im Comfort Profil zusätzlich vorkommen – basierend auf delta.md und der Mappingdefinition.
export const testComfortProfile: ComfortProfile = {
    ...testBasicProfile,
    meta: {
        ...testBasicProfile.meta,
        guidelineSpecifiedDocumentContextParameter: 'urn:cen.eu:en16931:2017'
    },
    // Zusätzliche Felder im Seller-Bereich (ApplicableHeaderTradeAgreement)
    seller: {
        ...testBasicProfile.seller,
        otherLegalInformation: 'Verkauf',
        // Neu: DefinedTradeContact (z. B. für zusätzlichen Ansprechpartner)
        tradeContact: [
            {
                personName: 'Hans Müller',
                telephoneNumber: '+49 111222333',
                email: 'hans@firma.de'
            }
        ]
    },
    // Zusätzliche Felder im Buyer-Bereich (ApplicableHeaderTradeAgreement)
    buyer: {
        ...testBasicProfile.buyer,
        tradeContact: [
            {
                personName: 'Erika Mustermann',
                telephoneNumber: '+49 444555666',
                email: 'erika@firma.de'
            }
        ],
        specifiedLegalOrganization: {
            ...testBasicProfile.buyer.specifiedLegalOrganization,
            tradingBusinessName: 'Erika GmbH'
        }
    },
    // Neuer Header-Bereich: ReferencedDocuments und Order- bzw. Contract-Referenzen
    referencedDocuments: {
        ...testBasicProfile.referencedDocuments,
        // Neu: SellerOrderReferencedDocument (übernimmt über Mapping: orderReference)
        orderReference: {
            documentId: 'SO-98765'
        },
        // Neu: ContractReferencedDocument (über Mapping: contractReference)
        contractReference: {
            documentId: 'CON-54321'
        },
        // Zusätzliche Referenzen (AdditionalReferencedDocument)
        additionalReferences: {
            // Falls im Basic-Objekt bereits vorhanden, übernehmen und erweitern
            invoiceSupportingDocuments: [
                {
                    documentId: '1234',
                    name: 'Rapport', // Beispielhafter fester Wert für Additional Document
                    uriid: 'https://example.com/rapport.pdf', // Beispiel für einen Referenztyp (z.B. Supporting Document)
                    attachmentBinaryObject: {
                        mimeCode: MIME_CODES.PDF,
                        fileName: 'rapport.pdf'
                    }
                }
            ],
            tenderOrLotReferenceDetails: [
                {
                    documentId: 'LOT-001'
                },
                {
                    documentId: 'LOT-002'
                }
            ],
            invoiceItemDetails: [
                {
                    documentId: 'ITEM-001',
                    referenceTypeCode: UNTDID_1153.Dangerous_Goods_information
                },
                {
                    documentId: 'ITEM-002',
                    referenceTypeCode: UNTDID_1153.Outerpackaging_unit_identification
                }
            ]
        },
        projectReference: {
            id: 'PRJ-001',
            name: 'Procuring Project XY'
        }
    },

    // Erweiterung des PaymentInformation-Bereichs (ApplicableHeaderTradeSettlement)
    paymentInformation: {
        ...testBasicProfile.paymentInformation,
        // Neu: PaymentMeans mit zusätzlichen Informationen
        paymentMeans: [
            ...testBasicProfile.paymentInformation.paymentMeans!,
            {
                description: 'Credit Card Payment',
                paymentType: PAYMENT_MEANS_CODES.Credit_card,
                financialCard: {
                    finalDigitsOfCard: '****1111',
                    cardholderName: 'Max Mustermann'
                }
            },
            {
                description: 'Bank Transfer with BIC',
                paymentType: PAYMENT_MEANS_CODES.SEPA_direct_debit,
                payeeBankAccount: {
                    iban: 'DE89370400440532013000',
                    bic: 'DEUTDEDBFRA',
                    accountName: 'Max Mustermann'
                }
            }
        ],
        // Bereits vorhandene BillingPeriod ergänzen (falls nicht gestellt)
        billingPeriod: {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31')
        },
        // Neu: PaymentTerms, falls benötigt
        paymentTerms: {
            description: 'Net 30 days',
            dueDate: new Date('2024-02-01'),
            directDebitMandateID: 'DDI-001'
        }
    },
    // Erweiterung der Totals (ApplicableHeaderTradeSettlement)
    totals: {
        ...testBasicProfile.totals,
        // Neu: RoundingAmount (RoundingAmount in SpecifiedTradeSettlementHeaderMonetarySummation)
        roundingAmount: 0.01,
        taxBreakdown: [
            {
                ...testBasicProfile.totals.taxBreakdown![0], // Vorhandene Werte übernehmen}
                taxPointDate: new Date('2024-01-15')
            }
        ]
    },
    // invoiceLines bleiben unverändert, da alle in SpecifiedLineTradeAgreement enthaltenen Felder über diese abgedeckt sind
    invoiceLines: [lineObject1, lineObject2]
}
