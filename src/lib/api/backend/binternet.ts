import { z } from 'zod';
import { Hiro } from './sources/hiro';
import yaml from 'js-yaml';
import { Mempool } from './sources/mempool';
import { Cloudflare } from './sources/cloudflare';

export interface Content {}

export class BInternetServerClient {
	platform: Readonly<App.Platform>;

	/**
	 * Initialize BInternet server client.
	 */
	constructor(platform: Readonly<App.Platform>) {
		this.platform = platform;
	}

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
		const { content } = await this.getInscriptionContent(number);
		const router = this.parseRouter(content);
		console.log(router, path);

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
		return client.getAddressBalance(address);
	}

	/**
	 * Fetch inscription details and content from source and cache in cloudflare.
	 */
	async saveInscription(number: number) {
		const hiro = new Hiro();

		// Fetch data from Hiro
		const detailsRes = await hiro.fetchInscriptionDetails(number);
		const contentRes = await hiro.fetchInscriptionContent(number);

		// Construct data
		const details = {
			number,
			id: detailsRes.data.id,
			content_type: detailsRes.data.mime_type,
			created_at: new Date().toISOString(),
			inscribed_at: new Date(detailsRes.data.timestamp).toISOString(),
			address: detailsRes.data.address
		};
		const content = contentRes.data;
		const contentType = contentRes.headers['Content-Type']?.toString();

		// Store data in Cloudflare
		const cloudflare = new Cloudflare(this.platform);
		await cloudflare.storeInscriptionContent(number, content, contentType);
		await cloudflare.storeInscriptionDetails(details, content);
	}

	/**
	 * Fetch inscription contents by inscription number.
	 */
	async getInscriptionContent(number: number) {
		const cloudflare = new Cloudflare(this.platform);

		// Get inscription content saved in Cloudflare
		let contentRes = await cloudflare.fetchInscriptionContent(number);

		// If object does not exist, fetch and cache it, and retry
		if (contentRes === null) {
			await this.saveInscription(number);
			contentRes = await cloudflare.fetchInscriptionContent(number);
		}

		// Return data
		return {
			content: contentRes!.content,
			headers: contentRes!.headers
		};
	}

	/**
	 * Fetch inscription details by inscription number.
	 */
	async getInscriptionDetails(number: number) {
		const cloudflare = new Cloudflare(this.platform);

		// Get inscription details saved in Cloudflare
		let detailsRes = await cloudflare.fetchInscriptionDetails(number);

		// If record does not exist, fetch and cache it, and retry
		if (!detailsRes) {
			await this.saveInscription(number);
			detailsRes = await cloudflare.fetchInscriptionDetails(number);
		}

		return {
			details: detailsRes as Record<string, unknown>
		};
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
		return await hiro.fetchInscriptionList({ address, ...options });
	}

	/**
	 * Get a list of inscriptions which match a SHA256 hash, filtered by parameters.
	 *
	 * WARNING: does not actually return the full list of inscriptions,
	 * 			only inscriptions cached by the system.
	 */
	async getInscriptionListByHash(
		hash: string,
		options?: {
			limit?: number;
			offset?: number;
			mimeType?: string;
		}
	) {
		const cloudflare = new Cloudflare(this.platform);
		return await cloudflare.fetchInscriptionsByHash(hash, options);
	}
}
