<script>
	// =================================================================
	// I M P O R T
	// =================================================================

	// Dictionary and other stores
	// import { Dict } from '../../stores/dictionary/dictionary.js';
	// import { WaitingLoadingGlobalVisible } from '../../stores/general/general';
	// import NekaKomponenta from './NekaKomponenta.svelte';
	import SumChange from '../components/SumChange.svelte';

	// Our components
	// import HomePreviewLinks from '../general/HomePreviewLinks.svelte';
	// import ErrorMsg from '../general/ErrorMsg.svelte';

	// Our functions
	// --

	// Our styles
	// --

	// Our images
	// --

	// Carbon icons
	import Checkmark from '../../node_modules/carbon-icons-svelte/lib/Checkmark.svelte';
	import CheckmarkFilled from '../../node_modules/carbon-icons-svelte/lib/CheckmarkFilled.svelte';
	import Close from '../../node_modules/carbon-icons-svelte/lib/Close.svelte';
	import Search from '../../node_modules/carbon-icons-svelte/lib/Search.svelte';
	import Add from '../../node_modules/carbon-icons-svelte/lib/Add.svelte';
	import Edit from '../../node_modules/carbon-icons-svelte/lib/Edit.svelte';
	import Events from '../../node_modules/carbon-icons-svelte/lib/Events.svelte';

	// Carbon components
	import { Button, Modal, TextInput } from '../../node_modules/carbon-components-svelte';

	// Svelte components
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';

	// .....................................................> END IMPORT

	// =================================================================
	// P R O P S
	// =================================================================
	// export let propName;
	// .....................................................> END PROPS

	// =================================================================
	// V A R I A B L E S
	// =================================================================

	// Za prikazivanje poruke o grešci
	let showError = false;
	let errorSubtitle = '#PRIVREM';

	let showModal = false;

	let settings = {
		period: 'May / 2023',
		distributionMode: 'lastYearPlan',
		newValueAllowed: true,
		value: 15210
	};

	function pozdravi() {
		alert('Cao');
	}

	// =================================================================
	// R E A C T I V E   S T A T E M E N T S
	// =================================================================
	//$: {
	// --
	//}

	// ......................................................> END LOGIC
</script>

<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ---------------------------------------------      H T M L      --------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
{#if showError}
	<!-- <ErrorMsg subtitle={errorSubtitle} /> -->
{:else}
	<Button
		kind="tertiary"
		on:click={() => {
			showModal = true;
		}}>Dodaj</Button
	>
	<div class="NoPaddingModal">
		<Modal
			bind:open={showModal}
			preventCloseOnClickOutside
			modalHeading='Rasporedjivanje vrednosti'
			primaryButtonText='Primeni'
			secondaryButtonText='Odustani'
			primaryButtonIcon={Checkmark}
			primaryButtonDisabled={settings.value == null}
			on:click:button--secondary={() => (showModal = false)}
			on:click:button--primary={() => {
				showModal = false;
				console.log(settings);
			}}
		>
			<SumChange bind:settings />
		</Modal>
	</div>
{/if}

<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ---------------------------------------------      C  S  S      --------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->

<style>
</style>
