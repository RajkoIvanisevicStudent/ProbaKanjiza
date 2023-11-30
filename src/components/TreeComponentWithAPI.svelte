<script>
	import ProductList from '../searchComponent/ProductList.svelte';
	// import generateHTMLFromJSON from '../searchComponent/ProductList.svelte';
	import axios from 'axios';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';
	// import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	// import SumChange from '../components/SumChange.svelte';
	// import { Button, Modal, TextInput } from '../../node_modules/carbon-components-svelte';
	// import { Button, Modal, TextInput } from 'carbon-components-svelte';
	// axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'AllowAll';
	//     axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
	//   axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
	// axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
	// axios.defaults.headers.post['Access-Control-Allow-Origin'] =  'http://localhost:5173'; // Replace with your frontend's origin
	// axios.defaults.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
	// axios.defaults.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
	// axios.defaults.headers['Access-Control-Allow-Credentials'] = 'true'; // If your API uses cookies or authentication

	// var realData = [
	// 	//idu podaci sa apija
	// ];
	var realData = [
		{
			'Mesto ugradnje': 'ZID',
			_children: [
				{
					Format: '30X60',
					_children: [
						{
							Rektifikacija: 'DA',
							_children: [
								{
									Serija: 'EAGLE',
									_children: [
										{
											productId: 1,
											productName: 'BOTTICINO 20X60',
											productDesc: null,
											productClassId: 0,
											productClassName: null
										},
										{
											productId: 3,
											productName: 'BOTTICINO 30X60',
											productDesc: null,
											productClassId: 0,
											productClassName: null
										}
									]
								}
							]
						}
					]
				},
				{
					Format: '20X60',
					_children: [
						{
							Rektifikacija: 'DA',
							_children: [
								{
									Serija: 'EAGLE',
									_children: [
										{
											productId: 2,
											productName: 'BOTTICINO 20X60',
											productDesc: null,
											productClassId: 0,
											productClassName: null
										}
									]
								}
							]
						}
					]
				}
			]
		},
		{
			'Mesto ugradnje': 'POD',
			_children: [
				{
					Format: '30X60',
					_children: [
						{
							Rektifikacija: 'DA',
							_children: [
								{
									Serija: 'EAGLE',
									_children: [
										{
											productId: 4,
											productName: 'BOTTICINO 30X60',
											productDesc: null,
											productClassId: 0,
											productClassName: null
										}
									]
								}
							]
						}
					]
				}
			]
		}
	];

	// const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS Anywhere proxy URL
	// const apiUrl = 'http://100.96.1.7:8009/api/products'; // Your API endpoint

	// axios.get(proxyUrl + apiUrl)
	//   .then(response => {
	//     // Handle the successful response
	//     console.log('Response:', response.data);
	//   })
	//   .catch(error => {
	//     // Handle errors
	//     console.error('Error:', error);
	//   });


	function transformJSON(originalData) {
    const transformedData = [];

    for (const product of originalData) {
        let currentLevel = transformedData;

        const productClassAttr = product.productAttributes.find(attr => attr.prodAttrGrpName === 'productClass');
        const productClassValue = productClassAttr ? productClassAttr.prodAttrAbbrev : 'Other';

        let existingNode = currentLevel.find(node => node.category === productClassValue);

        if (!existingNode) {
            existingNode = { category: productClassValue, _children: [] };
            currentLevel.push(existingNode);
        }

        currentLevel = existingNode._children;

        for (const attr of product.productAttributes) {
            if (attr.prodAttrGrpName !== 'productClass') {
                const attrName = attr.prodAttrGrpName;
                const attrValue = attr.prodAttrAbbrev;

                let attrNode = currentLevel.find(node => node[attrName] === attrValue);

                if (!attrNode) {
                    attrNode = { [attrName]: attrValue, _children: [] };
                    currentLevel.push(attrNode);
                }

                currentLevel = attrNode._children;
            }
        }

        currentLevel.push({
            productId: product.productId,
            productName: product.productName,
            productDesc: product.productDesc,
            productClassId: product.productClassId,
            productClassName: product.productClassName
        });
    }

    return transformedData;
}



	// function transformJSON(originalData) {
	// 	const transformedData = [];
	// 	// console.log(originalData);
	// 	for (const product of originalData) {
	// 		let currentLevel = transformedData;

	// 		// Rajko
	// 		// let atributi = [{"prodAttrGrpName": "Rektifikacija"}, {"prodAttrGrpName": "Mesto ugradnje",}];

	// 		// let n = product.productAttributes.sort((a,b)=>{
	// 		//     if (a.prodAttrGrpName > b.prodAttrGrpName) {
	// 		//         return 1;
	// 		//     } else if (b.prodAttrGrpName > a.prodAttrGrpName) {
	// 		//         return -1;
	// 		//     } else {
	// 		//         return 0;
	// 		//     }
	// 		// });
	// 		// console.log(n);
	// 		// Rajko kraj

	// 		for (const attr of product.productAttributes) {
	// 			// const attrName = attr.prodAttrName;
	// 			const attrName = attr.prodAttrGrpName;
	// 			const attrValue = attr.prodAttrAbbrev;

	// 			let existingNode = currentLevel.find((node) => node[attrName] === attrValue);

	// 			if (!existingNode) {
	// 				existingNode = { [attrName]: attrValue, _children: [] };
	// 				currentLevel.push(existingNode);
	// 			}

	// 			currentLevel = existingNode._children;
	// 		}

	// 		currentLevel.push({
	// 			productId: product.productId,
	// 			productName: product.productName,
	// 			productDesc: product.productDesc,
	// 			productClassId: product.productClassId,
	// 			productClassName: product.productClassName
	// 		});
	// 	}

	// 	return transformedData;
	// }

	// GET REQUEST
	async function getProducts() {
		await axios
			.get('http://100.96.1.7:8009/api/products')
			.then((response) => {
				// Handle the response
				console.log(response.data);
				realData = transformJSON(response.data);
				//realData = response.data;
				console.log(realData);
			})
			.catch((error) => {
				// Handle the error
				console.log(error);
			});

		// 		axios.get('/api/products')
		//   .then(response => {
		//     console.log('API response:', response);
		//     // Handle the response
		//   })
		//   .catch(error => {
		//     console.error('API error:', error);
		//     // Handle the error
		//   });

		// 		axios.get('http://100.96.1.7:8009/api/products', {
		//   cors: {
		//     "Access-Control-Allow-Origin": "*",
		//     "Access-Control-Allow-Headers": "Content-Type"
		//   }
		// })
		// .then(response => {
		//   // Handle the response
		//   console.log(response.data);
		// })
		// .catch(error => {
		//   // Handle the error
		//   console.log(error);
		// });

		// axios
		// 	.get(proxyUrl + apiUrl)
		// 	.then((response) => {
		// 		// Handle the successful response
		// 		console.log('Response:', response.data);
		// 	})
		// 	.catch((error) => {
		// 		// Handle errors
		// 		console.error('Error:', error);
		// 	});

		// 		axios.get('http://100.96.1.7:8009/api/products', {
		// headers: {
		// 'Access-Control-Allow-Origin': '*',
		// 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		// },
		// proxy: {
		// host: '100.96.1.7',
		// port: 8009
		// }
		// }).then(function (response) {
		// console.log('response is : ' + response.data);
		// }).catch(function (error) {
		// if (error.response) {
		// console.log(error.response.headers);
		// }
		// else if (error.request) {
		// console.log(error.request);
		// }
		// else {
		// console.log(error.message);
		// }
		// console.log(error.config);
		// });

		// 		  axios({
		// 		    method: 'get',
		//             headers: {
		//     'Access-Control-Allow-Origin': '*',
		//     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
		//     'Access-Control-Allow-Headers': 'append,delete,entries,foreach,get,has,keys,set,values,Authorization',
		//    },
		// 		    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		// 		    // url: 'https://jsonplaceholder.typicode.com/todos',
		// 		    url: 'http://100.96.1.7:8009/api/products',
		// 		    // withCredentials: false,
		// 		    // params: {
		// 		    //    access_token: SECRET_TOKEN,
		// 		    // },
		// 		  })
		// 		    // .then(res => showOutput(res))
		// 		    .then(function(response) {
		// 				response.headers.add('Access-Control-Allow-Origin', '*');
		// 		        // console.log(response.data);
		// 		        // realData = transformJSON(response.data);
		// 		        // realData = response;
		// 		    })
		// 		    .catch(err => console.error(err));

		//   axios
		//     // .get('http://100.96.1.6:8009/api/products', {
		//     //   timeout: 5000
		//     // })
		//     // .then(res => showOutput(res))
		//     .get('https://100.96.1.6:8009/api/products')
		//     .then(function(response) {
		//         console.log(response);
		//         // realData = response;
		//     })
		//     .catch(err => console.error(err));
	}

	function extractFirstProperties(jsonData, resultArray = []) {
		if (Array.isArray(jsonData)) {
			jsonData.forEach((item) => extractFirstProperties(item, resultArray));
		} else if (typeof jsonData === 'object') {
			const firstKey = Object.keys(jsonData)[0];
			if (!resultArray.includes(firstKey)) {
				resultArray.push(firstKey);
			}
			if (jsonData._children) {
				jsonData._children.forEach((child) => extractFirstProperties(child, resultArray));
			}
		}
		return resultArray;
	}

	// Extracting the first properties
	const columns = extractFirstProperties(realData).map((property) => ({
		title: property,
		field: property
	}));

	var table;
	onMount(async () => {
		await getProducts();
		// 		const response = await fetch('http://100.96.1.7:8009/api/products');
		//   const data = await response.json();
		//  console.log(data);
		//console.log(JSON.stringify(realData, null, 2));


		// function generateHTMLFromJSON(data, parentElement) {
		// 	if (Array.isArray(data)) {
		// 		data.forEach((item) => {
		// 			const listItem = document.createElement('li');

		// 			if (item.Accordion) {
		// 				const accordion = document.createElement('div');
		// 				accordion.className = 'Accordion';

		// 				const chevron = document.createElement('img');
		// 				chevron.src = item.Accordion.src;
		// 				chevron.alt = '';
		// 				chevron.className = 'AccChevron Expanded';

		// 				const chkBoxContainer = document.createElement('div');
		// 				chkBoxContainer.className = 'ChkBoxContainer';

		// 				const checkbox = document.createElement('input');
		// 				checkbox.type = 'checkbox';
		// 				checkbox.name = item.name;
		// 				checkbox.id = item.id;

		// 				const label = document.createElement('label');
		// 				label.htmlFor = item.id;
		// 				label.textContent = item.label;

		// 				chkBoxContainer.appendChild(checkbox);
		// 				chkBoxContainer.appendChild(label);

		// 				accordion.appendChild(chevron);
		// 				accordion.appendChild(chkBoxContainer);

		// 				listItem.appendChild(accordion);

		// 				if (item.children) {
		// 					const nestedList = document.createElement('ul');
		// 					generateHTMLFromJSON(item.children, nestedList);
		// 					listItem.appendChild(nestedList);
		// 				}
		// 			} else {
		// 				const checkbox = document.createElement('input');
		// 				checkbox.type = 'checkbox';
		// 				checkbox.name = item.name;
		// 				checkbox.id = item.id;
		// 				checkbox.className = 'Leaf';

		// 				const label = document.createElement('label');
		// 				label.htmlFor = item.id;
		// 				label.textContent = item.label;

		// 				listItem.appendChild(checkbox);
		// 				listItem.appendChild(label);
		// 			}

		// 			parentElement.appendChild(listItem);
		// 		});
		// 	}
		// }

		// // const listContainer = document.getElementById('DefaultProductsListContainer');
		// const listContainer = document.getElementById('Omotac');
		// generateHTMLFromJSON((JSON.stringify(realData, null, 2)), listContainer);


		// generateHTMLFromJSON(realData, 'div');

		// table = new Tabulator('#example-table', {
		// 	height: '311px',
		// 	data: realData,
		// 	dataTree: true,
		// 	dataTreeStartExpanded: true,
		// 	// columns: columns,
		// 	autoColumns: true,
		// 	autoColumnsDefinitions: function (definitions) {
		// 		//definitions - array of column definition objects

		// 		console.log(definitions);

		// 		definitions.forEach((column) => {
		// 			column.headerFilter = true; // add header filter to every column
		// 			console.log(column.field);
		// 		});

		// 		// definitions.forEach((column) => {
		// 		// 	column.headerFilter = true; // add header filter to every column
		// 		// 	console.log(column.field);
		// 		// 	if (column.field !== '_children') {
		// 		// 		definitions.push(column);
		// 		// 	}
		// 		// });

		// 		console.log(definitions);
		// 		definitions.splice(definitions.length - 1, 1);

		// 		return definitions;
		// 	}
		// });
	});
</script>

<!-- <div id="example-table" /> -->

<div id="Omotac" />
<ProductList />
