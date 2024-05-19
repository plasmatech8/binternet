import { error, type Handle } from '@sveltejs/kit';
export const handle: Handle = async ({ event, resolve }) => {
	// If in a subdomain, handle routing to an inscription or site
	const subdomainParts = event.url.hostname.split('.').slice(0, -1);
	if (subdomainParts.length) {
		if (subdomainParts.length > 1) error(400, 'Invalid subdomain');
		const subdomain = subdomainParts[0];
		console.log(subdomain);
		return new Response(`<p>Hello?!??! ${subdomain}</p>`);
	}
	console.log(event);
	const response = await resolve(event);
	return response;
};
