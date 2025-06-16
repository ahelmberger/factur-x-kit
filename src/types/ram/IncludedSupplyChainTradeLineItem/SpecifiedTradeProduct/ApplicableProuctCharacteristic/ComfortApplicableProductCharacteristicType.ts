import { z } from 'zod'

import { ZTextType, ZTextTypeXml } from '../../../../udt/TextTypeConverter'

export const ZComfortApplicableProductCharacteristicType = z.object({
    characteristic: ZTextType.describe('BT-160'),
    value: ZTextType.describe('BT-161')
})

export type ComfortApplicableProductCharacteristicType = z.infer<typeof ZComfortApplicableProductCharacteristicType>

export const ZComfortApplicableProductCharacteristicTypeXml = z.object({
    'ram:Description': ZTextTypeXml,
    'ram:Value': ZTextTypeXml
})

export type ComfortApplicableProductCharacteristicTypeXml = z.infer<
    typeof ZComfortApplicableProductCharacteristicTypeXml
>
