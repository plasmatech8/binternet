import { localStorageStore } from '@skeletonlabs/skeleton';
import Wallet, {
	AddressPurpose,
	isProviderInstalled,
	setDefaultProvider,
	type GetAccountsParams
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
		async disconnect() {
			// Disconnect and reset store data
			await Wallet.disconnect();
			set(null);
		}
	};
}

export const wallet = createWalletStore();
