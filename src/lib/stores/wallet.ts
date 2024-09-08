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

/*
 * Types
 */

type WalletAddresses = {
	ordinals: string;
	payment: string;
};

export class UnexpectedTransactionError extends Error {
	constructor(message: string = 'Transaction has failed due to an unexpected error.') {
		super(message);
		this.name = 'UnexpectedTransactionError';
	}
}

export class RejectedTransactionError extends Error {
	constructor(message: string = 'Transaction was rejected by user.') {
		super(message);
		this.name = 'RejectedTransactionError';
	}
}

/*
 * Wallet Store
 */

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
		sendInscribeTxn({
			inscriptionData: arrayBuffer,
			contentType
		}: {
			inscriptionData: ArrayBuffer;
			contentType: string;
		}): Promise<string> {
			return new Promise((resolve, reject) => {
				try {
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
						onFinish: (res) => {
							resolve(res.txId);
						},
						onCancel: () => {
							reject(new RejectedTransactionError());
						}
					};
					createInscription(options);
				} catch (error) {
					console.error('Transaction has failed due to an unexpected error:', error);
					reject(new UnexpectedTransactionError());
				}
			});
		},
		async sendPaymentTxn({ toAddress, amountSats }: { toAddress: string; amountSats: number }) {
			return new Promise((resolve, reject) => {
				try {
					const paymentAddress = get(this)?.payment;
					if (!paymentAddress) {
						const msg = 'Wallet not connected, or no payment address found.';
						console.error(msg);
						return alert(msg);
					}
					const options: SendTransferParams = {
						recipients: [{ address: toAddress, amount: amountSats }]
					};
					Wallet.request('sendTransfer', options).then((response) => {
						if (response.status === 'success') {
							resolve(response.result.txid);
						} else {
							if (response.error.code === RpcErrorCode.USER_REJECTION) {
								reject(new RejectedTransactionError());
							} else {
								throw response.error;
							}
						}
					});
				} catch (error) {
					console.error('Transaction has failed due to an unexpected error:', error);
					reject(new UnexpectedTransactionError());
				}
			});
		},
		async disconnect() {
			// Disconnect and reset store data
			await Wallet.disconnect();
			set(null);
		}
	};
}

export const wallet = createWalletStore();
