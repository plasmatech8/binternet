<script lang="ts">
	import { ListBoxItem, ListBox, type PopupSettings, popup } from '@skeletonlabs/skeleton';

	const files = [{}];

	interface InscriptionFile {
		path: string;
		contents: any;
		intention: null | number | 'ignore' | 'new';
	}

	const file: InscriptionFile = {
		// File
		path: '/folder/index.html',
		contents: '<h1>Hello</h1>',
		intention: null
	};

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
</script>

<div class="container mx-auto">
	<h1 class="h1 my-10">Create</h1>

	<h2 class="h2 my-10">Inscribe Files</h2>

	<div class="card flex gap-3 p-5 justify-between items-center">
		<div>{file.path}</div>
		<div class="flex gap-2">
			<button class="btn variant-outline-primary"> Minify JS </button>
		</div>

		<!-- <div class="flex gap-2 h-16"> -->
		<div class="btn-group variant-outline-primary h-16">
			<button
				class="gap-3"
				class:!variant-filled-primary={file.intention === 'ignore'}
				on:click={() => (file.intention = 'ignore')}
			>
				Ignore
				<i class="fa-solid fa-ban"></i>
			</button>
			<button
				use:popup={popupCombobox}
				class="w-40 gap-3"
				class:!variant-filled-primary={typeof file.intention === 'number'}
			>
				{#if typeof file.intention === 'number'}
					<div class="min-w-0 truncate">
						Using {file.intention}
					</div>
				{:else}
					<div>
						<div>Use Existing</div>
						<div class="text-sm">3 found</div>
					</div>
				{/if}
				<i class="fas fa-caret-down"></i>
			</button>
			<button
				class="gap-3"
				class:!variant-filled-primary={file.intention === 'new'}
				on:click={() => (file.intention = 'new')}
			>
				New Inscription

				<i class="fa-solid fa-plus"></i>
			</button>
		</div>

		{#if typeof file.intention === 'number'}
			<a href="." class="btn btn-sm gap-2 variant-filled-secondary">
				<i class="fa-solid fa-up-right-from-square"></i>
				View Inscription
			</a>
		{:else if file.intention === 'new'}
			<button class="btn btn-sm gap-2 variant-filled-secondary">Inscribe Now</button>
		{:else}
			<div class="opacity-50">No Inscription</div>
		{/if}
		<div></div>
	</div>

	<h2 class="h2 my-10">Create Router</h2>
</div>

<!-- Select menu for inscription -->
<div class="card shadow-xl py-2" data-popup="popupCombobox">
	<ListBox rounded="rounded-none">
		<ListBoxItem bind:group={file.intention} name="intention" value={12341} class="text-nowrap">
			<svelte:fragment slot="lead"><i class="fas fa-feather-pointed"></i></svelte:fragment>
			12341
			<svelte:fragment slot="trail">
				<div class="flex gap-2 items-center text-primary-500">
					<div>in your active wallet</div>
					<i class="fas fa-wallet"></i>
				</div>
			</svelte:fragment>
		</ListBoxItem>
		<ListBoxItem bind:group={file.intention} name="intention" value={325355}>
			<svelte:fragment slot="lead"><i class="fa-solid fa-feather-pointed"></i></svelte:fragment>
			325355
		</ListBoxItem>
		<ListBoxItem bind:group={file.intention} name="intention" value={3412323234}>
			<svelte:fragment slot="lead"><i class="fa-solid fa-feather-pointed"></i></svelte:fragment>
			3412323234
		</ListBoxItem>
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>
