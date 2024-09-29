<script lang="ts">
	import type { InscriptionDetails } from '$lib/backend-api/types';
	import { blockStore } from '$lib/stores/blocks';
	import { getModalStore, getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import axios from 'axios';
	import SiteRouterCodeBlock from '../code/SiteRouterCodeBlock.svelte';
	import {
		PUBLIC_BITCOIN_NETWORK,
		PUBLIC_INSCRIPTION_LINK_URL,
		PUBLIC_TRANSACTION_LINK_URL
	} from '$env/static/public';
	import { getTitleFromHTML } from '$lib/utils/htmlUtils';
	import { siteHistoryStore } from '$lib/stores/history';
	import { getSiteLinkUrl } from '$lib/utils/network';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export const router: Router = $modalStore[0].meta.router;
	export const txnId: string = $modalStore[0].meta.txnId;

	/*
	 * Waiting for confirmation
	 */
	$: routerInscriptionId = txnId + 'i0';
	let confirmedSite: WalletSitesResult | null = null;

	$: siteLinkUrl = confirmedSite ? getSiteLinkUrl(confirmedSite.details.number) : null;

	blockStore.subscribe(() => {
		setTimeout(tryRefreshSiteConfirmation, 5000);
	});

	async function tryRefreshSiteConfirmation() {
		try {
			const res = await axios.get<InscriptionDetails>(
				`/api/inscription/${routerInscriptionId}/details`
			);
			if (res.status === 200 && !confirmedSite) {
				console.log(`Router inscription ${routerInscriptionId} is now confirmed!`);
				// Show success toast
				toastStore.trigger({
					message: 'Router inscription is now confirmed!',
					background: 'variant-filled-success'
				});
				// Add confirmed site details
				confirmedSite = {
					details: {
						number: res.data.number,
						inscribedAt: new Date(res.data.inscribedAt),
						id: res.data.id,
						contentType: res.data.contentType
					},
					router
				};
				// Add to history
				$siteHistoryStore = [...$siteHistoryStore, confirmedSite];
				// Send request to save site to database
				const baseRouteInscNumber = router.routes['/'];
				let title = `Site ${confirmedSite.details.number}`;
				if (baseRouteInscNumber) {
					try {
						const baseRouteContentRes = await axios.get(
							`/api/inscription/${baseRouteInscNumber}/content`
						);
						const baseRouteContentData = baseRouteContentRes.data;
						title = getTitleFromHTML(baseRouteContentData);
					} catch (err) {
						console.log('Failed to get site title:', err);
						title = `Site ${confirmedSite.details.number}*`;
					}
				}
				console.log('Site title is:', title);
				axios.post(`/api/site`, {
					number: res.data.number,
					title: title
				});
			}
		} catch (_) {}
	}

	function truncateTxnId(txnId: string) {
		return `${txnId.slice(0, 10)}...${txnId.slice(-10)}`;
	}

	function closeModal(resetForm: boolean) {
		$modalStore[0].response?.(resetForm);
		modalStore.close();
	}

	let isPulsing = false;
</script>

<div class="w-full h-full fixed z-40" aria-hidden="true" on:click={() => (isPulsing = true)}></div>

<div
	class="card px-10 py-6 w-modal z-50 relative"
	on:animationend={() => (isPulsing = false)}
	class:pulse={isPulsing}
>
	<div class="flex flex-col gap-6">
		<header class="text-3xl">Site Router Inscription</header>
		{#if confirmedSite}
			<div>Your site is now inscribed and visible!</div>
			<SiteRouterCodeBlock
				site={{
					createdAt: confirmedSite.details.inscribedAt.toString(),
					number: confirmedSite.details.number,
					router: confirmedSite.router
				}}
			></SiteRouterCodeBlock>
			<table>
				<tr>
					<td>Transaction ID:</td>
					<td>
						<a
							href={`${PUBLIC_TRANSACTION_LINK_URL}/${txnId}`}
							class="anchor no-underline hover:underline"
							target="_blank"
						>
							{truncateTxnId(txnId)}
						</a>
					</td>
				</tr>
				<tr>
					<td>Inscription number:</td>
					<td>
						<a
							href={`${PUBLIC_INSCRIPTION_LINK_URL}/${confirmedSite.details.number}`}
							class="anchor no-underline hover:underline"
							target="_blank"
						>
							{confirmedSite.details.number}
						</a>
					</td>
				</tr>
				<tr>
					<td>Site Link URL:</td>
					<td>
						<a href={siteLinkUrl} class="anchor no-underline hover:underline" target="_blank">
							{siteLinkUrl}
						</a>
					</td>
				</tr>
			</table>
			<div class="flex justify-end gap-3">
				<button type="button" class="btn variant-filled" on:click={() => closeModal(true)}>
					Back & Reset Form
				</button>
				<button type="button" class="btn variant-filled" on:click={() => closeModal(false)}>
					Back
				</button>
			</div>
		{:else}
			<!-- Refresh button -->
			<button
				class="absolute top-4 right-4 btn-icon btn-icon-sm hover:variant-soft"
				on:click={tryRefreshSiteConfirmation}
			>
				<i class="fas fa-refresh"></i>
			</button>
			<!-- Content -->
			<div class="grid place-items-center gap-4 p-5">
				<ProgressRadial />
				<div>Waiting for router inscription confirmation...</div>
				<div class="opacity-50 max-w-64 text-nowrap">
					TXN:
					<a
						href={`${PUBLIC_TRANSACTION_LINK_URL}/${txnId}`}
						class="hover:underline"
						target="_blank"
					>
						{truncateTxnId(txnId)}
						<i class="fas fa-arrow-up-right-from-square"></i>
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.03);
		}
		100% {
			transform: scale(1);
		}
	}
	.pulse {
		animation: pulse 0.2s ease-in-out;
	}
</style>
