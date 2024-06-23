import axios, { type AxiosInstance } from 'axios';

interface OrdinalsBotSearchResponse {
	status: string;
	count: number;
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	results: {
		txid: string;
		inputindex: string;
		inscriptionid: string;
		blockheight: string;
		contenttypestr: string;
		contenthash: string;
		contentlength: string;
		createdat: string;
	}[];
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

	async fetchInscriptionsByHash(hash: string) {
		const res = await this.client.get<OrdinalsBotSearchResponse>(`/search`, { params: { hash } });
		return res;
	}
}
