<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import pkg from '../../../package.json?raw';

	const { version } = JSON.parse(pkg);
</script>

<div class="bg-surface-100-800-token p-6">
	<div class="flex justify-between">
		<div>
			<div class="font-bold font-mono"><span class="text-orange-400">B</span>Internet</div>
		</div>
		<div class="opacity-50">{version}</div>
		<div class="flex gap-5">
			<a href="https://github.com/plasmatech8/binternet" target="_blank">
				<i class="fa-brands fa-github"></i>
			</a>
			<LightSwitch></LightSwitch>
		</div>
	</div>
</div>
