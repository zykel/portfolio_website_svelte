import { scaleOrdinal } from 'd3-scale';
import { schemeObservable10 } from 'd3-scale-chromatic';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max, rollups, sum } from 'd3-array';
/**
 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
 */

export const pizzaCategories = ['Classic', 'Chicken', 'Supreme', 'Veggie'];
export const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const categoryColorScale = scaleOrdinal().domain(pizzaCategories).range(schemeObservable10);
export const defaultColor = '#7B68EE'; //'#87CEEB';

/**
 * @param {DataEntry[]} data
 * @returns {{ name: string, nrSales: number, category: string }[]}
 */
export const getDataGrouped = (data) => {
	return rollups(
		data,
		(/** @type {DataEntry[]}*/ v) => {
			return {
				nrSales: sum(v, (/** @type {{ quantity: string }} */ d) => +d.quantity),
				category: v[0].pizza_category
			};
		},
		(/** @type {DataEntry}*/ d) => d.pizza_name
	)
		.map(
			(
				/** @type {[string, { nrSales: number, category: string }]}*/ [name, { nrSales, category }]
			) => ({ name, nrSales, category })
		)
		.sort((a, b) => b.nrSales - a.nrSales);
};

/**
 * @param {DataEntry[]} data
 */
export const getWeekChartData = (data) => {
	/**
	 * @type {{ name: string; records: { unit: string; count: number; }[]; }[]}
	 */
	let binnedDataNamed = [];

	// const normalizationFactor = getNormalizationFactor(data);
	const normalizationFactor = 1 / 52;

	// Bin data, first by type, then by day of week
	const binnedData = rollups(
		data,
		(/** @type {DataEntry[]}*/ v) => {
			return Math.round(
				sum(v, (/** @type {{ quantity: string }} */ d) => +d.quantity) * normalizationFactor
			);
		},
		(/** @type {DataEntry}*/ d) => d.day
	)
		.map((/** @type {[string, number]}*/ [day, nrSalesAvg]) => ({ day, nrSalesAvg }))
		.sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day));

	return binnedData;
};
