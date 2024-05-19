import axios from 'axios';

const endpoints = {
	mainnet: 'https://explorer.ordinalsbot.com',
	testnet: 'https://testnet-explorer.ordinalsbot.com/'
	// mainnet: 'https://ordinals.com',
	// testnet: 'https://testnet.ordinals.com'
};
type Network = keyof typeof endpoints;

function getClient(network: Network) {
	const baseURL = endpoints[network];
	return axios.create({ baseURL });
}

/**
 * Get the inscription content data URL by its inscription ID.
 */
export function getInscriptionContentUrl(network: Network, id: string): string {
	const client = getClient(network);
	return client.getUri({ url: `/content/${id}` });
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
