import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { defineEventHandler } from 'nuxt/server'
import { createContext } from '../../trpc/context'
import { appRouter } from '../../routers'

// The request is already a web `Request` (`event.req`): tRPC's fetch adapter takes it as it is.
export default defineEventHandler(async (event) => {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req: event.req,
		router: appRouter,
		createContext: () => createContext(event),
	})
})
