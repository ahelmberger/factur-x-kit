import { Converter } from '../convert.js'
import { type ComfortProfile, ZComfortProfile } from './ComfortProfile.js'
import { type ComfortProfileXml, ZComfortProfileXml } from './ComfortProfileXml.js'
import mapping from './mapping.js'

export class ComfortProfileConverter extends Converter<ComfortProfile, ComfortProfileXml> {
    map = mapping
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected isProperObjectScheme(object: any): object is ComfortProfile {
        const result = ZComfortProfile.safeParse(object)

        if (!result.success) {
            console.log(result.error.errors)
        }
        return result.success
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected isProperXMLScheme(xmlObject: any): xmlObject is ComfortProfileXml {
        const result = ZComfortProfileXml.safeParse(xmlObject)

        if (!result.success) {
            console.dir(xmlObject, { depth: null })
            console.dir(result.error.errors, { depth: null })
        }
        return result.success
    }
}
