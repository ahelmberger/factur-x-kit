import { z } from 'zod'

import { ZTextType, ZTextTypeXml } from '../../../../udt/TextTypeConverter'

export const ZComfortApplicableProductCharacteristicType = z.object({
    characteristic: ZTextType,
    value: ZTextType
})

export type ComfortApplicableProductCharacteristicType = z.infer<typeof ZComfortApplicableProductCharacteristicType>

export const ZComfortApplicableProductCharacteristicTypeXml = z.object({
    'ram:Description': ZTextTypeXml,
    'ram:Value': ZTextTypeXml
})

export type ComfortApplicableProductCharacteristicTypeXml = z.infer<
    typeof ZComfortApplicableProductCharacteristicTypeXml
>
