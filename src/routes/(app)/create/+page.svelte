<script lang="ts">
	import { FileButton, getModalStore, localStorageStore } from '@skeletonlabs/skeleton';
	import InscriptionCard from '../../../lib/components/cards/InscriptionCard.svelte';
	import { slide } from 'svelte/transition';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import PageLayout from '$lib/components/layouts/PageLayout.svelte';
	import type {
		OrdinalsBotInscriptionOrderResponse,
		OrdinalsBotOrderStatusResponse
	} from '$lib/backend-api/sources/ordinalsBot';
	import axios from 'axios';
	import { uniq } from 'lodash-es';

	const modalStore = getModalStore();

	/*
	 * Inscribe Files & Define Routes
	 */

	let inscriptions = localStorageStore<InscriptionFile[]>('inscriptions', []);
	let formEl: HTMLFormElement;
	let pendingOrderIds: string[] = [];

	$: lastId = $inscriptions.reduce(
		(highestId, insc) => (highestId < insc.id ? insc.id : highestId),
		0
	);

	$: allPathsUnique =
		$inscriptions.map((insc) => insc.path).length ===
		uniq($inscriptions.map((insc) => insc.path)).length;

	$: pendingInscriptions = $inscriptions.filter((insc) => {
		return insc.type === 'new' && !insc.new?.number && !insc.inscribing;
	});

	async function onFileUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const fileList = target.files as FileList;

		// Add inscriptions to list
		for (const file of fileList) {
			const newInscription: InscriptionFile = {
				id: lastId + 1,
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
			$inscriptions = [newInscription, ...$inscriptions];
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
					while ($inscriptions.find((insc) => insc.path === basePath + pathNumber)) {
						pathNumber += 1;
					}
					const path = basePath + pathNumber;

					// Add inscription to list
					const newInscription: InscriptionFile = {
						id: lastId + 1,
						type: 'existing',
						path: path,
						existing: r
					};
					$inscriptions = [newInscription, ...$inscriptions];
				}
			}
		});
	}

	function onDelete(inscription: InscriptionFile) {
		$inscriptions = $inscriptions.filter((insc) => insc !== inscription);
	}

	async function inscribePendingFiles() {
		modalStore.trigger({
			component: 'inscribeFilesModal',
			type: 'component',
			meta: { inscriptions: pendingInscriptions },
			response: (r?: OrdinalsBotOrderStatusResponse) => {
				console.log(r);
				if (r) {
					pendingOrderIds = [...pendingOrderIds, r.id];
					let orderStatus: OrdinalsBotOrderStatusResponse = r;

					// TODO: Keep track of pending orders and restart the checks while they exist

					// Poll the API until status changes from "waiting-payment" to "complete"
					setInterval(async () => {
						if (orderStatus?.state !== 'completed') {
							console.log('Fetching order status...');
							try {
								const res = await axios.get<OrdinalsBotOrderStatusResponse>(
									`/api/order/${orderStatus.id}`
								);
								orderStatus = res.data;
								console.log(orderStatus);
								if (orderStatus.state === 'completed') {
									console.log('Order is now completed!');
								}
								$inscriptions = $inscriptions.map((insc) => {
									const matchingFile = orderStatus.files.find((file) => file.name === insc.path);
									if (matchingFile) {
										console.log(matchingFile);
										const newInsc: InscriptionFile = {
											...insc,
											inscribing: {
												orderId: orderStatus.id,
												inscriptionId: matchingFile.inscriptionId,
												txnId: matchingFile.tx?.reveal
											}
										};
										return newInsc;
									}
									return insc;
								});
							} catch (error) {
								console.error('Failed to fetch order status', error);
							}
						}
					}, 2000);
				}
			}
		});
	}

	/*
	 * Create Router Form
	 */

	$: router = canGenerateRouter ? generateRouter($inscriptions) : null;
	$: canGenerateRouter =
		!pendingInscriptions.length &&
		$inscriptions.length > 0 &&
		$inscriptions.every((insc) => (insc.type === 'new' ? !!insc.new?.number : true));

	function generateRouter(inscriptions: InscriptionFile[]) {
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
		return routerData;
	}

	// $: console.log($inscriptions);
	$: console.log(pendingOrderIds);

	/*
	 * Reset form button & dialog
	 */

	function openConfirmResetFormDialog() {
		modalStore.trigger({
			type: 'confirm',

			title: 'Reset Form Data?',
			body: 'Are you sure you wish to proceed?',
			response: (r: boolean) => {
				if (r) {
					$inscriptions = [];
					router = null;
				}
			}
		});
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
	<!-- Main Page Title & Reset button -->
	<div class="flex gap-2 justify-between items-center">
		<!-- Title -->
		<h1 class="h1">Create</h1>
		<!-- Clear Page data button -->
		<div class="mt-6 flex gap-3">
			<button
				class="btn btn-sm variant-ghost gap-2"
				disabled={!router && !$inscriptions.length}
				on:click={openConfirmResetFormDialog}
			>
				<i class="fas fa-undo"></i>
				Reset Form
			</button>
		</div>
	</div>

	<!-- Define Routes and Inscribe Files section -->
	<form
		on:submit|preventDefault={() => {
			formEl.checkValidity();
		}}
		bind:this={formEl}
		class="my-10"
	>
		<!-- Heading and Action buttons -->
		<div class="flex flex-col lg:flex-row md:justify-between items-center mb-10">
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
				<FileButton
					button="btn btn-sm variant-filled"
					name="files"
					multiple
					on:change={onFileUpload}
				>
					<div>Upload File</div>
					<i class="fas fa-add"></i>
				</FileButton>
				<button class="btn btn-sm variant-filled" type="button" on:click={onAddExisting}>
					<div>Add Existing</div>
					<i class="fas fa-add"></i>
				</button>
			</div>
		</div>

		<!-- Text -->
		<div class="prose max-w-none dark:prose-invert mb-10">
			<p>
				Add inscriptions to attach to URL paths of your site. Either create new inscriptions, or add
				the inscription number for an existing one.
			</p>
			<p>
				The URL path can include wildcards (<code>*</code>, <code>**</code>) to match multiple
				routes on your site. See the <a href="/docs#routes" target="_blank">documentation</a> for more
				details.
			</p>
		</div>

		<!-- Inscription Files -->
		<div class="flex flex-col gap-4">
			{#each $inscriptions as inscription (inscription.id)}
				<div transition:slide>
					<InscriptionCard
						bind:inscription
						otherInscriptions={$inscriptions.filter((insc) => insc.id !== inscription.id)}
						on:delete={() => onDelete(inscription)}
					></InscriptionCard>
				</div>
			{:else}
				<div class="h-40 grid place-items-center gap-3 opacity-50">
					<i class="fas fa-file-signature text-7xl"></i>
				</div>
			{/each}
		</div>

		<!-- Inscribe Pending Files button -->
		<div class="mt-10 flex gap-3 items-center">
			<button
				type="button"
				class="btn variant-filled-primary"
				disabled={!pendingInscriptions.length || !allPathsUnique}
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

	<!-- Create Router section -->
	<form on:submit|preventDefault class="my-10">
		<!-- Heading -->
		<div class="flex flex-col lg:flex-row md:justify-between items-center mb-10">
			<h2 class="h2 mb-5 lg:mb-0">Create Router</h2>
			<div class="flex gap-5">
				<div class="">
					{#if $inscriptions.length == 0}
						<div class="opacity-50">
							<i class="fas fa-exclamation-triangle"></i>
							<span> Must define at least one route </span>
						</div>
					{:else if pendingInscriptions.length > 0}
						<div class="text-warning-500">
							<i class="fas fa-exclamation-triangle"></i>
							Files still need to be inscribed
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Text -->
		<div class="prose max-w-none dark:prose-invert mb-10">
			<p>
				Create a <a href="/docs#router-specification" target="_blank">router inscription</a> which configures
				URL paths for your site. The inscription number for the router is the entry point for your site.
			</p>
		</div>

		<!-- Router File details -->
		{#if router}
			<div>
				<CodeBlock language="yaml" code={yaml.dump(router, {})}></CodeBlock>
			</div>
		{:else}
			<div class="h-40 grid place-items-center gap-3 opacity-50">
				<i class="fas fa-signs-post text-7xl"></i>
			</div>
		{/if}

		<!-- Inscribe Router button -->
		<div class="mt-10 flex gap-3">
			<button class="btn variant-filled-primary" disabled={!router}> Inscribe Router </button>
		</div>
	</form>
</PageLayout>
