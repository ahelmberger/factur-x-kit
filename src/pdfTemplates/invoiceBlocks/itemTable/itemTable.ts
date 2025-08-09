import { PDFFont, PDFPage, RGB } from 'pdf-lib'

import { availableProfiles } from '../../../core/factur-x'
import { round } from '../../../helper/calculation'
import { ComfortTradeLineItem } from '../../../types/ram/IncludedSupplyChainTradeLineItem/ComfortTradeLineItem'
import attachedDocumentTypes from '../../texts/codeTranslations/attachedDocumentTypes'
import iso6523 from '../../texts/codeTranslations/iso6523'
import unitSymbols from '../../texts/codeTranslations/unitSymbols'
import untdid7143 from '../../texts/codeTranslations/untdid7143'
import { formatCustomDate } from '../../texts/formatCustomDate'
import textTranslations from '../../texts/textTranslations'
import { SupportedLocales, dinA4Height, mmToPt } from '../../types'
import { convertAllowancesAndChargesToString } from '../helpers'
import drawTable, { TableInformation, TableSchemeType } from './table'

export default async function addItemTable(
    data: availableProfiles,
    page: PDFPage,
    font: PDFFont,
    boldFont: PDFFont,
    locale: SupportedLocales,
    options?: {
        position?: { x?: number; y?: number }
        fontSize?: number
        color?: RGB
    }
): Promise<[number, TableInformation | undefined]> {
    const yPosition = options?.position?.y || (dinA4Height - 85) * mmToPt
    const xPosition = options?.position?.x || 25 * mmToPt
    const currencyConverter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: data.document.currency
    })

    const currencyConverterPricePerUnit = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: data.document.currency,
        minimumFractionDigits: 2, // Mindestens 2 Nachkommastellen anzeigen
        maximumFractionDigits: 4 // Maximal 4 Nachkommastellen anzeigen (rundet, wenn mehr)
    })

    const createCountryName = new Intl.DisplayNames([locale], { type: 'region', style: 'long', fallback: 'code' })

    if (!('invoiceLines' in data)) return [yPosition, undefined]
    const tableScheme: TableSchemeType<ComfortTradeLineItem>[] = [
        {
            colAlignment: 'left',
            colHeader: `${textTranslations[locale].LINE_ITEM_SHORT}`,
            colWeight: 0.5,
            colContent: (lineItem: ComfortTradeLineItem) => `${lineItem.generalLineData.lineId}`
        },
        {
            colAlignment: 'left',
            colHeader: `${textTranslations[locale].PRODUCT}`,
            colWeight: 3,
            colContent: (lineItem: ComfortTradeLineItem) => {
                const productName = lineItem.productDescription.name
                const priceBaseQuantity = lineItem.productPriceAgreement.productNetPricing.priceBaseQuantity

                let baseQuantityText = ''
                if (priceBaseQuantity) {
                    baseQuantityText = ` (${new Intl.NumberFormat(locale, { style: 'decimal', maximumFractionDigits: 4 }).format(round(priceBaseQuantity.quantity, 4))} ${priceBaseQuantity.unit ? unitSymbols[locale][priceBaseQuantity.unit] : ''})`
                }

                const productId = lineItem.productDescription.sellerProductId
                    ? `${lineItem.productDescription.sellerProductId} - `
                    : ''

                return `${productId}${productName}${baseQuantityText}`
            }
        },
        {
            colAlignment: 'right',
            colHeader: `${textTranslations[locale].QUANTITY}`,
            colWeight: 1.5,
            colContent: (lineItem: ComfortTradeLineItem) =>
                `${new Intl.NumberFormat(locale, { style: 'decimal', maximumFractionDigits: 4 }).format(round(lineItem.delivery.itemQuantity.quantity, 4))} ${lineItem.delivery.itemQuantity.unit ? unitSymbols[locale][lineItem.delivery.itemQuantity.unit] : ''}`
        },
        {
            colAlignment: 'right',
            colHeader: `${textTranslations[locale].UNIT_PRICE}`,
            colWeight: 1.5,
            colContent: (lineItem: ComfortTradeLineItem) =>
                `${checkAndAddPriceAllowance(lineItem, locale, currencyConverterPricePerUnit)}${currencyConverterPricePerUnit.format(round(lineItem.productPriceAgreement.productNetPricing.netPricePerItem, 4))}`
        },
        {
            colAlignment: 'right',
            colHeader: `${textTranslations[locale].TOTAL_PRICE_PER_ITEM}`,
            colWeight: 1.5,
            colContent: (lineItem: ComfortTradeLineItem) =>
                `${currencyConverter.format(round(lineItem.settlement.lineTotals.netTotal, 2))}`
        }
    ]

    checkAndAddTax(data, tableScheme, locale)
    checkAndAddAllowancesAndCharges(data, tableScheme, locale, currencyConverter)

    const lineComments = [
        {
            heading: `${textTranslations[locale].PRODUCT_DESCRIPTION}`,
            content: (lineItem: ComfortTradeLineItem) => lineItem.productDescription.description || ''
        },
        {
            heading: `${textTranslations[locale].PRODUCT_CHARACTERISTICS}`,
            content: (lineItem: ComfortTradeLineItem) => {
                if (!lineItem.productDescription.productCharacteristic) return ''
                return lineItem.productDescription.productCharacteristic.reduce<string>(
                    (acc, characteristic, index) => {
                        return `${acc}${characteristic.characteristic}: ${characteristic.value}${index < lineItem.productDescription.productCharacteristic!.length - 1 ? '; ' : ''}`
                    },
                    ''
                )
            }
        },
        {
            heading: `${textTranslations[locale].PRODUCT_CLASSIFICATION}`,
            content: (lineItem: ComfortTradeLineItem) => {
                if (!lineItem.productDescription.productClassification) return ''
                return lineItem.productDescription.productClassification.reduce<string>(
                    (acc, classification, index) => {
                        if (!classification.productClass?.code) return acc
                        return `${acc}${untdid7143[locale][classification.productClass.codeScheme]}: ${classification.productClass.code}${index < lineItem.productDescription.productClassification!.length - 1 ? '; ' : ''}`
                    },
                    ''
                )
            }
        },
        {
            heading: `${textTranslations[locale].PRODUCT_ORIGIN}`,
            content: (lineItem: ComfortTradeLineItem) =>
                `${lineItem.productDescription.originTradeCountry ? createCountryName.of(lineItem.productDescription.originTradeCountry) : ''}`
        },
        {
            heading: `${textTranslations[locale].PRODUCT_IDENTIFICATION}`,
            content: (lineItem: ComfortTradeLineItem) => {
                const globalId = lineItem.productDescription.globalId?.id || ''
                const globalIdScheme = lineItem.productDescription.globalId?.scheme
                const buyerProductId = lineItem.productDescription.buyerProductId || ''

                const globalIdText = globalId
                    ? globalIdScheme
                        ? `${iso6523[globalIdScheme]}: ${globalId}`
                        : `${textTranslations[locale].GLOBAL_ID}: ${globalId}`
                    : ''
                const buyerProductIdText = buyerProductId
                    ? `${textTranslations[locale].BUYER_PRODUCT_ID}: ${buyerProductId}`
                    : ''
                return `${globalIdText}${globalIdText && buyerProductIdText ? '\n' : ''}${buyerProductIdText}`
            }
        },
        {
            heading: `${textTranslations[locale].BILLING_PERIOD}`,
            content: (lineItem: ComfortTradeLineItem) => {
                const billingPeriod = lineItem.settlement.billingPeriod
                if (!billingPeriod) return ''
                const startDate = billingPeriod.startDate ? formatCustomDate(billingPeriod.startDate, locale) : ''
                const endDate = billingPeriod.endDate ? formatCustomDate(billingPeriod.endDate, locale) : ''
                return `${startDate}${startDate && endDate ? ' - ' : ''}${endDate}`
            }
        },
        {
            heading: `${textTranslations[locale].ACCOUNTING_INFORMATION}`,
            content: (lineItem: ComfortTradeLineItem) => lineItem.settlement.accountingInformation?.id || ''
        },
        {
            heading: `${textTranslations[locale].REFERENCED_DOCUMENTS}`,
            content: (lineItem: ComfortTradeLineItem) => {
                if (!lineItem.settlement.additionalReferences) return ''
                return lineItem.settlement.additionalReferences.reduce<string>((acc, doc, index) => {
                    return `${acc}${doc.referenceTypeCode ? `${attachedDocumentTypes[locale][doc.referenceTypeCode]}: ` : ''}${doc.documentId}${
                        index < lineItem.settlement.additionalReferences!.length - 1 ? '; ' : ''
                    }`
                }, '')
            }
        },
        {
            heading: `${textTranslations[locale].LINE_NOTES}`,
            content: (lineItem: ComfortTradeLineItem) => `${lineItem.generalLineData.lineNote?.content || ''}`
        }
    ]

    const tableInformation = await drawTable(
        page,
        data.invoiceLines,
        tableScheme,
        xPosition,
        yPosition,
        font,
        boldFont,
        {
            commentScheme: lineComments
        }
    )
    return tableInformation
}

