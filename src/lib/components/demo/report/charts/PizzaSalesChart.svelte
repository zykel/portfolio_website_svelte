<script>
	import { getContext } from 'svelte';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { max, rollups, sum } from 'd3-array';
	import { pizzaCategories, categoryColorScale } from '$lib/scripts/utilityReport.js';
	import CategoryColorLegend from '$lib/components/demo/report/charts/CategoryColorLegend.svelte';
	import AxisXTop from '$lib/components/demo/report/charts/AxisXTop.svelte';
	import BracketAnnotation from '$lib/components/demo/report/charts/BracketAnnotation.svelte';

	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
	 * @typedef {Object.<string, string> & { name: string, nrSales: number, category: string }} DataGroupedEntry
	 */

	let { dataGrouped, nrTopPizzas, nrBottomPizzas } = $props();

	const margin = { top: 55, right: 80, bottom: 5, left: 150 };

	const extents = getContext('extents');
	const width = $derived(extents.width);

	const rowHeight = 20;

	const pizzaNames = $derived(dataGrouped.map((/**@type DataGroupedEntry */ d) => d.name));
	const maxSales = $derived(max(dataGrouped, (/** @type {{ nrSales: number; }} */ d) => d.nrSales));

	const xScale = $derived(
		scaleLinear()
			.domain([0, maxSales * 1.1])
			.range([margin.left, width - margin.right])
	);

	const yScale = $derived(
		scaleBand()
			.domain(pizzaNames)
			.range([margin.top, dataGrouped.length * rowHeight])
			.padding(0.2)
	);

	const height = $derived(yScale.range()[1] - yScale.range()[0] + margin.top + margin.bottom);
</script>

<div class="chart">
	<CategoryColorLegend />

	<svg class="chart-svg" {width} {height}>
		<AxisXTop {xScale} {yScale} {margin} nrTicks={4} axisTitle={'Number of sales'} />
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
		<BracketAnnotation
			topleft={{ x: xScale(dataGrouped[0].nrSales) + 5, y: yScale(dataGrouped[0].name) }}
			topright={{ x: xScale(dataGrouped[0].nrSales) + 20, y: yScale(dataGrouped[0].name) }}
			bottomright={{
				x: xScale(dataGrouped[0].nrSales) + 20,
				y: yScale(dataGrouped[nrTopPizzas - 1].name) + yScale.bandwidth()
			}}
			bottomleft={{
				x: xScale(dataGrouped[nrTopPizzas - 1].nrSales) + 5,
				y: yScale(dataGrouped[nrTopPizzas - 1].name) + yScale.bandwidth()
			}}
			directionOpen={'left'}
			text={'The most sold pizzas'}
		/>
		<BracketAnnotation
			topleft={{
				x: xScale(dataGrouped[dataGrouped.length - 1].nrSales) + 5,
				y: yScale(dataGrouped[dataGrouped.length - 1].name)
			}}
			topright={{
				x: xScale(dataGrouped[dataGrouped.length - 1].nrSales) + 20,
				y: yScale(dataGrouped[dataGrouped.length - 1].name)
			}}
			bottomright={{
				x: xScale(dataGrouped[dataGrouped.length - 1].nrSales) + 20,
				y: yScale(dataGrouped[dataGrouped.length - 1].name) + yScale.bandwidth()
			}}
			bottomleft={{
				x: xScale(dataGrouped[dataGrouped.length - 1].nrSales) + 5,
				y: yScale(dataGrouped[dataGrouped.length - 1].name) + yScale.bandwidth()
			}}
			directionOpen={'left'}
			text={'The least sold pizza'}
			width={200}
		/>
	</svg>
</div>
