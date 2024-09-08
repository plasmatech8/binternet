import { BInternetServerClient } from '$lib/backend-api/binternet';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const postSchema = z.object({
	number: z.number(),
	title: z.string()
});

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		// Params
		const body = await request.json();
		const { number, title } = postSchema.parse(body);

		// Save to DB
		const client = new BInternetServerClient(platform);
		client.saveSite(number, title);

		return json({});
	} catch (err) {
		if (err instanceof z.ZodError) {
			// Handle validation error
			return json({ error: 'Invalid data', issues: err.errors }, { status: 400 });
		}
		console.error('Failed to save site', err);
		error(500, 'Failed to save site');
	}
};
