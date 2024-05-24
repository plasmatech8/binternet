import { extractNumberAndNetwork } from '$lib/utils/network';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ resolve, event }) => {
	const { number, network, baseDomain } = extractNumberAndNetwork(event.url);
	// If the last part of the domain is a number, send inscription contents
	if (number) {
		const url = `http://${baseDomain}/api/${network}/inscription/${number}`;
		return await fetch(url);
	}
	// Otherwise, continue to normal website routes
	const response = await resolve(event);
	return response;
};
