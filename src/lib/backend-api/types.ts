export interface InscriptionDetails {
	number: number;
	id: string;
	contentType: string;
	inscribedAt: Date;
}

export interface InscriptionContent {
	data: ArrayBuffer;
	contentType?: string;
	headers?: Headers;
}

export interface InscriptionDetailsList {
	limit: number;
	offset: number;
	results: InscriptionDetails[];
	total: number;
}
