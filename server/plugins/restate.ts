// server/plugins/restate.ts
import { checkServiceHandler, clients, sendMessage } from '@empyria/restate'

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

			// server/trpc/context.ts puts the login cookie's token on the request's context.
			const tokenKey = useEvent()?.context?.tokenKey

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
