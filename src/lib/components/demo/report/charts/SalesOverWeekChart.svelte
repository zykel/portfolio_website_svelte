<script>
	import { getContext } from 'svelte';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { max } from 'd3-array';
	import { daysOfWeek, daysOfWeekFullMap, defaultColor } from '$lib/scripts/utilityReport.js';
	import PointerAnnotation from './PointerAnnotation.svelte';

	let { dataWeek } = $props();

	const margin = { top: 60, right: 0, bottom: 30, left: 40 };

	const extents = getContext('extents');
	const showHoverInfo = $derived(getContext('showHoverInfo').value);
	const hideHoverInfo = $derived(getContext('hideHoverInfo').value);
	const width = $derived(extents.widthLimited - extents.chartPadding * 2);
	const height = 300;

	const xScale = $derived(
		scaleBand()
			.domain(daysOfWeek)
			.range([margin.left, width - margin.right])
			.padding(0.2)
	);
	const yScale = $derived(
		scaleLinear()
			.domain([
				0,
				max(dataWeek, (/** @type {{day: string, nrSalesAvg: number}}*/ d) => d.nrSalesAvg) * 1.1
			])
			.range([height - margin.bottom, margin.top])
	);

	let hoveredDay = $state('');
	const nrYAxisTicks = 4;
</script>

<div id="insight-allocate-staff" class="chart">
	<h3 class="chart-title">Number of sales per weekday</h3>
	{#if width > 0}
		<svg class="chart-svg" {width} {height}>
			<g class="axis-x">
				{#each daysOfWeek as day}
					<text
						x={xScale(day) + xScale.bandwidth() / 2}
						y={height - margin.bottom + 7}
						text-anchor="middle"
						class="tick"
						dominant-baseline="hanging"
						style:font-weight={hoveredDay === day ? 'bold' : 'normal'}
					>
						{day}
					</text>
				{/each}
			</g>
			<g class="axis-y">
				{#each yScale.ticks(nrYAxisTicks) as tick}
					<text x={margin.left - 10} y={yScale(tick)} text-anchor="end" class="tick" dy="0.3em">
						{tick}
					</text>
					<line
						class="axis-y-gridline"
						x1={margin.left}
						y1={yScale(tick)}
						x2={width - margin.right}
						y2={yScale(tick)}
						stroke="lightgray"
						stroke-width="1"
					/>
				{/each}
				<text x={0} y={yScale.range()[1]} class="axis-title">↑ Average number of sales </text>
			</g>
			<g class="bars">
				{#each dataWeek as { day, nrSalesAvg }, i}
					<defs>
						<clipPath id="weekchart-clip-top-corners-{i}">
							<rect
								x={xScale(day) + (hoveredDay === day ? -2 : 0)}
								y={yScale(nrSalesAvg) + (hoveredDay === day ? -2 : 0)}
								width={xScale.bandwidth() + (hoveredDay === day ? +4 : 0)}
								height={height - yScale(nrSalesAvg) + (hoveredDay === day ? +4 : 0)}
								ry="7"
							/>
						</clipPath>
					</defs>
					<rect
						x={xScale(day)}
						y={yScale(nrSalesAvg)}
						width={xScale.bandwidth()}
						height={yScale.range()[0] - yScale(nrSalesAvg)}
						fill={defaultColor}
						clip-path="url(#weekchart-clip-top-corners-{i})"
						stroke="black"
						stroke-width={hoveredDay === day ? 2 : 0}
					/>
				{/each}
			</g>

			{#if width < 550}
				<!-- Fallback if width too small -->
				<text
					x={xScale('Fr') + xScale.bandwidth() / 2}
					y={20}
					class="label-small"
					text-anchor="middle"
					font-weight="bold"
				>
					Fridays, the most pizzas are
				</text>
				<text
					x={xScale('Fr') + xScale.bandwidth() / 2}
					y={40}
					class="label-small"
					text-anchor="middle"
					font-weight="bold"
				>
					sold on average, namely 159.
				</text>
				<defs>
					<marker id="arrowhead" markerWidth="5" markerHeight="4" refX="0" refY="2" orient="auto">
						<polygon points="0 0, 5 2, 0 4" />
					</marker>
				</defs>

				<path
					d={`M${xScale('Fr') + xScale.bandwidth() / 2},${48} ${xScale('Fr') + xScale.bandwidth() / 2},${yScale(dataWeek[4].nrSalesAvg) - 12}`}
					stroke="black"
					fill="transparent"
					stroke-width="2"
					marker-end="url(#arrowhead)"
				/>
			{:else}
				<PointerAnnotation
					x={xScale('Fr') + xScale.bandwidth() / 2}
					y={yScale(dataWeek[4].nrSalesAvg)}
					placement={'topright'}
					text={'Fridays, the most pizzas are sold on average, namely 159.'}
					width={150}
				/>
			{/if}
			<g class="ghost-hover-bars">
				{#each dataWeek as { day, nrSalesAvg }, i}
					{@const handlePointerOver = (/** @type {PointerEvent} */ event) => {
						hoveredDay = day;
						showHoverInfo({
							event,
							infoText: [
								{ title: 'Day: ', value: daysOfWeekFullMap.get(day) },
								{
									title: 'Average number of sales: ',
									value: yScale.tickFormat(nrYAxisTicks)(nrSalesAvg)
								}
							]
						});
					}}

					<rect
						class="ghost-hover-bar"
						onpointerover={handlePointerOver}
						onpointermove={handlePointerOver}
						onpointerout={() => {
							hoveredDay = '';
							hideHoverInfo();
						}}
						x={xScale(day)}
						y={yScale(nrSalesAvg)}
						width={xScale.step()}
						height={height - yScale(nrSalesAvg)}
						fill="transparent"
						cursor="default"
					/>
				{/each}
			</g>
		</svg>
	{/if}
</div>
