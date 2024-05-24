/**
 * Extract inscription number (if exists) and network intended for this URL.
 */
function extractNumberAndNetwork(url: URL) {
	const domain = url.host;
	const regex = /^(\d+)?\.?(mainnet|testnet)?/;
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
		const { number, network } = extractNumberAndNetwork(url);

		// Rewrite the URL to point to inscription contents
		const targetUrl = `https://binternet.org/api/${network}/inscription/${number}`;

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
