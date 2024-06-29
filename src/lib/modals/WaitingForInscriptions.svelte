<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();

	export let txIds: string[] = $modalStore[0].meta?.txIds ?? [];

	onMount(() => {
		setInterval(() => {
			console.log(txIds);
			// update list of inscriptions owned by user
			// TODO: create store containing user inscriptions
		}, 30);
	});
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Waiting for Inscriptions...</header>
		<div></div>
	</div>
</div>
