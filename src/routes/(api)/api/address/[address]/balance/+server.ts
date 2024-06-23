import { RequestHandler, json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json({});
};
