<script>
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { max } from 'd3-array';
	import { getContext } from 'svelte';
	import { defaultColor } from '$lib/scripts/utilityReport.js';
	import AxisXTop from './AxisXTop.svelte';

	let { data } = $props();

	const extents = getContext('extents');
	const width = $derived(extents.widthLimited);

	const margin = { top: 55, right: 30, bottom: 30, left: 130 };

	let topN = $state(10);
	const dataTopN = $derived(data.slice(0, topN));

	const barHeight = 20;
	const height = $derived(topN * barHeight + margin.top + margin.bottom);

	const maxCount = $derived(max(dataTopN, (/** @type {any} */ d) => d.count));
	const ingredients = $derived(dataTopN.map((/** @type {any} */ d) => d.ingredient));

	const xScale = $derived(
		scaleLinear()
			.domain([0, maxCount])
			.range([margin.left, width - margin.right])
	);

	const yScale = $derived(
		scaleBand()
			.domain(ingredients)
			.range([margin.top, height - margin.bottom])
			.padding(0.2)
	);

	const nrXAxisTicks = 4;
</script>

<div class="chart">
	<!-- radio selection of 3 options bound to the value to topN -->
	<div class="radio-selection legend">
		Show top
		<span class="ingredients-radio-selection-options">
			<label>
				<input type="radio" bind:group={topN} value={10} />10
			</label>
			<label>
				<input type="radio" bind:group={topN} value={20} />20
			</label>
			<label>
				<input type="radio" bind:group={topN} value={data.length} />all
			</label>
		</span>
		ingredients.
	</div>
	<svg class="chart-svg" {width} {height}>
		{#if width > 0}
			<AxisXTop
				{xScale}
				{yScale}
				{margin}
				nrTicks={nrXAxisTicks}
				axisTitle={'Number of times used'}
			/>
			<g class="ingredients-clip-bars">
				<defs>
					{#each dataTopN as { ingredient, count }, i}
						<clipPath id="ingredients-clip-right-corners-{i}">
							<rect
								x={margin.left - 10}
								y={yScale(ingredient)}
								width={xScale(count) + 10 - margin.left}
								height={yScale.bandwidth()}
								rx="5"
							/>
						</clipPath>
					{/each}
				</defs>
			</g>
			<g class="ingredients-bars">
				{#each dataTopN as { ingredient, count }, i}
					<rect
						x={margin.left}
						y={yScale(ingredient)}
						width={xScale(count) - margin.left}
						height={yScale.bandwidth()}
						fill={defaultColor}
						clip-path="url(#ingredients-clip-right-corners-{i})"
					/>
				{/each}
			</g>

			<g class="axis-y">
				{#each dataTopN as { ingredient, count }, i}
					<text
						x={5}
						y={yScale(ingredient) + yScale.bandwidth() / 2}
						dominant-baseline="middle"
						text-anchor="beginning"
					>
						{ingredient}
					</text>
				{/each}
			</g>
		{/if}
	</svg>
</div>

<style>
	.ingredients-radio-selection-options {
		margin: 0 8px;
	}
	label {
		text-decoration: underline;
		margin: 0 3px;
	}
	input,
	label {
		cursor: pointer;
	}
</style>
