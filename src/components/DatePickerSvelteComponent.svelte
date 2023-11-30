<script>
	import Flatpickr from 'svelte-flatpickr';
	import { onMount } from 'svelte';

	let roditelj = null;

	let selectedDates = [];
	let disabledDates = [new Date(Date.UTC(2023, 10, 5)).toISOString().split('T')[0]];

	onMount(() => {
		const inputBoxes = roditelj.querySelectorAll('input.flatpickr-input');
		for (const element of inputBoxes) {
			element.style.display = 'none';
		}
		let lastClickedDate = null;

		const datepicker = roditelj.querySelectorAll('.flatpickr-days');
		// const datepicker = roditelj.querySelector('.flatpickr-days');

		for (const element of datepicker) {
			//bio click, sada mousedown zbog deselektovanja
			element.addEventListener('mousedown', selectDatesFunction);
		}

		function selectDatesFunction(event) {
			//Uslov uveden da se ne desava izvrsenje dalje klika ako je datum onemogucen
			//event.button === 0 levi klik, event.button === 2 desni klik ili event.which === 1 levi klik, event.which === 2 srednji klik
			if (
				event.target.closest('.flatpickr-day') &&
				!event.target.classList.contains('flatpickr-disabled')
			) {
				const clickedDate = event.target.closest('.flatpickr-day');
				//const clickedDate = event.target;

				console.log(clickedDate.getAttribute('aria-label'));
				//event.shiftKey
				if (event.ctrlKey && selectedDates.length > 0 && lastClickedDate != null) {
					const dateString1 = lastClickedDate.getAttribute('aria-label');
					const dateArray1 = dateString1.split(' '); // Split the string into an array
					const month1 = dateArray1[0]; // Get the month part
					const day1 = parseInt(dateArray1[1].replace(',', '')); // Get the day part

					// Months are 0-indexed in JavaScript, so we need to convert the month name to a number.
					const months1 = [
						'January',
						'February',
						'March',
						'April',
						'May',
						'June',
						'July',
						'August',
						'September',
						'October',
						'November',
						'December'
					];
					const monthIndex1 = months1.indexOf(month1);
					let date = new Date(Date.UTC(2023, monthIndex1, day1));
					date.setHours(12, 0, 0, 0);

					const dateString = clickedDate.getAttribute('aria-label');
					const dateArray = dateString.split(' '); // Split the string into an array
					const month = dateArray[0]; // Get the month part
					const day = parseInt(dateArray[1].replace(',', '')); // Get the day part

					// Months are 0-indexed in JavaScript, so we need to convert the month name to a number.
					const months = [
						'January',
						'February',
						'March',
						'April',
						'May',
						'June',
						'July',
						'August',
						'September',
						'October',
						'November',
						'December'
					];
					const monthIndex = months.indexOf(month);

					let endDate = new Date(Date.UTC(2023, monthIndex, day));
					endDate.setHours(12, 0, 0, 0);
					console.log('end ', endDate);
					console.log('start ',date);
					// console.log(disabledDates[0]);
					// console.log(date.toISOString().split('T')[0]);
					if (date > endDate) {
						if (event.which === 1) {
							// -1 da ne selektuje trenutno oznacen datum jer je vec oznacen
							//date.setDate(date.getDate() - 1);
							while (date >= endDate) {
								if (
									disabledDates.includes(date.toISOString().split('T')[0]) === false &&
									selectedDates.includes(date.toISOString().split('T')[0]) === false
								) {
									selectedDates = [...selectedDates, date.toISOString().split('T')[0]];
								}
								date.setDate(date.getDate() - 1);
							}
						} else if (event.which === 2) {
							// -1 ovde nije potreban jer se skida i taj kliknuti datum
							while (date >= endDate) {
								if (
									disabledDates.includes(date.toISOString().split('T')[0]) === false &&
									selectedDates.includes(date.toISOString().split('T')[0]) === true
								) {
									selectedDates = selectedDates.filter(
										(item) => item !== date.toISOString().split('T')[0]
									);
								}
								date.setDate(date.getDate() - 1);
							}
						}
					} else {
						if (event.which === 1) {
							// +1 da ne selektuje trenutno oznacen datum jer je vec oznacen
							//date.setDate(date.getDate() + 1);
							while (date <= endDate) {
								if (
									disabledDates.includes(date.toISOString().split('T')[0]) === false &&
									selectedDates.includes(date.toISOString().split('T')[0]) === false
								) {
									selectedDates = [...selectedDates, date.toISOString().split('T')[0]];
								}
								date.setDate(date.getDate() + 1);
							}
						} else if (event.which === 2) {
							// +1 nije potreban jer se skida i taj kliknuti datum
							while (date <= endDate) {
								if (
									disabledDates.includes(date.toISOString().split('T')[0]) === false &&
									selectedDates.includes(date.toISOString().split('T')[0]) === true
								) {
									selectedDates = selectedDates.filter(
										(item) => item !== date.toISOString().split('T')[0]
									);
								}
								date.setDate(date.getDate() + 1);
							}
						}
					}

					console.log(selectedDates);
				} else if (clickedDate) {
					const dateString = clickedDate.getAttribute('aria-label');
					const dateArray = dateString.split(' '); // Split the string into an array
					const month = dateArray[0]; // Get the month part
					const day = parseInt(dateArray[1].replace(',', '')); // Get the day part

					// Months are 0-indexed in JavaScript, so we need to convert the month name to a number.
					const months = [
						'January',
						'February',
						'March',
						'April',
						'May',
						'June',
						'July',
						'August',
						'September',
						'October',
						'November',
						'December'
					];
					const monthIndex = months.indexOf(month);

					const date = new Date(Date.UTC(2023, monthIndex, day));
					date.setHours(12,0,0,0);
					if (selectedDates.includes(date.toISOString().split('T')[0]) === false) {
						selectedDates = [...selectedDates, date.toISOString().split('T')[0]];
					} else {
						selectedDates = selectedDates.filter(
							(item) => item !== date.toISOString().split('T')[0]
						);
					}
					console.log(selectedDates);
				}

				lastClickedDate = clickedDate;
			}
		}
	});
</script>

<div bind:this={roditelj}>
	<div style="display: flex;">
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 0, 1),
				maxDate: new Date(2023, 0, 31)
			}}
		/>
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 1, 1),
				maxDate: new Date(2023, 1, 28)
			}}
		/>
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 2, 1),
				maxDate: new Date(2023, 2, 31)
			}}
		/>
	</div>
	<div style="display: flex;">
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 3, 1),
				maxDate: new Date(2023, 3, 30)
			}}
		/>
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 4, 1),
				maxDate: new Date(2023, 4, 31)
			}}
		/>
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 5, 1),
				maxDate: new Date(2023, 5, 30)
			}}
		/>
	</div>
	<div style="display: flex;">
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 6, 1),
				maxDate: new Date(2023, 6, 31)
			}}
		/>
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 7, 1),
				maxDate: new Date(2023, 7, 31)
			}}
		/>
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 8, 1),
				maxDate: new Date(2023, 8, 30)
			}}
		/>
	</div>
	<div style="display: flex;">
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 9, 1),
				maxDate: new Date(2023, 9, 31)
			}}
		/>
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 10, 1),
				maxDate: new Date(2023, 10, 30)
			}}
		/>
		<Flatpickr
			value={selectedDates}
			options={{
				mode: 'multiple',
				dateFormat: 'Y-m-d',
				disable: disabledDates,
				inline: true,
				minDate: new Date(2023, 11, 1),
				maxDate: new Date(2023, 11, 31)
			}}
		/>
	</div>
</div>
