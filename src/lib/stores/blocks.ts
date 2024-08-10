import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { PUBLIC_MEMPOOL_WS_URL } from '$env/static/public';

function createBlockStore() {
	// Init store
	const store = writable<object | null>(null);
	if (!browser) return store;

	// Create websocket
	const socket = new WebSocket(PUBLIC_MEMPOOL_WS_URL);

	// Send data request
	socket.onopen = () => {
		socket.send(
			JSON.stringify({
				action: 'want',
				data: ['blocks'] // 'prices' (conversions), 'fees' (fees), 'blocks' (blocks)
			})
		);
	};

	// Listen for events and update the store
	socket.onmessage = (event: MessageEvent) => {
		const res = JSON.parse(event.data);
		if (res.block) {
			console.log('New Bitcoin block mined!');
			store.set(res.block);
		}
	};

	return store;
}

export const blockStore = createBlockStore();
