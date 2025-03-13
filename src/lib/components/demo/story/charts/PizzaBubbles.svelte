<script>
	import { categoryColorScale, categoryColorScaleExtraLight } from '$lib/scripts/utilityStory.js';
	import { scaleLinear } from 'd3-scale';
	import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
	import { Tween } from 'svelte/motion';
	import { elasticOut } from 'svelte/easing';
	import { getContext } from 'svelte';
	import PizzaIcon from './PizzaIcon.svelte';

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
		margin,
		startStep1_2,
		stepNr,
		categorySelected,
		pizzaNameHovered = $bindable()
	} = $props();

	const circleRadius = 25;

	const getStepNrFromId = getContext('getStepNrFromId');

	const axisTitleOffset = $derived(width / 10);
	const axisTitlePriceY = new Tween(-height / 2, { easing: elasticOut, duration: 2000 });
	$effect(() => {
		axisTitlePriceY.target = stepNr >= startStep1_2 ? height / 2 : -height / 2;
	});
	const axisTitlePopularityY = new Tween(-height / 2, { easing: elasticOut, duration: 2000 });
	$effect(() => {
		axisTitlePopularityY.target =
			stepNr >= getStepNrFromId('reveal_pizza_popularity_axis') ? height / 2 : -height / 2;
	});

	const xPrice = $derived(width / 4);
	const xCount = $derived((width / 4) * 3);

	const pizzaDataSelected = $derived(
		data.filter((/** @type {{ category: any; }} */ d) => d.category === categorySelected)
	);

	const yScalePrice = $derived(
		scaleLinear()
			.domain([
				Math.min(...pizzaDataSelected.map((/** @type {{ price: any; }} */ d) => d.price)),
				Math.max(...pizzaDataSelected.map((/** @type {{ price: any; }} */ d) => d.price))
			])
			.range([height - margin.bottom, margin.top])
	);

	const maxCount = $derived(
		Math.max(...pizzaDataSelected.map((/** @type {{ count: any; }} */ d) => d.count))
	);

	const yScaleCount = $derived(
		scaleLinear()
			.domain([
				Math.min(...pizzaDataSelected.map((/** @type {{ count: any; }} */ d) => d.count)),
				maxCount
			])
			.range([height - margin.bottom, margin.top])
	);

	const getDataForce = (type = 'price') => {
		const dataForce = pizzaDataSelected.map(
			(/** @type {{ price: any; count: any; name: string; }} */ d) => {
				return {
					x0: type === 'price' ? xPrice : xCount,
					y0: type === 'price' ? yScalePrice(d.price) : yScaleCount(d.count),
					r: pizzaNameHovered === d.name ? circleRadius * 2 : circleRadius,
					data: d
				};
			}
		);

		const simulation = forceSimulation(dataForce)
			.force('x', forceX((/** @type {{ x0: any; }} */ d) => d.x0).strength(0.5))
			.force('y', forceY((/** @type {{ y0: any; }} */ d) => d.y0).strength(1))
			.force(
				'collide',
				forceCollide((/** @type {{ r: any; }} */ d) => d.r)
			);

		const ticks = 100;
		for (let i = 0; i < ticks; i++) simulation.tick();

		return dataForce;
	};

	const pizzaDataTweened = $derived(
		data
			.filter((/** @type {{ category: any; }} */ d) => d.category === categorySelected)
			.map((/** @type {any} */ d) => {
				return {
					...d,
					xPrice: new Tween(xPrice, { easing: elasticOut, duration: 2000 }),
					yPrice: new Tween(-2 * circleRadius, { easing: elasticOut, duration: 2000 }),
					xCount: new Tween(xCount, { easing: elasticOut, duration: 2000 }),
					yCount: new Tween(-2 * circleRadius, { easing: elasticOut, duration: 2000 }),
					r: new Tween(circleRadius, { easing: elasticOut, duration: 1000 })
				};
			})
	);

	$effect(() => {
		pizzaDataTweened.forEach((/** @type {any} */ d) => {
			// Price
			if (stepNr >= startStep1_2) {
				const dataForcePrice = getDataForce('price');
				const forceDatumPrice = dataForcePrice.find(
					(/** @type {any} */ dForce) => dForce.data.name === d.name
				);
				d.xPrice.target = forceDatumPrice.x;
				d.yPrice.target = forceDatumPrice.y;
				// r is the same for price and count
				d.r.target = forceDatumPrice.r;
			} else {
				d.xPrice.target = xPrice;
				d.yPrice.target = yScalePrice(d.price) - height;
				d.r.target = circleRadius;
			}

			// Count
			if (stepNr >= getStepNrFromId('reveal_pizza_popularity_axis')) {
				const dataForceCount = getDataForce('count');
				const forceDatumCount = dataForceCount.find(
					(/** @type {any} */ dForce) => dForce.data.name === d.name
				);
				d.xCount.target = forceDatumCount.x;
				d.yCount.target = forceDatumCount.y;
			} else {
				d.xCount.target = xCount;
				d.yCount.target = yScaleCount(d.count) - height;
			}
		});
	});

	const pizzaNameHoveredWordArray = $derived(pizzaNameHovered.split(' '));
</script>

<text
	class="bubble-axis-title"
	x={axisTitleOffset}
	y={axisTitlePriceY.current}
	transform={`rotate(-90, ${axisTitleOffset}, ${axisTitlePriceY.current})`}
	text-anchor="middle"
>
	Price →
