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
		expect(details.minimumFee).toBeGreaterThan(0);
		expect(details.economyFee).toBeGreaterThan(0);
		expect(details.fastestFee).toBeGreaterThan(0);
		expect(details.hourFee).toBeGreaterThan(0);
		expect(details.halfHourFee).toBeGreaterThan(0);
	});

	it('fetchRecommendedFees()', async () => {
		const details = await mempool.fetchBitcoinPrice();
		expect(details.time).toBeGreaterThan(0);
		expect(details.USD).toBeGreaterThan(0);
		expect(details.AUD).toBeGreaterThan(0);
		expect(details.CAD).toBeGreaterThan(0);
	});
});
