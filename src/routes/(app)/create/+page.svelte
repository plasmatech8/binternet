<script lang="ts">
	import type { OrdinalsBotOrderStatusResponse } from '$lib/backend-api/sources/ordinalsBot';
	import InscriptionCard from '$lib/components/cards/InscriptionCard.svelte';
	import PageLayout from '$lib/components/layouts/PageLayout.svelte';
	import { orderHistoryStore } from '$lib/stores/history';
	import { wallet } from '$lib/stores/wallet';
	import { addCodeBlockRouterLinks } from '$lib/utils/actions';
	import { str2ab } from '$lib/utils/conversion';
	import {
		CodeBlock,
		FileButton,
		getModalStore,
		getToastStore,
		localStorageStore
	} from '@skeletonlabs/skeleton';
	import axios from 'axios';
	import yaml from 'js-yaml';
	import { clone, uniq, uniqBy } from 'lodash-es';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import pkg from '../../../../package.json?raw';

	const { version } = JSON.parse(pkg);
	const isBeta = parseInt(version.split('.')[0]) < 1;
	let betaWarningOpen = true;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	/*
	 * Inscribe Files & Define Routes
	 */

	const inscriptions = localStorageStore<InscriptionFile[]>('inscriptions', []);
	let formEl: HTMLFormElement;

	fixInscriptionDataProblems();

	function fixInscriptionDataProblems() {
		// 1. Filter out null or undefined inscriptions
		const invalidIndexes = $inscriptions
			.map((insc, index) => (insc && insc.id ? null : index))
			.filter((index) => index !== null);
		if (invalidIndexes.length > 0) {
			console.error(
				`Error in data: inscriptions at indexes ${invalidIndexes.join(', ')} are null or undefined. These inscriptions will be removed.`
			);
			$inscriptions = $inscriptions.filter((insc) => insc);
		}
		// 2. Group by 'id' to find duplicates
		const idToIndexes = $inscriptions.reduce(
			(acc, insc, index) => {
				acc[insc.id] = acc[insc.id] || [];
				acc[insc.id].push(index);
				return acc;
			},
			{} as Record<string, number[]>
		);
		const duplicateIds = Object.keys(idToIndexes).filter((id) => idToIndexes[id].length > 1);
		if (duplicateIds.length > 0) {
			console.error(
				`Error in data: Duplicate inscriptions found for IDs: ${duplicateIds.join(', ')}. The duplicates inscriptions will be removed.`
			);
			$inscriptions = uniqBy($inscriptions, 'id');
		}
	}

	$: allPathsUnique =
		$inscriptions.map((insc) => insc.path).length ===
		uniq($inscriptions.map((insc) => insc.path)).length;

	$: pendingInscriptions = $inscriptions.filter((insc) => {
		return insc.type === 'new' && !insc.new?.number && !insc.inscribing;
	});

	$: inscribingInscriptions = $inscriptions.filter((insc) => {
		return insc.type === 'new' && !insc.new?.number && insc.inscribing;
	});

	async function onFileUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const fileList = target.files as FileList;

		// Add inscriptions to list
		for (let i = 0; i < fileList.length; i++) {
			const file = fileList[i];
			if (!file.type) {
				toastStore.trigger({
					message: `Unknown content type for ${file.name}. Skipping this file.`,
					background: 'variant-filled-error'
				});
				continue;
			}
			const uuid = crypto.randomUUID();
			const newInscription: InscriptionFile = {
				id: uuid,
				type: 'new',
				path: '/' + (file.webkitRelativePath !== '' ? file.webkitRelativePath : file.name),
				new: {
					filename: file.name,
					filepath: file.webkitRelativePath ?? file.name,
					size: file.size,
					data: await file.arrayBuffer(),
					contentType: file.type,
					orderFilename: `${uuid}_${file.name}`
				}
			};
			$inscriptions = [...$inscriptions, newInscription];
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
						id: crypto.randomUUID(),
						type: 'existing',
						path: path,
						existing: r
					};
					$inscriptions = [...$inscriptions, newInscription];
				}
			}
		});
	}

	function onMoveUp(index: number) {
		const current = clone($inscriptions[index]);
		const other = clone($inscriptions[index - 1]);
		if (!current || !other) return;
		$inscriptions[index] = other;
		$inscriptions[index - 1] = current;
	}

	function onMoveDown(index: number) {
		const current = clone($inscriptions[index]);
		const other = clone($inscriptions[index + 1]);
		if (!current || !other) return;
		$inscriptions[index] = other;
		$inscriptions[index + 1] = current;
	}

	function onDelete(inscription: InscriptionFile) {
		$inscriptions = $inscriptions.filter((insc) => insc !== inscription);
	}

	/*
	 * Manage Pending Orders
	 */

	onMount(() => {
		// Every 5 seconds, check if pending order IDs have completed submission,
		// Then add the (unconfirmed) inscription information to the list of inscriptions.
		const interval = setInterval(async () => {
			for (let i = 0; i < $orderHistoryStore.length; i++) {
				const orderStatus = $orderHistoryStore[i];
				// Do not check already completed orders
				if (orderStatus.completed) continue;
				// Do not check if more than 5 minutes old
				if (Date.now() - orderStatus.createdAt > 300_000) continue;
				// Check order status for pending order
				const orderId = orderStatus.id;
				try {
					// Query order details
					const res = await axios.get<OrdinalsBotOrderStatusResponse>(`/api/order/${orderId}`);
					const newOrderStatus = res.data;
					if (!newOrderStatus.completed) {
						console.log(`Order ${orderId} still pending!`);
						continue;
					}
					console.log(`Order ${orderId} has completed submission!`);
					// Update inscriptions array with inscription information
					updateInscriptionFilesWithOrderStatus(newOrderStatus);
					// Update the order status
					$orderHistoryStore[i] = newOrderStatus;
				} catch (error) {
					console.error('Failed to fetch order status', error);
				}
			}
		}, 5000);
		return () => clearInterval(interval);
	});

	function updateInscriptionFilesWithOrderStatus(orderStatus: OrdinalsBotOrderStatusResponse) {
		$inscriptions = $inscriptions.map((insc) => {
			const matchingFile = orderStatus.files.find((file) => file.name === insc.new?.orderFilename);
			if (matchingFile) {
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
	}

	async function inscribePendingFiles() {
		// Check that wallet is connected
		if (!$wallet) {
			return toastStore.trigger({
				message: 'Please connect you wallet first!',
				background: 'variant-filled-error'
			});
		}
		// Send batch inscription order transaction
		modalStore.trigger({
			component: 'inscribeFilesModal',
			type: 'component',
			meta: { inscriptions: pendingInscriptions },
			response: (r?: OrdinalsBotOrderStatusResponse) => {
				if (r) {
					$orderHistoryStore = [...$orderHistoryStore, r];
					updateInscriptionFilesWithOrderStatus(r);
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
		allPathsUnique &&
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
			routerData.routes[insc.path] = inscNumber;
		});
		return routerData;
	}

	function inscribeRouter() {
		// Check that wallet is connected
		if (!$wallet) {
			return toastStore.trigger({
				message: 'Please connect you wallet first!',
				background: 'variant-filled-error'
			});
		}

		// // Testing:
		// modalStore.trigger({
		// 	component: 'waitingForSiteConfirmationModal',
		// 	type: 'component',
		// 	meta: { router, txnId: '4439ef741b27c4788eed1f7bebde1d253a5f1c9bee3ef63a1ae4e94604720192' },
		// 	response: (r) => {
		// 		if (r) {
		// 			$inscriptions = [];
		// 			router = null;
		// 		}
		// 	}
		// });
		// return;

		// Send inscribe transaction
		const routerText = yaml.dump(router);
		const routerData = str2ab(routerText);
		wallet
			.sendInscribeTxn({ inscriptionData: routerData, contentType: 'application/x-yaml' })
			.then((txnId) => {
				console.log(`SENT ROUTER INSCRIPTION TXN: ${txnId}`);
				// Open waiting for router inscription modal
				modalStore.trigger({
					component: 'waitingForSiteConfirmationModal',
					type: 'component',
					meta: { router, txnId },
					response: (r) => {
						if (r) {
							$inscriptions = [];
							router = null;
						}
					}
				});
			})
			.catch((error) => {
				console.error('Error with wallet:', error);
				toastStore.trigger({
					message: error.message,
					background: 'variant-filled-error'
				});
			});
	}

	/*
	 * Reset form dialog
	 */

	function openConfirmResetDialog() {
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

	/*
	 * View history dialog
	 */

	function openHistoryDialog() {
		modalStore.trigger({
			type: 'component',
			component: 'historyModal'
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
	{#if isBeta && betaWarningOpen}
		<aside class="alert variant-soft-warning mb-4">
			<!-- Icon -->
			<i class="fas fa-exclamation-triangle text-3xl"></i>
			<!-- Message -->
			<div class="alert-message">
				<h3 class="h3">This application is currently in Beta.</h3>
				<p>Some features may have issues or bugs. Use at your own risk.</p>
				<p>
					We are not liable for any issues that may arise from using this beta application. Your
					feedback is appreciated.
				</p>
			</div>
			<!-- Actions -->
			<div class="alert-actions">
				<button
					class="btn-icon hover:variant-soft-warning"
					on:click={() => (betaWarningOpen = false)}
				>
					<i class="fas fa-close"></i>
				</button>
			</div>
		</aside>
	{/if}

	<!-- Main Page Title & Reset button -->
	<div class="flex gap-2 justify-between items-center">
		<!-- Title -->
		<h1 class="h1">Create</h1>
		<!-- Clear Page data button -->
		<div class="mt-6 flex gap-3">
			<button class="btn btn-sm variant-ghost gap-2" on:click={openHistoryDialog}>
				<i class="fas fa-list"></i>
				History
			</button>
			<button
				class="btn btn-sm variant-ghost gap-2"
				disabled={!router && !$inscriptions.length}
				on:click={openConfirmResetDialog}
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
				{#key $inscriptions}
					<FileButton
						button="btn btn-sm variant-filled"
						name="files"
						directory
						webkitdirectory
						mozdirectory
						on:change={onFileUpload}
					>
						<div>Upload Folder</div>
						<i class="fas fa-add"></i>
					</FileButton>
					<FileButton
						button="btn btn-sm variant-filled"
						name="files"
						multiple
						on:change={onFileUpload}
						files={undefined}
					>
						<div>Upload File</div>
						<i class="fas fa-add"></i>
					</FileButton>
				{/key}
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
			{#each $inscriptions as inscription, i (inscription.id)}
				<div transition:slide animate:flip={{ duration: 500 }}>
					{#key i}
						<InscriptionCard
							index={i}
							bind:inscription
							otherInscriptions={$inscriptions.filter((insc) => insc.id !== inscription.id)}
							on:delete={() => onDelete(inscription)}
							on:moveup={() => onMoveUp(i)}
							on:movedown={() => onMoveDown(i)}
						></InscriptionCard>
					{/key}
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
			{#key router}
				<div use:addCodeBlockRouterLinks={{}}>
					<CodeBlock language="yaml" code={yaml.dump(router, {})}></CodeBlock>
				</div>
			{/key}
		{:else}
			<div class="h-40 grid place-items-center gap-1">
				<i class="fas fa-signs-post text-7xl opacity-50"></i>

				<div class="flex gap-5">
					<div class="">
						{#if $inscriptions.length == 0}
							<div class="opacity-60">
								<i class="fas fa-exclamation-triangle"></i>
								<span> Must define at least one route </span>
							</div>
						{:else if pendingInscriptions.length > 0}
							<div class="text-warning-500 animate-bounce opacity-80">
								<i class="fas fa-exclamation-triangle"></i>
								Files still need to be inscribed
							</div>
						{:else if inscribingInscriptions.length > 0}
							<div class="text-warning-500 animate-bounce opacity-80">
								<i class="fas fa-hourglass-half"></i>
								Inscriptions are waiting for confirmation
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Inscribe Router button -->
		<div class="mt-10 flex gap-3">
			<button class="btn variant-filled-primary" disabled={!router} on:click={inscribeRouter}>
				Inscribe Router
			</button>
		</div>
	</form>
</PageLayout>
