import { HIRO_API_URL, HIRO_API_KEY, ORD_API_URL, MEMPOOL_API_URL } from '$env/static/private';
import { z } from 'zod';

// Validate JSON environment variables
const urlSchema = z.string().url();

// Return environment variables
export const endpointsEnv = {
	hiroApiUrl: urlSchema.parse(HIRO_API_URL),
	hiroApiKey: HIRO_API_KEY ?? undefined,
	ordApiUrl: urlSchema.parse(ORD_API_URL),
	mempoolApiUrl: urlSchema.parse(MEMPOOL_API_URL)
};
