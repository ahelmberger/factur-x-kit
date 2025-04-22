import { z } from 'zod'

import { ZExtendedTradeContactType, ZExtendedTradeContactTypeXml } from './ExtendedTradeContactType'

export const ZComfortTradeContactType = ZExtendedTradeContactType.pick({
    personName: true,
    departmentName: true,
    telephoneNumber: true,
    email: true
})

export type ComfortTradeContactType = z.infer<typeof ZComfortTradeContactType>

export const ZComfortTradeContactTypeXml = ZExtendedTradeContactTypeXml.pick({
    'ram:PersonName': true,
    'ram:DepartmentName': true,
    'ram:TelephoneUniversalCommunication': true,
    'ram:EmailURIUniversalCommunication': true
})
export type ComfortTradeContactTypeXml = z.infer<typeof ZComfortTradeContactTypeXml>
