import { browser } from '$app/environment';
import type { MempoolBitcoinPrice, MempoolRecommendedFees } from '$lib/backend-api/sources/mempool';
import axios from 'axios';
import { writable } from 'svelte/store';

function useAPIPollingStore<T>(url: string) {
	const store = writable<T | null>(null, () => {
		if (!browser) return;
		const interval = setInterval(update, 20_000); // every 20 seconds
		return () => {
			clearInterval(interval);
		};
	});
	async function update() {
		const res = await axios.get<T>(url);
		store.set(res.data);
	}
	if (browser) update();
	return store;
}

function createBitcoinPriceStore() {
	return useAPIPollingStore<MempoolBitcoinPrice>('/api/price');
}

function createRecommendedFeeStore() {
	return useAPIPollingStore<MempoolRecommendedFees>('/api/fees');
}

export const bitcoinPriceStore = createBitcoinPriceStore();
export const recommendedFeeStore = createRecommendedFeeStore();
