<script lang="ts">
	import type { LottiePlayer } from '@lottiefiles/lottie-player';
	import { onMount } from 'svelte';
	import { Shine } from 'svelte-ux';

	onMount(() => {
		import('@lottiefiles/lottie-player');
		setTimeout(() => player.pause(), 4000);
	});

	let player: LottiePlayer;
</script>

<Shine class="hover:scale-105 transition duration-300">
	<lottie-player
		bind:this={player}
		autoplay
		mode="normal"
		src="/bitcoin_network_animation.json"
		style="max-width: 40rem;"
	>
	</lottie-player>
</Shine>
