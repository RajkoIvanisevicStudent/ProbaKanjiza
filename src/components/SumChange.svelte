<script>
	// =================================================================
	// I M P O R T
	// =================================================================

	// Svelte components
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import { to_number } from 'svelte/internal';

	// Carbon components
	import { NumberInput } from '../../node_modules/carbon-components-svelte';
	import { RadioButtonGroup, RadioButton } from '../../node_modules/carbon-components-svelte';

	// Carbon icons
	import ExamMode from '../../node_modules/carbon-icons-svelte/lib/ExamMode.svelte';
	import WatsonHealthSpineLabel from '../../node_modules/carbon-icons-svelte/lib/WatsonHealthSpineLabel.svelte';
	import Calendar from '../../node_modules/carbon-icons-svelte/lib/Calendar.svelte';
	import CalculationAlt from '../../node_modules/carbon-icons-svelte/lib/CalculationAlt.svelte';

	// Dictionary and other stores
	// import { Dict } from '../../stores/dictionary/dictionary.js';
	// import { WaitingLoadingGlobalVisible } from '../../stores/general/general';

	// Our components
	// import ErrorMsg from '../general/ErrorMsg.svelte';

	// Our functions
	// --

	// Our styles
	// --

	// Our images
	// --

	// .....................................................> END IMPORT

	// =================================================================
	// P R O P S
	// =================================================================
	export let settings = null;
	// .....................................................> END PROPS

	// =================================================================
	// V A R I A B L E S
	// =================================================================

	// Za prikazivanje poruke o grešci
	let showError = false;
	let errorSubtitle = '#SumChange.svelte';
	// ..................................................> END VARIABLES

	// =================================================================
	// F U N C T I O N S
	// =================================================================
	// --
	// ..................................................> END FUNCTIONS

	// =================================================================
	// R E A C T I V E   S T A T E M E N T S
	// =================================================================
	//$: {
	// --
	//}

	// .........................................> END REACTIVE STATEMENS
</script>

<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ---------------------------------------------      H T M L      --------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
{#if showError}
	<!-- <ErrorMsg subtitle={errorSubtitle} /> -->
{:else if settings}
	<div id="ValueDistributionContainer">
		<div class="Item">
			<div class="Icon">
				<WatsonHealthSpineLabel size={35} fill="White" />
			</div>
			<div class="Description">
				<h6>Naziv grupe</h6>
			</div>
		</div>
		<div class="Item">
			<div class="Icon">
				<Calendar size={35} fill="White" />
			</div>
			<div class="Description" id="Period">
				<h6>{settings.period}</h6>
			</div>
		</div>
		<div class="Item">
			<div class="Icon">
				<CalculationAlt size={35} fill="White" />
			</div>
			<div class="Description" id="Value">
				<NumberInput
					size="lg"
					readonly={!settings.newValueAllowed}
					hideSteppers
					step={0.1}
					value={settings.value}
					on:input={(e) => {
						settings.value = e.detail;
					}}
					invalid={settings.value === null}
					invalidText='Neispravan unos'
				/>
			</div>
		</div>
		<div class="Item">
			<div class="Icon">
				<ExamMode size={35} fill="var(--gray-7)" />
			</div>
			<div class="Description" id="DistributionModeContainer">
				<p>Metoda redistribucije:</p>
				<div id="RadioButtonContainer">
					<RadioButtonGroup bind:selected={settings.distributionMode} orientation="vertical">
						{#if settings.newValueAllowed}
							<RadioButton labelText="Srazmerno postojecim vrednostima" value="currentValues" />
						{/if}
						<RadioButton labelText="Na podjednake iznose" value="equalValues" />
						<RadioButton labelText="Srazmerno proslogodisnjem planu" value="lastYearPlan" />
						<RadioButton labelText="Srazmerno proslogodisnjoj realizaciji" value="lastYearSales" />
					</RadioButtonGroup>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ---------------------------------------------      C  S  S      --------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->

<style>

	#ValueDistributionContainer {
		display: flex;
		flex-direction: column;
	}

	.Item {
		display: flex;
		/* align-items: flex-start; */
		/* background-color: white; */
		min-height: 53px;
	}

	/* Naziv grupe, boja pozadine */
	.Item:first-of-type {
		background-color: var(--gray-5);
	}

	/* Period, boja pozadine */
	.Item:nth-child(2) {
		background-color: var(--gray-4);
	}

	/* Ikone */
	.Icon {
		min-height: 53px;
		width: 53px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		padding-top: 9px;
		align-items: flex-start;
	}

	/* Boje pozadina kontejnera ikona */
	.Item:nth-child(1) .Icon {
		background-color: var(--gray-7);
	}

	.Item:nth-child(2) .Icon {
		background-color: var(--gray-6);
	}

	.Item:nth-child(3) .Icon {
		background-color: var(--gray-4);
	}

	.Item:nth-child(4) .Icon {
		background-color: var(--gray-2);
	}

	.Description {
		margin-left: 20px;
	}

	h6 {
		font-size: 18px !important;
		font-weight: 400 !important;
		padding: 14px 0;
	}

	#DistributionModeContainer {
		display: flex;
		flex-direction: column;
		padding-top: 15px;
	}

	p {
		margin: 0;
		width: 100%;
	}

	#RadioButtonContainer {
		display: flex;
		flex-direction: column;
		margin-top: 15px;
		margin-bottom: 40px;
	}

</style>
