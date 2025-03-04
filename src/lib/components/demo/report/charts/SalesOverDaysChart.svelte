<script>
	import { scaleTime, scaleLinear, scaleBand } from 'd3-scale';
	import { extent, histogram, max, range } from 'd3-array';
	import { curveCardinal, line, area } from 'd3-shape';
	import { select } from 'd3-selection';
	import { getContext } from 'svelte';
	import { timeOfDayDomain, timeBinningWidthMinutes } from '$lib/scripts/utilityReport.js';
	import ContinuousColorLegend from '$lib/components/demo/report/charts/ContinuousColorLegend.svelte';
	import PointerAnnotation from '$lib/components/demo/report/charts/PointerAnnotation.svelte';

	let { dataDays } = $props();

	const extents = getContext('extents');
	const width = $derived(extents.widthLimited);
	const height = 500;

	const margin = { top: 20, right: 30, bottom: 80, left: 30 };

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
	const getMaxFrequencyInfo = () => {
		let day;
		let dayIdx = 0;
		let time;
		let frequency;
		dataDays.forEach((/** @type {any} */ d, /** @type {Number} */ i) =>
			d.frequencyInfoArray.forEach((/** @type {any} */ e) => {
				if (e.frequency === maxFrequency) {
					day = d.day;
					dayIdx = i;
					time = e.time;
					frequency = e.frequency;
				}
			})
		);

		return { day, dayIdx, time, frequency };
	};
	const maxFrequencyInfo = $derived(getMaxFrequencyInfo());

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

	let hoverTime = $state('');

	const showHoverInfo = (
		/** @type {PointerEvent & { currentTarget: EventTarget & SVGRectElement; }} */ event
	) => {
		// Determine the element from the xScale domain to which the hovered x position corresponds
		const x = event.clientX - event.currentTarget.getBoundingClientRect().left;
		const timeIndex = Math.floor(x / xScale.step());
		if (timeIndex < 0 || timeIndex >= timeOfDayDomain.length) return;
		const time = timeOfDayDomain[timeIndex];
		hoverTime = time;
	};

	const hideHoverInfo = () => {
		hoverTime = '';
	};
</script>

<div class="chart">
	<ContinuousColorLegend
		title="Number of sales per {timeBinningWidthMinutes} minutes"
		minVal="0 sales"
		maxVal="{Math.round(maxFrequency * 10) / 10} sales"
		minColor="hsl(249, 80%, 90%)"
		maxColor="hsl(249, 80%, 67%)"
	/>
	<svg class="chart-svg" {width} {height}>
		{#if width > 0}
			<g class="x-axis-g">
				{#each timeOfDayDomain as time, i}
					{#if time.includes(':00') && +time.split(':')[0] % 4 === 2}
						<text
							class="x-axis-text label-small"
							x={xScale(time) + xScale.bandwidth() / 2}
							y={height - margin.bottom + 40}
							text-anchor="middle"
							dominant-baseline="hanging"
						>
							{time}
						</text>
					{/if}
				{/each}
				<text
					class="x-axis-text label-small"
					x={(xScale.range()[1] + xScale.range()[0]) / 2}
					y={height - margin.bottom + 75}
					text-anchor="middle"
				>
					Time of day →
				</text>
			</g>
			<defs>
				{#each dataDays as { day }, i}
					<linearGradient id="gradient-{i}" x1="0" x2="0" y1="1" y2="0">
						<stop offset="0%" stop-color="hsl(249, 80%, 90%)" />
						<stop offset="100%" stop-color="hsl(249, 80%, 67%)" />
					</linearGradient>
				{/each}
			</defs>
			{#each dataDays as { day, frequencyInfoArray }, i}
				<g class="daytime-path-g" transform="translate(0, {i * heightSingleChart + margin.top})">
					<path
						d={lineGenerator(frequencyInfoArray)}
						fill="url(#gradient-{i})"
						stroke="lightgray"
						stroke-width="1"
					/>
				</g>
			{/each}
			<g class="y-axis-g">
				{#each dataDays as { day, frequencyInfoArray }, i}
					<text
						x={1}
						y={i * heightSingleChart + margin.top + yScale(0)}
						class="y-axis-text label-small"
						text-anchor="beginning"
					>
						{day}
					</text>
				{/each}
			</g>
			<PointerAnnotation
				x={xScale(maxFrequencyInfo.time)}
				y={yScale(maxFrequencyInfo.frequency) +
					maxFrequencyInfo.dayIdx * heightSingleChart +
					margin.top}
				widthArrow={xScale(maxFrequencyInfo.time) - xScale('11:00')}
				heightArrow={10}
				placement={'topleft'}
				text={'The hightest sales peak is on Thursday between 12:45 and 13:00, with 6.98.'}
				width={(xScale('11:00') - xScale.range()[0]) * 0.8}
				height={270}
				baseline="top"
			/>
			{#if hoverTime !== ''}
				<g class="hover-info-g">
					<!-- svelte-ignore component_name_lowercase -->
					<path
						d="M {xScale(hoverTime) +
							(xScale(hoverTime) > width / 2 ? -200 : 200)} {margin.top} L {xScale(
							hoverTime
						)} {margin.top} L {xScale(hoverTime)} {margin.top + 6 * heightSingleChart + yScale(0)}"
						stroke="black"
						fill="none"
					/>
					<text
						class="daytime-hover-label label-small"
						x={xScale(hoverTime) + (xScale(hoverTime) > width / 2 ? -5 : +5)}
						y={margin.top - 10}
						dominant-baseline="middle"
						text-anchor={xScale(hoverTime) > width / 2 ? 'end' : 'start'}
					>
						Sales between {hoverTime} and {timeOfDayDomain[timeOfDayDomain.indexOf(hoverTime) + 1]}
					</text>
					{#each dataDays as { day, frequencyInfoArray }, i}
						{@const frequency = frequencyInfoArray.find(
							(/** @type {any} */ d) => d.time === hoverTime
						).frequency}
						{@const x = xScale(hoverTime)}
						{@const y = yScale(frequency)}
						<g
							class="daytime-hover-circle-g"
							transform="translate(0, {i * heightSingleChart + margin.top})"
						>
							<circle cx={x} cy={y} r="5" fill="none" stroke="black" stroke-width="2" />
							<text
								class="daytime-hover-label label-small"
								x={x + (x > width / 2 ? -10 : +10)}
								{y}
								dominant-baseline="middle"
								text-anchor={x > width / 2 ? 'end' : 'start'}
							>
								{Math.round(frequency * 100) / 100} sales
							</text></g
						>
					{/each}
				</g>
			{/if}
			<rect
				class="hover-overlay"
				x={margin.left}
				y={0}
				width={width - margin.left - margin.right - xScale.step() - 5}
				{height}
				fill="transparent"
				pointer-events="all"
				onpointerover={showHoverInfo}
				onpointermove={showHoverInfo}
				onpointerleave={hideHoverInfo}
			/>
		{/if}
	</svg>
</div>

<style>
	.daytime-hover-label {
		font-weight: bold;
		text-shadow:
			-1px -1px 0 rgba(255, 255, 255, 0.5),
			1px -1px 0 rgba(255, 255, 255, 0.5),
			-1px 1px 0 rgba(255, 255, 255, 0.5),
			1px 1px 0 rgba(255, 255, 255, 0.5); /* Create a white border around the text */
	}
</style>
