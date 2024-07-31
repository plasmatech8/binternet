<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();

	export let inscriptions: InscriptionFile[] = $modalStore[0].meta?.inscriptions ?? [];

	onMount(() => {
		// TODO: fetch
		console.log(inscriptions);
	});
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl">Inscribe Files</header>
		{#each inscriptions as insc}
			<div>{insc.path}</div>
		{/each}
	</div>
</div>
