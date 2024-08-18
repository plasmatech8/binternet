import { z } from 'zod';
import { Hiro } from './sources/hiro';
import yaml from 'js-yaml';
import { Ord } from './sources/ord';
import { Mempool } from './sources/mempool';
import { minimatch } from 'minimatch';
import type { Cloudflare } from './sources/_cloudflare';
import type { InscriptionContent, InscriptionDetails } from './types';

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
		const matchedRoutePath = Object.keys(router.routes).find((glob) => minimatch(path, glob));
		if (matchedRoutePath === undefined) throw Error('Route not found');
		const matchedRouteInscriptionNumber = router.routes[matchedRoutePath];
		const resourceRes = await this.getInscriptionContent(matchedRouteInscriptionNumber);

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
	async getInscriptionContent(numberOrId: number | string, cloudflare?: Cloudflare) {
		const details = await this.getInscriptionDetails(numberOrId);
		let content: InscriptionContent | null = null;
		// If possible, return the inscription content as found in Cloudflare
		if (cloudflare) {
			content = await cloudflare.fetchInscriptionContent(details.number);
		}
		// Fetch inscription content from Ord
		if (!content) {
			const ord = new Ord();
			content = await ord.fetchInscriptionContent(details.id);
			// Cache the inscription content in Cloudflare if possible
			if (cloudflare) {
				await cloudflare.storeInscriptionContent(details.number, content.data, details.contentType);
			}
		}
		// Return the content data
		return content;
	}

	/**
	 * Fetch inscription details by inscription number.
	 */
	async getInscriptionDetails(numberOrId: number | string, cloudflare?: Cloudflare) {
		let details: InscriptionDetails | null = null;
		// If possible, return the inscription details as found in Cloudflare
		if (cloudflare) {
			details = await cloudflare.fetchInscriptionDetails(numberOrId);
		}
		// Fetch inscription details from Ord
		if (!details) {
			const ord = new Ord();
			details = await ord.fetchInscriptionDetails(numberOrId);
			// Cache the inscription details in Cloudflare if possible
			if (cloudflare) {
				const { createdAt: _, ...restDetails } = details;
				await cloudflare.storeInscriptionDetails(restDetails);
			}
		}
		// Return the details data
		return details;
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
