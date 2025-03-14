<script>
	import {
		getCategoryDataStepped,
		schemeObservable10Light,
		categoryColorScale,
		getToppingsData
	} from '$lib/scripts/utilityStory.js';
	import { transform } from '@observablehq/plot';
	import { interpolateTransformSvg } from 'd3-interpolate';
	import { pie, arc } from 'd3-shape';
	import { getContext } from 'svelte';
	import { stopPropagation } from 'svelte/legacy';
	import { Tween } from 'svelte/motion';

	/**
	 * @typedef {Object} PizzaDataEntry
	 * @property {string} category - The category of the pizza (e.g., "Classic").
	 * @property {number} count - The number of times this pizza was sold.
	 * @property {string} name - The name of the pizza (e.g., "The Hawaiian Pizza").
	 * @property {number} price - The price of the pizza.
	 */

	let {
		/** @type {PizzaDataEntry[]} */ data,
		width,
		height,
		stepNr,
		margin,
		startStep1_1,
		startStep1_2,
		interactionStepReached,
		categorySelected = $bindable()
	} = $props();

	const gTranslate = $derived([
		(margin.left + (width - margin.right)) / 2,
		(margin.top + (height - margin.bottom)) / 2
	]);
	const gTranslateInitial = $derived([
		(margin.left + (width - margin.right)) / 2,
		(margin.top + (height - margin.bottom)) / 2
	]);

	const getGTransform = () => {
		const x = (margin.left + (width - margin.right)) / 2;
		const y = (margin.top + (height - margin.bottom)) / (stepNr >= startStep1_2 ? 4 : 2);
		const scale = stepNr >= startStep1_2 ? 0.5 : 1;
		const gTransform = `translate(${x}, ${y}) scale(${scale})`;
		return gTransform;
	};
	const gTransform = new Tween(getGTransform(), {
		interpolate: interpolateTransformSvg
	});
	$effect(() => {
		gTransform.target = getGTransform();
	});

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

	const radius = $derived(Math.min(width, height) / 5);

	// @ts-ignore
	const arcScale = $derived(arc().innerRadius(0).outerRadius(radius).cornerRadius(3));
	const arcScaleWide = $derived(
		arc()
			.innerRadius(0)
			// @ts-ignore
			.outerRadius(radius * 1.1)
			.cornerRadius(3)
	);
	const arcScaleRim = $derived(
		arc()
			.innerRadius(radius)
			// @ts-ignore
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
			const transform = new Tween('scale(1.0)', {
				interpolate: interpolateTransformSvg
			});
			const rotate = new Tween(0);

			const toppingsData = getToppingsData(datumPie, radius, bezierLength);
			return {
				datumPie,
				...datumPie,
				dSmall,
				dWide,
				dRim,
				opacityLight,
				opacityFull,
				rotate,
				transform,
				fill,
				toppingsData,
				startAngle: datumPie.startAngle,
				endAngle: datumPie.endAngle
			};
		})
	);

	$effect(() => {
		dataTweened.forEach(
			(
				/** @type {{ data: { stepReveal: any; category: string }; opacityLight: { target: number; }; opacityFull: { target: number; }; rotate: { target: number; }; transform: { target: string }; startAngle: number; endAngle: number }} */ datumTweened
			) => {
				const angleRange = datumTweened.endAngle - datumTweened.startAngle;
				const rotationAfter1_2 =
					(-(datumTweened.startAngle + angleRange / 2) / (2 * Math.PI)) * 360;

				const stepReveal = startStep1_1 + datumTweened.data.stepReveal;
				datumTweened.transform.target =
					stepNr >= startStep1_2 && categorySelected === datumTweened.data.category
						? `rotate(${rotationAfter1_2})`
						: '';
				datumTweened.rotate.target =
					stepNr >= startStep1_2 && categorySelected === datumTweened.data.category
						? rotationAfter1_2
						: 0;
				// datumTweened.transform.target =
				// 	stepNr >= startStep1_2 && categorySelected === datumTweened.data.category
				// 		? 'rotate(180)'
				// 		: 'scale(1.0)';

				if (stepNr >= startStep1_2 && categorySelected !== datumTweened.data.category) {
					datumTweened.opacityLight.target = 0;
					datumTweened.opacityFull.target = 0;
				} else {
					datumTweened.opacityLight.target = stepReveal <= stepNr ? 0.4 : 0;
					datumTweened.opacityFull.target = stepReveal <= stepNr ? 1 : 0;
				}
			}
		);
	});

	/**
	 * @param {string} id
	 */
	function scrollToElement(id) {
		const element = document.getElementById(id);
		if (element) {
			// debugger;
			element.parentElement?.classList.remove('hidden');
			// element.classList.remove('hidden');
			// element.style.display = 'flex';
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	let categoryFocused = $state('');

	const getStepNrFromIdPart1 = getContext('getStepNrFromIdPart1');
	$inspect(dataTweened);
</script>

<defs>
	<filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
		<feDropShadow dx="0" dy="6" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.3)" />
	</filter>
	<filter id="drop-shadow-flipped" x="-50%" y="-50%" width="200%" height="200%">
		<feDropShadow dx="0" dy="-6" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.3)" />
	</filter>
	<filter id="drop-shadow-heavy" x="-50%" y="-50%" width="200%" height="200%">
		<feDropShadow dx="0" dy="6" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.5)" />
	</filter>
	<filter id="drop-shadow-heavy-flipped" x="-50%" y="-50%" width="200%" height="200%">
		<feDropShadow dx="0" dy="-6" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.5)" />
	</filter>
