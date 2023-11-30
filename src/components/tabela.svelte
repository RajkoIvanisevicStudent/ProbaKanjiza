<script>
	import { onMount } from 'svelte';
	const CTBL_FIRST_COL_PADDING_STEP = 20;
	onMount(() => {
		// Inicijalizacija expandibilnih tabela

		let expandableTables = document.querySelectorAll('.CollapsibleTable');

		expandableTables.forEach(function (tbl, index) {
			initializeTable(tbl);
			tbl.addEventListener('click', manageTable);
		});

		window.regexInput = function (e) {
			// e.target.value.pattern = '^d*([.,]d{0,2})?$';
			// console.log(e.target.value);
			// if (!isNaN(e.target.value)) {
			//     console.log('a');
			// }
			// else {
			//     e.target.value = e.target.value.toString().slice(0, -1);
			// }
			// inpt.value.replace(/(?<=\d)(?=(\d\d\d)+\b)/g,'');

			// if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)
			// 		|| e.keyCode === 188) {
			// 			let temp = e.target.value;
			// 			console.log(temp.toLocaleString('de-DE'));
			// 			document.getElementById('da').innerText = temp;
			// 		}
			let temp = e.target.value;
			temp = temp.replace('.','');
			temp = temp.split(',').join('.');
			temp = parseFloat(temp);
			if (!isNaN(temp)) {
				e.target.value = Number(temp).toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 5 });
			} else {
				e.target.value = '';
			}
			
			// const formatter = new Intl.NumberFormat('sr-RS', {
			// 	style: 'currency',
			// 	currency: 'RSD'
			// });
			// e.target.value = formatter.format(e.target.value);
		};

		window.preliminaryCheck = function (e) {
			console.log(e);
			if ((e.keyCode === 107 || e.keyCode === 109) && e.target.value.length === 1) {
				return true;
			} else if ((e.keyCode === 107 || e.keyCode === 109) && e.target.value.length > 1){
				return false;
			}
		};

		// let inpt = document.getElementById('proba');
		// inpt.addEventListener(
		// 	'keyup',
		// 	function (evt) {
		// 		if ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105)
		// 			|| evt.keyCode === 188) {
		// 				let temp = inpt.value;
		// 				console.log(temp.toLocaleString('de-DE'));
		// 				document.getElementById('da').innerText = temp;
		// 			}
		// 		// let temp = inpt.value;
		// 		// // document.getElementById('da').innerText = temp.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
		// 		// // document.getElementById('da').innerText = temp.format();
		// 		// console.log(separateComma(temp));
		// 		// console.log(temp.toLocaleString('de-DE'));
		// 		// // document.getElementById('da').innerText = parseFloat(separateComma(temp).replace(/\D/g, '')).toLocaleString('de-DE');
		// 		// temp = separateComma(inpt.value);
		// 		// temp = temp.split('.').join("|");
		// 		// temp = temp.split(',').join(".");
		// 		// temp = temp.split('|').join(",");
		// 		// document.getElementById('da').innerText = temp;
		// 		// if (evt.keyCode === 188) {
		// 		// 	console.log('zarez');
		// 		// 	temp = inpt.value.replace(",",".");
		// 		// 	console.log('temp posle zareza',temp);
		// 		// }
		// 		// console.log(separateComma(temp));
		// 		// let da = document.getElementById('da');
		// 		// temp = separateComma(inpt.value);
		// 		// temp = temp.split('.').join("|");
		// 		// temp = temp.split(',').join(".");
		// 		// temp = temp.split('|').join(",");
		// 		// var regex = /[0-9]+(.[0-9]{1,2})?$/;
		// 		// da.innerText = temp.replace(regex);
		// 		// inpt.value = separateComma(inpt.value).toLocaleString('sr-RS');
		// 		// var str = parseFloat(inpt.value,'');
		// 		// var str = inpt.value.toString();
		// 		// if (!isNaN(str)) {
		// 		// 	var regex = /^\d{1,3}(?:\.\d{3})*(?:,\d+)?$|^\d+(?:,)?\d+$/gm;
		// 		// 	var floats = str.match(regex).map(function (v) {
		// 		// 		return parseFloat(v);
		// 		// 	});
		// 		// 	// var floats = str.toString().match(regex);
		// 		// 	console.log(floats);
		// 		// 	console.log(inpt.value);
		// 		// 	console.log(evt.target.value);
		// 		// 	inpt.value = floats.toString();
		// 		// }

		// 		// var n = parseFloat(this.value.replace(/\D/g, ''));
		// 		// if (!isNaN(n)) {
		// 		// 	inpt.value = n.toLocaleString('sr-RS');
		// 		// 	// inpt.value = n;
		// 		// }

		// 		// if (inpt.value.charAt(inpt.value.length - 1) === '.') {
		// 		// 	console.log(inpt.value.charAt(inpt.value.length - 1));
		// 		// } else {
		// 		// 	var n = parseFloat(inpt.value.charAt(inpt.value.length - 1).replace(/\D/g, ''));
		// 		// 	if (!isNaN(n) && /^\d{1,3}(?:\.\d{3})*(?:,\d+)?$|^\d+(?:,)?\d+$/gm.test(this.value)) {
		// 		// 		//inpt.value += n.toLocaleString();
		// 		// 	} else {
		// 		// 		inpt.value = inpt.value.toString().slice(0, -1);
		// 		// 	}
		// 		// }
		// 	},
		// 	false
		// );
	});

	Number.prototype.format = function () {
		if ((1.1).toLocaleString('sr-RS').indexOf(',') >= 0) {
			return this.toString()
				.split(/(?=(?:\d{3})+(?:\,|$))/g)
				.join('.');
		} else {
			return this.toString()
				.split(/(?=(?:\d{3})+(?:.|$))/g)
				.join(',');
		}
	};

	function allReplace(str, obj) {
		for (const x in obj) {
			str = str.replace(new RegExp(x, 'g'), obj[x]);
		}
		return str;
	}

	function separateComma(val) {
		// remove sign if negative
		var sign = 1;
		if (val < 0) {
			sign = -1;
			val = -val;
		}
		// trim thousand separator
		val = val.toString().replace(',', '');
		console.log(val);
		// trim the number decimal point if it exists
		let num = val.toString().includes('.') ? val.toString().split('.')[0] : val.toString();
		let len = num.toString().length;
		let result = '';
		let count = 1;

		for (let i = len - 1; i >= 0; i--) {
			result = num.toString()[i] + result;
			if (count % 3 === 0 && count !== 0 && i !== 0) {
				result = ',' + result;
			}
			count++;
		}

		// add number after decimal point
		if (val.toString().includes('.')) {
			result = result + '.' + val.toString().split('.')[1];
		}
		// return result with - sign if negative
		return sign < 0 ? '-' + result : result;
	}

	// Inicijalizacija expandibilnih tabela

	// let expandableTables = document.querySelectorAll('.CollapsibleTable');

	// expandableTables.forEach(function (tbl, index) {
	// 	initializeTable(tbl);
	// 	tbl.addEventListener('click', manageTable);
	// });

	function manageTable(e) {
		if (
			e.target.tagName.toUpperCase() === 'TH' &&
			e.target.parentElement.classList.contains('Expandable')
		) {
			collapseOrExpandRow(e.target.parentElement);
		}
	}

	function collapseOrExpandRow(clickedRow) {
		// Funkciji stiže kolapsibilan red na koji se kliknulo
		clickedRow.classList.toggle('Expanded');

		// Redovi koji se nalaze u tbody-ju kojem clickedRow pripada
		let childRows = clickedRow.closest('tbody').querySelectorAll('tr');

		childRows.forEach(function (childRow) {
			if (
				childRow.dataset.nestedClassification !== clickedRow.dataset.nestedClassification &&
				childRow.dataset.nestedClassification.includes(clickedRow.dataset.nestedClassification)
			) {
				expandRow(childRow);
			}
		});
	}

	function expandRow(row) {
		// Nivoi klasifikacije kojima red pripada
		let levels = row.dataset.nestedClassification.split(' ');

		// Ako je reč o redu koji nije na prvom nivou klasifikacije
		if (levels.length > 1) {
			// Pretpostavljamo da ne postoji kolapsirani predak
			let collapsedAncestor = false;

			// Pristupamo višim nivoima, nivo po nivo. Krećemo od prvog nivoa.
			for (let i = 1; i < levels.length; i++) {
				let joinedLevels = levels.slice(0, i).join(' ');

				// Ako ispitivani nivo klasifikacije nije otvoren (obratiti pažnju na ! na početku uslova)...

				if (
					!row
						.closest('tbody')
						.querySelector(`[data-nested-classification="${joinedLevels}"]`)
						.classList.contains('Expanded')
				) {
					//...to je indikator red ima pretka koji ja zatvoren, zbog čega nema potrebe za daljim ispitivanjem predaka.
					collapsedAncestor = true;
					break;
				}
			}

			// Ako nijedan predak nije zatvoren, red treba prikazati
			if (!collapsedAncestor) {
				row.classList.remove('CollapsedAncestor');
			} else {
				row.classList.add('CollapsedAncestor');
			}
		}
	}

	function initializeTable(table) {
		let tbodies = table.querySelectorAll('tbody');

		tbodies.forEach(function (selectedTBody) {
			let childRows = selectedTBody.querySelectorAll('tr');

			childRows.forEach(function (childRow) {
				expandRow(childRow);
				let levels = childRow.dataset.nestedClassification.split(' ');
				if (levels.length > 1) {
					let headerCol = (childRow.querySelector('th').style.paddingLeft =
						(levels.length - 1) * CTBL_FIRST_COL_PADDING_STEP + 'px');
				}
			});
		});
	}
