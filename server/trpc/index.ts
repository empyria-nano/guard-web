// server/trpc/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'

import { createValidator } from '@empyria/common'

import { AccessTokenCookieKey } from '../../app/consts'
import type { Context } from './context'

const t = initTRPC.context<Context>().create()

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure

/**
 * Authorized procedure - requires access token in cookie
 */
export const authorizedProcedure = t.procedure.use(async ({ ctx, next }) => {
	const tokenKey = ctx.getCookie(AccessTokenCookieKey)

	if (!tokenKey) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You are not authorized to make this request',
		})
	}

	// Token is validated, proceed with request
	return next()
})

// Passthrough parser - accepts any input and returns it as-is
const passthroughParser = {
	parse: (input: unknown) => input,
}

export const validatedMiddleware = (schema: object) => {
	const validate = createValidator(schema)

	return middleware(async ({ next, getRawInput }) => {
		const rawInput = await getRawInput()
		try {
			validate(rawInput)
		} catch (err) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Validation failed',
				cause: {
					errors: [err],
					input: rawInput,
				},
			})
		}
		return next()
	})
}

/**
 * Add AJV validation to any procedure
 * @param baseProcedure - The base procedure (publicProcedure or authorizedProcedure)
 * @param schema - The AJV schema to validate against
 */
export const validatedProcedure = <T extends typeof publicProcedure>(
	baseProcedure: T,
	schema: object,
) => {
	return baseProcedure.input(passthroughParser).use(validatedMiddleware(schema))
}

export const router = t.router
export const middleware = t.middleware
