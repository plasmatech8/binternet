import { describe, expect, it } from 'vitest';
import { routerInscription } from '../../__tests__/testUtils';
import { Ord } from '../ord';
import { ab2str } from '$lib/utils/conversion';

const ord = new Ord();

describe('Ord API', () => {
	it('fetchInscriptionDetails(number)', async () => {
		const details = await ord.fetchInscriptionDetails(routerInscription.details.number);
		expect(details).toEqual(routerInscription.details);
	});

	it('fetchInscriptionDetails(id)', async () => {
		const details = await ord.fetchInscriptionDetails(routerInscription.details.id);
		expect(details).containSubset(routerInscription.details);
	});

	it('fetchInscriptionContent(number)', async () => {
		const content = await ord.fetchInscriptionContent(routerInscription.details.id);
		expect(content.contentType).toEqual(routerInscription.details.contentType);
		expect(ab2str(content.data)).toEqual(routerInscription.text);
	});
});
