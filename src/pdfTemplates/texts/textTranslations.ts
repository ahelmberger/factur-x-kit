import { TranslatedTexts } from './types'

export const translations_en = {
    ATTN: 'ATTN',
    PHONE: 'Phone',
    EMAIL: 'Email',

    INVOICE_ID: 'Invoice Number',
    INVOICE_DATE: 'Invoice Date',
    ORDER_ID: 'Order Number',
    DELIVERY_DATE: 'Delivery Date',

    LINE_ITEM_SHORT: 'Item',
    LINE_ITEM_LONG: 'Line Item',
    QUANTITY: 'Quantity',
    UNIT_PRICE: 'Unit Price',
    TAX: 'Tax',
    TOTAL_PRICE_PER_ITEM: 'Total Price',
    TOTAL_AMOUNT_NET: 'Net Total Amount',
    TOTAL_AMOUNT_GROSS: 'Gross Total Amount',
    VALUE_ADDED_TAX: 'Value Added Tax',
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
    BILLING_PERIOD: 'Billing Period'
}

const translations_de: typeof translations_en = {
    ATTN: 'z.Hd.',
    PHONE: 'Telefon',
    EMAIL: 'E-Mail',

    INVOICE_ID: 'Rechnungsnummer',
    INVOICE_DATE: 'Rechnungsdatum',
    ORDER_ID: 'Bestellnummer',
    DELIVERY_DATE: 'Lieferdatum',

    LINE_ITEM_SHORT: 'Pos.',
    LINE_ITEM_LONG: 'Rechnungsposition',
    QUANTITY: 'Menge',
    UNIT_PRICE: 'Einzelpreis',
    TAX: 'Steuer',
    TOTAL_PRICE_PER_ITEM: 'Gesamtpreis',
    TOTAL_AMOUNT_NET: 'Gesamtbetrag Netto',
    TOTAL_AMOUNT_GROSS: 'Gesamtbetrag Brutto',
    VALUE_ADDED_TAX: 'Umsatzsteuer',
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
    BILLING_PERIOD: 'Abrechnungszeitraum'
}

const translations_fr: typeof translations_en = {
    ATTN: "À l'attention de",
    PHONE: 'Téléphone',
    EMAIL: 'E-mail',

    INVOICE_ID: 'Numéro de facture',
    INVOICE_DATE: 'Date de la facture',
    ORDER_ID: 'Numéro de commande',
    DELIVERY_DATE: 'Date de livraison',

    LINE_ITEM_SHORT: 'Art.',
    LINE_ITEM_LONG: 'Article',
    QUANTITY: 'Quantité',
    UNIT_PRICE: 'Prix unitaire',
    TAX: 'Taxe',
    TOTAL_PRICE_PER_ITEM: 'Prix total',
    TOTAL_AMOUNT_NET: 'Montant total net',
    TOTAL_AMOUNT_GROSS: 'Montant total brut',
    VALUE_ADDED_TAX: 'Taxe sur la valeur ajoutée',
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
    BILLING_PERIOD: 'Période de facturation'
}

const translations: TranslatedTexts<`${keyof typeof translations_en}`> = {
    'en-US': translations_en,
    'de-DE': translations_de,
    'fr-FR': translations_fr
}

export default Object.freeze(translations)
