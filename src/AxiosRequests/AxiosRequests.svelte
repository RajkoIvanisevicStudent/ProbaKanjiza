<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	let deletedBodyObjects = [];
	let postBodyObjects = [];
	let getBodyObjects = [];
	let leftToPostBodyObjects = [];

	// GET REQUEST
	// Vraca sve podrazumevane proizvode
	async function getDefaultProducts() {
		const apiUrl = 'http://100.96.1.7:8009/api/PlanningScopes/4/salesallocs/16/defaultproducts';
		await axios
			.get(apiUrl)
			.then((response) => {
				// Handle the response
				console.log(response.data);
				getBodyObjects = response.data;
			})
			.catch((error) => {
				// Handle the error
				console.log(error);
			});
	}

	// POST REQUEST
	// Dodaje podrazumevane proizvode
	function addDefaultProducts() {
		// Find objects in array1 but not in array2
		deletedBodyObjects = postBodyObjects.filter((item1) => {
			// Check if item1 is not present in array2
			return !getBodyObjects.some((item2) => item1.productId === item2.productId);
		});

		// Find objects in array1 but not in array2
		leftToPostBodyObjects = getBodyObjects.filter((item1) => {
			// Check if item1 is not present in array2
			return !postBodyObjects.some((item2) => item1.productId === item2.productId);
		});

		const planScopeId = 4;
		const salesAllocId = 16;
		const apiUrl =
			'http://100.96.1.7:8009/api/PlanningScopes/${planScopeId}/salesallocs/${salesAllocId}/defaultproducts';
		axios
			.post(apiUrl, leftToPostBodyObjects, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((res) => {
				return axios.delete(apiUrl, deletedBodyObjects);
			})
			.then((deleteResponse) => {
				console.log('DELETE Response:', deleteResponse.data);
			})
			.catch((err) => console.error(err));
	}

	// GET REQUEST
	// Vraca sve nedelje u nekoj godini
	async function getWeeksFromPlanPeriodsFromCertainYear() {
		const year = 2023;
		const apiUrl = 'http://100.96.1.7:8009/api/PlannPeriods/${year}/weeks';
		await axios
			.get(apiUrl)
			.then((response) => {
				// Handle the response
				console.log(response.data);
			})
			.catch((error) => {
				// Handle the error
				console.log(error);
			});
	}

	// GET REQUEST
	// Vraca sve mesece u nekoj godini
	async function getMonthsFromPlanPeriodsFromCertainYear() {
		const year = 2023;
		const apiUrl = 'http://100.96.1.7:8009/api/PlannPeriods/${year}/months';
		await axios
			.get(apiUrl)
			.then((response) => {
				// Handle the response
				console.log(response.data);
			})
			.catch((error) => {
				// Handle the error
				console.log(error);
			});
	}

	// GET REQUEST
	// Vraca sve kvartale u nekoj godini
	async function getQuartersFromPlanPeriodsFromCertainYear() {
		const year = 2023;
		const apiUrl = 'http://100.96.1.7:8009/api/PlannPeriods/${year}/quarters';
		await axios
			.get(apiUrl)
			.then((response) => {
				// Handle the response
				console.log(response.data);
			})
			.catch((error) => {
				// Handle the error
				console.log(error);
			});
	}

	// GET REQUEST
	// Vraca sve proizvode
	async function getProducts() {
		await axios
			.get('http://100.96.1.7:8009/api/products')
			.then((response) => {
				// Handle the response
				console.log(response.data);
				//realData = transformJSON(response.data);
				realData = transformJSON(fakeData);
				//realData = response.data;
				console.log(realData);
			})
			.catch((error) => {
				// Handle the error
				console.log(error);
			});
	}

	// GET REQUEST
	// Vraca sve aktivne prodavce
	async function getActiveSalesAllocations() {
		await axios
			.get('http://100.96.1.7:8009/api/SalesAllocations/active')
			.then((response) => {
				// Handle the response
				console.log(response.data);
			})
			.catch((error) => {
				// Handle the error
				console.log(error);
			});
	}

	// POST REQUEST
	// Dodaje aktivne prodavce u obuhvat plana
	function addActiveSalesAllocationsToPlanningScope() {
		const json = [
			{
				planScopeId: 2,
				salesAllocId: 1
			},
			{
				planScopeId: 2,
				salesAllocId: 1
			}
		];
		const planScopeId = 2;
		const apiUrl = 'http://100.96.1.7:8009/api/PlanningScopes/${planScopeId}/salesallocs';
		axios
			.post(apiUrl, json)
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => console.error(err));
	}

	// POST REQUEST
	// Dodaje obuhvat plana
	function addPlanningScope() {
		// 	let vjselect;
		// let numperroll;
		// let numperunl;
		const selectedOption = vjselect.options[vjselect.selectedIndex];
		axios
			.post('http://100.96.1.7:8009/api/PlanningScopes', {
				planScopeId: 0,
				planScopeName: naziv.value,
				periodTypeId: selectedOption.value,
				periodTypeName: selectedOption.innerText,
				userIdCreated: 1,
				firstNameCreated: 'Cosmo',
				lastNameCreated: 'Ulster',
				userNameCreated: 'culster0',
				scopeDateCreated: '2023-09-06T17:08:53.482Z',
				numPeriodsRolling: numperroll.value,
				numPeriodsUnlock: numperunl.value

				// planScopeId: 0,
				// planScopeName: 'string',
				// periodTypeId: 0,
				// periodTypeName: 'string',
				// userIdCreated: 0,
				// firstNameCreated: 'string',
				// lastNameCreated: 'string',
				// userNameCreated: 'string',
				// scopeDateCreated: '2023-09-06T17:08:53.482Z',
				// numPeriodsRolling: 0,
				// numPeriodsUnlock: 0
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => console.error(err));
	}

	// POST REQUEST
	// Dodavanje jedne oblasti obuhvatu plana - ako sam dobro shvatio za sada idu sve oblasti svakako pa se ovo ne koristi
	// function addSalesTerritoryToPlanningScope() {
	// 	axios
	// 		.post('http://100.96.1.7:8009/api/PlanningScopes', {
	// 			//salesTerritoryId: 1,
	// 			salesTerritoryName: 'Naziv upravnog okruga',
	// 			//salesTerritoryDesc: null,
	// 			// Moramo dodati kojem zaposlenom za koji obuhvat plana
	// 			planScopeId: 0,
	// 			userId: 0
	// 		})
	// 		.then((res) => showOutput(res))
	// 		.catch((err) => console.error(err));
	// }

	// POST REQUEST
	// Dodavanje vise oblasti obuhvatu plana - ako sam dobro shvatio za sada idu sve oblasti svakako pa se ovo ne koristi
	// function addSalesTerritoriesToPlanningScope() {
	// 	const jsonData = [
	// 		{
	// 			//salesTerritoryId: 1,
	// 			salesTerritoryName: 'Naziv upravnog okruga',
	// 			//salesTerritoryDesc: null,
	// 			planScopeId: 0,
	// 			userId: 0
	// 		},
	// 		{
	// 			//salesTerritoryId: 2,
	// 			salesTerritoryName: 'Naziv drugog upravnog okruga',
	// 			//salesTerritoryDesc: null,
	// 			planScopeId: 0,
	// 			userId: 0
	// 		},
	// 		{
	// 			//salesTerritoryId: 3,
	// 			salesTerritoryName: 'Naziv treceg upravnog okruga',
	// 			//salesTerritoryDesc: null,
	// 			planScopeId: 0,
	// 			userId: 0
	// 		}
	// 	];
	// 	axios
	// 		.post('http://100.96.1.7:8009/api/PlanningScopes', jsonData, {
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			}
	// 		})
	// 		.then((res) => showOutput(res))
	// 		.catch((err) => console.error(err));
	// }

	// POST REQUEST
	// Dodavanje podrazumevanih proizvoda odredjenom prodavcu za odredjenog kupca - oblast
	function addDefaultProductsToSalesAlloc() {
		const jsonData = [
			{
				planScopeId: 2,
				salesAllocId: 1,
				userId: 0,
				productId: 0,
				salesAlocTerritoryId: 0
				// fali jos koji kupac
			},
			{
				planScopeId: 2,
				salesAllocId: 2,
				userId: 0,
				productId: 0,
				salesAlocTerritoryId: 0
				// fali jos koji kupac
			}
		];
		const planScopeId = 2;
		const salesAllocId = 1;
		const apiUrl =
			'http://100.96.1.7:8009/api/PlanningScopes/${planScopeId}/salesallocs/{salesAllocId}/defaultproducts';
		axios
			.post(apiUrl, jsonData, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((res) => showOutput(res))
			.catch((err) => console.error(err));
	}

	// GET REQUEST
	// async function getPlanningTable() {
	// 	await axios
	// 		.get('http://100.96.1.7:8009/api/products')
	// 		.then((response) => {
	// 			// Handle the response
	// 			console.log(response.data);
	// 		})
	// 		.catch((error) => {
	// 			// Handle the error
	// 			console.log(error);
	// 		});
	// }

	// GET REQUEST
	// Hard kodirano jer su periodu uvek isti pa ne postoji ovaj api
	// async function getPlanPeriods() {
	// 	await axios
	// 		.get('http://100.96.1.7:8009/api/PlanPeriods')
	// 		.then((response) => {
	// 			// Handle the response
	// 			console.log(response.data);
	// 			return response.data;
	// 		})
	// 		.catch((error) => {
	// 			// Handle the error
	// 			console.log(error);
	// 		});
	// }

	// Promenljive koje se koriste za elemente sa stranice - input, select
	let naziv;
	let vjselect;
	let numperroll;
	let numperunl;
	onMount(() => {
		naziv = document.getElementById('nazivObuhvata');
		vjselect = document.getElementById('vjSelect');
		numperroll = document.getElementById('numPerRoll');
		numperunl = document.getElementById('numPerUnl');

		// let periods = getPlanPeriods();
		// periods.forEach((item) => {
		// 	const option = document.createElement('option');
		// 	option.value = item.periodTypeId;
		// 	option.text = item.periodTypeName;
		// 	vjselect.appendChild(option);
		// });
	});
</script>

<label for="nazivObuhvata">Unesite naziv obuhvata</label>
<input id="nazivObuhvata" />
<label for="vjSelect">Odaberite vj</label>
<select id="vjSelect">
	<option value="1">Day</option>
	<option value="2">Week</option>
	<option value="3">Month</option>
	<option value="4">Quarter</option>
</select>
<label for="numPerRoll">Periods rolling</label>
<input id="numPerRoll" />
<label for="numPerUnl">Periods unlock</label>
<input id="numPerUnl" />

<button on:click={addPlanningScope}>Kreiraj novi obuhvat</button>
