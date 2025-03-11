<script>
	import {
		getCategoryDataStepped,
		schemeObservable10Light,
		categoryColorScale,
		getToppingsData
	} from '$lib/scripts/utilityStory.js';
	import { pie, arc } from 'd3-shape';
	import { stopPropagation } from 'svelte/legacy';
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

	const radius = 170;

	const arcScale = $derived(arc().innerRadius(0).outerRadius(radius).cornerRadius(3));
	const arcScaleWide = $derived(
		arc()
			.innerRadius(0)
			.outerRadius(radius * 1.1)
			.cornerRadius(3)
	);
	const arcScaleRim = $derived(
		arc()
			.innerRadius(radius)
			.outerRadius(radius * 1.1)
			.cornerRadius(3)
	);

	const dataPie = $derived(getPizzaPieData(categoryData));

	const bezierLength = $derived(radius * 0.2);

	const dataTweened = $derived(
		dataPie.map((/** @type {any} */ datumPie) => {
			const dSmall = arcScale(datumPie);
			const dWide = arcScaleWide(datumPie);
			const dRim = arcScaleRim(datumPie);
			const fill = categoryColorScale(datumPie.data.category);
			const opacityLight = new Tween(0);
			const opacityFull = new Tween(0);

			const toppingsData = getToppingsData(datumPie, radius, bezierLength);
			return {
				datumPie,
				...datumPie,
				dSmall,
				dWide,
				dRim,
				opacityLight,
				opacityFull,
				fill,
				toppingsData
			};
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

	$inspect(stepNr);

	let categoryFocused = $state('');
	let categorySelected = $state('');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {width} {height}"
	onclick={(event) => {
		categorySelected = '';
	}}
>
	<defs>
		<filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="6" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.3)" />
		</filter>
		<filter id="drop-shadow-heavy" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="6" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.5)" />
		</filter>
	</defs>
	<g class="sizes-pie-g" transform={`translate(${gTranslate})`}>
		{#each dataTweened as { data, dSmall, dWide, dRim, opacityFull, fill }, i}
			<g
				class="pizza-slice-background"
				transform={[categoryFocused, categorySelected].includes(data.category)
					? 'scale(1.09)'
					: 'scale(0.99)'}
			>
				<path
					class="pizza-background-shadow"
					d={dSmall}
					opacity={opacityFull.current}
					fill="white"
					filter="url(#drop-shadow{categorySelected === data.category ? '-heavy' : ''})"
				/>
				<path
					class="pizza-background-shadow"
					d={dRim}
					opacity={opacityFull.current}
					fill="white"
					filter="url(#drop-shadow{categorySelected === data.category ? '-heavy' : ''})"
				/>
			</g>
		{/each}
		{#each dataTweened as { datumPie, data, dSmall, dRim, dWide, opacityLight, opacityFull, fill, toppingsData }, i}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<g
				class="pizza-slice"
				onclick={(event) => {
					event.stopPropagation();
					categorySelected = data.category;
				}}
				onpointerover={() => (categoryFocused = data.category)}
				onpointerout={() => (categoryFocused = '')}
				transform={[categoryFocused, categorySelected].includes(data.category) ? 'scale(1.1)' : ''}
			>
				<path class="pizza-background" d={dSmall} opacity={opacityFull.current} fill="white" />
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
							stroke-width={radius * 0.05}
							opacity={opacityFull.current}
							stroke-linecap="round"
							transform={`rotate(${toppingsDatum.rotation} ${toppingsDatum.p2[0]} ${toppingsDatum.p2[1]})`}
						/>
					{/if}
				{/each}
				<text
					class="pizza-slice-label"
					x={arcScale.centroid(datumPie)[0] * 2.6}
					y={arcScale.centroid(datumPie)[1] * 2.6}
					text-anchor={arcScale.centroid(datumPie)[0] > 0 ? 'start' : 'end'}
					{fill}
					opacity={opacityFull.current}
					pointer-events="none"
				>
					{data.category} ({data.nrPizzas})
				</text>
			</g>
		{/each}
	</g>
</svg>

<style>
	svg {
		/* background-color: #f0f0f0; */
		border: 1px solid #ccc;
	}

	.pizza-slice {
		cursor: pointer;
	}

	.pizza-slice-label {
		font-size: 2rem;
		font-weight: bold;
	}
</style>
