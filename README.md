# factur-x-kit

[![NPM version](https://img.shields.io/npm/v/factur-x.svg?style=flat-square)](https://www.npmjs.org/package/factur-x-kit)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/NikolaiMe/factur-x-kit)

The all-in-one library for Hybrid Invoice Documents (Factur-X / ZUGFeRD) in Javascript/Typescript. Made from developers for developers. You don't need to be e-invoice expert to use it, therefore you also find some helpful information about some ZUGFeRD/Factur-X basics in this documentation.

You can use this library to:

-   Create hybrid invoices (PDF/A-3 and XML contents) from the same data-set
-   Convert a "normal" PDF-invoice to PDF/A-3 format and attach XML content to it
-   Parse the data from a hybrid invoice
-   Validate the contents of a hybrid invoice
-   Edit the XML content of a hybrid invoice (e.g. to switch to higher profile)

If you want, this library also supports you in creating invoice data by calculating the totals, line totals, taxes and creating the tax-breakdown just from the invoice-line prices.

> **Attention!** <br>This library is still under development. Therefore not every feature is available, yet. Right now the "Extended" and "XRechnung" Profile is not supported, yet. Also it is not yet possible to attach any other data, except from the Factur-X XML to your invoice. This documentation represents the current implementation state (everything described here is already supported)

## Showcase

[This](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/pdfs/createdPDFs/PDF_DESIGN_EN.pdf) is how the created e-invoice looks like (of course you can change the header)

[This](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_easy.ts) is the data used to create this Factur-X invoice / the data you would get if you parse the e-invoice given above.

[This](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_easy_preCalc.ts) is the data you pass to the library in case you want the library to auto-calculate the invoice sums, taxes and to auto fill some stuff for you.

## General idea

You build an object based on a typescript type. You pass that object to the library and you get a factur-x/ZUGFeRD invoice back.

Or you pass a hybrid invoice to the library and you get a object of the same typescript type as above back.

## General information about Factur-X/ZUGFeRD hybrid invoices

If you are familiar with the Factur-X/ZUGFeRD standard you can skip this chapter. If not this chapter might help you understand the rest of this documentation better.

**Standardization and Interoperability:** Factur-X and ZUGFeRD are essentially the same standard, developed collaboratively by France and Germany to ensure interoperability. They are based on the European standard EN 16931 and the UN/CEFACT Cross Industry Invoice (CII) XML schema, which facilitates cross-border and cross-industry e-invoicing. For better readability the rest of this documentation will only use the term "Factur-X" (instead of Factur-X/ZUGFeRD)

**Accessibility for All Businesses:** The standard is designed to be accessible not only to large corporations but also to small and medium-sized enterprises (SMEs) and freelancers, without the need for prior arrangements between the sender and receiver.

**Hybrid Format:** Invoices consist of two parts: a human-readable PDF file (specifically, a PDF/A-3 file) and a machine-readable XML file embedded within the PDF. This allows for both manual and automated processing of invoices.

**Multiple Profiles:** The standard offers different profiles (such as MINIMUM, BASIC, EN 16931 (aka COMFORT), and EXTENDED) that allow the sender to include varying levels of detail in the structured data, catering to the recipient's needs and processing capabilities. In Germany only the Profiles BASIC, COMFORT and EXTENDED are considered as proper e-invoices.

## Usage

### Installation

```bash
npm install factur-x-kit
```

### Create the data for the invoice

To use this library you need to bring your invoice data into a form, the library understands. This can be approached by either creating the data yourself or to use an adapter which supports you creating the data.

#### Create the data all by yourself

As this library is written in typescript there are datatypes for every Factur-X Profile. These datatypes already support you to create the data by making fields, which are not optional in Factur-X standard mandatory. Optional fields in Factur-X are also optional in the datatypes. Important note: only because a field is optional, it does not mean that it can be left out always. There are some business-rules which every Factur-X invoice needs to comply to. This library also checks these business rules and throws helpful errors in case your data does not comply to those rules.

If you want to create the data you can import the profile you want to use from this library:

```typescript
import { MinimumProfile, BasicWithoutLinesProfile, BasicProfile, ComfortProfile, ExtendedProfile, PROFILES } from 'factur-x-kit';

const myData: BasicProfile ={
    profile: PROFILES.BASIC,
    ...
};
```

If you need help to understand which data to match to which key you can use [this table](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/DataDescription_v2.md), which describes the data for each key (as this library does not support extended, yet this table also only describes the keys for comfort and lower profiles).

For an easier overview which profile supports which keys you can check out the typescript type definitions of every profile:

-   [Minimum](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/minimum_datatype.ts)
-   [Basic Without Lines](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/basicWL_datatype.ts)
-   [Basic](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/basic_datatype.ts)
-   [Comfort](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/comfort_datatype.ts)
-   Extended right now uses the exact same type as comfort (Do not use!)
-   X-Rechnung not yet implemented

> **Attention!** <br>Minimum and Basic Without Lines Profiles are not considered proper e-invoices in Germany and also won't be accepted by France in the near future anymore. It's highly recommended to use at least the Basic profile. Recommended is Comfort (EN 16931)

All the custom enums used in the profiles like `CURRENCY_CODES` or `COUNTRY_ID_CODES` are exported by the library:

```typescript
// Usage of the custom enums
import {
  COUNTRY_ID_CODES,
  CURRENCY_CODES,
  PROFILES,
  BasicProfile
} from "factur-x-kit";

const myData: BasicProfile ={
    profile: PROFILES.BASIC,
    document: {
        id: 'INV-2023-EASY-001',
        type: DOCUMENT_TYPE_CODES.COMMERCIAL_INVOICE,
        ...
    }
    ...
};
```

Example data:

-   [Standard invoice (Comfort Profile)](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_easy.ts)
-   [Standard invoice with more fields used (Comfort Profile)](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object.ts)
-   [Simple invoice for German 'Kleinunternehmer' Exempt from tax (Comfort Profile)](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_kleinunternehmer.ts)
-   [Basic Without Lines Profile invoice](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/profiles/basicwithoutlines_test_objects.ts)
-   [Basic Profile invoice (based on BasicWL invoice above)](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/profiles/basicwithoutlines_test_objects.ts)

#### Create the data with the help of adapters

Adapters are here to support you with creating the data. Basically they are just functions which take an object of a specific datatype and return a proper profile object. Right now there is only one adapter available.

_**totalsCalculator adapter**_

A Factur-X invoice has a lot of values which must be properly calculated from other values (e.g. Totals, tax sums and tax breakdown). Also there are a lot of mandatory values which must be filled with a constant value. This can be pretty overwhelming and confusing, if you are not very familiar to e-invoices. The `totalsCalculator` function uses as input an [object which does leave out unnecessary values](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/totalsCalculatorType.ts) which can be calculated by other values. It calculates all those values for you and returns a proper object for the Comfort (EN 16931) profile.

Some information about the changes against Comfort profile:

-   `totals.taxExemptionReason` was added. If you use `TAX_CATEGORY_CODES.EXEMPT_FROM_TAX` in any of your lines (e.g. if you are German "Kleinunternehmer") this field is mandatory and should contain the reason why your tax rate is 0. If you use any other tax category from `TaxTypeWithoutTaxRate` it is highly recommended to use this field, but it's not mandatory (TaxExemptionReasonCodes will be used as backup)
-   `totals.optionalTaxDueDates` is usually not used, because the taxDueDate is usually the same as the invoice date. If you need this field for some reason you can add the due dates for the given tax category here.
-   `totals.optionalTaxCurrency` is usually also not used, as the tax currency is the same as the invoice currency. If you need it you can enter the currency and the exchange rate between invoice currency and tax currency here and `totalsCalculator` will add the tax amount also in that other currency.

Usage:

```typescript
import { TotalsCalculatorInputType, totalsCalculator } from 'factur-x-kit';

const myInvoiceData: TotalsCalculatorInputType = {
        document: {
            id: 'INV-2023-EASY-001',
            type: DOCUMENT_TYPE_CODES.COMMERCIAL_INVOICE,
            dateOfIssue: { year: 2023, month: 10, day: 1 },
            ...
        }
    ...
}

const myInvoiceDataInComfortProfile = totalsCalculator(myInvoiceData);
```

> **Attention!**<br>
> Factur-X is known for its rounding issues: Every `lineTotals` amount of your invoice will be rounded to two decimals, although your `basisPricePerItem` and your `itemQuantity` can have up to 4 decimals. If you have several lines which will be rounded, it could end up in a slightly wrong total amount (E.g. two lines with an actual value of 0.375 € will be rounded to 0.38 + 0.38 = 0.76 although the "correct" amount would be 0.375 + 0.375 = 0.75).<br>
> Therefore always check the `grossTotal` of the output of `totalsCalculator` in case it does not match the grossTotal you would expect (minimal rounding differences only!), use the `totals.roundingAmount` value to fix this<br>
>
> ```typescript
> // example check
> ...
> let myInvoiceDataInComfortProfile = totalsCalculator(myInvoiceData);
> const diff = expectedGrossTotal - myInvoiceDataInComfortProfile.totals.grossTotal;
> if(diff !== 0){
>   if(Math.abs(diff) > 0.05) throw new Error('Something went wrong in calculation');
>   myInvoiceData.totals.roundingAmount = diff;
>   myInvoiceDataInComfortProfile = totalsCalculator(myInvoiceData);
> }
> ...
> ```

### Create Invoices

After you prepared your data you are ready to go to build your Factur-X invoice. This library offers you several different ways to achieve that goal.

#### Create a complete hybrid invoice (PDF and XML) from object

The easiest way to create a Factur-X invoice is to let factur-x-kit create everything for you. factur-x-kit comes with an invoice template that creates an appealing PDF-invoice and automatically attaches the e-invoice XML to it. The PDFs created with factur-x-kit meet the PDF/A-3 standard.

Currently supported languages in the pdf-invoice are:

| Language | locale | state                           |
| -------- | ------ | ------------------------------- |
| German   | de-DE  | translated and checked by human |
| English  | de-US  | translated and checked by human |
| French   | fr-FR  | translated by AI not checked    |

_If you want to support this library feel free to add your langauage by editing [these files (including sub-folders)](https://github.com/NikolaiMe/factur-x-kit/tree/main/src/pdfTemplates/texts) and opening a PR._

```typescript
// Create a complete factur-x invoice
import { FacturX } from 'factur-x-kit';
import fs from 'node:fs/promises';
import path from 'node:path';

// Use whatever approach described above to create data
const myInvoiceData = ... ;

// Create a FacturX instance that data
const facturX = await FacturX.fromObject(myInvoiceData);

// Create a PDF
const pdfBytesDE = await facturX.getPDF({
    locale: 'en-US'
});

// Store the PDF
await fs.writeFile(path.join(__dirname, 'pdfs', 'myInvoice.pdf'), pdfBytesDE);
```

> **Attention!** <br>
> The Factur-X Standard expects you to display all the data which is in the XML part of the invoice, also in the human-readable PDF part. Not every key of Comfort Profile is supported by the PDF-template, yet. Please check [this table](https://github.com/NikolaiMe/factur-x-kit/blob/main/docs/DataDescription_v2.md) that all the keys you are using are supported.

_**Header Image**_

You can add a header image to give the invoice a personal touch. You can add .jpg or .png files as header image. The header image will be placed in the upper right corner and will be printed in the background. You can use the `dinA4Width` and `mmToPt` constants exported by factur-x-kit to strech the image to the full PDF width (see example below).

```typescript
const imageWidthInPx = 1200; // add real image width in px here
const imageHeightInPx = 500; // add real image height in px here
const pathToImage = path.join(__dirname, 'assets', 'header.jpg'); // add real path to image file her

const headerImage = {
    path: pathToImage,
    dimensions: {
        width: dinA4Width * mmToPt,
        height: ((dinA4Width * mmToPt) / imageWidthInPx) * imageHeightInPx
    }
};

const facturX = await FacturX.fromObject(myInvoiceData);
const pdfBytesDE = await facturX.getPDF({
    locale: 'en-US',
    headerImage: headerImage
});
await fs.writeFile(path.join(__dirname, 'pdfs', 'myInvoice.pdf'), pdfBytesDE);
```

#### Create a complete hybrid invoice (PDF and XML) with a custom template

In case you do not like the template provided by factur-x-kit you can also create your own template. The library exports all the invoice text blocks (like the address field, the item table...), so you can re-use the parts you would like to keep. Then just add your template to the `FacturX.getPDF()` options:

```typescript
import { FacturX } from 'factur-x-kit';
import fs from 'node:fs/promises';
import path from 'node:path';

// Use whatever approach described above to create data
const myInvoiceData = ... ;

// Create a FacturX instance that data
const facturX = await FacturX.fromObject(myInvoiceData);

// Get the PDF and pass your own template
const pdfBytesDE = await facturX.getPDF({
    pdfTemplate: myTemplate, // Add Your template here
    locale: 'en-US',
    headerImage: headerImage
});
```

A template is just a function with the following typing:

```typescript
type FacturXKitPDFTemplate = (
    data: availableProfiles,
    pdfDoc: PDFDocument,
    locale: SupportedLocales,
    headerImage?: {
        path: string;
        dimensions: ImageDimensions;
    }
) => Promise<PDFDocument>;
```

This documentation won't go into detail of custom templates. If you would like to use this feature, please check the implementation of the [current standard template](https://github.com/NikolaiMe/factur-x-kit/blob/main/src/pdfTemplates/facturXKitSinglePage.ts). If you have more questions feel free to open an issue in the GitHub Repository.

_Short hint for using the invoice text blocks exported by this library: They usually return the y-Position of the bottom edge, so that you know to which height you want to add the next block below._

#### Use a "normal" pdf-invoice and convert it into a hybrid-invoice

If you already have a PDF invoice and just want to convert it to a Factur-X Hybrid invoice you can do this with this library, too. It also edits your invoice PDF to meet the PDF-A/3 standard (Please read the info box at the bottom of this chapter to make sure that the PDF you are assing can be converted to a proper PDF-A/3)

```typescript
// Create a complete factur-x invoice
import { FacturX } from 'factur-x-kit';
import fs from 'node:fs/promises';
import path from 'node:path';

// Use whatever approach described above to create data
const myInvoiceData = ... ;

// Create a FacturX instance that data
const facturX = await FacturX.fromObject(myInvoiceData);

// Read the data of your existing invoice PDF
const pdfBuff = new Uint8Array(fs.readFileSync(path.join(__dirname, 'PathToYourPDF', `non_compliant_pdf.pdf`)));

// Create a PDF
const pdfBytesDE = await facturX.getPDF({
    existingNonConformantPdf: pdfBuff
});

// Store the PDF
await fs.writeFile(path.join(__dirname, 'pdfs', 'myInvoice.pdf'), pdfBytesDE);
```

> **Attention!**<br>You can only use this feature, if your PDF invoice does not use any PDF function which is not conformant to PDF/A-3. Therefore your PDF must not have any audio or video file embedded. Also every font you are using must be embedded. You cannot use the 14 PDF standard fonts.

#### Replace XML in an existing Fctur-X invoice

In case you already have a valid Factur-X invoice and want to edit the XML data attached to it, Factur-X can help you, too. To use this feature you first need to [parse an existing Factur-X invoice](#read-the-data-from-a-hybrid-invoice)

> **Attention!**<br>Invoices must not be changed in the aftermath! Only use this feature right after creation (e.g. if you already created a Factur-X invoice with a different tool, but the tool you are using is only supporting BASIC profile and you want to increase it to COMFORT). In case you want to correct an existing invoice leave the original invoice untouched and create a new correction invoice with `document.type` set to `DOCUMENT_TYPE_CODES.CORRECTED_INVOICE`.

### Parse/Interpret Invoices

#### Read the data from a hybrid invoice pdf

#### Read the data from the XML of a hybrid invoice

### Validate Invoices

```js
const pdf = await fs.readFile('./e-invoice.pdf');
const doc = await FacturX.fromPDF(pdf);
```

### FacturX.fromXML

```js
const xml = await fs.readFile('./invoice-data.xml', 'utf-8');
const doc = await FacturX.fromXML(xml);
```

### FacturX.getPDF

```js
const normalInvoice = await fs.readFile('./normal-invoice.pdf');
const hybridInvoice = await doc.getPDF(normalInvoice);

await fs.writeFile('./hybrid-invoice.pdf', hybridInvoice);
```

### FacturX.getXML

```js
const xml = await doc.getXML();
console.log(xml); // "<?xml version="1.0" encoding="UTF-8" ...

await fs.writeFile('./invoice-data.xml', xml);
```

### FacturX.getObject

```js
const obj = await FacturX.getObject();
console.log(obj); // { document: { id: "471102" }, seller: { name: "Lieferant GmbH", ...

await fs.writeFile('./invoice-data.json', JSON.stringify(obj, null, 4));
```

## Disclaimer

This free software has been written with the greatest possible care, but like all software it may contain errors. Use at your own risk! There is no warranty and no liability.

## Dependencies

-   pdf-lib
-   zod
-   fast-xml-parser
-   object-path

## Special Thanks

... to [Joachim](https://github.com/schwarmco) for starting this journey with me.

## Next steps

-   [ ] XRechnung Profile
-   [ ] Extended Profile
-   [ ] Attachment of Referenced Documents
-   [ ] Upgrade to zod 4
    -   [ ] Switch BR function from zod.refine to zod.check
    -   [ ] Add proper paths to BR-Errors (including correct array item)
