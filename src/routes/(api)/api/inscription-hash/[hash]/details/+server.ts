import { BInternetServerClient } from '$lib/backend-api/binternet';
import { OrdinalsBot } from '$lib/backend-api/sources/ordinalsBot';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, platform }) => {
	// Params
	const hash = params.hash;
	if (!hash) error(400, 'Invalid inscription hash');

	const ordinalsBot = new OrdinalsBot();
	const client = new BInternetServerClient(platform);

	// Fetch and return inscription details
	try {
		// Find inscription by hash
		const result = await ordinalsBot.fetchInscriptionListByHash(hash, { itemsPerPage: 1 });
		const inscription = result.results[0];
		if (!inscription) return json(null);

		// Get inscription details
		const details = await client.getInscriptionDetails(inscription.inscriptionid);
		return json(details);
	} catch (e) {
		console.error('Error getting inscription by hash', e);
		error(500, 'Failed to get inscription by hash');
	}
};
