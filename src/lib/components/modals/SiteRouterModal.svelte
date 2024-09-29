<script lang="ts">
	import { PUBLIC_INSCRIPTION_LINK_URL } from '$env/static/public';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import SiteRouterCodeBlock from '../code/SiteRouterCodeBlock.svelte';
	import { getSiteLinkUrl } from '$lib/utils/network';

	const modalStore = getModalStore();

	const site = $modalStore[0].meta.site as Site;

	$: siteLinkUrl = getSiteLinkUrl(site.number);

	function onClose() {
		modalStore.close();
	}
</script>

<div class="card px-10 py-6 w-modal">
	<div class="flex flex-col gap-10">
		<header class="text-3xl flex justify-between items-center">
			<div>Router Inscription</div>
			<a
				href={`${PUBLIC_INSCRIPTION_LINK_URL}/${site.number}`}
				class="hover:anchor opacity-50 text-2xl"
				target="_blank"
			>
				#{site.number}
			</a>
		</header>

		<SiteRouterCodeBlock {site}></SiteRouterCodeBlock>

		<div>
			<p class="mb-2">
				You can click on a
				<span class="font-bold text-primary-500">router path</span>
				or
				<span class="font-bold text-primary-500">inscription number</span> above to navigate to preview
				links.
			</p>
			<p>
				<a href={siteLinkUrl} class="anchor no-underline hover:underline" target="_blank">
					{siteLinkUrl}
				</a>
			</p>
		</div>

		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onClose} type="button">Back</button>
		</div>
	</div>
</div>
