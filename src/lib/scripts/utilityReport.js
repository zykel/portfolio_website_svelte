import { scaleOrdinal } from 'd3-scale';
import { schemeObservable10 } from 'd3-scale-chromatic';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max, rollups, sum, mean, range } from 'd3-array';
/**
 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
 */

export const pizzaCategories = ['Classic', 'Chicken', 'Supreme', 'Veggie'];
export const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export const daysOfWeekFullMap = new Map([
	['Mo', 'Monday'],
	['Tu', 'Tuesday'],
	['We', 'Wednesday'],
	['Th', 'Thursday'],
	['Fr', 'Friday'],
	['Sa', 'Saturday'],
	['Su', 'Sunday']
]);
export const timeOfDayDomain = range(7, 24, 1)
	.map((d) => {
		const hours = d.toString().padStart(2, '0');
		return [hours + ':00', hours + ':15', hours + ':30', hours + ':45'];
	})
	.flat();

export const categoryColorScale = scaleOrdinal().domain(pizzaCategories).range(schemeObservable10);
export const defaultColor = 'hsl(249, 80%, 72%)'; //'#87CEEB';

export const timeBinningWidthMinutes = 15;

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
	const normalizationFactor = 1 / 52;

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

function getMillisecondsSinceStartOfDay(date) {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const milliseconds = date.getMilliseconds();

	return (
		hours * 60 * 60 * 1000 + // Convert hours to milliseconds
		minutes * 60 * 1000 + // Convert minutes to milliseconds
		seconds * 1000 + // Convert seconds to milliseconds
		milliseconds // Add milliseconds
	);
}

// Function to compute density
function kernelDensityEstimator(kernel, X) {
	return function (V) {
		return X.map(function (x) {
			return [
				x,
				mean(V, function (v) {
					return kernel(x - v);
				})
			];
		});
	};
}
function kernelEpanechnikov(k) {
	return function (v) {
		return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
	};
}

const binTime = (/** @type {string} */ timeStr) => {
	const [hours, minutes, seconds] = timeStr.split(':');
	return (
		hours +
		':' +
		(Math.floor(minutes / timeBinningWidthMinutes) * timeBinningWidthMinutes)
			.toString()
			.padStart(2, '0')
	);
};

/**
 * @param {DataEntry[]} data
 */
export const getDayChartData = (data) => {
	// const nrUniqueOrderDates = [...new Set(data.map((d) => d.order_date))].length;

	const normalizationFactor = 1 / 52;

	const binnedData = rollups(
		data,
		(/** @type {DataEntry[]}*/ v) => {
			return sum(v, (/** @type {{ quantity: string }} */ d) => +d.quantity) * normalizationFactor;
		},
		(/** @type {DataEntry}*/ d) => d.day,
		(/** @type {DataEntry}*/ d) => binTime(d.order_time)
	)
		.map((/** @type {[string, Array<[string, number]>]} */ [day, frequencyInfoArray]) => {
			timeOfDayDomain.map((time) => {
				if (!frequencyInfoArray.find(([timeStr, _]) => timeStr === time)) {
					frequencyInfoArray.push([time, 0]);
				}
			});
			return {
				day,
				frequencyInfoArray: frequencyInfoArray
					.map(([time, frequency]) => ({ time, frequency }))
					.sort((a, b) => {
						if (a.time > b.time) return 1;
						if (a.time < b.time) return -1;
						return 0;
					})
			};
		})
		.sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day));

	// .map(
	// 	(
	// 		/** @type {[string, {records: DataEntry[], normalizationFactor: number}]}*/ [day, recordInfos]
	// 	) => {
	// 		// Roll on here , getting the aggregate for each bin - and don't forget to factor in the quantity
	// 		binTime(d.order_time);
	// 		return {
	// 			day,
	// 			density,
	// 			normalizationFactor: recordInfos.normalizationFactor
	// 		};
	// 	}
	// );
	// debugger;

	return binnedData;
};

/**
 * Counts the occurrences of each unique string in an array.
 * @param {any[]} array - The array of strings.
 * @returns {Object.<string, number>} - An object with the unique strings as keys and their counts as values.
 */
function countOccurrences(array) {
	return array.reduce((acc, value) => {
		acc[value] = (acc[value] || 0) + 1;
		return acc;
	}, {});
}

/**
 * @param {DataEntry[]} data
 */
export const getIngredientsData = (data) => {
	// debugger;

	const ingredientOccurrenceObj = countOccurrences(
		data.map((d) => d.pizza_ingredients.split('; ')).flat()
	);
	// Transform obj into arr
	const ingredientOccurrenceArr = Object.entries(ingredientOccurrenceObj)
		.map(([ingredient, count]) => ({
			ingredient,
			count: count
		}))
		.sort((a, b) => b.count - a.count);

	return ingredientOccurrenceArr;
};
