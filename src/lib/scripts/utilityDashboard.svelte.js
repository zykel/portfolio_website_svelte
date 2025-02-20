import { max, rollups, sum, mean, groups } from 'd3-array';
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
 * @param {DataEntry[]} data
 * @param {string} timeUnit
 * @param {string} type
 */
export const getTimeVizData = (data, timeUnit, type) => {
	/**
	 * @type {{ name: string; records: { unit: string; count: number; }[]; }[]}
	 */
	let binnedDataNamed = [];

	const nrUniqueOrderDates = [...new Set(data.map((d) => d.order_date))].length;
	const nrWeeks = 52;

	if (timeUnit === 'day of week') {
		const mue = groups(
			data,
			(/** @type {DataEntry}*/ d) => d[type],
			(/** @type {DataEntry}*/ d) => d.day
		);
		// debugger;
		// Bin data, first by type, then by day of week
		const binnedData = rollups(
			data,
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
			data,
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
		console.log(binnedDataNamed);
	} else if (timeUnit === 'month of year') {
		// Group data by type, then by months of year
		const binnedData = rollups(
			data,
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
