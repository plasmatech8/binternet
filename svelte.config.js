import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })],
	kit: { adapter: adapter() },
	onwarn(warning, defaultHandler) {
		// Do not show 3rd party warnings
		if (warning.filename.includes('node_modules')) return;
		defaultHandler(warning);
	}
};
export default config;
