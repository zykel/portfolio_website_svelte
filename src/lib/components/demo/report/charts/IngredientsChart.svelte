<script>
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { max } from 'd3-array';
	import { getContext } from 'svelte';
	import { defaultColor } from '$lib/scripts/utilityReport.js';

	let { data } = $props();

	const extents = getContext('extents');
	const width = $derived(extents.widthLimited);

	const margin = { top: 20, right: 30, bottom: 30, left: 130 };

	const topN = 20;
	const dataTopN = $derived(data.slice(0, topN));

	const barHeight = 20;
	const height = topN * barHeight + margin.top + margin.bottom;

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
			.padding(0.1)
	);
</script>

<div class="chart">
	<svg class="chart-svg" {width} {height}>
		{#if width > 0}
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
