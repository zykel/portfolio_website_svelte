<script>
	import { getContext } from 'svelte';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { max } from 'd3-array';
	import { pizzaCategories, categoryColorScale } from '$lib/scripts/utilityReport.js';
	import CategoryColorLegend from '$lib/components/demo/report/charts/CategoryColorLegend.svelte';
	import AxisXTop from '$lib/components/demo/report/charts/AxisXTop.svelte';
	import BracketAnnotation from '$lib/components/demo/report/charts/BracketAnnotation.svelte';
	import { get } from 'svelte/store';

	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
	 * @typedef {Object.<string, string> & { name: string, nrSales: number, category: string }} DataGroupedEntry
	 */

	let { dataGrouped, nrTopPizzas, nrBottomPizzas } = $props();

	const margin = { top: 55, right: 80, bottom: 5, left: 130 };

	const extents = getContext('extents');
	const showHoverInfo = $derived(getContext('showHoverInfo').value);
	const hideHoverInfo = $derived(getContext('hideHoverInfo').value);
	const width = $derived(extents.widthLimited);

	const rowHeight = 20;
	const nrXAxisTicks = 4;

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

	let hoveredName = $state('');
</script>

<div class="chart">
	<CategoryColorLegend />

	<svg class="chart-svg" {width} {height}>
		{#if width > 0}
			<AxisXTop {xScale} {yScale} {margin} nrTicks={nrXAxisTicks} axisTitle={'Number of sales'} />
			<g class="bars">
				{#each dataGrouped as { name, nrSales, category }, i}
					<defs>
						<clipPath id="clip-right-corners-{i}">
							<rect
								x={-10}
								y={yScale(name) + (hoveredName === name ? -2 : 0)}
								width={xScale(nrSales) + 10 + (hoveredName === name ? 2 : 0)}
								height={yScale.bandwidth() + (hoveredName === name ? 4 : 0)}
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
						stroke="black"
						stroke-width={hoveredName === name ? 2 : 0}
					/>
				{/each}
			</g>
			<g class="axis-y">
				<defs>
					<linearGradient
						gradientUnits="userSpaceOnUse"
						x1="0"
						x2={margin.left}
						y1="0"
						y2="0"
						id="pizzas-truncateText"
					>
						<stop offset="90%" stop-opacity="1" />
						<stop offset="100%" stop-opacity="0" />
					</linearGradient>
				</defs>
				{#each dataGrouped as { name, nrSales, category }, i}
					<text
						x={1}
						y={yScale(name) + yScale.bandwidth() / 2}
						dominant-baseline="middle"
						text-anchor="beginning"
						style:font-weight={hoveredName === name ? 'bold' : 'normal'}
						fill="url(#pizzas-truncateText)"
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
			<g class="ghost-hover-bars">
				{#each dataGrouped as { name, nrSales, category }, i}
					{@const handlePointerOver = (/** @type {PointerEvent} */ event) => {
						hoveredName = name;
						showHoverInfo({
							event,
							infoText: [
								{ title: 'Name: ', value: name },
								{ title: 'Number of sales: ', value: xScale.tickFormat(nrXAxisTicks)(nrSales) },
								{
									title: 'Category: ',
									value: `<span style="color:${categoryColorScale(category)}; font-weight: bold">${category}</span>`
								}
							]
						});
					}}

					<rect
						class="ghost-hover-bar"
						onpointerover={handlePointerOver}
						onpointermove={handlePointerOver}
						onpointerout={() => {
							hoveredName = '';
							hideHoverInfo();
						}}
						x={0}
						y={yScale(name)}
						width={xScale(nrSales)}
						height={yScale.step()}
						fill="transparent"
						cursor="pointer"
					/>
				{/each}
			</g>
		{/if}
	</svg>
</div>
