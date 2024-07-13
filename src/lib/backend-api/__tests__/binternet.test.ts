import { describe, expect, it } from 'vitest';
import { ab2str, routerInscription } from './testUtils';
import { BInternetServerClient } from '../binternet';

const client = new BInternetServerClient();

describe('BInternet Server Client', () => {
	it('fetchSiteResource(number, path)', async () => {
		const number = 71103392;
		const path = '/mainnet/rocket';
		const res = await client.fetchSiteResource(number, path);
		expect(res.data).exist;
		expect(res.contentType).toEqual('image/gif');
	});

	it('getAddressBalance(address)', async () => {
		const address = routerInscription.details.address!;
		const balance = await client.getAddressBalance(address);
		expect(balance).toBeGreaterThan(0);
	});

	it('getInscriptionContent(number)', async () => {
		const number = routerInscription.details.number;
		const res = await client.getInscriptionContent(number);
		expect(res.contentType).toEqual(routerInscription.details.contentType);
		expect(ab2str(res.data)).toEqual(routerInscription.text);
	});

	it('fetchInscriptionDetails(number)', async () => {
		const details = await client.getInscriptionDetails(routerInscription.details.number);
		expect(details).toEqual(routerInscription.details);
	});

	it('fetchInscriptionList(address)', async () => {
		const res = await client.getInscriptionListByAddress(routerInscription.details.address!, {
			limit: 50,
			offset: 0,
			mimeType: 'application/x-yaml'
		});
		expect(res.results).toContainEqual(routerInscription.details);
	});
});