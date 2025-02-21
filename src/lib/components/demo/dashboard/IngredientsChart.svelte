<script>
	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
	 */

	import { getContext, onMount, setContext } from 'svelte';
	import { rollups, sum } from 'd3-array';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { interpolate } from 'd3-interpolate';
	import { plot, dot, dodgeX, axisY, gridY } from '@observablehq/plot';
	import LoadingCircle from '$lib/components/demo/dashboard/LoadingCircle.svelte';
	import { getIngredientsChartData, dodge } from '$lib/scripts/utilityDashboard.svelte';

	let { width, height } = $props();
	const margin = getContext('margin');

	const data = getContext('data');
	const selected = getContext('selected');

	// TODO: Theoretically first apply time filter on data

	const chartData = $derived(getIngredientsChartData(data, selected.type));

	const colorScale = $derived(
		scaleLinear()
			.domain([0, 30000])
			.range(['#bcd1e8', '#bf9bc7']) // Less vibrant blueish tone to more vibrant purple-ish/pink tone
			.interpolate(interpolate)
	);

	const maxRadius = 10;

	const xScale = $derived(
		scaleLinear()
			.domain([0, Math.max(...chartData.map((d) => d.count))])
			.range([margin.left, (width - margin.right) / 2])
	);
	const yScale = $derived(
		scaleBand()
			.domain(chartData.map((d) => d.ingredient))
			.range([margin.top, height - margin.bottom])
			.padding(0.1)
	);

	const yScaleBeeswarm = $derived(
		scaleLinear()
			.domain([0, Math.max(...chartData.map((d) => d.count))])
			.range([height - margin.bottom, margin.top])
	);
	const rScaleBeeswarm = $derived(
		scaleLinear()
			.domain([0, Math.max(...chartData.map((d) => d.count))])
			.range([2, maxRadius])
	);

	const getBeeswarmChartData = (/** @type {{ ingredient: string; count: number; }[]} */ data) => {
		const beeswarmChartDataFlipped = dodge(data, {
			radius: (d) => rScaleBeeswarm(d.count),
			x: (d) => yScaleBeeswarm(d.count)
		});

		const beeswarmChartData = beeswarmChartDataFlipped.map(
			(/** @type {{ y: any; x: any; r: any; data: any; }} */ d) => ({
				cx: width - d.y - maxRadius,
				cy: d.x,
				r: d.r,
				datum: d.data
			})
		);

		return beeswarmChartData;
	};

	const beeswarmChartData = $derived(getBeeswarmChartData(/**@type {DataEntry[]} data*/ chartData));
	$inspect(beeswarmChartData);

	// const dotPlot = $derived(
	// 	height > 0 && height > 0
	// 		? plot({
	// 				height,
	// 				width,
	// 				r: { range: [2, 10] },
	// 				marks: [
	// 					dot(
	// 						chartData,
	// 						dodgeX({
	// 							y: 'count',
	// 							r: 'count',
	// 							fill: (d) => colorScale(d.count),
	// 							stroke: 'rgb(190,190,190)',
	// 							tip: true,
	// 							anchor: 'right'
	// 						})
	// 					),
	// 					axisY({ anchor: 'left', label: 'nr used', labelAnchor: 'top' }),
	// 					gridY()
	// 				]
	// 			})
	// 		: null
	// );

	// let plotContainer = $state();

	// $effect(() => {
	// 	if (plotContainer && dotPlot !== null) {
	// 		plotContainer.innerHTML = ''; // Clear the container
	// 		plotContainer.appendChild(dotPlot); // Append the new chart
	// 	}
	// });

	let loaded = $state(false);

	onMount(() => {
		loaded = true;
	});

	const showLolli = true;
</script>

<LoadingCircle {loaded} />
{#if width > 0}
	{#if showLolli}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
			{#each chartData as item, i}
				<line
					class="ingredients-lollipop-line"
					x1={xScale(0)}
					y1={yScale(item.ingredient)}
					x2={xScale(item.count)}
					y2={yScale(item.ingredient)}
					stroke={colorScale(item.count)}
				/>
				<circle
					class="ingredients-lollipop-dot"
					cx={xScale(item.count)}
					cy={yScale(item.ingredient)}
					r="4"
					fill={colorScale(item.count)}
				/>
				<text
					class="ingredients-lollipop-label"
					x={xScale(item.count) + 5}
					y={yScale(item.ingredient) + 5}
					fill={'lightgray'}
					font-size="0.7em"
				>
					{item.ingredient}
				</text>
			{/each}
		</svg>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
			{#each beeswarmChartData as item, i}
				<text
					class="ingredients-lollipop-label"
					x={item.cx - item.r - 2}
					y={item.cy + 4}
					fill={'gray'}
					text-anchor="end"
					font-size="0.7em"
					opacity={(item.r - 2) / 8}
				>
					{item.datum.ingredient}
				</text>
			{/each}
			{#each beeswarmChartData as item, i}
				<circle
					class="ingredients-lollipop-dot"
					cx={item.cx}
					cy={item.cy}
					r={item.r}
					fill={colorScale(item.datum.count)}
				/>
			{/each}
		</svg>
	{/if}
	<!-- <div class="plot-container" bind:this={plotContainer}></div> -->
{/if}

<style>
	svg {
		width: 100%;
		height: 100%;
		/* background-color: rgb(213, 213, 213); */
	}

	.plot-container {
		width: 100%;
		height: 100%;
	}
</style>
