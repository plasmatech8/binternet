import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	console.log(params);
	return new Response();
};

// Get inscription details
// Find details in D1, if not present, then fetch and store details + content into cloudflare
