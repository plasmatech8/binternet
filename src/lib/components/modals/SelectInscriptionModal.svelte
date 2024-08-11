<script lang="ts">
	import { fetchInscriptionList } from '$lib/api';
	import type { InscriptionDetailsList } from '$lib/backend-api/types';
	import { wallet } from '$lib/stores/wallet';
	import { Paginator, ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash-es';
	import { onMount } from 'svelte';
	import { PUBLIC_INSCRIPTION_LINK_URL } from '$env/static/public';

	const modalStore = getModalStore();

	/*
	 * Data
	 */

	export let numberInput: string = $modalStore[0].meta?.number?.toString() ?? '';
	$: number = parseInt(numberInput);
	let inscriptionContentUrl: string | undefined;
	let inscriptionContentType: string | undefined;
	let inscriptionContentSize: number | undefined;
	let error = '';
	let loading = false;

	let inscriptionListResult: InscriptionDetailsList | null = null;
	let offset = 0;
	let limit = 10;
	let size = 0;
	const mimeTypeOptions = [
		{ name: 'All', value: undefined },
		{ name: 'HTML', value: 'text/html' },
		{ name: 'CSS', value: 'text/css' },
		{ name: 'JS', value: 'text/javascript' },
		{ name: 'PNG', value: 'image/png' },
		{ name: 'JPEG', value: 'image/jpeg' },
		{ name: 'GIF', value: 'image/gif' },
		{ name: 'WEBP', value: 'image/webp' }
	] as const;
	let mimeType: (typeof mimeTypeOptions)[number]['value'] = undefined;
	let searchAddress = $wallet?.ordinals ?? '';

	/*
	 * Functions
	 */

	async function loadInscription() {
		const currentNumber = number;
		error = '';
		// no input
		if (!numberInput) {
			inscriptionContentUrl = undefined;
			fetchWalletInscriptions();
			return;
		}
		// Invalid number
		if (!number || !numberInput.match(/^\d+$/)) {
			inscriptionContentUrl = undefined;
			error = 'Invalid inscription number';
			return;
		}
		// Load inscription preview
		try {
			const url = `/api/inscription/${number}/content`;
			const res = await fetch(url);
			if (!res.ok) throw Error('Error loading inscription');
			// Show the preview if inscription number is still the same
			if (currentNumber === number) {
				const inscriptionBlob = await res.blob();
				inscriptionContentType = res.headers.get('content-type') ?? undefined;
				inscriptionContentUrl = URL.createObjectURL(inscriptionBlob);
				inscriptionContentSize = inscriptionBlob.size;
			}
		} catch (e: any) {}
		// Stop the loading spinner if number is still the same
		if (currentNumber === number) loading = false;
	}

	const loadInscriptionDebounced = debounce(loadInscription, 700);

	function onInput() {
		loading = true;
		inscriptionContentUrl = undefined;
		loadInscriptionDebounced();
		if (!numberInput) {
			loading = false;
		}
	}

	function onSelect() {
		if (!number) return;
		if (loading) return;
		$modalStore[0].response?.({
			number,
			contentType: inscriptionContentType,
			contentSize: inscriptionContentSize
		});
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	function onPageChange(e: CustomEvent) {
		const newPage = e.detail as number;
		offset = newPage * limit;
		fetchWalletInscriptions();
	}

	async function fetchWalletInscriptions() {
		inscriptionListResult = null;
		try {
			const list = await fetchInscriptionList(searchAddress ?? '', {
				offset,
				limit,
				contentType: mimeType
			});
			size = list.total;
			offset = list.offset;
			inscriptionListResult = list;
		} catch (err) {
			console.error(err);
			error = 'Failed to fetch inscriptions';
		}
	}

	onMount(loadInscription);
</script>

<div class="card px-10 py-6 w-modal-wide max-h-[90vh] overflow-y-auto">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select Inscription</header>

		<div class="flex flex-col gap-2">
			<div class="flex flex-col min-h-80">
				{#if error}
					<!-- error -->
					<div class="alert variant-filled-warning">
						<i class="fas fa-exclamation-circle mr-2"></i>
						{error}
					</div>
				{:else if loading}
					<!-- Preview loading -->
					<div class="flex-1"></div>
					<div class="w-24 h-24 mx-auto placeholder grid place-items-center">
						<ProgressRadial stroke={150} class="!w-10 !h-10 opacity-50" />
					</div>
					<div class="flex-1"></div>
				{:else if numberInput}
					<!-- Preview -->
					<div class="flex-1"></div>
					{#if inscriptionContentType?.startsWith('image')}
						<img
							src={inscriptionContentUrl}
							alt="Inscription Preview"
							style="image-rendering: pixelated;"
							class="w-24 h-24 mx-auto"
						/>
					{/if}
					<div class="flex-1"></div>
					<div class="flex gap-3 justify-between">
						<div>{inscriptionContentType}</div>
						<div class="flex gap-3">
							<a href={`${PUBLIC_INSCRIPTION_LINK_URL}/${number}`} class="anchor" target="_blank">
								Details
							</a>
							<a href="/api/inscription/{number}/content" class="anchor" target="_blank">
								Preview
							</a>
						</div>
					</div>
				{:else}
					<!-- empty (show user inscription list) -->
					{#if $wallet}
						<div class="h4 mb-4 flex flex-wrap justify-between md:gap-3">
							<div>Your Inscriptions:</div>
							<div class="flex">
								<input
									type="text"
									class="input md:w-96 h-8 opacity-50 focus:opacity-100"
									bind:value={searchAddress}
									on:input={fetchWalletInscriptions}
								/>
								<button
									class="btn-icon btn-icon-sm"
									on:click={() => {
										searchAddress = $wallet.ordinals;
										fetchWalletInscriptions();
									}}
									disabled={$wallet.ordinals === searchAddress}
								>
									<i class="fas fa-arrow-rotate-left"></i>
								</button>
							</div>
						</div>
						<div class="flex gap-3 mb-4 flex-wrap">
							{#each mimeTypeOptions as option}
								<button
									class="chip {mimeType === option.value ? 'variant-filled' : 'variant-soft'}"
									on:click={() => {
										mimeType = option.value;
										fetchWalletInscriptions();
									}}
									on:keypress
								>
									{option.name}
								</button>
							{/each}
						</div>
						{#if inscriptionListResult}
							<!-- List of owned inscriptions -->
							<div class="flex gap-2 flex-wrap mb-8 overflow-y-auto">
								{#each inscriptionListResult.results as insc}
									<button
										class="card card-hover p-2 flex flex-col gap-1"
										on:click={() => {
											numberInput = insc.number.toString();
											onInput();
										}}
									>
										<div class="flex justify-between gap-3">
											<div class="font-semibold">
												{insc.number}
											</div>
											<div class="opacity-50">
												{new Date(insc.createdAt).toLocaleDateString()}
											</div>
										</div>
										<div class="opacity-50">{insc.contentType}</div>
									</button>
								{:else}
									<div class="h-30 p-5 w-full opacity-50">No inscriptions</div>
								{/each}
							</div>
						{:else}
							<div class="grid place-items-center h-64">
								<ProgressRadial width="w-32" stroke={70} class="p-4"></ProgressRadial>
							</div>
						{/if}
					{:else}
						<div class="h-30 p-5 w-full opacity-50">Wallet Not Connected</div>
					{/if}
				{/if}
			</div>

			<!-- Pagination -->
			{#if inscriptionListResult && !number}
				<div class="flex justify-center">
					<Paginator
						settings={{
							page: offset / limit,
							limit,
							size,
							amounts: []
						}}
						on:page={onPageChange}
						disabled={inscriptionListResult.results.length === 0}
					></Paginator>
				</div>
			{/if}
		</div>

		<!-- Input -->
		<div class="flex gap-2">
			<input
				type="text"
				name="inscription"
				class="input"
				placeholder="Enter inscription number..."
				bind:value={numberInput}
				on:input={onInput}
				pattern="\d+"
			/>
			{#if numberInput}
				<button
					class="btn-icon btn-icon-sm"
					on:click={() => {
						numberInput = '';
						onInput();
					}}
				>
					<i class="fas fa-arrow-rotate-left"></i>
				</button>
			{/if}
		</div>
		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button
				class="btn variant-filled-primary"
				on:click={onSelect}
				type="button"
				disabled={!number || !!error || loading}
			>
				Select this Inscription
			</button>
		</div>
	</div>
</div>
