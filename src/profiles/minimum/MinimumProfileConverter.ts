import { Converter } from '../convert'
import { type MinimumProfile, isMinimumProfile, isValidMinimumProfile } from './MinimumProfile'
import { type MinimumProfileXml, isMinimumProfileXml } from './MinimumProfileXml'
import mapping from './mapping'

export class MinimumProfileConverter extends Converter<MinimumProfile, MinimumProfileXml> {
    map = mapping

    protected isProperObjectScheme = isMinimumProfile

    protected isProperXMLScheme = isMinimumProfileXml

    public validateProfile = isValidMinimumProfile
}
