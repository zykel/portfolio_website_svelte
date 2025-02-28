<script>
	import { getContext } from 'svelte';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { max, rollups, sum } from 'd3-array';
	import {
		pizzaCategories,
		categoryColorScale,
		getDataGrouped
	} from '$lib/scripts/utilityReport.js';
	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
	 */

	let { data } = $props();

	const margin = { top: 20, right: 20, bottom: 20, left: 200 };

	const extents = getContext('extents');
	const width = $derived(extents.width);

	const rowHeight = 20;

	const dataGrouped = $derived(getDataGrouped(data));

	// const dataGrouped = $derived(Object.groupBy(data, (d) => d.pizza_name));

	const pizzaNames = $derived(dataGrouped.map((d) => d.name));
	const maxSales = $derived(max(dataGrouped, (/** @type {{ nrSales: number; }} */ d) => d.nrSales));
	$inspect(pizzaCategories);

	const xScale = $derived(
		scaleLinear()
			.domain([0, maxSales * 1.1])
			.range([margin.left, width - margin.right])
	);

	const yScale = $derived(
		scaleBand()
			.domain(pizzaNames)
			.range([margin.top, dataGrouped.length * rowHeight])
			.padding(0.1)
	);

	const height = $derived(yScale.range()[1] - yScale.range()[0] + margin.top + margin.bottom);
</script>

<svg class="chart" {width} {height}>
	<g class="bars">
		{#each dataGrouped as { name, nrSales, category }, i}
			<defs>
				<clipPath id="clip-right-corners-{i}">
					<rect
						x={-10}
						y={yScale(name)}
						width={xScale(nrSales) + 10}
						height={yScale.bandwidth()}
						rx="5"
					/>
				</clipPath>
			</defs>
			<rect
				x={margin.left}
				y={yScale(name)}
				width={xScale(nrSales) - margin.left}
				height={yScale.bandwidth()}
				fill={categoryColorScale(category)}
				clip-path="url(#clip-right-corners-{i})"
			/>
			<text
				x={xScale(nrSales) + 5}
				y={yScale(name) + yScale.bandwidth() / 2}
				dominant-baseline="middle"
			>
				{nrSales}
			</text>
		{/each}
	</g>
	<g class="axis-y">
		{#each dataGrouped as { name, nrSales, category }, i}
			<text
				x={margin.left - 5}
				y={yScale(name) + yScale.bandwidth() / 2}
				dominant-baseline="middle"
				text-anchor="end"
			>
				{name.replace('The ', '').replace(' Pizza', '')}
			</text>
		{/each}
	</g>
</svg>
