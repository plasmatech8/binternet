import {
	OrdinalsBot,
	ordinalsBotInscriptionOrderRequestSchema
} from '$lib/backend-api/sources/ordinalsBot';
import { json, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';
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
		const err = e as { response?: { status: string; data?: { error?: { msg: string }[] } } };
		console.error(err);
		if (err?.response?.data?.error) {
			return json(
				{ success: false, errors: err.response.data.error.map((de) => de.msg) },
				{ status: 400 }
			);
		}
		if (err instanceof SyntaxError) {
			return json({ success: false, errors: ['Request body must not be empty'] }, { status: 400 });
		}
		if (err instanceof z.ZodError) {
			return json(
				{ success: false, errors: err.errors.map((ze) => `${ze.message} "${ze.path}"`) },
				{ status: 400 }
			);
		}
		if (axios.isAxiosError(err)) {
			return json(
				{ errors: `Failed to create inscription order: ${err.message}` },
				{ status: 500 }
			);
		}
		console.error('Failed to create inscription order', e);
		return json(
			{ errors: `Failed to create inscription order: ${err?.response?.status}` },
			{ status: 500 }
		);
	}
};
