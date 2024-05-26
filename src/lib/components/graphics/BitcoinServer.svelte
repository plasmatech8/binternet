<script lang="ts">
	import type { LottiePlayer } from '@lottiefiles/lottie-player';
	import { onMount } from 'svelte';
	import { Shine, Tilt } from 'svelte-ux';

	onMount(() => {
		import('@lottiefiles/lottie-player');
		setTimeout(() => player.pause(), 2000);
	});

	let player: LottiePlayer;
</script>

<lottie-player
	bind:this={player}
	autoplay
	mode="normal"
	src="/bitcoin_server_animation.json"
	style="width: 320px"
>
</lottie-player>
