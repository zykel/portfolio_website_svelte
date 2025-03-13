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

export const schemeObservable10ExtraLight = [
	'#cad5f2',
	'#fbe9be',
	'#ffd7d1',
	'#d6efe9',
	'#c9e7ce',
	'#ffdeeb',
	'#e5d3fb',
	'#e2ecfc',
	'#e3d5cd',
	'#e1e2e4'
];

export const categoryColorScale = scaleOrdinal()
	.domain(categories)
	// .range(schemeObservable10);
	.range(schemeObservable10Light);

export const categoryColorScaleExtraLight = scaleOrdinal()
	.domain(categories)
	// .range(schemeObservable10);
	.range(schemeObservable10ExtraLight);

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

const getToppingCirclePosition = (
	/** @type {{ index?: number; startAngle?: any; endAngle?: any; }} */ datumPie,
	/** @type {number} */ anglePerc,
	/** @type {number} */ r
) => {
	const start = datumPie.startAngle;
	const end = datumPie.endAngle;
	const angle = start + anglePerc * (end - start) - Math.PI / 2;
	const x = Math.cos(angle) * r;
	const y = Math.sin(angle) * r;
	return { x, y, type: 'circle' };
};
const getToppingBezierPosition = (
	/** @type {{ index?: number; startAngle?: any; endAngle?: any; }} */ datumPie,
	/** @type {number} */ anglePerc,
	/** @type {number} */ r,
	/** @type {number} */ length,
	/** @type {number} */ rotation
) => {
	const start = datumPie.startAngle;
	const end = datumPie.endAngle;
	const angle = start + anglePerc * (end - start) - Math.PI / 2;
	const x = Math.cos(angle) * r;
	const y = Math.sin(angle) * r;

	// Create a bezier curve as follows: It is a line consisting of three points with a slight bend. The line length should be length. The middle point of the line should be at x, y. The line should be rotate according to rotation
	const p1 = [x - length / 2, y + length / 4];
	const p2 = [x, y];
	const p3 = [x + length / 2, y + length / 4];

	return { p1, p2, p3, rotation, type: 'bezier' };
};

export const getToppingsData = (
	/** @type {{ index: number; }} */ datumPie,
	/** @type {number} */ radius,
	/** @type {number} */ bezierLength
) => {
	if (datumPie.index === 0) {
		return [
			getToppingCirclePosition(datumPie, 0.25, radius * 0.8),
			getToppingCirclePosition(datumPie, 0.4, radius * 0.4),
			getToppingCirclePosition(datumPie, 0.7, radius * 0.8),
			getToppingBezierPosition(datumPie, 0.8, radius * 0.6, bezierLength, 10),
			getToppingBezierPosition(datumPie, 0.51, radius * 0.8, bezierLength, 150)
		];
	}
	if (datumPie.index === 1) {
		return [
			getToppingCirclePosition(datumPie, 0.25, radius * 0.8),
			getToppingCirclePosition(datumPie, 0.6, radius * 0.5),
			getToppingCirclePosition(datumPie, 0.8, radius * 0.8),
			getToppingBezierPosition(datumPie, 0.21, radius * 0.4, bezierLength, 30),
			getToppingBezierPosition(datumPie, 0.51, radius * 0.8, bezierLength, 130)
		];
	}
	if (datumPie.index === 2) {
		return [
			getToppingCirclePosition(datumPie, 0.22, radius * 0.5),
			getToppingCirclePosition(datumPie, 0.47, radius * 0.75),
			getToppingCirclePosition(datumPie, 0.77, radius * 0.65),
			getToppingBezierPosition(datumPie, 0.12, radius * 0.78, bezierLength, 80),
			getToppingBezierPosition(datumPie, 0.52, radius * 0.28, bezierLength, 180),
			getToppingBezierPosition(datumPie, 0.72, radius * 0.92, bezierLength, -90)
		];
	}
	if (datumPie.index === 3) {
		return [
			getToppingCirclePosition(datumPie, 0.2, radius * 0.76),
			getToppingCirclePosition(datumPie, 0.6, radius * 0.6),
			getToppingBezierPosition(datumPie, 0.62, radius * 0.32, bezierLength, 20),
			getToppingBezierPosition(datumPie, 0.72, radius * 0.8, bezierLength, 170)
		];
	} else {
		return [];
	}
};
