import { Converter } from '../convert'
import { type ExtendedProfile, isExtendedProfile, isValidExtendedProfile } from './ExtendedProfile'
import { type ExtendedProfileXml, isExtendedProfileXml } from './ExtendedProfileXml'
import mapping from './mapping'

export class ExtendedProfileConverter extends Converter<ExtendedProfile, ExtendedProfileXml> {
    map = mapping

    protected isProperObjectScheme = isExtendedProfile
    protected isProperXMLScheme = isExtendedProfileXml
    public validateProfile = isValidExtendedProfile
}
