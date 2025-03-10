<script>
	import { getContext, onMount, setContext } from 'svelte';
	import { max, rollups, sum } from 'd3-array';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import LoadingCircle from '$lib/components/demo/dashboard/LoadingCircle.svelte';
	import {
		daysOfWeek,
		hoursOfDay,
		getTimeVizData,
		monthsOfYear
	} from '$lib/scripts/utilityDashboard.svelte';
	import Line from '$lib/components/demo/dashboard/Line.svelte';
	import AxisX from '$lib/components/demo/dashboard/AxisX.svelte';
	import AxisY from '$lib/components/demo/dashboard/AxisY.svelte';
	import TimeVizBrush from '$lib/components/demo/dashboard/TimeVizBrush.svelte';
	import TimeVizGradient from '$lib/components/demo/dashboard/TimeVizGradient.svelte';

	let { width, height } = $props();
	const margin = getContext('margin');

	// $inspect({ width, height });

	const data = getContext('data');
	const selected = getContext('selected');

	const timeVizData = $derived(getTimeVizData(data, selected.timeUnit, selected.type));

	const hoveredPizzaName = getContext('hoveredPizzaName');
	const timeVizDataHoverOrdered = $derived([
		...timeVizData.filter((d) => d.name !== hoveredPizzaName.value),
		...timeVizData.filter((d) => d.name === hoveredPizzaName.value)
	]);

	const yAxisLabelWidth = 70;
	const yScaleTopPaddingFactor = 1.1;

	/**
	 * @param {string} timeUnit
	 * @param {number} width
	 * @param {{ left: number, right: number }} margin
	 */
	const getXScale = (timeUnit, width, margin) => {
		const domain =
			timeUnit === 'day of week'
				? daysOfWeek
				: timeUnit === 'hour of day'
					? hoursOfDay
					: monthsOfYear;
		const scale = scaleBand()
			.domain(domain)
			.range([margin.left + yAxisLabelWidth, width - margin.right - 2]); // Magix 3 to have the handle in
		// .paddingOuter((domain.length / 7) * 0.25);
		// .align(1);

		return scale;
	};

	const xScale = $derived(getXScale(selected.timeUnit, width, margin));

	const yScale = $derived(
		scaleLinear()
			.domain([
				0,
				max(timeVizData, (/** @type {{ records: any; }} */ d) =>
					max(d.records, (/** @type {{ count: any; }} */ e) => e.count)
				) * yScaleTopPaddingFactor
			])
			.range([height - margin.bottom, margin.top])
	);

	let svgTimeViz = $state();

	let loaded = $state(false);

	onMount(() => {
		loaded = true;
	});
</script>

<LoadingCircle {loaded} />
{#if width > 0}
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" bind:this={svgTimeViz}>
		<AxisX {xScale} {yScale} {yAxisLabelWidth} tickLabelsAll={xScale.domain()} />
		<AxisY {xScale} {yScale} {yAxisLabelWidth} tickLabelsAll={yScale.ticks(3)} />
		<TimeVizGradient {yScale} {height} />
		<g class="lines">
			{#each timeVizDataHoverOrdered as item}
				<Line {item} {xScale} {yScale} {yScaleTopPaddingFactor} />
			{/each}
		</g>
		<TimeVizBrush {xScale} {yScale} {svgTimeViz} />
	</svg>
{/if}

<style>
	svg {
		width: 100%;
		height: 100%;
	}
</style>
