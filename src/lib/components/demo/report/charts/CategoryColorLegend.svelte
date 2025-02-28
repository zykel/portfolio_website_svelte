<script>
	import { getContext } from 'svelte';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { max, rollups, sum } from 'd3-array';
	import { pizzaCategories, categoryColorScale } from '$lib/scripts/utilityReport.js';

	const margin = { top: 20, right: 20, bottom: 20, left: 150 };

	const extents = getContext('extents');
	const categories = categoryColorScale.domain();
</script>

<div class="category-color-legend legend">
	<div class="label-small" style:font-weight="bold">Category:</div>
	{#each categories as category}
		<div class="category-color-legend-item">
			<div
				class="category-color-legend-color"
				style="background-color: {categoryColorScale(category)};"
			></div>
			<div class="category-color-legend-text label-small">{category}</div>
		</div>
	{/each}
</div>

<style>
	.category-color-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
	}

	.category-color-legend-item {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.category-color-legend-color {
		width: 15px;
		height: 15px;
		border-radius: 50%;
	}
</style>
