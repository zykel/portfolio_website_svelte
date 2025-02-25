import { max, rollups, sum, mean, groups } from 'd3-array';
import { getContext } from 'svelte';
/**
 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
 */

export const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const hoursOfDay = [
	'09:00',
	'10:00',
	'11:00',
	'12:00',
	'13:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
	'18:00',
	'19:00',
	'20:00',
	'21:00',
	'22:00',
	'23:00'
];

export const monthsOfYear = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

/**
 * Gets the ISO week number of a date.
 * @param {Date} date - The date to get the week number for.
 * @returns {number} - The ISO week number.
 */
function getWeekNumber(date) {
	const tempDate = new Date(date.getTime());
	tempDate.setHours(0, 0, 0, 0);
	// Set to nearest Thursday: current date + 4 - current day number
	// Make Sunday's day number 7
	tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
	// Get first day of year
	const yearStart = new Date(tempDate.getFullYear(), 0, 1);
	// Calculate full weeks to nearest Thursday
	const weekNo = Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
	return weekNo;
}

/**
 * @param {{value: DataEntry[]}} data
 * @param {string} timeUnit
 * @param {string} type
 */
export const getTimeVizData = (data, timeUnit, type) => {
	/**
	 * @type {{ name: string; records: { unit: string; count: number; }[]; }[]}
	 */
	let binnedDataNamed = [];

	const nrUniqueOrderDates = [...new Set(data.value.map((d) => d.order_date))].length;
	const nrWeeks = 52;

	if (timeUnit === 'day of week') {
		const mue = groups(
			data.value,
			(/** @type {DataEntry}*/ d) => d[type],
			(/** @type {DataEntry}*/ d) => d.day
		);
		// debugger;
		// Bin data, first by type, then by day of week
		const binnedData = rollups(
			data.value,
			(/** @type {DataEntry[]}*/ v) => {
				// debugger;
				return sum(v, (/** @type {{ quantity: string }} */ d) => +d.quantity) / nrWeeks;
				// const uniqueEntries = [
				// 	...new Set(
				// 		v.map((d) => (d.date ? getWeekNumber(d.date) + '_' + d.date.getFullYear() : 0))
				// 	)
				// ];
				// debugger;
				// return (
				// 	sum(v, (/** @type {{ quantity: string }} */ d) => +d.quantity) / uniqueEntries.length
				// );
			},
			(/** @type {DataEntry}*/ d) => d[type],
			(/** @type {DataEntry}*/ d) => d.day
		);
		binnedDataNamed = binnedData.map(
			(/** @type {[string, Array<[string, number]>]} */ itemInfo) => {
				const [name, records] = itemInfo;
				const recordsNamed = records
					.map((/** @type {[string, number]} */ recordInfo) => {
						const [unit, count] = recordInfo;
						return { unit, count };
					})
					.sort((a, b) => daysOfWeek.indexOf(a.unit) - daysOfWeek.indexOf(b.unit));
				return { name, records: recordsNamed };
			}
		);
	} else if (timeUnit === 'hour of day') {
		// Group data by type, then by hour of day
		const binnedData = rollups(
			data.value,
			(/** @type {DataEntry[]}*/ v) => {
				// debugger;
				return sum(v, (/** @type {{ quantity: string }} */ d) => +d.quantity) / nrUniqueOrderDates;
			},
			(/** @type {DataEntry}*/ d) => d[type],
			(/** @type {DataEntry}*/ d) => d.date?.getHours().toString().padStart(2, '0') + ':00'
		);

		binnedDataNamed = binnedData.map(
			(/** @type {[string, Array<[string, number]>]} */ itemInfo) => {
				const [name, records] = itemInfo;
				const recordsNamed = records
					.map((/** @type {[string, number]} */ recordInfo) => {
						const [unit, count] = recordInfo;
						return { unit, count };
					})
					.sort((a, b) => {
						if (a.unit < b.unit) {
							return -1;
						}
						if (a.unit > b.unit) {
							return 1;
						}
						return 0;
					});
				return { name, records: recordsNamed };
			}
		);
	} else if (timeUnit === 'month of year') {
		// Group data by type, then by months of year
		const binnedData = rollups(
			data.value,
			(/** @type {DataEntry[]}*/ v) =>
				sum(v, (/** @type {{ quantity: string }} */ d) => +d.quantity) /
				[...new Set(v.map((d) => d.date?.getFullYear))].length,
			(/** @type {DataEntry}*/ d) => d[type],
			(/** @type {DataEntry}*/ d) =>
				monthsOfYear[typeof d.date !== 'undefined' ? d.date.getMonth() : 0]
		);

		binnedDataNamed = binnedData.map(
			(/** @type {[string, Array<[string, number]>]} */ itemInfo) => {
				const [name, records] = itemInfo;
				const recordsNamed = records
					.map((/** @type {[string, number]} */ recordInfo) => {
						const [unit, count] = recordInfo;
						return { unit, count };
					})
					.sort((a, b) => monthsOfYear.indexOf(a.unit) - monthsOfYear.indexOf(b.unit));
				return { name, records: recordsNamed };
			}
		);
	}
	return binnedDataNamed;
};