</text>
<text
	class="bubble-axis-title"
	x={width - axisTitleOffset}
	y={axisTitlePopularityY.current}
	transform={`rotate(90, ${width - axisTitleOffset}, ${axisTitlePopularityY.current})`}
	text-anchor="middle"
>
	← Popularity
</text>

{#if stepNr >= startStep1_2}
	{#if pizzaNameHovered !== ''}
		<rect
			class="pizza-bubbles-name-background"
			x={width / 2 - 10}
			y={axisTitlePriceY.current - (pizzaNameHoveredWordArray.length / 2 + 1) * 30}
			width={20}
			height={(pizzaNameHoveredWordArray.length + 0.3) * 30}
			fill="white"
		/>
	{/if}
{/if}

<!-- <text
	class="bubble-axis-title"
	x={axisTitleOffset}
	y={axisTitlePriceY.current - height / 4}
	text-anchor="middle"
>
	{#each '↑ PRICE'.split('') as char}
		<tspan dy="0.8em" x={axisTitleOffset}>{char}</tspan>
	{/each}
</text>
<text
	class="bubble-axis-title"
	x={width - axisTitleOffset}
	y={axisTitlePriceY.current - height / 4}
	text-anchor="middle"
>
	{#each '↑ POPULARITY'.split('') as char}
		<tspan dy="0.8em" x={width - axisTitleOffset}>{char}</tspan>
	{/each}
</text> -->
<g class="price-circles">
	{#each pizzaDataTweened as { xPrice, yPrice, xCount, yCount, r, category, name, price, count }, i}
		{@const fill = ['', name].includes(pizzaNameHovered)
			? categoryColorScale(category)
			: 'lightgray'}
		{@const fillExtraLight = ['', name].includes(pizzaNameHovered)
			? categoryColorScaleExtraLight(category)
			: 'rgb(231, 231, 231)'}
		<!-- <circle
			onpointerdown={(event) => {
				event.stopPropagation();
				pizzaNameHovered = name;
			}}
			onpointerover={(event) => {
				console.log(price);
			}}
			cx={xPrice.current}
			cy={yPrice.current}
			r={r.current}
			{fill}
			cursor="pointer"
		/>
		<circle
			onpointerdown={(event) => {
				event.stopPropagation();
				pizzaNameHovered = name;
			}}
			onpointerover={(event) => {
				console.log(count);
			}}
			cx={xCount.current}
			cy={yCount.current}
			r={r.current}
			{fill}
			cursor="pointer"
		/> -->

		<PizzaIcon
			x={xPrice.current - r.current}
			y={yPrice.current - r.current}
			width={2 * r.current}
			height={2 * r.current}
			transform="rotate({(i * 30) % 360} {xPrice.current} {yPrice.current})"
			colorMain={fill}
			colorSauce={fillExtraLight}
			onpointerdown={(/** @type {PointerEvent} */ event) => {
				event.stopPropagation();
				pizzaNameHovered = name;
			}}
			cursor="pointer"
		/>

		<PizzaIcon
			x={xCount.current - r.current}
			y={yCount.current - r.current}
			width={2 * r.current}
			height={2 * r.current}
			transform="rotate({(i * 30) % 360} {xCount.current} {yCount.current})"
			colorMain={fill}
			colorSauce={fillExtraLight}
			onpointerdown={(/** @type {PointerEvent} */ event) => {
				event.stopPropagation();
				pizzaNameHovered = name;
			}}
			cursor="pointer"
		/>
		{#if pizzaNameHovered === name}
			<text
				x={xPrice.current}
				y={yPrice.current}
				text-anchor="middle"
				font-size="1.5rem"
				fill="black"
				font-weight="bold"
				dominant-baseline="middle">{price} $</text
			>
			<text
				x={xCount.current}
				y={yCount.current}
				text-anchor="middle"
				font-size="1.5rem"
				fill="black"
				font-weight="bold"
				dominant-baseline="middle">{Math.round((count / maxCount) * 100)} %</text
			>
		{/if}
	{/each}
</g>

<!-- <defs>
	<filter id="pizza-bubbles-drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
		<feMorphology operator="dilate" radius="5" in="SourceAlpha" result="dilated" />
		<feFlood flood-color="white" result="whiteFill" />
		<feComposite in="whiteFill" in2="dilated" operator="in" result="whiteOutline" />
		<feMerge>
			<feMergeNode in="whiteOutline" />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
</defs> -->
{#if stepNr >= startStep1_2}
	{#if pizzaNameHovered !== ''}
		{#each pizzaNameHoveredWordArray as word, i}
			<text
				onpointerdown={(event) => {
					event.stopPropagation();
				}}
				x={width / 2}
				y={axisTitlePriceY.current +
					(pizzaNameHoveredWordArray.length / 2) * 30 -
					(pizzaNameHoveredWordArray.length - i) * 30}
				text-anchor="middle"
				font-size="2rem"
				font-weight="bold"
				fill={categoryColorScale(categorySelected)}
			>
				{word}
			</text>
		{/each}
	{/if}
{/if}

<!-- <text
	x={width / 2}
	y={height * 0.9}
	text-anchor="middle"
	font-size="2rem"
	font-weight="bold"
	fill={categoryColorScale(categorySelected)}
>
	{pizzaNameHovered}
</text> -->

<style>
	.bubble-axis-title {
		font-size: 2rem;
		font-weight: bold;
		fill: rgb(157, 157, 157);
		/* stroke: black;
		stroke-width: 2px; */
	}
</style>
