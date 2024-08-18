import type { InscriptionDetails } from '../types';

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
	async storeInscriptionDetails(details: Omit<CloudflareInscriptionDetails, 'created_at'>) {
		const insertStatement = `
			INSERT INTO inscriptions (number, id, content_type, inscribed_at)
			VALUES (?, ?, ?, ?)
		`;
		const res = await this.database
			.prepare(insertStatement)
			.bind(details.number, details.id, details.content_type, details.inscribed_at)
			.run();
		console.log(res);
	}

	/**
	 * Store inscription content in storage.
	 */
	async storeInscriptionContent(number: number, content: ArrayBuffer, contentType: string) {
		const cacheTimeoutSeconds = 86400 * 30; // cache in browser for 30 days
		const key = number.toString();
		const httpMetadata: R2HTTPMetadata = {
			contentType: contentType,
			cacheControl: `public, max-age=${cacheTimeoutSeconds}, immutable`
		};
		const res = await this.storage.put(key, content, { httpMetadata });
		console.log(res);
	}

	/**
	 * Get inscription content by inscription number.
	 */
	async fetchInscriptionContent(number: number) {
		// Fetch from R2
		const res = await this.storage.get(number.toString());
		if (!res) return null;

		// Set headers
		const headers = new Headers();
		const cacheControl = res.httpMetadata?.cacheControl;
		const contentType = res.httpMetadata?.contentType;
		const httpEtag = res.httpEtag;
		headers.set('etag', httpEtag);
		if (contentType) headers.set('content-type', contentType);
		if (cacheControl) headers.set('cache-control', cacheControl);

		// Return content
		return { content: await res.arrayBuffer(), headers };
	}

	/**
	 * Get inscription details by inscription number.
	 */
	async fetchInscriptionDetails(number: number) {
		const selectStatement = `
			SELECT * FROM inscriptions WHERE number = ?
		`;
		const res = await this.database.prepare(selectStatement).bind(number).first();
		console.log(res);
		return res as InscriptionDetails | null;
	}
}
