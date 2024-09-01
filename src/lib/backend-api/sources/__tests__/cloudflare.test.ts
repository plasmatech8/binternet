import { describe, it } from 'vitest';

// Cannot create tests due to platform not existing in other contexts other than server endpoints.

// If this gets implemented and integrated into BInternetServerClient, then we will need to
// delete the unit tests and rely on server-endpoint testing instead.

// const cloudflare = new Cloudflare(platform);

describe.skip('Cloudflare API', () => {
	it.skip('storeInscriptionDetails(details)', () => {});
	it.skip('storeInscriptionContent(number, content, contentType)', () => {});
	it.skip('fetchInscriptionContent(number)', () => {});
	it.skip('fetchInscriptionDetails(number)', () => {});
});
