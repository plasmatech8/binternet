<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// FontAwesome Icons
	import '@fortawesome/fontawesome-free/js/all.min.js';
</script>

<!-- Navigation Loading Bar -->
{#await import('@prgm/sveltekit-progress-bar') then { ProgressBar }}
	<div class="fixed z-[1000] w-screen top-0 left-0 right-0 h-1">
		<ProgressBar class="text-primary-500" />
	</div>
{/await}

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" class="btn btn-sm hover:variant-soft-surface font-bold !gap-0 px-4">
					<span class="text-3xl text-orange-400">₿</span>
					<span class="text-xl uppercase !ml-0.5">internet</span>
				</a>
			</svelte:fragment>
			<div class="z-0">
				<a class="btn btn-sm variant-ghost-surface" href="/documentation">Documentation</a>
				<a class="btn btn-sm variant-ghost-surface" href="/create">Create</a>
			</div>
			<svelte:fragment slot="trail">
				<div>
					<button class="btn variant-filled-primary">Connect Wallet</button>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
