<script lang="ts">
	import { page } from '$app/stores';

	export let site: Site;

	$: url = `${$page.url.protocol}//${site.number}.${$page.url.host}`;
</script>

<div class="card card-hover p-5 flex flex-col gap-1">
	<div class="flex gap-3 justify-between items-center">
		<div class="h3">{site.number}</div>
		<div class="opacity-50">{Object.keys(site.router.routes).length} routes</div>
	</div>
	<!-- <div class="flex gap-3 justify-betwee opacity-50 items-center">
		<div>{site.router.binternet}</div>
		·

	</div> -->
	<div class="flex gap-2">
		<button class="btn btn-sm variant-filled-primary gap-1">
			View Router <i class="fas fa-signs-post"></i>
		</button>
		<a class="btn btn-sm variant-filled-primary gap-1" href={url} target="_blank">
			Visit Site <i class="fas fa-up-right-from-square"></i>
		</a>
	</div>
</div>
