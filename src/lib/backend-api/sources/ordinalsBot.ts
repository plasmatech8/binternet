import { endpointsEnv } from '$lib/utils/apiEnv';
import axios, { type AxiosInstance } from 'axios';
import { z } from 'zod';

export const ordinalsBotInscriptionOrderRequestSchema = z.object({
	receiveAddress: z.string(),
	files: z.array(
		z.object({
			size: z.number(),
			type: z.string(),
			name: z.string(),
			dataURL: z.string()
		})
	),
	lowPostage: z.boolean(),
	fee: z.number()
});

export type OrdinalsBotInscriptionOrderRequest = z.infer<
	typeof ordinalsBotInscriptionOrderRequestSchema
>;

export interface OrdinalsBotInscriptionOrderResponse {
	id: string;
	charge: {
		amount: number;
	};
	chainFee: number;
	serviceFee: number;
	fee: number;
	baseFee: number;
	postage: number;
	additionalFeeCharged: number;
	files: {
		size: number;
		type: string;
		name: string;
		url: string;
		s3Key: string;
	}[];
	delegates: null;
	parents: null;
	inscriptionIdPrefix: null;
	allowedSatributes: null;
	additionalFee: null;
	lowPostage: boolean;
	referral: null;
	receiveAddress: string;
	webhookUrl: null;
	projectTag: null;
	zeroConf: null;
	status: string;
	orderType: string;
	state: string;
	createdAt: {
		'.sv': string;
	};
}

export interface OrdinalsBotOrderStatusResponse {
	error?: string;
	additionalFeeCharged: number;
	baseFee: number;
	chainFee: number;
	charge: {
		address: string;
		amount: number;
		callback_url: string;
	};
	completed: boolean;
	createdAt: number;
	fee: number;
	files: {
		name: string;
		s3Key: string;
		size: number;
		type: string;
		url: string;
		completed?: boolean;
		inscriptionId?: string;
		processing?: boolean;
		sent?: string;
		status?: string;
		tx?: {
			inscription: string;
			reveal: string;
			totalFees: number;
			updatedAt: number;
		};
	}[];
	id: string;
	inscribedCount: number;
	lowPostage: boolean;
	orderType: string;
	paid: boolean;
	parents: {
		depositAddress: string;
		inscriptionId: string;
		parentReturnTx: string;
		returnAddress: string;
		txid: string;
		value: number;
		vout: number;
	}[];
	postage: number;
	processing: boolean;
	receiveAddress: string;
	serviceFee: number;
	state: string;
	status: string;
}

export interface OrdinalsBotSearchResponse {
	status: string;
	count: number;
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	results: OrdinalsBotSearchResponseResult[];
}

export interface OrdinalsBotSearchResponseResult {
	txid: string;
	inputindex: string;
	inscriptionid: string;
	blockheight: string;
	contenttypestr: string;
	contenthash: string;
	contentlength: string;
	createdat: Date;
}

export class OrdinalsBot {
	static apiUrl = endpointsEnv.ordinalsBotApiUrl;
	static apiKey = endpointsEnv.ordinalsBotApiKey;
	client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: OrdinalsBot.apiUrl,
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': OrdinalsBot.apiKey
			}
		});
	}

	/**
	 * Create an inscription order.
	 */
	async createInscriptionOrder(
		data: OrdinalsBotInscriptionOrderRequest
	): Promise<OrdinalsBotInscriptionOrderResponse> {
		console.log(`OrdinalsBot - creating order for ${data.files.length} inscriptions`);

		// Post order request
		const res = await this.client.post<OrdinalsBotInscriptionOrderResponse>(`/inscribe`, data);
		return res.data;
	}

	/**
	 * Get the status of an inscription order by ID.
	 */
	async getOrderStatus(id: string): Promise<OrdinalsBotOrderStatusResponse> {
		console.log(`OrdinalsBot - getting order status for ID: ${id}`);

		// Get order status
		const res = await this.client.get<OrdinalsBotOrderStatusResponse>(`/order`, { params: { id } });
		return res.data;
	}

	/**
	 * Get inscription list by sha256 hash.
	 */
	async fetchInscriptionListByHash(
		hash: string,
		options?: {
			page?: number;
			itemsPerPage?: number;
		}
	): Promise<OrdinalsBotSearchResponse> {
		console.log(`OrdinalsBot - fetching list of inscriptions by hash: ${hash}`);

		// Fetch inscription list
		const res = await this.client.get<OrdinalsBotSearchResponse>(`/search`, {
			responseType: 'json',
			params: {
				hash,
				page: options?.page,
				itemsPerPage: options?.itemsPerPage
			}
		});
		// Do not bother converting because data returned does not include inscription number
		return res.data;
	}
}
