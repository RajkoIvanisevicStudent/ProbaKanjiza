<script>
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';

	var tabledata = [
		{ name: 'Rajko Ivanisevic' },
		{ name: 'Marton Sakal' },
		{ name: 'Pedja Matkovic' }
	];

	var customSender = function (fromRow, toRow, toTable) {
		//fromRow - the row component from the sending table
		//toRow - the row component from the receiving table (if available)
		//toTable - the Tabulator object for the receiving table

		fromRow.update({ moved: fromRow.getData().moved + 1 });
	};

	var table;
	var table1;
	onMount(() => {
		//Table to move rows from
		table = new Tabulator('#example-table-sender', {
			height: 311,
			layout: 'fitColumns',
			movableRows: true,
			//movableRowsConnectedTables:["#example-table-sender","#example-table-receiver"],
			movableRowsConnectedTables: '#example-table-receiver',
			movableRowsReceiver: 'add',
			movableRowsSender: 'delete',
			// movableRowsSender: customSender,
			placeholder: 'Lonac kriterijuma',
			data: tabledata,
			columns: [{ title: 'Name', field: 'name' }]
		});

		//Table to move rows to
		table1 = new Tabulator('#example-table-receiver', {
			height: 311,
			layout: 'fitColumns',
			movableRows: true,
			//movableRowsConnectedTables:["#example-table-receiver","#example-table-sender"],
			movableRowsConnectedTables: '#example-table-sender',
			movableRowsReceiver: 'add',
			movableRowsSender: 'delete',
			//movableRowsSender: customSender,
			placeholder: 'Dodajte kriterijume',
			data: [],
			columns: [
				{
					rowHandle: true,
					formatter: 'handle',
					headerSort: false,
					frozen: true,
					width: 30,
					minWidth: 30
				},
				{ title: 'Name', field: 'name' }
			]
		});
	});
</script>

<div id="example-table-sender" />

<div id="example-table-receiver" />
