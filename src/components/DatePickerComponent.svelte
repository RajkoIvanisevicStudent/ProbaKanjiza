<script>
	import { onMount } from 'svelte';
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';
	let additionalFlatPickerProps = {
		// inline: true,
		// range: true,
		// allowInput: false,
		// inline: true,
		disable: [
			// function (date) {
			// 	// return true to disable
			// 	return date.getDay() === 0 || date.getDay() === 6;
			// },
			// function (date) {
			// 	return date.getDay() === 1 && date.getDate() <= 7;
			// }
		]
	};
	let isInvalid = false;
	let invalidText = 'Lose';
	let isDisabled = false;
	let dateText;
	let initialDate;
	let minimumDate = new Date(2023, 10, 1);
	let maximumDate = new Date(2023, 10, 30);

	// onMount(() => {
	// 	// Initialize the datepicker
	// 	const inputElement = document.getElementById('DatePickerComponent'); // Replace with the actual input element

	// 	// // Disable weekends (Saturdays and Sundays)
	// 	// inputElement.setDisabled((date) => {
	// 	// 	const day = date.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
	// 	// 	return day === 0 || day === 6; // Disable if it's a Sunday (0) or Saturday (6)
	// 	// });

	//     inputElement.calendar.showMonthButtons = false;
	// });
</script>

<div style="display: flex;">
	<DatePicker
		id="DatePickerComponent12"
		flatpickrProps={additionalFlatPickerProps}
		size="xl"
		datePickerType="range"
		on:change={(e) => {
			// handleNewDate(e);
			console.log(e);
			const selectedDate = e.date;

			// Custom validation logic to check if the selected date is disabled
			if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
				// Handle the case where a disabled date is selected
				alert('This date is disabled.');
				// Optionally clear the selection
				//datePicker.clear();
			}
		}}
		value={initialDate}
		minDate={minimumDate}
		maxDate={maximumDate}
	>
		<DatePickerInput labelText="pocetni" invalid={isInvalid} {invalidText} disabled={isDisabled} />
		<DatePickerInput labelText="krajnji" invalid={isInvalid} {invalidText} disabled={isDisabled} />
	</DatePicker>

	<!-- <DatePicker
		id="DatePickerComponent1"
		flatpickrProps={additionalFlatPickerProps}
		size="xl"
		datePickerType="single"
		on:change={(e) => {
			// handleNewDate(e);
			console.log(e);
		}}
		value={initialDate}
		minDate={minimumDate}
		maxDate={maximumDate}
	>
		<DatePickerInput labelText={dateText} invalid={isInvalid} {invalidText} disabled={isDisabled} />
	</DatePicker>

	<DatePicker
		id="DatePickerComponent2"
		flatpickrProps={additionalFlatPickerProps}
		size="xl"
		datePickerType="single"
		on:change={(e) => {
			// handleNewDate(e);
			console.log(e);
		}}
		value={initialDate}
		minDate={minimumDate}
		maxDate={maximumDate}
	>
		<DatePickerInput labelText={dateText} invalid={isInvalid} {invalidText} disabled={isDisabled} />
	</DatePicker> -->
</div>
