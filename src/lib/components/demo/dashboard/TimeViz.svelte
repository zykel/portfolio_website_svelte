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
	import AxisY from './AxisY.svelte';

	let { width, height } = $props();
	const margin = getContext('margin');

	// $inspect({ width, height });

	const data = getContext('data');
	const selected = getContext('selected');

	const timeVizData = $derived(getTimeVizData(data, selected.timeUnit, selected.type));

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
			.range([margin.left, width - margin.right])
			.paddingOuter((domain.length / 7) * 0.25)
			.align(1);

		return scale;
	};

	const xScale = $derived(getXScale(selected.timeUnit, width, margin));

	const yScale = $derived(
		scaleLinear()
			.domain([
				0,
				max(timeVizData, (/** @type {{ records: any; }} */ d) =>
					max(d.records, (/** @type {{ count: any; }} */ e) => e.count)
				)
			])
			.range([height - margin.bottom, margin.top])
	);

	let loaded = $state(false);

	onMount(() => {
		loaded = true;
	});
</script>

<LoadingCircle {loaded} />
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
	<AxisX {xScale} {yScale} tickLabelsAll={xScale.domain()} />
	<AxisY {xScale} {yScale} tickLabelsAll={yScale.ticks(3)} />
	<g class="lines">
		{#each timeVizData as item}
			<Line {item} {xScale} {yScale} />
		{/each}
	</g>
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
		/* display: block; */
		/* background-color: aquamarine; */
	}

	.svg-container {
	}
</style>
