import { Converter } from '../convert'
import {
    type BasicWithoutLinesProfile,
    isBasicWithoutLinesProfile,
    isValidBasicWithoutLinesProfile
} from './BasicWithoutLinesProfile'
import { type BasicWithoutLinesProfileXml, isBasicWithoutLinesProfileXml } from './BasicWithoutLinesProfileXml'
import mapping from './mapping'

export class BasicWithoutLinesProfileConverter extends Converter<
    BasicWithoutLinesProfile,
    BasicWithoutLinesProfileXml
> {
    map = mapping

    protected isProperObjectScheme = isBasicWithoutLinesProfile

    protected isProperXMLScheme = isBasicWithoutLinesProfileXml

    public validateProfile = isValidBasicWithoutLinesProfile
}
