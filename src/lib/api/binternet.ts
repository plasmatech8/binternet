import { getInscriptionContent } from './ordinals';
import yaml from 'js-yaml';
import { error } from '@sveltejs/kit';

type Network = 'mainnet' | 'testnet';

function parseContent(content: ArrayBuffer) {
	const text = new TextDecoder('utf-8').decode(content);
	try {
		return yaml.load(text);
	} catch (_) {
		try {
			return JSON.parse(text);
		} catch (_) {
			error(404, 'Invalid JSON or YAML');
		}
	}
}

export async function getSiteData(network: Network, id: string, path: string) {
	// Inscription must be a router (JSON/YAML)
	const content = await getInscriptionContent(network, id);
	const router = parseContent(content);
	console.log(router, path);

	// TODO:
	// If inscription is an Binternet index, then parse the contents and obtain the routes.
	// Then send response with the expected inscription from the index router.
	// If the inscription is just a normal file, return the file.
}
