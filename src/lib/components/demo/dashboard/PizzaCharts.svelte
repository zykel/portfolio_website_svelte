<script>
	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
	 */

	import { getContext, onMount, setContext } from 'svelte';
	import { rollups, sum } from 'd3-array';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { getPizzaBarchartData } from '$lib/scripts/utilityDashboard.svelte';
	import LoadingCircle from '$lib/components/demo/dashboard/LoadingCircle.svelte';
	import PizzaBarchart from '$lib/components/demo/dashboard/PizzaBarchart.svelte';
	import BarchartReorderTitles from '$lib/components/demo/dashboard/BarchartReorderTitles.svelte';
	import PizzaBarchartLabels from '$lib/components/demo/dashboard/PizzaBarchartLabels.svelte';
	import PizzaBarchartPins from '$lib/components/demo/dashboard/PizzaBarchartPins.svelte';

	let { width, height } = $props();
	const margin = getContext('margin');

	// $inspect({ width, height });

	const pinAreaWidth = 20;
	const labelAreaWidth = 140;
	const gapLeftToChart = 20;
	const reorderButtonAreaHeight = 10;
	const tableLineHeight = 16;

	const widths = $derived({
		pins: pinAreaWidth,
		labels: labelAreaWidth,
		chartCounts:
			(width - margin.left - margin.right - labelAreaWidth - pinAreaWidth) / 2 - gapLeftToChart,
		chartPrices:
			(width - margin.left - margin.right - labelAreaWidth - pinAreaWidth) / 2 - gapLeftToChart
	});

	const x0s = $derived({
		pins: margin.left,
		labels: margin.left + widths.pins,
		chartCounts: margin.left + widths.labels + widths.pins + gapLeftToChart,
		chartPrices:
			margin.left +
			widths.labels +
			widths.pins +
			gapLeftToChart +
			widths.chartCounts +
			gapLeftToChart
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
				(
					/** @type {{ [x: string]: number | string; }} */ a,
					/** @type {{ [x: string]: number | string; }} */ b
				) => {
					const key = sortingOrder.value.key;
					const sortAlphabetically = key === 'name';
					if (sortingOrder.value.order === 'asc') {
						if (!sortAlphabetically) return Number(a[key]) - Number(b[key]);
						return a[key].toString().localeCompare(b[key].toString());
					} else {
						if (!sortAlphabetically) return Number(b[key]) - Number(a[key]);
						return b[key].toString().localeCompare(a[key].toString());
					}
				}
			);
	};

	sortBarcharts();

	$inspect({ barchartData, barchartDataSorted });

	const fullScrollHeight = $derived(
		margin.top +
			reorderButtonAreaHeight +
			tableLineHeight * barchartDataSorted.length +
			margin.bottom
	);

	const yScale = $derived(
		scaleBand()
			.domain(barchartDataSorted.map((/** @type {{ name: any; }} */ d) => d.name))
			.range([margin.top + reorderButtonAreaHeight, fullScrollHeight - margin.bottom])
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
	<div
		class="barcharts-svg-container"
		style="overflow: {height < fullScrollHeight ? 'auto' : 'hidden'};"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {fullScrollHeight}">
			<g class="barchart-horizontal-helperlines">
				{#each yScale.domain() as name, i}
					<line
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
			<PizzaBarchartLabels {x0s} {yScale} />
			<g class="barchart-overarching-hover-rects">
				{#each barchartDataSorted as item, i}
					<rect
						onpointerover={() => updateHoveredPizzaName(item.name)}
						onpointerleave={() => updateHoveredPizzaName(null)}
						x={x0s.pins}
						y={yScale(item.name)}
						width={widths.pins +
							widths.labels +
							widths.chartCounts +
							widths.chartPrices +
							gapLeftToChart * 2}
						height={yScale.step()}
						fill="transparent"
					/>
				{/each}
			</g>
			<PizzaBarchartPins {x0s} {yScale} />
			<BarchartReorderTitles
				{x0s}
				{widths}
				{margin}
				{reorderButtonAreaHeight}
				{sortingOrder}
				{sortBarcharts}
			/>
		</svg>
	</div>
{/if}

<style>
	/* Style the scrollbar for WebKit browsers (Chrome, Safari) */
	.barcharts-svg-container::-webkit-scrollbar {
		width: 12px; /* Width of the vertical scrollbar */
		height: 12px; /* Height of the horizontal scrollbar */
	}

	.barcharts-svg-container::-webkit-scrollbar-track {
		background: transparent; /* Transparent background for the track */
		border-radius: 10px; /* Rounded edges for the track */
	}

	.barcharts-svg-container::-webkit-scrollbar-track:hover {
		background: rgba(100, 100, 100, 0.1); /* Transparent background for the track */
		border-radius: 10px; /* Rounded edges for the track */
	}

	.barcharts-svg-container::-webkit-scrollbar-thumb {
		background-color: rgba(100, 100, 100, 0.4); /* Semi-transparent thumb color */
		border-radius: 10px; /* Rounded edges for the thumb */
		border: 3px solid transparent; /* Add some space around the thumb */
		background-clip: content-box; /* Clip the background to the content box */
	}

	.barcharts-svg-container {
		width: 100%;
		height: 100%;
	}
</style>
