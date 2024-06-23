import { extractNumberAndNetwork } from '$lib/utils/network';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ resolve, event }) => {
	const { number } = extractNumberAndNetwork(event.url);

	// If the first segment of the domain is a number, send inscription contents
	if (number) {
		const path = event.url.pathname;
		const origin = event.url.host.split('.').pop();
		const protocol = event.url.protocol;
		const newRequest = new Request(
			`${protocol}//${origin}/api/site/${number}${path}`,
			event.request
		);
		return event.fetch(newRequest);
	}

	// Otherwise, continue to normal website routes
	const response = await resolve(event);
	return response;
};
