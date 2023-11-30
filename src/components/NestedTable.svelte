<script>
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';
	import { DateTime } from 'luxon';

	var tableDataNested = [
		{
			name: 'Oli Bob',
			location: '1000',
			gender: 'male',
			col: 'red',
			dob: '14/04/1984',
			_children: [
				{ name: 'Mary May', location: '350', gender: 'female', col: 'blue', dob: '14/05/1982' },
				{
					name: 'Christine Lobowski',
					location: '300',
					gender: 'female',
					col: 'green',
					dob: '22/05/1982'
				},
				{
					name: 'Brendon Philips',
					location: '350',
					gender: 'male',
					col: 'orange',
					dob: '01/08/1980',
					_children: [
						{
							name: 'Margret Marmajuke',
							location: '200',
							gender: 'female',
							col: 'yellow',
							dob: '31/01/1999'
						},
						{
							name: 'Frank Harbours',
							location: '150',
							gender: 'male',
							col: 'red',
							dob: '12/05/1966'
						}
					]
				}
			]
		},
		{ name: 'Jamie Newhart', location: '800', gender: 'male', col: 'green', dob: '14/05/1985' },
		{
			name: 'Gemma Jane',
			location: '500',
			gender: 'female',
			col: 'red',
			dob: '22/05/1982',
			_children: [
				{ name: 'Emily Sykes', location: '500', gender: 'female', col: 'maroon', dob: '11/11/1970' }
			]
		},
		{ name: 'James Newman', location: '400', gender: 'male', col: 'red', dob: '22/03/1998' }
	];

	var globalCell; //Pamti celiju koja se edituje
	var inputArray; //Pamti imput koji je selektovan trenutno
	//Ne otvara modalni prozor
	var numInstantEditor = function (cell, onRendered, seccess, cancel, editorParams) {};
	//Otvara modalni prozor
	var numEditor = function (cell, onRendered, success, cancel, editorParams) {
		let changed = false;
		globalCell = cell;
		var text = cell.getValue();
		var editor = document.createElement('input');
		editor.style.padding = '3px';
		editor.style.width = '100%';
		editor.style.boxSizing = 'border-box';
		editor.style.pointerEvents = 'none!important';
		editor.style.caretColor = 'transparent!important';
		editor.value = text;
		// console.log(editor.value);
		onRendered(function () {
			editor.focus();
			editor.style.css = '100%';
			inputArray = document.querySelector('.tabulator-editing input');
			inputArray.setAttribute('readonly', 'true');
			inputArray.style.css = editor.style.css;
		});

		function successFunc() {
			// console.log(globalCell);
			globalCell.getRow().getElement().setAttribute('readonly', 'false');
			// console.log('numEditor');
			// console.log(editor.value);
			if (changed === true) {
				globalCell.setValue(editor.value);
				console.log(tableDataNested);
			}
			success(editor.value);
		}

		editor.addEventListener('change', successFunc);
		editor.addEventListener('blur', successFunc);
		editor.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				console.log('enter pritisnut');

				if (globalCell.getRow().getTreeChildren().length === 0) {
					// Krajnja celija bez dece
					let hasReadonly = false;
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
					// inputArray.removeAttribute('readonly');
					// inputArray.style.caretColor = 'black';
					console.log(inputArray);
				} else {
					globalCell.getElement().style.border = '0.5px solid blue'; // okvir da se zna koja se menja celija
					// Celija sa decom
					// console.log('enterpopup');
					var div = document.createElement('div');
					div.style.position = 'fixed';
					div.style.width = '100vw';
					div.style.height = '100vh';
					div.style.backgroundColor = 'rgba(60, 60, 60, 0.5)';
					div.style.top = '0px';
					div.style.left = '0px';
					div.style.display = 'flex';
					div.style.justifyContent = 'center';
					div.style.alignItems = 'center';
					div.addEventListener('click', (e) => {
						if (e.target === e.currentTarget) {
							div.style.display = 'none';
							globalCell.getElement().focus(); // fokusiranje izmenjene celije
							globalCell.getElement().style.border = ''; // sklanjanje okvira
						}
					});
					div.innerHTML =
						'<div style="background-color:white;width:100px;height:100px;"><input style="width:70px;"><div/>';
					var button = document.createElement('button');
					div.getElementsByTagName('input')[0].value = editor.value;
					div.getElementsByTagName('input')[0].addEventListener('keypress', (e) => {
						if (e.key === 'Enter') {
							done();
						}
					});
					button.textContent = 'unesi';
					// button.addEventListener('click', () => {
					// 	// console.log(div.getElementsByTagName('input')[0].value);
					// 	editor.value = div.getElementsByTagName('input')[0].value;
					// 	// console.log(editor.value);
					// 	div.style.display = 'none';
					// 	changed = true;
					// 	successFunc();
					// });
					button.addEventListener('click', done);
					function done() {
						// console.log(div.getElementsByTagName('input')[0].value);
						editor.value = div.getElementsByTagName('input')[0].value;
						// console.log(editor.value);
						div.style.display = 'none';
						changed = true;
						successFunc();
						globalCell.getElement().focus(); // fokusiranje izmenjene celije
						globalCell.getElement().style.border = ''; // sklanjanje okvira
					}
					div.append(button);
					document.getElementsByTagName('body')[0].append(div);
					div.getElementsByTagName('input')[0].focus();
				}

				// console.log('enterpopup');
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
				// 	}
				// });
				// div.innerHTML =
				// 	'<div style="background-color:white;width:100px;height:100px;"><input style="width:70px;"><div/>';
				// var button = document.createElement('button');
				// div.getElementsByTagName('input')[0].value = editor.value;
				// button.textContent = 'unesi';
				// button.addEventListener('click', () => {
				// 	console.log(div.getElementsByTagName('input')[0].value);
				// 	editor.value = div.getElementsByTagName('input')[0].value;
				// 	console.log(editor.value);
				// 	div.style.display = 'none';
				// 	changed = true;
				// 	successFunc();
				// });
				// div.append(button);
				// document.getElementsByTagName('body')[0].append(div);
			}
		});

		//return the editor element
		return editor;
	};

	var dateEditor = function (cell, onRendered, success, cancel, editorParams) {
		//cell - the cell component for the editable cell
		//onRendered - function to call when the editor has been rendered
		//success - function to call to pass thesuccessfully updated value to Tabulator
		//cancel - function to call to abort the edit and return to a normal cell
		//editorParams - params object passed into the editorParams column definition property

		//create and style editor
		var editor = document.createElement('input');

		editor.setAttribute('type', 'date');

		//create and style input
		editor.style.padding = '3px';
		editor.style.width = '100%';
		editor.style.boxSizing = 'border-box';

		//Set value of editor to the current value of the cell
		editor.value = DateTime.fromFormat(cell.getValue(), 'dd/MM/yyyy').toFormat('yyyy-MM-dd');

		//set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
		onRendered(function () {
			editor.focus();
			editor.style.css = '100%';
		});

		//when the value has been set, trigger the cell to update
		function successFunc() {
			success(DateTime.fromFormat(cell.getValue(), 'yyyy-MM-dd').toFormat('dd/MM/yyyy'));
		}

		editor.addEventListener('change', successFunc);
		editor.addEventListener('blur', successFunc);

		//return the editor element
		return editor;
	};

	onMount(() => {
		var table = new Tabulator('#nested-table', {
			height: '311px',
			data: tableDataNested,
			dataTree: true,
			dataTreeStartExpanded: true,
			dataTreeSelectPropagate: true,
			columns: [
				// {
				// 	formatter: 'rowSelection',
				// 	titleFormatter: 'rowSelection',
				// 	frozen: true //Zamrznuta kolona
				// },
				{ title: 'Name', field: 'name', width: 200, responsive: 0, editor: 'input', editor: true }, //never hide this column
				{
					title: 'Broj',
					field: 'location',
					width: 150,
					// editor: 'input',
					// editor: true,
					// validator: ['min:0', 'max:10000', 'numeric'],
					editor: numEditor,
					editorParams: { verticalNavigation: 'table' },
					cellEdited: function (cell) {
						var oldValue = cell.getOldValue(); // stara vrednost
						var newValue = cell.getValue(); // nova vrednost
						console.log(oldValue);
						console.log(newValue);
						var valueToAdd = newValue - oldValue;
						var row = cell.getRow();
						// console.log(row.getTreeParent().getElement()); // dobija se roditelj grupe
						// console.log(row.getTreeParent().getData().location); // vraca vrednost u celiji za zadatu kolonu
						// var parentValue =
						// 	parseFloat(row.getTreeParent().getData().location) + parseFloat(valueToAdd);
						// console.log(parentValue);
						// row.getTreeParent().update({ location: parentValue }); // izmena vrednosti u celiji roditelja

						// var parentParentValue =
						// 	parseFloat(row.getTreeParent().getTreeParent().getData().location) +
						// 	parseFloat(valueToAdd);
						// row.getTreeParent().getTreeParent().update({ location: parentParentValue }); // izmena vrednosti u celiji roditelja roditelja

						// if (row.getTreeParent()) {
						// 	var parentValue =
						// 		parseFloat(row.getTreeParent().getData().location) + parseFloat(valueToAdd);
						// 	console.log(parentValue);
						// 	row.getTreeParent().update({ location: parentValue }); // izmena vrednosti u celiji roditelja
						// 	if (row.getTreeParent().getTreeParent()) {
						// 		var parentParentValue =
						// 			parseFloat(row.getTreeParent().getTreeParent().getData().location) +
						// 			parseFloat(valueToAdd);
						// 		row.getTreeParent().getTreeParent().update({ location: parentParentValue }); // izmena vrednosti u celiji roditelja roditelja
						// 	}
						// }

						downToTop(row);
						function downToTop(rowRow) {
							if (rowRow.getTreeParent()) {
								var parentValue =
									parseFloat(rowRow.getTreeParent().getData().location) + parseFloat(valueToAdd);
								console.log(parentValue);
								rowRow.getTreeParent().update({ location: parentValue }); // izmena vrednosti u celiji roditelja
								downToTop(rowRow.getTreeParent());
							}
						}

						// if (row.getTreeChildren()) {
						// 	var kvota = parseFloat(newValue) / parseFloat(oldValue);
						// 	row.getTreeChildren().forEach((element) => {
						// 		let newNum = parseFloat(parseFloat(element.getData().location) * kvota).toFixed(2);
						// 		element.update({
						// 			location: newNum
						// 		});
						// 		console.log(element.getData().location);
						// 		if (element.getTreeChildren()) {
						// 			element.getTreeChildren().forEach((element1) => {
						// 				element1.update({
						// 					location: parseFloat(parseFloat(element1.getData().location) * kvota).toFixed(
						// 						2
						// 					)
						// 				});
						// 				// console.log(element);
						// 			});
						// 		}
						// 	});
						// }

						topToDown(row);
						function topToDown(groupRow) {
							if (groupRow.getTreeChildren()) {
								var kvota = parseFloat(newValue) / parseFloat(oldValue);
								groupRow.getTreeChildren().forEach((element) => {
									let newNum = parseFloat(parseFloat(element.getData().location) * kvota).toFixed(
										2
									);
									element.update({
										location: newNum
									});
									console.log(element.getData().location);
									topToDown(element);
								});
							}
						}
						console.log('celija ', cell);
						cell.getElement().focus();
						// globalCell.getRow().getElement()
					}
				},
				{
					title: 'Gender',
					field: 'gender',
					width: 150,
					responsive: 2,
					editor: 'input',
					editor: true
				}, //hide this column first
				{
					title: 'Favourite Color',
					field: 'col',
					width: 150,
					editor: numEditor,
					editorParams: { verticalNavigation: 'table' },
					cellDblClick: function (e, cell) {
						console.log('enterpopup');
						var div = document.createElement('div');
						div.style.position = 'fixed';
						div.style.width = '100vw';
						div.style.height = '100vh';
						div.style.backgroundColor = 'rgba(60, 60, 60, 0.5)';
						div.style.top = '0px';
						div.style.left = '0px';
						div.style.display = 'flex';
						div.style.justifyContent = 'center';
						div.style.alignItems = 'center';
						div.addEventListener('click', (e) => {
							if (e.target === e.currentTarget) {
								div.style.display = 'none';
							}
						});
						div.innerHTML =
							'<div style="background-color:white;width:100px;height:100px;">ZDRAVO!<div/>';
						document.getElementsByTagName('body')[0].append(div);
					}
				},
				// 			{ title: 'Date Of Birth', field: 'dob', hozAlign: 'center', sorter: 'date', width: 150, editor: 'input', editor: true, editable:false, cellDblClick:function(e, cell){
				// cell.edit(true); }, cellClick:function(e, cell){
				//     //e - the click event object
				//     //cell - cell component
				// 	// cell.getElement().style.border = "2px solid black";
				// },}
				// { title: 'Date Of Birth', field: 'dob', hozAlign: 'center', width: 150, editor:'datetime', editorParams:{
				// 	//format:"dd/MM/yyyy", // the format of the date value stored in the cell
				// verticalNavigation:"table", //navigate cursor around table without changing the value
				// elementAttributes:{
				//     title:"slide bar to choose option" // custom tooltip
				// }
				// }},
				{ title: 'Date Of Birth', field: 'dob', hozAlign: 'center', width: 150, editor: dateEditor }
			],
			keybindings: {
				navRight: '39', //bind navRight function to ctrl + arrow right
				navLeft: '37'
			}
		});

		table.on('validationFailed', function (cell, value, validators) {
			//cell - cell component for the edited cell
			//value - the value that failed validation
			//validatiors - an array of validator objects that failed
			//take action on validation fail
		});

		// table.on("cellEdited", function(cell, onRendered, success, cancel){
		//     console.log("izmenjeno");
		//     console.log(cell.getElement().children);
		//     console.log(cell.getElement().parentElement);
		//     console.log(cell.getElement().getData().getTreeParent());
		// });
	});
</script>

<div id="nested-table" />
