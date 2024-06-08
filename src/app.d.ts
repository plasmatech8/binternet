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
	binternet: string;
	routes: { [path: string]: number };
}

interface Site {
	number: number;
	id: string;
	router: Router;
}
