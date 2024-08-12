import { localStorageStore } from '@skeletonlabs/skeleton';
import Wallet, {
	AddressPurpose,
	isProviderInstalled,
	setDefaultProvider,
	createInscription,
	type SendTransferParams,
	type GetAccountsParams,
	type CreateInscriptionOptions,
	BitcoinNetworkType,
	RpcErrorCode
} from 'sats-connect';
import { get } from 'svelte/store';

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
		async sendInscriptionTxn(
			arrayBuffer: ArrayBuffer,
			contentType: string,
			onFinish: (txId: string) => void
		) {
			const base64 = btoa(
				new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
			);
			const options: CreateInscriptionOptions = {
				payload: {
					network: { type: BitcoinNetworkType.Signet },
					content: base64,
					contentType: contentType,
					payloadType: 'BASE_64'
				},
				onFinish: (res) => onFinish(res.txId),
				onCancel: () => {}
			};
			await createInscription(options);
		},
		async sendPaymentTxn(
			toAddress: string,
			amountSats: number,
			onFinish: (txId: string) => void,
			onCancel: (reason: string) => void
		) {
			const paymentAddress = get(this)?.payment;
			if (!paymentAddress) {
				const msg = 'Wallet not connected, or no payment address found.';
				console.error(msg);
				return alert(msg);
			}
			const options: SendTransferParams = {
				recipients: [{ address: toAddress, amount: amountSats }]
			};
			const response = await Wallet.request('sendTransfer', options);

			// TODO: Convert to promise syntax and call toastStore.trigger in component code.

			if (response.status === 'success') {
				return onFinish(response.result.txid);
			} else {
				if (response.error.code === RpcErrorCode.USER_REJECTION) {
					console.error('User Rejected Transaction!');
					onCancel('rejected');
				} else {
					console.error('Transaction Error Occured!', response.error);
					onCancel('error');
				}
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
