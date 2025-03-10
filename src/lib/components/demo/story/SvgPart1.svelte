<script>
	import {
		getCategoryDataStepped,
		schemeObservable10Light,
		categoryColorScale
	} from '$lib/scripts/utilityStory.js';
	import { pie, arc } from 'd3-shape';
	import { Tween } from 'svelte/motion';

	/**
	 * @typedef {Object} PizzaDataEntry
	 * @property {string} category - The category of the pizza (e.g., "Classic").
	 * @property {number} count - The number of times this pizza was sold.
	 * @property {string} name - The name of the pizza (e.g., "The Hawaiian Pizza").
	 * @property {number} price - The price of the pizza.
	 */

	let { /** @type {PizzaDataEntry[]} */ data, width, height, stepNr } = $props();

	const margin = { top: 20, right: 20, bottom: 20, left: 20 };

	const gTranslate = $derived([
		(margin.left + (width - margin.right)) / 2,
		(margin.top + (height - margin.bottom)) / 2
	]);

	const categoryData = $derived(getCategoryDataStepped(data));

	const getPizzaPieData = (
		/** @type {{ category: string; nrPizzas: number; stepReveal: number; }[]} */ categoryData
	) => {
		const pieScale = pie().value((/** @type {{ nrPizzas: number; }} */ d) => d.nrPizzas);

		const pieData = pieScale(categoryData).map(
			(
				/** @type {{ data: { stepReveal: number; }; index: string | number; }} */ datumPie,
				/** @type {any} */ i
			) => {
				datumPie.data.stepReveal = +datumPie.index;
				return datumPie;
			}
		);

		return pieData;
	};

	const radius = 100;

	const arcScale = $derived(
		arc()
			.innerRadius(0)
			.outerRadius(radius)
			// .padAngle(0.04)
			.cornerRadius(3)
	);
	const arcScaleWide = $derived(
		arc()
			.innerRadius(0)
			.outerRadius(radius * 1.1)
			// .padAngle(0.04)
			.cornerRadius(3)
	);
	const arcScaleRim = $derived(
		arc()
			.innerRadius(radius)
			.outerRadius(radius * 1.1)
			// .padAngle(0.04)
			.cornerRadius(3)
	);

	const dataPie = $derived(getPizzaPieData(categoryData));

	const getToppingCirclePosition = (datumPie, anglePerc, r) => {
		const start = datumPie.startAngle;
		const end = datumPie.endAngle;
		const angle = start + anglePerc * (end - start) - Math.PI / 2;
		const x = Math.cos(angle) * r;
		const y = Math.sin(angle) * r;
		return { x, y, type: 'circle' };
	};
	const getToppingBezierPosition = (datumPie, anglePerc, r, length, rotation) => {
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

	const bezierLength = $derived(radius * 0.2);

	const getToppingsData = (datumPie) => {
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

	const dataTweened = $derived(
		dataPie.map((/** @type {any} */ datumPie) => {
			const dSmall = arcScale(datumPie);
			const dWide = arcScaleWide(datumPie);
			const dRim = arcScaleRim(datumPie);
			const fill = categoryColorScale(datumPie.data.category);
			const opacityLight = new Tween(0);
			const opacityFull = new Tween(0);

			const toppingsData = getToppingsData(datumPie);
			return { ...datumPie, dSmall, dWide, dRim, opacityLight, opacityFull, fill, toppingsData };
		})
	);

	const pizzaStartStep = 1;

	$effect(() => {
		dataTweened.forEach(
			(
				/** @type {{ data: { stepReveal: any; }; opacityLight: { target: number; }; opacityFull: { target: number; }; }} */ datumTweened
			) => {
				const stepReveal = pizzaStartStep + datumTweened.data.stepReveal;
				datumTweened.opacityLight.target = stepReveal <= stepNr ? 0.4 : 0;
				datumTweened.opacityFull.target = stepReveal <= stepNr ? 1 : 0;
			}
		);
	});

	$inspect({ dataTweened });
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
	<defs>
		<filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.3)" />
		</filter>
	</defs>
	<g class="sizes-pie-g" transform={`translate(${gTranslate})`}>
		{#each dataTweened as { dSmall, dWide, opacityFull, fill }, i}
			<path
				class="pizza-background-shadow"
				d={dWide}
				opacity={opacityFull.current}
				fill="white"
				filter="url(#drop-shadow)"
			/>
		{/each}
		{#each dataTweened as { dSmall, dRim, dWide, opacityLight, opacityFull, fill, toppingsData }, i}
			<path class="pizza-background" d={dWide} opacity={opacityFull.current} fill="white" />
			<path class="pizza-rim" d={dRim} opacity={opacityFull.current} {fill} />
			<path class="pizza-inner" d={dSmall} opacity={opacityLight.current} {fill} />
			{#each toppingsData as toppingsDatum, i}
				{#if toppingsDatum.type === 'circle'}
					<circle
						cx={toppingsDatum.x}
						cy={toppingsDatum.y}
						r={radius * 0.12}
						{fill}
						opacity={opacityFull.current}
					/>
				{:else if toppingsDatum.type === 'bezier'}
					<path
						d={`M ${toppingsDatum.p1[0]} ${toppingsDatum.p1[1]} Q ${toppingsDatum.p2[0]} ${toppingsDatum.p2[1]} ${toppingsDatum.p3[0]} ${toppingsDatum.p3[1]}`}
						fill="none"
						stroke={fill}
						stroke-width="5"
						opacity={opacityFull.current}
						stroke-linecap="round"
						transform={`rotate(${toppingsDatum.rotation} ${toppingsDatum.p2[0]} ${toppingsDatum.p2[1]})`}
					/>
				{/if}
			{/each}
		{/each}
	</g>
</svg>

<style>
	svg {
		/* background-color: #f0f0f0; */
		border: 1px solid #ccc;
	}
</style>
