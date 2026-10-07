import { createEnv, validate } from '@empyria/common'

const schema = createEnv({
	/*
	moleculer: {
		transporterURL: env.NUXT_MOL_TRANSPORTER,
		namespace: env.NUXT_MOL_NAMESPACE,
		servicesRequired: env.NUXT_MOL_SERVICES_REQUIRED?.split(',') || [],
		waitTimeout: parseInt(env.NUXT_MOL_WAIT_TIMEOUT || '30000', 10),
	},

	restate: {
		url: env.NUXT_RESTATE_URL,
		adminURL: env.NUXT_RESTATE_ADMIN_URL,
	},
 */
})

export const env = validate(schema, { ...process.env }, { coerceTypes: true })

export const settings = Object.assign({}, env, {})
