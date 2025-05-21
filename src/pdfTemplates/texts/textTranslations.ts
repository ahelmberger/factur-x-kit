import { TranslatedTexts } from './types'

export const translations_en = {
    ATTN: 'ATTN',
    PHONE: 'Phone',
    EMAIL: 'Email',

    INVOICE_ID: 'Invoice Number',
    INVOICE_DATE: 'Invoice Date',
    ORDER_ID: 'Order Number',
    DELIVERY_DATE: 'Delivery Date'
}

const translations_de: typeof translations_en = {
    ATTN: 'z.Hd.',
    PHONE: 'Telefon',
    EMAIL: 'E-Mail',

    INVOICE_ID: 'Rechnungsnummer',
    INVOICE_DATE: 'Rechnungsdatum',
    ORDER_ID: 'Bestellnummer',
    DELIVERY_DATE: 'Lieferdatum'
}

const translations_fr: typeof translations_en = {
    ATTN: "À l'attention de",
    PHONE: 'Téléphone',
    EMAIL: 'E-mail',

    INVOICE_ID: 'Numéro de facture',
    INVOICE_DATE: 'Date de la facture',
    ORDER_ID: 'Numéro de commande',
    DELIVERY_DATE: 'Date de livraison'
}

const translations: TranslatedTexts<`${keyof typeof translations_en}`> = {
    'en-US': translations_en,
    'de-DE': translations_de,
    'fr-FR': translations_fr
}

export default Object.freeze(translations)
