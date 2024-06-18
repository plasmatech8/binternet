<script>
	import BitcoinNetwork from '$lib/components/graphics/BitcoinNetwork.svelte';
	import { TableOfContents, tocCrawler } from '@skeletonlabs/skeleton';
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';

	onMount(() => {
		hljs.highlightAll();
	});
</script>

<svelte:head>
	<title>Docs - BInternet</title>
	<meta name="description" content="Documentation for the BInternet system." />
</svelte:head>

<div class="w-full max-w-screen-2xl mx-auto px-2 my-10">
	<div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5">
		<div class="hidden sm:block">
			<div class="sticky top-10">
				<TableOfContents class="w-fit mx-auto" />
			</div>
		</div>
		<div
			class="col-span-1 sm:col-span-2 md:col-span-3"
			use:tocCrawler={{ mode: 'generate', scrollTarget: '#page' }}
		>
			<div class="prose dark:prose-invert !max-w-none block">
				<slot></slot>
			</div>
			<BitcoinNetwork></BitcoinNetwork>
		</div>
	</div>
</div>

<style>
	:global(pre):has(.hljs) {
		padding: 0;
	}
	:global(blockquote p)::after,
	:global(blockquote p)::before {
		display: none;
	}
</style>
