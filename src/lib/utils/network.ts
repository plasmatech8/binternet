/**
 * Extract inscription number (if exists) and network intended for this URL.
 */
export function extractNumberAndNetwork(url: URL): {
	number: string | null;
	network: Network;
	baseDomain: string;
} {
	const domain = url.host;
	const regex = /^(\d+)?\.?(mainnet|testnet)?\.?(.+)$/;
	const match = domain.match(regex);
	if (!match) return { number: null, network: 'mainnet', baseDomain: '' };
	const [, number, network, baseDomain] = match;
	return {
		number: number || null,
		network: (network as Network) || 'mainnet',
		baseDomain
	};
}

type Network = 'mainnet' | 'testnet';
