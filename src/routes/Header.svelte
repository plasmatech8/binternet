<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import WalletButton from '$lib/components/WalletButton.svelte';
</script>

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
		<WalletButton></WalletButton>
	</svelte:fragment>
</AppBar>
