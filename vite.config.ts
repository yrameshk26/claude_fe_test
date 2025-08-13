import { defineConfig, loadEnv } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { sentrySvelteKit } from '@sentry/sveltekit'

export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

	return {
		plugins: [
			tailwindcss(),
			sentrySvelteKit({
				autoUploadSourceMaps: false
			}),
			sveltekit()
		],
		define: {
			'import.meta.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
			'import.meta.env.BUILD_VERSION': JSON.stringify(process.env.npm_package_version)
		},
		server: {
			port: parseInt(process.env.PORT || '3000')
		}
	}
})
