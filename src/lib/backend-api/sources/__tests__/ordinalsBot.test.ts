import { describe, expect, it } from 'vitest';
import { OrdinalsBot } from '../ordinalsBot';

const ordinalsBot = new OrdinalsBot();

describe('OrdinalsBot API', () => {
	it('createInscriptionOrder(data)', async () => {
		const data = {
			receiveAddress: 'bc1puh4vtjtkxpgl322u95k7um5r560v6u6tjqrx4tnjvl7lwvx4qguqmndmjs',
			files: [
				{
					size: 10,
					type: 'plain/text',
					name: 'my-text-inscription-file.txt',
					dataURL: 'data:plain/text;base64,dGVzdCBvcmRlcg=='
				},
				{
					size: 10,
					type: 'plain/text',
					name: 'hello_world.txt',
					dataURL: 'data:plain/text;base64,aGVsbG8gd29ybGQh'
				}
			],
			lowPostage: true,
			fee: 11
		};
		const details = await ordinalsBot.createInscriptionOrder(data);
		expect(details.files.length).toEqual(data.files.length);
		expect(details.receiveAddress).toEqual(data.receiveAddress);
		expect(details.fee).toEqual(data.fee);
	});

	it('getOrderStatus(id)', async () => {
		const orderId = '21961281-4ea1-4326-8c0e-0909d0a659fa';
		try {
			const details = await ordinalsBot.getOrderStatus(orderId);
			expect(details.files.length).toEqual(2);
			expect(details.fee).toEqual(11);
		} catch (error) {
			console.error(error);
		}
	});
});