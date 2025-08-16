import { addCustomerAddressBlock } from './invoiceBlocks/customerAddressBlock';
import { addFooter } from './invoiceBlocks/footerBlock';
import { addHeaderImage } from './invoiceBlocks/headerImage';
import { addIntroTextBlock } from './invoiceBlocks/introTextBlock';
import { addItemTable } from './invoiceBlocks/itemTable/itemTable';
import { addMetaBlock } from './invoiceBlocks/metaDataBlock';
import { addMonetarySummary } from './invoiceBlocks/monetarySummary';
import { addOutroTextBlock } from './invoiceBlocks/outroTextBlock';
import { addSenderLineBlock } from './invoiceBlocks/senderLineBlock';
import { addTitleBlock } from './invoiceBlocks/titleBlock';

export {
    addCustomerAddressBlock,
    addFooter,
    addHeaderImage,
    addIntroTextBlock,
    addItemTable,
    addMetaBlock,
    addMonetarySummary,
    addOutroTextBlock,
    addSenderLineBlock,
    addTitleBlock
};

export const pdfBlocks = {
    addCustomerAddressBlock,
    addFooter,
    addHeaderImage,
    addIntroTextBlock,
    addItemTable,
    addMetaBlock,
    addMonetarySummary,
    addOutroTextBlock,
    addSenderLineBlock,
    addTitleBlock
};

export * from './invoiceBlocks/helpers';

export * from './invoiceBlocks/itemTable/table';
