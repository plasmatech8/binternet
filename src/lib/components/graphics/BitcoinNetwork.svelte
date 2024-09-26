<script lang="ts">
	import type { LottiePlayer } from '@lottiefiles/lottie-player';
	import { onMount } from 'svelte';
	import { Shine } from 'svelte-ux';

	onMount(() => {
		import('@lottiefiles/lottie-player');
		setTimeout(() => player?.pause(), 4000);
	});

	let player: LottiePlayer;
</script>

<div class="max-w-[40rem] max-h-[40rem] w-full h-full aspect-square">
	<Shine class="hover:scale-105 transition duration-300">
		<lottie-player
			bind:this={player}
			autoplay
			mode="normal"
			src="/animations/bitcoin_network_animation.json"
		>
		</lottie-player>
	</Shine>
</div>
