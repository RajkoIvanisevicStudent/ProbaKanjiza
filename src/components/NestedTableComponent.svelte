<script>
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import SumChange from '../components/SumChange.svelte';
	// import { Button, Modal, TextInput } from '../../node_modules/carbon-components-svelte';
	import { Button, Modal, TextInput } from 'carbon-components-svelte';

	let showError = false;
	let errorSubtitle = '#PRIVREM';

	let showModal = false;

	let settings = {
		period: 'May / 2023',
		distributionMode: 'lastYearPlan',
		newValueAllowed: true,
		value: 15210
	};

	var realData = [
		{
			grupa: 'Grupa 0',
			planProsle: 800,
			planOve: 1000,
			realizovano: 600,
			_children: [
				{
					grupa: 'Grupa 0.1',
					planProsle: 400,
					planOve: 500,
					realizovano: 300,
					_children: [
						{ grupa: 'Grupa 0.1.1', planProsle: 200, planOve: 250, realizovano: 150 },
						{
							grupa: 'Grupa 0.1.2',
							planProsle: 200,
							planOve: 250,
							realizovano: 150,
							_children: [
								{
									grupa: 'Grupa 0.1',
									planProsle: 400,
									planOve: 500,
									realizovano: 300,
									_children: [
										{ grupa: 'Grupa 0.1.1', planProsle: 200, planOve: 250, realizovano: 150 },
										{ grupa: 'Grupa 0.1.2', planProsle: 200, planOve: 250, realizovano: 150 }
									]
								},
								{
									grupa: 'Grupa 0.2',
									planProsle: 400,
									planOve: 500,
									realizovano: 300,
									_children: [
										{ grupa: 'Grupa 0.2.1', planProsle: 200, planOve: 250, realizovano: 150 },
										{ grupa: 'Grupa 0.2.2', planProsle: 200, planOve: 250, realizovano: 150 }
									]
								}
							]
						}
					]
				},
				{
					grupa: 'Grupa 0.2',
					planProsle: 400,
					planOve: 500,
					realizovano: 300,
					_children: [
						{ grupa: 'Grupa 0.2.1', planProsle: 200, planOve: 250, realizovano: 150 },
						{ grupa: 'Grupa 0.2.2', planProsle: 200, planOve: 250, realizovano: 150 }
					]
				}
			]
		},
		{ grupa: 'Grupa 1', planProsle: 200, planOve: 300, realizovano: 200 }
	];

	var globalCell; //Pamti celiju koja se edituje
	var inputArray; //Pamti imput koji je selektovan trenutno
	var hiddenDiv;
	//Otvara modalni prozor
	var numEditor = function (cell, onRendered, success, cancel, editorParams) {
		// editorParams = [{formatter:"money",formatterParams: {
		// 				decimal: ',',
		// 				thousand: '.',
		// 				symbol: '£',
		// 				symbolAfter: 'p',
		// 				negativeSign: true,
		// 				precision: false
		// 			}}];
		let changed = false;
		globalCell = cell;
		var text = cell.getValue();
		var editor = document.createElement('input');
		editor.style.padding = '3px';
		editor.style.width = '100%';
		editor.style.boxSizing = 'border-box';
		editor.style.pointerEvents = 'none!important';
		editor.style.caretColor = 'transparent!important';
		editor.value = text.toString().replace('.', ',');
		// editor.value = text;
		// editor.value = cell.getValue();
		onRendered(function () {
			editor.focus();
			editor.style.css = '100%';
			inputArray = document.querySelector('.tabulator-editing input');
			inputArray.setAttribute('readonly', 'true');
			inputArray.style.css = editor.style.css;
		});

		function successFunc() {
			editor.value = editor.value.toString().replace(',', '.');
			globalCell.getRow().getElement().setAttribute('readonly', 'false');
			if (changed === true) {
				globalCell.setValue(editor.value);
			}
			success(editor.value);
		}

		editor.addEventListener('change', successFunc);
		editor.addEventListener('blur', successFunc);
		// Rajko 02.08.2023.
		editor.addEventListener('keydown', function (e) {
			if (e.key === 'Home') {
				e.preventDefault();
				// console.log('zdravo');
				// console.log(table.getData());
				// console.log(table.getRows()[0].getData().realizovano);
				// table.getRows()[0].getData().realizovano;
				// var da = table.getData();
				// console.log(da[0].realizovano);
				if (cell.getElement() === table.getRowFromPosition(1).getCell('realizovano').getElement()) {
					console.log('iste');
				} else {
					// let row = table.getRowFromPosition(1);
					let row = table.getRows('visible')[0];
					row.getCell('realizovano').edit();
				}
			}
			if (e.key === 'End') {
				e.preventDefault();
				let row = table.getRowFromPosition(table.getRows('visible').length);
				row.getCell('realizovano').edit();
			}

			if (e.key === 'ArrowRight' && !hasReadonly) {
				// Right i Next je razlika sto sa next ide u novi red kada vise nema desno celija, a sa right ne ide vec ostaje na istoj celiji
				// table.navigateNext();
				table.navigateRight();
			}
			if (e.key === 'ArrowLeft' && !hasReadonly) {
				// table.navigatePrev();
				table.navigateLeft();
			}
		});
		// Podigao na ovaj nivo umesto ispod iz razloga da bih omogucio kretanje po celijama i unutar jedne celije
		let hasReadonly = false;
		if (cell.getColumn().getField() === 'realizovano') {
			editor.addEventListener('keydown', function (e) {
				// RAJKO 19.10.2023. ESC
				if (e.key === 'Escape' || e.key === 'Esc') {
					console.log('esc pritisnut');
					hasReadonly = false;
					for (const att of inputArray.attributes) {
						if (att.name === 'readonly') {
							hasReadonly = true;
							break;
						}
					}
					if (!hasReadonly) {
						inputArray.setAttribute('readonly', 'true');
						inputArray.style.caretColor = 'transparent';
						editor.value = cell.getValue().toString().replace('.', ',');
					}
				}
				// KRAJ RAJKO 19.10.2023. ESC
			});
			editor.addEventListener('keypress', function (e) {
				if (e.key === 'Enter') {
					console.log('enter pritisnut');

					if (globalCell.getRow().getTreeChildren().length === 0) {
						// Krajnja celija bez dece
						// let hasReadonly = false;
						hasReadonly = false;
						for (const att of inputArray.attributes) {
							if (att.name === 'readonly') {
								hasReadonly = true;
								break;
							}
						}
						if (hasReadonly) {
							inputArray.removeAttribute('readonly');
							inputArray.style.caretColor = 'black';
						} else {
							inputArray.setAttribute('readonly', 'true');
							inputArray.style.caretColor = 'transparent';
						}

						// Rajko 03.08.2023. ne sluzi nicemu pokusavao resiti kretanje unutar celije, reseno iznad
						// inputArray.addEventListener('keydown', function (e) {
						// 	if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
						// 		if (hasReadonly) {
						// 			e.stopPropagation();
						// 		}
						// 	}
						// });
					} else {
						editor.value = editor.value.toString().replace(',', '.');
						// Pod komentarom je da bih probao da primenim privrem.svelte
						// globalCell.getElement().style.border = '0.5px solid blue'; // okvir da se zna koja se menja celija
						// // Celija sa decom
						// var div = document.createElement('div');
						// div.style.position = 'fixed';
						// div.style.width = '100vw';
						// div.style.height = '100vh';
						// div.style.backgroundColor = 'rgba(60, 60, 60, 0.5)';
						// div.style.top = '0px';
						// div.style.left = '0px';
						// div.style.display = 'flex';
						// div.style.justifyContent = 'center';
						// div.style.alignItems = 'center';
						// div.addEventListener('click', (e) => {
						// 	if (e.target === e.currentTarget) {
						// 		div.style.display = 'none';
						// 		globalCell.getElement().focus(); // fokusiranje izmenjene celije
						// 		globalCell.getElement().style.border = ''; // sklanjanje okvira
						// 	}
						// });
						// div.innerHTML =
						// 	'<div style="background-color:white;width:100px;height:100px;"><input style="width:70px;"><div/>';
						// var button = document.createElement('button');
						// div.getElementsByTagName('input')[0].value = editor.value;
						// div.getElementsByTagName('input')[0].addEventListener('keypress', (e) => {
						// 	if (e.key === 'Enter') {
						// 		done();
						// 	}
						// });
						// button.textContent = 'unesi';
						// button.addEventListener('click', done);
						// function done() {
						// 	editor.value = div.getElementsByTagName('input')[0].value;
						// 	div.style.display = 'none';
						// 	changed = true;
						// 	successFunc();
						// 	globalCell.getElement().focus(); // fokusiranje izmenjene celije
						// 	globalCell.getElement().style.border = ''; // sklanjanje okvira
						// }
						// div.append(button);
						// document.getElementsByTagName('body')[0].append(div);
						// div.getElementsByTagName('input')[0].focus();

						// globalCell.getElement().style.border = '0.5px solid blue'; // okvir da se zna koja se menja celija
						// Celija sa decom
						if (showModal === false) {
							showModal = true;
							settings.value = editor.value;
							hiddenDiv = document.createElement('div');
							hiddenDiv.addEventListener('click', done);
							document.getElementById('Modalni').append(hiddenDiv);
							console.log(settings.value);
							console.log('hiddenDiv finished!!!');
						}
						// showModal = true;
						// settings.value = editor.value;
						function done() {
							editor.value = settings.value;
							changed = true;
							successFunc();
							document.getElementById('Modalni').removeChild(hiddenDiv);
							// globalCell.getElement().focus(); // fokusiranje izmenjene celije
							// globalCell.getElement().style.border = ''; // sklanjanje okvira
							console.log(showModal);
						}
						// hiddenDiv = document.createElement('div');
						// hiddenDiv.addEventListener('click', done);
						// document.getElementsByTagName('body')[0].append(hiddenDiv);
						// console.log(settings.value);
					}
				}
			});
		}

		//return the editor element
		return editor;
	};
	function resizeColumnToContent(table, column) {
		// Get the maximum width of the column's data
		let maxWidth = 0;
		table.getData(true).forEach((row) => {
			let cellValue = row[column.getField()];
			let cellWidth = cellValue.toString().length * 10; // Adjust the multiplier as needed
			maxWidth = Math.max(maxWidth, cellWidth);
		});

		// Resize the column to fit the content with some padding
		column.setWidth(maxWidth + 30); // Adjust the padding as needed
	}
	var table;
	onMount(() => {
		table = new Tabulator('#nestedComponent-table', {
			layout: 'fitDataFill',
			layoutColumnsOnNewData: true,
			columnHeaderVertAlign: 'bottom', //align header contents to bottom of cell,
			// clipboardCopyConfig: {
			// 	dataTree: true,
			// 	rowGroups: true
			// },
			maxHeight: '100%',
			rowHeight: 22,
			headerRowHeight: 22,
			clipboard: 'copy',
			//clipboardCopyRowRange: 'all',
			// clipboardCopyStyled: false,
			downloadRowRange: 'all',
			dataTree: true,
			dataTreeStartExpanded: true,
			dataTreeChildIndent: 20,
			downloadRowRange: 'all',
			scrollToColumnIfVisible: false,
			scrollToRowIfVisible: false,
			rowGroups: true,
			//clipboard: true,
			clipboardCopyConfig: {
				// columnHeaders:false, //do not include column headers in clipboard output
				// columnGroups:false, //do not include column groups in column headers for printed table
				// rowGroups:false, //do not include row groups in clipboard output
				// columnCalcs:false, //do not include column calculation rows in clipboard output
				dataTree: true //do not include data tree in printed table
				// formatCells:false, //show raw cell values without formatter
			},
			height: '311px',
			data: realData,
			dataTree: true,
			dataTreeStartExpanded: true,
			dataTreeSelectPropagate: true,
			// columnCalcs: 'table',
			// layout: 'fitDataTable',
			// columnCalcs: 'both',
			columns: [
				{ title: 'Grupe', field: 'grupa', width: 150 },
				{
					title: 'Plan prosle',
					field: 'planProsle',
					width: 150,
					editor: numEditor,
					editorParams: { verticalNavigation: 'table' },
					cellEdited: function (cell) {
						var oldValue = cell.getOldValue(); // stara vrednost
						var newValue = cell.getValue(); // nova vrednost
						var valueToAdd = newValue - oldValue;
						var row = cell.getRow();

						downToTop(row);
						function downToTop(rowRow) {
							if (rowRow.getTreeParent()) {
								var parentValue =
									parseFloat(rowRow.getTreeParent().getData().planProsle) + parseFloat(valueToAdd);
								rowRow.getTreeParent().update({ planProsle: parentValue }); // izmena vrednosti u celiji roditelja
								downToTop(rowRow.getTreeParent());
							}
						}

						topToDown(row);
						function topToDown(groupRow) {
							if (groupRow.getTreeChildren()) {
								var kvota = parseFloat(newValue) / parseFloat(oldValue);
								groupRow.getTreeChildren().forEach((element) => {
									let newNum = parseFloat(parseFloat(element.getData().planProsle) * kvota).toFixed(
										2
									);
									element.update({
										planProsle: newNum
									});
									topToDown(element);
								});
							}
						}
						cell.getElement().focus();
						// resizeColumnToContent(table, cell.getColumn());
					}
				},
				{
					title: 'Plan ove',
					field: 'planOve',
					width: 150,
					editor: numEditor,
					editorParams: { verticalNavigation: 'table' },
					cellEdited: function (cell) {
						var oldValue = cell.getOldValue(); // stara vrednost
						var newValue = cell.getValue(); // nova vrednost
						var valueToAdd = newValue - oldValue;
						var row = cell.getRow();

						downToTop(row);
						function downToTop(rowRow) {
							if (rowRow.getTreeParent()) {
								var parentValue =
									parseFloat(rowRow.getTreeParent().getData().planOve) + parseFloat(valueToAdd);
								rowRow.getTreeParent().update({ planOve: parentValue }); // izmena vrednosti u celiji roditelja
								downToTop(rowRow.getTreeParent());
							}
						}

						topToDown(row);
						function topToDown(groupRow) {
							if (groupRow.getTreeChildren()) {
								var kvota = parseFloat(newValue) / parseFloat(oldValue);
								groupRow.getTreeChildren().forEach((element) => {
									let newNum = parseFloat(parseFloat(element.getData().planOve) * kvota).toFixed(2);
									element.update({
										planOve: newNum
									});
									topToDown(element);
								});
							}
						}
						cell.getElement().focus();
						// resizeColumnToContent(table, cell.getColumn());
					}
				},
				{
					title: 'Realizovano',
					field: 'realizovano',
					width: 150,

					formatter: 'money',
					formatterParams: {
						decimal: ',',
						thousand: '.'
						// symbol: '',
						// symbolAfter: 'din',
						// negativeSign: true,
						// precision: false
					},
					editor: numEditor,
					editorParams: { verticalNavigation: 'table' },

					cellEdited: function (cell) {
						var oldValue = cell.getOldValue(); // stara vrednost
						var newValue = cell.getValue(); // nova vrednost
						var valueToAdd = newValue - oldValue;
						var row = cell.getRow();

						downToTop(row);
						function downToTop(rowRow) {
							if (rowRow.getTreeParent()) {
								var parentValue =
									parseFloat(rowRow.getTreeParent().getData().realizovano) + parseFloat(valueToAdd);
								rowRow.getTreeParent().update({ realizovano: parentValue }); // izmena vrednosti u celiji roditelja
								downToTop(rowRow.getTreeParent());
							}
						}

						topToDown(row);
						function topToDown(groupRow) {
							if (groupRow.getTreeChildren()) {
								var kvota = parseFloat(newValue) / parseFloat(oldValue);
								groupRow.getTreeChildren().forEach((element) => {
									let newNum = parseFloat(
										parseFloat(element.getData().realizovano) * kvota
									).toFixed(2);
									element.update({
										realizovano: newNum
									});
									topToDown(element);
								});
							}
						}
						cell.getElement().focus();
						console.log('edited!!!');
						resizeColumnToContent(table, cell.getColumn());
					}
				}
			],
			keybindings: {
				// navRight: '39', //bind navRight function to ctrl + arrow right
				// navLeft: '37',
				scrollToStart: 'ctrl + shift + 36',
				scrollToEnd: 'ctrl + shift + 35'
			}
		});
	});
</script>

<div id="nestedComponent-table" />

<Modal
	id="Modalni"
	bind:open={showModal}
	preventCloseOnClickOutside
	modalHeading="Rasporedjivanje vrednosti"
	primaryButtonText="Primeni"
	secondaryButtonText="Odustani"
	primaryButtonIcon={Checkmark}
	primaryButtonDisabled={settings.value == null}
	on:click:button--secondary={() => (showModal = false)}
	on:click:button--primary={() => {
		// showModal = false;
		console.log(settings);
		hiddenDiv.click();
		showModal = false;
		console.log(showModal);
		console.log('primary ended!!!');
		// globalCell.getElement().focus();
		// globalCell.edit();
	}}
>
	<SumChange bind:settings />
</Modal>
