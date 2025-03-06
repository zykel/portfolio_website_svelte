<script>
	import { defaultColor } from '$lib/scripts/utilityReport';
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { max } from 'd3-array';

	let {
		width,
		height,
		ingredientsData,
		nrIngredients,
		combination,
		hoveredIngredient,
		handlePointerOver,
		handlePointerOut
	} = $props();

	const mostUsedIngredientsData = $derived(ingredientsData.slice(0, nrIngredients));
	const mostUsedIngredients = $derived(
		mostUsedIngredientsData.map((/** @type {{ ingredient: any; }} */ d) => d.ingredient)
	);

	const xScale = $derived(scaleBand().domain(mostUsedIngredients).range([0, width]).padding(0.1));

	const maxCount = $derived(
		max(mostUsedIngredientsData, (/** @type {{ count: number; }} */ d) => d.count)
	);
	const yScale = $derived(
		scaleLinear()
			.domain([0, maxCount])
			.range([height - 1, 1])
	);

	const getColor = (/** @type {string} */ ingredient) => {
		if (combination.includes(ingredient)) {
			return defaultColor;
			if (hoveredIngredient === '') {
				return defaultColor;
			} else {
				if (hoveredIngredient === ingredient) {
					return defaultColor;
				} else {
					return 'gray';
				}
			}
		} else {
			return 'lightgray';
		}
	};
</script>

<svg class="chart-svg" {width} {height}>
	{#each mostUsedIngredientsData as ingredientDatum, i}
		<rect
			x={xScale(ingredientDatum.ingredient)}
			y={yScale(ingredientDatum.count)}
			width={xScale.bandwidth()}
			height={yScale(0) - yScale(ingredientDatum.count)}
			fill={getColor(ingredientDatum.ingredient)}
			stroke="black"
			stroke-width={hoveredIngredient === ingredientDatum.ingredient &&
			combination.includes(ingredientDatum.ingredient)
				? 2
				: 0}
		/>
		{#if combination.includes(ingredientDatum.ingredient)}
			<rect
				class="ghost-hover-rect"
				x={xScale(ingredientDatum.ingredient)}
				y={yScale.range()[1]}
				width={xScale.bandwidth()}
				height={yScale.range()[0] - yScale.range()[1]}
				fill="transparent"
				onpointerover={() => handlePointerOver(ingredientDatum.ingredient)}
				onpointerout={handlePointerOut}
			/>
		{/if}
	{/each}
</svg>
