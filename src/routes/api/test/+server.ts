import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ platform }) => {
	if (!platform) error(500, 'Platform is not defined.');
	await platform.env.INSCRIPTION_NUM_TO_ID.put('KEY', 'VALUE');
	const x = await platform.env.INSCRIPTION_NUM_TO_ID.get('KEY');
	console.log(x);
	return json({ x });
};
