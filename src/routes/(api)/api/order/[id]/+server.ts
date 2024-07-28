import { OrdinalsBot } from '$lib/backend-api/sources/ordinalsBot';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const GET: RequestHandler = async ({ params }) => {
	// Params
	const client = new OrdinalsBot();
	const id = params.id as string;

	try {
		// Call external API
		const resData = await client.getOrderStatus(id);
		if (resData.status === 'error') {
			if (resData.error === 'invalid orderId') return error(400, 'Invalid Order ID');
			return error(500, 'Failed to get order status from external');
		}
		// Return data
		return json(resData);
	} catch (e) {
		if (e instanceof z.ZodError) {
			return json({ success: false, errors: e.errors }, { status: 400 });
		}
		console.error('Failed to get order status', e);
		error(500, 'Failed to get order status');
	}
};
