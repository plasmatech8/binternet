import axios from 'axios';

const endpoints = {
	mainnet: 'https://api.hiro.so/ordinals/v1'
};
type Network = keyof typeof endpoints;

function getClient(network: Network) {
	const baseURL = endpoints[network];
	return axios.create({
		baseURL,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

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

/**
 * Get a list of inscriptions owned by a user by their address.
 */
export async function getInscriptions(
	network: Network,
	address: string
): Promise<InscriptionsDetailsResponse> {
	const client = getClient(network);
	const response = await client.get(`/inscriptions`, { params: { address } });
	return response.data;
}

/**
 * Get the inscription details by inscription ID or sat number.
 */
export async function getInscriptionDetails(
	network: Network,
	id: string | number
): Promise<InscriptionDetails> {
	const client = getClient(network);
	const response = await client.get(`/inscriptions/${id}`);
	return response.data;
}

/**
 * Get inscription content data URL by its inscription ID.
 * NOTE: Complex inscriptions will not work. Must be a simple file data inscription.
 */
export async function getInscriptionContent(network: Network, id: string) {
	const client = getClient(network);
	const response = await client.get(`/inscriptions/${id}/content`, { responseType: 'arraybuffer' });
	return response.data;
}
