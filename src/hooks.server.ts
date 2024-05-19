import { getInscriptionContent } from '$lib/api/ordinals';
import { error, type Handle } from '@sveltejs/kit';
export const handle: Handle = async ({ event, resolve }) => {
	// If in a subdomain, handle routing to an inscription or site
	const subdomainParts = event.url.hostname.split('.').slice(0, -1);
	if (subdomainParts.length) {
		if (subdomainParts.length > 1) error(400, 'Invalid subdomain');
		const subdomain = subdomainParts[0];

		// !@#@$
		// Subdomain is max length 63 characters.
		// TODO: Must use inscription number instead of inscription genesis id
		const content = await getInscriptionContent('mainnet', subdomain);
		return new Response(content);
	}
	// If not in a subdomain, continue to normal SvelteKit routes
	const response = await resolve(event);
	return response;
};
