import { describe, expect, it } from 'vitest';
import { routerInscription } from '../../__tests__/testUtils';
import { Mempool } from '../mempool';

const mempool = new Mempool();

describe('Mempool API', () => {
	it('getAddressBalance(address)', async () => {
		const details = await mempool.fetchAddressBalance(routerInscription.details.address!);
		expect(details).toBeGreaterThan(0);
	});
});
