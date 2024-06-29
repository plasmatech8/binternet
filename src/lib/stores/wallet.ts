import { localStorageStore } from '@skeletonlabs/skeleton';
import Wallet, {
	AddressPurpose,
	isProviderInstalled,
	setDefaultProvider,
	createInscription,
	type GetAccountsParams,
	type CreateInscriptionOptions,
	BitcoinNetworkType
} from 'sats-connect';

type WalletAddresses = {
	ordinals: string;
	payment: string;
};

function createWalletStore() {
	const { subscribe, set } = localStorageStore<WalletAddresses | null>('wallet', null);

	return {
		subscribe,
		async connect() {
			// Use XVerse wallet only
			if (!isProviderInstalled('XverseProviders.BitcoinProvider')) {
				const msg = 'XVerse wallet needs to be installed.';
				console.error(msg);
				return alert(msg);
			}
			setDefaultProvider('XverseProviders.BitcoinProvider');
			// Request wallet accounts
			const params: GetAccountsParams = {
				purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment]
			};
			const provider = await Wallet.request('getAccounts', params);
			// Initialize store data
			if (provider.status === 'success') {
				const ordinals = provider.result.find((w) => w.purpose === 'ordinals');
				const payments = provider.result.find((w) => w.purpose === 'payment');
				if (!ordinals || !payments) {
					const msg = `${!ordinals ? 'Ordinals' : 'Payments'} address not found`;
					console.error(msg);
					return alert(msg);
				}
				set({ ordinals: ordinals.address, payment: payments.address });
			}
		},
		async inscribe(arrayBuffer: ArrayBuffer, contentType: string) {
			const base64 = btoa(
				new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
			);
			const options: CreateInscriptionOptions = {
				payload: {
					network: { type: BitcoinNetworkType.Mainnet },
					content: base64,
					contentType: contentType,
					payloadType: 'BASE_64'
				},
				onFinish: (res) => {
					console.log(res);
				},
				onCancel: () => {}
			};
			await createInscription(options);
		},
		async disconnect() {
			// Disconnect and reset store data
			await Wallet.disconnect();
			set(null);
		}
	};
}

export const wallet = createWalletStore();
