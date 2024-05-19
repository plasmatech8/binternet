import { getInscriptionContent } from '$lib/api/ordinals';
import { isInscriptionId, isNetwork } from '$lib/utils/validators';
import { error, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

type Network = 'mainnet' | 'testnet';

const cacheTimeoutSeconds = 86400 * 30; // cache in browser for 30 days

export const GET: RequestHandler = async ({ params }) => {
	// Params
	const id = params.id as string;
	const network = params.network as Network;
	if (!isNetwork(network)) error(400, 'Invalid network');
	if (!isInscriptionId(id)) error(400, 'Invalid inscription ID');

	// Fetch data
	try {
		const body = await getInscriptionContent(network, id);
		const headers = { 'cache-control': `max-age=${cacheTimeoutSeconds}` };
		return new Response(body, { headers });
	} catch (e) {
		console.error(e);
		if (axios.isAxiosError(e) && e.response?.status === 404) {
			throw error(404, 'Inscription not found');
		}
		throw error(500, 'Failed to get inscription content');
	}
};
