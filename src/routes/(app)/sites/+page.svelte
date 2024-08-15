<script lang="ts">
	import PageLayout from '$lib/components/layouts/PageLayout.svelte';
	import { wallet } from '$lib/stores/wallet';
	import { Paginator, ProgressRadial } from '@skeletonlabs/skeleton';
	import SiteCard from '../../../lib/components/cards/SiteCard.svelte';
	import WalletButton from '$lib/components/wallet/WalletButton.svelte';
	import { fetchSiteList } from '$lib/api';
	import { PUBLIC_BITCOIN_NETWORK } from '$env/static/public';

	let offset = 0;
	let size = 0;
	let limit = 10;

	async function fetchInscriptionList(address: string, offset: number, limit: number) {
		const data = await fetchSiteList(address, { offset, limit });
		size = data.total;
		return data.results;
	}

	function onPageChange(e: CustomEvent) {
		const newPage = e.detail as number;
		console.log(newPage);
		offset = newPage * limit;
	}
</script>

<svelte:head>
	<title>Sites - BInternet</title>
	<meta name="description" content="The sites (routers) you have inscribed onto the blockchain." />
</svelte:head>

<PageLayout>
	<h1 class="h1 mb-10">My Sites</h1>

	{#if $wallet}
		{#if PUBLIC_BITCOIN_NETWORK === 'mainnet'}
			{#await fetchInscriptionList($wallet.ordinals, offset, limit)}
				<div class="min-h-72 h-[50vh] grid place-items-center">
					<ProgressRadial />
				</div>
			{:then sites}
				<div class="flex flex-wrap gap-5 mb-10">
					{#each sites as site}
						<SiteCard
							site={{
								number: site.details.number,
								router: site.router,
								createdAt: site.details.createdAt
							}}
						></SiteCard>
					{/each}
				</div>

				<div class="flex justify-center">
					<Paginator
						settings={{
							page: offset / limit,
							limit,
							size,
							amounts: []
						}}
						on:page={onPageChange}
					></Paginator>
				</div>
			{:catch e}
				{e.message}
			{/await}
		{:else}
			<div>Listing sites is not currently available for {PUBLIC_BITCOIN_NETWORK}.</div>
		{/if}
	{:else}
		<div class="flex flex-col justify-center items-center gap-14 h-[calc(70vh-152px)] min-h-72">
			<div class="opacity-50">
				<i class="fas fa-globe text-9xl"></i>
			</div>
			<WalletButton></WalletButton>
		</div>
	{/if}
</PageLayout>
