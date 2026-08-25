import type { ServiceBroker as MoleculerBroker } from 'moleculer'
import { randomUUID as uuid } from 'node:crypto'
import { connect } from '@empyria/moleculer/Connector.js'
import { getCookie } from 'h3'

import { AccessTokenCookieKey } from '../../app/consts'

import { settings } from '../env'

import {
	BaseErrors,
	EMPYRIA_FEDERATION_ID,
	MOLECULER_SERVICE_ROLE,
	moleculerMeta,
} from '@empyria/common'

const whitelistedActions = [
	'v1.Auth.registerPasskeyBegin',
	'v1.Auth.registerPasskeyFinish',
	'v1.Auth.loginPasskeyBegin',
	'v1.Auth.loginPasskeyFinish',
]

const NUXT_NAME = 'Nuxt Gateway'
const NUXT_META = moleculerMeta({
	actor: NUXT_NAME,
	federation: EMPYRIA_FEDERATION_ID,
	flowID: uuid(),
	processID: uuid(),
	role: MOLECULER_SERVICE_ROLE,
	tokenKey: `${NUXT_NAME}`,
})

declare global {
	var moleculer: {
		broker: MoleculerBroker
		call<T>(
			actionName: string,
			params?: any,
			opts?: { timeout?: number; meta?: Record<string, any> },
		): Promise<T>
		emit(eventName: string, payload?: any, groups?: string | string[]): Promise<void>
		broadcast(eventName: string, payload?: any, groups?: string | string[]): Promise<void>
	}
}

export default defineNitroPlugin(async () => {
	const transporterURL = settings.moleculer.transporterURL
	const namespace = settings.moleculer.namespace
	const nodeID = `UI-${uuid()}`
	const servicesRequired = settings.moleculer.servicesRequired
	const waitTimeout = settings.moleculer.waitTimeout

	let connector: Awaited<ReturnType<typeof connect>> | undefined

	try {
		// Wait for required services to be available (only in production)
		connector = await connect({
			namespace,
			nodeID,
			transporter: transporterURL,
			logLevel: 'warn', // Keep it quiet in the UI
			servicesRequired: settings.prod ? servicesRequired : [],
			waitTimeout,
		})

		if (settings.prod) {
			console.log('✅ Required services are available')
		} else {
			console.log(`ℹ️  Skipping service wait in development mode`)
			console.log(`ℹ️  Set NODE_ENV=production to enable strict service checking`)
		}
	} catch (err) {
		console.error('❌ Failed to initialize Moleculer:', err)
		if (settings.prod) {
			throw err // Fail fast in production
		} else {
			console.warn('⚠️  Moleculer initialization failed but continuing in development mode')
		}
	}

	const broker = connector?.broker as MoleculerBroker

	globalThis.moleculer = {
		broker,

		async call<T>(
			actionName: string,
			params?: any,
			opts?: { timeout?: number; meta?: Record<string, any> },
		): Promise<T> {
			const event = useEvent()
			const tokenKey = event?.context?.tokenKey || getCookie(event, AccessTokenCookieKey)

			if (!whitelistedActions.includes(actionName) && !tokenKey) {
				throw BaseErrors.ServiceVoilation({
					service: `Service ${actionName} communication`,
				})
			}

			const user = whitelistedActions.includes(actionName)
				? NUXT_META.user
				: tokenKey &&
					(await connector!.call(
						'v1.Auth.resolveToken',
						{ tokenKey },
						{ meta: NUXT_META },
					))

			const meta = { ...opts?.meta, tokenKey, user }
			return connector!.call(actionName, params, {
				timeout: opts?.timeout,
				meta: meta,
			})
		},

		async emit(eventName: string, payload?: any, groups?: string | string[]): Promise<void> {
			await broker.emit(eventName, payload, groups)
		},

		async broadcast(
			eventName: string,
			payload?: any,
			groups?: string | string[],
		): Promise<void> {
			await broker.broadcast(eventName, payload, groups)
		},
	}

	// Graceful shutdown
	const shutdown = async () => {
		console.log('🛑 Shutting down Moleculer broker...')
		await connector?.stop()
		console.log('✅ Moleculer broker stopped')
	}

	process.on('SIGINT', shutdown)
	process.on('SIGTERM', shutdown)
})
