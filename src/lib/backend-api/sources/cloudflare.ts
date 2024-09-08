import type { InscriptionContent, InscriptionDetails } from '../types';

export interface CloudflareInscriptionDetails {
	number: number;
	id: string;
	content_type: string;
	inscribed_at: string;
	created_at: string;
}

export class Cloudflare {
	database: D1Database;
	storage: R2Bucket;

	constructor(platform: Readonly<App.Platform>) {
		this.database = platform.env.DB;
		this.storage = platform.env.BK;
	}

	/**
	 * Store inscription details in the database.
	 */
	async storeInscriptionDetails(details: InscriptionDetails): Promise<void> {
		console.log(`Cloudflare - storing details for inscription: ${details.number}`, details);

		// Insert into D1
		const insertStatement = `
			INSERT INTO inscriptions (number, id, content_type, inscribed_at)
			VALUES (?, ?, ?, ?)
		`;
		await this.database
			.prepare(insertStatement)
			.bind(details.number, details.id, details.contentType, details.inscribedAt.toISOString())
			.run();
	}

	/**
	 * Store inscription content in storage.
	 */
	async storeInscriptionContent(
		number: number,
		content: ArrayBuffer,
		contentType: string
	): Promise<void> {
		console.log(`Cloudflare - storing content for inscription: ${number} (${contentType})`);

		// Upload to R2
		const cacheTimeoutSeconds = 86400 * 30; // cache in browser for 30 days
		const key = number.toString();
		const httpMetadata: R2HTTPMetadata = {
			contentType: contentType,
			cacheControl: `public, max-age=${cacheTimeoutSeconds}, immutable`
		};
		await this.storage.put(key, content, { httpMetadata });
	}

	/**
	 * Store site details in the database.
	 */
	async storeSiteDetails(number: number, title: string): Promise<void> {
		console.log(`Cloudflare - storing details for site: ${number} - ${title}`);

		// Insert into D1
		const insertStatement = `
				INSERT INTO sites (number, title)
				VALUES (?, ?)
			`;
		await this.database.prepare(insertStatement).bind(number, title).run();
	}

	/**
	 * Get inscription content by inscription number.
	 */
	async fetchInscriptionContent(number: number): Promise<InscriptionContent | null> {
		console.log(`Cloudflare - fetching content for inscription: ${number}`);

		// Fetch from R2
		const res = await this.storage.get(number.toString());
		if (!res) {
			console.log(`Cloudflare - details does not exist for inscription: ${number}`);
			return null;
		}

		// Set headers
		const headers = new Headers();
		const cacheControl = res.httpMetadata?.cacheControl;
		const contentType = res.httpMetadata?.contentType;
		const httpEtag = res.httpEtag;
		headers.set('etag', httpEtag);
		if (contentType) headers.set('content-type', contentType);
		if (cacheControl) headers.set('cache-control', cacheControl);

		// Return content
		return { data: await res.arrayBuffer(), headers, contentType };
	}

	/**
	 * Get inscription details by inscription number.
	 */
	async fetchInscriptionDetails(numberOrId: number | string): Promise<InscriptionDetails | null> {
		console.log(`Cloudflare - fetching details for inscription: ${numberOrId}`);

		// Fetch from D1
		const selectStatement = `
			SELECT * FROM inscriptions
			WHERE ${typeof numberOrId === 'number' ? 'number' : 'id'} = ?
		`;
		const res = await this.database
			.prepare(selectStatement)
			.bind(numberOrId)
			.first<CloudflareInscriptionDetails>();
		if (!res) {
			console.log(`Cloudflare - content does not exist for inscription: ${numberOrId}`);
			return null;
		}
		return {
			number: res.number,
			id: res.id,
			contentType: res.content_type,
			inscribedAt: new Date(res.inscribed_at)
		};
	}
}
