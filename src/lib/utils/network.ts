/**
 * Extract inscription number (if exists) and network intended for this URL.
 */
export function extractNumberAndNetwork(url: URL): {
	number: string | null;
	network: Network;
	baseDomain: string;
} {
	const domain = url.host;
	const regex = /^(\d+)?\.?(mainnet|testnet|signet)?\.?(.+)$/;
	const match = domain.match(regex);
	if (!match) return { number: null, network: 'mainnet', baseDomain: '' };
	const [, number, network, baseDomain] = match;
	return {
		number: number || null,
		network: (network as Network) || 'mainnet',
		baseDomain
	};
}

type Network = 'mainnet' | 'testnet' | 'signet';

/**
 * Get the site link URL for a BInternet site.
 */
export function getSiteLinkUrl(siteNumber: number) {
	// http://localhost:5173 		-> http://123.localhost:5173
	// https://signet.binternet.org -> https://123.signet.binternet.org
	// https://binternet.org 		-> https://123.mainnet.binternet.org
	const addSubdomain = location.hostname === 'binternet.org' ? 'mainnet.' : '';
	return `${location.protocol}//${siteNumber}.${addSubdomain}${location.host}`;
}
