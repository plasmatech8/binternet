import axios from 'axios';
import type { InscriptionDetailsList } from './backend-api/types';

export async function fetchInscriptionList(
	address: string,
	params: { offset: number; limit: number; contentType?: string }
) {
	const x = await axios.get<InscriptionDetailsList>(`/api/address/${address}/inscriptions`, {
		params
	});
	return x.data;
}

export async function getAddressBalance(address: string) {
	const res = await axios.get<number>(`/api/address/${address}/balance`);
	return res.data;
}

export async function fetchSiteList(
	address: string,
	{ offset, limit }: { offset: number; limit: number }
) {
	const url = `/api/address/${address}/sites`;
	const { data } = await axios.get<WalletSites>(url, { params: { limit, offset } });
	return data;
}
