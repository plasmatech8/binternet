/*
 * Cloudflare Pages does not currently support wildcard subdomains,
 * so a Cloudflare worker needs to be created to redirect requests from
 * subdomains to the Pages site.
 */

/**
 * Extract inscription number (if exists) and network intended for this URL.
 */
function extractNumberAndNetwork(url: URL) {
	const domain = url.host;
	const regex = /^(\d+)?\.?(mainnet|testnet|signet)?/;
	const match = domain.match(regex);
	if (!match) return null;
	const [, number, network] = match;
	return {
		number: number || null,
		network: network || 'mainnet'
	};
}

/**
 * A worker which acts as a proxy from a subdomain to inscription contents.
 */
export default {
	async fetch(request: Request) {
		// Extract the URL information
		const url = new URL(request.url);

		// If it is not a domain name, return placeholder content
		if (url.host.endsWith('.workers.dev')) {
			return new Response('Cannot access sites from worker domain');
		}

		// Extract network and inscription number (for a router) if exists
		const { number, network } = extractNumberAndNetwork(url)!;
		const path = url.pathname;

		// Rewrite the URL to point to inscription contents
		const networkSegment = network === 'mainnet' ? '' : `${network}.`;
		const targetUrl = `https://${networkSegment}binternet.org/api/site/${number}${path}`;

		// Fetch the response from the target URL
		const response = await fetch(targetUrl, {
			method: request.method,
			headers: request.headers,
			body: request.body
		});

		// Return the response
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	}
};
