/*
 * Counter
 */
document.addEventListener('DOMContentLoaded', () => {
	// Get counter & increment button
	const counterDisplay = document.getElementById('counter');
	const incrementButton = document.getElementById('incrementButton');

	// Initialize counter with 0 and increment when button is clicked
	let count = 0;
	counterDisplay.textContent = count;
	incrementButton.addEventListener('click', () => {
		count++;
		counterDisplay.textContent = count;
	});
});
