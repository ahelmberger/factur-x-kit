type TranslationObject<key extends string> = Record<key, string>

export interface TranslatedTexts<translationKeys extends string> {
    'en-US': TranslationObject<translationKeys>
    'de-DE': TranslationObject<translationKeys>
    'fr-FR': TranslationObject<translationKeys>
}
