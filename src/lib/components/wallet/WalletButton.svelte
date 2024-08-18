<script lang="ts">
	import { wallet } from '$lib/stores/wallet';
	import { clipboard, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import WalletAvatar from './WalletAvatar.svelte';
	import { getAddressBalance } from '$lib/api';
	import { bitcoinPriceStore } from '$lib/stores/bitcoin';

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

	$: addressInfoList = $wallet && [
		{ name: 'Payments', address: $wallet.payment, icon: '/bitcoin_icon.webp' },
		{ name: 'Ordinals', address: $wallet.ordinals, icon: '/ordinals_icon.png' }
	];

	let wrongNetwork = false;

	async function updateAddressBalanceAndNetworkInfo(paymentAddr: string) {
		try {
			return await getAddressBalance(paymentAddr);
		} catch (error) {
			if ((error as any)?.response?.data?.message === 'Address on invalid network') {
				wrongNetwork = true;
			}
			throw error;
		}
	}
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
	<div data-popup={walletMenuPopupSettings.target} class="pr-3">
		<div class="list-nav card shadow-xl rounded-3xl m-1 w-60">
			<div class="p-4 pb-3 text-center">
				{#await updateAddressBalanceAndNetworkInfo($wallet.payment)}
					- BTC
				{:then v}
					<div>
						{(v * 10e-9).toFixed(8)} BTC
					</div>
					<div class="text-sm opacity-50">
						{#if $bitcoinPriceStore}
							${($bitcoinPriceStore.USD * v * 10e-9).toFixed(2)} USD
						{:else}
							-
						{/if}
					</div>
				{:catch e}
					{e?.response?.data?.message ?? 'Error Reading Balance'}
				{/await}
			</div>
			<hr />
			{#if addressInfoList}
				{#each addressInfoList as info}
					<dl class="list-dl">
						<div>
							<span class="badge aspect-square bg-surface-50-900-token w-10 relative">
								<img src={info.icon} alt="Wallet Icon" />
							</span>
							<span class="flex-auto">
								<dt>{info.name}:</dt>
								<dd class="opacity-50">{truncateAddress(info.address)}</dd>
							</span>
							<button class="btn-icon group" use:clipboard={info.address}>
								<i class="far fa-clipboard group-focus:hidden"></i>
								<i class="fas fa-check hidden group-focus:block !m-0"></i>
							</button>
						</div>
					</dl>
				{/each}
			{/if}
			<button class="w-full !px-2" on:click={wallet.disconnect}>
				<span class="badge aspect-square bg-surface-50-900-token w-10 relative">
					<i class="fa-solid fa-right-from-bracket"></i>
				</span>
				<div>Disconnect</div>
			</button>
		</div>
	</div>
{:else}
	<!-- Connect Button -->
	<button class="btn variant-filled-primary h-12" on:click={wallet.connect}>Connect Wallet</button>
{/if}
