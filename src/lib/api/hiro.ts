import axios from 'axios';
import yaml from 'js-yaml';

export interface InscriptionsResponse {
	limit: number;
	offset: number;
	total: number;
	results: Inscription[];
}

export interface Inscription {
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

const apiClient = axios.create({
	baseURL: 'https://api.hiro.so/ordinals/v1', // Base URL for the API
	headers: {
		'Content-Type': 'application/json'
	}
});

/**
 * Get a list of inscriptions owned by a user by their address.
 */
export async function getInscriptions(address: string): Promise<InscriptionsResponse> {
	try {
		const response = await apiClient.get(`/inscriptions`, { params: { address } });
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.message);
			throw new Error('Failed to fetch inscriptions');
		} else {
			console.error('Unexpected error:', error);
			throw new Error('An unexpected error occurred');
		}
	}
}

/**
 * Get the inscription details by inscription ID or sat number.
 */
export async function getInscription(id: string | number): Promise<Inscription> {
	try {
		const response = await apiClient.get(`/inscriptions/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.message);
			throw new Error('Failed to fetch inscription');
		} else {
			console.error('Unexpected error:', error);
			throw new Error('An unexpected error occurred');
		}
	}
}

/**
 * Get the inscription content data URL by its inscription ID.
 * (cannot use sat number because Hiro API fails on some inscriptions)
 */
export function getInscriptionContentUrl(id: string): string {
	return apiClient.getUri({ url: `/inscriptions/${id}/content` });
}

/**
 * Get inscription content data URL by its inscription ID.
 * (cannot use sat number because Hiro API fails on some inscriptions)
 */
export async function getInscriptionContentObject(id: string): Promise<object> {
	try {
		// Use 'text' responseType to handle different formats
		const response = await apiClient.get(`/inscriptions/${id}/content`, { responseType: 'text' });

		// Check the content type to decide how to parse it
		const contentType = response.headers['content-type'];
		if (contentType.includes('application/json')) {
			return JSON.parse(response.data);
		} else if (contentType.includes('application/x-yaml') || contentType.includes('text/yaml')) {
			return yaml.load(response.data) as object;
		} else {
			throw new Error('Unsupported content type');
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.message);
			throw new Error('Failed to fetch inscription content');
		} else {
			console.error('Unexpected error:', error);
			throw new Error('An unexpected error occurred');
		}
	}
}
