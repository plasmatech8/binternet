import type { OrdinalsBotOrderStatusResponse } from '$lib/backend-api/sources/ordinalsBot';
import { localStorageStore } from '@skeletonlabs/skeleton';

export const orderHistoryStore = localStorageStore<OrdinalsBotOrderStatusResponse[]>(
	'orderHistory',
	[]
);
