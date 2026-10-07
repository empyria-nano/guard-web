<script setup lang="ts">
const colorMode = useColorMode()

const toaster = { duration: 5000 }

const color = computed(() => (colorMode.value === 'dark' ? '#1b1718' : 'white'))

useHead({
	meta: [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ key: 'theme-color', name: 'theme-color', content: color },
	],
	link: [{ rel: 'icon', href: '/favicon.ico' }],
	htmlAttrs: {
		lang: 'en',
	},
})

const title = 'Principia Fluxus'
const description = 'AI-powered Data Lake platform'

useSeoMeta({
	title,
	description,
	ogTitle: title,
	ogDescription: description,
})
</script>

<template>
	<UApp :toaster="toaster">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