/**
 * @param {{value: DataEntry[]}} data
 * @param {string} type
 */
export const getPizzaBarchartData = (data, type) => {
	const barchartData = rollups(
		data.value,
		(/** @type {DataEntry[]}*/ v) => {
			const countTotal = sum(v, (/** @type {DataEntry}*/ d) => +d.quantity);
			const priceTotal = sum(v, (/** @type {DataEntry}*/ d) => +d.total_price);
			return { countTotal, priceTotal };
		},
		(/** @type {DataEntry}*/ d) => d[type]
	);

	const barchartDataNamed = barchartData.map(
		(/** @type {[string, Object.<string, number>]} */ itemInfo) => {
			const [name, countAndPrice] = itemInfo;
			return { name, countTotal: countAndPrice.countTotal, priceTotal: countAndPrice.priceTotal };
		}
	);

	return barchartDataNamed;
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
 * @param {{value: DataEntry[]}} data
 * @param {string} type
 * @param {{value: string[]}} focusedItems
 */
export const getIngredientsChartData = (data, type, focusedItems) => {
	const areItemsFocused = focusedItems.value.length > 0;

	// debugger;

	const ingredientOccurrenceObj = countOccurrences(
		data.value
			.filter((d) => !areItemsFocused || focusedItems.value.includes(d[type]))
			.map((d) => d.pizza_ingredients.split('; '))
			.flat()
	);
	// Transform obj into arr
	const ingredientOccurrenceArr = Object.entries(ingredientOccurrenceObj)
		.map(([ingredient, count]) => ({
			ingredient,
			count
		}))
		.sort((a, b) => b.count - a.count);

	return ingredientOccurrenceArr;
};

export function dodge(data, { radius = (d) => d, x = (d) => d } = {}) {
	const radius2 = (d, i, data) => radius(d, i, data) ** 2;
	const circles = data.value
		.map((d, i, data) => ({
			x: +x(d, i, data),
			r: +radius(d, i, data),
			r2: +radius2(d, i, data),
			data: d
		}))
		.sort((a, b) => a.x - b.x);
	const epsilon = 1e-3;
	let head = null,
		tail = null;

	// Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
	function intersects(x, y, r2) {
		let a = head;
		while (a) {
			if ((Math.sqrt(r2) + Math.sqrt(a.r2)) ** 2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
				return true;
			}
			a = a.next;
		}
		return false;
	}

	// Place each circle sequentially.
	for (const b of circles) {
		// Remove circles from the queue that can’t intersect the new circle b.
		while (head && head.x < b.x - b.r2) head = head.next;

		// Choose the minimum non-intersecting tangent.
		if (intersects(b.x, (b.y = 0), b.r2)) {
			let a = head;
			b.y = Infinity;
			do {
				let y = a.y + Math.sqrt((Math.sqrt(a.r2) + Math.sqrt(b.r2)) ** 2 - (a.x - b.x) ** 2);
				if (y < b.y && !intersects(b.x, y, b.r2)) b.y = y;
				a = a.next;
			} while (a);
		}

		// Add b to the queue.
		b.next = null;
		if (head === null) head = tail = b;
		else tail = tail.next = b;
	}

	return circles;
}

/**
 * Formats a number into a more readable string with suffixes like 'k' for thousands.
 * @param {number} num - The number to format.
 * @param {number} nrDigits - How many digits behind the comma.
 * @returns {string} - The formatted number.
 */
export function formatNumber(num, nrDigits = 0) {
	if (num >= 1e6) {
		return (num / 1e6).toFixed(nrDigits) + 'M';
	} else if (num >= 1e3) {
		return (num / 1e3).toFixed(nrDigits) + 'k';
	} else {
		return num.toString();
	}
}

export const addFocusedItem = (
	/** @type {{value: string[]}} */ focusedItems,
	/** @type {string} */ item
) => {
	focusedItems.value.push(item);
};
export const clearFocusedItem = (
	/** @type {{value: string[]}} */ focusedItems,
	/** @type {string} */ item
) => {
	focusedItems.value = focusedItems.value.filter((/** @type {string} */ d) => d !== item);
};
export const toggleFocusedItem = (
	/** @type {{value: string[]}} */ focusedItems,
	/** @type {string} */ item
) => {
	if (focusedItems.value.includes(item)) {
		clearFocusedItem(focusedItems, item);
	} else {
		addFocusedItem(focusedItems, item);
	}
};
export const clearFocusedItems = (/** @type {{value: string[]}} */ focusedItems) => {
	focusedItems.value = [];
};
