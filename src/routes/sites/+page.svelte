<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { wallet } from '$lib/stores/wallet';
	import { Paginator, ProgressRadial } from '@skeletonlabs/skeleton';
	import axios from 'axios';
	import SiteCard from './SiteCard.svelte';

	let offset = 0;
	let size = 0;
	let limit = 10;

	async function fetchInscriptionList(address: string, offset: number, limit: number) {
		const url = `/api/mainnet/sites/${address}`;
		const res = await axios.get(url, { params: { limit, offset } });
		const data = res.data as WalletSites;
		size = data.total;
		return data.results;
	}

	function onPageChange(e: CustomEvent) {
		const newPage = e.detail as number;
		console.log(newPage);
		offset = newPage * limit;
	}
</script>

<PageLayout>
	<h1 class="h1 mb-10">My Sites</h1>

	{#if $wallet}
		{#await fetchInscriptionList($wallet.ordinals, offset, limit)}
			<div class="min-h-72 h-[50vh] grid place-items-center">
				<ProgressRadial />
			</div>
		{:then sites}
			<div class="flex flex-wrap gap-5 mb-10">
				{#each sites as site}
					<SiteCard site={{ number: site.details.number, router: site.router }}></SiteCard>
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
		Please connect wallet
	{/if}
</PageLayout>