</defs>
<g class="sizes-pie-g" transform={gTransform.current}>
	{#each dataTweened as { data, dSmall, dWide, dRim, opacityFull, transform, rotate, fill }, i}
		{@const highlight =
			[categoryFocused, categorySelected].includes(data.category) && interactionStepReached}
		<g
			class="pizza-slice-background"
			transform={(highlight ? 'scale(1.09)' : '') + ` rotate(${rotate.current})`}
		>
			<path
				class="pizza-background-shadow"
				d={dSmall}
				opacity={opacityFull.current}
				fill="white"
				filter="url(#drop-shadow{rotate.current < -90 && rotate.current > -270 ? '-flipped' : ''})"
			/>
			<path
				class="pizza-background-shadow"
				d={dRim}
				opacity={opacityFull.current}
				fill="white"
				filter="url(#drop-shadow{rotate.current < -90 && rotate.current > -270 ? '-flipped' : ''})"
			/>
		</g>
	{/each}
	{#each dataTweened as { datumPie, data, dSmall, dRim, dWide, opacityLight, opacityFull, rotate, transform, fill, toppingsData, category }, i}
		{@const highlight =
			[categoryFocused, categorySelected].includes(data.category) && interactionStepReached}
		{@const modifiedLabelAngle =
			data.category === 'Supreme'
				? -Math.PI / 2 + 0.1
				: data.category === 'Veggie'
					? Math.PI / 2
					: data.category === 'Classic'
						? datumPie.startAngle - Math.PI / 2
						: datumPie.endAngle - Math.PI / 2 - 0.1}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<g
			class="pizza-slice"
			onpointerdown={(event) => {
				if (interactionStepReached) {
					categorySelected = data.category;
					scrollToElement('step-text-reveal_pizza_price_axis');
				}
			}}
			onpointermove={() => {
				if (interactionStepReached) categoryFocused = data.category;
			}}
			onpointerout={() => (categoryFocused = '')}
			transform={(highlight ? 'scale(1.1)' : '') + ` rotate(${rotate.current})`}
			style:cursor={interactionStepReached ? 'pointer' : 'default'}
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
			<!-- text-anchor={rotate.current !== 0
                    ? 'middle'
                    : arcScale.centroid(datumPie)[0] > 0
                        ? 'start'
                        : 'end'} -->
			<text
				class="pizza-slice-label"
				x={width < 650 && stepNr <= getStepNrFromIdPart1('allow_category_select')
					? Math.cos(modifiedLabelAngle) * radius * 1.4
					: arcScale.centroid(datumPie)[0] * 2.6}
				y={width < 650 && stepNr <= getStepNrFromIdPart1('allow_category_select')
					? Math.sin(modifiedLabelAngle) * radius * 1.4
					: arcScale.centroid(datumPie)[1] * 2.6}
				text-anchor={rotate.current !== 0
					? 'middle'
					: arcScale.centroid(datumPie)[0] > 0
						? 'start'
						: 'end'}
				font-size={width < 650 ? '1.5rem' : '2rem'}
				{fill}
				dominant-baseline="middle"
				opacity={opacityFull.current}
				pointer-events="none"
				transform="rotate({-rotate.current}, {arcScale.centroid(datumPie)[0] *
					2.6}, {arcScale.centroid(datumPie)[1] * 2.6})"
				style:text-decoration={false && categorySelected === data.category ? 'underline' : 'none'}
			>
				{data.category} ({data.nrPizzas})
			</text>
		</g>
	{/each}
</g>

<style>
	.pizza-slice {
	}

	.pizza-slice-label {
		font-weight: bold;
	}
</style>
