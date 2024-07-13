<script lang="ts">
	import { FileButton, getModalStore } from '@skeletonlabs/skeleton';
	import InscriptionCard from '../../../lib/components/cards/InscriptionCard.svelte';
	import { slide } from 'svelte/transition';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { wallet } from '$lib/stores/wallet';

	const modalStore = getModalStore();

	let inscriptions: InscriptionFile[] = [];
	let router: Router | null = null;
	let formEl: HTMLFormElement;

	// Reset generated router when routes/inscriptions list changes
	$: if (inscriptions) router = null;

	// Get files that need to be inscribed
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
					data: await file.arrayBuffer(),
					contentType: file.type
				}
			};
			inscriptions = [newInscription, ...inscriptions];
		}
	}

	function onAddExisting() {
		modalStore.trigger({
			component: 'selectInscriptionModal',
			type: 'component',
			response: async (r: { number: number; contentType: string; contentSize: number }) => {
				if (r) {
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
						existing: r
					};
					inscriptions = [newInscription, ...inscriptions];
				}
			}
		});
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

	// let waitingForInscriptions = []

	async function inscribePendingFiles() {
		for (let i = 0; i < pendingInscriptions.length; i++) {
			const insc = pendingInscriptions[i];
			console.log(`Inscribing pending inscription #${i}`, insc);
			if (!insc.new) throw Error(`Incorrect data for inscription ${i} `);
			const buf = insc.new?.data;
			if (!buf) throw Error(`No data in inscription ${i}`);
			wallet.inscribe(buf, insc.new?.contentType, (txId) => console.log(txId));
		}
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

	<div class="flex flex-col lg:flex-row md:justify-between items-center my-10">
		<h2 class="h2 mb-5 lg:mb-0">
			Define Routes <span class="text-2xl opacity-60">and Inscribe Files</span>
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
			<button class="btn btn-sm variant-filled" type="button" on:click={onAddExisting}>
				<div>Add Existing</div>
				<i class="fas fa-add"></i>
			</button>
		</div>
	</div>

	<div class="prose max-w-none prose-invert mb-10">
		<p>
			Add inscriptions to attach to URL paths of your site. Either create new inscriptions, or add
			the inscription number for an existing one.
		</p>
		<p>
			The URL path can include wildcards (<code>*</code>, <code>**</code>) to match multiple routes
			on your site. See the <a href="/docs#routes" target="_blank">documentation</a> for more details.
		</p>
	</div>

	<form
		on:submit|preventDefault={() => {
			formEl.checkValidity();
		}}
		bind:this={formEl}
	>
		<div class="flex flex-col gap-4">
			{#each inscriptions as inscription (inscription.id)}
				<div transition:slide>
					<InscriptionCard
						bind:inscription
						otherInscriptions={inscriptions.filter((insc) => insc.id !== inscription.id)}
						on:delete={() => onDelete(inscription)}
					></InscriptionCard>
				</div>
			{:else}
				<div class="h-40 grid place-items-center gap-3 opacity-50">
					<i class="fas fa-feather-pointed text-7xl mb-3"></i>
				</div>
			{/each}
		</div>
		<div class="mt-10 flex gap-3 items-center">
			<button
				type="button"
				class="btn variant-filled-primary"
				disabled={!pendingInscriptions.length}
				on:click={inscribePendingFiles}
			>
				Inscribe Pending Files
			</button>
			<div class="opacity-50 italic">
				{#if pendingInscriptions.length > 0}
					Need to inscribe {pendingInscriptions.length} file{pendingInscriptions.length !== 1
						? 's'
						: ''}
				{/if}
			</div>
		</div>
	</form>

	<div class="flex justify-center lg:justify-start">
		<h2 class="h2 my-10">Create Router</h2>
	</div>

	<div class="prose max-w-none prose-invert mb-10">
		<p>
			Create a <a href="/docs#router-specification" target="_blank">router inscription</a> which configures
			URL paths for your site. The inscription number for the router is the entry point for your site.
		</p>
	</div>

	<div class="flex gap-3 items-center mb-10">
		<button
			class="btn variant-filled-primary"
			disabled={!!pendingInscriptions.length || inscriptions.length == 0}
			on:click={generateRouter}
		>
			Generate Router
		</button>
		<div class="opacity-50 italic">
			{#if inscriptions.length == 0}
				Must define at least one route
			{:else if pendingInscriptions.length > 0}
				Files still need to be inscribed
			{/if}
		</div>
	</div>

	{#if router}
		<div>
			<CodeBlock language="yaml" code={yaml.dump(router, {})}></CodeBlock>
		</div>
	{:else}
		<div class="h-40 grid place-items-center gap-3 opacity-50">
			<i class="fas fa-signs-post text-7xl"></i>
		</div>
	{/if}

	<div class="mt-10 flex gap-3">
		<button class="btn variant-filled-primary" disabled={!router}> Inscribe Router </button>
	</div>
</PageLayout>
