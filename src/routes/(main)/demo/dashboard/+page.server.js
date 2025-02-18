/*
 * In this file, the data is loaded from the server.
 */

export const load = async ({ fetch }) => {
	// Create responses
	const responseCsvData = await fetch('../../pizza_sales.csv');

	// Parse responses into plain text
	let csvDataText = await responseCsvData.text();

	// Parse plain csv text into arrays of objects
	let csvDataParsed = toArrayOfObjects(csvDataText);

	return {
		csvData: csvDataParsed
	};
};

/**
 * @param {string} text
 */
function toArrayOfObjects(text) {
	// Parse plain text describing a csv file into an array of objects

	if (!text) return [];

	const lines = text.split(/\r?\n/);
	const headers = [
		'order_date',
		'order_details_id',
		'order_id',
		'order_time',
		'pizza_category',
		'pizza_id',
		'pizza_ingredients',
		'pizza_name',
		'pizza_size',
		'quantity',
		'total_price',
		'unit_price'
	];
	const rows = lines
		.slice(1)
		.map((line) => line.split(','))
		.filter((row) => row.length === headers.length);

	/**
	 * @type {Record<string, string>[]}
	 */
	const outArr = [];
	rows.forEach((row) => {
		/** @type {Record<string, string>} */
		const rowObj = {
			order_date: '',
			order_details_id: '',
			order_id: '',
			order_time: '',
			pizza_category: '',
			pizza_id: '',
			pizza_ingredients: '',
			pizza_name: '',
			pizza_size: '',
			quantity: '',
			total_price: '',
			unit_price: ''
		};
		headers.forEach((header, i) => {
			if (header in Object.keys(rowObj)) {
				rowObj[header] = row[i];
			}
		});
		outArr.push(rowObj);
	});

	return outArr;
}

/** @type {{ order_date: string, order_details_id: string, order_id: string, order_time: string, pizza_category: string, pizza_id: string, pizza_ingredients: string, pizza_name: string, pizza_size: string, quantity: string, total_price: string, unit_price: string }} */
/** @type {{ order_date: string,order_details_id: string,order_id: string,order_time: string,pizza_category: string,pizza_id: string,pizza_ingredients: string,pizza_name: string,pizza_size: string,quantity: string,total_price: string,unit_price: string }[]} */
