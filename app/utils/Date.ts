import { DateTime } from 'luxon'

const DATE_FORMAT = 'yyyy-LL-dd'

export const DISPLAY_DATE = 'dd / LLL / yyyy'
export const DISPLAY_TIME = 'dd / LLL / yyyy HH:mm'

export function dateToMillis(format: string) {
	return DateTime.fromFormat(format, DATE_FORMAT).toMillis()
}
export function dateStartToMillis(format: string) {
	return DateTime.fromFormat(format, DATE_FORMAT).startOf('day').toMillis()
}
export function dateEndToMillis(format: string) {
	return DateTime.fromFormat(format, DATE_FORMAT).endOf('day').toMillis()
}
export function dateToFormat(millis?: number, format?: string) {
	if (!millis) return undefined
	return DateTime.fromMillis(millis).toFormat(format || DATE_FORMAT)
}

export function timeToFormat(millis?: number, format?: string) {
	if (!millis) return undefined
	return DateTime.fromMillis(millis).toFormat(format || DISPLAY_TIME)
}

export function isoToFormat(isoDate?: string, format?: string) {
	return DateTime.fromISO(isoDate).toFormat(format || DATE_FORMAT)
}

export function nowISO() {
	return DateTime.now().toISO()
}
