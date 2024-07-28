import {
	OrdinalsBot,
	ordinalsBotInscriptionOrderRequestSchema
} from '$lib/backend-api/sources/ordinalsBot';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request }) => {
	// Params
	const client = new OrdinalsBot();

	try {
		// Get JSON input
		const rawData = await request.json();
		const data = ordinalsBotInscriptionOrderRequestSchema.parse(rawData);

		// Call external API
		const resData = await client.createInscriptionOrder(data);
		return json(resData);
	} catch (e) {
		if ((e as { response?: { data?: { error?: string } } })?.response?.data?.error) {
			return error(400, 'Error in order data');
		}
		if (e instanceof SyntaxError) {
			return error(400, 'Request body must not be empty');
		}
		if (e instanceof z.ZodError) {
			return json({ success: false, errors: e.errors }, { status: 400 });
		}
		console.error('Failed to create inscription order', e);
		error(500, 'Failed to create inscription order');
	}
};
