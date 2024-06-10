import { endpointsEnv } from '$lib/utils/endpoints';
import axios, { isAxiosError, type AxiosInstance } from 'axios';
import { JSDOM } from 'jsdom';

const endpoints = endpointsEnv.ordinalsEndpoints;
type Network = keyof typeof endpoints;

export type InscriptionDetails = {
	contentType: string;
	id: string;
	createdAt: Date;
	number: number;
};

let currentClient: AxiosInstance | undefined;
let currentNetwork: string | undefined;
let currentEndpoints: string[] = [];

function getClient(network: Network) {
	if (network === currentNetwork && currentClient) return currentClient;
	currentEndpoints = [...endpoints[network]];
	const baseURL = currentEndpoints.pop();
	currentClient = axios.create({ baseURL, timeout: 1000 });
	currentClient.interceptors.response.use(
		(res) => res,
		(err) => {
			if (isAxiosError(err)) {
				const baseURL = currentEndpoints.pop();
				const { config } = err;
				if (!baseURL || !config) return Promise.reject(err);
				config.baseURL = baseURL;
				currentClient = axios.create({ baseURL, timeout: 1000 });
				return currentClient(config);
			}
			return Promise.reject(err);
		}
	);
	return currentClient;
}

/**
 * Get inscription details by its inscription number or ID.
 */
export async function getInscriptionDetails(
	network: Network,
	number: number | string
): Promise<InscriptionDetails> {
	const client = getClient(network);
	const response = await client.get(`/inscription/${number}`, { responseType: 'text' });
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
export async function getInscriptionContent(network: Network, id: string) {
	const client = getClient(network);
	const response = await client.get(`/content/${id}`, { responseType: 'arraybuffer' });
	return response.data;
}
