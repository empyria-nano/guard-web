import { type CookieSerializeOptions } from 'cookie-es'
import {
	type H3Event,
	parseCookies,
	getCookie as getCookieFromEvent,
	setCookie as setCookieOnEvent,
	deleteCookie as deleteCookieOnEvent,
} from 'h3'
import { AccessTokenCookieKey } from '../../app/consts'

export const createContext = async (event: H3Event) => {
	const getCookie = (name: string) => getCookieFromEvent(event, name)
	const setCookie = (name: string, value: string, serializeOptions?: CookieSerializeOptions) =>
		setCookieOnEvent(event, name, value, serializeOptions)
	const deleteCookie = (name: string, serializeOptions?: CookieSerializeOptions) =>
		deleteCookieOnEvent(event, name, serializeOptions)

	const tokenKey = getCookie(AccessTokenCookieKey)
	if (tokenKey) {
		event.context.tokenKey = tokenKey
	}

	return {
		event,
		cookies: parseCookies(event),
		getCookie,
		setCookie,
		deleteCookie,
		headers: event.headers,
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
