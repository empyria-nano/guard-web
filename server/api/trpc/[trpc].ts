import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from '../../trpc/context'
import { appRouter } from '../../routers'

export default defineEventHandler(async (event) => {
	// console.log('✅ Test route hit!')

	const request = toWebRequest(event)

	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req: request,
		router: appRouter,
		createContext: () => createContext(event),
	})
})
