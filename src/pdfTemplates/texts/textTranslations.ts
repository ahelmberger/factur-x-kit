import { TranslatedTexts } from './types';

export const translations_en = {
    ATTN: 'ATTN',
    PHONE: 'Phone',
    EMAIL: 'Email',

    INVOICE_ID: 'Invoice Number',
    INVOICE_DATE: 'Invoice Date',
    ORDER_ID: 'Order Number',
    CONTRACT_ID: 'Contract Number',
    DELIVERY_DATE: 'Delivery Date',
    ADVANCE_SHIPPING_NOTICE: 'Despatch Notice',
    PAYMENT_DUE_DATE: 'Due Date',
    CUSTOMER_ID: 'Customer Number',

    LINE_ITEM_SHORT: 'Item',
    LINE_ITEM_LONG: 'Line Item',
    QUANTITY: 'Quantity',
    UNIT_PRICE: 'Unit Price',
    TAX: 'Tax',
    TOTAL_PRICE_PER_ITEM: 'Total Price',
    CHARGE: 'Extra charge',
    ALLOWANCE: 'Allowance',
    ALLOWANCES_CHARGES: 'Allowances / Charges',
    PRODUCT: 'Product',

    LINE_NOTES: 'Line Notes',
    PRODUCT_DESCRIPTION: 'Product Description',
    PRODUCT_CHARACTERISTICS: 'Product Characteristics',
    PRODUCT_CLASSIFICATION: 'Product Classifications',
    PRODUCT_ORIGIN: 'Product Origin',
    PRODUCT_IDENTIFICATION: 'Product Identification',
    GLOBAL_ID: 'Global ID',
    BUYER_PRODUCT_ID: 'Buyer Product ID',
    ACCOUNTING_INFORMATION: 'Accounting Reference',
    REFERENCED_DOCUMENTS: 'Referenced Documents',
    BILLING_PERIOD: 'Billing Period',

    NET_TOTAL_AMOUNT: 'Net Total Amount',
    GROSS_TOTAL_AMOUNT: 'Gross Total Amount',
    TAX_TOTAL_AMOUNT: 'Tax Total Amount',
    SUM: 'Sum',
    DOCUMENT_LEVEL_ALLOWANCE: 'Document Level Allowances',
    DOCUMENT_LEVEL_CHARGE: 'Document Level Charges',
    PREPAID_AMOUNT: 'Prepaid Amount',
    OPEN_AMOUNT: 'Open Amount',
    LINE_TOTAL_AMOUNT: 'Line Total Amount',
    ROUNDING_AMOUNT: 'Rounding Amount',
    VAT: 'Value Added Tax',
    VAT_ID: 'VAT ID',
    TAX_ID: 'Tax ID',

    VAT_EXMPTION_REASON: 'VAT Exemption Reason',
    ALREADY_PAID: 'This invoice has already been paid'
};

const translations_de: typeof translations_en = {
    ATTN: 'z.Hd.',
    PHONE: 'Telefon',
    EMAIL: 'E-Mail',

    INVOICE_ID: 'Rechnungsnummer',
    INVOICE_DATE: 'Rechnungsdatum',
    ORDER_ID: 'Bestellnummer',
    CONTRACT_ID: 'Vertragsnummer',
    DELIVERY_DATE: 'Lieferdatum',
    ADVANCE_SHIPPING_NOTICE: 'Lieferavis',
    PAYMENT_DUE_DATE: 'Zahlungsziel',
    CUSTOMER_ID: 'Kundennummer',

    LINE_ITEM_SHORT: 'Pos.',
    LINE_ITEM_LONG: 'Rechnungsposition',
    QUANTITY: 'Menge',
    UNIT_PRICE: 'Einzelpreis',
    TAX: 'Steuer',
    TOTAL_PRICE_PER_ITEM: 'Gesamtpreis',
    CHARGE: 'Zuschlag',
    ALLOWANCE: 'Nachlass',
    ALLOWANCES_CHARGES: 'Nachlässe / Zuschläge',
    PRODUCT: 'Produkt',

    LINE_NOTES: 'Zeilenkommentare',
    PRODUCT_DESCRIPTION: 'Produktbeschreibung',
    PRODUCT_CHARACTERISTICS: 'Produkteigenschaften',
    PRODUCT_CLASSIFICATION: 'Produktklassifikationen',
    PRODUCT_ORIGIN: 'Produktherkunft',
    PRODUCT_IDENTIFICATION: 'Produktidentifikation',
    GLOBAL_ID: 'Global ID',
    BUYER_PRODUCT_ID: 'Käufer Produkt ID',
    ACCOUNTING_INFORMATION: 'Buchungsreferenz',
    REFERENCED_DOCUMENTS: 'Referenzierte Dokumente',
    BILLING_PERIOD: 'Abrechnungszeitraum',

    NET_TOTAL_AMOUNT: 'Gesamtbetrag Netto',
    GROSS_TOTAL_AMOUNT: 'Gesamtbetrag Brutto',
    TAX_TOTAL_AMOUNT: 'Gesamtbetrag Steuer',
    SUM: 'Summe',
    DOCUMENT_LEVEL_ALLOWANCE: 'Nachlass auf Dokumentenebene',
    DOCUMENT_LEVEL_CHARGE: 'Zuschlag auf Dokumentenebene',
    PREPAID_AMOUNT: 'Vorausbezahlter Betrag',
    OPEN_AMOUNT: 'Offener Betrag',
    LINE_TOTAL_AMOUNT: 'Summe der Positionen',
    ROUNDING_AMOUNT: 'Rundungsbetrag',
    VAT: 'Umsatzssteuer',
    VAT_ID: 'USt-IdNr.',
    TAX_ID: 'Steuernr:',

    VAT_EXMPTION_REASON: 'Grund für Umsatzsteuerbefreiung',
    ALREADY_PAID: 'Diese Rechnung wurde bereits beglichen'
};

