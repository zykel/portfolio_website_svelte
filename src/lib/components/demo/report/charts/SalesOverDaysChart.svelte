<script>
	import { scaleTime, scaleLinear, scaleBand } from 'd3-scale';
	import { extent, histogram, max, range } from 'd3-array';
	import { curveCardinal, line, area } from 'd3-shape';
	import { select } from 'd3-selection';
	import { getContext } from 'svelte';
	import { timeOfDayDomain } from '$lib/scripts/utilityReport.js';

	let { dataDays } = $props();

	const extents = getContext('extents');
	const showHoverInfo = $derived(getContext('showHoverInfo').value);
	const hideHoverInfo = $derived(getContext('hideHoverInfo').value);
	const width = $derived(extents.widthLimited);
	const height = 500;

	const margin = { top: 20, right: 30, bottom: 30, left: 40 };

	$inspect(dataDays);

	const xScale = $derived(
		scaleBand()
			.domain(timeOfDayDomain)
			.range([margin.left, width - margin.right])
			.padding(0.1)
	);

	const maxFrequency = $derived(
		max(dataDays, (/** @type {any} */ d) =>
			Math.max(...d.frequencyInfoArray.map((/** @type {any} */ e) => e.frequency))
		)
	);
	$inspect(maxFrequency);

	const heightSingleChart = $derived((height - margin.bottom - margin.top) / 7);

	const yScale = $derived(
		scaleLinear()
			.domain([0, maxFrequency])
			.range([heightSingleChart * 1.5, 0])
	);

	// Create the line generator
	const lineGenerator = $derived(
		area()
			.x((/** @type {any} */ d) => xScale(d.time))
			.y0((/** @type {any} */ d) => yScale(0))
			.y1((/** @type {any} */ d) => yScale(d.frequency))
			.curve(curveCardinal)
	);
</script>

<div class="chart">
	<svg class="chart-svg" {width} {height}>
		{#if width > 0}
			<defs>
				{#each dataDays as { day }, i}
					<linearGradient id="gradient-{i}" x1="0" x2="0" y1="1" y2="0">
						<stop offset="0%" stop-color="hsla(249, 80%, 67%, 0.3)" />
						<stop offset="100%" stop-color="hsla(249, 80%, 67%, 0.9)" />
					</linearGradient>
				{/each}
			</defs>
			{#each dataDays as { day, frequencyInfoArray }, i}
				<g class="daytime-path-g" transform="translate(0, {i * heightSingleChart})">
					<path
						d={lineGenerator(frequencyInfoArray)}
						fill="url(#gradient-{i})"
						stroke="lightgray"
						stroke-width="1"
					/>
				</g>
			{/each}
		{/if}
	</svg>
</div>
