<script lang="ts">
	import { wallet } from '$lib/stores/wallet';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import WalletAvatar from './WalletAvatar.svelte';
	import WalletButtonMenu from './WalletButtonMenu.svelte';

	export let morePopupOffset = false;

	const walletMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'walletMenuPopup' + Math.random(),
		closeQuery: 'a[href]',
		middleware: {
			offset: morePopupOffset ? 70 : 20
		}
	};

	function truncateAddress(addr: string) {
		return `${addr.slice(0, 6)}...${addr.slice(-3)}`;
	}

	let wrongNetwork = false;
	let open = false;
	let popupEl: HTMLDivElement;

	onMount(() => {
		// Define a MutationObserver to watch for attribute changes
		const observer = new MutationObserver(() => {
			open = popupEl.style.opacity === '1';
		});
		// Start observing the dialog element for attribute changes
		observer.observe(popupEl, { attributes: true });
		// Clean up the observer when the component is destroyed
		return () => observer.disconnect();
	});
</script>

{#if $wallet}
	<!-- Wallet Button -->
	<button
		class="btn variant-filled-secondary h-12 p-1 pl-4 gap-2"
		use:popup={walletMenuPopupSettings}
	>
		{#if wrongNetwork}
			<div class="ml-1"><i class="fas fa-exclamation-triangle mr-1"></i> Wrong Network</div>
		{:else}
			<div>{truncateAddress($wallet.payment)}</div>
		{/if}
		<i class="fas fa-caret-down ml-2"></i>
		<div class="!ml-0"><WalletAvatar address={$wallet.payment}></WalletAvatar></div>
	</button>

	<!-- Wallet Menu Popup -->
	<div data-popup={walletMenuPopupSettings.target} class="pr-3" bind:this={popupEl}>
		{#if open}
			<WalletButtonMenu></WalletButtonMenu>
		{/if}
	</div>
{:else}
	<!-- Connect Button -->
	<button class="btn variant-filled-primary h-12" on:click={wallet.connect}>Connect Wallet</button>
{/if}
