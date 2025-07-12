import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    EAS_SCHEME_CODES,
    EXEMPTION_REASON_CODES,
    ISO6523_CODES,
    MIME_CODES,
    PAYMENT_MEANS_CODES,
    REFERENCED_DOCUMENT_TYPE_CODES,
    SUBJECT_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    TIME_REFERENCE_CODES,
    UNIT_CODES,
    UNTDID_1153,
    UNTDID_7143
} from '../src/types/codes'

interface comfort_scheme {
    meta: {
        businessProcessType?: string | undefined // BT-23
        guidelineSpecifiedDocumentContextParameter: 'urn:cen.eu:en16931:2017' // BT-24
    }
    document: {
        id: string // BT-1
        type: UNTDID_1153 // BT-3
        dateOfIssue: {
            // BT-2
            year: number
            month: number
            day: number
        }
        currency: CURRENCY_CODES // BT-5
        notes: {
            // BG-1
            content: string // BT-22
            subject?: SUBJECT_CODES | undefined // BT-21
        }[]
    }
    seller: {
        // BG-4
        id?: string[] | undefined // BT-29
        globalId?:
            | {
                  id: string // BT-29-0
                  scheme: ISO6523_CODES // BT-29-1
              }[]
            | undefined
        name: string // BT-27
        specifiedLegalOrganization?:
            | {
                  id?:
                      | {
                            id: string // BT-30
                            scheme?: ISO6523_CODES | undefined // BT-30-1
                        }
                      | undefined
                  tradingBusinessName?: string | undefined // BT-28
              }
            | undefined
        postalAddress: {
            // BG-5
            postcode?: string | undefined // BT-38
            addressLineOne?: string | undefined // BT-35
            addressLineTwo?: string | undefined // BT-36
            addressLineThree?: string | undefined // BT-162
            city?: string | undefined // BT-37
            country: COUNTRY_ID_CODES // BT-40
            countrySubDivision?: string | undefined // BT-39
        }
        universalCommunicationAddressURI?:
            | {
                  id: string // BT-34
                  scheme: EAS_SCHEME_CODES // BT-34-1
              }
            | undefined
        taxIdentification?:
            | {
                  vatId?: string | undefined // BT-31
                  localTaxId?: string | undefined // BT-32
              }
            | undefined
        otherLegalInformation?: string | undefined // BT-33
        tradeContact?:
            | {
                  // BG-6
                  personName?: string | undefined // BT-41
                  departmentName?: string | undefined // BT-41-0
                  telephoneNumber?: string | undefined // BT-42
                  email?: string | undefined // BT-43
              }[]
            | undefined
    }
    buyer: {
        // BG-7
        id?: string | undefined // BT-46
        globalId?:
            | {
                  id: string // BT-46-0
                  scheme: ISO6523_CODES // BT-46-1
              }
            | undefined
        name: string // BT-44
        specifiedLegalOrganization?:
            | {
                  id?:
                      | {
                            id: string // BT-47
                            scheme?: ISO6523_CODES | undefined // BT-47-1
                        }
                      | undefined
                  tradingBusinessName?: string | undefined // BT-45
              }
            | undefined
        postalAddress: {
            // BG-8
            postcode?: string | undefined // BT-53
            addressLineOne?: string | undefined // BT-50
            addressLineTwo?: string | undefined // BT-51
            addressLineThree?: string | undefined // BT-163
            city?: string | undefined // BT-52
            country: COUNTRY_ID_CODES // BT-55
            countrySubDivision?: string | undefined // BT-54
        }
        universalCommunicationAddressURI?:
            | {
                  id: string // BT-49
                  scheme: EAS_SCHEME_CODES // BT-49-1
              }
            | undefined
        taxIdentification?:
            | (
                  | {
                        vatId: string // BT-48
                    }
                  | {
                        localTaxId: string // BT-48
                    }
              )
            | undefined
        reference?: string | undefined // BT-10
        tradeContact?:
            | {
                  // BG-9
                  personName?: string | undefined // BT-56
                  departmentName?: string | undefined // BT-56-0
                  telephoneNumber?: string | undefined // BT-57
                  email?: string | undefined // BT-58
              }[]
            | undefined
    }
    sellerTaxRepresentative?:
        | {
              // BG-11
              name: string // BT-62
              postalAddress: {
                  // BG-12
                  postcode?: string | undefined // BT-67
                  addressLineOne?: string | undefined // BT-64
                  addressLineTwo?: string | undefined // BT-65
                  addressLineThree?: string | undefined // BT-164
                  city?: string | undefined // BT-66
                  country: COUNTRY_ID_CODES // BT-69
                  countrySubDivision?: string | undefined // BT-68
              }
              taxIdentification:
                  | {
                        vatId: string // BT-63
                    }
                  | {
                        localTaxId: string // BT-63
                    }
          }
        | undefined
    invoiceLines: {
        // BG-25
        generalLineData: {
            lineId: string // BT-126
            lineNote?:
                | {
                      content: string // BT-127
                  }
                | undefined
        }
        productDescription: {
            // BG-31
            globalId?:
                | {
                      // BT-157
                      id: string
                      scheme: ISO6523_CODES // BT-157-1
                  }
                | undefined
            sellerProductId?: string | undefined // BT-155
            buyerProductId?: string | undefined // BT-156
            name: string // BT-153
            description?: string | undefined // BT-154
            productCharacteristic?:
                | {
                      // BG-32
                      characteristic: string // BT-160
                      value: string // BT-161
                  }[]
                | undefined
            productClassification?:
                | {
                      productClass?:
                          | {
                                code: string // BT-158
                                codeScheme: UNTDID_7143 // BT-158-1
                                codeSchemeVersion?: string | undefined // BT-158-2
                            }
                          | undefined
                  }[]
                | undefined
            originTradeCountry?: COUNTRY_ID_CODES | undefined // BT-159
        }
        productPriceAgreement: {
            // BG-29
            referencedOrder?:
                | {
                      lineId?: string | undefined // BT-132
                  }
                | undefined
            productPricing?:
                | {
                      basisPricePerItem: number // BT-148
                      priceBaseQuantity?:
                          | {
                                quantity: number // BT-149-1
                                unit?: UNIT_CODES | undefined // BT-150-1
                            }
                          | undefined
                      priceAllowancesAndCharges?:
                          | {
                                allowances?:
                                    | {
                                          actualAmount: number // BT-147
                                      }[]
                                    | undefined
                            }
                          | undefined
                  }
                | undefined
            productNetPricing: {
                netPricePerItem: number // BT-146
                priceBaseQuantity?:
                    | {
                          // BT-149
                          quantity: number
                          unit?: UNIT_CODES | undefined // BT-150
                      }
                    | undefined
            }
        }
        delivery: {
            itemQuantity: {
                quantity: number // BT-129
                unit: UNIT_CODES // BT-130
            }
        }
        settlement: {
            tax: {
                // BG-30
                typeCode: TAX_TYPE_CODE
                categoryCode: TAX_CATEGORY_CODES // BT-151
                rateApplicablePercent?: number | undefined // BT-152
            }
            billingPeriod?:
                | {
                      // BG-26
                      startDate?:
                          | {
                                // BT-134
                                year: number
                                month: number
                                day: number
                            }
                          | undefined
                      endDate?:
                          | {
                                // BT-135
                                year: number
                                month: number
                                day: number
                            }
                          | undefined
                  }
                | undefined
            lineLevelAllowancesAndCharges?:
                | {
                      allowances?:
                          | {
                                // BG-27
                                calculationPercent?: number | undefined // BT-138
                                basisAmount?: number | undefined // BT-137
                                actualAmount: number // BT-136
                                reasonCode?: ALLOWANCE_REASONS_CODES | undefined // BT-140
                                reason?: string | undefined // BT-139
                            }[]
                          | undefined
                      charges?:
                          | {
                                // BG-28
                                calculationPercent?: number | undefined // BT-143
                                basisAmount?: number | undefined // BT-142
                                actualAmount: number // BT-141
                                reasonCode?: CHARGE_REASONS_CODES | undefined // BT-145
                                reason?: string | undefined // BT-144
                            }[]
                          | undefined
                  }
                | undefined
            lineTotals: {
                netTotal: number // BT-131
            }
            additionalReferences?:
                | {
                      documentId: string // BT-128
                      typeCode: '130' // BT-128-0
                      referenceTypeCode?: REFERENCED_DOCUMENT_TYPE_CODES | undefined // BT-128-
                  }[]
                | undefined
            accountingInformation?:
                | {
                      id: string // BT-133
                  }
                | undefined
        }
    }[]
    referencedDocuments?:
        | {
              orderReference?:
                  | {
                        documentId?: string | undefined // BT-13
                    }
                  | undefined
              contractReference?:
                  | {
                        documentId?: string | undefined // BT-12
                    }
                  | undefined
              advanceShippingNotice?:
                  | {
                        documentId?: string | undefined // BT-16
                    }
                  | undefined
              referencedInvoice?:
                  | {
                        // BG-3
                        documentId: string // BT-25
                        issueDate?:
                            | {
                                  // BT-26
                                  year: number
                                  month: number
                                  day: number
                              }
                            | undefined
                    }[]
                  | undefined
              orderConfirmationReference?:
                  | {
                        documentId?: string | undefined // BT-14
                    }
                  | undefined
              projectReference?:
                  | {
                        id: string // BT-11
                        name: string // BT-11-0
                    }
                  | undefined
              receivingAdviceReference?:
                  | {
                        documentId?: string | undefined // BT-15
                    }
                  | undefined
              additionalReferences?:
                  | {
                        invoiceSupportingDocuments?:
                            | {
                                  // BG-24
                                  documentId: string // BT-122
                                  uriid?: string | undefined // BT-124
                                  name?: string | undefined // BT-123
                                  attachmentBinaryObject?:
                                      | {
                                            // BT-125
                                            mimeCode: MIME_CODES // BT-125-1
                                            fileName: string // BT-125-2
                                        }
                                      | undefined
                              }[]
                            | undefined
                        tenderOrLotReferenceDetails?:
                            | {
                                  documentId: string // BT-17
                              }[]
                            | undefined
                        invoiceItemDetails?:
                            | {
                                  documentId: string // BT-18
                                  referenceTypeCode?: REFERENCED_DOCUMENT_TYPE_CODES | undefined // BT-18-1
                              }[]
                            | undefined
                    }
                  | undefined
          }
        | undefined
    delivery?: {
        recipient?:
            | {
                  // BG-13
                  id?: string | undefined // BT-71
                  globalId?:
                      | {
                            id: string // BT-71-0
                            scheme: ISO6523_CODES // BT-71-1
                        }
                      | undefined
                  name?: string | undefined // BT-70
                  postalAddress: {
                      postcode?: string | undefined // BT-78
                      addressLineOne?: string | undefined // BT-75
                      addressLineTwo?: string | undefined // BT-76
                      addressLineThree?: string | undefined // BT-165
                      city?: string | undefined // BT-77
                      country: COUNTRY_ID_CODES // BT-80
                      countrySubDivision?: string | undefined // BT-79
                  }
              }
            | undefined
        deliveryDate?:
            | {
                  // BT-72
                  year: number
                  month: number
                  day: number
              }
            | undefined
    }
    paymentInformation: {
        creditorReference?: string | undefined // BT-90
        paymentReference?: string | undefined // BT-83
        payee?:
            | {
                  // BG-10
                  id?: string | undefined // BT-60
                  globalId?:
                      | {
                            id: string // BT-60-0
                            scheme: ISO6523_CODES // BT-60-1
                        }
                      | undefined
                  name: string // BT-59
                  specifiedLegalOrganization?:
                      | {
                            id?:
                                | {
                                      id: string // BT-61
                                      scheme?: ISO6523_CODES | undefined // BT-61-1
                                  }
                                | undefined
                        }
                      | undefined
              }
            | undefined
        paymentMeans?:
            | {
                  // BG-16
                  paymentType: PAYMENT_MEANS_CODES // BT-81
                  payerBankAccount?:
                      | {
                            iban?: string | undefined // BT-91
                        }
                      | undefined
                  payeeBankAccount?:
                      | {
                            // BG-17
                            iban?: string | undefined // BT-84
                            propriataryId?: string | undefined // BT-84-0
                            accountName?: string | undefined // BT-85
                            bic?: string | undefined // BT-86
                        }
                      | undefined
                  description?: string | undefined // BT-82
                  financialCard?:
                      | {
                            // BG-18
                            finalDigitsOfCard: string // BT-87
                            cardholderName?: string | undefined // BT-88
                        }
                      | undefined
              }[]
            | undefined
        billingPeriod?:
            | {
                  // BG-14
                  startDate?:
                      | {
                            // BT-73
                            year: number
                            month: number
                            day: number
                        }
                      | undefined
                  endDate?:
                      | {
                            // BT-74
                            year: number
                            month: number
                            day: number
                        }
                      | undefined
              }
            | undefined
        paymentTerms?:
            | {
                  description?: string | undefined // BT-20
                  dueDate?:
                      | {
                            // BT-9
                            year: number
                            month: number
                            day: number
                        }
                      | undefined
                  directDebitMandateID?: string | undefined // BT-89
              }
            | undefined
        specifiedTradeAccountingAccount?: string | undefined // BT-19
    }
    totals: {
        // BG-22
        sumWithoutAllowancesAndCharges: number // BT-106
        documentLevelAllowancesAndCharges?:
            | {
                  allowances?:
                      | {
                            // BG-20
                            calculationPercent?: number | undefined // BT-94
                            basisAmount?: number | undefined // BT-93
                            actualAmount: number // BT-92
                            reasonCode?: ALLOWANCE_REASONS_CODES | undefined // BT-98
                            reason?: string | undefined // BT-97
                            categoryTradeTax: {
                                typeCode: TAX_TYPE_CODE // BT-95-0
                                categoryCode: TAX_CATEGORY_CODES // BT-95
                                rateApplicablePercent?: number | undefined // BT-96
                            }
                        }[]
                      | undefined
                  charges?:
                      | {
                            // BG-21
                            calculationPercent?: number | undefined // BT-101
                            basisAmount?: number | undefined // BT-100
                            actualAmount: number // BT-99
                            reasonCode?: CHARGE_REASONS_CODES | undefined // BT-105
                            reason?: string | undefined // BT-104
                            categoryTradeTax: {
                                typeCode: TAX_TYPE_CODE // BT-102-0
                                categoryCode: TAX_CATEGORY_CODES // BT-102
                                rateApplicablePercent?: number | undefined // BT-103
                            }
                        }[]
                      | undefined
              }
            | undefined
        allowanceTotalAmount?: number | undefined // BT-107
        chargeTotalAmount?: number | undefined // BT-108
        netTotal: number // BT-109
        taxBreakdown: {
            // BG-23
            calculatedAmount: number // BT-117
            typeCode: TAX_TYPE_CODE // BT-118-0
            exemptionReason?: string | undefined // BT-120
            basisAmount: number // BT-116
            categoryCode: TAX_CATEGORY_CODES // BT-118
            exemptionReasonCode?: EXEMPTION_REASON_CODES | undefined // BT-121
            taxPointDate?:
                | {
                      // BT-7
                      year: number
                      month: number
                      day: number
                  }
                | undefined
            dueDateTypeCode?: TIME_REFERENCE_CODES | undefined // BT-8
            rateApplicablePercent?: number | undefined // BT-119
        }[]
        taxTotal?:
            | {
                  amount: number // BT-110 / BT-111
                  currency: CURRENCY_CODES // BT-111-0
              }[]
            | undefined
        taxCurrency?: CURRENCY_CODES | undefined // BT-6
        roundingAmount?: number | undefined // BT-114
        grossTotal: number // BT-112
        prepaidAmount?: number | undefined // BT-113
        openAmount: number // BT-115
    }
}
