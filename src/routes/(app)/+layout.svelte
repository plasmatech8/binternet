<script lang="ts">
	import '../../app.postcss';
	import { AppShell, Modal, initializeStores, type ModalComponent } from '@skeletonlabs/skeleton';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import yaml from 'highlight.js/lib/languages/yaml';
	hljs.registerLanguage('yaml', yaml);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// FontAwesome Icons
	import '@fortawesome/fontawesome-free/js/all.min.js';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	// Modals
	import SiteRouterModal from '../../lib/components/modals/SiteRouterModal.svelte';
	import SelectInscriptionModal from '$lib/components/modals/SelectInscriptionModal.svelte';
	import InscribeFilesModal from '$lib/components/modals/InscribeFilesModal.svelte';
	import HistoryModal from '$lib/components/modals/HistoryModal.svelte';
	const modalRegistry: Record<string, ModalComponent> = {
		siteRouterModal: { ref: SiteRouterModal },
		selectInscriptionModal: { ref: SelectInscriptionModal },
		inscribeFilesModal: { ref: InscribeFilesModal },
		historyModal: { ref: HistoryModal }
	};
	initializeStores();
</script>

<!-- Navigation Loading Bar -->
{#await import('@prgm/sveltekit-progress-bar') then { ProgressBar }}
	<div class="fixed z-[1000] w-screen top-0 left-0 right-0 h-1">
		<ProgressBar class="text-primary-500" />
	</div>
{/await}

<!-- App Shell -->
<AppShell regionPage="scroll-smooth">
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />

	<!-- Footer -->
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>

<!-- Modal -->
<Modal components={modalRegistry} />
