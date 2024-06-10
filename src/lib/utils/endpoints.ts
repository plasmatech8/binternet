import {
	PUBLIC_HIRO_MAINNET_ENDPOINT,
	PUBLIC_ORDINALS_MAINNET_ENDPOINTS,
	PUBLIC_ORDINALS_TESTNET_ENDPOINTS,
	PUBLIC_MEMPOOL_MAINNET_ENDPOINT
} from '$env/static/public';
import { z } from 'zod';

// Validate JSON environment variables
const urlSchema = z.string().url();
const urlArraySchema = z.array(urlSchema);

// Return environment variables
export const endpointsEnv = {
	hiroEndpoints: {
		mainnet: urlSchema.parse(PUBLIC_HIRO_MAINNET_ENDPOINT)
	},
	ordinalsEndpoints: {
		mainnet: urlArraySchema.parse(JSON.parse(PUBLIC_ORDINALS_MAINNET_ENDPOINTS)),
		testnet: urlArraySchema.parse(JSON.parse(PUBLIC_ORDINALS_TESTNET_ENDPOINTS))
	},
	mempoolEndpoints: {
		mainnet: urlSchema.parse(PUBLIC_MEMPOOL_MAINNET_ENDPOINT)
	}
};
