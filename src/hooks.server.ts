import { fetchSiteData } from '$lib/api/binternet';
import { extractNumberAndNetwork } from '$lib/utils/network';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ resolve, event }) => {
	const { number, network } = extractNumberAndNetwork(event.url);
	// If the last part of the domain is a number, send inscription contents
	if (number) {
		const data = await fetchSiteData(network, parseInt(number), event.url.pathname);
		return new Response(data.content, {
			headers: { 'Content-Type': data.contentType }
		});
	}
	// Otherwise, continue to normal website routes
	const response = await resolve(event);
	return response;
};
