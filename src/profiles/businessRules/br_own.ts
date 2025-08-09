import { availableProfiles } from '../../core/factur-x';
import { BusinessRuleWithError } from './br_co';

// BR-OWN: Own Business Rules for Factur-X based on rules which are given in the Factur-X documentation but not covered by the Business Rules

const TOLERANCE = 0.0051;

export function BR_OWN_1(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true;
    if (!val.invoiceLines) return true;

    let ruleResult = true;
    for (const line of val.invoiceLines) {
        if (!line.productPriceAgreement.productPricing) continue;
        if (
            !('priceAllowancesAndCharges' in line.productPriceAgreement.productPricing) ||
            !line.productPriceAgreement.productPricing.priceAllowancesAndCharges?.allowances ||
            line.productPriceAgreement.productPricing.priceAllowancesAndCharges.allowances.length < 1
        ) {
            if (
                line.productPriceAgreement.productNetPricing.netPricePerItem !==
                line.productPriceAgreement.productPricing.basisPricePerItem
            ) {
                ruleResult = false;
                //printError(`Business Rule BR-OWN-1 is being violated in invoiceLine ${line.generalLineData.lineId}`)
            }
            continue;
        }

        let allowanceSum = 0;

        for (const allowance of line.productPriceAgreement.productPricing.priceAllowancesAndCharges.allowances) {
            allowanceSum = allowanceSum + allowance.actualAmount;
        }

        if (
            line.productPriceAgreement.productNetPricing.netPricePerItem !==
            line.productPriceAgreement.productPricing.basisPricePerItem - allowanceSum
        ) {
            ruleResult = false;
            //printError(`Business Rule BR-OWN-1 is being violated in invoiceLine ${line.generalLineData.lineId}`)
        }
    }

    return ruleResult;
}

export const BR_OWN_1_ERROR = {
    message:
        '[BR-OWN-1] The netPricePerItem (BT-146) must be equal to the basisPricePerItem (BT-148) minus the sum of all priceAllowances (BT-147) in each invoiceLine (BG-25)',
    path: ['invoiceLines', 'productPriceAgreement', 'itemQuantity', 'productPricing', 'priceBaseQuantity']
};

export function BR_OWN_2(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true;
    if (!val.invoiceLines) return true;
    if (val.invoiceLines.length === 0) return true;

    let ruleResult = true;

    for (const line of val.invoiceLines) {
        if (!line.productPriceAgreement.productNetPricing.priceBaseQuantity) continue;
        const priceBaseQuantityUnit = line.productPriceAgreement.productNetPricing.priceBaseQuantity.unit;
        const quantityUnit = line.delivery.itemQuantity.unit;
        if (!(priceBaseQuantityUnit === quantityUnit)) {
            ruleResult = false;
            //printError(`Business Rule BR-OWN-2 is being violated in invoiceLine ${line.generalLineData.lineId}`)
        }
    }

    return ruleResult;
}

export const BR_OWN_2_ERROR = {
    message:
        '[BR-OWN-2] The unit of measure of the item price base quantity (BT-150) must be the same as the unit of measure of the invoiced quantity (BT-130) in each invoiceLine.',
    path: ['invoiceLines', 'productPriceAgreement', 'productNetPricing', 'priceBaseQuantity', 'unit']
};

export function BR_OWN_3(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true;
    if (!val.invoiceLines) return true;
    if (val.invoiceLines.length === 0) return true;

    let ruleResult = true;

    for (const line of val.invoiceLines) {
        if (!line.productPriceAgreement.productPricing?.priceBaseQuantity) continue;
        const netPriceBaseQuantityUnit = line.productPriceAgreement.productNetPricing.priceBaseQuantity?.unit;
        const netPriceBaseQuantityAmount = line.productPriceAgreement.productNetPricing.priceBaseQuantity?.quantity;

        const basisPriceBaseQuantityUnit = line.productPriceAgreement.productPricing.priceBaseQuantity.unit;
        const basisPriceBaseQuantityAmount = line.productPriceAgreement.productPricing.priceBaseQuantity.quantity;
        if (
            !(netPriceBaseQuantityUnit === basisPriceBaseQuantityUnit) ||
            !(netPriceBaseQuantityAmount === basisPriceBaseQuantityAmount)
        ) {
            ruleResult = false;
            //printError(`Business Rule BR-OWN-3 is being violated in invoiceLine ${line.generalLineData.lineId}`)
        }
    }

    return ruleResult;
}

export const BR_OWN_3_ERROR = {
    message:
        '[BR-OWN-3] If an item price base quantity is specified for the Gross Price, then both its quantity (BT-149-1) and its unit of measure (BT-150-1) must be identical to the item price base quantity (BT-149 and BT-150) of the Net Item Price in each invoiceLine.',
    path: ['invoiceLines', 'productPriceAgreement', 'itemQuantity', 'productPricing', 'priceBaseQuantity']
};

export function BR_OWN_4(val: availableProfiles): boolean {
    if (!('invoiceLines' in val)) return true;
    if (!val.invoiceLines) return true;
    if (val.invoiceLines.length === 0) return true;

    let ruleResult = true;

    for (const line of val.invoiceLines) {
        const netPriceBaseQuantityAmount =
            line.productPriceAgreement.productNetPricing.priceBaseQuantity?.quantity || 1;
        const itemQuantity = line.delivery.itemQuantity.quantity;
        const netPricePerItem = line.productPriceAgreement.productNetPricing.netPricePerItem;
        let allowanceSum = 0;
        if (line.settlement.lineLevelAllowancesAndCharges?.allowances) {
            allowanceSum = line.settlement.lineLevelAllowancesAndCharges.allowances.reduce(
                (sum, allowance) => sum + allowance.actualAmount,
                0
            );
        }

        let chargeSum = 0;

        if (line.settlement.lineLevelAllowancesAndCharges?.charges) {
            chargeSum = line.settlement.lineLevelAllowancesAndCharges.charges.reduce(
                (sum, charge) => sum + charge.actualAmount,
                0
            );
        }

        const calculatedLineNetSum =
            netPricePerItem * (itemQuantity / netPriceBaseQuantityAmount) - allowanceSum + chargeSum;

        if (Math.abs(calculatedLineNetSum - line.settlement.lineTotals.netTotal) > TOLERANCE) {
            ruleResult = false;
            //printError(`Business Rule BR-OWN-4 is being violated in invoiceLine ${line.generalLineData.lineId}`)
        }
    }

    return ruleResult;
}

export const BR_OWN_4_ERROR = {
    message:
        '[BR-OWN-4] The netTotal (BT-131) of each line must be the netPricePerItem (BT-146) multiplied with the itemQuantity (BT-129) divided by the priceBaseQuantity (BT-149, if available. Default for priceBaseQuantity is 1). Minus the sum of all lineLevelAllowances (BT-136) plus the sum of all lineLevelCharges (BT-141).',
    path: ['invoiceLines', 'settlement', 'lineTotals', 'netTotal']
};

export const BR_OWN: BusinessRuleWithError[] = [
    { rule: BR_OWN_1, error: BR_OWN_1_ERROR },
    { rule: BR_OWN_2, error: BR_OWN_2_ERROR },
    { rule: BR_OWN_3, error: BR_OWN_3_ERROR },
    { rule: BR_OWN_4, error: BR_OWN_4_ERROR }
];
