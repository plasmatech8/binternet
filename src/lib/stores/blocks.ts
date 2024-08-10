import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function createBlockStore() {
	// Init store
	const store = writable<object | null>(null);
	if (!browser) return store;

	// Create websocket
	const socket = new WebSocket('wss://mempool.space/api/v1/ws');

	// Send data request
	socket.onopen = (event: Event) => {
		console.log(event);
		socket.send(
			JSON.stringify({
				action: 'want',
				data: ['block'] // 'prices' (conversions), 'fees' (fees), 'blocks' (blocks)
			})
		);
	};

	// Listen for events and update the store
	socket.onmessage = (event: MessageEvent) => {
		const res = JSON.parse(event.data);
		if (res.block) store.set(res.block);
	};

	return store;
}

export const blockStore = createBlockStore();
