import { z } from 'zod';

import { ArrayConverter } from '../../../ArrayConverter';
import { CodeTypeConverter } from '../../../CodeTypeConverter';
import { ExtendableBaseTypeConverter } from '../../../ExtendableBaseTypeConverter';
import { COUNTRY_ID_CODES, ISO6523_CODES } from '../../../codes';
import { IdTypeConverter } from '../../../udt/IdTypeConverter';
import { IdTypeWithRequiredSchemeConverter } from '../../../udt/IdTypeWithRequiredlSchemeConverter';
import { TextTypeConverter } from '../../../udt/TextTypeConverter';
import {
    ApplicableProductCharacteristicTypeConverter,
    allowedValueTypes_ApplicableProductCharacteristic,
    allowedXmlTypes_ApplicableProductCharacteristic
} from './ApplicableProuctCharacteristic/ApplicableProductCharacteristicConverter';
import {
    BasicTradeProductType,
    BasicTradeProductTypeXml,
    ZBasicTradeProductType,
    ZBasicTradeProductTypeXml
} from './BasicTradeProduct';
import {
    ComfortTradeProductType,
    ComfortTradeProductTypeXml,
    ZComfortTradeProductType,
    ZComfortTradeProductTypeXml
} from './ComfortTradeProduct';
import {
    DesignatedProductClassificationConverter,
    allowedValueTypes_DesignatedProductClassification,
    allowedXmlTypes_DesignatedProductClassification
} from './DesignatedProductClassification/DesignatedProductClassificationConverter';

export type allowedValueTypes_TradeProduct = BasicTradeProductType | ComfortTradeProductType;
export type allowedXmlTypes_TradeProduct = BasicTradeProductTypeXml | ComfortTradeProductTypeXml;

export class TradeProductTypeConverter<
    ValueType extends allowedValueTypes_TradeProduct,
    XmlType extends allowedXmlTypes_TradeProduct
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    globalIdConverter = new IdTypeWithRequiredSchemeConverter(ISO6523_CODES);
    textTypeConverter = new TextTypeConverter();
    idTypeConverter = new IdTypeConverter();
    codeTypeConverter = new CodeTypeConverter(COUNTRY_ID_CODES);

    productCharacteristicConverter:
        | ApplicableProductCharacteristicTypeConverter<
              allowedValueTypes_ApplicableProductCharacteristic,
              allowedXmlTypes_ApplicableProductCharacteristic
          >
        | undefined;
    productClassificationConverter:
        | DesignatedProductClassificationConverter<
              allowedValueTypes_DesignatedProductClassification,
              allowedXmlTypes_DesignatedProductClassification
          >
        | undefined;

    constructor(
        tradeProductType: z.ZodType<ValueType>,
        tradeProductTypeXml: z.ZodType<XmlType>,
        productCharacteristicConverter?: ApplicableProductCharacteristicTypeConverter<
            allowedValueTypes_ApplicableProductCharacteristic,
            allowedXmlTypes_ApplicableProductCharacteristic
        >,
        productClassificationConverter?: DesignatedProductClassificationConverter<
            allowedValueTypes_DesignatedProductClassification,
            allowedXmlTypes_DesignatedProductClassification
        >
    ) {
        super(tradeProductType, tradeProductTypeXml);
        this.productCharacteristicConverter = productCharacteristicConverter;
        this.productClassificationConverter = productClassificationConverter;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        return {
            globalId: xml['ram:GlobalID'] ? this.globalIdConverter.toValue(xml['ram:GlobalID']) : undefined,
            sellerProductId: xml['ram:SellerAssignedID']
                ? this.idTypeConverter.toValue(xml['ram:SellerAssignedID'])
                : undefined,
            buyerProductId: xml['ram:BuyerAssignedID']
                ? this.idTypeConverter.toValue(xml['ram:BuyerAssignedID'])
                : undefined,
            name: xml['ram:Name'] != null ? this.textTypeConverter.toValue(xml['ram:Name']) : undefined,
            description:
                xml['ram:Description'] != null ? this.textTypeConverter.toValue(xml['ram:Description']) : undefined,
            productCharacteristic:
                xml['ram:ApplicableProductCharacteristic'] != null && this.productCharacteristicConverter
                    ? new ArrayConverter(this.productCharacteristicConverter).toValue(
                          xml['ram:ApplicableProductCharacteristic']
                      )
                    : undefined,
            productClassification:
                xml['ram:DesignatedProductClassification'] != null && this.productClassificationConverter
                    ? new ArrayConverter(this.productClassificationConverter).toValue(
                          xml['ram:DesignatedProductClassification']
                      )
                    : undefined,
            originTradeCountry:
                xml['ram:OriginTradeCountry']?.['ram:ID'] != null
                    ? this.codeTypeConverter.toValue(xml['ram:OriginTradeCountry']['ram:ID'])
                    : undefined
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        return {
            'ram:GlobalID': value.globalId ? this.globalIdConverter.toXML(value.globalId) : undefined,
            'ram:SellerAssignedID': value.sellerProductId
                ? this.idTypeConverter.toXML(value.sellerProductId)
                : undefined,
            'ram:BuyerAssignedID': value.buyerProductId ? this.idTypeConverter.toXML(value.buyerProductId) : undefined,
            'ram:Name': value.name != null ? this.textTypeConverter.toXML(value.name) : undefined,
            'ram:Description': value.description != null ? this.textTypeConverter.toXML(value.description) : undefined,
            'ram:ApplicableProductCharacteristic':
                value.productCharacteristic && this.productCharacteristicConverter
                    ? new ArrayConverter(this.productCharacteristicConverter).toXML(value.productCharacteristic)
                    : undefined,
            'ram:DesignatedProductClassification':
                value.productClassification && this.productClassificationConverter
                    ? new ArrayConverter(this.productClassificationConverter).toXML(value.productClassification)
                    : undefined,
            'ram:OriginTradeCountry': value.originTradeCountry
                ? { 'ram:ID': this.codeTypeConverter.toXML(value.originTradeCountry) }
                : undefined
        };
    }

    public static basic(): TradeProductTypeConverter<BasicTradeProductType, BasicTradeProductTypeXml> {
        return new TradeProductTypeConverter(ZBasicTradeProductType, ZBasicTradeProductTypeXml);
    }

    public static comfort(): TradeProductTypeConverter<ComfortTradeProductType, ComfortTradeProductTypeXml> {
        return new TradeProductTypeConverter(
            ZComfortTradeProductType,
            ZComfortTradeProductTypeXml,
            ApplicableProductCharacteristicTypeConverter.comfort(),
            DesignatedProductClassificationConverter.comfort()
        );
    }
}
