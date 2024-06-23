import axios from 'axios';
import type { InscriptionDetailsList } from './backend/types';

export class BInternetClient {
	/**
	 * Fetch the resource from a BInternet site based on inscription number of the router file and
	 * the path with corresponds to a route in the router.
	 */
	async fetchSiteResource(number: number, path: string) {
		return await axios.get<ArrayBuffer>(`/api/site/${number}${path}`, {
			responseType: 'arraybuffer'
		});
	}

	/**
	 * Get the balance of an address in SATs.
	 */
	async getAddressBalance(address: string) {
		return axios.get<number>(`/api/address/${address}/balance`);
	}

	/**
	 * Fetch inscription contents by inscription number.
	 */
	async getInscriptionContent(number: number) {
		return axios.get<ArrayBuffer>(`/api/inscription/${number}/content`, {
			responseType: 'arraybuffer'
		});
	}

	/**
	 * Get list of inscriptions for an address, filtered by parameters.
	 */
	async getInscriptionListByAddress(
		address: string,
		options?: {
			limit?: number;
			offset?: number;
			mimeType?: string;
		}
	) {
		return axios.get<InscriptionDetailsList>(`/api/address/${address}/inscriptions`, {
			params: options
		});
	}
}
