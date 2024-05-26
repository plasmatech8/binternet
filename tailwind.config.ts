import { join } from 'path';
import type { Config } from 'tailwindcss';
// @ts-expect-error esModuleInterop not recognized
import forms from '@tailwindcss/forms';
// @ts-expect-error esModuleInterop not recognized
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { binternet } from './src/binternet';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				custom: [binternet]
			}
		})
	]
} satisfies Config;
