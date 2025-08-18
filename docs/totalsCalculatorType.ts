import { TaxTypeWithTaxRate, TaxTypeWithoutTaxRate } from '../src/adapter/totalsCalculator/easyInputType';
import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    EAS_SCHEME_CODES,
    ISO6523_CODES,
    MIME_CODES,
    PAYMENT_MEANS_CODES,
    REFERENCED_DOCUMENT_TYPE_CODES,
    SUBJECT_CODES,
    TIME_REFERENCE_CODES,
    UNIT_CODES,
    UNTDID_1153,
    UNTDID_7143
} from '../src/types/codes';

interface totalsCalculatorInput {
    businessProcessType?: string | undefined; // BT-23
    document: {
        id: string; // BT-1
        type: UNTDID_1153; // BT-3
        dateOfIssue: {
            // BT-2
            year: number;
            month: number;
            day: number;
        };
        currency: CURRENCY_CODES; // BT-5
        notes?:
            | {
                  // BG-1
                  content: string; // BT-22
                  subject?: SUBJECT_CODES | undefined; // BT-21
              }[]
            | undefined;
    };
    seller: {
        // BG-4
        id?: string[] | undefined; // BT-29
        globalId?:
            | {
                  // BT-29-0
                  id: string;
                  scheme: ISO6523_CODES; // BT-29-1
              }[]
            | undefined;
        name: string; // BT-27
        specifiedLegalOrganization?:
            | {
                  // BT-30-00
                  id?:
                      | {
                            // BT-30
                            id: string;
                            scheme?: ISO6523_CODES | undefined; // BT-30-1
                        }
                      | undefined;
                  tradingBusinessName?: string | undefined; // BT-28
              }
            | undefined;
        postalAddress: {
            // BG-5
            postcode?: string | undefined; // BT-38
            addressLineOne?: string | undefined; // BT-35
            addressLineTwo?: string | undefined; // BT-36
            addressLineThree?: string | undefined; // BT-162
            city?: string | undefined; // BT-37
            country: COUNTRY_ID_CODES; // BT-40
            countrySubDivision?: string | undefined; // BT-39
        };
        universalCommunicationAddressURI?:
            | {
                  // BT-34
                  id: string;
                  scheme: EAS_SCHEME_CODES; // BT-34-1
              }
            | undefined;
        taxIdentification?:
            | {
                  // BT-31-00
                  vatId?: string | undefined; // BT-31
                  localTaxId?: string | undefined; // BT-32
              }
            | undefined;
        otherLegalInformation?: string | undefined; // BT-33
        tradeContact?:
            | {
                  // BG-6
                  personName?: string | undefined; // BT-41
                  departmentName?: string | undefined; // BT-41-0
                  telephoneNumber?: string | undefined; // BT-42
                  email?: string | undefined; // BT-43
              }[]
            | undefined;
    };
    buyer: {
        // BG-7
        id?: string | undefined; // BT-46
        globalId?:
            | {
                  id: string; // BT-46-0
                  scheme: ISO6523_CODES; // BT-46-1
              }
            | undefined;
        name: string; // BT-44
        specifiedLegalOrganization?:
            | {
                  id?:
                      | {
                            // BT-47
                            id: string;
                            scheme?: ISO6523_CODES | undefined; // BT-47-1
                        }
                      | undefined;
                  tradingBusinessName?: string | undefined; // BT-45
              }
            | undefined;
        postalAddress: {
            // BG-8
            postcode?: string | undefined; // BT-53
            addressLineOne?: string | undefined; // BT-50
            addressLineTwo?: string | undefined; // BT-51
            addressLineThree?: string | undefined; // BT-163
            city?: string | undefined; // BT-52
            country: COUNTRY_ID_CODES; // BT-55
            countrySubDivision?: string | undefined; // BT-54
        };
        universalCommunicationAddressURI?:
            | {
                  // BT-49
                  id: string;
                  scheme: EAS_SCHEME_CODES; // BT-49-1
              }
            | undefined;
        taxIdentification?:
            | (
                  | {
                        // BT-48
                        vatId: string;
                    }
                  | {
                        localTaxId: string;
                    }
              )
            | undefined;
        reference?: string | undefined; // BT-10
        tradeContact?:
            | {
                  // BG-9
                  personName?: string | undefined; // BT-56
                  departmentName?: string | undefined; // BT-56-0
                  telephoneNumber?: string | undefined; // BT-57
                  email?: string | undefined; // BT-58
              }[]
            | undefined;
    };
    sellerTaxRepresentative?:
        | {
              // BG-11
              name: string; // BT-62
              postalAddress: {
                  // BG-12
                  postcode?: string | undefined; // BT-67
                  addressLineOne?: string | undefined; // BT-64
                  addressLineTwo?: string | undefined; // BT-65
                  addressLineThree?: string | undefined; // BT-164
                  city?: string | undefined; // BT-66
                  country: COUNTRY_ID_CODES; // BT-69
                  countrySubDivision?: string | undefined; // BT-68
              };
              taxIdentification: {
                  // BT-63-00
                  vatId: string; // BT-63
              };
          }
        | undefined;
    invoiceLines: {
        generalLineData: {
            // BT-126-00
            lineId: string; // BT-126
            lineNote?:
                | {
                      // BT-127-00
                      content: string; // BT-127
                  }
                | undefined;
        };
        productDescription: {
            // BG-31
            globalId?:
                | {
                      // BT-157
                      id: string;
                      scheme: ISO6523_CODES; // BT-157-1
                  }
                | undefined;
            sellerProductId?: string | undefined; // BT-155
            buyerProductId?: string | undefined; // BT-156
            name: string; // BT-153
            description?: string | undefined; // BT-154
            productCharacteristic?:
                | {
                      // BG-32
                      characteristic: string; // BT-160
                      value: string; // BT-161
                  }[]
                | undefined;
            productClassification?:
                | {
                      // BT-158-00
                      productClass?:
                          | {
                                code: string; // BT-158
                                codeScheme: UNTDID_7143; // BT-158-1
                                codeSchemeVersion?: string | undefined; // BT-158-2
                            }
                          | undefined;
                  }[]
                | undefined;
            originTradeCountry?: COUNTRY_ID_CODES | undefined; // BT-159
        };
        productPriceAgreement: {
            referencedOrder?:
                | {
                      // BT-132-00
                      lineId?: string | undefined; // BT-132
                  }
                | undefined;
            productPricing: {
                // BT-148-00
                basisPricePerItem: number; // BT-148
                priceBaseQuantity?:
                    | {
                          // BT-149-1
                          quantity: number;
                          unit?: UNIT_CODES | undefined; // BT-150-1
                      }
                    | undefined;
                priceAllowancesAndCharges?:
                    | {
                          // BT-147-00
                          allowances?:
                              | {
                                    actualAmount: number; // BT-147
                                }[]
                              | undefined;
                      }
                    | undefined;
            };
        };
        delivery: {
            // BT-129-00
            itemQuantity: {
                // BT-129
                quantity: number;
                unit: UNIT_CODES; // BT-130
            };
        };
        settlement: {
            billingPeriod?:
                | {
                      // BG-26
                      startDate?:
                          | {
                                // BT-134
                                year: number;
                                month: number;
                                day: number;
                            }
                          | undefined;
                      endDate?:
                          | {
                                // BT-135
                                year: number;
                                month: number;
                                day: number;
                            }
                          | undefined;
                  }
                | undefined;
            lineLevelAllowancesAndCharges?: {
                allowances?:
                    | {
                          // BG-27
                          calculationPercent?: number | undefined; // BT-138
                          basisAmount?: number | undefined; // BT-137
                          actualAmount: number; // BT-136
                          reasonCode?: ALLOWANCE_REASONS_CODES | undefined; // BT-140
                          reason?: string | undefined; // BT-139
                      }[]
                    | undefined;
                charges?:
                    | {
                          // BG-28
                          calculationPercent?: number | undefined; // BT-143
                          basisAmount?: number | undefined; // BT-142
                          actualAmount: number; // BT-141
                          reasonCode?: CHARGE_REASONS_CODES | undefined; // BT-145
                          reason?: string | undefined; // BT-144
                      }[]
                    | undefined;
            };
            additionalReferences?:
                | {
                      // BT-128-00
                      documentId: string; // BT-128
                      typeCode: '130';
                      referenceTypeCode?: REFERENCED_DOCUMENT_TYPE_CODES | undefined; // BT-128-
                  }[]
                | undefined;
            accountingInformation?:
                | {
                      // BT-133-00
                      id: string; // BT-133
                  }
                | undefined;
            tax:
                | {
                      categoryCode: TaxTypeWithTaxRate;
                      rateApplicablePercent: number; // BT-152
                  }
                | {
                      categoryCode: TaxTypeWithoutTaxRate;
                  };
        };
    }[];
    referencedDocuments?:
        | {
              orderReference?:
                  | {
                        // BT-13
                        documentId?: string | undefined;
                    }
                  | undefined;
              contractReference?:
                  | {
                        // BT-12
                        documentId?: string | undefined;
                    }
                  | undefined;
              advanceShippingNotice?:
                  | {
                        // BT-16
                        documentId?: string | undefined;
                    }
                  | undefined;
              referencedInvoice?:
                  | {
                        // BG-3
                        documentId: string; // BT-25
                        issueDate?:
                            | {
                                  // BT-26
                                  year: number;
                                  month: number;
                                  day: number;
                              }
                            | undefined;
                    }[]
                  | undefined;
              orderConfirmationReference?:
                  | {
                        // BT-14
                        documentId?: string | undefined;
                    }
                  | undefined;
              projectReference?:
                  | {
                        // BT-11
                        id: string;
                        name: string; // BT-11-0
                    }
                  | undefined;
              receivingAdviceReference?:
                  | {
                        // BT-15
                        documentId?: string | undefined;
                    }
                  | undefined;
              additionalReferences?:
                  | {
                        invoiceSupportingDocuments?:
                            | {
                                  // BG-24
                                  documentId: string; // BT-122
                                  uriid?: string | undefined; // BT-124
                                  name?: string | undefined; // BT-123
                                  attachmentBinaryObject?:
                                      | {
                                            // BT-125
                                            mimeCode: MIME_CODES; // BT-125-1
                                            fileName: string; // BT-125-2
                                        }
                                      | undefined;
                              }[]
                            | undefined;
                        tenderOrLotReferenceDetails?:
                            | {
                                  // BT-17-00
                                  documentId: string; // BT-17
                              }[]
                            | undefined;
                        invoiceItemDetails?:
                            | {
                                  // BT-18-00
                                  documentId: string; // BT-18
                                  referenceTypeCode?: REFERENCED_DOCUMENT_TYPE_CODES | undefined; // BT-18-1
                              }[]
                            | undefined;
                    }
                  | undefined;
          }
        | undefined;
    delivery?:
        | {
              recipient?:
                  | {
                        // BG-13
                        id?: string | undefined; // BT-71
                        globalId?:
                            | {
                                  id: string; // BT-71-0
                                  scheme: ISO6523_CODES; // BT-71-1
                              }
                            | undefined;
                        name?: string | undefined; // BT-70
                        postalAddress: {
                            // BG-15
                            postcode?: string | undefined; // BT-78
                            addressLineOne?: string | undefined; // BT-75
                            addressLineTwo?: string | undefined; // BT-76
                            addressLineThree?: string | undefined; // BT-165
                            city?: string | undefined; // BT-77
                            country: COUNTRY_ID_CODES; // BT-80
                            countrySubDivision?: string | undefined; // BT-79
                        };
                    }
                  | undefined;
              deliveryDate?:
                  | {
                        // BT-72
                        year: number;
                        month: number;
                        day: number;
                    }
                  | undefined;
              billingPeriod?:
                  | {
                        // BG-14
                        startDate?:
                            | {
                                  // BT-73
                                  year: number;
                                  month: number;
                                  day: number;
                              }
                            | undefined;
                        endDate?:
                            | {
                                  // BT-74
                                  year: number;
                                  month: number;
                                  day: number;
                              }
                            | undefined;
                    }
                  | undefined;
          }
        | undefined;
    paymentInformation: {
        creditorReference?: string | undefined; // BT-90
        paymentReference?: string | undefined; // BT-83
        payee?:
            | {
                  // BG-10
                  id?: string | undefined; // BT-60
                  globalId?:
                      | {
                            id: string; // BT-60-0
                            scheme: ISO6523_CODES; // BT-60-1
                        }
                      | undefined;
                  name: string; // BT-59
                  specifiedLegalOrganization?:
                      | {
                            id?:
                                | {
                                      id: string; // BT-61
                                      scheme?: ISO6523_CODES | undefined; // BT-61-1
                                  }
                                | undefined;
                        }
                      | undefined;
              }
            | undefined;
        paymentMeans?:
            | {
                  // BG-16
                  paymentType: PAYMENT_MEANS_CODES; // BT-81
                  payerBankAccount?:
                      | {
                            iban?: string | undefined; // BT-91
                        }
                      | undefined;
                  payeeBankAccount?:
                      | {
                            // BG-17
                            iban?: string | undefined; // BT-84
                            propriataryId?: string | undefined; // BT-84-0
                            accountName?: string | undefined; // BT-85
                            bic?: string | undefined; // BT-86
                        }
                      | undefined;
                  description?: string | undefined; // BT-82
                  financialCard?:
                      | {
                            // BG-18
                            finalDigitsOfCard: string; // BT-87
                            cardholderName?: string | undefined; // BT-88
                        }
                      | undefined;
              }[]
            | undefined;
        paymentTerms?:
            | {
                  description?: string | undefined; // BT-20
                  dueDate?:
                      | {
                            // BT-9
                            year: number;
                            month: number;
                            day: number;
                        }
                      | undefined;
                  directDebitMandateID?: string | undefined; // BT-89
              }
            | undefined;
        specifiedTradeAccountingAccount?: string | undefined; // BT-19
    };
    totals: {
        documentLevelAllowancesAndCharges?:
            | {
                  allowances?:
                      | {
                            // BG-20
                            calculationPercent?: number | undefined; // BT-94
                            basisAmount?: number | undefined; // BT-93
                            actualAmount: number; // BT-92
                            reasonCode?: ALLOWANCE_REASONS_CODES | undefined; // BT-98
                            reason?: string | undefined; // BT-97
                            categoryTradeTax:
                                | {
                                      categoryCode: TaxTypeWithTaxRate; // BT-95
                                      rateApplicablePercent: number; // BT-96
                                  }
                                | {
                                      categoryCode: TaxTypeWithoutTaxRate;
                                  };
                        }[]
                      | undefined;
                  charges?:
                      | {
                            // BG-21
                            calculationPercent?: number | undefined; // BT-101
                            basisAmount?: number | undefined; // BT-100
                            actualAmount: number; // BT-99
                            reasonCode?: CHARGE_REASONS_CODES | undefined; // BT-105
                            reason?: string | undefined; // BT-104
                            categoryTradeTax:
                                | {
                                      categoryCode: TaxTypeWithTaxRate; // BT-102
                                      rateApplicablePercent: number; // BT-103
                                  }
                                | {
                                      categoryCode: TaxTypeWithoutTaxRate; // BT-102
                                  };
                        }[]
                      | undefined;
              }
            | undefined;
        optionalTaxCurrency?:
            | {
                  taxCurrency: unknown; // BT-111
                  exchangeRate: number;
              }
            | undefined;
        taxExemptionReason?:
            | {
                  reason: string;
                  categoryCode: TaxTypeWithoutTaxRate;
              }[]
            | undefined;
        optionalTaxDueDates?:
            | (
                  | {
                        categoryCode: TaxTypeWithTaxRate;
                        rateApplicablePercent: number;
                        dueDateTimeCode: TIME_REFERENCE_CODES | undefined; // BT-8
                    }
                  | {
                        categoryCode: TaxTypeWithTaxRate;
                        rateApplicablePercent: number;
                        taxPointDate: {
                            // BT-7
                            year: number;
                            month: number;
                            day: number;
                        };
                    }
              )[]
            | undefined;
        roundingAmount?: number | undefined; // BT-114
        prepaidAmount?: number | undefined; // BT-113
    };
}
