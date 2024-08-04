<script lang="ts">
	import { getModalStore, popup, RangeSlider, type PopupSettings } from '@skeletonlabs/skeleton';
	import { uniq } from 'lodash-es';
	import prettyBytes from 'pretty-bytes';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();

	/*
	 * Form values
	 */

	export let inscriptions: InscriptionFile[] = $modalStore[0].meta?.inscriptions ?? [];
	$: totalSize = inscriptions.reduce((agg, next) => agg + (next.new?.size ?? 0), 0);

	let feeRate = 10;

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
		'js',
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

	$: validationErrors = inscriptions.map(validateFile);
	$: hasErrors = validationErrors.some((e) => e);

	const errorPopupSettings: PopupSettings = {
		event: 'click',
		placement: 'left',
		target: ''
	};

	/*
	 * Fee Calculations
	 */

	$: inscriptionFees = totalSize * feeRate;

	/*
	 * ...
	 */

	onMount(() => {
		// TODO: fetch
		console.log(inscriptions);
	});
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
							{#if hasErrors}
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
								{#if hasErrors}
									<td>
										{#if validationErrors[i]}
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
													<div>{validationErrors[i]}</div>
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

		<!-- Error Alert -->
		{#if hasErrors}
			<div class="alert variant-ghost-error flex">
				<div><i class="fas fa-triangle-exclamation"></i></div>
				<ul class="list-disc pl-4">
					{#each uniq(validationErrors).filter((x) => x) as errMsg}
						<li>{errMsg}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Fee input -->
		<RangeSlider name="range-slider" bind:value={feeRate} max={20} min={5} ticked>
			<div class="flex justify-between items-center">
				<div class="font-bold">Network Fee</div>
				<div class="text-xs">{feeRate} sats/vB</div>
			</div>
		</RangeSlider>

		<div class="flex flex-col gap-2">
			{#each [{ name: 'Inscribing Fee', amount: inscriptionFees }, { name: 'Total Fee', amount: 100 }] as item}
				<div class="flex justify-between gap-3">
					<div class="opacity-70">{item.name}:</div>
					<div class="flex gap-3">
						<div>{item.amount} sats</div>
						<div class="opacity-50 min-w-16">~${item.amount}</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Submit Button -->
		<button class="btn variant-filled-primary" disabled={hasErrors}>Submit & Pay</button>
	</div>
</div>
