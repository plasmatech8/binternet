import { PUBLIC_INSCRIPTION_LINK_URL } from '$env/static/public';

export function addCodeBlockRouterLinks(
	e: HTMLElement,
	{ siteInscriptionNumber }: { siteInscriptionNumber?: number }
) {
	// Convert router paths to anchor tags
	if (siteInscriptionNumber) {
		const stringEls = e.querySelectorAll<HTMLElement>('.hljs-string');
		stringEls.forEach((el) => {
			const text = el.innerText;
			const match = text.match(/^(\/.*):$/);
			if (match) {
				const anchor = document.createElement('a');
				anchor.href = `${location.protocol}//${siteInscriptionNumber}.${location.host}${match[1]}`;
				anchor.target = '_blank';
				anchor.innerHTML = el.innerHTML;
				anchor.className = `hover:!anchor ${el.className}`;
				el.replaceWith(anchor);
			}
		});
	}
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
