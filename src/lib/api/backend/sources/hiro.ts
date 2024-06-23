import { endpointsEnv } from '$lib/utils/apiEnv';
import axios, { type AxiosInstance } from 'axios';

export interface InscriptionsDetailsResponse {
	limit: number;
	offset: number;
	total: number;
	results: InscriptionDetails[];
}

export interface InscriptionDetails {
	id: string;
	number: number;
	address: string;
	genesis_address: string;
	genesis_block_height: number;
	genesis_block_hash: string;
	genesis_tx_id: string;
	genesis_fee: string;
	genesis_timestamp: number;
	tx_id: string;
	location: string;
	output: string;
	value: string;
	offset: string;
	sat_ordinal: string;
	sat_rarity: string;
	sat_coinbase_height: number;
	mime_type: string;
	content_type: string;
	content_length: number;
	timestamp: number;
	curse_type: string;
	recursive: boolean;
	recursion_refs: null;
}

export interface InscriptionListResponse {
	limit: number;
	offset: number;
	total: number;
	results: InscriptionDetails[];
}

export class Hiro {
	static apiUrl = endpointsEnv.hiroApiUrl;
	static apiKey = endpointsEnv.hiroApiKey;
	client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: Hiro.apiUrl,
			headers: {
				'Content-Type': 'application/json',
				'x-hiro-api-key': Hiro.apiKey
			}
		});
	}

	/**
	 * Get the inscription details by inscription ID or number.
	 */
	async fetchInscriptionDetails(identifier: string | number) {
		const res = await this.client.get<InscriptionDetails>(`/inscriptions/${identifier}`);
		return res;
	}

	/**
	 * Get inscription content data URL by its inscription ID.
	 * NOTE: Complex inscriptions will not work. Must be a simple file data inscription.
	 */
	async fetchInscriptionContent(identifier: string | number) {
		const res = await this.client.get<ArrayBuffer>(`/inscriptions/${identifier}/content`, {
			responseType: 'arraybuffer'
		});
		return res;
	}

	/**
	 * Get inscription list for an address.
	 */
	async fetchInscriptionList({
		address,
		limit,
		offset,
		mimeType
	}: {
		address: string;
		limit?: number;
		offset?: number;
		mimeType?: string;
	}) {
		const res = await this.client.get<InscriptionListResponse>(`/inscriptions?address=${address}`, {
			responseType: 'json',
			params: {
				address,
				limit,
				offset,
				mime_type: mimeType
			}
		});
		return res;
	}
}
