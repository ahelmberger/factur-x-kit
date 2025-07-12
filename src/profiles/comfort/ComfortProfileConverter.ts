import { Converter } from '../convert'
import { type ComfortProfile, isComfortProfile, isValidComfortProfile } from './ComfortProfile'
import { type ComfortProfileXml, isComfortProfileXml } from './ComfortProfileXml'
import mapping from './mapping'

export class ComfortProfileConverter extends Converter<ComfortProfile, ComfortProfileXml> {
    map = mapping

    protected isProperObjectScheme = isComfortProfile
    protected isProperXMLScheme = isComfortProfileXml
    public validateProfile = isValidComfortProfile
}
