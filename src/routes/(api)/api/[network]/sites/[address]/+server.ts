import { parseRouter } from '$lib/api/binternet';
import { getInscriptionList } from '$lib/api/hiro';
import { getInscriptionContent, getInscriptionDetails } from '$lib/api/ordinals';
import { isNetwork } from '$lib/utils/validators';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

type Network = 'mainnet' | 'testnet';

const cacheTimeoutSeconds = 20; // cache in browser for 20 seconds

/**
 * This API exists because it is currently difficult to get inscriptions for a specific address.
 *
 * - The sats-connect "ord_getInscriptions" endpoint is still "Coming Soon" and is not available
 * - The Hiro API returns and utilizes the incorrect inscription number in all requests/responses
 * - The Hiro API might fail for some inscriptions
 * - Ordinals site does not provide a list of inscriptions for an address, plus JSDOM does not work in the browser
 */
export const GET: RequestHandler = async ({ params, url }) => {
	// Params
	const network = params.network as Network;
	const address = params.address as string;
	const limit = parseInt(url.searchParams.get('limit') ?? '20');
	const offset = parseInt(url.searchParams.get('offset') ?? '0');
	if (!isNetwork(network)) error(400, 'Invalid network');
	if (!address) error(400, 'Address query string parameter is required');
	if (network !== 'mainnet') {
		error(400, 'Only mainnet currently supported for inscription list requests');
	}

	// Fetch inscription details
	try {
		const res = await getInscriptionList(network, {
			address,
			limit,
			offset,
			mimeType: 'application/x-yaml'
		});
		const results = await Promise.all(
			res.results.map(async (insc) => {
				try {
					const content = await getInscriptionContent(network, insc.id);
					const router = parseRouter(content);
					const details = await getInscriptionDetails(network, insc.id);
					return { router, details };
				} catch (error) {
					console.error('Failed to get inscription:', insc.id, error);
					// return { router: { routes: {} }, details: { number: Math.random() } };
				}
			})
		);
		const output: WalletSites = {
			...res,
			results: results.filter((v): v is WalletSites['results'][number] => !!v)
		};
		return json(output, {
			headers: { 'cache-control': `max-age=${cacheTimeoutSeconds}` }
		});
	} catch (e) {
		console.error('Error getting inscription list', e);
		if (axios.isAxiosError(e) && e.response?.status === 404) error(404, 'Inscription not found');
		error(500, 'Failed to get inscription list');
	}
};
