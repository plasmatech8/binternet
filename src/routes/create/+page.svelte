<script lang="ts">
	import { FileButton } from '@skeletonlabs/skeleton';
	import InscriptionCard from './InscriptionCard.svelte';
	import { slide } from 'svelte/transition';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import PageLayout from '$lib/components/PageLayout.svelte';

	let inscriptions: InscriptionFile[] = [];
	let router: Router;
	let formEl: HTMLFormElement;

	$: pendingInscriptions = inscriptions.filter((insc) => {
		return insc.type === 'new' && !insc.new?.number;
	});

	async function onFileUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const fileList = target.files as FileList;

		// Add inscriptions to list
		for (const file of fileList) {
			const newInscription: InscriptionFile = {
				id: Math.random().toString(),
				type: 'new',
				path: '/' + (file.webkitRelativePath !== '' ? file.webkitRelativePath : file.name),
				new: {
					filename: file.name,
					filepath: file.webkitRelativePath ?? file.name,
					size: file.size,
					data: await file.arrayBuffer()
					// number: 70427602
				}
			};
			inscriptions = [newInscription, ...inscriptions];
		}
	}

	function onAddExisting() {
		// TODO: select inscription modal

		// Make a path name
		const basePath = '/existing_inscription_';
		let pathNumber = 1;
		while (inscriptions.find((insc) => insc.path === basePath + pathNumber)) {
			pathNumber += 1;
		}
		const path = basePath + pathNumber;

		// Add inscription to list
		const newInscription: InscriptionFile = {
			id: Math.random().toString(),
			type: 'existing',
			path: path,
			existing: {
				number: 70427602
			}
		};
		inscriptions = [newInscription, ...inscriptions];
	}

	function onDelete(inscription: InscriptionFile) {
		inscriptions = inscriptions.filter((insc) => insc !== inscription);
	}

	function generateRouter() {
		const routerData: Router = {
			binternet: 'v1',
			routes: {}
		};
		inscriptions.forEach((insc, i) => {
			// Existing
			if (insc.type === 'existing') {
				const inscNumber = insc.existing?.number;
				if (!inscNumber) {
					throw Error(
						`Existing inscription #${i} (${insc.path}) does not have a set inscription number.`
					);
				}
				routerData.routes[insc.path] = inscNumber;
				return;
			}
			// New
			const inscNumber = insc.new?.number;
			if (!inscNumber) {
				throw Error(`New inscription #${i} (${insc.path}) does not have a set inscription number.`);
			}
		});
		router = routerData;
	}
</script>

<svelte:head>
	<title>Create - BInternet</title>
	<meta
		name="description"
		content="Create a site on the blockchain by creating file and router inscriptions."
	/>
</svelte:head>

<PageLayout>
	<h1 class="h1">Create</h1>

	<div class="flex flex-col lg:flex-row justify-between items-center mb-5">
		<h2 class="h2 my-10">
			Inscribe Files <span class="text-2xl opacity-60">&</span> Define Routes
		</h2>
		<div class="flex gap-5">
			<FileButton
				button="btn btn-sm variant-filled"
				name="files"
				on:change={onFileUpload}
				directory
				webkitdirectory
				mozdirectory
			>
				<div>Upload Folder</div>
				<i class="fas fa-add"></i>
			</FileButton>
			<FileButton button="btn btn-sm variant-filled" name="files" multiple on:change={onFileUpload}>
				<div>Upload File</div>
				<i class="fas fa-add"></i>
			</FileButton>
			<button class="btn btn-sm variant-filled" on:click={onAddExisting}>
				<div>Add Existing</div>
				<i class="fas fa-add"></i>
			</button>
		</div>
	</div>

	<form on:submit|preventDefault={() => formEl.validate()}>
		<div class="flex flex-col gap-4 min-h-52">
			{#each inscriptions as inscription (inscription.id)}
				<div transition:slide>
					<InscriptionCard
						bind:inscription
						otherInscriptions={inscriptions.filter((insc) => insc.id !== inscription.id)}
						on:delete={() => onDelete(inscription)}
					></InscriptionCard>
				</div>
			{:else}
				<div class="grid place-items-center opacity-50 w-full h-52">No Inscriptions</div>
			{/each}
		</div>
		<div class="mt-10 flex gap-3">
			<button class="btn variant-filled-primary" disabled={!pendingInscriptions.length}>
				Inscribe Pending Files
				{#if pendingInscriptions.length}
					({pendingInscriptions.length})
				{/if}
			</button>
			<button
				class="btn variant-filled-primary"
				disabled={!!pendingInscriptions.length || inscriptions.length == 0}
				on:click={generateRouter}
			>
				Generate Router
			</button>
		</div>
	</form>

	<h2 class="h2 my-10">Create Router</h2>

	{#if router}
		<CodeBlock language="yaml" code={yaml.dump(router, {})}></CodeBlock>
	{:else}
		<div class="min-h-52 grid place-items-center opacity-50">No Router</div>
	{/if}

	<div class="mt-10 flex gap-3">
		<button class="btn variant-filled-primary" disabled={!router}> Deploy Router </button>
	</div>
</PageLayout>
