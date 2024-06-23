import { BInternetServerClient } from '$lib/api/backend/binternet';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const cacheTimeoutSeconds = 10; // cache in browser for 10 seconds

export const GET: RequestHandler = async ({ params, url }) => {
	// Params
	const address = params.address as string;
	const limit = parseInt(url.searchParams.get('limit') ?? '20');
	const offset = parseInt(url.searchParams.get('offset') ?? '0');
	if (!address) error(400, 'Address parameter is required');

	const client = new BInternetServerClient();

	// Fetch inscription details
	try {
		const res = await client.getInscriptionListByAddress(address, {
			limit,
			offset
		});
		return json(res, {
			headers: { 'cache-control': `max-age=${cacheTimeoutSeconds}` }
		});
	} catch (e) {
		console.error('Failed to get inscription list', e);
		error(500, 'Failed to get inscription list');
	}
};
