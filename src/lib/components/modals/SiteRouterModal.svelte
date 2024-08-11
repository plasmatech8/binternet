<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import { PUBLIC_INSCRIPTION_LINK_URL } from '$env/static/public';

	const modalStore = getModalStore();

	const site = $modalStore[0].meta.site as Site;

	function onClose() {
		modalStore.close();
	}
	function addRouterLinks(e: HTMLElement) {
		// Convert router paths to anchor tags
		const stringEls = e.querySelectorAll<HTMLElement>('.hljs-string');
		stringEls.forEach((el) => {
			const text = el.innerText;
			const match = text.match(/^(\/.*):$/);
			if (match) {
				const anchor = document.createElement('a');
				anchor.href = `${$page.url.protocol}//${site.number}.${$page.url.host}${match[1]}`;
				anchor.target = '_blank';
				anchor.innerHTML = el.innerHTML;
				anchor.className = `hover:!anchor ${el.className}`;
				el.replaceWith(anchor);
			}
		});
		// Convert inscription numbers to anchor tags
		const numberEls = e.querySelectorAll<HTMLElement>('.hljs-number');
		numberEls.forEach((el) => {
			const text = el.innerText;
			const match = text.match(/^\d+$/);
			if (match) {
				const anchor = document.createElement('a');
				anchor.href = `${PUBLIC_INSCRIPTION_LINK_URL}/${match[0]}`;
				anchor.target = '_blank';
				anchor.innerHTML = el.innerHTML;
				anchor.className = `hover:!anchor ${el.className}`;
				el.replaceWith(anchor);
			}
		});
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

		<div use:addRouterLinks>
			<CodeBlock buttonCopied="✓" language="yaml" code={yaml.dump(site.router, {})}></CodeBlock>
		</div>

		<div>
			Click on
			<span class="font-bold text-primary-500">router paths</span>
			and
			<span class="font-bold text-primary-500">inscription numbers</span>
			to navigate to preview links.
		</div>

		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onClose} type="button">Back</button>
		</div>
	</div>
</div>