</script>

<div id="da" />
<div id="roditelj">
	<table class="CollapsibleTable" id="Plan1">
		<thead>
			<tr>
				<th>Polje A1-A2</th>
				<th>Januar</th>
				<th>Februar</th>
				<th>Mart</th>
				<th>April</th>
				<th>Maj</th>
				<th>Jun</th>
				<th>Jul</th>
				<th>Avgust</th>
				<th>Septembar</th>
				<th>Oktobar</th>
			</tr>
		</thead>
		<tbody>
			<tr class="Settable Expandable Expanded" data-nested-classification="Grupa1">
				<th>Grupa 0</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>

			<tr class="Settable Expandable Expanded" data-nested-classification="Grupa1 Grupa1.1">
				<th style="padding-left: 20px">Grupa 0.1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>

			<tr class="Settable Expandable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.1">
				<th>Grupa 0.1.1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.1 Grupa1.1.1.1">
				<th>Grupa 0.1.1.1</th>
				<!-- <td><input type="number" /></td> -->
				<!-- <td><input type="text" onkeydown=
                    "return ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
					|| event.keyCode === 188 || event.keyCode === 8) " pattern="/^-?(\d+|\d{1,3}(\.\d{3})+)(\,(\s)?\d*)?$/g"/></td> -->
				<!-- && /^(?!0|\.00)[0-9]+(.\d{3})*(,[0-9]{0,2})$/.test(this.value) -->
				<!-- <td><input id="proba" type="text" /></td> -->
				<!-- <td><input type="text" onchange="regexInput(event)" onkeydown=
                    "return ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
					|| event.keyCode === 188 || event.keyCode === 190 || event.keyCode === 8 || event.keyCode === 46
					|| event.keyCode === 13 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 110 || event.keyCode === 187
					|| event.keyCode === 194) "/></td> -->
					<td><input type="text" onchange="regexInput(event)" onkeyup="preliminaryCheck(event)"/></td>
				<!-- pattern="^(?!0|\.00)[0-9]+(.\d{3})*(,[0-9]{0,2})$" -->
				<td><input type="text" inputmode="numeric" pattern="/(\d)(?=(\d{3})+\b)/g" /></td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.1 Grupa1.1.1.2">
				<th>Grupa 0.1.1.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Settable Expandable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.2">
				<th>Grupa 0.1.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.2 Grupa1.1.2.1">
				<th>Grupa 0.1.2.1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.2 Grupa1.1.2.2">
				<th>Grupa 0.1.2.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Settable Expandable Expanded Level-2" data-nested-classification="Grupa1 Grupa1.2">
				<th>Grupa 0.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.2 Grupa1.2.1">
				<th>Grupa 0.2.1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.2 Grupa1.2.2">
				<th>Grupa 0.2.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
		</tbody>

		<tbody>
			<tr class="Settable Expandable" data-nested-classification="Grupa1">
				<th>Grupa 1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>

			<tr class="Settable Expandable Expanded" data-nested-classification="Grupa1 Grupa1.1">
				<th>Grupa 1.1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>

			<tr class="Settable Expandable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.1">
				<th>Grupa 1.1.1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.1 Grupa1.1.1.1">
				<th>Grupa 1.1.1.1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.1 Grupa1.1.1.2">
				<th>Grupa 1.1.1.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Settable Expandable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.2">
				<th>Grupa 1.1.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.2 Grupa1.1.2.1">
				<th>Grupa 1.1.2.1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.1 Grupa1.1.2 Grupa1.1.2.2">
				<th>Grupa 1.1.2.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Settable Expandable Expanded Level-2" data-nested-classification="Grupa1 Grupa1.2">
				<th>Grupa 1.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.2 Grupa1.2.1">
				<th>Grupa 1.2.1</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
			<tr class="Editable" data-nested-classification="Grupa1 Grupa1.2 Grupa1.2.2">
				<th>Grupa 1.2.2</th>
				<td>4</td>
				<td>4</td>
				<td>3</td>
				<td>1</td>
				<td>4</td>
				<td>2</td>
				<td>0</td>
				<td>3</td>
				<td>2</td>
				<td>23</td>
			</tr>
		</tbody>
	</table>
</div>
