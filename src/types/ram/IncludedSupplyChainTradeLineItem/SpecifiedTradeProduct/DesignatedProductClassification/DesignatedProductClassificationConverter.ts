import { ExtendableBaseTypeConverter } from '../../../../ExtendableBaseTypeConverter';
import {
    ComfortDesignatedProductClassificationType,
    ComfortDesignatedProductClassificationTypeXml,
    ZComfortDesignatedProductClassificationType,
    ZComfortDesignatedProductClassificationTypeXml
} from './ComfortDesignatedProductClassificationType';

export type allowedValueTypes_DesignatedProductClassification = ComfortDesignatedProductClassificationType;
export type allowedXmlTypes_DesignatedProductClassification = ComfortDesignatedProductClassificationTypeXml;

export class DesignatedProductClassificationConverter<
    ValueType extends allowedValueTypes_DesignatedProductClassification,
    XmlType extends allowedXmlTypes_DesignatedProductClassification
> extends ExtendableBaseTypeConverter<ValueType, XmlType> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapXmlToValue(xml: any) {
        const xmlProductClass = xml['ram:ClassCode'];
        return {
            productClass:
                xmlProductClass != null
                    ? {
                          code: xmlProductClass['#text'] != null ? xmlProductClass['#text'] : undefined,
                          codeScheme: xmlProductClass['@listID'] != null ? xmlProductClass['@listID'] : undefined,
                          codeSchemeVersion:
                              xmlProductClass['@listVersionID'] != null ? xmlProductClass['@listVersionID'] : undefined
                      }
                    : undefined
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapValueToXml(value: any) {
        const classCode =
            value.productClass == null
                ? undefined
                : {
                      '#text': value.productClass?.code != null ? value.productClass.code : undefined,
                      '@listID': value.productClass?.codeScheme != null ? value.productClass.codeScheme : undefined,
                      '@listVersionID':
                          value.productClass?.codeSchemeVersion != null
                              ? value.productClass.codeSchemeVersion
                              : undefined
                  };
        return {
            'ram:ClassCode': classCode
        };
    }

    public static comfort(): DesignatedProductClassificationConverter<
        ComfortDesignatedProductClassificationType,
        ComfortDesignatedProductClassificationTypeXml
    > {
        return new DesignatedProductClassificationConverter(
            ZComfortDesignatedProductClassificationType,
            ZComfortDesignatedProductClassificationTypeXml
        );
    }
}
