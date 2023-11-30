<script>
	// =================================================================
	// I M P O R T
	// =================================================================

	// Svelte components
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';

	// Carbon components
	import { Button } from 'carbon-components-svelte';
	// Carbon icons
	// --

	// Dictionary and other stores
	import { Dict } from '../../stores/dictionary/dictionary.js';
	import { WaitingLoadingGlobalVisible } from '../../stores/general/general.js';

	// Our components
	//import ErrorMsg from '../general/ErrorMsg.svelte';
	import MVPCalendar from './MVPCalendar.svelte';

	// Our functions
	import { parseDate } from '../general/dateFunctions.js';

	// Our styles
	// --

	// Our images
	// --

	// .....................................................> END IMPORT

	// =================================================================
	// P R O P S
	// =================================================================

	export let calendarMonths = [
		{ year: 2023, month: 11 },
		{ year: 2023, month: 12 },
		{ year: 2024, month: 1 },
		{ year: 2024, month: 2 },
		{ year: 2024, month: 3 },
		{ year: 2024, month: 4 },
		{ year: 2024, month: 5 },
		{ year: 2024, month: 6 },
		{ year: 2024, month: 7 },
		{ year: 2024, month: 8 },
		{ year: 2024, month: 9 },
		{ year: 2024, month: 10 }
	];

	// .....................................................> END PROPS

	// =================================================================
	// V A R I A B L E S
	// =================================================================
	// Za prikazivanje poruke o grešci
	let showError = false;
	let errorSubtitle = '#MVP DatePicker';

	let prevDate = null;

	let customSettings = null;
	let disabledDates = [];
	let selectedDates = [];
	let usageScheduleDates = null;
	let monthCalendarFunctions = null;

	let tempYear = 2023;
	let tempMonth = 11;
	let tempDisabledDates = null;
	let tempDisabledDates1 = ['2023-11-01', '2023-11-05', '2023-11-10'];
	let tempDisabledDates2 = ['2023-11-20', '2023-11-25', '2023-11-27'];
	let tempSelectedDates = null;
	let tempSelectedDates1 = [
		'2023-11-01',
		'2023-11-12',
		'2023-11-13',
		'2024-01-15',
		'2024-01-12',
		'2023-02-28',
		'2024-03-25',
		'2024-04-02',
		'2024-05-01',
		'2024-06-30'
	];
	let tempSelectedDates2 = ['2023-11-01', '2023-11-02', '2023-11-03'];
	let tempShowWeekNr = true;

	// ..................................................> END VARIABLES

	// =================================================================
	// F U N C T I O N S
	// =================================================================

	// Ažurira niz selectedDates, koji služi za vizualizaciju selektovanih dana. Poziva se iz komponenti MVPCalendar.
	function updateSelectedDates(clickedDate, isShiftPressed) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana

		// Pomoćni taster Shift NIJE bio pritisnut, ILI, bio je pristisnut, ali ne postoji prethodno selektovani datum.
		// Napomena: prethodno selektovani datum postoji u slučaju ako je prethodni klik na datum rezultovao selektovanjem tog datuma, a NE deselektovanjem.
		if (isShiftPressed === false || (isShiftPressed === true && prevDate === null)) {
			const index = tempSelectedDates.indexOf(clickedDate); // Da li se clickedDate nalazi u nizu?

			// Ako se nalazi u nizu, treba ga otkloniti
			if (index !== -1) {
				prevDate = null; // Prethodno selektovani datum ne treba da postoji (koristi se za selektovanje range-a pomoću Shift-a)
				tempSelectedDates.splice(index, 1); // Uklanja clickedDate iz niza
			}
			// Ako se NE nalazi u nizu, treba da dodati
			else {
				prevDate = clickedDate; // Prethodni datum postaje clickedDate
				tempSelectedDates.push(clickedDate); // Dodaje se u privremeni niz
			}
			tempSelectedDates.sort(); // Sortiraj privremeni niz
			selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" dva puta ažuriranje komponenti MVPCalendar, već samo jednom.
		}

		// Pomoćni taster Shift JESTE bio pritisnut i prethodno selektovani datum postoji
		else if (isShiftPressed === true && prevDate !== null) {
			let startDate = null;
			let endDate = null;

			// clickedDate i prevDate su uporedivi iako nisu datumski objeki, iz razloga što su zapisani u formatu YYYY-MM-DD, dakle, koristi se vodeća nula
			if (clickedDate < prevDate) {
				startDate = new Date(clickedDate + 'T12:00:00.000Z'); // Vršimo konkatenaciju clickedDate stringa sa stringom 'T12:00:00.000Z' da bismo dobili datum nezavistan od vremenske zone
				endDate = new Date(prevDate + 'T12:00:00.000Z');
			} else {
				startDate = new Date(prevDate + 'T12:00:00.000Z');
				endDate = new Date(clickedDate + 'T12:00:00.000Z');
			}

			// Pristupi svakom danu u opsegu startDate-endDate
			while (startDate.toISOString() <= endDate.toISOString()) {
				const ymdDate = startDate.toISOString().split('T')[0]; // Pretvaramo ispitivani datum u format YYYY-MM-DD

				const isAlreadySelected = tempSelectedDates.includes(ymdDate); // Da li se proveravani datum nalazi u tempSelectedDates
				const isDisabled = disabledDates.includes(ymdDate); // Da li je proveravani datum disable-ovan

				// Ako ispitivani dan nije selektovan i ako nije disable-ovan...
				if (!isAlreadySelected && !isDisabled) {
					tempSelectedDates.push(ymdDate); // ...dodaj ga u privremni niz selektovanih dana
				}
				startDate.setDate(startDate.getDate() + 1); // Povećaj ispitivani dan za 1
			}

			tempSelectedDates.sort(); // Sortiraj privremeni niz
			selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
			prevDate = clickedDate; // Dan na koji se kliknulo držeći pomoćni taster Shift, postaje prethodno izabrani dan.
		}
	}

	// Selektuje sve dane u mesecu (izuzev disable-ovanih)
	function selecteAllDaysInMonth(year, month) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana
		let startDate = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0, 0));
		const endDate = new Date(Date.UTC(year, month, 0, 12, 0, 0, 0));

		// Pristupi svakom danu aktuelnog meseca
		while (startDate.toISOString() <= endDate.toISOString()) {
			const isAlreadySelected = tempSelectedDates.includes(startDate.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u nizu selektovanih dana?
			const isDisabled = disabledDates.includes(startDate.toISOString().split('T')[0]); // Da li je ispitivani dan disable-ovan?
			// Ako nije disable-ovan i ako nije selektovan...
			if (!isDisabled && !isAlreadySelected) {
				tempSelectedDates.push(startDate.toISOString().split('T')[0]); // ...dodaj ga u privremeni niz selektovanih dana.
			}

			startDate.setDate(startDate.getDate() + 1); // Pređi na sledeći dan.
		}
		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Pošto se odjednom selektovao celi mesec, ne postoji prethodno selektovan datum.
	}

	// Deselektuje sve dane u mesecu (izuzev disable-ovanih)
	function deselectAllDaysInMont(year, month) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana
		let startDate = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0, 0));
		const endDate = new Date(Date.UTC(year, month, 0, 12, 0, 0, 0));

		// Pristupi svakom danu aktuelnog meseca
		while (startDate.toISOString() <= endDate.toISOString()) {
			const index = tempSelectedDates.indexOf(startDate.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u privremenom nizu selektovanih dana? Ako je index -1, ne nalazi se.
			// Ako ispitivani dan nije disable-ovan...
			if (disabledDates.includes(startDate.toISOString().split('T')[0]) === false) {
				// ...i ako se nalazi u privremenom nizu selektovanih dana...
				if (index !== -1) {
					tempSelectedDates.splice(index, 1); // ...treba ga ukloniti iz privremenog niza selektovanih dana.
				}
			}
			startDate.setDate(startDate.getDate() + 1); // Pređi na sledeći dan.
		}
		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Pošto je odjednom deselektovan celi mesec, ne postoji prethodno selektovan datum. Generalno, kada se vrši deselektovanje, prethodno selektovani dan ne postoji.
	}

	// Selektuje neselektovane dane, deselektuje NEselektovane dane u mesecu.
	// Disable-ovani dani se NE diraju.
	function selectedInverseInMonth(year, month) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana
		let startDate = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0, 0));
		const endDate = new Date(Date.UTC(year, month, 0, 12, 0, 0, 0));

		while (startDate.toISOString() <= endDate.toISOString()) {
			const index = tempSelectedDates.indexOf(startDate.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u privremenom nizu selektovanih dana? Ako je index -1, ne nalazi se.

			// Ako ispitivani dan nije disable-ovan...
			if (disabledDates.includes(startDate.toISOString().split('T')[0]) === false) {
				// ...i ako se NE nalazi u privremenom nizu selektovanih dana...
				if (index === -1) {
					tempSelectedDates.push(startDate.toISOString().split('T')[0]); // ...dodaje se u privremeni niz selektovanih dana,
				}
				// ...inače, ako se ispitivani dan nalazi u privremenom nizu selektovanih dana...
				else {
					tempSelectedDates.splice(index, 1); // ...potrebno je ukloniti ga iz niza.
				}
			}

			startDate.setDate(startDate.getDate() + 1); // Pređi na sledeći dan.
		}
		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Pošto je odjednom inverzno de/selektovan celi mesec, ne postoji prethodno selektovan datum.
	}

	function selectAllDaysByNames(year, month, dayIndex, isForSelect) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana
		let startDate = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0, 0));
		const endDate = new Date(Date.UTC(year, month, 0, 12, 0, 0, 0));

		while (startDate.toISOString() <= endDate.toISOString()) {
			const index = tempSelectedDates.indexOf(startDate.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u privremenom nizu selektovanih dana? Ako je index -1, ne nalazi se.

			// Ako ispitivani dan nije disable-ovan...
			if (disabledDates.includes(startDate.toISOString().split('T')[0]) === false) {
				// ...i ako se NE nalazi u privremenom nizu selektovanih dana i odabrano je SELEKTOVANJE...
				if (index === -1 && isForSelect === true) {
					// ...i ako je dan pod prosledjenim indeksom...
					if (startDate.getDay() === dayIndex) {
						tempSelectedDates.push(startDate.toISOString().split('T')[0]); // ...dodaje se u privremeni niz selektovanih dana,
					}
				}
				// ...inače, ako se ispitivani dan nalazi u privremenom nizu selektovanih dana i odabrano je DESELEKTOVANJE...
				else if (isForSelect === false) {
					tempSelectedDates.splice(index, 1); // ...potrebno je ukloniti ga iz niza.
				}
			}

			startDate.setDate(startDate.getDate() + 1); // Pređi na sledeći dan.
		}
		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Ne postoji prethodno selektovan datum.
	}

	function selectAllFirstDaysByNames(year, month, dayIndex, isForSelect) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana
		let startDate = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0, 0));
		const endDate = new Date(Date.UTC(year, month, 0, 12, 0, 0, 0));
		while (startDate.toISOString() <= endDate.toISOString()) {
			const index = tempSelectedDates.indexOf(startDate.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u privremenom nizu selektovanih dana? Ako je index -1, ne nalazi se.

			// Ako ispitivani dan nije disable-ovan i prvi je takav dan u mesecu...
			if (
				disabledDates.includes(startDate.toISOString().split('T')[0]) === false &&
				startDate.getDate() <= 7
			) {
				// ...i ako se NE nalazi u privremenom nizu selektovanih dana i odabrano je SELEKTOVANJE...
				if (index === -1 && isForSelect === true) {
					// ...i ako je dan pod prosledjenim indeksom...
					if (startDate.getDay() === dayIndex) {
						tempSelectedDates.push(startDate.toISOString().split('T')[0]); // ...dodaje se u privremeni niz selektovanih dana,
					}
				}
				// ...inače, ako se ispitivani dan nalazi u privremenom nizu selektovanih dana i odabrano je DESELEKTOVANJE...
				else if (isForSelect === false) {
					tempSelectedDates.splice(index, 1); // ...potrebno je ukloniti ga iz niza.
				}
			}

			startDate.setDate(startDate.getDate() + 1); // Pređi na sledeći dan.
		}
		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Ne postoji prethodno selektovan datum.
	}

	function selectAllLastDaysByNames(year, month, dayIndex, isForSelect) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana

		// Start with the last day of the month
		const lastDayOfMonth = new Date(Date.UTC(year, month, 0, 12, 0, 0, 0));

		// Find the day of the week of the last day of the month
		const lastDayOfWeek = lastDayOfMonth.getDay();

		// Calculate the difference in days to the desired day index
		const daysToSubtract = (lastDayOfWeek - dayIndex + 7) % 7;

		// Subtract the difference to find the last day with the desired day index
		lastDayOfMonth.setDate(lastDayOfMonth.getDate() - daysToSubtract);

		const index = tempSelectedDates.indexOf(lastDayOfMonth.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u privremenom nizu selektovanih dana? Ako je index -1, ne nalazi se.

		// Ako ispitivani dan nije disable-ovan...
		if (disabledDates.includes(lastDayOfMonth.toISOString().split('T')[0]) === false) {
			// ...i ako se NE nalazi u privremenom nizu selektovanih dana i odabrano je SELEKTOVANJE...
			if (index === -1 && isForSelect === true) {
				tempSelectedDates.push(lastDayOfMonth.toISOString().split('T')[0]); // ...dodaje se u privremeni niz selektovanih dana,
			}
			// ...inače, ako se ispitivani dan nalazi u privremenom nizu selektovanih dana i odabrano je DESELEKTOVANJE...
			else if (isForSelect === false) {
				tempSelectedDates.splice(index, 1); // ...potrebno je ukloniti ga iz niza.
			}
		}

		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Ne postoji prethodno selektovan datum.
	}

	function selectAllDaysOfWeek(year, weekNrFrom, weekNrTo, isForSelect) {
		let dayOfWeekToStart = 1; // Simuliranje ponedeljka, tj. indexa prvog dana u nedelji
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana

		let startDate = new Date(Date.UTC(year, 0, 1, 12, 0, 0, 0)); // January 1st of the specified year
		// const daysToAddStart = (weekNrFrom - 1) * 7; // Calculate the number of days to add
		// const daysToAddStart = (weekNrFrom - 1) * 7 + ((dayOfWeekToStart - startDate.getDay() + 7) % 7); // Calculate the number of days to add
		const daysToAddStart = (weekNrFrom - 1) * 7 + dayOfWeekToStart;
		startDate.setDate(startDate.getDate() + daysToAddStart - startDate.getDay()); // Add the days to the date and Find the first day of the week for the specified year

		let endDate = new Date(Date.UTC(year, 0, 1, 12, 0, 0, 0)); // January 1st of the specified year
		const daysToAddEnd = (weekNrTo - 1) * 7; // Calculate the number of days to add
		endDate.setDate(endDate.getDate() + daysToAddEnd); // Add the days to the date
		// Calculate the number of days to add to reach the last day of the week
		const daysToLastDayOfWeek = 6 - endDate.getDay() + dayOfWeekToStart;
		// Find the first day of the week for the specified year
		endDate.setDate(endDate.getDate() + daysToLastDayOfWeek);

		while (startDate.toISOString() <= endDate.toISOString()) {
			const index = tempSelectedDates.indexOf(startDate.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u privremenom nizu selektovanih dana? Ako je index -1, ne nalazi se.

			// Ako ispitivani dan nije disable-ovan...
			if (disabledDates.includes(startDate.toISOString().split('T')[0]) === false) {
				// ...i ako se NE nalazi u privremenom nizu selektovanih dana i odabrano je SELEKTOVANJE...
				if (index === -1 && isForSelect === true) {
					tempSelectedDates.push(startDate.toISOString().split('T')[0]); // ...dodaje se u privremeni niz selektovanih dana,
				}
				// ...inače, ako se ispitivani dan nalazi u privremenom nizu selektovanih dana i odabrano je DESELEKTOVANJE...
				else if (isForSelect === false) {
					tempSelectedDates.splice(index, 1); // ...potrebno je ukloniti ga iz niza.
				}
			}

			startDate.setDate(startDate.getDate() + 1); // Pređi na sledeći dan.
		}
		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Ne postoji prethodno selektovan datum.
	}

	function selectAllDaysToMonthEnd(year, month, dateFrom, isForSelect) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana
		let startDate = new Date(Date.UTC(year, month - 1, dateFrom, 12, 0, 0, 0));
		const endDate = new Date(Date.UTC(year, month, 0, 12, 0, 0, 0));
		while (startDate.toISOString() <= endDate.toISOString()) {
			const index = tempSelectedDates.indexOf(startDate.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u privremenom nizu selektovanih dana? Ako je index -1, ne nalazi se.

			// Ako ispitivani dan nije disable-ovan...
			if (disabledDates.includes(startDate.toISOString().split('T')[0]) === false) {
				// ...i ako se NE nalazi u privremenom nizu selektovanih dana i odabrano je SELEKTOVANJE...
				if (index === -1 && isForSelect === true) {
					tempSelectedDates.push(startDate.toISOString().split('T')[0]); // ...dodaje se u privremeni niz selektovanih dana,
				}
				// ...inače, ako se ispitivani dan nalazi u privremenom nizu selektovanih dana i odabrano je DESELEKTOVANJE...
				else if (isForSelect === false) {
					tempSelectedDates.splice(index, 1); // ...potrebno je ukloniti ga iz niza.
				}
			}

			startDate.setDate(startDate.getDate() + 1); // Pređi na sledeći dan.
		}
		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Ne postoji prethodno selektovan datum.
	}

	function selectIntervalInMonth(year, month, dateFrom, dateTo, isForSelect) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana
		let startDate = new Date(Date.UTC(year, month - 1, dateFrom, 12, 0, 0, 0));
		const endDate = new Date(Date.UTC(year, month - 1, dateTo, 12, 0, 0, 0));
		while (startDate.toISOString() <= endDate.toISOString()) {
			const index = tempSelectedDates.indexOf(startDate.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u privremenom nizu selektovanih dana? Ako je index -1, ne nalazi se.

			// Ako ispitivani dan nije disable-ovan...
			if (disabledDates.includes(startDate.toISOString().split('T')[0]) === false) {
				// ...i ako se NE nalazi u privremenom nizu selektovanih dana i odabrano je SELEKTOVANJE...
				if (index === -1 && isForSelect === true) {
					tempSelectedDates.push(startDate.toISOString().split('T')[0]); // ...dodaje se u privremeni niz selektovanih dana,
				}
				// ...inače, ako se ispitivani dan nalazi u privremenom nizu selektovanih dana i odabrano je DESELEKTOVANJE...
				else if (isForSelect === false) {
					tempSelectedDates.splice(index, 1); // ...potrebno je ukloniti ga iz niza.
				}
			}

			startDate.setDate(startDate.getDate() + 1); // Pređi na sledeći dan.
		}
		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Ne postoji prethodno selektovan datum.
	}

	function selectAllDays(isForSelect) {
		let tempSelectedDates = [...selectedDates]; // Privremena kopija aktuelnih selektovanih dana
		let startDate = new Date(Date.UTC(2023, 10, 1, 12, 0, 0, 0));
		const endDate = new Date(Date.UTC(2024, 9, 31, 12, 0, 0, 0));
		while (startDate.toISOString() <= endDate.toISOString()) {
			const index = tempSelectedDates.indexOf(startDate.toISOString().split('T')[0]); // Da li se ispitivani dan nalazi u privremenom nizu selektovanih dana? Ako je index -1, ne nalazi se.

			// Ako ispitivani dan nije disable-ovan...
			if (disabledDates.includes(startDate.toISOString().split('T')[0]) === false) {
				// ...i ako se NE nalazi u privremenom nizu selektovanih dana i odabrano je SELEKTOVANJE...
				if (index === -1 && isForSelect === true) {
					tempSelectedDates.push(startDate.toISOString().split('T')[0]); // ...dodaje se u privremeni niz selektovanih dana,
				}
				// ...inače, ako se ispitivani dan nalazi u privremenom nizu selektovanih dana i odabrano je DESELEKTOVANJE...
				else if (isForSelect === false) {
					tempSelectedDates.splice(index, 1); // ...potrebno je ukloniti ga iz niza.
				}
			}

			startDate.setDate(startDate.getDate() + 1); // Pređi na sledeći dan.
		}
		tempSelectedDates.sort(); // Sortiraj privremeni niz selektovanih dana
		selectedDates = [...tempSelectedDates]; // Privremeni niz predaje svoje vrednosti "pravom" nizu. Ovo je potrebno, da dodavanje i sortiranje ne bi "okinuli" više puta ažuriranje komponenti MVPCalendar, već samo jednom.
		prevDate = null; // Ne postoji prethodno selektovan datum.
	}

	// ..................................................> END FUNCTIONS

	// =================================================================
	// L I F E  C Y C L E
	// =================================================================

	onMount(async () => {
		monthCalendarFunctions = {};
		monthCalendarFunctions.selectedInverseInMonth = selectedInverseInMonth;
		monthCalendarFunctions.selecteAllDaysInMonth = selecteAllDaysInMonth;
		monthCalendarFunctions.deselectAllDaysInMont = deselectAllDaysInMont;
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
	// --

	// .........................................> END REACTIVE STATEMENS
</script>

<div id="Temp">
	<!-- {prevDate} -->
	<div id="Kalendari">
		{#each calendarMonths as calItem}
			<MVPCalendar
				year={calItem.year}
				month={calItem.month}
				customSettings={{ weekStartsOnMonday: true, showWeekNr: tempShowWeekNr }}
				disabledDates={tempDisabledDates}
				{selectedDates}
				{updateSelectedDates}
				{monthCalendarFunctions}
			/>
		{/each}
	</div>

	<div>
		<Button
			on:click={() => {
				selectAllDaysByNames(2023, 11, 1, true);
			}}>Selektuj sve ponedeljke</Button
		>
		<Button
			on:click={() => {
				selectAllDaysByNames(2023, 11, 1, false);
			}}>Deselektuj sve ponedeljke</Button
		>
		<Button
			on:click={() => {
				selectAllFirstDaysByNames(2023, 11, 1, true);
			}}>Selektuj sve prve ponedeljke</Button
		>
		<Button
			on:click={() => {
				selectAllFirstDaysByNames(2023, 11, 1, false);
			}}>Deselektuj sve prve ponedeljke</Button
		>
		<Button
			on:click={() => {
				selectAllLastDaysByNames(2023, 11, 1, true);
			}}>Selektuj poslednji ponedeljak</Button
		>
		<Button
			on:click={() => {
				selectAllLastDaysByNames(2023, 11, 1, false);
			}}>Deselektuj poslednji ponedeljak</Button
		>
		<Button
			on:click={() => {
				selectAllDaysOfWeek(2023, 45, 47, true);
			}}>Selektuj opseg radnog broja nedelja</Button
		>
		<Button
			on:click={() => {
				selectAllDaysOfWeek(2023, 45, 47, false);
			}}>Deselektuj opseg radnog broja nedelja</Button
		>
		<Button
			on:click={() => {
				selectAllDaysToMonthEnd(2023, 12, 10, true);
			}}>Selektuj sve dane u mesecu od konkretnog dana</Button
		>
		<Button
			on:click={() => {
				selectAllDaysToMonthEnd(2023, 12, 10, false);
			}}>Deselektuj sve dane u mesecu od konkretnog dana</Button
		>
		<Button
			on:click={() => {
				selectIntervalInMonth(2023, 12, 10, 20, true);
			}}>Selektuj sve dane u mesecu u odredjenom opsegu</Button
		>
		<Button
			on:click={() => {
				selectIntervalInMonth(2023, 12, 10, 20, false);
			}}>Deselektuj sve dane u mesecu u odredjenom opsegu</Button
		>
		<Button
			on:click={() => {
				selectAllDays(true);
			}}>Selektuj sve dane</Button
		>
		<Button
			on:click={() => {
				selectAllDays(false);
			}}>Deselektuj sve dane</Button
		>
		<!-- <Button
			on:click={() => {
				tempShowWeekNr = !tempShowWeekNr;
			}}>Redni broj nedelja</Button
		>
		<Button
			on:click={() => {
				if (tempMonth < 12) {
					tempMonth = tempMonth + 1;
				} else {
					tempMonth = 1;
				}
			}}>Povećaj mesec</Button
		>
		<Button
			on:click={() => {
				if (tempMonth > 1) {
					tempMonth = tempMonth - 1;
				} else {
					tempMonth = 12;
				}
			}}>Smanji mesec</Button
		>
		<Button
			on:click={() => {
				tempYear++;
			}}>Povećaj godinu</Button
		>
		<Button
			on:click={() => {
				tempYear--;
			}}>Smanji godinu</Button
		>
		<Button
			on:click={() => {
				tempDisabledDates = [...tempDisabledDates1];
			}}>Disabled1</Button
		>
		<Button
			on:click={() => {
				tempDisabledDates = [...tempDisabledDates2];
			}}>Disabled2</Button
		>
		<Button
			on:click={() => {
				tempDisabledDates = null;
			}}>Disabled nema</Button
		>

		<Button
			on:click={() => {
				selectedDates = [...tempSelectedDates1];
			}}>Selected dates 1</Button
		>
		<Button
			on:click={() => {
				selectedDates = [...tempSelectedDates2];
			}}>Selected dates 2</Button
		>
		<Button
			on:click={() => {
				selectedDates = [];
			}}>Nema selektovanih</Button
		> -->
	</div>
</div>

<!-- 
*************************************************************************************************************
***                                                                                                       ***
***                                                 C S S                                                 ***
***                                                                                                       ***
************************************************************************************************************* 
-->

<style>
	#Temp {
		display: flex;
		align-items: flex-start;
		margin: 20px;
	}

	#Temp > div:last-of-type {
		width: 400px;
		margin-left: 30px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	#Kalendari {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
