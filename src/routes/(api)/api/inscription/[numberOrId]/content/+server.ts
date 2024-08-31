import { BInternetServerClient } from '$lib/backend-api/binternet';
import { error, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

const cacheTimeoutSeconds = 86400 * 30; // cache in browser for 30 days

export const GET: RequestHandler = async ({ params, platform }) => {
	// Params
	const rawNumberOrId = params.numberOrId;
	if (!rawNumberOrId) error(400, 'Invalid inscription number or ID');
	const numberOrId = rawNumberOrId.match(/^\d+$/) ? parseInt(rawNumberOrId) : rawNumberOrId;
	if (typeof numberOrId === 'number' && isNaN(numberOrId)) error(400, 'Invalid inscription number');

	const client = new BInternetServerClient(platform);

	// Fetch and return inscription content
	try {
		const { data, contentType } = await client.getInscriptionContent(numberOrId);
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
