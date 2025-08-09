export const alreadyPaidText = {
    'en-US': (paymentMean: string) =>
        'This invoice has already been paid' + (paymentMean ? ` via ${paymentMean}` : '') + '.',
    'de-DE': (paymentMean: string) =>
        `Diese Rechnung wurde bereits${paymentMean ? ` via ${paymentMean}` : ''} beglichen.`,
    'fr-FR': (paymentMean: string) =>
        `Cette facture a déjà été réglée` + (paymentMean ? ` par ${paymentMean}` : '') + '.'
};
