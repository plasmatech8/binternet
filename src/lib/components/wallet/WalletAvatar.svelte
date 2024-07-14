<script lang="ts">
	import { createAvatar } from '@dicebear/core';
	import { identicon } from '@dicebear/collection';

	export let address: string;

	const avatar = createAvatar(identicon, {
		seed: address
	}).toDataUriSync();
</script>

<div class="h-10 rounded-full aspect-square bg-black overflow-hidden">
	<img src={avatar} alt="Avatar" />
</div>
