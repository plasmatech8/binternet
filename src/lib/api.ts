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
