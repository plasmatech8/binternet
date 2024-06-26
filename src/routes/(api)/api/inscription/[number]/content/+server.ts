import { BInternetServerClient } from '$lib/backend-api/binternet';
import { isNetwork } from '$lib/utils/validators';
import { error, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

type Network = 'mainnet' | 'testnet';

const cacheTimeoutSeconds = 86400 * 30; // cache in browser for 30 days

export const GET: RequestHandler = async ({ params }) => {
	// Params
	const number = parseInt(params.number ?? '');
	const network = params.network as Network;
	if (!isNetwork(network)) error(400, 'Invalid network');
	if (isNaN(number)) error(400, 'Invalid inscription number');

	const client = new BInternetServerClient();

	// Fetch and return inscription content
	try {
		const { data, contentType } = await client.getInscriptionContent(number);
		const headers = {
			'cache-control': `public, max-age=${cacheTimeoutSeconds}, immutable`,
			...(contentType && { 'Content-Type': contentType })
		};
		return new Response(data, { headers });
	} catch (e) {
		if (axios.isAxiosError(e) && e.response?.status === 404) error(404, 'Inscription not found');
		console.error('Error getting inscription content', e);
		error(500, 'Failed to get inscription content');
	}
};
