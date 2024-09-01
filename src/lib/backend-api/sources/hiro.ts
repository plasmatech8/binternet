import { endpointsEnv } from '$lib/utils/apiEnv';
import axios, { type AxiosInstance } from 'axios';
import type { InscriptionContent, InscriptionDetails, InscriptionDetailsList } from '../types';

export interface HiroInscriptionsDetailsResponse {
	limit: number;
	offset: number;
	total: number;
	results: HiroInscriptionDetails[];
}

export interface HiroInscriptionDetails {
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

export interface HiroInscriptionListResponse {
	limit: number;
	offset: number;
	total: number;
	results: HiroInscriptionDetails[];
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

	convertInscription(insc: HiroInscriptionDetails): InscriptionDetails {
		return {
			id: insc.id,
			number: insc.number,
			contentType: insc.content_type,
			inscribedAt: new Date(insc.timestamp)
		};
	}

	/**
	 * Get the inscription details by inscription ID or number.
	 */
	async fetchInscriptionDetails(identifier: string | number): Promise<InscriptionDetails> {
		const res = await this.client.get<HiroInscriptionDetails>(`/inscriptions/${identifier}`);
		return this.convertInscription(res.data);
	}

	/**
	 * Get inscription content data URL by its inscription ID.
	 * NOTE: Complex inscriptions will not work. Must be a simple file data inscription.
	 */
	async fetchInscriptionContent(identifier: string | number): Promise<InscriptionContent> {
		const res = await this.client.get<ArrayBuffer>(`/inscriptions/${identifier}/content`, {
			responseType: 'arraybuffer'
		});
		const data = res.data;
		const contentType = res.headers['content-type']?.toString();
		return { data, contentType };
	}

	/**
	 * Get inscription list for an address.
	 */
	async fetchInscriptionList(
		address: string,
		options?: {
			limit?: number;
			offset?: number;
			mimeType?: string;
		}
	): Promise<InscriptionDetailsList> {
		const res = await this.client.get<HiroInscriptionListResponse>(
			`/inscriptions?address=${address}`,
			{
				responseType: 'json',
				params: {
					address,
					limit: options?.limit,
					offset: options?.offset,
					mime_type: options?.mimeType
				}
			}
		);
		return {
			...res.data,
			results: res.data.results.map(this.convertInscription)
		};
	}
}
