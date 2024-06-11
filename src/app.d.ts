import type { KVNamespace } from '@cloudflare/worker-types/experimental';

declare global {
	namespace App {
		interface Platform {
			env: {
				INSCRIPTION_NUM_TO_ID: KVNamespace;
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
		};
		existing?: {
			number: number | undefined;
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
}
