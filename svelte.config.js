import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		files: {
			hooks: {
				client: 'src/lib/hooks/hooks.client.ts',
				server: 'src/lib/hooks/hooks.server.ts'
			}
		},
		alias: {
			$routes: 'src/routes',
			$sveltewind: 'src/sveltewind',
			$icons: 'src/icons'
		}
	},
	compilerOptions: {
		runes: true
	}
}

export default config
