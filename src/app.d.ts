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
		number?: number;
		contentType: string;
	};
	existing?: {
		number: number | undefined;
		contentType: string;
		contentSize: number;
	};
	inscribing?: {
		txnId: string;
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
	results: {
		router: Router;
		details: InscriptionDetails;
	}[];
	limit: number;
	offset: number;
	total: number;
}
