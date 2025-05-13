type TranslationObject<key extends string> = Record<key, string>

export interface TranslatedTexts<translationKeys extends string> {
    en: TranslationObject<translationKeys>
    de: TranslationObject<translationKeys>
    fr: TranslationObject<translationKeys>
}
