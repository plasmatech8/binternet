<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let site: Site;

	$: url = `${$page.url.protocol}//${site.number}.${$page.url.host}`;

	const modalStore = getModalStore();

	function onClickViewRouter() {
		modalStore.trigger({
			type: 'component',
			component: 'siteRouterModal',
			meta: { site }
		});
	}
</script>

<div class="card card-hover p-5 flex flex-col gap-2">
	<div class="flex gap-3 justify-between items-center">
		<div class="h3">{site.number}</div>
		<div class="opacity-50">{site.router.binternet}</div>
	</div>
	<div class="flex gap-3 justify-between opacity-50 items-center">
		<div>{Object.keys(site.router.routes).length} routes</div>
		<div>{new Date(site.createdAt).toLocaleDateString()}</div>
	</div>
	<div class="flex gap-2">
		<button class="btn btn-sm variant-filled-primary gap-1" on:click={onClickViewRouter}>
			View Router <i class="fas fa-signs-post"></i>
		</button>
		<a class="btn btn-sm variant-filled-primary gap-1" href={url} target="_blank">
			Visit Site <i class="fas fa-up-right-from-square"></i>
		</a>
	</div>
</div>
