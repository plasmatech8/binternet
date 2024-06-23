import { z } from 'zod';
import { Hiro } from './sources/hiro';
import yaml from 'js-yaml';
import { Ord } from './sources/ord';
import { Mempool } from './sources/mempool';

export interface Content {}

export class BInternetServerClient {
	/**
	 * Parse a router inscription in form of ArrayBuffer.
	 */
	parseRouter(contents: ArrayBuffer) {
		const routerSchema = z.object({
			binternet: z.enum(['v1']),
			routes: z.record(z.string(), z.number())
		});
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
	 * Fetch the resource from a BInternet site based on inscription number of the router file and
	 * the path with corresponds to a route in the router.
	 */
	async fetchSiteResource(number: number, path: string) {
		// Inscription must be a router (YAML file)
		const { data } = await this.getInscriptionContent(number);
		const router = this.parseRouter(data);

		// Get resource from route
		const resourceInscriptionNumber = router.routes[path];
		if (resourceInscriptionNumber === undefined) throw Error('Route not found');
		const resourceRes = await this.getInscriptionContent(resourceInscriptionNumber);

		// Return data
		return resourceRes;
	}

	/**
	 * Get the balance of an address in SATs.
	 */
	async getAddressBalance(address: string) {
		const client = new Mempool();
		return client.fetchAddressBalance(address);
	}

	/**
	 * Fetch inscription contents by inscription number.
	 */
	async getInscriptionContent(number: number) {
		try {
			const hiro = new Hiro();
			return await hiro.fetchInscriptionContent(number);
		} catch (error) {
			console.warn('Failed to fetch inscription content via Hiro. Trying Ord.', error);
			const ord = new Ord();
			const details = await this.getInscriptionDetails(number);
			return await ord.fetchInscriptionContent(details.id);
		}
	}

	/**
	 * Fetch inscription details by inscription number.
	 */
	async getInscriptionDetails(number: number) {
		try {
			const hiro = new Hiro();
			return await hiro.fetchInscriptionDetails(number);
		} catch (error) {
			console.warn('Failed to fetch inscription details via Hiro. Trying Ord.', error);
			const ord = new Ord();
			return await ord.fetchInscriptionDetails(number);
		}
	}

	/**
	 * Get list of inscriptions for an address, filtered by parameters.
	 */
	async getInscriptionListByAddress(
		address: string,
		options?: {
			limit?: number;
			offset?: number;
			mimeType?: string;
		}
	) {
		const hiro = new Hiro();
		return await hiro.fetchInscriptionList(address, options);
	}
}
