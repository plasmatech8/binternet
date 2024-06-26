import { describe, expect, it } from 'vitest';
import { ab2str, routerInscription } from '../../__tests__/testUtils';
import { Hiro } from '../hiro';

const hiro = new Hiro();

describe('Hiro API', () => {
	it('fetchInscriptionDetails(number)', async () => {
		const details = await hiro.fetchInscriptionDetails(routerInscription.details.number);
		expect(details).toEqual(routerInscription.details);
	});

	it('fetchInscriptionDetails(id)', async () => {
		const details = await hiro.fetchInscriptionDetails(routerInscription.details.id);
		expect(details).toEqual(routerInscription.details);
	});

	it('fetchInscriptionList(address)', async () => {
		const res = await hiro.fetchInscriptionList(routerInscription.details.address!, {
			limit: 50,
			offset: 0,
			mimeType: 'application/x-yaml'
		});
		expect(res.results).toContainEqual(routerInscription.details);
	});

	it('fetchInscriptionContent(number)', async () => {
		const content = await hiro.fetchInscriptionContent(routerInscription.details.number);
		expect(content.contentType).toEqual(routerInscription.details.contentType);
		expect(ab2str(content.data)).toEqual(routerInscription.text);
	});

	it('fetchInscriptionContent(id)', async () => {
		const content = await hiro.fetchInscriptionContent(routerInscription.details.id);
		expect(content.contentType).toEqual(routerInscription.details.contentType);
		expect(ab2str(content.data)).toEqual(routerInscription.text);
	});
});
