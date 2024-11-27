declare namespace App {
	interface Platform {
		env: {
			KV: KVNamespace;
			DB: D1Database;
			BK: R2Bucket;
		};
	}
}

interface InscriptionFile {
	id: string;
	type: 'new' | 'existing';
	path: string;
	new?: {
		filename: string;
		filepath: string;
		size: number;
		data: ArrayBuffer;
		base64: string;
		number?: number;
		contentType: string;
		orderFilename: string;
	};
	existing?: {
		number: number | undefined;
		contentType: string;
		contentSize: number;
	};
	inscribing?: {
		orderId: string;
		txnId?: string;
		inscriptionId?: string;
	};
}

interface Router {
	binternet: 'v1';
	routes: { [path: string]: number };
}

interface Site {
	number: number;
	createdAt: string;
	router: Router;
}

interface WalletSites {
	results: WalletSitesResult[];
	limit: number;
	offset: number;
	total: number;
}

interface WalletSitesResult {
	router: Router;
	details: {
		number: number;
		id: string;
		contentType: string;
		inscribedAt: Date;
	};
}
