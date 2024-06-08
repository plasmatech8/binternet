<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, initializeStores, LightSwitch } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	initializeStores();

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import yaml from 'highlight.js/lib/languages/yaml';
	hljs.registerLanguage('yaml', yaml);
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
		<AppBar gridColumns="sm:grid-cols-[auto_1fr_auto]">
			<svelte:fragment slot="lead">
				<a href="/" class="btn btn-sm hover:variant-soft-surface font-bold !gap-0 px-4">
					<span class="text-3xl text-orange-400">₿</span>
					<span class="text-xl uppercase !ml-0.5">internet</span>
				</a>
			</svelte:fragment>
			<div class="z-0 flex gap-2 sm:justify-center">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="/docs"
					class:!variant-ghost-primary={$page.url.pathname === '/docs'}
				>
					Docs
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="/create"
					class:!variant-ghost-primary={$page.url.pathname === '/create'}
				>
					Create
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="/sites"
					class:!variant-ghost-primary={$page.url.pathname === '/sites'}
				>
					My Sites
				</a>
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

	<!-- Footer -->
	<svelte:fragment slot="pageFooter">
		<div class="bg-surface-100-800-token p-10">
			<div class="flex justify-between">
				<div>
					<div class="font-bold font-mono"><span class="text-orange-400">B</span>Internet</div>
				</div>
				<div></div>
				<div>
					<LightSwitch></LightSwitch>
				</div>
			</div>
		</div>
	</svelte:fragment>
</AppShell>
