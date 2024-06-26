import { BInternetServerClient } from '$lib/backend-api/binternet';
import { error, type RequestHandler } from '@sveltejs/kit';

const cacheTimeoutSeconds = 86400 * 30; // cache in browser for 30 days

export const GET: RequestHandler = async ({ params }) => {
	// Params
	const number = parseInt(params.number ?? '');
	const path = '/' + (params.path ?? '');
	if (isNaN(number)) error(400, 'Invalid inscription number');

	const client = new BInternetServerClient();

	// Fetch and return inscription content
	try {
		const { data, contentType } = await client.fetchSiteResource(number, path);
		const headers = {
			'cache-control': `public, max-age=${cacheTimeoutSeconds}, immutable`,
			...(contentType && { 'Content-Type': contentType })
		};
		return new Response(data, { headers });
	} catch (e) {
		if (e instanceof Error && e.message === 'Route not found') error(404, 'Not Found');
		console.error('Failed to get inscription content', e);
		error(500, 'Failed to get inscription content');
	}
};
