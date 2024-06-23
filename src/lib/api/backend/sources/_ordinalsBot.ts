import axios, { type AxiosInstance } from 'axios';

interface OrdinalsBotSearchResponse<T> {
	status: string;
	count: number;
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	results: T[];
}

interface OrdinalsBotSearchHashInscriptionDetails {
	txid: string;
	inputindex: string;
	inscriptionid: string;
	blockheight: string;
	contenttypestr: string;
	contenthash: string;
	contentlength: string;
	createdat: string;
}

interface OrdinalsBotSearchAddressInscriptionDetails
	extends OrdinalsBotSearchHashInscriptionDetails {
	contenthash: string;
	contentstr: string;
	inscriptionnumber: string;
}

export class OrdinalsBot {
	static apiUrl = 'https://api.ordinalsbot.com/search'; //endpointsEnv.ordinalsBotApiUrl;
	client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: OrdinalsBot.apiUrl,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	/**
	 * Get inscriptions matching SHA256 hash.
	 */
	async fetchInscriptionsByHash(
		hash: string,
		options?: {
			page?: number;
			itemsPerPage?: number;
		}
	) {
		const page = options?.page;
		const itemsPerPage = options?.itemsPerPage;
		const res = await this.client.get<
			OrdinalsBotSearchResponse<OrdinalsBotSearchHashInscriptionDetails>
		>(`/search`, {
			params: { hash, page, itemsPerPage }
		});
		return res.data;
	}

	/**
	 * Get inscriptions owned by address.
	 */
	async fetchInscriptionsByAddress(
		address: string,
		options?: {
			page?: number;
			itemsPerPage?: number;
		}
	) {
		const page = options?.page;
		const itemsPerPage = options?.itemsPerPage;
		const res = await this.client.get<
			OrdinalsBotSearchResponse<OrdinalsBotSearchAddressInscriptionDetails>
		>(`/search`, {
			params: { address, page, itemsPerPage }
		});

		return res.data;
	}
}
