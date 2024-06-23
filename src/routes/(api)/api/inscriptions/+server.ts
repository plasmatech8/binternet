import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const { address, hash, limit, offset } = getParams(url);
	console.log(address, hash, limit, offset);

	return new Response();
};

function getParams(url: URL) {
	const address = url.searchParams.get('address');
	const hash = url.searchParams.get('hash');
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	return {
		address: address ?? undefined,
		hash: hash ?? undefined,
		limit: limit ? parseInt(limit) : undefined,
		offset: offset ? parseInt(offset) : undefined
	};
}

// Get inscription list
// Only contains inscriptions that have been saved to the system...
// Needs:
// 1. to get all inscriptions that the user owns
// 2. get all inscriptions with the specified sha256 hash
