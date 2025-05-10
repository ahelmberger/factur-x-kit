/* eslint-disable @typescript-eslint/no-explicit-any */
import { Converter } from '../convert'
import { type MinimumProfile, ZMinimumProfile } from './MinimumProfile'
import { type MinimumProfileXml, ZMinimumProfileXml } from './MinimumProfileXml'
import mapping from './mapping'

export class MinimumProfileConverter extends Converter<MinimumProfile, MinimumProfileXml> {
    map = mapping

    protected isProperObjectScheme(object: any): object is MinimumProfile {
        const result = ZMinimumProfile.safeParse(object)

        if (!result.success) {
            console.log(result.error.errors)
        }
        return result.success
    }

    protected isProperXMLScheme(xmlObject: any): xmlObject is MinimumProfileXml {
        const result = ZMinimumProfileXml.safeParse(xmlObject)

        if (!result.success) {
            console.log(result.error.errors)
        }
        return result.success
    }
}
