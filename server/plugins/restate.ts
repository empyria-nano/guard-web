// server/plugins/restate.ts
import { checkServiceHandler, clients, sendMessage } from '@empyria/restate'
import { getCookie } from 'h3'
import { AccessTokenCookieKey } from '../../app/consts'

import { settings } from '../env'

export default defineNitroPlugin(() => {
	const restateURL = settings.restate.url
	const restateAdminURL = settings.restate.adminURL

	const restateClient = clients.connect({ url: restateURL })

	globalThis.restate = {
		client: restateClient,
		adminURL: restateAdminURL,
		discoverService: (serviceName: string, handlerName?: string) =>
			checkServiceHandler(restateAdminURL, serviceName, handlerName),

		async call<T>(serviceName: string, handlerName: string, params?: any): Promise<T> {
			await checkServiceHandler(restateAdminURL, serviceName, handlerName)

			const event = useEvent()
			const tokenKey = event?.context?.tokenKey || getCookie(event, AccessTokenCookieKey)

			const paramsWithToken = tokenKey ? { ...params, tokenKey } : params

			return sendMessage({
				restateURL,
				name: serviceName,
				message: handlerName,
				payload: paramsWithToken,
			})
		},
	}

	console.log('✅ Restate client initialized')
})
