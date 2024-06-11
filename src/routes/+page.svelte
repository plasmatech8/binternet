<script lang="ts">
	import BitcoinNetwork from '$lib/components/graphics/BitcoinNetwork.svelte';
</script>

<svelte:head>
	<title>BInternet</title>
	<meta name="description" content="Inscribe a website onto the Bitcoin blockchain." />
</svelte:head>

<div class="container mx-auto p-1 pt-10 mb-8">
	<div class="flex justify-center">
		<BitcoinNetwork></BitcoinNetwork>
	</div>

	<h1 class="h1 text-center">
		Welcome to the <span class="text-binternet">Bitcoin Internet</span>
	</h1>

	<div class="h3 text-center my-5">Inscribe a website onto the Bitcoin blockchain</div>

	<div class="flex gap-3 justify-center mb-10">
		<a href="/docs" class="btn variant-filled-primary">Docs</a>
		<a href="/create" class="btn variant-filled-primary">Create</a>
		<a href="/sites" class="btn variant-filled-primary">My Sites</a>
	</div>

	<!-- <div class="flex justify-center my-8">
		<iframe
			width="560"
			height="315"
			src="https://www.youtube.com/embed/AAAAAA"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
		></iframe>
	</div> -->
</div>
