<script>
	// =================================================================
	// I M P O R T
	// =================================================================

	// Svelte components
	import { onMount } from 'svelte';

	// Carbon components
	import { OverflowMenu, OverflowMenuItem } from 'carbon-components-svelte';

	// Carbon icons
	// --

	// Dictionary and other stores
	import { Dict } from '../../stores/dictionary/dictionary.js';
	import { WaitingLoadingGlobalVisible } from '../../stores/general/general.js';

	// Our components
	//import ErrorMsg from '../general/ErrorMsg.svelte';

	// Our functions
	import { getWeekNumber } from '../general/dateFunctions.js';

	// Our styles
	// --

	// Our images
	// --

	// .....................................................> END IMPORT

	// =================================================================
	// P R O P S
	// =================================================================

	export let year = null;
	export let month = null;
	export let customSettings = null;
	export let disabledDates = null;
	export let selectedDates = [];
	export let usageScheduleDates = null;
	export let updateSelectedDates = null;
	export let monthCalendarFunctions = null;

	// .....................................................> END PROPS

	// =================================================================
	// V A R I A B L E S
	// =================================================================

	// Za prikazivanje poruke o grešci
	let showError = false;
	let errorSubtitle = '#MVP DatePicker';
	let monthName = null; // Za prikaz imena meseca
	let calendarSettings = { weekStartsOnMonday: true, showWeekNr: true }; // Opcije kalendara. Ukoliko se komponenti prosledi prop customSettings, calendarSettings preuzima vrednosti iz njega

	let fillerFields = null; // Služi za popunjavanje kalendara praznim poljima pre prvog, odnosno, posle poslednjeg dana u mesecu
	let daysInMonth = null; // Sadrži podatke koji su potrebni za generisanje polja dana u kalendaru
	let weekNumbers = null; // Sadrži podatke koji su potrebni za generisanje polja sa rednim brojevima nedelja

	let daysContainer = null;
	let componentBuilt = false;

	// ..................................................> END VARIABLES

	// =================================================================
	// F U N C T I O N S
	// =================================================================

	// Funkcija vraća niz objekata. Svaki objekat opisuje jedan dan u mesecu: godina, mesec, indeks dana (0 je nedelja)
	function generateDayFields() {
		return new Promise((resolve, reject) => {
			// Broj dana u mesecu
			let monthLengths = {
				1: 31,
				3: 31,
				4: 30,
				5: 31,
				6: 30,
				7: 31,
				8: 31,
				9: 30,
				10: 31,
				11: 30,
				12: 31
			};
			monthLengths['2'] = isLeapYear(year) ? 29 : 28;

			// Globalna promenljiva daysInMonth postaje niz.
			// Elementi niza su objekti čija svojstva opisuju svaki dan u mesecu: godina, mesec, indeks dana (0 je nedelja), da li je today
			daysInMonth = [];
			let today = new Date();
			let todayObj = {
				year: today.getFullYear(),
				month: today.getMonth() + 1,
				day: today.getDate()
			};

			for (let dayOfMonth = 1; dayOfMonth <= monthLengths[parseInt(month)]; dayOfMonth++) {
				const tempDate = new Date(year, parseInt(month) - 1, dayOfMonth);
				let tempDateObj = {};
				tempDateObj.year = year;
				tempDateObj.month = parseInt(month);
				tempDateObj.day = dayOfMonth;
				tempDateObj.isToday =
					parseInt(year) === parseInt(todayObj.year) &&
					parseInt(month) === parseInt(todayObj.month) &&
					parseInt(dayOfMonth) === parseInt(todayObj.day);
				tempDateObj.dayIndex = tempDate.getDay();
				daysInMonth.push(tempDateObj);
			}
			resolve();
			//console.log('Dani, ovo sam izgenerisao', daysInMonth);
		});
	}

	// Na osnovu property-ja disabledDates označava disable-ovane dane
	function markDisabledFields() {
		return new Promise((resolve, reject) => {
			let dayFields = daysContainer.querySelectorAll('.MVPDay');
			for (const day of dayFields) {
				if (disabledDates === null) {
					day.classList.remove('MVPDisabledDay');
				} else {
					if (disabledDates.includes(dateString(day.textContent))) {
						day.classList.add('MVPDisabledDay');
					} else {
						day.classList.remove('MVPDisabledDay');
					}
				}
			}
			resolve();
		});
	}

	// Na osnovu primljenog dana, a koristeći props-e year i month, vraća datumski string formata "YYYY-MM-DD"
	function dateString(dayNumberString) {
		let dayNumberInt = parseInt(dayNumberString);
		let monthNumberInt = parseInt(month);
		let dayString = dayNumberInt < 10 ? `0${dayNumberInt}` : `${dayNumberInt}`;
		let monthString = monthNumberInt < 10 ? `0${monthNumberInt}` : `${monthNumberInt}`;
		return `${year}-${monthString}-${dayString}`;
	}

	// Funkcija vraća true ako je godina prestupna, odnosno, false, ukoliko godina nije prestupna
	function isLeapYear(year) {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

	// Generiše prazne, filler polja za početak i kraj kalendara
	function generateEmptyFillerFields() {
		return new Promise((resolve, reject) => {
			let indexOfFirstDayInMonth = daysInMonth[0].dayIndex; // Na koji dan počinje mesec
			let indexOfLastDayInMonth = daysInMonth[daysInMonth.length - 1].dayIndex; // Na koji dan završava mesec
			let nrOfStartFillerDays = 0; // Broj filler dana na početku kalendara
			let nrOfEndFillerDays = 0; // Broj filler dana na kraju kalendara

			// Ako sedmice počinje ponedeljkom
			if (calendarSettings.weekStartsOnMonday) {
				// Određivanje početnih filler-a

				// Ako je prvi dan nedelja
				if (indexOfFirstDayInMonth === 0) {
					nrOfStartFillerDays = 6;
				}
				// Ako prvi dan nije nedelja
				else {
					nrOfStartFillerDays = indexOfFirstDayInMonth - 1;
				}

				// Određivanje krajnjih fillera

				// Ako je poslednji dan nedelja
				if (indexOfLastDayInMonth === 0) {
					nrOfEndFillerDays = 0;
				}
				// Ako poslednji dan nije nedelja
				else {
					nrOfEndFillerDays = 7 - indexOfLastDayInMonth;
				}
			}
			// Ako sedmica počinje nedeljom
			else {
				nrOfStartFillerDays = indexOfFirstDayInMonth;
				nrOfEndFillerDays = 6 - indexOfLastDayInMonth;
			}

			let tempFillerFields = {
				start: [],
				end: []
			};

			for (let i = 1; i <= nrOfStartFillerDays; i++) {
				tempFillerFields.start.push({});
			}
			for (let i = 1; i <= nrOfEndFillerDays; i++) {
				tempFillerFields.end.push({});
			}

			fillerFields = JSON.parse(JSON.stringify(tempFillerFields));
			resolve();
		});
	}

	// Generiše redni broj sedmica
	function generateWeekNumbers() {
		return new Promise((resolve, reject) => {
			let tempWeekNumbers = new Set();

			for (const day of daysInMonth) {
				let weekNumber = getWeekNumber(new Date(day.year, day.month - 1, day.day));
				tempWeekNumbers.add(weekNumber);
			}

			weekNumbers = [...tempWeekNumbers];
			resolve();
		});
	}

	function deSelectDay(e) {
		if (!e.target.classList.contains('MVPDisabledDay')) {
			updateSelectedDates(dateString(e.target.textContent), e.shiftKey); // ...roditeljskoj funkciji prosledi datum
		}
	}

	// Kada se promeni niz koji sadrži disable-ovane dane, moguće je da se neki njegov element odnosi na prethodno selektovani dan.
	// U tom slučaju, sa tih dana treba skinuti pripadnost klasi MVPSelectedDay
	function deselectPreviouslySelectedDisabledFields() {
		let daysToDeselect = daysContainer.querySelectorAll('.MVPSelectedDay.MVPDisabledDay');
		for (const day of daysToDeselect) {
			day.classList.remove('MVPSelectedDay');
		}
	}

	function markSelectedDates() {
		let allDays = daysContainer.querySelectorAll('.MVPDay');
		for (const day of allDays) {
			if (selectedDates === null || selectedDates.length === 0) {
				day.classList.remove('MVPSelectedDay');
			} else {
				if (selectedDates.includes(dateString(day.textContent))) {
					if (!day.classList.contains('MVPDisabledDay')) {
						day.classList.add('MVPSelectedDay');
					}
				} else {
					day.classList.remove('MVPSelectedDay');
				}
			}
		}
	}

	async function initialize() {
		await generateDayFields();
		await generateEmptyFillerFields();
		await generateWeekNumbers();
		markDisabledFields();
		markSelectedDates();
	}

	// ..................................................> END FUNCTIONS

	// =================================================================
	// L I F E  C Y C L E
	// =================================================================

	onMount(async () => {
		await initialize().then(() => {
			componentBuilt = true;
		});
	});

	// .................................................> END LIFE CYCLE

	// =================================================================
	// C O N T E X T
	// =================================================================
	// --
	// ....................................................> END CONTEXT

	// =================================================================
	// R E A C T I V E   S T A T E M E N T S
	// =================================================================
	$: {
		// Ispis imena meseca, čim bude dostupan redni broj meseca
		if (month !== null && $Dict.locale) {
			const tempDate = new Date(2000, parseInt(month) - 1, 1);
			monthName = tempDate.toLocaleDateString($Dict.locale, { month: 'long' }).toUpperCase();
		}
	}

	// Ako je komponenti poslat custom settings objekat, treba ažurirati interne settings-e smeštene u calendarSettings
	$: {
		if (customSettings !== null) {
			for (const key in customSettings) {
				calendarSettings[key] = customSettings[key];
			}
		}
	}

	// Ako se promeni godina ili mesec
	$: {
		if (year !== null && month !== null && componentBuilt) {
			initialize();
		}
	}

	// Ako se promeni niz koji sadrži dane koji treba da budu disable-ovani
	$: {
		if ((disabledDates === null || disabledDates !== null) && componentBuilt) {
			markDisabledFields();
			deselectPreviouslySelectedDisabledFields();
		}
	}

	// Ako se promeni niz koji sadrži selektovane dane
	$: {
		if ((selectedDates.length === 0 || selectedDates.length > 0) && componentBuilt) {
			markSelectedDates();
		}
	}

	// .........................................> END REACTIVE STATEMENS
</script>

<!-- 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@                                                                                                       @@@
@@@                                                H T M L                                                @@@
@@@                                                                                                       @@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
-->

<div
	class={calendarSettings.showWeekNr
		? 'MVPDatePickerContainer MVPShowWeekNr'
		: 'MVPDatePickerContainer'}
>
	<!-- ************** -->
	<!-- Mesec i godina -->
	<!-- ************** -->
	<div class="MVPMonthNameAndYearContainerAndOverflowMenuContainer">
		<div class="MVPMonthNameAndYearContainer">
			<span class="MVPMonthName">{monthName}</span>
			<span class="MVPYear">{year}</span>
		</div>
		<OverflowMenu>
			<OverflowMenuItem
				text="Selektuj sve dane"
				on:click={() => {
					monthCalendarFunctions.selecteAllDaysInMonth(year, parseInt(month));
				}}
			/>
			<OverflowMenuItem
				danger
				text="Deselektuj sve dane"
				on:click={() => {
					monthCalendarFunctions.deselectAllDaysInMont(year, parseInt(month));
				}}
			/>
			<OverflowMenuItem
				text="Selektuj inverzno"
				on:click={() => {
					monthCalendarFunctions.selectedInverseInMonth(year, parseInt(month));
				}}
			/>
		</OverflowMenu>
	</div>

	<!-- ********** -->
	<!-- Imena dana -->
	<!-- ********** -->
	<div class="MVPWeekDaysContainer">
		{#if !calendarSettings.weekStartsOnMonday}
			<span class="MVPWeekDay"> {$Dict.weekDaysNamesShort[0]} </span>
		{/if}
		<span class="MVPWeekDay"> {$Dict.weekDaysNamesShort[1]} </span>
		<span class="MVPWeekDay"> {$Dict.weekDaysNamesShort[2]} </span>
		<span class="MVPWeekDay"> {$Dict.weekDaysNamesShort[3]} </span>
		<span class="MVPWeekDay"> {$Dict.weekDaysNamesShort[4]} </span>
		<span class="MVPWeekDay"> {$Dict.weekDaysNamesShort[5]} </span>
		<span class="MVPWeekDay"> {$Dict.weekDaysNamesShort[6]} </span>
		{#if calendarSettings.weekStartsOnMonday}
			<span class="MVPWeekDay"> {$Dict.weekDaysNamesShort[0]} </span>
		{/if}
	</div>

	<div class="MVPWeekNrAndDaysContainer">
		<!-- ****************** -->
		<!-- Redni broj nedelja -->
		<!-- ****************** -->
		{#if calendarSettings.showWeekNr}
			{#if weekNumbers !== null}
				<div class="MVPWeekNrContainer">
					{#each weekNumbers as weekNumber}
						<span class="MVPWeekNr"> {weekNumber} </span>
					{/each}
				</div>
			{/if}
		{/if}

		<!-- ****************** -->
		<!--      D A N I       -->
		<!-- ****************** -->

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="MVPDaysContainer" bind:this={daysContainer}>
			{#if fillerFields !== null}
				{#each fillerFields.start as filler}
					<span class="MVPDayFiller" />
				{/each}
			{/if}

			{#if daysInMonth !== null}
				{#each daysInMonth as dayField}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<span
						class={dayField.isToday ? 'MVPDay MVPToday' : 'MVPDay'}
						on:click={(e) => {
							deSelectDay(e);
						}}
					>
						{dayField.day}
					</span>
				{/each}
			{/if}

			{#if fillerFields !== null}
				{#each fillerFields.end as filler}
					<span class="MVPDayFiller" />
				{/each}
			{/if}
		</div>
	</div>
</div>

<!-- 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@                                                                                                       @@@
@@@                                                 C S S                                                 @@@
@@@                                                                                                       @@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
-->

<style>
	.MVPDatePickerContainer {
		width: 320px;
		display: flex;
		flex-direction: column;
		font-size: 14px;
		user-select: none;
		background-color: var(--gray-1);
		padding: 5px;
	}

	.MVPDatePickerContainer.MVPShowWeekNr {
		width: 360px;
	}

	.MVPMonthNameAndYearContainerAndOverflowMenuContainer {
		display: flex;
	}

	.MVPMonthNameAndYearContainer {
		display: flex;
		width: 100%;
		justify-content: center;
		height: 40px;
		align-items: center;
		font-size: 15px !important;
		flex: 1;
		padding-left: 44px;
	}

	.MVPMonthName {
		text-align: center;
		margin-right: 20px;
		font-weight: bold;
	}

	.MVPWeekNrAndDaysContainer {
		display: flex;
	}

	.MVPWeekDaysContainer,
	.MVPDaysContainer {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		justify-content: space-around;
		padding: 0;
	}

	.MVPWeekDay {
		font-size: 13px;
		color: var(--gray-5);
	}

	.MVPDatePickerContainer.MVPShowWeekNr .MVPWeekDaysContainer {
		padding-left: 40px;
	}

	.MVPWeekNrContainer {
		display: flex;
		flex-direction: column;
		width: 44px;
		border-right: 1px var(--gray-3) solid;
	}

	.MVPWeekNr {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gray-5);
		font-size: 11px;
		border: 1px solid transparent;
		margin: 2px;
	}

	.MVPDay,
	.MVPDayFiller,
	.MVPWeekDay {
		display: flex;
		width: 40px;
		height: 40px;
		align-items: center;
		justify-content: center;
		border: 1px solid transparent;
		margin: 2px;
	}

	.MVPDay.MVPToday {
		font-weight: bolder;
		flex-direction: column;
		text-align: center;
		padding-top: 8px;
	}

	/* Kvadrat ispod dana koji označava današnji dan */
	.MVPDay.MVPToday::after {
		content: '';
		width: 5px;
		height: 5px;
		background-color: var(--blue-5);
		margin-top: 3px; /* Razmak između teksta i kvadrata */
	}

	.MVPDay:not(.MVPDisabledDay):hover {
		background-color: var(--gray-3);
	}

	:global(.MVPDisabledDay) {
		opacity: 0.3;
		/* background-color: white; */
		user-select: none;
	}

	:global(.MVPSelectedDay:not(.MVPDisabledDay)) {
		border-color: var(--blue-5) !important;
	}
</style>
