<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import WalletButton from '$lib/components/wallet/WalletButton.svelte';
	import { PUBLIC_BITCOIN_NETWORK } from '$env/static/public';
	import pkg from '../../../package.json?raw';

	const { version } = JSON.parse(pkg);
	const isBeta = parseInt(version.split('.')[0]) < 1;
</script>

<AppBar gridColumns="sm:grid-cols-[auto_1fr_auto]">
	<svelte:fragment slot="lead">
		<a href="/" class="btn btn-sm hover:variant-soft-surface font-bold !gap-0 px-4">
			<span class="text-3xl text-orange-400">₿</span>
			<span class="text-xl uppercase !ml-0.5">internet</span>
			{#if PUBLIC_BITCOIN_NETWORK !== 'mainnet'}
				<span class="text-xs opacity-50">{PUBLIC_BITCOIN_NETWORK.toUpperCase()}</span>
			{/if}
			{#if isBeta}
				<span class="text-xs opacity-50">BETA</span>
			{/if}
		</a>
		<div class="block sm:hidden">
			<WalletButton morePopupOffset></WalletButton>
		</div>
	</svelte:fragment>
	<div class="z-0 flex gap-2 justify-center">
		<a
			class="btn btn-sm variant-ghost-surface"
			href="/"
			class:!variant-ghost-primary={$page.url.pathname === '/'}
		>
			Home
		</a>
		<a
			class="btn btn-sm variant-ghost-surface"
			href="/docs"
			class:!variant-ghost-primary={$page.url.pathname === '/docs'}
		>
			Docs
		</a>
		<div class="opacity-50">·</div>
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
		<div class="hidden sm:block">
			<WalletButton></WalletButton>
		</div>
	</svelte:fragment>
</AppBar>

<style>
	@media (max-width: 639px) {
		:global(.app-bar-slot-trail) {
			display: none;
		}
	}
</style>
