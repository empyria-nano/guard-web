// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	experimental: {
		asyncContext: true,
	},
	build: {
		transpile: [],
	},
	modules: [
		'@vueuse/nuxt',
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'@nuxtjs/color-mode',
		'@nuxt/ui',
		'@nuxt/fonts',
		'@nuxtjs/tailwindcss',
	],

	css: ['~/assets/css/main.css'],

	fonts: {
		families: [{ name: 'Montserrat', provider: 'google' }],
		providers: {
			fontshare: false,
		},
	},

	ui: {
		theme: {
			colors: [
				'primary',
				'secondary',
				'success',
				'info',
				'warning',
				'error',
				'neutral',
				'cbh',
			],
		},
	},

	vite: {
		server: {
			watch: {
				usePolling: true,
			},
		},
	},

	nitro: {
		plugins: [],
	},
})
