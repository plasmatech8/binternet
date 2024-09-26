<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_BITCOIN_NETWORK, PUBLIC_INSCRIPTION_LINK_URL } from '$env/static/public';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';

	export let site: Site;

	function addRouterLinks(e: HTMLElement) {
		// Convert router paths to anchor tags
		const stringEls = e.querySelectorAll<HTMLElement>('.hljs-string');
		stringEls.forEach((el) => {
			const text = el.innerText;
			const match = text.match(/^(\/.*):$/);
			if (match) {
				const anchor = document.createElement('a');
				anchor.href = `${$page.url.protocol}//${site.number}.${PUBLIC_BITCOIN_NETWORK}.${$page.url.host}${match[1]}`;
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

<div use:addRouterLinks>
	<CodeBlock buttonCopied="✓" language="yaml" code={yaml.dump(site.router, {})}></CodeBlock>
</div>
