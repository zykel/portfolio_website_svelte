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

	const getToppingsData = (datumPie) => {
		const start = datumPie.startAngle;
		const end = datumPie.endAngle;
		const angle1 = start + 0 * (end - start);
		const x1 = Math.cos(angle1) * radius * 0.6;
		const y1 = Math.sin(angle1) * radius * 0.6;
		const angle2 = start + 0.4 * (end - start);
		const x2 = Math.cos(angle2) * radius * 0.6;
		const y2 = Math.sin(angle2) * radius * 0.6;
		return [
			{ x: x1, y: y1 },
			{ x: x2, y: y2 }
		];
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
			<feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.5)" />
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
			{#each toppingsData as { x, y }, i}
				<circle cx={x} cy={y} r="7" {fill} />
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
