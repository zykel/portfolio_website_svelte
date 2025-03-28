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

/**
 * @param {string} col
 * @param {number} amt
 */
export function lightenDarkenHexColor(col, amt) {
	var usePound = false;
	if (col[0] == '#') {
		col = col.slice(1);
		usePound = true;
	}

	var num = parseInt(col, 16);

	var r = (num >> 16) + amt;

	if (r > 255) r = 255;
	else if (r < 0) r = 0;

	var b = ((num >> 8) & 0x00ff) + amt;

	if (b > 255) b = 255;
	else if (b < 0) b = 0;

	var g = (num & 0x0000ff) + amt;

	if (g > 255) g = 255;
	else if (g < 0) g = 0;

	return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}

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
	.domain(pizzaCategories)
	// .range(schemeObservable10);
	.range(schemeObservable10Light);

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
		// TODO: Would actually need to take times the quantity
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

/**
 * @param {DataEntry[]} data
 */
export const getSizeData = (data) => {
	return rollups(
		data,
		(/** @type {DataEntry[]}*/ v) => {
			return {
				nrSales: sum(v, (/** @type {{ quantity: string }} */ d) => +d.quantity)
			};
		},
		(/** @type {DataEntry}*/ d) => d.pizza_size
	)
		.map((/** @type {[string, { nrSales: number }]}*/ [size, { nrSales }]) => ({ size, nrSales }))
		.sort((a, b) => (b.size > a.size ? 1 : b.size < a.size ? -1 : 0));
};

/**
 * @param {any[]} array
 * @param {number} k
 */
function getAllPossibleTuplesFromArray(array, k) {
	/**
	 * @param {number} start
	 * @param {any[]} path
	 */
	function combine(start, path) {
		if (path.length === k) {
			result.push([...path]);
			return;
		}
		for (let i = start; i < array.length; i++) {
			path.push(array[i]);
			combine(i + 1, path);
			path.pop();
		}
	}

	/** @type {any[]} */
	let result = [];
	combine(0, []);

	return result;
}

/**
 * @param {DataEntry[]} data
 */
export const getRecipes = (data) => {
	const recipes = [...new Set(data.map((d) => d.pizza_ingredients))].map((ingredientsString) =>
		ingredientsString.split('; ')
	);
	return recipes;
};

/**
 * @param {DataEntry[]} data
 * @param {string[]} mostUsedIngredients
 */
export const getIngredientCombinationData = (data, mostUsedIngredients, recipes) => {
	const tupleSize = 2;

	/** @type {any[]} */
	const unusedIngredientCombinations = [];

	const ingredientTuples = getAllPossibleTuplesFromArray(mostUsedIngredients, tupleSize);
	ingredientTuples.forEach((ingredientTuple) => {
		const recipesUsingAllIngredients = recipes.filter((recipe) =>
			ingredientTuple.reduce((/** @type {string} */ a, /** @type {string} */ b) => {
				return a && recipe.includes(b);
			}, true)
		);
		if (recipesUsingAllIngredients.length === 0) {
			unusedIngredientCombinations.push(ingredientTuple);
		}
	});

	return unusedIngredientCombinations;
};
