import { TranslatedTexts } from './types'

const translations_en = {
    ATTN: 'ATTN',
    PHONE: 'Phone',
    EMAIL: 'Email'
}

const translations_de: typeof translations_en = {
    ATTN: 'z.Hd.',
    PHONE: 'Telefon',
    EMAIL: 'E-Mail'
}

const translations_fr: typeof translations_en = {
    ATTN: "À l'attention de",
    PHONE: 'Téléphone',
    EMAIL: 'E-mail'
}

const translations: TranslatedTexts<`${keyof typeof translations_en}`> = {
    'en-US': translations_en,
    'de-DE': translations_de,
    'fr-FR': translations_fr
}

export default Object.freeze(translations)
