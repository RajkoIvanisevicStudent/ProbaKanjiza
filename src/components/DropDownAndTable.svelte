<script>
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';

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
		var table = new Tabulator('#editTable', {
			height: '311px',
			columns: [
				{ title: 'Sifra', field: 'sifra', width: 150 },
				{ title: 'Naziv artikla', field: 'nazivArtikla', width: 150 },
				{ title: 'Kolicina', field: 'kolicina', width: 150, editor:'input', validator:['min:0','max:1000','numeric'] },
				{ title: 'JM', field: 'jm', width: 150 },
				{ title: 'Rok za isporuku', field: 'rokZaIsporuku', width: 150, editor:dateEditor}
			]
		});

        let dugme = document.getElementById('Dugme');
        dugme.addEventListener('click',klikni);
        function klikni() {
            table.addData([{sifra:1,nazivArtikla:'prvi artikal',jm:'kg'}]);
        }
	});
</script>

<button id="Dugme">Klikni me</button>
<div id="editTable" />
