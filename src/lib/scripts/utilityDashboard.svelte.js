import { max, rollups, sum } from 'd3-array';
/**
 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
 */

export const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const hoursOfDay = [
	'08:00',
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
	'23:00',
	'24:00'
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
 * @param {DataEntry[]} data
 * @param {string} timeUnit
 * @param {string} type
 */
export const getTimeVizData = (data, timeUnit, type) => {
	/**
	 * @type {{ name: string; records: { unit: string; count: number; }[]; }[]}
	 */
	let binnedDataNamed = [];

	if (timeUnit === 'day of week') {
		// Bin data, first by type, then by day of week
		const binnedData = rollups(
			data,
			(/** @type {DataEntry[]}*/ v) =>
				sum(v, (/** @type {{ quantity: string }} */ d) => +d.quantity),
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
			(/** @type {DataEntry[]}*/ v) =>
				sum(v, (/** @type {{ quantity: string | number; }} */ d) => +d.quantity),
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
			data,
			(/** @type {DataEntry[]}*/ v) =>
				sum(v, (/** @type {{ quantity: string | number; }} */ d) => +d.quantity),
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