const translations_fr: typeof translations_en = {
    ATTN: "À l'attention de",
    PHONE: 'Téléphone',
    EMAIL: 'E-mail',

    INVOICE_ID: 'Numéro de facture',
    INVOICE_DATE: 'Date de la facture',
    ORDER_ID: 'Numéro de commande',
    CONTRACT_ID: 'Numéro de contrat',
    DELIVERY_DATE: 'Date de livraison',
    ADVANCE_SHIPPING_NOTICE: 'Avis d’expédition',
    PAYMENT_DUE_DATE: 'Date d’échéance',
    CUSTOMER_ID: 'Numéro client',

    LINE_ITEM_SHORT: 'Art.',
    LINE_ITEM_LONG: 'Article',
    QUANTITY: 'Quantité',
    UNIT_PRICE: 'Prix unitaire',
    TAX: 'Taxe',
    TOTAL_PRICE_PER_ITEM: 'Prix total',
    CHARGE: 'Supplément',
    ALLOWANCE: 'Réduction',
    ALLOWANCES_CHARGES: 'Réductions / Suppléments',
    PRODUCT: 'Produit',

    LINE_NOTES: 'Commentaires de ligne',
    PRODUCT_DESCRIPTION: 'Description du produit',
    PRODUCT_CHARACTERISTICS: 'Caractéristiques du produit',
    PRODUCT_CLASSIFICATION: 'Classification du produit',
    PRODUCT_ORIGIN: 'Origine du produit',
    PRODUCT_IDENTIFICATION: 'Identification du produit',
    GLOBAL_ID: 'ID global',
    BUYER_PRODUCT_ID: 'ID produit acheteur',
    ACCOUNTING_INFORMATION: 'Informations comptables',
    REFERENCED_DOCUMENTS: 'Documents référencés',
    BILLING_PERIOD: 'Période de facturation',

    NET_TOTAL_AMOUNT: 'Montant total net',
    GROSS_TOTAL_AMOUNT: 'Montant total brut',
    TAX_TOTAL_AMOUNT: 'Montant total de la taxe',
    SUM: 'Total',
    DOCUMENT_LEVEL_ALLOWANCE: 'Réduction au niveau du document',
    DOCUMENT_LEVEL_CHARGE: 'Supplément au niveau du document',
    PREPAID_AMOUNT: 'Montant prépayé',
    OPEN_AMOUNT: 'Montant ouvert',
    LINE_TOTAL_AMOUNT: 'Montant total de la ligne',
    ROUNDING_AMOUNT: "Montant de l'arrondi",
    VAT: 'Taxe sur la valeur ajoutée',
    VAT_ID: 'Numéro de TVA',
    TAX_ID: 'Numéro fiscal',

    VAT_EXMPTION_REASON: 'Raison de l’exemption de TVA',
    ALREADY_PAID: 'Cette facture a déjà été réglée'
};

export type TranslationKeys = `${keyof typeof translations_en}`;

const translations: TranslatedTexts<`${keyof typeof translations_en}`> = {
    'en-US': translations_en,
    'de-DE': translations_de,
    'fr-FR': translations_fr
};

export default Object.freeze(translations);
