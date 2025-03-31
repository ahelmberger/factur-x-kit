import { Converter } from '../convert.js'
import { type BasicProfile, ZBasicProfile } from './BasicProfile.js'
import { type BasicProfileXml, ZBasicProfileXml } from './BasicProfileXml.js'
import mapping from './mapping.js'

export class BasicProfileConverter extends Converter<BasicProfile, BasicProfileXml> {
    map = mapping
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected isProperObjectScheme(object: any): object is BasicProfile {
        const result = ZBasicProfile.safeParse(object)

        if (!result.success) {
            console.log(result.error.errors)
        }
        return result.success
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected isProperXMLScheme(xmlObject: any): xmlObject is BasicProfileXml {
        const result = ZBasicProfileXml.safeParse(xmlObject)

        if (!result.success) {
            console.log(result.error.errors)
        }
        return result.success
    }
}
