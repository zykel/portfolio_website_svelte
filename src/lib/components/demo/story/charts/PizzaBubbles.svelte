<script>
	import { categoryColorScale } from '$lib/scripts/utilityStory.js';
	import { scaleLinear } from 'd3-scale';
	import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
	import { Tween } from 'svelte/motion';
	import { elasticOut } from 'svelte/easing';

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

	const yScaleCount = $derived(
		scaleLinear()
			.domain([
				Math.min(...pizzaDataSelected.map((/** @type {{ count: any; }} */ d) => d.count)),
				Math.max(...pizzaDataSelected.map((/** @type {{ count: any; }} */ d) => d.count))
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
			if (stepNr >= startStep1_2) {
				// Price
				const dataForcePrice = getDataForce('price');
				const forceDatumPrice = dataForcePrice.find(
					(/** @type {any} */ dForce) => dForce.data.name === d.name
				);
				d.xPrice.target = forceDatumPrice.x;
				d.yPrice.target = forceDatumPrice.y;
				// r is the same for price and count
				d.r.target = forceDatumPrice.r;
				// Count
				const dataForceCount = getDataForce('count');
				const forceDatumCount = dataForceCount.find(
					(/** @type {any} */ dForce) => dForce.data.name === d.name
				);
				d.xCount.target = forceDatumCount.x;
				d.yCount.target = forceDatumCount.y;
			} else {
				d.xPrice.target = xPrice;
				d.yPrice.target = yScalePrice(d.price) - height;
				d.r.target = circleRadius;
				d.xCount.target = xCount;
				d.yCount.target = yScaleCount(d.count) - height;
			}
		});
	});

	// $inspect(pizzaDataSelected.find((d) => d.name === pizzaNameHovered));
</script>

<g class="price-circles">
	{#each pizzaDataTweened as { xPrice, yPrice, xCount, yCount, r, category, name, price, count }, i}
		<circle
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
			fill={categoryColorScale(category)}
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
			fill={categoryColorScale(category)}
			cursor="pointer"
		/>
	{/each}
</g>
