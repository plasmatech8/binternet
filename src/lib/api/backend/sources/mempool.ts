import { endpointsEnv } from '$lib/utils/apiEnv';
import axios, { type AxiosInstance } from 'axios';

export interface AddressInfo {
	address: string;
	chain_stats: {
		funded_txo_count: number;
		funded_txo_sum: number;
		spent_txo_count: number;
		spent_txo_sum: number;
		tx_count: number;
	};
	mempool_stats: {
		funded_txo_count: number;
		funded_txo_sum: number;
		spent_txo_count: number;
		spent_txo_sum: number;
		tx_count: number;
	};
}

export class Mempool {
	static apiUrl = endpointsEnv.hiroApiUrl;
	client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: Mempool.apiUrl,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	/**
	 * Get the balance of an address in SATs.
	 */
	async getAddressBalance(address: string) {
		const res = await this.client.get(`/address/${address}`);
		const data = res.data as AddressInfo;
		const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
		return balance;
	}
}
