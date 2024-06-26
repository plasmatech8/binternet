import { endpointsEnv } from '$lib/utils/apiEnv';
import axios, { type AxiosInstance } from 'axios';
import type { InscriptionContent, InscriptionDetails } from '../types';

export interface OrdInscriptionDetails {
	address: string;
	charms: string[];
	content_length: number;
	content_type: string;
	effective_content_type: string;
	fee: number;
	height: number;
	id: string;
	next: string;
	number: number;
	parents: string[];
	previous: string;
	rune: null;
	sat: number;
	satpoint: string;
	timestamp: number;
	value: number;
}

export class Ord {
	static apiUrl = endpointsEnv.ordApiUrl;
	client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: Ord.apiUrl,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	convertInscription(insc: OrdInscriptionDetails): InscriptionDetails {
		return {
			id: insc.id,
			number: insc.number,
			contentType: insc.content_type,
			createdAt: new Date(insc.timestamp * 1000),
			address: insc.address
		};
	}

	/**
	 * Get inscription details by its inscription number or ID.
	 */
	async fetchInscriptionDetails(number: number | string): Promise<InscriptionDetails> {
		const res = await this.client.get<OrdInscriptionDetails>(`/inscription/${number}`, {
			headers: { Accept: 'application/json' }
		});
		return this.convertInscription(res.data);
	}

	/**
	 * Get inscription content data URL by its inscription ID.
	 * NOTE: Complex inscriptions will not work. Must be a simple file data inscription.
	 */
	async fetchInscriptionContent(id: string): Promise<InscriptionContent> {
		const res = await this.client.get<ArrayBuffer>(`/content/${id}`, {
			responseType: 'arraybuffer'
		});
		const data = res.data;
		const contentType = res.headers['content-type']?.toString();
		return { data, contentType };
	}
}
