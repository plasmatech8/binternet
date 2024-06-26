<script lang="ts">
	import { ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();

	export let numberInput: string = $modalStore[0].meta?.number?.toString() ?? '';
	$: number = parseInt(numberInput);
	let inscriptionContentUrl: string | undefined;
	let loading = false;

	async function loadInscription() {
		const currentNumber = number;
		// Invalid number
		if (!number) {
		}
		// Load inscription preview
		try {
			const url = `/api/inscription/${number}/content`;
			const res = await fetch(url);
			if (!res.ok) throw Error('Error loading inscription');
			// Show the preview if inscription number is still the same
			if (currentNumber === number) {
				const inscriptionBlob = await res.blob();
				inscriptionContentUrl = URL.createObjectURL(inscriptionBlob);
			}
		} catch (e: any) {}
		// Stop the loading spinner if number is still the same
		if (currentNumber === number) loading = false;
	}

	const loadFaceDebounced = debounce(loadInscription, 700);

	function onInput() {
		loading = true;
		inscriptionContentUrl = undefined;
		if (numberInput) {
			loadFaceDebounced();
		} else {
			loading = false;
		}
	}

	function onSelect() {
		if (!number) return;
		$modalStore[0].response?.(number);
		modalStore.close();
	}

	function onCancel() {
		modalStore.close();
	}

	onMount(loadInscription);
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Select Minecraft Face</header>

		{#if loading}
			<div class="w-24 h-24 mx-auto placeholder grid place-items-center">
				<ProgressRadial stroke={150} class="!w-10 !h-10 opacity-50" />
			</div>
		{:else if inscriptionContentUrl}
			<img
				src={inscriptionContentUrl}
				alt="Minecraft Face"
				style="image-rendering: pixelated;"
				class="w-24 h-24 mx-auto rounded-3xl"
			/>
		{:else}
			<div class="w-24 h-24 mx-auto placeholder grid place-items-center">
				<div class="mb-1 opacity-40 font-semibold">No Face</div>
			</div>
		{/if}

		<input
			type="text"
			name="inscription"
			class="input"
			placeholder="Enter inscription number..."
			bind:value={numberInput}
			on:input={onInput}
		/>
		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onCancel} type="button">Cancel</button>
			<button
				class="btn variant-filled-primary"
				on:click={onSelect}
				type="button"
				disabled={!number}
			>
				Select this Inscription
			</button>
		</div>
	</div>
</div>
