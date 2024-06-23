import { BInternetServerClient } from '$lib/api/backend/binternet';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

const cacheTimeoutSeconds = 20; // cache in browser for 20 seconds

export const GET: RequestHandler = async ({ params, url, platform }) => {
	// Params
	const address = params.address as string;
	const limit = parseInt(url.searchParams.get('limit') ?? '20');
	const offset = parseInt(url.searchParams.get('offset') ?? '0');
	if (!address) error(400, 'Address query string parameter is required');

	// const hiro = new Hiro();
	// const cloudflare = new Cloudflare(platform!);
	const client = new BInternetServerClient(platform!);

	// // Fetch inscription details
	try {
		const res = await client.getInscriptionListByAddress(address, {
			limit,
			offset,
			mimeType: 'application/x-yaml'
		});
		const results = await Promise.all(
			res.data.results.map(async ({ number }) => {
				try {
					const { content } = await client.getInscriptionContent(number);
					const router = client.parseRouter(content);
					const details = await client.getInscriptionDetails(number);
					return { router, details };
				} catch (error) {
					console.error('Failed to get inscription:', number, error);
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
