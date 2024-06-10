import { error } from '@sveltejs/kit';
import { getInscriptionContent, getInscriptionDetails } from './ordinals';
import yaml from 'js-yaml';
import { z } from 'zod';

type Network = 'mainnet' | 'testnet';

const routerSchema = z.object({
	binternet: z.enum(['v1']),
	routes: z.record(z.string(), z.number())
});

export function parseRouter(contents: ArrayBuffer) {
	const text = new TextDecoder('utf-8').decode(contents);
	try {
		const object = yaml.load(text);
		return routerSchema.parse(object);
	} catch (e) {
		console.error(e);
		throw Error('Failed to parse router.');
	}
}

/**
 * Fetch the page/file from a binternet site based on inscription number of the router file and
 * the path with corresponds to a route in the router.
 * @param network Network. Mainnet or testnet.
 * @param number Inscription number of the router file.
 * @param path Resource path in the URL which corresponds to a route in the router.
 */
export async function fetchSiteData(network: Network, number: number, path: string) {
	// Inscription must be a router (YAML file)
	const { id } = await getInscriptionDetails(network, number);
	const content = await getInscriptionContent(network, id);
	const router = parseRouter(content);
	console.log(router, path);

	const routeInscriptionNumber = router.routes[path];
	if (routeInscriptionNumber === undefined) throw error(404, 'Not Found');
	const { id: routeInscriptionId, contentType } = await getInscriptionDetails(
		network,
		routeInscriptionNumber
	);
	const routeInscriptionContent = await getInscriptionContent(network, routeInscriptionId);
	return { content: routeInscriptionContent, contentType };
}
