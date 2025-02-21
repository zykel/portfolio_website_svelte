<script>
	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
	 */

	import { getContext, onMount, setContext } from 'svelte';
	import { rollups, sum } from 'd3-array';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import LoadingCircle from '$lib/components/demo/dashboard/LoadingCircle.svelte';
	import PizzaBarchart from '$lib/components/demo/dashboard/PizzaBarchart.svelte';
	import { getPizzaBarchartData } from '$lib/scripts/utilityDashboard.svelte';

	let { width, height } = $props();
	const margin = getContext('margin');

	// $inspect({ width, height });

	const labelAreaWidth = 210;
	const gapLeftToChart = 20;
	const reorderButtonAreaHeight = 10;

	const widths = $derived({
		labels: labelAreaWidth,
		chartCounts: (width - margin.left - margin.right - labelAreaWidth) / 2 - gapLeftToChart,
		chartPrices: (width - margin.left - margin.right - labelAreaWidth) / 2 - gapLeftToChart
	});

	const x0s = $derived({
		labels: margin.left,
		chartCounts: margin.left + widths.labels + gapLeftToChart,
		chartPrices: margin.left + widths.labels + gapLeftToChart + widths.chartCounts + gapLeftToChart
	});

	const data = getContext('data');
	const selected = getContext('selected');

	// TODO: Theoretically first apply time filter on data

	const barchartData = $derived(getPizzaBarchartData(data, selected.type));
	let sortingOrder = $state({ value: { key: 'countTotal', order: 'desc' } });
	let barchartDataSorted = $state(barchartData.slice());

	const sortBarcharts = () => {
		if (barchartDataSorted.length === 0) {
			barchartDataSorted = barchartData.slice();
		}
		barchartDataSorted = barchartDataSorted
			.slice()
			.sort(
				(/** @type {{ [x: string]: number; }} */ a, /** @type {{ [x: string]: number; }} */ b) => {
					if (sortingOrder.value.order === 'asc') {
						return a[sortingOrder.value.key] - b[sortingOrder.value.key];
					} else {
						return b[sortingOrder.value.key] - a[sortingOrder.value.key];
					}
				}
			);
	};

	sortBarcharts();
	// const barchartDataSorted = $derived(
	//     barchartData.slice().sort((a, b) => {
	//         if (sortingOrder.value.order === 'asc') {
	//             return a[sortingOrder.value.key] - b[sortingOrder.value.key];
	//         } else {
	//             return b[sortingOrder.value.key] - a[sortingOrder.value.key];
	//         }
	//     })
	// );

	const yScale = $derived(
		scaleBand()
			.domain(barchartDataSorted.map((/** @type {{ name: any; }} */ d) => d.name))
			.range([margin.top + reorderButtonAreaHeight, height - margin.bottom])
			.padding(0.3)
	);

	/** @type {{value: null | string}} */
	let hoveredPizzaName = $state({ value: null });
	const updateHoveredPizzaName = (/** @type {string | null} */ name) => {
		hoveredPizzaName.value = name;
	};
	setContext('hoveredPizzaName', hoveredPizzaName);
	setContext('updateHoveredPizzaName', updateHoveredPizzaName);

	let loaded = $state(false);

	onMount(() => {
		loaded = true;
	});
</script>

<LoadingCircle {loaded} />
{#if width > 0}
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
		<g class="barchart-hover-out-g" onpointerleave={() => updateHoveredPizzaName(null)}>
			<rect
				class="barchart-hover-out-rect"
				x="x0s.labels"
				y={yScale.range()[0]}
				width={x0s.chartPrices + widths.chartPrices - x0s.labels}
				height={yScale.range()[1] - yScale.range()[0]}
				fill="transparent"
			/>
			<g class="barchart-horizontal-helperlines">
				{#each yScale.domain() as name, i}
					<line
						onpointerover={() => updateHoveredPizzaName(name)}
						x1={x0s.labels + widths.labels + gapLeftToChart / 2}
						x2={x0s.chartPrices + widths.chartPrices}
						y1={yScale(name) + yScale.bandwidth() / 2}
						y2={yScale(name) + yScale.bandwidth() / 2}
						stroke={hoveredPizzaName.value === name ? 'rgb(32, 32, 32)' : 'gray'}
						stroke-width={hoveredPizzaName.value === name ? 2 : 1}
						stroke-opacity={hoveredPizzaName.value === name ? 1 : 1 / 3}
					/>
				{/each}
			</g>
			<g class="barchart-counts">
				<PizzaBarchart
					data={barchartDataSorted}
					x0={x0s.chartCounts}
					width={widths.chartCounts}
					{yScale}
					valueAccessor={'countTotal'}
				/>
			</g>
			<g class="barchart-prices">
				<PizzaBarchart
					data={barchartDataSorted}
					x0={x0s.chartPrices}
					width={widths.chartPrices}
					{yScale}
					valueAccessor={'priceTotal'}
				/>
			</g>
			<g class="barchart-labels">
				{#each yScale.domain() as name, i}
					<text
						onpointerover={() => updateHoveredPizzaName(name)}
						class="axis-label-small{hoveredPizzaName.value === name ? ' hovered' : ''}"
						x={x0s.labels + widths.labels}
						y={yScale(name) + yScale.bandwidth() / 2}
						text-anchor="end"
					>
						{name.replace(' Pizza', ' ')}
					</text>
				{/each}
			</g>
		</g>
		<g class="barchart-reorder-titles">
			<foreignObject
				x={x0s.chartCounts}
				y={reorderButtonAreaHeight + margin.top - 30}
				width={widths.chartCounts}
				height="30"
			>
				<div class="barchart-reorder-title">
					Counts
					<button
						onclick={() => {
							sortingOrder.value = { key: 'countTotal', order: 'asc' };
							sortBarcharts();
						}}>&uarr;</button
					>
					<button
						onclick={() => {
							sortingOrder.value = { key: 'countTotal', order: 'desc' };
							sortBarcharts();
						}}>&darr;</button
					>
				</div>
			</foreignObject>
			<foreignObject
				x={x0s.chartPrices}
				y={reorderButtonAreaHeight + margin.top - 30}
				width={widths.chartPrices}
				height="30"
			>
				<div class="barchart-reorder-title">
					Prices
					<button
						onclick={() => {
							sortingOrder.value = { key: 'priceTotal', order: 'asc' };
							sortBarcharts();
						}}>↑</button
					>
					<button
						onclick={() => {
							sortingOrder.value = { key: 'priceTotal', order: 'desc' };
							sortBarcharts();
						}}>&darr;</button
					>
				</div>
			</foreignObject>
		</g>
	</svg>
{/if}

<style>
	svg {
		width: 100%;
		height: 100%;
		/* background-color: rgb(213, 213, 213); */
	}
</style>
