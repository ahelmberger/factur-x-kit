import { Converter } from '../convert'
import { type BasicProfile, isBasicProfile, isValidBasicProfile } from './BasicProfile'
import { type BasicProfileXml, isBasicProfileXml } from './BasicProfileXml'
import mapping from './mapping'

export class BasicProfileConverter extends Converter<BasicProfile, BasicProfileXml> {
    map = mapping

    protected isProperObjectScheme = isBasicProfile

    protected isProperXMLScheme = isBasicProfileXml

    public validateProfile = isValidBasicProfile
}
