export function getTitleFromHTML(htmlString: string) {
	// Step 1: Create a new DOMParser
	const parser = new DOMParser();

	// Step 2: Parse the HTML string into a Document object
	const doc = parser.parseFromString(htmlString, 'text/html');

	// Step 3: Extract the title element from the document
	const title = doc.querySelector('title')?.textContent;

	// Return the title or a fallback if the title doesn't exist
	return title || 'No title found';
}
