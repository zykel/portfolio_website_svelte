import { scaleOrdinal } from 'd3-scale';
import { schemeObservable10 } from 'd3-scale-chromatic';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max, rollups, sum } from 'd3-array';
/**
 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
 */

export const pizzaCategories = ['Classic', 'Chicken', 'Supreme', 'Veggie'];

export const categoryColorScale = scaleOrdinal().domain(pizzaCategories).range(schemeObservable10);

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
