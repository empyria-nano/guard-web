import { createEnv, validate } from '@empyria/common'

const schema = createEnv({})

export const env = validate(schema, { ...process.env }, { coerceTypes: true })

export const settings = Object.assign({}, env, {})