function checkAndAddAllowancesAndCharges(
    data: availableProfiles,
    tableScheme: TableSchemeType<ComfortTradeLineItem>[],
    locale: SupportedLocales,
    currencyConverter: Intl.NumberFormat
) {
    if (!('invoiceLines' in data)) return
    for (const line of data.invoiceLines) {
        if (
            line.settlement.lineLevelAllowancesAndCharges?.charges?.length ||
            line.settlement.lineLevelAllowancesAndCharges?.allowances?.length
        ) {
            tableScheme.splice(4, 0, {
                colAlignment: 'right',
                colHeader: `${textTranslations[locale].ALLOWANCES_CHARGES}`,
                colWeight: 2,
                colContent: (lineItem: ComfortTradeLineItem) =>
                    `${convertAllowancesAndChargesToString(lineItem.settlement.lineLevelAllowancesAndCharges, currencyConverter, locale, false, true)}`
            })
            break
        }
    }
}

function checkAndAddTax(
    data: availableProfiles,
    tableScheme: TableSchemeType<ComfortTradeLineItem>[],
    locale: SupportedLocales
) {
    if (!('invoiceLines' in data)) return
    for (const line of data.invoiceLines) {
        if (line.settlement.tax.rateApplicablePercent) {
            tableScheme.splice(4, 0, {
                colAlignment: 'right',
                colHeader: `${textTranslations[locale].TAX}`,
                colWeight: 1,
                colContent: (lineItem: ComfortTradeLineItem) =>
                    `${lineItem.settlement.tax.rateApplicablePercent ? new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 4 }).format(round(lineItem.settlement.tax.rateApplicablePercent / 100, 4)) : '--'}`
            })
            break
        }
    }
}

function checkAndAddPriceAllowance(
    lineItem: ComfortTradeLineItem,
    locale: SupportedLocales,
    currencyConverter: Intl.NumberFormat
): string {
    if (!lineItem.productPriceAgreement.productPricing?.priceAllowancesAndCharges?.allowances) return ''
    if (lineItem.productPriceAgreement.productPricing.priceAllowancesAndCharges.allowances.length < 1) return ''
    return `${currencyConverter.format(round(lineItem.productPriceAgreement.productPricing.basisPricePerItem, 4))}${convertAllowancesAndChargesToString(lineItem.productPriceAgreement.productPricing?.priceAllowancesAndCharges, currencyConverter, locale, true, undefined, 4)}\n= `
}
