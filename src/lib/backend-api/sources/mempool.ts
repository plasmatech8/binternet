import { endpointsEnv } from '$lib/utils/apiEnv';
import axios, { type AxiosInstance } from 'axios';

export interface MempoolAddressInfo {
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
export interface MempoolRecommendedFees {
	fastestFee: number;
	halfHourFee: number;
	hourFee: number;
	economyFee: number;
	minimumFee: number;
}

export interface MempoolBitcoinPrice {
	time: number;
	USD: number;
	EUR: number;
	GBP: number;
	CAD: number;
	CHF: number;
	AUD: number;
	JPY: number;
}

export class Mempool {
	static apiUrl = endpointsEnv.mempoolApiUrl;
	client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: Mempool.apiUrl,
			headers: {
				'Content-Type': 'application/json'
			},
			adapter: 'fetch'
		});
	}

	/**
	 * Get the balance of an address in SATs.
	 */
	async fetchAddressBalance(address: string): Promise<number> {
		const res = await this.client.get(`/address/${address}`);
		const data = res.data as MempoolAddressInfo;
		const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
		return balance;
	}

	/**
	 * Get the recommended fees.
	 */
	async fetchRecommendedFees(): Promise<MempoolRecommendedFees> {
		const res = await this.client.get(`/v1/fees/recommended`);
		return res.data as MempoolRecommendedFees;
	}

	/**
	 * Get the BTC price.
	 */
	async fetchBitcoinPrice(): Promise<MempoolBitcoinPrice> {
		const res = await this.client.get(`/v1/prices`);
		return res.data as MempoolBitcoinPrice;
	}
}
