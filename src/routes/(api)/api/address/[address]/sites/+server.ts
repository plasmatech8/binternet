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
			offset,
			mimeType: 'application/x-yaml'
		});
		const results = await Promise.all(
			res.results.map(async ({ number }) => {
				try {
					const { data } = await client.getInscriptionContent(number);
					const router = client.parseRouter(data);
					const details = await client.getInscriptionDetails(number);
					return { router, details };
				} catch (error) {
					console.error('Failed to get inscription:', number, error);
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
		error(500, 'Failed to get inscription list');
	}
};
