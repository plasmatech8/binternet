import { endpointsEnv } from '$lib/utils/apiEnv';
import axios, { type AxiosInstance } from 'axios';

export interface OrdinalsBotInscriptionOrderRequest {
	receiveAddress: string;
	files: {
		size: number;
		type: string;
		name: string;
		dataURL: string;
	}[];
	lowPostage: boolean;
	fee: number;
}

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
		completed: boolean;
		inscriptionId: string;
		name: string;
		processing: boolean;
		s3Key: string;
		sent: string;
		size: number;
		status: string;
		tx: {
			inscription: string;
			reveal: string;
			totalFees: number;
			updatedAt: number;
		};
		type: string;
		url: string;
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

export class OrdinalsBot {
	static apiUrl = endpointsEnv.ordinalsBotApiUrl;
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
	 * Create an inscription order.
	 */
	async createInscriptionOrder(
		data: OrdinalsBotInscriptionOrderRequest
	): Promise<OrdinalsBotInscriptionOrderResponse> {
		const res = await this.client.post<OrdinalsBotInscriptionOrderResponse>(`/inscribe`, data);
		return res.data;
	}

	/**
	 * Get the status of an inscription order by ID.
	 */
	async getOrderStatus(id: string): Promise<OrdinalsBotOrderStatusResponse> {
		const res = await this.client.get<OrdinalsBotOrderStatusResponse>(`/order`, { params: { id } });
		return res.data;
	}
}
