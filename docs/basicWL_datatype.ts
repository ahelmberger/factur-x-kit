import {
    ALLOWANCE_REASONS_CODES,
    CHARGE_REASONS_CODES,
    COUNTRY_ID_CODES,
    CURRENCY_CODES,
    EAS_SCHEME_CODES,
    EXEMPTION_REASON_CODES,
    ISO6523_CODES,
    PAYMENT_MEANS_CODES,
    SUBJECT_CODES,
    TAX_CATEGORY_CODES,
    TAX_TYPE_CODE,
    TIME_REFERENCE_CODES,
    UNTDID_1153
} from '../src/types/codes';

interface basicwl_datatype {
    businessProcessType?: string | undefined; // BT-23
    profile: 'urn:factur-x.eu:1p0:basicwl';
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
                  id: string; // BT-29-0
                  scheme: ISO6523_CODES; // BT-29-1
              }[]
            | undefined;
        name: string; // BT-27
        specifiedLegalOrganization?:
            | {
                  id?:
                      | {
                            id: string; // BT-30
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
                  id: string; // BT-34
                  scheme: EAS_SCHEME_CODES; // BT-34-1
              }
            | undefined;
        taxIdentification?:
            | {
                  vatId?: string | undefined; // BT-31
                  localTaxId?: string | undefined; // BT-32
              }
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
                            id: string; // BT-47
                            scheme?: ISO6523_CODES | undefined; // BT-47-1
                        }
                      | undefined;
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
                  id: string; // BT-49
                  scheme: EAS_SCHEME_CODES; // BT-49-1
              }
            | undefined;
        taxIdentification?:
            | (
                  | {
                        vatId: string; // BT-48
                    }
                  | {
                        localTaxId: string; // BT-48
                    }
              )
            | undefined;
        reference?: string | undefined; // BT-10
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
                  vatId: string; // BT-63
              };
          }
        | undefined;
    referencedDocuments?:
        | {
              orderReference?:
                  | {
                        documentId?: string | undefined; // BT-13
                    }
                  | undefined;
              contractReference?:
                  | {
                        documentId?: string | undefined; // BT-12
                    }
                  | undefined;
              advanceShippingNotice?:
                  | {
                        documentId?: string | undefined; // BT-16
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
                            iban?: string | undefined; // BT-84
                            propriataryId?: string | undefined; // BT-84-0
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
        // BG-22
        sumWithoutAllowancesAndCharges: number; // BT-106
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
                            categoryTradeTax: {
                                typeCode: TAX_TYPE_CODE; // BT-95-0
                                categoryCode: TAX_CATEGORY_CODES; // BT-95
                                rateApplicablePercent?: number | undefined; // BT-96
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
                            categoryTradeTax: {
                                typeCode: TAX_TYPE_CODE; // BT-102-0
                                categoryCode: TAX_CATEGORY_CODES; // BT-102
                                rateApplicablePercent?: number | undefined; // BT-103
                            };
                        }[]
                      | undefined;
              }
            | undefined;
        allowanceTotalAmount?: number | undefined; // BT-107
        chargeTotalAmount?: number | undefined; // BT-108
        netTotal: number; // BT-109
        taxBreakdown: {
            // BG-23
            calculatedAmount: number; // BT-117
            typeCode: TAX_TYPE_CODE; // BT-118-0
            exemptionReason?: string | undefined; // BT-120
            basisAmount: number; // BT-116
            categoryCode: TAX_CATEGORY_CODES; // BT-118
            exemptionReasonCode?: EXEMPTION_REASON_CODES | undefined; // BT-121
            dueDateTypeCode?: TIME_REFERENCE_CODES | undefined; // BT-8
            rateApplicablePercent?: number | undefined; // BT-119
        }[];
        taxTotal?:
            | {
                  amount: number; // BT-110 / BT-111
                  currency: CURRENCY_CODES; // BT-111-0
              }[]
            | undefined;
        taxCurrency?: CURRENCY_CODES | undefined; // BT-6
        grossTotal: number; // BT-112
        prepaidAmount?: number | undefined; // BT-113
        openAmount: number; // BT-115
    };
}
