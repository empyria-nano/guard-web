import { type CookieSerializeOptions } from 'cookie-es'
import {
	type RequestEvent,
	parseCookies,
	getCookie as getCookieFromEvent,
	setCookie as setCookieOnEvent,
	deleteCookie as deleteCookieOnEvent,
} from 'nuxt/server'
import { AccessTokenCookieKey } from '../../app/consts'

export const createContext = async (event: RequestEvent) => {
	const getCookie = (name: string) => getCookieFromEvent(event, name)
	const setCookie = (name: string, value: string, serializeOptions?: CookieSerializeOptions) =>
		setCookieOnEvent(event, name, value, serializeOptions)
	const deleteCookie = (name: string, serializeOptions?: CookieSerializeOptions) =>
		deleteCookieOnEvent(event, name, serializeOptions)

	// Kept on the event's context, which every shape of the event shares, for code that runs later in the same request
	// (server/plugins/restate.ts reads it to pass the token on to Restate).
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
		headers: event.req.headers,
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
