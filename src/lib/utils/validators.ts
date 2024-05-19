export function isNetwork(network: string) {
	const networks = ['mainnet', 'testnet'];
	return networks.includes(network);
}

export function isInscriptionId(id: string) {
	const pattern = /^[a-fA-F0-9]{64}i[0-9]+$/;
	return pattern.test(id);
}
