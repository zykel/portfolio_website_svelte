import { scaleOrdinal } from 'd3-scale';

/**
 * @typedef {Object} PizzaDataEntry
 * @property {string} category - The category of the pizza (e.g., "Classic").
 * @property {number} count - The number of times this pizza was sold.
 * @property {string} name - The name of the pizza (e.g., "The Hawaiian Pizza").
 * @property {number} price - The price of the pizza.
 */

export const categories = ['Classic', 'Chicken', 'Supreme', 'Veggie'];

export const schemeObservable10Light = [
	'#7b96de',
	'#f4c85d',
	'#ff9c8d',
	'#98d6c8',
	'#77c385',
	'#ffadcd',
	'#bf92f6',
	'#b6cff8',
	'#ba9783',
	'#b4b7bc'
];

export const categoryColorScale = scaleOrdinal()
	.domain(categories)
	// .range(schemeObservable10);
	.range(schemeObservable10Light);

/** @param {PizzaDataEntry[]} dataPizzas */
export const getCategoryDataStepped = (dataPizzas) => {
	return categories.map((category, i) => {
		return {
			category,
			nrPizzas: dataPizzas.filter((d) => d.category === category).length,
			stepReveal: 0
		};
	});
};
