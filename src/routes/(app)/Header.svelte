<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_BITCOIN_NETWORK } from '$env/static/public';
	import WalletButton from '$lib/components/wallet/WalletButton.svelte';
	import { AppBar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import pkg from '../../../package.json?raw';

	const { version } = JSON.parse(pkg);
	const isBeta = parseInt(version.split('.')[0]) < 1;

	const networkSelectPopup: PopupSettings = {
		event: 'click',
		target: 'networkSelect',
		placement: 'bottom'
	};

	const mainnetUrl = `https://binternet.org`;
	const signetUrl = `https://signet.binternet.org`;
</script>

<div class="card w-48 shadow-xl rounded-2xl" data-popup={networkSelectPopup.target}>
	<div class="list-nav z-30">
		<ul>
			<li>
				<a href={mainnetUrl} class:variant-soft-primary={PUBLIC_BITCOIN_NETWORK === 'Mainnet'}>
					Mainnet
				</a>
			</li>
			<li>
				<a href={signetUrl} class:variant-soft-primary={PUBLIC_BITCOIN_NETWORK === 'Signet'}>
					Signet
				</a>
			</li>
		</ul>
	</div>
</div>

<AppBar gridColumns="sm:grid-cols-[auto_1fr_auto]">
	<svelte:fragment slot="lead">
		<div class="flex gap-0 items-center">
			<!-- Title -->
			<a href="/" class="btn btn-sm hover:variant-soft-surface font-bold gap-0 px-4 relative">
				<span class="text-3xl text-orange-400">₿</span>
				<span class="text-xl uppercase !ml-0.5">internet</span>
				<!-- Beta label -->
				<div class="font-semibold leading-none absolute bottom-0 right-5">
					{#if isBeta}
						<div class="text-xs opacity-30">⚠️ BETA</div>
					{/if}
				</div>
			</a>
			<!-- Network Switcher -->
			<button
				use:popup={networkSelectPopup}
				class="text-xs btn btn-sm hover:variant-soft-surface font-bold gap-0 opacity-50"
			>
				<div>{PUBLIC_BITCOIN_NETWORK.toUpperCase()}</div>
				<i class="fas fa-caret-down"></i>
			</button>
		</div>
		<div class="block sm:hidden">
			<!-- Wallet Button -->
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
