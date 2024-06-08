<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import SiteCard from './SiteCard.svelte';

	const sites: Site[] = [
		{
			number: 71103392,
			id: '08b4a0f392c4ec8331ecde09d5c2f321a611d9263780f9c6ad89eddfab344e4fi0',
			router: { binternet: 'v1', routes: { '/foo/bar/baz': 1235324 } }
		},
		{
			number: 71103392,
			id: '08b4a0f392c4ec8331ecde09d5c2f321a611d9263780f9c6ad89eddfab344e4fi0',
			router: { binternet: 'v1', routes: { '/foo/bar/baz': 1235324 } }
		},
		{
			number: 71103392,
			id: '08b4a0f392c4ec8331ecde09d5c2f321a611d9263780f9c6ad89eddfab344e4fi0',
			router: { binternet: 'v1', routes: { '/foo/bar/baz': 1235324 } }
		},
		{
			number: 71103392,
			id: '08b4a0f392c4ec8331ecde09d5c2f321a611d9263780f9c6ad89eddfab344e4fi0',
			router: { binternet: 'v1', routes: { '/foo/bar/baz': 1235324 } }
		},
		{
			number: 71103392,
			id: '08b4a0f392c4ec8331ecde09d5c2f321a611d9263780f9c6ad89eddfab344e4fi0',
			router: { binternet: 'v1', routes: { '/foo/bar/baz': 1235324 } }
		},
		{
			number: 71103392,
			id: '08b4a0f392c4ec8331ecde09d5c2f321a611d9263780f9c6ad89eddfab344e4fi0',
			router: { binternet: 'v1', routes: { '/foo/bar/baz': 1235324 } }
		}
	];
</script>

<PageLayout>
	<h1 class="h1 mb-5">My Sites</h1>

	<div class="flex gap-5">
		{#each sites as site}
			<SiteCard {site}></SiteCard>
		{/each}
	</div>
</PageLayout>
