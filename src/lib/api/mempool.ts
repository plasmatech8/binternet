import { endpointsEnv } from '$lib/utils/endpoints';
import axios from 'axios';

const endpoints = endpointsEnv.mempoolEndpoints;
type Network = keyof typeof endpoints;

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

function getClient(network: Network) {
	const baseURL = endpoints[network];
	return axios.create({
		baseURL,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

/**
 * Get the balance of an address in SATs.
 */
export async function getAddressBalance(network: Network, address: string) {
	const client = getClient(network);
	const res = await client.get(`/address/${address}`);
	const data = res.data as AddressInfo;
	const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
	return balance;
}
