import { describe, expect, it } from 'vitest';
import { routerInscription } from '../../__tests__/testUtils';
import { Mempool } from '../mempool';

const mempool = new Mempool();

describe('Mempool API', () => {
	it('getAddressBalance(address)', async () => {
		const details = await mempool.fetchAddressBalance(routerInscription.details.address!);
		expect(details).toBeGreaterThan(0);
	});

	it('fetchRecommendedFees()', async () => {
		const details = await mempool.fetchRecommendedFees();
		expect(details.minimumFee).toBeGreaterThanOrEqual(0);
		expect(details.economyFee).toBeGreaterThanOrEqual(0);
		expect(details.fastestFee).toBeGreaterThanOrEqual(0);
		expect(details.hourFee).toBeGreaterThanOrEqual(0);
		expect(details.halfHourFee).toBeGreaterThanOrEqual(0);
	});
});
