<script lang="ts">
	import BitcoinNetwork from '$lib/components/graphics/BitcoinNetwork.svelte';
</script>

<svelte:head>
	<title>BInternet</title>
	<meta name="description" content="Inscribe a website onto the Bitcoin blockchain." />
</svelte:head>

<div class="container mx-auto p-1 pt-10">
	<div class="flex justify-center">
		<BitcoinNetwork></BitcoinNetwork>
	</div>
	<div></div>
	<h1 class="h1 text-center">
		Welcome to the <span class="text-binternet">Bitcoin Internet</span>
	</h1>
	<div class="h3 text-center mt-5">Inscribe a website onto the Bitcoin blockchain</div>
</div>
