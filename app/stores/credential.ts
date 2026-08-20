import { defineStore } from 'pinia'

export const useCredentialStore = defineStore('principia-credential', {
	state: () => ({
		email: '',
		actor: '',
		federation: '',
		role: '',
		flowID: '',
		processID: '',
		cookieExpiration: 0,
	}),
	getters: {
		isAuthenticated: (state) => state.actor !== null && state.federation !== null,
	},
	actions: {
		setCredentials(credentials: {
			email: string
			actor: string
			federation: string
			role: string
			flowID: string
			processID: string
			cookieExpiration: number
		}) {
			this.email = credentials.email
			this.actor = credentials.actor
			this.federation = credentials.federation
			this.role = credentials.role
			this.flowID = credentials.flowID
			this.processID = credentials.processID
			this.cookieExpiration = credentials.cookieExpiration
		},

		logout() {
			this.email = ''
			this.actor = ''
			this.federation = ''
			this.role = ''
			this.cookieExpiration = 0
		},
	},

	persist: true,
})
