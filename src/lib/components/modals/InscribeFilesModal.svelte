<script lang="ts">
	import type {
		OrdinalsBotInscriptionOrderRequest,
		OrdinalsBotInscriptionOrderResponse
	} from '$lib/backend-api/sources/ordinalsBot';
	import { bitcoinPriceStore, recommendedFeeStore } from '$lib/stores/bitcoin';
	import { wallet } from '$lib/stores/wallet';
	import {
		getModalStore,
		popup,
		ProgressRadial,
		RangeSlider,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import axios from 'axios';
	import { debounce, uniq } from 'lodash-es';
	import prettyBytes from 'pretty-bytes';

	const modalStore = getModalStore();

	/*
	 * Form values
	 */

	export let inscriptions: InscriptionFile[] = $modalStore[0].meta?.inscriptions ?? [];
	$: totalSize = inscriptions.reduce((agg, next) => agg + (next.new?.size ?? 0), 0);

	let feeRate = 0;

	$: feeRateOptions = $recommendedFeeStore
		? [
				{ name: 'Economy', feeRate: $recommendedFeeStore.economyFee },
				{ name: 'Normal', feeRate: $recommendedFeeStore.halfHourFee },
				{ name: 'Fast', feeRate: $recommendedFeeStore.fastestFee }
			]
		: null;

	$: if (!feeRate && $recommendedFeeStore) {
		feeRate = $recommendedFeeStore.fastestFee;
	}

	$: atFeeRateOption = feeRateOptions?.reduce((best, next) => {
		if (feeRate < next.feeRate) return best;
		return next;
	}, feeRateOptions[0]);

	let receiveAddress = $wallet?.ordinals ?? '';

	/*
	 * Content type validation (for OrdinalsBot API)
	 */

	const allowedContentTypes = [
		'apng',
		'flac',
		'gif',
		'html',
		'jpg',
		'jpeg',
		'mp3',
		'pdf',
		'png',
		'svg',
		'txt',
		'wav',
		'webm',
		'webp',
		'mp4',
		'stl',
		'glb',
		'avif',
		'yaml',
		'yml',
		'asc',
		'json',
		'javascript',
		'css',
		'gz'
	];

	function validateFile(insc: InscriptionFile) {
		const details = insc.new;
		if (!details) {
			return 'Error: Missing inscription data';
		}
		const type = details.contentType.split('/').pop() ?? details.contentType;
		if (!type) {
			return `Unknown Content Type`;
		}
		if (!allowedContentTypes.includes(type)) {
			return 'Content Type not available for inscribing';
		}
		return null;
	}

	$: fileValidationErrors = inscriptions.map(validateFile);
	$: hasFileValidationErrors = fileValidationErrors.some((e) => e);

	const errorPopupSettings: PopupSettings = {
		event: 'click',
		placement: 'left',
		target: ''
	};

	/*
	 * Fee Calculations
	 */

	$: feeInfoItems = [{ name: 'Total Fee', amount: order?.charge.amount }];

	/*
	 * Get inscription order quote
	 */

	let order: OrdinalsBotInscriptionOrderResponse | null = null;

	const createOrderDebounced = debounce(createOrder, 800);

	let orderErrors: string | null = null;

	async function createOrder() {
		const orderDetails: OrdinalsBotInscriptionOrderRequest = {
			fee: feeRate,
			files: inscriptions.map((insc) => {
				const { filename, size, contentType, data } = insc.new!;
				const base64 = btoa(
					new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
				);
				return {
					name: filename,
					size: size,
					type: contentType,
					dataURL: `data:${contentType};base64,${base64}`
				};
			}),
			lowPostage: true,
			receiveAddress: receiveAddress
		};

		try {
			const res = await axios.post<OrdinalsBotInscriptionOrderResponse>('/api/order', orderDetails);
			order = res.data;
		} catch (error) {
			console.error('Failed to get order quote:', error);
			if (axios.isAxiosError(error) && error.response?.status === 400) {
				orderErrors = error.response.data.errors;
				return;
			}
			orderErrors = 'Error getting order';
		}
	}

	$: if (feeRate && inscriptions) {
		order = null;
		orderErrors = null;
		if (receiveAddress) createOrderDebounced();
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-6">
		<header class="text-3xl">Inscribe Files</header>

		<!-- Inscriptions table -->
		<div class="flex flex-col gap-3">
			<div class="flex justify-between items-center">
				<div class="font-bold">Files</div>
				<div class="text-xs">{inscriptions.length} files ({prettyBytes(totalSize)} total)</div>
			</div>
			<div class="table-container">
				<table class="table table-compact">
					<thead>
						<tr>
							<th>#</th>
							<th>Content Type</th>
							<th>Filename</th>
							<th>Size</th>
							{#if hasFileValidationErrors}
								<th></th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each inscriptions as insc, i}
							<tr>
								<td>
									<div class="btn-icon btn-icon-sm variant-ghost">
										{insc.id}
									</div>
								</td>
								<td>
									{insc.new?.contentType ?? '?'}
								</td>
								<td>
									{insc.new?.filename ?? '?'}
								</td>
								<td>
									{insc.new?.size ? prettyBytes(insc.new.size) : '?'}
								</td>
								{#if hasFileValidationErrors}
									<td>
										{#if fileValidationErrors[i]}
											{@const popupSettings = {
												...errorPopupSettings,
												target: Math.random().toString()
											}}

											<button
												type="button"
												class="btn-icon btn-icon-sm variant-outline-error group transition-all"
												use:popup={popupSettings}
											>
												<i class="fas fa-triangle-exclamation text-error-500 mb-1"></i>
											</button>

											<div class="card p-4 variant-filled-error" data-popup={popupSettings.target}>
												<div class="arrow variant-filled-error" />
												<div class="flex items-center gap-3">
													<i class="fas fa-triangle-exclamation"></i>
													<div>{fileValidationErrors[i]}</div>
												</div>
											</div>
										{/if}
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- File Validation Error Alert -->
		{#if hasFileValidationErrors}
			<div class="alert variant-ghost-error flex">
				<div><i class="fas fa-triangle-exclamation"></i></div>
				<ul class="list-disc pl-4">
					{#each uniq(fileValidationErrors).filter((x) => x) as errMsg}
						<li>{errMsg}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Receive Address -->
		<div class="flex flex-col gap-3">
			<div class="font-bold">Receive Address</div>
			<input type="text" class="input h-8" bind:value={receiveAddress} />
		</div>

		<!-- Fee input -->
		{#if feeRateOptions && $recommendedFeeStore}
			<RangeSlider
				name="range-slider"
				bind:value={feeRate}
				max={Math.round($recommendedFeeStore.fastestFee * 1.6)}
				min={3}
				ticked
			>
				<div class="flex justify-between items-center">
					<div class="font-bold">Network Fee</div>
					<div class="text-xs">{feeRate} sats/vB</div>
				</div>
			</RangeSlider>

			<div class="flex gap-2 justify-center">
				{#each feeRateOptions as option}
					<button
						class="btn btn-sm variant-soft"
						class:!text-primary-500={option.name === atFeeRateOption?.name}
						on:click={() => (feeRate = option.feeRate)}
					>
						{option.name}
						{option.feeRate} sats/vB
					</button>
				{/each}
			</div>
		{:else}
			<div class="flex justify-center">
				<ProgressRadial width="w-20"></ProgressRadial>
			</div>
		{/if}

		<!-- Fee info details -->
		<div class="flex flex-col gap-2">
			{#each feeInfoItems as item}
				<div class="flex justify-between gap-3">
					<div class="opacity-70">{item.name}:</div>
					<div class="flex gap-3 items-center">
						{#if $bitcoinPriceStore && item.amount}
							<div>{item.amount} sats</div>
							<div class="opacity-50 min-w-16">
								~${(item.amount * 10 ** -9 * $bitcoinPriceStore.USD).toFixed(2)}
							</div>
						{:else}
							<ProgressRadial width="w-4"></ProgressRadial>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Order Error Alert -->
		{#if orderErrors}
			<div class="alert variant-ghost-error flex">
				<i class="fas fa-triangle-exclamation"></i>
				<ul class="list-disc pl-4">
					{#each orderErrors as errMsg}
						<li>{errMsg}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Submit Button -->
		<button class="btn variant-filled-primary" disabled={hasFileValidationErrors || !order}>
			Submit & Pay
		</button>
	</div>
</div>
