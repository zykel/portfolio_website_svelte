<script>
	import { getContext, onMount, setContext } from 'svelte';
	import { max, rollups, sum } from 'd3-array';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import LoadingCircle from '$lib/components/demo/dashboard/LoadingCircle.svelte';
	import { daysOfWeek, hoursOfDay, getTimeVizData } from '$lib/scripts/utilityDashboard.svelte';
	import Line from '$lib/components/demo/dashboard/Line.svelte';
	import AxisX from '$lib/components/demo/dashboard/AxisX.svelte';

	let { width, height } = $props();
	const margin = getContext('margin');

	// $inspect({ width, height });

	const data = getContext('data');
	const timeUnit = $derived(getContext('selected').timeUnit);
	const selected = getContext('selected');

	const timeVizData = $derived(getTimeVizData(data, timeUnit, selected.type));

	const xScale = $derived(
		scaleBand()
			.domain(
				timeUnit === 'day of week' ? daysOfWeek : timeUnit === 'hour of day' ? hoursOfDay : []
			)
			.range([margin.left, width - margin.right])
		// .paddingOuter(0.25)
	);

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

	$inspect({ range: yScale.range(), width, height });

	let loaded = $state(false);

	onMount(() => {
		loaded = true;
	});
</script>

<LoadingCircle {loaded} />
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
	<g class="lines">
		{#each timeVizData as item}
			<Line {item} {xScale} {yScale} />
		{/each}
	</g>
	<AxisX {xScale} {yScale} tickLabelsAll={xScale.domain()} />
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
