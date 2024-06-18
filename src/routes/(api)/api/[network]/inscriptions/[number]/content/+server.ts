import {
	getInscriptionContent,
	getInscriptionDetails,
	type InscriptionDetails
} from '$lib/api/ordinals';
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

	// Fetch inscription details
	let details: InscriptionDetails | undefined;
	try {
		details = await getInscriptionDetails(network, number);
	} catch (e) {
		console.error('Error getting inscription details', e);
		if (axios.isAxiosError(e) && e.response?.status === 404) error(404, 'Inscription not found');
		error(500, 'Failed to get inscription details');
	}

	// Fetch and return inscription content
	try {
		const body = await getInscriptionContent(network, details.id);
		const headers = {
			'cache-control': `public, max-age=${cacheTimeoutSeconds}, immutable`,
			'Content-Type': details.contentType
		};
		return new Response(body, { headers });
	} catch (e) {
		// console.error('Error getting inscription content', e);
		if (axios.isAxiosError(e) && e.response?.status === 404) error(404, 'Inscription not found');
		error(500, 'Failed to get inscription content');
	}
};
