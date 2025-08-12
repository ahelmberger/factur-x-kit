import { COUNTRY_ID_CODES, CURRENCY_CODES, ISO6523_CODES, UNTDID_1153 } from '../src/types/codes';

interface minimum_profile {
    businessProcessType?: string | undefined; // BT-23
    profile: 'urn:factur-x.eu:1p0:minimum'; // BT-24
    document: {
        id: string; // BT-1
        type: UNTDID_1153; // BT-3
        currency: CURRENCY_CODES; // BT-5
        dateOfIssue: {
            // BT-2
            year: number;
            month: number;
            day: number;
        };
    };
    seller: {
        // BG-4
        name: string; // BT-27
        specifiedLegalOrganization?:
            | {
                  id?:
                      | {
                            id: string; // BT-30
                            scheme?: ISO6523_CODES | undefined; // BT-30-1
                        }
                      | undefined;
              }
            | undefined;
        postalAddress: {
            // BG-5
            country: COUNTRY_ID_CODES; // BT-40
        };
        taxIdentification: {
            vatId?: string | undefined; // BT-31
            localTaxId?: string | undefined; // BT-32
        };
    };
    buyer: {
        // BG-7
        reference?: string | undefined; // BT-10
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
    };
    referencedDocuments?:
        | {
              orderReference?:
                  | {
                        documentId?: string | undefined; // BT-13
                    }
                  | undefined;
          }
        | undefined;
    totals: {
        // BG-22
        netTotal: number; // BT-109
        taxTotal?:
            | {
                  amount: number; // BT-110 / BT-111
                  currency: CURRENCY_CODES; // BT-111-0
              }[]
            | undefined;
        grossTotal: number; // BT-112
        openAmount: number; // BT-115
    };
}
