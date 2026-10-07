import { createTRPCProxyClient, httpBatchStreamLink, httpLink, splitLink } from '@trpc/client'
import type { AppRouter } from '~/server/trpc/router'

export default defineNuxtPlugin(() => {
	const isLoading = ref(false)
	const toast = useToast()

	let activeRequests = 0

	const getBaseUrl = () => {
		if (import.meta.server) {
			return process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000'
		}
		return ''
	}

	const client = createTRPCProxyClient<AppRouter>({
		links: [
			splitLink({
				condition: (op) => op.path.includes('login') || op.path.includes('auth'),
				true: httpLink({
					url: `${getBaseUrl()}/api/trpc`,
					fetch(url, options) {
						return fetch(url, { ...options, credentials: 'include' })
					},
				}),
				false: httpBatchStreamLink({
					url: `${getBaseUrl()}/api/trpc`,
					fetch(url, options) {
						activeRequests++
						isLoading.value = true
						return fetch(url, {
							...options,
							credentials: 'include',
						})
							.then((response) => {
								if (response.status >= 500) {
									toast.add({
										title: 'Server Error',
										description: 'Something went wrong. Please try again.',
										icon: 'i-lucide-server-crash',
										color: 'error',
									})
								}
								return response
							})
							.catch((error) => {
								toast.add({
									title: 'Connection Error',
									description: 'Unable to reach the server.',
									icon: 'i-lucide-server-off',
									color: 'error',
								})
								throw error
							})
							.finally(() => {
								activeRequests--
								if (activeRequests === 0) {
									isLoading.value = false
								}
							})
					},
				}),
			}),
		],
	})

	return {
		provide: {
			client,
			trpcLoading: readonly(isLoading),
		},
	}
})
