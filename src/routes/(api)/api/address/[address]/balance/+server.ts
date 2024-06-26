import { BInternetServerClient } from '$lib/backend-api/binternet';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

const cacheTimeoutSeconds = 10; // cache in browser for 10 seconds

export const GET: RequestHandler = async ({ params }) => {
	// Params
	const address = params.address as string;
	if (!address) error(400, 'Address parameter is required');

	const client = new BInternetServerClient();

	// Fetch address balance
	try {
		const res = await client.getAddressBalance(address);
		return json(res, {
			headers: { 'cache-control': `max-age=${cacheTimeoutSeconds}` }
		});
	} catch (e) {
		if (axios.isAxiosError(e) && e.response?.status === 400) error(400, e.response.data);
		console.error('Failed to get address balance', e);
		error(500, 'Failed to get address balance');
	}
};
