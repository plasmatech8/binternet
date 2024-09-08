import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import { PUBLIC_BITCOIN_BLOCK_WS_URL } from '$env/static/public';

function createBlockStore() {
	// Init store
	const store = writable<object | null>(null);
	if (!browser) return store;

	// Create websocket
	const socket = new WebSocket(PUBLIC_BITCOIN_BLOCK_WS_URL);

	// Send data request
	socket.onopen = () => {
		console.log('Initialising block store.');
		socket.send(
			JSON.stringify({
				action: 'want',
				data: ['blocks']
			})
		);
	};

	// Listen for events and update the store
	socket.onmessage = (event: MessageEvent) => {
		const res = JSON.parse(event.data);
		if (res.block) {
			console.log('New Bitcoin block mined!', res.block);
			store.set(res.block);
		}
	};

	// Backup with forced update every 5 minutes in case of websocket failure
	setInterval(() => {
		console.log('Updating block store in case of websocket failure.');
		store.set({ ...get(store) });
	}, 60000 * 5);

	return store;
}

export const blockStore = createBlockStore();
