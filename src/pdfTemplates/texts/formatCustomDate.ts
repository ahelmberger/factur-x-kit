import { DateTimeType } from '../../types/udt/DateTimeTypeConverter'

export function formatCustomDate(customDate: DateTimeType, locale: string, short?: boolean): string {
    const jsMonthIndex = customDate.month - 1
    const jsDate = new Date(Date.UTC(customDate.year, jsMonthIndex, customDate.day))
    const options: Intl.DateTimeFormatOptions = {
        year: short ? '2-digit' : 'numeric',
        month: short ? '2-digit' : 'long',
        day: short ? '2-digit' : 'numeric',
        timeZone: 'UTC'
    }
    const formatter = new Intl.DateTimeFormat(locale, options)
    return formatter.format(jsDate)
}
