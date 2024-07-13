<script lang="ts">
	import { FileButton, getModalStore } from '@skeletonlabs/skeleton';
	import prettyBytes from 'pretty-bytes';
	import { createEventDispatcher } from 'svelte';

	export let inscription: InscriptionFile;
	export let otherInscriptions: InscriptionFile[];

	let valid = true;
	let inputEl: HTMLInputElement;

	const urlPathPattern = /^\/[^\s?#]*$/;

	$: isNew = inscription.type === 'new';
	$: isExisting = inscription.type === 'existing';
	$: inscriptionNumber = isNew ? inscription.new?.number : inscription.existing?.number;
	$: isDone = !!inscriptionNumber;
	$: if (inputEl) {
		inscription.path;
		updateValidity();
	}

	const dispatch = createEventDispatcher();
	const modalStore = getModalStore();

	async function onFileUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const fileList = target.files as FileList;
		const file = fileList[0];
		inscription = {
			...inscription,
			new: {
				filename: file.name,
				filepath: file.webkitRelativePath ?? file.name,
				size: file.size,
				data: await file.arrayBuffer(),
				contentType: file.type || 'text/plain'
			}
		};
		inscription.type = 'new';
	}

	function switchToNew() {
		inscription.type = 'new';
		inscription.existing = undefined;
	}

	function onUseExisting() {
		modalStore.trigger({
			component: 'selectInscriptionModal',
			type: 'component',
			response: async (r: number) => {
				if (r) {
					inscription.type = 'existing';
					inscription.existing = { number: r };
				}
			}
		});
	}

	function onDelete() {
		dispatch('delete');
	}

	function updateValidity() {
		// Make sure path starts with /
		if (!inscription.path) inscription.path = '/';
		valid = true;
		const matchesPattern = urlPathPattern.test(inscription.path);
		inputEl.setCustomValidity('');
		if (!matchesPattern) {
			inputEl.setCustomValidity(`URL path must not contain whitespace, "#" or "?"`);
			inputEl.reportValidity();
			valid = false;
		}
		const allDifferent = otherInscriptions.every((insc) => {
			return insc.path !== inscription.path;
		});
		if (!allDifferent) {
			inputEl.setCustomValidity('Duplicate URL path');
			inputEl.reportValidity();
			valid = false;
		}
	}
</script>

<div class="flex gap-2 items-center">
	<div class="card gap-2 p-3 flex flex-col lg:flex-row items-center text-sm w-full">
		<!-- Status + Type + Warning-->
		<div class="w-5 flex gap-3 flex-shrink-0 items-center">
			<div class="text-center">
				{#if isDone}
					<span class="badge-icon variant-filled-success">
						<i class="fas fa-check"></i>
					</span>
				{:else}
					<span class="badge-icon variant-filled-warning">
						<i class="fa-solid fa-circle-notch animate-spin"></i>
					</span>
				{/if}
			</div>
		</div>

		<div class="w-24 flex gap-2">
			<!-- Type -->
			<div class="uppercase font-bold opacity-50 text-center flex-1">{inscription.type}</div>

			<!-- Warning -->
			{#if true}
				<div class="text-end flex-1">
					<button type="button"><i class="fas fa-warning text-warning-500 text-lg"></i></button>
				</div>
			{/if}
		</div>

		<!-- Path Input -->
		<div class="flex-1 w-full">
			<input
				bind:this={inputEl}
				pattern={urlPathPattern.source}
				type="text"
				class="input"
				bind:value={inscription.path}
				class:input-error={!valid}
			/>
		</div>

		<!-- File information -->
		<div class="w-full lg:w-40" class:line-through={isExisting} class:opacity-50={isExisting}>
			{#if inscription.new}
				<div
					title="{inscription.new.filename} ({prettyBytes(inscription.new.size)})"
					class="hover:outline outline-1 outline-primary-500/50 cursor-pointer px-1 rounded"
				>
					<div class="truncate">{inscription.new.filename}</div>
					<div class="truncate">
						{prettyBytes(inscription.new.size)}
						({inscription.new.contentType})
					</div>
				</div>
			{:else}
				<div class="text-center opacity-50">-</div>
			{/if}
		</div>

		<!-- Type Toggle -->
		<div>
			<div class="btn-group variant-outline-primary">
				<button
					class="gap-3 group"
					class:!variant-filled-primary={isExisting}
					on:click={onUseExisting}
					type="button"
				>
					<span>Use Existing</span>
					<i class="fas fa-location-crosshairs !m-0" class:group-hover:hidden={isExisting}></i>
					<i class="fas fa-rotate-left hidden !m-0" class:group-hover:block={isExisting}></i>
				</button>
				{#if isExisting && inscription.new}
					<!-- Switch to existing inscription -->
					<button
						class="gap-3"
						class:!variant-filled-primary={isNew}
						on:click={switchToNew}
						type="button"
					>
						Use New
						<i class="fas fa-feather-pointed"></i>
					</button>
				{:else if inscription.new}
					<!-- Re-upload inscription -->
					<FileButton
						button="gap-3 !variant-filled-primary group"
						name="re-upload"
						on:change={onFileUpload}
					>
						Use New
						<i class="fas fa-feather-pointed group-hover:hidden !m-0"></i>
						<i class="fas fa-rotate-left hidden group-hover:block !m-0"></i>
					</FileButton>
				{:else}
					<!-- Upload new inscription when no data present -->
					<FileButton button="gap-3 group" name="re-upload" on:change={onFileUpload}>
						Use New
						<i class="fas fa-feather-pointed group-hover:hidden !m-0"></i>
						<i class="fas fa-upload hidden group-hover:block !m-0"></i>
					</FileButton>
				{/if}
			</div>
		</div>

		<!-- Inscription Number -->
		<div class="text-center w-36">
			{#if isDone}
				<a
					class="btn btn-sm variant-glass-primary gap-2"
					target="_blank"
					href="https://ordiscan.com/inscription/{inscriptionNumber}"
				>
					#{inscriptionNumber}
					<i class="fas fa-up-right-from-square"></i>
				</a>
			{:else}
				<div class="opacity-50">-</div>
			{/if}
		</div>
	</div>

	<div>
		<button class="btn-icon btn-icon-sm hover:variant-ghost" type="button" on:click={onDelete}>
			<i class="fa-solid fa-close"></i>
		</button>
	</div>
</div>
