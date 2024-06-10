// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
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
