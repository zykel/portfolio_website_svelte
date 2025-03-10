/*
 * In this file, the data is loaded from the server.
 */

export const load = async ({ fetch }) => {
	// Create responses
	const responseJsonPizzaData = await fetch('../../story_pizza_data.json');
	const responseJsonTimeData = await fetch('../../story_time_data.json');

	// Parse responses into plain text
	let pizzaData = await responseJsonPizzaData.json();
	let timeData = await responseJsonTimeData.json();

	// Parse plain csv text into arrays of objects
	// let csvDataParsed = toArrayOfObjects(csvDataText);

	return {
		pizzaData,
		timeData
	};
};
