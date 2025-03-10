<script>
	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
	 */

	import { getContext, onMount, setContext } from 'svelte';
	import { rollups, sum } from 'd3-array';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { interpolate } from 'd3-interpolate';
	import { max } from 'd3-array';
	import { plot, dot, dodgeX, axisY, gridY } from '@observablehq/plot';
	import LoadingCircle from '$lib/components/demo/dashboard/LoadingCircle.svelte';
	import { getIngredientsChartData, dodge } from '$lib/scripts/utilityDashboard.svelte';
	import LolliElements from '$lib/components/demo/dashboard/LolliElements.svelte';
	import LolliAxisX from '$lib/components/demo/dashboard/LolliAxisX.svelte';

	let { width, height, ingredientsFilterString } = $props();
	const margin = getContext('margin');

	const data = getContext('data');
	const selected = getContext('selected');
	const focusedItems = getContext('focusedItems');

	// TODO: Theoretically first apply time filter on data

	const chartData = $derived(getIngredientsChartData(data, selected.type, focusedItems));
	const chartDataFiltered = $derived(
		chartData.filter((d) =>
			d.ingredient.toLowerCase().includes(ingredientsFilterString.toLowerCase())
		)
	);

	const colorScale = $derived(
		scaleLinear()
			.domain([0, max(chartDataFiltered, (/** @type {{ count: any; }} */ d) => d.count)])
			.range(['#bcd1e8', '#bf9bc7']) // Less vibrant blueish tone to more vibrant purple-ish/pink tone
			.interpolate(interpolate)
	);

	const minRadius = 4;
	const maxRadius = 10;

	const axisHeight = 20;

	const lolliMinLineHeight = 16;

	const xScale = $derived(
		scaleLinear()
			.domain([0, Math.max(...chartDataFiltered.map((d) => d.count))])
			.range([margin.left, (width - margin.right) / 2])
	);
	const yScale = $derived(
		scaleBand()
			.domain(chartDataFiltered.map((d) => d.ingredient))
			.range([
				margin.top + axisHeight,
				margin.top + axisHeight + chartDataFiltered.length * lolliMinLineHeight
			])
			.padding(0.1)
	);

	/** @type {string | null}*/
	let hoveredIngredient = $state(null);

	// const yScaleBeeswarm = $derived(
	// 	scaleLinear()
	// 		.domain([0, Math.max(...chartData.map((d) => d.count))])
	// 		.range([height - margin.bottom, margin.top])
	// );
	// const rScaleBeeswarm = $derived(
	// 	scaleLinear()
	// 		.domain([0, Math.max(...chartData.map((d) => d.count))])
	// 		.range([minRadius, maxRadius])
	// );

	// const getBeeswarmChartData = (/** @type {{ ingredient: string; count: number; }[]} */ data) => {
	// 	const beeswarmChartDataFlipped = dodge(data, {
	// 		radius: (d) => rScaleBeeswarm(d.count),
	// 		x: (d) => yScaleBeeswarm(d.count)
	// 	});

	// 	const beeswarmChartData = beeswarmChartDataFlipped.map(
	// 		(/** @type {{ y: any; x: any; r: any; data: any; }} */ d) => ({
	// 			cx: width - d.y - maxRadius,
	// 			cy: d.x,
	// 			r: d.r,
	// 			datum: d.data
	// 		})
	// 	);

	// 	return beeswarmChartData;
	// };

	// const beeswarmChartData = $derived(getBeeswarmChartData(/**@type {DataEntry[]} data*/ chartData));

	/**
	 * Checks if the bounding rectangle of a given element overlaps with any of the bounding rectangles from an array of elements.
	 * @param {SVGTextElement} element - The element to check for overlaps.
	 * @param {(SVGTextElement | null)[]} elementsArray - The array of elements to check against.
	 * @returns {boolean} - True if there is an overlap, false otherwise.
	 */
	function isOverlapping(element, elementsArray) {
		const rect1 = element.getBoundingClientRect();

		return elementsArray.some((el) => {
			if (el === null) {
				return false;
			}
			const rect2 = el.getBoundingClientRect();

			return !(
				rect1.right < rect2.left ||
				rect1.left > rect2.right ||
				rect1.bottom < rect2.top ||
				rect1.top > rect2.bottom
			);
		});
	}

	//  Entries will look like this: { ingredient: string, element: SVGTextElement, overlap: boolean }
	/**
	 * @type {Array<{ ingredient: string, element: SVGTextElement | null }>}
	 */
	const labelOverlapInfo = $derived(
		chartData.map((d) => d.ingredient).map((ingredient) => ({ ingredient, element: null }))
	);

	const getOverlapInfo = (/** @type {string} */ ingredient) => {
		const index = chartData.findIndex((d) => d.ingredient === ingredient);
		const element = labelOverlapInfo[index].element;
		if (element === null) {
			return 0;
		}
		const elementsArray = labelOverlapInfo
			.filter((d) => d.ingredient !== ingredient)
			.map((d) => d.element);
		const overlap = isOverlapping(element, elementsArray);
		return overlap ? 0 : 1;
	};
	// TODO: Müsste glaube oben nur ein array an label references erstellen und dann hier erst die overlap infos deriven indem ich eine zusaätzliche methode schreibe, die für alle ingredients die overlap info berechnet - könnte das dann als ein obj returnen, auf das ich im markup zugreife

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
		<div
			class="lolli-svg-container"
			style="overflow: {height < chartData.length * lolliMinLineHeight ? 'auto' : 'hidden'};"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 {width} {axisHeight + (chartDataFiltered.length + 2) * lolliMinLineHeight}"
			>
				<LolliAxisX {xScale} {yScale} {axisHeight} />
				{#each chartDataFiltered.slice().reverse() as item, i}
					<LolliElements {item} {xScale} {yScale} {colorScale} {width} bind:hoveredIngredient />
				{/each}
			</svg>
		</div>
	{:else}
		<!-- <svg class="beeswarm-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
			{#each beeswarmChartData as item, i}
				<text
					class="ingredients-lollipop-label"
					x={item.cx - item.r - 2}
					y={item.cy + 4}
					fill={'gray'}
					text-anchor="end"
					font-size="0.7em"
					bind:this={labelOverlapInfo[i].element}
					opacity={getOverlapInfo(item.datum.ingredient)}
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
		</svg> -->
	{/if}
	<!-- <div class="plot-container" bind:this={plotContainer}></div> -->
{/if}

<style>
	.beeswarm-svg {
		width: 100%;
		height: 100%;
		/* background-color: rgb(213, 213, 213); */
	}

	/* Style the scrollbar for WebKit browsers (Chrome, Safari) */
	.lolli-svg-container::-webkit-scrollbar {
		width: 12px; /* Width of the vertical scrollbar */
		height: 12px; /* Height of the horizontal scrollbar */
	}

	.lolli-svg-container::-webkit-scrollbar-track {
		background: transparent; /* Transparent background for the track */
		border-radius: 10px; /* Rounded edges for the track */
	}

	.lolli-svg-container::-webkit-scrollbar-track:hover {
		background: rgba(100, 100, 100, 0.1); /* Transparent background for the track */
		border-radius: 10px; /* Rounded edges for the track */
	}

	.lolli-svg-container::-webkit-scrollbar-thumb {
		background-color: rgba(100, 100, 100, 0.4); /* Semi-transparent thumb color */
		border-radius: 10px; /* Rounded edges for the thumb */
		border: 3px solid transparent; /* Add some space around the thumb */
		background-clip: content-box; /* Clip the background to the content box */
	}

	.lolli-svg-container {
		width: 100%;
		height: 100%;
	}

	.plot-container {
		width: 100%;
		height: 100%;
	}
</style>
