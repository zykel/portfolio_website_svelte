<script>
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { area, curveCardinal } from 'd3-shape';
	import { getContext } from 'svelte';
	import { Tween } from 'svelte/motion';

	let { data, width, height, stepNr } = $props();
	$inspect(data);
	const maxCount = $derived(Math.max(...data.map((/** @type {{ count: any; }} */ d) => d.count)));

	const chartHeight = 200;
	const chartWidth = $derived(Math.min(600, width));

	const xScale = $derived(
		scaleBand()
			.domain(data.map((/** @type {{ time: any; }} */ d) => d.time))
			.range([width / 2 - chartWidth / 2, width / 2 + chartWidth / 2])
			.padding(0.1)
	);

	const yScale = $derived(
		scaleLinear()
			.domain([0, maxCount])
			.range([height / 2 + chartHeight / 2, height / 2 - chartHeight / 2])
	);

	// Create the line generator
	const lineGenerator = $derived(
		area()
			.x((/** @type {any} */ d) => xScale(d.time) + xScale.bandwidth() / 2)
			.y0((/** @type {any} */ d) => yScale(0))
			.y1((/** @type {any} */ d) => yScale(d.count))
			.curve(curveCardinal)
	);

	const xTicks = ['11:00', '13:00', '15:00', '17:00', '19:00', '21:00', '23:00'];
	$inspect(xTicks);

	const opacityNoonCovers = new Tween(0);

	const getStepNrFromIdPart2 = getContext('getStepNrFromIdPart2');

	$effect(() => {
		opacityNoonCovers.target = stepNr === getStepNrFromIdPart2('most_busy_noon') ? 0.7 : 0;
	});
</script>

{#snippet coverRect(
	/** @type {string} */ startTime,
	/** @type {string} */ endTime,
	/** @type {number} */ opacity
)}
	<rect
		class="cover-rect"
		x={xScale(startTime) + xScale.bandwidth() / 2}
		y={yScale.range()[1]}
		width={xScale(endTime) - xScale(startTime)}
		height={yScale.range()[0] - yScale.range()[1]}
		fill="white"
		{opacity}
	/>
{/snippet}

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
	<defs>
		<linearGradient id="line-chart-gradient" x1="0" x2="0" y1="1" y2="0">
			<stop offset="0%" stop-color="hsl(249, 80%, 90%)" />
			<stop offset="100%" stop-color="hsl(249, 80%, 67%)" />
		</linearGradient>
		<filter id="line-chart-blur-filter" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur in="SourceGraphic" stdDeviation="5" />
		</filter>
	</defs>
	<path
		d={lineGenerator(data)}
		fill="url(#line-chart-gradient)"
		stroke="lightgray"
		stroke-width="1"
	/>
	<g class="x-axis-g">
		{#each xTicks as tick, i}
			<text
				x={xScale(tick) + xScale.bandwidth() / 2}
				y={height / 2 + chartHeight / 2 + 10}
				class="x-axis-text label-small"
				text-anchor="middle"
				dominant-baseline="hanging"
				fill={'gray'}
				font-size="1.5rem"
			>
				{tick}
			</text>
		{/each}
	</g>

	{@render coverRect('10:00', '11:30', opacityNoonCovers.current)}
	{@render coverRect('14:00', '23:45', opacityNoonCovers.current)}
	<!-- {@render coverRect('14:00', '17:00')}
	{@render coverRect('20:00', '23:45')} -->
</svg>

<style>
	svg {
		/* background-color: #d1e6c3; */
	}
</style>
