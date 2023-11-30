<script>
	// =================================================================
	// S E R V E R . J S
	// =================================================================
	// --
	// ..................................................> END SERVER.JS

	// =================================================================
	// I M P O R T
	// =================================================================

	// Svelte components
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';

	// Axios
	import axios from 'axios';

	// Tabulator components
	import { TabulatorFull as Tabulator } from 'tabulator-tables';

	// Carbon components
	import { Button, Select } from 'carbon-components-svelte';
	import { Modal } from 'carbon-components-svelte';

	// Carbon icons
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import Search from 'carbon-icons-svelte/lib/Search.svelte';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
	import Events from 'carbon-icons-svelte/lib/Events.svelte';
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';

	// Dictionary and other stores
	import { Dict } from '../../stores/dictionary/dictionary.js';
	import { WaitingLoadingGlobalVisible } from '../../stores/general/general.js';

	// Our components
	import ErrorMsg from '../general/ErrorMsg.svelte';
	import SumRedistribution from '../sumRedistribution/SumRedistribution.svelte';


	// Our functions
	import { tableDataFromVesko } from './data.js';
	import { editableCells } from './data.js';
	import { prevent_default } from 'svelte/internal';
	import ColumnFilter from './ColumnFilter.svelte';

	// Our styles
	// --

	// Our images
	// --

	// .....................................................> END IMPORT

	// =================================================================
	// C O N T E X T
	// =================================================================
	// --
	// ....................................................> END CONTEXT

	// =================================================================
	// P R O P S
	// =================================================================
	export let tableInfo = null;
	export let salesPersonInfo = null;
	export let masterFc = null;
	export let planningScope = null;
	export let planInfo = null;
	export let refreshTable = null;
	// .....................................................> END PROPS

	// =================================================================
	// V A R I A B L E S
	// =================================================================

	// Za prikazivanje poruke o grešci
	let showError = false;
	let errorSubtitle = '#PlanTable.svelte';

	

	let tblCntr = null; // Referenca na div u kojem se prikazuje tabela
	let table = null; // Sadrži Tabulator objekat

	let editableColumnFieldNames = []; // Za smeštaj naziva field-ova editabilnih tabela
	// Za prikazivanje/sakrivanje filter bar-a
	let filterBarInfo = {
		filterOnHeight: 0,
		filterOffHeight: 0,
		visible: true
	};

	// Formatiranje novčanih iznosa u tabeli, detaljnije na https://tabulator.info/docs/5.5/format#formatter-money
	let moneyFormatterParams = {
		decimal: ',',
		thousand: '.',
		precision: 2
		//symbol: '£',
		//symbolAfter: 'p',
		//negativeSign: true,
		//precision: false,
	};

	// RAJKO
	let showSumRedistributionModal = false;
	let sumRedistributionSettings = {
		period: 'May / 2023',
		distributionMode: 'lastYearPlan',
		newValueAllowed: true,
		value: 15210
	};
	var editedCell; // Referenca na ćeliju koja se edituje
	var inputElem; // Referenca na <Input> element, koji se dinamički generiše

	let columnDefArray = [
		{
			field: 'plan-2022-1',
			planOrExecution: 'plan',
			currentOrPrevious: 'previous',
			columnTitle: 'Januar 2023'
		}
	];

	let tableColumns = [];
	let tableColumnsOld = [
		{
			title: 'Proizvod',
			field: 'productName',
			width: 160,
			frozen: true,
			headerSortTristate: true,
			headerHozAlign: 'left',
			//headerFilter: 'input',
			clipboard: 'copy'
		},

		{
			title: 'Ukupno',
			// frozen: true,
			headerHozAlign: 'center',
			columns: [
				{
					title: '🡠 ⚐',
					field: 'plan-2022-total',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy'
				},
				{
					title: '🡠 ✓',
					field: 'real-2022-total',
					headerHozAlign: 'center',
					headerSort: false,
					clipboard: 'copy'
				},
				{
					title: '⚐',
					field: 'plan-2023-total',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy'
				},
				{
					title: '✓',
					field: 'real-2023-total',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy'
				}
			]
		},
		{
			title: 'Januar 2023',
			headerHozAlign: 'center',
			columns: [
				{
					title: '🡠 ⚐',
					field: 'plan-2022-1',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '🡠 ✓',
					field: 'real-2022-1',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '⚐',
					field: 'plan-2023-1',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					editor: 'input',
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '✓',
					field: 'real-2023-1',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				}
			]
		},
		{
			title: 'Februar 2023',
			headerHozAlign: 'center',
			columns: [
				{
					title: '🡠 ✓',
					field: 'plan-2022-2',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '🡠 ⚐',
					field: 'real-2022-2',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '⚐',
					field: 'plan-2023-2',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '✓',
					field: 'real-2023-2',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				}
			]
		},
		{
			title: 'Mart 2023',
			headerHozAlign: 'center',
			columns: [
				{
					title: '🡠 ⚐',
					field: 'plan-2022-2',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '🡠 ✓',
					field: 'real-2022-2',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '⚐',
					field: 'plan-2023-2',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '✓',
					field: 'real-2023-2',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				}
			]
		},
		{
			title: 'April 2023',
			headerHozAlign: 'center',
			columns: [
				{
					title: '🡠 ✓',
					field: 'plan-2022-4',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '🡠 ⚐',
					field: 'real-2022-4',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '⚐',
					field: 'plan-2023-4',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '✓',
					field: 'real-2023-4',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				}
			]
		},
		{
			title: 'Maj 2023',
			headerHozAlign: 'center',
			columns: [
				{
					title: '🡠 ⚐',
					field: 'plan-2022-5',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '🡠 ✓',
					field: 'real-2022-5',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '⚐',
					field: 'plan-2023-5',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				},
				{
					title: '✓',
					field: 'real-2023-5',
					headerHozAlign: 'center',
					hozAlign: 'right',
					formatter: 'money',
					formatterParams: moneyFormatterParams,
					editorParams: moneyFormatterParams,
					headerSort: false,
					clipboard: 'copy',
					editor: numEditor
				}
			]
		}
	];

	let tableData = null;

	// ..................................................> END VARIABLES

	// =================================================================
	// F U N C T I O N S
	// =================================================================

	// Vraća niz objekata koji sadrže referencu ka roditeljskim kolonama i indikaciju njihove vidljivosti (postavljenu na true)
	function extractMainColumns() {
		let parentColumns = new Set();
		let columns = table.getColumns(); // Sve kolone
		for (const column of columns) {
			// Pristupi svim kolonama
			if (column.getParentColumn()) {
				// Ako kolona ima roditelja...
				parentColumns.add(column.getParentColumn()); //...roditeljsku kolonu smesti u set.
			}
		}

		let parentColumnsInfo = []; // Potreban je niz objekata, gde će svaki objekat sadržati roditeljsku kolonu i indikaciju njene vidljivosti (postavljenju na true)
		for (const pc of parentColumns) {
			let object = {};
			object.parentColumn = pc;
			object.title = pc.getDefinition().title;
			object.visible = true;
			parentColumnsInfo.push(object);
		}
		return parentColumnsInfo; // Povratna vrednost se smešta u tableInfo nakon build-ovanja tabele
	}

	// Funkcija se poziva iz komponente ColumnFilter.svelte
	// argMainColumn je Tabulator objekat column, a visible je svojstvo objekta koji objekta predstavlja element niza tableInfo.mainColumns.
	// Taj niz se generiše u funkciji extractMainColumns(), a funkcija se poziva na onBuild Tabulator tabele.
	// Objekat sadrži objekat column (periodi januar, februar,...), naslov kolone i indikator vidljiviosti.
	// Zašto ovakvo rešenje: da bi se postigla veća brzina. Bilo bi moguće i samo "protrčari" kroz elemente niza tableInfo.mainColumns.
	function handleMainColumnVisibility(argMainColumn, visible) {
		if (visible === true && argMainColumn.isVisible() === false) {
			argMainColumn.show();
			handlePartialMainColumnsSubColumnsVisibility(argMainColumn);
		}

		if (visible === false && argMainColumn.isVisible() === true) {
			argMainColumn.hide();
		}
	}

	// Ova funkcija je neophodna u sledećem slučaju: sakrijemo, na primer, prvu glavnu kolonu u komponenti ColumnFilter.svelte. Potom, sakrijemo prvu podkolonu.
	// Ako potom ponovo prikažemo prvu glavnu kolonu, biće vidljive sve njegove podkolone. Zato, potrebno je sakriti one njene podkolone, čiji indikatori vidljivosti
	// su u okviru tableInfo.subColumnsInfo postavljeni na false.
	function handlePartialMainColumnsSubColumnsVisibility(mainColumn) {
		let subColumns = mainColumn.getSubColumns();
		for (let i = 0; i < subColumns.length; i++) {
			if (tableInfo.subColumnsInfo[i].visible) {
				subColumns[i].show();
			} else {
				subColumns[i].hide();
			}
		}
	}

	// Funkcija se poziva iz komponente ColumnFilter.svelte.
	// Desc je sadržaj labele check box-a, koji sadržaj se generiše koristeći vrednosti svojstva tableInfo.subColumnsInfo.desc.
	// Zato je možemo koristiti u metodi findIndex() forEach-u kojim se check box-evi generišu u komponenti ColumnFilter.svelte.
	// visible je indikator vidljivosti na koju podkolonu treba postaviti.
	async function handleSubColumnsVisibility(desc, visible) {
		
		

		// Na osnovu desc nađi indeks podkolone koju treba prikazati/sakriti. Postoje 4 podkolone u okviru svake glavne kolone.
		// U opisu funkcije je objašnjeno zašto argument desc može da bude upotrebljen za nalaženje indeksa podkolone.
		let index = tableInfo.subColumnsInfo.findIndex(function (element) {
			return element.desc === desc;
		});

		//let subColumns = []; // U ovaj niz ćemo smestiti objekte podkolona
		// Pristupi svakoj glavnoj koloni...
		for (const mainColumnInfo of tableInfo.mainColumns) {
			if (mainColumnInfo.visible) {
				let subColumns = mainColumnInfo.parentColumn.getSubColumns(); // ...i smesti podkolone predmetne glavne kolone u niz subColumns.
				if (visible) {
					// U zavisnosti od vrednosti argumenta visible, kolonu sa indeksom index...
					subColumns[index].show(); // ...prikaži ili
				} else {
					subColumns[index].hide(); // ...sakrij
				}
			}
		}

		// Nađi indeks poslednje vidljive kolone...
		let lastIndex = -1; // Vrednost -1 će biti indikator da se NE ažurira CSS stil u zaglavlju stranice, na dnu funkcije.

		for (var i = tableInfo.subColumnsInfo.length - 1; i >= 0; i--) {
			if (tableInfo.subColumnsInfo[i].visible === true) {
				lastIndex = i;
				break; // Prekidamo petlju kada pronađemo prvi vidljivi element unazad
			}
		}

		// Treba da ažuriramo CSS stil zapisan u zaglavlju stranice. Naredni switch generiše CSS izraz.

		let cssString = '';
		switch (lastIndex) {
			case 0:
				cssString = '#PlanTable .tabulator-row .tabulator-cell:nth-of-type(4n + 2) {border-right: 1px solid var(--gray-6) !important;}';
				break;
			case 1:
				cssString = '#PlanTable .tabulator-row .tabulator-cell:nth-of-type(4n + 3) {border-right: 1px solid var(--gray-6) !important;}';
				break;
			case 2:
				cssString = '#PlanTable .tabulator-row .tabulator-cell:nth-of-type(4n) {border-right: 1px solid var(--gray-6) !important;}';
				break;
			case 3:
				cssString = '#PlanTable .tabulator-row .tabulator-cell:nth-of-type(4n + 5) {border-right: 1px solid var(--gray-6) !important;}';
				break;
		}

		// Ako je indeks poslednje kolone nađen, ažuriran CSS stil zapisan u zaglavlju stranice
		if (lastIndex !== -1) {
			document.getElementById('TableLastVisibleColumn').innerHTML = cssString;
		}
		
	}

	//Otvara modalni prozor
	//var numEditor = function (cell, onRendered, success, cancel, editorParams) {
	function numEditor(cell, onRendered, success, cancel, editorParams) {
		let focusedCells = tblCntr.querySelectorAll('.FocusedCell');
		for (const fc of focusedCells) {
			fc.classList.remove('FocusedCell');
		}
		cell.getElement().classList.add('FocusedCell');
		let changed = false;
		editedCell = cell;
		if (editorParams.precision) {
			var text = parseFloat(cell.getValue()).toFixed(editorParams.precision);
		} else {
			var text = cell.getValue();
		}
		var editor = document.createElement('input');
		editor.style.width = '100%';
		// editor.style.boxSizing = 'border-box';
		editor.style.pointerEvents = 'none!important';
		editor.style.caretColor = 'transparent!important';
		editor.value = text.toString().replace('.', ',');
		onRendered(function () {
			editor.focus();
			editor.style.css = '100%';
			inputElem = document.querySelector('.tabulator-row .tabulator-editing input');
			inputElem.setAttribute('readonly', 'true');
			inputElem.style.css = editor.style.css;
		});

		function successFunc() {
			editor.value = editor.value.toString().replace(',', '.');
			editedCell.getRow().getElement().setAttribute('readonly', 'false');
			if (changed === true) {
				editedCell.setValue(editor.value);
			}
			success(editor.value);
			lockInputElem(cell);
		}

		editor.addEventListener('change', successFunc);
		editor.addEventListener('blur', successFunc);

		setupNavigationKeyListeners(); // Definiši event listenere za navigaciju. Primenjuje se na sve ćelije.

		if (isEditable(cell)) {
			// Ukoliko je reč o ćeliji čija vrednost sme da se menja, definiši odgovore na pritisak tastera za početak i kraj editovanja
			setupCellEditListeners();
		}

		// Funkcija se odnosi  samo na one kolone, u kojima je dozvoljeno menjati vrednosti ćelija
		function setupCellEditListeners() {
			// KeyUp
			editor.addEventListener('keyup', function (e) {
				let keyPressed = e.key;

				// Ako je reč o ćeliji koja se odnosi na proizvod (a ne na grupu)
				if (isLeaf(cell)) {
					// Ako je input zaključan
					if (inputElem.readOnly) {
						// Pritisnuta cifra, decimalni zarez ili negativan predznak:
						// Poništi prethodni sadržaj, i neka karakter koji je okinuo događaj postane sadržaj inputa
						if (/^\d$/.test(keyPressed) || keyPressed === ',' || keyPressed === '-') {
							unlockInputElem(cell);
							inputElem.value = '';
							inputElem.value = keyPressed;
						}

						// Pristinut je F2: edituj postojeću vrednost
						if (keyPressed === 'F2') {
							unlockInputElem(cell);
						}
					}
					//Ako je input otključan
					else {
						if (keyPressed === 'Escape') {
							lockInputElem(cell);
							cell.cancelEdit();
							cell.edit();
						}
					}
				} else {
					if (keyPressed === 'F2') {
						openSumRedistributionModal(cell);
					}
				}
			});

			// KeyDown
			editor.addEventListener('keydown', function (e) {
				if (!inputElem.readOnly) {
					let keyPressed = e.key;

					if (keyPressed === 'Enter') {
						editor.value = editor.value.toString().replace(',', '.');

						// Ćelija bez dece, leaf
						// if (editedCell.getRow().getTreeChildren().length === 0) {
						if (isLeaf(cell)) {
							if (!inputElem.readOnly) {
								lockInputElem(cell);
								cell.getElement().focus();
								//successFunc();
							}
						}
					}
				}
			});
		}

		function setupNavigationKeyListeners() {
			// Navigacija, odnosi si se na sve ćelije
			editor.addEventListener('keydown', function (e) {
				let keyPressed = e.key;
				// Navigacija je moguća samo sa onim ćelijama, koje nisu u edit modu, tj. koje su readOnly
				if (inputElem.readOnly) {
					// Bez pomoćnih tastera
					if (e.ctrlKey === false && e.shiftKey === false) {
						// Prvi red aktuelne kolone
						if (keyPressed === 'Home') {
							e.preventDefault();
							let column = cell.getColumn(); // Kolona u kojoj se ćelija nalazi
							let columnCells = column.getCells(); // Sve ćelije u koloni
							let firstRow = columnCells[0].getRow(); // Prvi red
							table.scrollToRow(firstRow); // Skroluj do prvog reda
							//columnCells[0].getElement().focus();
							columnCells[0].edit(); // Edituj ćeliju u prvom redu date kolone
						}

						// Poslednji red aktuelne kolone
						if (keyPressed === 'End') {
							e.preventDefault();
							let column = cell.getColumn(); // Kolona u kojoj se ćelija nalazi
							let columnCells = column.getCells(); // Sve ćelije u koloni
							let lastCell = columnCells[columnCells.length - 1]; // Poslednja ćelija u koloni
							let lastRow = lastCell.getRow(); // Poslednji red u koloni
							table.scrollToRow(lastRow, 'bottom', 'false'); // Skroluj do poslednjeg reda
							//lastCell.getElement().focus();
							lastCell.edit(); // Edituj ćeliju u poslednjem redu date kolone
						}

						if (keyPressed === 'ArrowRight') {
							// Right i Next je razlika sto sa next ide u novi red kada vise nema desno celija, a sa right ne ide vec ostaje na istoj celiji
							// table.navigateNext();
							e.preventDefault();
							table.navigateRight();
						}

						if (keyPressed === 'ArrowLeft') {
							// table.navigatePrev();
							e.preventDefault();
							table.navigateLeft();
						}

						if (keyPressed === 'PageUp') {
							e.preventDefault();
							let visibleRows = table.getRows('visible'); // Vidljivi redovi
							let firstVisibleRow = visibleRows[0]; // Prvi vidljiv red
							table.scrollToRow(firstVisibleRow, 'bottom', 'false'); // Neka prvi nakon posledjeg vidljivog postane prvi red
							let column = cell.getColumn(); // Kolona u kojoj se ćelija nalazi
							visibleRows = table.getRows('visible'); // Novi vidljivi redovi nakon skrolovanja
							firstVisibleRow = visibleRows[0]; // Prvi vidljiv red nakon skrolovanja
							let targetCell = firstVisibleRow.getCell(column); // Ćelija koja treba da bude selektovana
							targetCell.edit(); // Selektuj ćeliju
						}

						if (keyPressed === 'PageDown') {
							e.preventDefault();
							let visibleRows = table.getRows('visible'); // Vidljivi redovi
							let lastVisibleRow = visibleRows[visibleRows.length - 1]; // Poslednji vidljiv red
							table.scrollToRow(lastVisibleRow, 'top', 'false'); // Neka prvi nakon posledjeg vidljivog postane prvi red
							let column = cell.getColumn(); // Kolona u kojoj se ćelija nalazi
							let targetCell = lastVisibleRow.getCell(column); // Ćelija koja treba da bude selektovana
							targetCell.edit(); // Selektuj ćeliju
						}
					}

					// Samo CTRL
					else if (e.ctrlKey === true && e.shiftKey === false) {
						// Pozicioniraj se u prvu kolonu datog reda
						if (keyPressed === 'ArrowLeft') {
							e.preventDefault();
							let row = cell.getRow(); // Red u kojem se ćelija nalazi
							let rowCells = row.getCells(); // Sve ćelije u datum redu
							table.scrollToColumn(rowCells[0].getField(), 'right'); //Skroluj do prve kolone (naziv proizvoda) https://tabulator.info/docs/5.5/navigation#scroll-colum
							for (const rc of rowCells) {
								// Nađi prvu ćeliju koja nije zamrznuta (znači da nije naziv proizvoda)...
								if (!rc.getElement().classList.contains('tabulator-frozen')) {
									rc.edit(); // ...i postavi je u edit mode
									break;
								}
							}
						}

						// Pozinioniraj u poslednju kolonu datog reda
						if (keyPressed === 'ArrowRight') {
							e.preventDefault();
							let row = cell.getRow(); // Red u kojem se ćelija nalazi
							let rowCells = row.getCells(); // Sve ćelije u datom redu
							for (let i = rowCells.length - 1; i >= 0; i--) {
								// Nađi poslednju editabilnu ćeliju
								if (rowCells[i].getElement().classList.contains('tabulator-editable')) {
									let lastCell = rowCells[i]; // Poslednja editabilna ćelija
									table.scrollToColumn(lastCell.getField()); // Skroluj do kolone poslednje ćelije, https://tabulator.info/docs/5.5/navigation#scroll-column
									lastCell.edit(); // ...i postavi je u edit mode
									break;
								}
							}
						}

						// Prvi red, prva kolona
						if (keyPressed === 'Home') {
							e.preventDefault();

							// Prvi red
							let column = cell.getColumn(); // Kolona u kojoj se ćelija nalazi
							let columnCells = column.getCells(); // Sve ćelije u koloni
							let firstRow = columnCells[0].getRow(); // Prvi red
							table.scrollToRow(firstRow); // Skroluj do prvog reda

							// Prva kolona
							let rowCells = firstRow.getCells(); // Sve ćelije u prvom redu
							table.scrollToColumn(rowCells[0].getField(), 'right'); //Skroluj do prve kolone (naziv proizvoda) https://tabulator.info/docs/5.5/navigation#scroll-colum
							for (const rc of rowCells) {
								// Nađi prvu ćeliju koja nije zamrznuta (znači da nije naziv proizvoda)...
								if (!rc.getElement().classList.contains('tabulator-frozen')) {
									rc.edit(); // ...i postavi je u edit mode
									break;
								}
							}
						}

						// Poslednji red, poslednja kolona
						if (keyPressed === 'End') {
							e.preventDefault();

							// Poslednji red aktuelne kolone
							let column = cell.getColumn(); // Kolona u kojoj se ćelija nalazi
							let columnCells = column.getCells(); // Sve ćelije u koloni
							let lastCell = columnCells[columnCells.length - 1]; // Poslednja ćelija u koloni
							let lastRow = lastCell.getRow(); // Poslednji red u koloni
							table.scrollToRow(lastRow, 'bottom', 'false'); // Skroluj do poslednjeg reda

							let rowCells = lastRow.getCells(); // Sve ćelije u poslednjem redu
							for (let i = rowCells.length - 1; i >= 0; i--) {
								// Nađi poslednju editabilnu ćeliju
								if (rowCells[i].getElement().classList.contains('tabulator-editable')) {
									let lastCell = rowCells[i]; // Poslednja editabilna ćelija
									table.scrollToColumn(lastCell.getField()); // Skroluj do kolone poslednje ćelije, https://tabulator.info/docs/5.5/navigation#scroll-column
									lastCell.edit(); // ...i postavi je u edit mode
									break;
								}
							}
						}

						// Samo SHIFT
						// Biće implementirano naknadno, kada budemo rešavali Copy/Paste
						else if (e.ctrlKey === false && e.shiftKey === true) {
						}
					}
				}
			});
		}
		return editor;
	}

	// Ukida stanje editovanja ćelije
	function lockInputElem(cell) {
		inputElem.setAttribute('readonly', true);
		inputElem.style.caretColor = 'transparent';
		cell.getElement().classList.add('FocusedCell');
		cell.getElement().classList.remove('EditingCell');
	}

	// Dovodi ćeliju u stanje editovanja
	function unlockInputElem(cell) {
		inputElem.removeAttribute('readonly');
		inputElem.style.caretColor = 'black';
		cell.getElement().classList.add('EditingCell');
		cell.getElement().classList.remove('FocusedCell');
	}

	// Otvara modalni prozor za redistribucija sume
	function openSumRedistributionModal(cell) {
		sumRedistributionSettings.value = cell.getValue();
		sumRedistributionSettings.period = cell.getColumn().getDefinition().title;
		sumRedistributionSettings.groupName = cell.getData().productName;
		sumRedistributionSettings.cell = cell;
		lockInputElem(cell);
		showSumRedistributionModal = true;
	}

	// Vraća true ako je ćelija editabilna.
	// Ćelija je editabilna ako se naziv field-a kolone kojoj ćelija pripada nalazi u nizu editableCells.
	// Niz se generiše API-jem.
	function isEditable(cell) {
		return editableCells.includes(cell.getField());
	}

	// Proverava da li se ćelija odnosi na proizvod ili grupu. Vraća true u prvom slučaju.
	function isLeaf(cell) {
		return !cell.getData().hasOwnProperty('_children');
	}

	//RAJKO 07.10.2023. POKUSAJ PRAVLJENJA FUNKCIJE ZA PREPRAVKU JSONA ZA TABELU
	function transformJSON(originalData) {
		// values mi je json koji mi treba, tj. to mi je originalData
		const transformedData = [];

		for (const product of originalData) {
			let currentLevel = transformedData;

			//Rajko pocetak sortiranja
			let atributi = [{ prodAttrGrpName: 'Mesto ugradnje' }, { prodAttrGrpName: 'Rektifikacija' }];

			function customSortJSONObjects(arrToSort, sortingOrderArr, property) {
				const indexMap = {};

				sortingOrderArr.forEach((obj, index) => {
					indexMap[obj[property]] = index;
				});

				let prikaziSve = false;
				if (prikaziSve === true) {
					// Da se prikaze svo sortiranje i ako neko nije izabrano
					arrToSort.sort((a, b) => {
						const indexA =
							indexMap[a[property]] !== undefined ? indexMap[a[property]] : sortingOrderArr.length;
						const indexB =
							indexMap[b[property]] !== undefined ? indexMap[b[property]] : sortingOrderArr.length;

						return indexA - indexB;
					});
				} else {
					// Da se prikaze sortiranje samo odabranih stavki
					// Kreira se novi set, potom se filtrira i zatim se sortira
					const valuesInArr2 = new Set(sortingOrderArr.map((obj) => obj[property]));
					arrToSort = arrToSort.filter((obj) => valuesInArr2.has(obj[property]));
					arrToSort.sort((a, b) => indexMap[a[property]] - indexMap[b[property]]);
				}

				return arrToSort;
			}

			product.productAttributes = customSortJSONObjects(
				product.productAttributes,
				atributi,
				'prodAttrGrpName'
			);

			// Rajko kraj sortiranja

			//Object.entries(item)[0] - vraca property,value od prvog property-ja
			//Object.keys(item)[0] - vraca property od prvog property-ja
			//Object.values(item)[0] - vraca value od prvog property-ja

			const attrName = 'Klasa proizvoda';
			const attrValue = product.productClassName;

			let existingNode = currentLevel.find((node) => node[attrName] === attrValue);

			if (!existingNode) {
				existingNode = { [attrName]: attrValue, _children: [] };
				currentLevel.push(existingNode);
			}

			currentLevel = existingNode._children;

			for (const attr of product.productAttributes) {
				// const attrName = attr.prodAttrName;
				const attrName = attr.prodAttrGrpName;
				const attrValue = attr.prodAttrAbbrev;

				let existingNode = currentLevel.find((node) => node[attrName] === attrValue);

				if (!existingNode) {
					existingNode = { [attrName]: attrValue, _children: [] };
					currentLevel.push(existingNode);
				}

				currentLevel = existingNode._children;
			}

			currentLevel.push({
				productId: product.productId,
				productName: product.productName,
				productDesc: product.productDesc,
				productClassId: product.productClassId,
				productClassName: product.productClassName
			});

			// Sort the products at the lowest level by name (product name)
			currentLevel.sort((a, b) => a.productName.localeCompare(b.productName));
		}

		return transformedData;
	}

	// Rajko treba da prepravi funkciju
	function redistributeSum(cell) {
		console.log('Rajkova funkcija');
		console.log('settings', sumRedistributionSettings);
		var oldValue = cell.getOldValue(); // stara vrednost
		var newValue = cell.getValue(); // nova vrednost
		console.log(oldValue, newValue);
		var valueToAdd = newValue - oldValue;
		var row = cell.getRow();

		downToTop(row);
		function downToTop(rowRow) {
			if (rowRow.getTreeParent()) {
				var parentValue = parseFloat(rowRow.getTreeParent().getData().planProsle) + parseFloat(valueToAdd);
				rowRow.getTreeParent().update({ planProsle: parentValue }); // izmena vrednosti u celiji roditelja
				downToTop(rowRow.getTreeParent());
			}
		}

		topToDown(row);
		function topToDown(groupRow) {
			if (groupRow.getTreeChildren()) {
				var kvota = parseFloat(newValue) / parseFloat(oldValue);
				groupRow.getTreeChildren().forEach((element) => {
					let newNum = parseFloat(parseFloat(element.getData().planProsle) * kvota).toFixed(2);
					element.update({
						planProsle: newNum
					});
					topToDown(element);
				});
			}
		}
		cell.getElement().focus();
	}

	function savePlan() {
		alert('SNIMAM PLAN');
	}

	function downloadToXlsx() {
		table.download('xlsx', 'data.xlsx', { sheetName: 'Sheet1' });
	}

	function copyToClipboard() {
		table.copyToClipboard('all');
	}

	function toggleFilterBar() {
		let headerFilters = tblCntr.querySelectorAll('div.tabulator-header-filter');
		let tabHeader = tblCntr.querySelector('.tabulator-headers');
		let tabCols = tblCntr.querySelectorAll('div.tabulator-col[role="columnheader"]');

		if (filterBarInfo.visible) {
			for (const hf of headerFilters) {
				hf.classList.add('MVP-HideFilter');
			}
			for (const tc of tabCols) {
				tc.style.height = filterBarInfo.filterOffHeight + 'px';
			}
			tabHeader.style.height = filterBarInfo.filterOffHeight + 'px';
		} else {
			for (const hf of headerFilters) {
				hf.classList.remove('MVP-HideFilter');
			}
			for (const tc of tabCols) {
				tc.style.height = filterBarInfo.filterOnHeight + 'px';
			}
			tabHeader.style.height = filterBarInfo.filterOnHeight + 'px';
		}
		filterBarInfo.visible = !filterBarInfo.visible;
		// Objekat filterBarInfo je referenciran u prop tableInfo, koji se koristi
		// u okviru Ribbon. Međutim, promena vrednosti osobine 'visible' se tamo
		// ne vidi dok se ne uradi ovo (što je objašnjeno na Svelte sajtu):
		tableInfo = tableInfo;
	}

	function removeAllFilters() {
		table.clearFilter(true);

		// Sakrivanje i ponovno prikazivanje je potrebno iz razloga,
		// što se u situaciji kada je filter bar sakriven, a izvrši se brisanje svih filtera,
		// postane vidljivo gornjih desetak pixela visine filtera bara.
		// Razlog leži u logici Tabulator.info. Nismo istražili, ovaj workaround je dobro rešenje.
		if (!filterBarInfo.visible) {
			toggleFilterBar();
			toggleFilterBar();
		}
	}

	// Generiše Tabulator tabelu
	async function buildTable() {
		table = new Tabulator(tblCntr, {
			columnHeaderVertAlign: 'bottom', //align header contents to bottom of cell,
			layout: 'fitData',
			maxHeight: '100%',
			rowHeight: 22,
			headerRowHeight: 22,
			clipboard: 'copy',
			clipboardCopyRowRange: 'all',
			clipboardCopyStyled: false,
			downloadRowRange: 'all',
			dataTree: true,
			dataTreeStartExpanded: true,
			dataTreeChildIndent: 20,
			data: tableData, //link data to table
			columns: tableColumns, //define table columns
			downloadRowRange: 'all',
			scrollToColumnIfVisible: false,
			scrollToRowIfVisible: false,
			keybindings: {
				scrollToStart: false,
				scrollToEnd: false,
				scrollPageUp: false,
				scrollPageDown: false
			},

			rowFormatter: function (row) {
				let data = row.getData(); // Pristupa korespondentnom elementu niza koji sadrži podatke na osnovu kojih je table generisana.
				let cells = row.getCells(); // Sve ćelije korespondentnog reda
				let isLeafRow = isLeaf(cells[0]); // Dovoljno je proveriti prvu ćeliju

				// Pristupa se pojedinim ćelijama reda

				for (const c of cells) {
					if (isLeafRow) {
						c.getElement().classList.add('LeafCell');
					} else {
						c.getElement().classList.add('SumCell');
					}

					if (isEditable(c)) {
						c.getElement().classList.add('EditableCell');
					}
				}
			},

			headerSortElement: function (column, dir) {
				// column - column component for current column
				// dir - current sort direction ("asc", "desc", "none")

				switch (dir) {
					case 'asc':
						// return "<i class='fas fa-sort-up'>";
						return '<i class="fas fa-arrow-up-long">';
						break;
					case 'desc':
						// return "<i class='fas fa-sort-down'>";
						return '<i class="fa-solid fa-arrow-down-long">';
						break;
					default:
						// return "<i class='fas fa-sort'>";
						return '<i class="fa-solid fa-arrows-up-down">';
				}
			}
		});

		// Inicijalizacija props-a tableInfo, koji se koristi od strane komponenti PlanTableWindow i PlanTableRibbon
		tableInfo = {
			filters: { total: 0 },
			mainColumns: [], // Reference na glavne kolone
			subColumnsInfo: [], // Nazivi i indikatori vidljivosti 4 podkolone
			functions: {
				removeAllFilters: null,
				toggleFilterBar: null,
				copyToClipboard: null,
				downloadToXlsx: null,
				savePlan: null,
				handleMainColumnVisibility: null,
				handleSubColumnsVisibility: null
			},
			filterBarInfo: null
		};
		tableInfo.functions.removeAllFilters = removeAllFilters;
		tableInfo.functions.toggleFilterBar = toggleFilterBar;
		tableInfo.functions.copyToClipboard = copyToClipboard;
		tableInfo.functions.downloadToXlsx = downloadToXlsx;
		tableInfo.functions.savePlan = savePlan;
		tableInfo.functions.handleMainColumnVisibility = handleMainColumnVisibility;
		tableInfo.functions.handleSubColumnsVisibility = handleSubColumnsVisibility;

		tableInfo.filterBarInfo = filterBarInfo;

		// Ažuriranje broja primenjenih filtera
		table.on('dataFiltering', (filters) => {
			tableInfo.filters.total = filters.length;
		});

		table.on('tableBuilt', function () {
			// Setovanje podataka potrebnih za sakrivanje i prikazivanje filtera
			filterBarInfo.filterOnHeight = tblCntr.querySelector('.tabulator-headers').offsetHeight;
			let tabHeaderFilter = tblCntr.querySelectorAll('div.tabulator-header-filter')[0];
			// Computed style je potreban zbog gornje margine
			if (tabHeaderFilter) {
				const computedStyle = getComputedStyle(tabHeaderFilter);
				filterBarInfo.filterOffHeight = filterBarInfo.filterOnHeight - tabHeaderFilter.offsetHeight - parseFloat(computedStyle.marginTop);
			}
			// 'Pokupi' sve glavne kolone
			tableInfo.mainColumns = extractMainColumns();

			// Setuj nazive i indikatore vidljivosti sub kolona
			tableInfo.subColumnsInfo = [
				// { desc: $Dict.planLastYear, visible: true },
				// { desc: $Dict.executioLastYear, visible: true },
				// { desc: $Dict.planCurrentYear, visible: true },
				// { desc: $Dict.executionCurrentYear, visible: true }
			];
		});

		table.on('cellDblClick', function (e, cell) {
			if (isEditable(cell)) {
				if (isLeaf(cell)) {
					unlockInputElem(cell);
				} else {
					openSumRedistributionModal(cell);
				}
			}
		});

		// table.on('cellClick', function (e, cell) {
		// 	console.log(cell.getElement());
		// 	if (prevSelCell !== null) {
		// 		prevSelCell.getElement().classList.remove('FocusedCell');
		// 	}
		// 	cell.getElement().classList.add('FocusedCell');
		// 	prevSelCell = cell;
		// });

		console.log('ZAVRŠIO');
	}

	async function getValues() {
		return new Promise((resolve, reject) => {
            // Zameniti konkretnim vrednostima, ručno
			//let url = `http://100.96.1.7:8009/api/MasterForecasts/${planInfo.masterForecast.masterForecastId}/salesAllocs/${planInfo.salesAllocId}/keyaccounts/${planInfo.keyAccountId}/territories/${planInfo.territoryId}/values`;
			let url = `http://100.96.1.7:8009/api/MasterForecasts/1/salesAllocs/6/keyaccounts/9/territories/15/values`;
			axios
				.get(url)
				.then((res) => {
					// console.log(res.data);
					resolve(res.data);
				})
				.catch((err) => {
					// serverError = true;
					// loadingSalesPersons = false;
					console.error(err);
					reject(false);
				});
		});
	}

	async function getProducts() {
		return new Promise((resolve, reject) => {
            // Zameniti konkretnim vrednostima, ručno
			//let url = `http://100.96.1.7:8009/api/MasterForecasts/${planInfo.masterForecast.masterForecastId}/salesAllocs/${planInfo.salesAllocId}/keyaccounts/${planInfo.keyAccountId}/territories/${planInfo.territoryId}/products`;
			let url = `http://100.96.1.7:8009/api/MasterForecasts/1/salesAllocs/6/keyaccounts/9/territories/15/products`;
			axios
				.get(url)
				.then((res) => {
					// console.log(res.data);
					resolve(res.data);
				})
				.catch((err) => {
					console.error(err);
					reject(false);
				});
		});
	}

	async function setPeriods(values) {
		return new Promise((resolve, reject) => {
			let periods = new Set();
			for (const value of values) {
				periods.add(value.planPeriodId);
			}

			let arrayFromSetDataStructure = Array.from(periods);
			arrayFromSetDataStructure.sort();
			resolve(arrayFromSetDataStructure);
		});
	}

	async function generateTableColumns(arrPeriods) {
		return new Promise((resolve, reject) => {
			// Prve dve kolone - naziv proizvoda i zbirna kolona
			let frozenColumns = [
				{
					//title: $Dict.product,
					title: "Proizvod",
					field: 'productName',
					width: 160,
					frozen: true,
					headerSortTristate: true,
					headerHozAlign: 'left',
					//headerFilter: 'input',
					clipboard: 'copy'
				},

				{
					// title: $Dict.total,
					title: "Ukupno",
					// frozen: true,
					headerHozAlign: 'center',
					columns: [
						{
							title: '🡠 ⚐',
							field: 'total-valuePlanLY',
							headerHozAlign: 'center',
							hozAlign: 'right',
							formatter: 'money',
							formatterParams: moneyFormatterParams,
							editorParams: moneyFormatterParams,
							headerSort: false,
							clipboard: 'copy'
						},
						{
							title: '🡠 ✓',
							field: 'total-valueRealLY',
							headerHozAlign: 'center',
							hozAlign: 'right',
							formatter: 'money',
							formatterParams: moneyFormatterParams,
							editorParams: moneyFormatterParams,
							headerSort: false,
							clipboard: 'copy'
						},
						{
							title: '⚐',
							field: 'total-valuePlan',
							headerHozAlign: 'center',
							hozAlign: 'right',
							formatter: 'money',
							formatterParams: moneyFormatterParams,
							editorParams: moneyFormatterParams,
							headerSort: false,
							clipboard: 'copy'
						},
						{
							title: '✓',
							field: 'total-valueReal',
							headerHozAlign: 'center',
							hozAlign: 'right',
							formatter: 'money',
							formatterParams: moneyFormatterParams,
							editorParams: moneyFormatterParams,
							headerSort: false,
							clipboard: 'copy'
						}
					]
				}
			];

			// Ostale kolone
			let notFrozenColumns = [];
			for (const period of arrPeriods) {
				let tempObj = {};
				let tempTitlePart1 = period.substring(0, 4);
				let tempTitlePart2 = '';
				let tempTitlePart3 = parseInt(period.substring(5, 9));
				if (tempTitlePart3 < 10) {
					tempTitlePart3 = '0' + tempTitlePart3;
				}
				let periodIndicator = period.substring(4, 5);
				if (periodIndicator === 'D') {
					// --Naknadno, videti Veskom
				} else if (periodIndicator === 'M') {
					tempTitlePart2 = '.';
				} else {
					tempTitlePart2 = ' / ';
				}
				tempObj.title = tempTitlePart1 + tempTitlePart2 + tempTitlePart3;
				tempObj.headerHozAlign = 'center';
				tempObj.columns = [
					{
						title: '🡠 ⚐',
						field: period + '-valuePlanLY',
						headerHozAlign: 'right',
						hozAlign: 'right',
						formatter: 'money',
						formatterParams: moneyFormatterParams,
						editorParams: moneyFormatterParams,
						headerSort: false,
						clipboard: 'copy',
						editor: numEditor
					},
					{
						title: '🡠 ✓',
						field: period + '-valueRealLY',
						headerHozAlign: 'right',
						hozAlign: 'right',
						formatter: 'money',
						formatterParams: moneyFormatterParams,
						editorParams: moneyFormatterParams,
						headerSort: false,
						clipboard: 'copy',
						editor: numEditor
					},
					{
						title: '⚐',
						field: period + '-valuePlan',
						headerHozAlign: 'right',
						hozAlign: 'right',
						formatter: 'money',
						formatterParams: moneyFormatterParams,
						editorParams: moneyFormatterParams,
						headerSort: false,
						editor: 'input',
						clipboard: 'copy',
						editor: numEditor
					},
					{
						title: '✓',
						field: period + '-valueReal',
						headerHozAlign: 'right',
						hozAlign: 'right',
						formatter: 'money',
						formatterParams: moneyFormatterParams,
						editorParams: moneyFormatterParams,
						headerSort: false,
						clipboard: 'copy',
						editor: numEditor
					}
				];

				notFrozenColumns.push(tempObj);
			}

			tableColumns = [...frozenColumns, ...notFrozenColumns];
			resolve();
		});
	}

	async function generateTableData(arrPeriods, arrValues, arrProducts) {
		// console.log(arrPeriods, arrValues, arrProducts);

		let tempTableData = [];
		return new Promise(async (resolve, reject) => {
			for (const product of arrProducts) {
				let tempObj = {};
				tempObj.id = product.productId.toString();
				tempObj.productName = product.productName;
				tempObj.productAttributes = JSON.parse(JSON.stringify(product.productAttributes));
				tempObj.productClassName = product.productClassName;
				tempObj.productClassId = product.productClassId;

				let arrSelectedProductValues = arrValues.filter((value) => {
					return value.productId === product.productId;
				});

				for (const value of arrSelectedProductValues) {
					tempObj[value.planPeriodId + '-valuePlanLY'] = value.valuePlanLY !== null ? value.valuePlanLY : '-'; // Ovo ne valja, ali neka ostane privremeno
					tempObj[value.planPeriodId + '-valueRealLY'] = value.valueRealLY !== null ? value.valueRealLY : '-'; // Ovo ne valja, ali neka ostane privremeno
					tempObj[value.planPeriodId + '-valuePlan'] = value.valuePlan !== null ? value.valuePlan : '-'; // Ovo ne valja, ali neka ostane privremeno
					tempObj[value.planPeriodId + '-valueReal'] = value.valueReal !== null ? value.valueReal : '-'; // Ovo ne valja, ali neka ostane privremeno
				}
				tempObj['total-valuePlanLY'] = '0';
				tempObj['total-valueRealLY'] = '0';
				tempObj['total-valuePlan'] = '0';
				tempObj['total-valueReal'] = '0';

				tempTableData.push(tempObj);
			}
			tableData =  transformJSON(tempTableData);
			//tableData = JSON.parse(JSON.stringify(tempTableData));
			console.log(tableData);
			resolve();
		});
	}

	function setEditableColumnNames(arrPeriods) {
		editableColumnFieldNames = [];
		for (const period of arrPeriods) {
			let fieldName = period + '-valuePlan';
			editableColumnFieldNames.push(fieldName);
		}
	}

	async function initialize() {
		return new Promise(async (resolve, reject) => {
			
			let products = await getProducts(); // Pokupiti sve proizvode koji se nalaze tabeli
			let values = await getValues(); // Pokupiti sve vrednosti ćelija
			let periods = await setPeriods(values); // Postaviti periode (potrebni su za generisanje imena kolona i naziva editabilnih kolona)
			await generateTableColumns(periods); // Generisanje niza potrebnog za generisanje kolona tabele u Tabulatoru
			setEditableColumnNames(periods); // "Pokupi" field-ove editabilnih kolona.
			await generateTableData(periods, values, products); // Ovu će funkciju dovršiti Rajko
			await buildTable();
			
			resolve();
		});
	}
	// ..................................................> END FUNCTIONS

	// =================================================================
	// L I F E  C Y C L E
	// =================================================================

	onMount(() => {
		initialize();
	});

	let prevSelCell = null;

	// .................................................> END LIFE CYCLE

	// =================================================================
	// R E A C T I V E   S T A T E M E N T S
	// =================================================================
	$: {
		if (refreshTable === true) {
			if (table) {
				table.redraw();
			}
			refreshTable = false;
		}
	}

	$: {
		// Pristigli svi props i izgrađen HTML (tblCntr)
		// if (masterFc !== null && planningScope !== null && planInfo !== null && tblCntr !== null) {
		// 	initialize().then(() => {
		// 		//showLoading = false;
		// 	});
		// }
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

<!-- modalHeading={$Dict.valueRedistribution} -->
<!-- primaryButtonText={$Dict.apply} -->
<!-- secondaryButtonText={$Dict.cancel} -->

{#if showError}
	<ErrorMsg subtitle={errorSubtitle} />
{:else}
	<div id="PlanTable" bind:this={tblCntr} />
	<div class="NoPaddingModal">
		<Modal
			bind:open={showSumRedistributionModal}
			preventCloseOnClickOutside
			modalHeading="Vrednost redistribucije"
			primaryButtonText="Primeni"
			secondaryButtonText="Odustani"
			primaryButtonIcon={Checkmark}
			shouldSubmitOnEnter="false"
			primaryButtonDisabled={sumRedistributionSettings.value === null}
			on:click:button--secondary={() => {
				showSumRedistributionModal = false;
				sumRedistributionSettings.cell.edit();
			}}
			on:click:button--primary={() => {
				showSumRedistributionModal = false;
				sumRedistributionSettings.cell.setValue(sumRedistributionSettings.value);
				redistributeSum(sumRedistributionSettings.cell);
			}}
			on:close={() => {
				// Ovo je potrebno zbog zatvaranja putem pritiska na Esc.
				// Bez ovoga, ćelija sa koje se pozvao modalni, ne dobija fokus, zbog čega se navigacioni tasteri
				// primenjuju na samu tabelu, a ne indikator fokusa ćelija
				showSumRedistributionModal = false;
				sumRedistributionSettings.cell.edit();
			}}
		>
			<SumRedistribution bind:sumRedistributionSettings bind:showSumRedistributionModal />
		</Modal>
	</div>
{/if}

<!-- 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@                                                                                                       @@@
@@@                                                 C S S                                                 @@@
@@@                                                                                                       @@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
-->

<style>
	/* Linije oko ćelija  zaglavlja i tela */
	/* Transparentne linije debljeni 1px su potrebe za slučaj da se opredelimo da hover ili selektovanost ćelija vizualizujemo promenom boje linija.
	Ako se debljina ne odredi ovde, nego prilikom navedenih vizualizacija, smanjićete se širina raspoloživog prostora za prikaz sadržaja ćelija,
	zbog ćega se potencijalno pojavljuju tri tačke, a sakriva deo sadržaja.
	Obratiti pažnju: desni border je obojen. */
	:global(#PlanTable .tabulator-col-group-cols .tabulator-col, #PlanTable .tabulator-row .tabulator-cell) {
		border: 1px solid transparent;
		padding: 3px 8px !important;
		font-size: 14px !important;
		border-right-color: var(--gray-2);
	}

	/* #PlanTable .tabulator-row .tabulator-cell:nth-of-type(4n - 3), */
	/* Naglašavanje desnog bordera druge kolone tabele (zbirna kolona), poslednjih kolona grupa kolona i zbirne kolone */
	:global(
			#PlanTable .tabulator-headers > .tabulator-col:nth-of-type(1),
			#PlanTable .tabulator-headers > .tabulator-col:nth-of-type(2),
			#PlanTable .tabulator-col.tabulator-col-group,
			#PlanTable .tabulator-row .tabulator-cell:nth-of-type(1),
			#PlanTable .tabulator-headers > .tabulator-col:last-of-type,
			#PlanTable .tabulator-row > .tabulator-cell:last-of-type
		) {
		border-right: 1px solid var(--gray-6) !important;
		/* border-right: 1px solid black !important; */
	}

	/* Hover preko ćelija tabeli plana */
	/* :global(#PlanTable div.tabulator-cell[role='gridcell']:not(:first-of-type):not(:nth-of-type(2)):hover) { */
	:global(#PlanTable div.tabulator-cell[role='gridcell']:not(:first-of-type):hover) {
		background-color: var(--purple-1) !important;
	}

	:global(#PlanTable .LeafCell) {
		font-weight: normal;
	}

	:global(#PlanTable .SumCell) {
		font-weight: 650;
	}

	:global(#PlanTable .EditableCell) {
		background-color: var(--blue-1) !important;
	}

	/* Potrebno je zbog manje visine reda */
	:global(#PlanTable .tabulator-row) {
		min-height: 10px;
	}

	/* Naglašavanje prvog slova naziva kolona - na ovaj način ćemo istaći da li je reč o planu ili realizaciji. 
	Važno: Plan koji se može editovati biće obojen drugom bojom, što rešava naredna definicija */
	:global(#PlanTable .tabulator-col-group-cols .tabulator-col .tabulator-col-title::first-letter) {
		/* color: var(--purple-3); */
		color: black;
		font-size: 16px;
	}

	/* Indikacija editabilnog plana */
	:global(#PlanTable .tabulator-col-group-cols .tabulator-col:nth-of-type(3) .tabulator-col-title::first-letter) {
		color: var(--green-4);
		/* color: black; */
	}

	/* Potrebno zbog smanjene visine redova */
	:global(#PlanTable .tabulator-col) {
		min-height: 10px;
	}

	/* Odstojanje od linija */
	:global(#PlanTable .tabulator-col-content) {
		padding: 5px 15px;
		font-size: 14px;
	}

	/* Kolona UKUPNO  */
	:global(#PlanTable .tabulator-row > .tabulator-cell[tabulator-field$='total']) {
		/* border-left: 3px solid var(--gray-3); */
		background-color: var(--gray-1);
	}

	/* Red Ukupno */
	/* :global(
			#PlanTable .tabulator-row:last-of-type,
			#PlanTable .tabulator-row:last-of-type > .tabulator-cell:first-of-type,
			#PlanTable .tabulator-row:last-of-type > .tabulator-cell
		) {
		font-weight: bold;
		
		background-color: var(--gray-1) !important;
		border-top-color: var(--gray-6) !important;
		border-bottom-color: var(--gray-6) !important;
	} */

	:global(#PlanTable .tabulator-header) {
		border-top: 1px solid var(--gray-6);
		border-bottom: 1px solid var(--gray-6);
	}

	:global(#PlanTable .FocusedCell) {
		border-color: var(--purple-5) !important;
	}

	:global(#PlanTable .EditingCell) {
		border-color: var(--purple-5) !important;
		background-color: var(--green-1) !important;
	}

	:global(#PlanTable input:focus) {
		font-size: inherit;
		font-family: inherit;
		text-align: inherit;
		font-weight: inherit;
	}

	#ShowLoadingContainer {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
