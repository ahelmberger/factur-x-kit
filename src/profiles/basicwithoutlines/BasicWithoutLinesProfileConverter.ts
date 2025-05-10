import { Converter } from '../convert'
import { type BasicWithoutLinesProfile, ZBasicWithoutLinesProfile } from './BasicWithoutLinesProfile'
import { type BasicWithoutLinesProfileXml, ZBasicWithoutLinesProfileXml } from './BasicWithoutLinesProfileXml'
import mapping from './mapping'

export class BasicWithoutLinesProfileConverter extends Converter<
    BasicWithoutLinesProfile,
    BasicWithoutLinesProfileXml
> {
    map = mapping
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected isProperObjectScheme(object: any): object is BasicWithoutLinesProfile {
        const result = ZBasicWithoutLinesProfile.safeParse(object)

        if (!result.success) {
            console.log(result.error.errors)
        }
        return result.success
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected isProperXMLScheme(xmlObject: any): xmlObject is BasicWithoutLinesProfileXml {
        const result = ZBasicWithoutLinesProfileXml.safeParse(xmlObject)

        if (!result.success) {
            console.log(result.error.errors)
        }
        return result.success
    }
}
