import { BInternetServerClient } from '$lib/backend-api/binternet';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

const cacheTimeoutSeconds = 10; // cache in browser for 10 seconds

export const GET: RequestHandler = async () => {
	// Params
	const client = new BInternetServerClient();

	// Fetch recommended fees
	try {
		const res = await client.getRecommendedFees();
		return json(res, {
			headers: { 'cache-control': `max-age=${cacheTimeoutSeconds}` }
		});
	} catch (e) {
		if (axios.isAxiosError(e) && e.response?.status === 400) error(400, e.response.data);
		console.error('Failed to get recommended fees', e);
		error(500, 'Failed to get recommended fees');
	}
};
