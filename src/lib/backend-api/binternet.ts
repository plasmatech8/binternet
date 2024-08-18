import { z } from 'zod';
import { Hiro } from './sources/hiro';
import yaml from 'js-yaml';
import { Ord } from './sources/ord';
import { Mempool } from './sources/mempool';

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
	async getInscriptionContent(numberOrId: number | string) {
		// TODO: storage/caching using cloudflare
		const ord = new Ord();
		if (typeof numberOrId === 'number') {
			const details = await this.getInscriptionDetails(numberOrId);
			return await ord.fetchInscriptionContent(details.id);
		} else {
			return await ord.fetchInscriptionContent(numberOrId);
		}
	}

	/**
	 * Fetch inscription details by inscription number.
	 */
	async getInscriptionDetails(numberOrId: number | string) {
		// TODO: storage/caching using cloudflare
		const ord = new Ord();
		return await ord.fetchInscriptionDetails(numberOrId);
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

	/**
	 * Get recommended transaction fees.
	 */
	async getRecommendedFees() {
		const mempool = new Mempool();
		return await mempool.fetchRecommendedFees();
	}

	/**
	 * Get the BTC price.
	 */
	async getBitcoinPrice() {
		const mempool = new Mempool();
		return await mempool.fetchBitcoinPrice();
	}
}
