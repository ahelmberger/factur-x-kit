export const invoiceReferenceTranslations = {
    'en-US': (id: string, date: string) => `This document refers to invoice ${id}${date ? ` dated ${date}` : ''}`,
    'de-DE': (id: string, date: string) =>
        `Dieses Dokument bezieht sich auf die Rechnung ${id}${date ? ` vom ${date}` : ''}`,
    'fr-FR': (id: string, date: string) => `Ce document fait référence à la facture ${id}${date ? ` du ${date}` : ''}`
};
