<script>
	// =================================================================
	// I M P O R T
	// =================================================================

	// Svelte components
	import { onMount } from 'svelte';

	// Carbon components
	import { Search } from 'carbon-components-svelte';

	// Carbon icons
	// --

	// Dictionary and other stores
	// --
	import axios from 'axios';

	// Our components
	// --

	// Our functions
	import { expandCategory } from './functions.js';
	import { collapseCategory } from './functions.js';
	import { selectionStateInfo } from './functions.js';

	// Our styles
	// --

	// Our images
	// import Chevron from '$lib/img/blue-arrow-down.svg';
	import Chevron from './blue-arrow-down.svg';

	// .....................................................> END IMPORT

	// =================================================================
	// P R O P S
	// =================================================================
	export let listContainer = null; //Sadrži div u koji je smeštena lista, služi kao referenca na koju se vezuju selektori u ovoj i roditeljskoj komponenti
	export let selectedProductsCount = 0;
	export let expandedChevrons = 0;
	// .....................................................> END PROPS

	// =================================================================
	// V A R I A B L E S
	// =================================================================

	let accordionChevrons; // Strelice za otvaranje/zatvaranje grupa, popunjava se u onMount()
	let checkboxes; // CheckBox-evi, popunjava se u onMount()

	// ..................................................> END VARIABLES

	// =================================================================
	// F U N C T I O N S
	// =================================================================

	// ***********************************************
	// RAJKO
	// ***********************************************

	function filterProducts(filterText) {
		var filter, ulWrapper, liArray, labelOfItem, i, txtValue;
		// filter jeste tekst ukucan u pretragu pretvoren u velika slova
		filter = filterText.toUpperCase();
		// ulWrapper jeste lista koja je skroz spoljasnja, tj. unutar nje se nalaze svi list item-i i sve ugnjezdjene liste
		ulWrapper = document.querySelector('#DefaultProductsListContainer > ul');
		// liArray predstavlja SVE list item-e koji se nalaze unutar nase celokupne liste (ulWrapper-a), na bilo kom nivou
		liArray = ulWrapper.querySelectorAll('li');

		// Prolazi se kroz sve list item-e koji su u listi, redom
		for (i = 0; i < liArray.length; i++) {
			// labelOfItem jeste labela koja se nalazi unutar list item-a, u njoj se nalazi stavke, taj tekst treba porediti sa unosom u pretrazi
			labelOfItem = liArray[i].getElementsByTagName('label')[0];
			// Ukoliko labela postoji
			if (labelOfItem) {
				// txtValue jeste tekst koji se nalazi unutar stavke (nalazi se uvek u labeli), taj tekst se poredi sa unosom u pretrazi
				txtValue = labelOfItem.textContent;
				// Ukoliko se tekst poklapa
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
					// Stavka se postavlja da je vidljiva
					liArray[i].style.display = 'block';
					liArray[i].style.visibility = 'visible';

					// Funkcija koja prolazi kroz sve roditelje stavke i postavlja njihovu vidljivost, takodje, na block, kako bi se videli
					setDisplayBlockToParent(liArray[i]);
					function setDisplayBlockToParent(element) {
						if (element.parentElement) {
							if (element.parentElement.id !== 'DefaultProductsListContainer') {
								element.parentElement.style.display = 'block';
								element.parentElement.style.visibility = 'visible';
								if (element.parentElement.parentElement) {
									setDisplayBlockToParent(element.parentElement);
								}
							}
						}
					}

					// Funkcija koja prolazi kroz svu decu stavke i postavlja njihovu vidljivost, takodje, na block, kako bi se videli
					setDisplayBlockToChildren(liArray[i]);
					function setDisplayBlockToChildren(elementChild) {
						elementChild.style.display = 'block';
						elementChild.style.visibility = 'visible';

						for (let liChild of elementChild.querySelectorAll('li')) {
							// Postavlja detetovu vidljivost na block
							liChild.style.display = 'block';
							liChild.style.visibility = 'visible';
							// Povecava se brojac kako se naknadno ne bi ponovo proveravala ta stavka i eventualno stavila vidljivost da se ne vidi
							i++;
						}
					}
				} else {
					// Postavlja vidljivost stavke na none da se ne vidi ako se ne podudara sa zadatim tekstualnim unosom
					liArray[i].style.display = 'none';
					liArray[i].style.visibility = 'hidden';
				}
			}
		}
	}
	// ..................................................> END FUNCTIONS

	// =================================================================
	// L I F E  C Y C L E
	// =================================================================

	onMount(async () => {
		// RAJKO 07.10.2023. POCETAK
		//realData = await transformJSONPLANTABLE();
		realData = await transformJSON(fakeData);
		// RAJKO 07.10.2023. KRAJ

		//await getProducts();
		var div = document.querySelector('#DefaultProductsListContainer > ul');
		await generateHTMLFromJSON(realData, div);
		console.log('gotovo generisanje');
		// Strelice za otvaranje/zatvaranje grupa
		accordionChevrons = listContainer.querySelectorAll('img.AccChevron');

		// CheckBox-evi
		checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');

		// Event listeneri strelica za otvaranje/zatvaranje grupa
		for (const accChev of accordionChevrons) {
			accChev.addEventListener('click', (e) => {
				if (e.target.classList.contains('Expanded')) {
					collapseCategory(e.target);
					expandedChevrons = selectionStateInfo(listContainer).expandedChevrons;
					listContainer = listContainer; // Ovo je potrebno, da bi reaktivni izraz 'if (listContainer)...' u roditeljskoj komponenti <ProductListWindow/> izvršio
				} else {
					expandCategory(e.target);
					expandedChevrons = selectionStateInfo(listContainer).expandedChevrons;
					listContainer = listContainer; // Ovo je potrebno, da bi reaktivni izraz 'if (listContainer)...' u roditeljskoj komponenti <ProductListWindow/> izvršio
				}
			});
		}

		// Event listeneri check box-eva
		for (let x = 0; x < checkboxes.length; x++) {
			checkboxes[x].addEventListener('change', function (e) {
				//Postavljanje vrednosti dece

				// Parent node koji je potreban je <li>.
				// Moramo da koristimo .closest, jer se check box može nalaziti u okviru div.ChkBoxContainer, u slučaju...
				// ...da je check box ujedno i naslovni accordion item
				// let parentNode = this.parentNode;
				let parentNode = this.closest('li');

				// Pokupi sve check box-eve u okviru parent-a (dakle, pristupa se deci)
				// i postavi i na označenost, koju ima check box na koji se kliknulo
				const cbDescendants = parentNode.querySelectorAll('input[type="checkbox"]');
				for (let y = 0; y < cbDescendants.length; y++) {
					cbDescendants[y].checked = this.checked;
					cbDescendants[y].indeterminate = false;
					cbDescendants[y].classList.remove('Indeterminate');
				}

				while (['ul', 'li', 'div'].indexOf(parentNode.nodeName.toLowerCase()) >= 0) {
					// while (["ul", "li"].indexOf(parentNode.nodeName.toLowerCase()) >= 0) {

					//When used from a DOM API such as querySelector(), querySelectorAll(),
					//matches(), or Element.closest(), :scope matches the element on
					// which the method was called.

					if (parentNode.nodeName.toLowerCase() !== 'div') {
						let accordionHeader = false;

						// Ako je parentNode <ul>, on nema neposredno ispod sebe check box, niti div.Accordion,
						// stoga će mainCb biti null.

						// Ako je parentNode <li>, on može da bude običan <li> ili naslovni accordion item.

						// Ako je reč o običnom <li>...
						let mainCb = parentNode.querySelector(':scope > input[type="checkbox"]');

						// Ako je reč o <li> koji jeste ujedno i naslovni accordion item, prethodna selekcija je rezultovala
						// vrednošću null, zato ćemo pokušati da do check box-a dođemo na sledeći način (pogledati HTML strukturu):
						if (!mainCb) {
							mainCb = parentNode.querySelector(
								':scope > .Accordion .ChkBoxContainer > input[type="checkbox"]'
							);
							accordionHeader = true;
						}

						// Ako smo došli do check box-a čiji status treba da se ažurira, a taj check box nije onaj,
						// koji je inicirao ovaj odgovor na događaj change...
						if (mainCb && mainCb != this) {
							// ...taj check box će svakako poprimiti označenost koju ima check box koji je inicirao događaj,
							// dakle, biće označen ili neoznačen. Kod koji sledi treba da odluči da li je pri tome indeterminate.
							mainCb.checked = this.checked;

							// Moramo pokupiti sve checkbox-eve u okviru <li> u kojem se nalazi <li>
							// koji sadrži check box čiji status treba ažurirati. Neka se prvi <li> u daljem tekstu
							// objašnjenja zove "roditeljski <li>"
							let mainCbChildren;

							// Ako je reč o check box-u koji je ujedno i naslovni accordion item, do roditeljskog <li> se dolazi...
							// ...sa tri parenta: prvi je div.ChkBoxContainer, drugi je div.Accordion, a tek je treci
							if (accordionHeader) {
								mainCbChildren =
									mainCb.parentNode.parentNode.parentNode.querySelectorAll(
										'input[type="checkbox"]'
									);
							}
							// ...inače, ako je reč o "običnom" <li>, on se svakako nalazi jedan nivo ispod u roditeljskom <li>,
							// pa je potreban samo jedan parent.
							else {
								mainCbChildren = mainCb.parentNode.querySelectorAll('input[type="checkbox"]');
							}

							// Treba da proverimo koliko checkbox-eva sadrži roditeljski <li>, uključujući i onaj,
							// čiju označenost ažuriramo...
							const numTotal = mainCbChildren.length;

							// ...kao i to, koliko od tih check box-eva je selektovano.
							let numChecked = 0;
							for (let z = 0; z < mainCbChildren.length; z++) {
								numChecked += mainCbChildren[z].checked;
							}

							// Ako je svaki check box u okviru roditeljskog <li> selektovan,
							// <li> čiju označenost ažuriramo će biti čekiran...
							if (numTotal === numChecked) {
								mainCb.indeterminate = false;
								mainCb.classList.remove('Indeterminate');
								mainCb.checked = true;
							} else {
								// ...ako niti jedan check box nije označen,
								// check box čiju označenost ažuriramo neće biti označen,...
								if (numChecked === 0) {
									mainCb.indeterminate = false;
									mainCb.classList.remove('Indeterminate');
									mainCb.checked = false;
								}
								// ...odnosno, ako je broj označenih check box-eva veći od nule,
								// ali je manji od ukupnog broja check box-eva, check box čiju označenost
								// ažuriramo poprima klasu .Indeterminate.
								else {
									mainCb.indeterminate = true;
									mainCb.classList.add('Indeterminate');
									mainCb.checked = false;
								}
							}
						}
					}

					parentNode = parentNode.parentNode;

					// Ako je roditelj div klase .ChkBoxContainer ili .Accordion, treba dalje 'ići na gore',
					// u suprotnom, treba prekinuti traženje roditelja
					if (
						parentNode.nodeName.toLowerCase() === 'div' &&
						!parentNode.classList.contains('ChkBoxContainer') &&
						!parentNode.classList.contains('Accordion')
					) {
						selectedProductsCount = selectionStateInfo(listContainer).numberOfSelectedProducts;
						break;
					}
				}
			});
		}
	});

	// .................................................> END LIFE CYCLE

	// =================================================================
	// R E A C T I V E   S T A T E M E N T S
	// =================================================================
	//$: {
	// --
	//}
	// .........................................> END REACTIVE STATEMENS

	// Rajko 26.08.2023.
	// var div;
	// generateHTMLFromJSON(realData, div);
	async function generateHTMLFromJSON(data, parentElement) {
		// parentElement = document.getElementById('DefaultProductsListContainer');
		//console.log(parentElement);

		if (data) {
			//console.log(data);
			//Object.entries(item)[0] - vraca property,value od prvog property-ja
			//Object.keys(item)[0] - vraca property od prvog property-ja
			//Object.values(item)[0] - vraca value od prvog property-ja
			data.forEach((item) => {
				let listItem = document.createElement('li');
				if (item._children) {
					if (item._children.length > 0) {
						listItem.innerHTML = `<div class="Accordion">
				<img src=${Chevron} alt="" class="AccChevron Expanded" />
				<div class="ChkBoxContainer">
					<input type="checkbox" name="${Object.entries(item)[0]}" id="${Object.entries(item)[0]}" />
					<label for="${Object.entries(item)[0]}">${
							Object.keys(item)[0] + ' ' + Object.values(item)[0]
						}</label>
				</div>
			</div>`;
						let innerList = document.createElement('ul');
						listItem.appendChild(innerList);
						parentElement.appendChild(listItem);
						generateHTMLFromJSON(item._children, innerList);
					}
				} else {
					listItem.innerHTML = `<input type="checkbox" name="${Object.entries(item)[0]}" id="${
						Object.entries(item)[0]
					}" class="Leaf" />
					<label for="${Object.entries(item)[0]}">${item.productName}</label>`;
					parentElement.appendChild(listItem);
				}
				// 	listItem.innerHTML = `<div class="Accordion">
				// 	<img src=${Chevron} alt="" class="AccChevron Expanded" />
				// 	<div class="ChkBoxContainer">
				// 		<input type="checkbox" name="tall" id="tall" />
				// 		<label for="tall">${item[Object.keys(item)[0]]}</label>
				// 	</div>
				// </div>`;
				// if (item._children) {
				// 	if (item._children.length > 0) {
				// 		let innerList = document.createElement('ul');
				// 		listItem.appendChild(innerList);
				// 	}
				// }
				// parentElement.appendChild(listItem);
			});
		}

		// KOD KOJI NE VALJA, GENERISAO GA ĆET ĐI PI TI
		// if (Array.isArray(data)) {
		// 	console.log(data);
		// 	data.forEach((item) => {
		// 		const listItem = document.createElement('li');
		// 		console.log(item);
		// 		 if (item.Accordion) {
		// 			const accordion = document.createElement('div');
		// 			accordion.className = 'Accordion';

		// 			const chevron = document.createElement('img');
		// 			chevron.src = item.Accordion.src;
		// 			chevron.alt = '';
		// 			chevron.className = 'AccChevron Expanded';

		// 			const chkBoxContainer = document.createElement('div');
		// 			chkBoxContainer.className = 'ChkBoxContainer';

		// 			const checkbox = document.createElement('input');
		// 			checkbox.type = 'checkbox';
		// 			checkbox.name = item.name;
		// 			checkbox.id = item.id;

		// 			const label = document.createElement('label');
		// 			label.htmlFor = item.id;
		// 			label.textContent = item.label;

		// 			chkBoxContainer.appendChild(checkbox);
		// 			chkBoxContainer.appendChild(label);

		// 			accordion.appendChild(chevron);
		// 			accordion.appendChild(chkBoxContainer);

		// 			listItem.appendChild(accordion);
		// 			console.log(item);
		// 			if (item._children.length > 0) {
		// 				const nestedList = document.createElement('ul');
		// 				generateHTMLFromJSON(item._children, nestedList);
		// 				listItem.appendChild(nestedList);
		// 			}
		// 		} else {
		// 			console.log('cao');
		// 			const checkbox = document.createElement('input');
		// 			checkbox.type = 'checkbox';
		// 			checkbox.name = item.name;
		// 			checkbox.id = item.id;
		// 			checkbox.className = 'Leaf';

		// 			const label = document.createElement('label');
		// 			label.htmlFor = item.id;
		// 			// label.textContent = item.label;
		// 			label.textContent = item.fild;

		// 			listItem.appendChild(checkbox);
		// 			listItem.appendChild(label);
		// 		}

		// 		parentElement.appendChild(listItem);
		// 	});
		// }
	}

	var realData = [];

	// function transformJSON(originalData) {
	// 	const transformedData = [];
	// 	// console.log(originalData);
	// 	for (const product of originalData) {
	// 		let currentLevel = transformedData;

	// 		// Rajko pocetak sortiranja
	// 		let atributi = [{ 'prodAttrGrpName': 'Rektifikacija' }, { 'prodAttrGrpName': 'Mesto ugradnje' }];

	// 		function customSortJSONObjects(arrToSort, sortingOrderArr, property) {
	// 			const indexMap = {};

	// 			sortingOrderArr.forEach((obj, index) => {
	// 				indexMap[obj[property]] = index;
	// 			});

	// 			arrToSort.sort((a, b) => {
	// 				const indexA = indexMap[a[property]] !== undefined ? indexMap[a[property]] : sortingOrderArr.length;
	// 				const indexB = indexMap[b[property]] !== undefined ? indexMap[b[property]] : sortingOrderArr.length;

	// 				return indexA - indexB;
	// 			});

	// 			return arrToSort;
	// 		}

	// 		product.productAttributes = customSortJSONObjects(product.productAttributes, atributi, 'prodAttrGrpName');

	// 		// Rajko kraj sortiranja

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

	function transformJSON(originalData) {
		const transformedData = [];

		for (const product of originalData) {
			let currentLevel = transformedData;

			//Rajko pocetak sortiranja
			let atributi = [{ prodAttrGrpName: 'Rektifikacija' }, { prodAttrGrpName: 'Mesto ugradnje' }];

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

			// const productClassAttr = product.productClassName.find(attr => attr.productClassName === 'productClassName');
			// const productClassValue = productClassAttr ? productClassAttr : 'Other';

			// let existingNode = currentLevel.find(node => node['productClassName'] === productClassName);

			// if (!existingNode) {
			//     existingNode = { productClassName: productClassName, _children: [] };
			//     currentLevel.push(existingNode);
			// }

			// currentLevel = existingNode._children;

			const attrName = 'Klasa proizvoda';
			const attrValue = product.productClassName;

			let existingNode = currentLevel.find((node) => node[attrName] === attrValue);

			if (!existingNode) {
				existingNode = { [attrName]: attrValue, _children: [] };
				currentLevel.push(existingNode);
			}

			currentLevel = existingNode._children;

			// for (const attr of product.productAttributes) {
			//     if (attr.prodAttrGrpName !== 'productClass') {
			//         const attrName = attr.prodAttrGrpName;
			//         const attrValue = attr.prodAttrAbbrev;

			//         let attrNode = currentLevel.find(node => node[attrName] === attrValue);

			//         if (!attrNode) {
			//             attrNode = { [attrName]: attrValue, _children: [] };
			//             currentLevel.push(attrNode);
			//         }

			//         currentLevel = attrNode._children;
			//     }
			// }

			for (const attr of product.productAttributes) {
				// const attrName = attr.prodAttrName;
				const attrName = attr.prodAttrGrpName;
				const attrValue = attr.prodAttrAbbrev;

				let existingNode = currentLevel.find((node) => node[attrName] === attrValue);

				if (!existingNode) {
					existingNode = { productName:attr.prodAttrName , [attrName]: attrValue, _children: [] };
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

	// GET REQUEST
	async function getProducts() {
		await axios
			.get('http://100.96.1.7:8009/api/products')
			.then((response) => {
				// Handle the response
				console.log(response.data);
				realData = transformJSON(response.data);
				//realData = transformJSON(fakeData);
				//realData = response.data;
				console.log(realData);
			})
			.catch((error) => {
				// Handle the error
				console.log(error);
			});
	}

	let fakeData = [
		{
			productId: 1,
			productName: 'BOTTICINO 20X60',
			productDesc: null,
			productClassId: 1,
			productClassName: 'Kerami?ke plo?ice',
			productAttributes: [
				{
					prodAttrId: 2,
					prodAttrName: 'Zid',
					prodAttrAbbrev: 'ZID',
					prodAttrGrpId: 1,
					prodAttrGrpName: 'Mesto ugradnje',
					productId: 1
				},
				{
					prodAttrId: 8,
					prodAttrName: '30X60',
					prodAttrAbbrev: '30X60',
					prodAttrGrpId: 2,
					prodAttrGrpName: 'Format',
					productId: 1
				},
				{
					prodAttrId: 12,
					prodAttrName: 'Da',
					prodAttrAbbrev: 'DA',
					prodAttrGrpId: 3,
					prodAttrGrpName: 'Rektifikacija',
					productId: 1
				},
				{
					prodAttrId: 21,
					prodAttrName: 'EAGLE',
					prodAttrAbbrev: 'EAGLE',
					prodAttrGrpId: 4,
					prodAttrGrpName: 'Serija',
					productId: 1
				}
			],
			productCategories: [
				{
					prodCategId: 14,
					prodCategName: '15X60',
					parentCategory: {
						prodCategId: 2,
						prodCategName: 'Zid',
						parentCategory: null,
						prodCategTypeId: 1,
						prodCategTypeName: null
					},
					prodCategTypeId: 2,
					prodCategTypeName: 'Format'
				}
			]
		},
		{
			productId: 2,
			productName: 'BOTTICINO DIAMONDS 20X60',
			productDesc: null,
			productClassId: 1,
			productClassName: 'Cement',
			productAttributes: [
				{
					prodAttrId: 2,
					prodAttrName: 'Zid',
					prodAttrAbbrev: 'ZID',
					prodAttrGrpId: 1,
					prodAttrGrpName: 'Mesto ugradnje',
					productId: 2
				},
				{
					prodAttrId: 4,
					prodAttrName: '60X60',
					prodAttrAbbrev: '60X60',
					prodAttrGrpId: 2,
					prodAttrGrpName: 'Format',
					productId: 2
				},
				{
					prodAttrId: 13,
					prodAttrName: 'Ne',
					prodAttrAbbrev: 'NE',
					prodAttrGrpId: 3,
					prodAttrGrpName: 'Rektifikacija',
					productId: 2
				},
				{
					prodAttrId: 29,
					prodAttrName: 'KINGSTONE',
					prodAttrAbbrev: 'KINGSTONE',
					prodAttrGrpId: 4,
					prodAttrGrpName: 'Serija',
					productId: 2
				}
			],
			productCategories: [
				{
					prodCategId: 19,
					prodCategName: '33X33',
					parentCategory: {
						prodCategId: 2,
						prodCategName: 'Zid',
						parentCategory: null,
						prodCategTypeId: 1,
						prodCategTypeName: null
					},
					prodCategTypeId: 2,
					prodCategTypeName: 'Format'
				}
			]
		},
		{
			productId: 3,
			productName: 'BOTTICINO PETALS 3D 20X60',
			productDesc: null,
			productClassId: 1,
			productClassName: 'Kerami?ke plo?ice',
			productAttributes: [
				{
					prodAttrId: 1,
					prodAttrName: 'Pod',
					prodAttrAbbrev: 'POD',
					prodAttrGrpId: 1,
					prodAttrGrpName: 'Mesto ugradnje',
					productId: 3
				},
				{
					prodAttrId: 4,
					prodAttrName: '60X60',
					prodAttrAbbrev: '60X60',
					prodAttrGrpId: 2,
					prodAttrGrpName: 'Format',
					productId: 3
				},
				{
					prodAttrId: 13,
					prodAttrName: 'Ne',
					prodAttrAbbrev: 'NE',
					prodAttrGrpId: 3,
					prodAttrGrpName: 'Rektifikacija',
					productId: 3
				},
				{
					prodAttrId: 29,
					prodAttrName: 'KINGSTONE',
					prodAttrAbbrev: 'KINGSTONE',
					prodAttrGrpId: 4,
					prodAttrGrpName: 'Serija',
					productId: 3
				}
			],
			productCategories: [
				{
					prodCategId: 15,
					prodCategName: '20X60',
					parentCategory: {
						prodCategId: 2,
						prodCategName: 'Zid',
						parentCategory: null,
						prodCategTypeId: 1,
						prodCategTypeName: null
					},
					prodCategTypeId: 2,
					prodCategTypeName: 'Format'
				}
			]
		},
		{
			productId: 4,
			productName: 'EVOLUTION BEIGE 20X60',
			productDesc: null,
			productClassId: 1,
			productClassName: 'Kerami?ke plo?ice',
			productAttributes: [
				{
					prodAttrId: 1,
					prodAttrName: 'Pod',
					prodAttrAbbrev: 'POD',
					prodAttrGrpId: 1,
					prodAttrGrpName: 'Mesto ugradnje',
					productId: 4
				},
				{
					prodAttrId: 11,
					prodAttrName: '33X33',
					prodAttrAbbrev: '33X33',
					prodAttrGrpId: 2,
					prodAttrGrpName: 'Format',
					productId: 4
				},
				{
					prodAttrId: 13,
					prodAttrName: 'Ne',
					prodAttrAbbrev: 'NE',
					prodAttrGrpId: 3,
					prodAttrGrpName: 'Rektifikacija',
					productId: 4
				},
				{
					prodAttrId: 27,
					prodAttrName: 'JUPITER',
					prodAttrAbbrev: 'JUPITER',
					prodAttrGrpId: 4,
					prodAttrGrpName: 'Serija',
					productId: 4
				}
			],
			productCategories: [
				{
					prodCategId: 3,
					prodCategName: '25X75',
					parentCategory: {
						prodCategId: 1,
						prodCategName: 'Pod',
						parentCategory: null,
						prodCategTypeId: 1,
						prodCategTypeName: null
					},
					prodCategTypeId: 2,
					prodCategTypeName: 'Format'
				}
			]
		},
		{
			productId: 5,
			productName: 'EVOLUTION DARK GREY 20X60',
			productDesc: null,
			productClassId: 1,
			productClassName: 'Cement',
			productAttributes: [
				{
					prodAttrId: 1,
					prodAttrName: 'Pod',
					prodAttrAbbrev: 'POD',
					prodAttrGrpId: 1,
					prodAttrGrpName: 'Mesto ugradnje',
					productId: 5
				},
				{
					prodAttrId: 7,
					prodAttrName: '20X60',
					prodAttrAbbrev: '20X60',
					prodAttrGrpId: 2,
					prodAttrGrpName: 'Format',
					productId: 5
				},
				{
					prodAttrId: 13,
					prodAttrName: 'Ne',
					prodAttrAbbrev: 'NE',
					prodAttrGrpId: 3,
					prodAttrGrpName: 'Rektifikacija',
					productId: 5
				},
				{
					prodAttrId: 35,
					prodAttrName: 'MERCURY',
					prodAttrAbbrev: 'MERCURY',
					prodAttrGrpId: 4,
					prodAttrGrpName: 'Serija',
					productId: 5
				}
			],
			productCategories: [
				{
					prodCategId: 18,
					prodCategName: '45X45',
					parentCategory: {
						prodCategId: 2,
						prodCategName: 'Zid',
						parentCategory: null,
						prodCategTypeId: 1,
						prodCategTypeName: null
					},
					prodCategTypeId: 2,
					prodCategTypeName: 'Format'
				}
			]
		}
	];

	// Rajko kraj 26.08.2023.

	/******************************************************************/
	/******************************************************************/
	//                           ZA TABELU                            //
	/******************************************************************/
	/******************************************************************/

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

	async function getProductsAPI() {
		return new Promise((resolve, reject) => {
			// Zameniti konkretnim vrednostima, ručno
			//let url = `http://100.96.1.7:8009/api/MasterForecasts/${planInfo.masterForecast.masterForecastId}/salesAllocs/${planInfo.salesAllocId}/keyaccounts/${planInfo.keyAccountId}/territories/${planInfo.territoryId}/products`;
			let url = `http://100.96.1.7:8009/api/MasterForecasts/1/salesAllocs/6/keyaccounts/9/territories/15/products`;
			axios
				.get(url)
				.then((res) => {
					console.log('products')
					console.log(res.data);
					resolve(res.data);
				})
				.catch((err) => {
					console.error(err);
					reject(false);
				});
		});
	}

	//RAJKO 07.10.2023. POKUSAJ PRAVLJENJA FUNKCIJE ZA PREPRAVKU JSONA ZA TABELU
	async function transformJSONPLANTABLE() {
		let products = await getProductsAPI(); // Pokupiti sve proizvode koji se nalaze tabeli
		let values = await getValues(); // Pokupiti sve vrednosti ćelija
		console.log('proiyvodi');
		console.log(products);
		//console.log(values);
		for (const pr of products) {
			for (const val of values) {
				if (pr.productId === val.productId) {
					// console.log('pr.productId:', pr.productId);
					// console.log('val.productId:', val.productId);
					const propertyName = '2024M001-valuePlan'; // Property name to add
					const sourcePropertyName = '2024M001-valuePlan'; // Property name in the source object
					const valPl = 'valuePlan';
					// console.log(val);
					// console.log(val.valuePlan);
					// pr[valPl] = val[valuePlan];
					// console.log(pr[valPl]);
					let planLY = val.planPeriodId + '-' + 'valuePlanLY';
					let realLY = val.planPeriodId + '-' + 'valueRealLY';
					let plan = val.planPeriodId + '-' + 'valuePlan';
					let real = val.planPeriodId + '-' + 'valueReal';
					pr[planLY] = val.valuePlanLY;
					pr[realLY] = val.valueRealLY;
					pr[plan] = val.valuePlan;
					pr[real] = val.valueReal;
					// pr[planLY] = val[planLY];
					// pr[realLY] = val[realLY];
					// pr[plan] = val[plan];
					// pr[real] = val[real];
					// pr[planLY] = val[valuePlanLY];
					// pr[realLY] = val[valueRealLy];
					// pr[plan] = val[valuePlan];
					// pr[real] = val[valueReal];
					// pr = {
					// 	planLY: val.valuePlanLY,
					// 	realLY: val.valueRealLy,
					// 	plan: val.valuePlan,
					// 	real: val.valueReal
					// };
					// pr = {
					// 	'2024M001-valuePlanLY': val.valuePlanLY,
					// 	'2024M001-valueRealLY': val.valueRealLy,
					// 	'2024M001-valuePlan': val.valuePlan,
					// 	'2024M001-valueReal': val.valueReal
					// };

					//break;
				}
			}
		}
		console.log(products);
		const originalData = products;

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

			// currentLevel.push({
			// 	productId: product.productId,
			// 	productName: product.productName,
			// 	productDesc: product.productDesc,
			// 	productClassId: product.productClassId,
			// 	productClassName: product.productClassName
			// });

			currentLevel.push(product);

			// Sort the products at the lowest level by name (product name)
			currentLevel.sort((a, b) => a.productName.localeCompare(b.productName));
		}

		return transformedData;
	}
</script>

<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ---------------------------------------------      H T M L      --------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->

<div id="SearchBar">
	<Search
		placeholder=""
		on:input={(e) => {
			filterProducts(e.target.value);
		}}
		on:clear={() => {
			filterProducts('');
		}}
	/>
</div>
<div id="DefaultProductsListContainer" bind:this={listContainer}>
	<ul>
		<!-- <li>
			<div class="Accordion">
				<img src={Chevron} alt="" class="AccChevron Expanded" />
				<div class="ChkBoxContainer">
					<input type="checkbox" name="tall" id="tall" />
					<label for="tall">Tall Things Tall ThingsTall Things</label>
				</div>
			</div>
			<ul>
				<li>
					<input type="checkbox" name="tall-1" id="tall-1" class="Leaf" />
					<label for="tall-1">Buildings</label>
				</li>
				<li>
					<div class="Accordion">
						<img src={Chevron} alt="" class="AccChevron Expanded" />
						<div class="ChkBoxContainer">
							<input type="checkbox" name="tall-2" id="tall-2" />
							<label for="tall-2">Giants</label>
						</div>
					</div>

					<ul>
						<li>
							<input type="checkbox" name="tall-2-1" id="tall-2-1" class="Leaf" />
							<label for="tall-2-1">Andre</label>
						</li>
						<li>
							<input type="checkbox" name="tall-2-2" id="tall-2-2" class="Leaf" />
							<label for="tall-2-2">Paul Bunyan</label>
						</li>
						<li>
							<div class="Accordion">
								<img src={Chevron} alt="" class="AccChevron Expanded" />
								<div class="ChkBoxContainer">
									<input type="checkbox" name="tall-2dddf" id="tall-2dddf" />
									<label for="tall-2dddf">Giants</label>
								</div>
							</div>

							<ul>
								<li>
									<input type="checkbox" name="tall-2-2-2cccd" id="tall-2-2-2cccd" class="Leaf" />
									<label for="tall-2-2-2cccd">Paul Bunyan 1</label>
								</li>
								<li>
									<input type="checkbox" name="tall-2-2-2ccc" id="tall-2-2-2ccc" class="Leaf" />
									<label for="tall-2-2-2ccc">Paul Bunyan 2</label>
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li>
					<input type="checkbox" name="tall-3" id="tall-3" class="Leaf" />
					<label for="tall-3">Two sandwiches</label>
				</li>
			</ul>
		</li>
		<li>
			<div class="Accordion">
				<img src={Chevron} alt="" class="AccChevron Expanded" />
				<div class="ChkBoxContainer">
					<input type="checkbox" name="short" id="short" />
					<label for="short">Short Things</label>
				</div>
			</div>
			<ul>
				<li>
					<input type="checkbox" name="short-1" id="short-1" class="Leaf" />
					<label for="short-1">Smurfs</label>
				</li>
				<li>
					<input type="checkbox" name="short-2" id="short-2" class="Leaf" />
					<label for="short-2">Mushrooms</label>
				</li>
				<li>
					<input type="checkbox" name="short-3" id="short-3" class="Leaf" />
					<label for="short-3">One Sandwich</label>
				</li>
			</ul>
		</li>
		<li>
			<div class="Accordion">
				<img src={Chevron} alt="" class="AccChevron Expanded" />
				<div class="ChkBoxContainer">
					<input type="checkbox" name="tallx" id="tallx" />
					<label for="tallx">Tall Things Tall ThingsTall Things</label>
				</div>
			</div>
			<ul>
				<li>
					<input type="checkbox" name="tall-1x" id="tall-1x" class="Leaf" />
					<label for="tall-1x">Buildings</label>
				</li>
				<li>
					<div class="Accordion">
						<img src={Chevron} alt="" class="AccChevron Expanded" />
						<div class="ChkBoxContainer">
							<input type="checkbox" name="tall-2x" id="tall-2x" />
							<label for="tall-2x">Giants</label>
						</div>
					</div>

					<ul>
						<li>
							<input type="checkbox" name="tall-2-1x" id="tall-2-1x" class="Leaf" />
							<label for="tall-2-1x">Andre</label>
						</li>
						<li>
							<input type="checkbox" name="tall-2-2x" id="tall-2-2x" class="Leaf" />
							<label for="tall-2-2x">Paul Bunyan</label>
						</li>
					</ul>
				</li>
				<li>
					<input type="checkbox" name="tall-3x" id="tall-3x" class="Leaf" />
					<label for="tall-3x">Two sandwiches</label>
				</li>
			</ul>
		</li>
		<li>
			<div class="Accordion">
				<img src={Chevron} alt="" class="AccChevron Expanded" />
				<div class="ChkBoxContainer">
					<input type="checkbox" name="short" id="shortx" />
					<label for="shortx">Short Things</label>
				</div>
			</div>
			<ul>
				<li>
					<input type="checkbox" name="short-1" id="short-1x" class="Leaf" />
					<label for="short-1x">Smurfs</label>
				</li>
				<li>
					<input type="checkbox" name="short-2" id="short-2x" class="Leaf" />
					<label for="short-2x">Mushrooms</label>
				</li>
				<li>
					<input type="checkbox" name="short-3" id="short-3x" class="Leaf" />
					<label for="short-3x">One Sandwich</label>
				</li>
			</ul>
		</li>
		<li>
			<div class="Accordion">
				<img src={Chevron} alt="" class="AccChevron Expanded" />
				<div class="ChkBoxContainer">
					<input type="checkbox" name="shortr" id="shortr" />
					<label for="shortr">Short Things</label>
				</div>
			</div>
			<ul>
				<li>
					<input type="checkbox" name="short-1r" id="short-1r" class="Leaf" />
					<label for="short-1r">Smurfs</label>
				</li>
				<li>
					<input type="checkbox" name="short-2r" id="short-2r" class="Leaf" />
					<label for="short-2r">Mushrooms</label>
				</li>
				<li>
					<input type="checkbox" name="short-3r" id="short-3r" class="Leaf" />
					<label for="short-3r">One Sandwich</label>
				</li>
			</ul>
		</li>
		<li>
			<div class="Accordion">
				<img src={Chevron} alt="" class="AccChevron Expanded" />
				<div class="ChkBoxContainer">
					<input type="checkbox" name="tallxx" id="tallxx" />
					<label for="tallxx">Tall Things Tall ThingsTall Things</label>
				</div>
			</div>
			<ul>
				<li>
					<input type="checkbox" name="tall-1xx" id="tall-1xx" class="Leaf" />
					<label for="tall-1xx">Buildings</label>
				</li>
				<li>
					<div class="Accordion">
						<img src={Chevron} alt="" class="AccChevron Expanded" />
						<div class="ChkBoxContainer">
							<input type="checkbox" name="tall-2xx" id="tall-2xx" />
							<label for="tall-2xx">Giants</label>
						</div>
					</div>

					<ul>
						<li>
							<input type="checkbox" name="tall-2-1xx" id="tall-2-1xx" class="Leaf" />
							<label for="tall-2-1xx">Andre</label>
						</li>
						<li>
							<input type="checkbox" name="tall-2-2xx" id="tall-2-2xx" class="Leaf" />
							<label for="tall-2-2xx">Paul Bunyan</label>
						</li>
					</ul>
				</li>
				<li>
					<input type="checkbox" name="tall-3xx" id="tall-3xx" class="Leaf" />
					<label for="tall-3xx">Two sandwiches</label>
				</li>
			</ul>
		</li>
		<li>
			<div class="Accordion">
				<img src={Chevron} alt="" class="AccChevron Expanded" />
				<div class="ChkBoxContainer">
					<input type="checkbox" name="tallxxd" id="tallxxd" />
					<label for="tallxxd">Tall Things Tall ThingsTall Things</label>
				</div>
			</div>
			<ul>
				<li>
					<input type="checkbox" name="tall-1xxd" id="tall-1xxd" class="Leaf" />
					<label for="tall-1xxd">Buildings</label>
				</li>
				<li>
					<div class="Accordion">
						<img src={Chevron} alt="" class="AccChevron Expanded" />
						<div class="ChkBoxContainer">
							<input type="checkbox" name="tall-2xxd" id="tall-2xxd" />
							<label for="tall-2xxd">Giants</label>
						</div>
					</div>

					<ul>
						<li>
							<input type="checkbox" name="tall-2-1xxd" id="tall-2-1xxd" class="Leaf" />
							<label for="tall-2-1xxd">Andre</label>
						</li>
						<li>
							<input type="checkbox" name="tall-2-2xxd" id="tall-2-2xxd" class="Leaf" />
							<label for="tall-2-2xxd">Paul Bunyan</label>
						</li>
					</ul>
				</li>
				<li>
					<input type="checkbox" name="tall-3xxd" id="tall-3xxd" class="Leaf" />
					<label for="tall-3xxd">Two sandwiches</label>
				</li>
			</ul>
		</li> -->
	</ul>
</div>

<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ---------------------------------------------      C  S  S      --------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------- -->

<style>
	#SearchBar {
		padding: 20px;
		background-color: gray;
	}

	:global(#DefaultProductsListContainer input[type='checkbox'].Indeterminate + label::before) {
		content: '';
		position: relative;
		top: 0;
		width: 20px;
		height: 20px;
		margin-right: 7px;
		background-size: 15px 15px;
		background-repeat: no-repeat;
		background-position: center center;
		flex-shrink: 0;
		background-image: url('indeterminate.svg');
	}

	:global(#DefaultProductsListContainer .HiddenCategory) {
		/* Rajko dodao !important */
		display: none !important;
	}

	:global(ul) {
		/* Rajko dodao !important */
		list-style: none !important;
		margin: 0px 0px;
		padding-left: 25px;
	}

	:global(li) {
		margin: 7px 0 7px 10px;
	}

	:global(.Accordion) {
		display: flex;
		margin-left: -25px !important;
	}

	:global(.AccChevron) {
		margin-right: 10px;
		width: 15px;
		height: 15px;
		transition: all 0.3s;
	}

	:global(.AccChevron.Expanded) {
		transform: rotate(180deg);
	}

	:global(input[type='checkbox']) {
		/* Rajko dodao !important */
		display: none !important;
	}

	:global(input[type='checkbox'] + label) {
		/* Rajko dodao !important */
		display: flex !important;
		align-items: flex-start;
		overflow: hidden;
	}

	:global(input[type='checkbox'] + label::before, input[type='checkbox']:checked + label::before) {
		content: '';
		position: relative;
		top: 0;
		width: 20px;
		height: 20px;
		margin-right: 7px;
		background-size: 15px 15px;
		background-repeat: no-repeat;
		background-position: center center;
		flex-shrink: 0;
	}

	:global(input[type='checkbox']:checked + label::before) {
		background-image: url('checked.svg');
	}

	:global(input[type='checkbox'] + label::before) {
		background-image: url('not-checked.svg');
	}
</style>
