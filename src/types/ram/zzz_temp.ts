interface comfortProfile {
    meta: {
        businessProcessType?: string | undefined // BT-23
        guidelineSpecifiedDocumentContextParameter: 'urn:cen.eu:en16931:2017' //BT-24
    }
    document: {
        id: string
        type: unknown
        dateOfIssue: {
            year: number
            month: number
            day: number
        }
        currency: unknown
        notes: {
            content: string
            subject?: unknown | undefined
        }[]
    }
    seller: {
        id?: string[] | undefined
        globalId?:
            | {
                  id: string
                  scheme: unknown
              }[]
            | undefined
        name: string
        specifiedLegalOrganization?:
            | {
                  id?:
                      | {
                            id: string
                            scheme?: unknown | undefined
                        }
                      | undefined
                  tradingBusinessName?: string | undefined
              }
            | undefined
        postalAddress: {
            postcode?: string | undefined
            addressLineOne?: string | undefined
            addressLineTwo?: string | undefined
            addressLineThree?: string | undefined
            city?: string | undefined
            country: unknown
            countrySubDivision?: string | undefined
        }
        universalCommunicationAddressURI?:
            | {
                  id: string
                  scheme: unknown
              }
            | undefined
        taxIdentification?:
            | {
                  vatId?: string | undefined
                  localTaxId?: string | undefined
              }
            | undefined
        otherLegalInformation?: string | undefined
        tradeContact?:
            | {
                  personName?: string | undefined
                  departmentName?: string | undefined
                  telephoneNumber?: string | undefined
                  email?: string | undefined
              }[]
            | undefined
    }
    buyer: {
        id?: string | undefined
        globalId?:
            | {
                  id: string
                  scheme: unknown
              }
            | undefined
        name: string
        specifiedLegalOrganization?:
            | {
                  id?:
                      | {
                            id: string
                            scheme?: unknown | undefined
                        }
                      | undefined
                  tradingBusinessName?: string | undefined
              }
            | undefined
        postalAddress: {
            postcode?: string | undefined
            addressLineOne?: string | undefined
            addressLineTwo?: string | undefined
            addressLineThree?: string | undefined
            city?: string | undefined
            country: unknown
            countrySubDivision?: string | undefined
        }
        universalCommunicationAddressURI?:
            | {
                  id: string
                  scheme: unknown
              }
            | undefined
        taxIdentification?:
            | (
                  | {
                        vatId: string
                    }
                  | {
                        localTaxId: string
                    }
              )
            | undefined
        reference?: string | undefined
        tradeContact?:
            | {
                  personName?: string | undefined
                  departmentName?: string | undefined
                  telephoneNumber?: string | undefined
                  email?: string | undefined
              }[]
            | undefined
    }
    sellerTaxRepresentative?:
        | {
              name: string
              postalAddress: {
                  postcode?: string | undefined
                  addressLineOne?: string | undefined
                  addressLineTwo?: string | undefined
                  addressLineThree?: string | undefined
                  city?: string | undefined
                  country: unknown
                  countrySubDivision?: string | undefined
              }
              taxIdentification:
                  | {
                        vatId: string
                    }
                  | {
                        localTaxId: string
                    }
          }
        | undefined
    invoiceLines: {
        generalLineData: {
            lineId: string
            lineNote?:
                | {
                      content: string
                  }
                | undefined
        }
        productDescription: {
            globalId?:
                | {
                      id: string
                      scheme?: unknown | undefined
                  }
                | undefined
            sellerProductId?: string | undefined
            buyerProductId?: string | undefined
            name: string
            description?: string | undefined
            productCharacteristic?:
                | {
                      characteristic: string
                      value: string
                  }[]
                | undefined
            productClassification?:
                | {
                      productClass?:
                          | {
                                code: string
                                codeScheme: unknown
                                codeSchemeVersion?: string | undefined
                            }
                          | undefined
                  }[]
                | undefined
            originTradeCountry?: unknown | undefined
        }
        productPriceAgreement: {
            referencedOrder?:
                | {
                      lineId?: string | undefined
                  }
                | undefined
            productGrossPricing?:
                | {
                      grossPricePerItem: number
                      priceBaseQuantity?:
                          | {
                                quantity: number
                                unit?: unknown | undefined
                            }
                          | undefined
                      priceAllowancesAndCharges?:
                          | {
                                allowances?:
                                    | {
                                          actualAmount: number
                                      }[]
                                    | undefined
                            }
                          | undefined
                  }
                | undefined
            productNetPricing: {
                netPricePerItem: number
                priceBaseQuantity?:
                    | {
                          quantity: number
                          unit?: unknown | undefined
                      }
                    | undefined
            }
        }
        delivery: {
            itemQuantity: {
                quantity: number
                unit: unknown
            }
        }
        settlement: {
            tax: {
                typeCode: unknown
                categoryCode: unknown
                rateApplicablePercent?: number | undefined
            }
            billingPeriod?:
                | {
                      startDate?:
                          | {
                                year: number
                                month: number
                                day: number
                            }
                          | undefined
                      endDate?:
                          | {
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
                                actualAmount: number
                                reasonCode?: unknown | undefined
                                reason?: string | undefined
                            }[]
                          | undefined
                      charges?:
                          | {
                                actualAmount: number
                                reasonCode?: unknown | undefined
                                reason?: string | undefined
                            }[]
                          | undefined
                  }
                | undefined
            lineTotals: {
                netTotal: number
            }
            additionalReferences?:
                | {
                      documentId: string
                      typeCode: '130'
                      referenceTypeCode?: unknown | undefined
                  }[]
                | undefined
            accountingInformation?:
                | {
                      id: string
                  }
                | undefined
        }
    }[]
    referencedDocuments?:
        | {
              orderReference?:
                  | {
                        documentId?: string | undefined
                    }
                  | undefined
              contractReference?:
                  | {
                        documentId?: string | undefined
                    }
                  | undefined
              advanceShippingNotice?:
                  | {
                        documentId?: string | undefined
                    }
                  | undefined
              referencedInvoice?:
                  | {
                        documentId?: string | undefined
                        issueDate?:
                            | {
                                  year: number
                                  month: number
                                  day: number
                              }
                            | undefined
                    }[]
                  | undefined
              orderConfirmationReference?:
                  | {
                        documentId?: string | undefined
                    }
                  | undefined
              projectReference?:
                  | {
                        id: string
                        name: string
                    }
                  | undefined
              receivingAdviceReference?:
                  | {
                        documentId?: string | undefined
                    }
                  | undefined
              additionalReferences?:
                  | {
                        invoiceSupportingDocuments?:
                            | {
                                  documentId: string
                                  uriid?: string | undefined
                                  name?: string | undefined
                                  attachmentBinaryObject?:
                                      | {
                                            mimeCode: unknown
                                            fileName: string
                                        }
                                      | undefined
                              }[]
                            | undefined
                        tenderOrLotReferenceDetails?:
                            | {
                                  documentId: string
                              }[]
                            | undefined
                        invoiceItemDetails?:
                            | {
                                  documentId: string
                                  referenceTypeCode?: unknown | undefined
                              }[]
                            | undefined
                    }
                  | undefined
          }
        | undefined
    delivery: {
        recipient?:
            | {
                  id?: string | undefined
                  globalId?:
                      | {
                            id: string
                            scheme: unknown
                        }
                      | undefined
                  name?: string | undefined
                  postalAddress: {
                      postcode?: string | undefined
                      addressLineOne?: string | undefined
                      addressLineTwo?: string | undefined
                      addressLineThree?: string | undefined
                      city?: string | undefined
                      country: unknown
                      countrySubDivision?: string | undefined
                  }
              }
            | undefined
        deliveryDate?:
            | {
                  year: number
                  month: number
                  day: number
              }
            | undefined
    }
    paymentInformation: {
        creditorReference?: string | undefined
        paymentReference?: string | undefined
        payee?:
            | {
                  id?: string | undefined
                  globalId?:
                      | {
                            id: string
                            scheme: unknown
                        }
                      | undefined
                  name: string
                  specifiedLegalOrganization?:
                      | {
                            id?:
                                | {
                                      id: string
                                      scheme?: unknown | undefined
                                  }
                                | undefined
                        }
                      | undefined
              }
            | undefined
        paymentMeans?:
            | {
                  paymentType: unknown
                  payerBankAccount?:
                      | {
                            iban?: string | undefined
                        }
                      | undefined
                  payeeBankAccount?:
                      | {
                            iban?: string | undefined
                            propriataryId?: string | undefined
                            accountName?: string | undefined
                            bic?: string | undefined
                        }
                      | undefined
                  description?: string | undefined
                  financialCard?:
                      | {
                            finalDigitsOfCard: string
                            cardholderName?: string | undefined
                        }
                      | undefined
              }[]
            | undefined
        billingPeriod?:
            | {
                  startDate?:
                      | {
                            year: number
                            month: number
                            day: number
                        }
                      | undefined
                  endDate?:
                      | {
                            year: number
                            month: number
                            day: number
                        }
                      | undefined
              }
            | undefined
        paymentTerms?:
            | {
                  description?: string | undefined
                  dueDate?:
                      | {
                            year: number
                            month: number
                            day: number
                        }
                      | undefined
                  directDebitMandateID?: string | undefined
              }
            | undefined
        specifiedTradeAccountingAccount?: string | undefined
    }
    totals: {
        sumWithoutAllowancesAndCharges: number
        documentLevelAllowancesAndCharges?:
            | {
                  allowances?:
                      | {
                            calculationPercent?: number | undefined
                            basisAmount?: number | undefined
                            actualAmount: number
                            reasonCode?: unknown | undefined
                            reason?: string | undefined
                            categoryTradeTax: {
                                typeCode: unknown
                                categoryCode: unknown
                                rateApplicablePercent?: number | undefined
                            }
                        }[]
                      | undefined
                  charges?:
                      | {
                            calculationPercent?: number | undefined
                            basisAmount?: number | undefined
                            actualAmount: number
                            reasonCode?: unknown | undefined
                            reason?: string | undefined
                            categoryTradeTax: {
                                typeCode: unknown
                                categoryCode: unknown
                                rateApplicablePercent?: number | undefined
                            }
                        }[]
                      | undefined
              }
            | undefined
        allowanceTotalAmount?: number | undefined
        chargeTotalAmount?: number | undefined
        netTotal: number
        taxBreakdown: {
            calculatedAmount: number
            typeCode: unknown
            exemptionReason?: string | undefined
            basisAmount: number
            categoryCode: unknown
            exemptionReasonCode?: unknown | undefined
            taxPointDate?:
                | {
                      year: number
                      month: number
                      day: number
                  }
                | undefined
            dueDateTypeCode?: unknown | undefined
            rateApplicablePercent?: number | undefined
        }[]
        taxTotal?:
            | {
                  amount: number
                  currency: unknown
              }[]
            | undefined
        taxCurrency?: unknown | undefined
        roundingAmount?: number | undefined
        grossTotal: number
        prepaidAmount?: number | undefined
        openAmount: number
    }
}
