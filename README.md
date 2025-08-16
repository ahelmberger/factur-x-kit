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

> This library is still under development. Therefore not every feature is available yet. Right now the "Extended" and "XRechnung" Profile is not supported, yet. Also it is not yet possible to attach any other data, except from the Factur-X XML to your invoice.

## Showcase

[This](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/pdfs/createdPDFs/PDF_DESIGN_EN.pdf) is how the created e-invoice looks like (of course you can change the header)

[This](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_easy.ts) is the data used to create this Factur-X invoice / the data you would get if you parse the e-invoice given above.

[This](https://github.com/NikolaiMe/factur-x-kit/blob/main/test/design_test_object_easy_preCalc.ts) is the data you pass to the library in case you want the library to auto-calculate the invoice sums, taxes and to auto fill some stuff for you.

## General idea

You build an object based on a typescript type. You pass that object to the library and you get a factur-x/ZUGFeRD invoice back.

Or you pass a hybrid invoice to the library and you get a object of the same typescript type as above back.

## Usage

### Installation

```bash
npm install factur-x-kit
```

### Create the data for the invoice

To use this library you need to bring your invoice data into a form, the library understands. The library offers you for every

#### Create the data all by yourself

#### Create the data with the helper function

### Create Invoices

#### Create a complete hybrid invoice (PDF and XML) from object

#### Use a "normal" pdf-invoice and convert it into a hybrid-invoice

#### Replace XML in an existing factur-x invoice

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

## General information about Factur-X/ZUGFeRD hybrid invoices

**Standardization and Interoperability:** Factur-X and ZUGFeRD are essentially the same standard, developed collaboratively by France and Germany to ensure interoperability. They are based on the European standard EN 16931 and the UN/CEFACT Cross Industry Invoice (CII) XML schema, which facilitates cross-border and cross-industry e-invoicing.

**Accessibility for All Businesses:** The standard is designed to be accessible not only to large corporations but also to small and medium-sized enterprises (SMEs) and freelancers, without the need for prior arrangements between the sender and receiver.

**Hybrid Format:** Invoices consist of two parts: a human-readable PDF file (specifically, a PDF/A-3 file) and a machine-readable XML file embedded within the PDF. This allows for both manual and automated processing of invoices.

**Multiple Profiles:** The standard offers different profiles (such as MINIMUM, BASIC, EN 16931 (aka COMFORT), and EXTENDED) that allow the sender to include varying levels of detail in the structured data, catering to the recipient's needs and processing capabilities. In Germany only the Profiles BASIC, COMFORT and EXTENDED are considered as proper e-invoices.

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
