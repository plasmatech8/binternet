import { endpointsEnv } from '$lib/utils/apiEnv';
import axios, { type AxiosInstance } from 'axios';
import { JSDOM } from 'jsdom';

export type InscriptionDetails = {
	contentType: string;
	id: string;
	createdAt: Date;
	number: number;
};

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

	/**
	 * Get inscription details by its inscription number or ID.
	 */
	async fetchInscriptionDetails(number: number | string): Promise<InscriptionDetails> {
		const response = await this.client.get(`/inscription/${number}`, { responseType: 'text' });
		const doc = new JSDOM(response.data);
		// Get inscription number if using ID
		let inscriptionNumber: number;
		if (typeof number === 'number') {
			inscriptionNumber = number;
		} else {
			const inscriptionNumberString = doc.window.document.title.split(' ').pop();
			if (!inscriptionNumberString) throw Error('Inscription number cannot be found');
			inscriptionNumber = parseInt(inscriptionNumberString);
		}
		// Get inscription details from data list
		const dl = doc.window.document.querySelector('dl');
		if (!dl) throw Error('Failed to read inscription data.');
		const dtElements = dl.querySelectorAll('dt');
		let contentType: string | undefined;
		let id: string | undefined;
		let createdAt: Date | undefined;
		dtElements.forEach((dt) => {
			const dd = dt.nextElementSibling;
			if (dd && dt.innerHTML === 'content type') {
				contentType = dd.innerHTML;
			}
			if (dd && dt.innerHTML === 'id') {
				id = dd.innerHTML;
			}
			if (dd && dt.innerHTML === 'timestamp' && dd?.firstElementChild?.innerHTML) {
				createdAt = new Date(dd.firstElementChild.innerHTML);
			}
		});
		if (!contentType) throw Error('Content type cannot be found.');
		if (!id) throw Error('Inscription ID cannot be found.');
		if (!createdAt) throw Error('Timestamp cannot be found.');
		// Construct details object
		return { contentType, id, createdAt, number: inscriptionNumber };
	}

	/**
	 * Get inscription content data URL by its inscription ID.
	 * NOTE: Complex inscriptions will not work. Must be a simple file data inscription.
	 */
	async fetchInscriptionContent(id: string) {
		const res = await this.client.get(`/content/${id}`, { responseType: 'arraybuffer' });
		return res;
	}
}
