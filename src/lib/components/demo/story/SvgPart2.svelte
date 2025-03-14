<script>
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { area, curveCardinal } from 'd3-shape';
	import { getContext } from 'svelte';
	import { sineIn } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	let { data, width, height, stepNr } = $props();
	$inspect(data);
	const maxCount = $derived(Math.max(...data.map((/** @type {{ count: any; }} */ d) => d.count)));

	const margin = { left: 10, right: 10 };

	const chartHeight = 200;
	const chartWidth = $derived(Math.min(600, width) - margin.left - margin.right);

	const xScale = $derived(
		scaleBand()
			.domain(data.map((/** @type {{ time: any; }} */ d) => d.time))
			.range([width / 2 - chartWidth / 2 + 40, width / 2 + chartWidth / 2])
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

	const xTicks = $derived(
		width > 550
			? ['11:00', '13:00', '15:00', '17:00', '19:00', '21:00', '23:00']
			: ['11:00', '16:00', '21:00']
	);
	$inspect(xTicks);

	const opacityNoonCovers = new Tween(0);
	const opacityEveningCovers = new Tween(0);

	const getStepNrFromIdPart2 = getContext('getStepNrFromIdPart2');

	$effect(() => {
		opacityNoonCovers.target = stepNr === getStepNrFromIdPart2('most_busy_noon') ? 1 : 0;
		opacityEveningCovers.target = stepNr === getStepNrFromIdPart2('most_busy_evening') ? 1 : 0;
	});

	let hoverTime = $state('');
	let hoverCount = $derived(
		hoverTime !== ''
			? data.find((/** @type {{ time: any; }} */ d) => d.time === hoverTime).count
			: 0
	);

	const showHoverInfo = (
		/** @type {PointerEvent & { currentTarget: EventTarget & SVGRectElement; }} */ event
	) => {
		// Determine the element from the xScale domain to which the hovered x position corresponds
		const x = event.clientX - event.currentTarget.getBoundingClientRect().left;
		const timeIndex = Math.floor(x / xScale.step());
		if (timeIndex < 0 || timeIndex >= xScale.domain().length) return;
		const time = xScale.domain()[timeIndex];
		hoverTime = time;
	};

	$effect(() => {
		if (stepNr < getStepNrFromIdPart2('visiting_hours_interaction')) {
			hoverTime = '';
		}
	});

	const hideHoverInfo = () => {
		hoverTime = '';
	};
</script>

{#snippet coverRect(
	/** @type {string} */ startTime,
	/** @type {string} */ endTime,
	/** @type {number} */ opacity,
	/** @type {string} */ startOrEnd
)}
	<rect
		class="cover-rect"
		x={xScale(startTime) + xScale.bandwidth() / 2}
		y={yScale.range()[1]}
		width={xScale(endTime) - xScale(startTime)}
		height={yScale.range()[0] - yScale.range()[1]}
		fill="white"
		opacity={opacity * 0.7}
	/>
	<line
		x1={xScale(startOrEnd === 'start' ? endTime : startTime) + xScale.bandwidth() / 2}
		x2={xScale(startOrEnd === 'start' ? endTime : startTime) + xScale.bandwidth() / 2}
		y1={yScale.range()[1] - 20}
		y2={yScale.range()[0]}
		stroke="#333333"
		stroke-width="3"
		stroke-dasharray="10 10"
		{opacity}
	/>
	<text
		x={xScale(startOrEnd === 'start' ? endTime : startTime) + xScale.bandwidth() / 2}
		y={yScale.range()[1] - 30}
		text-anchor="middle"
		fill="#333333"
		font-size="1.5rem"
		{opacity}
	>
		{startOrEnd === 'start' ? endTime : startTime}
	</text>
{/snippet}

{#snippet yAxisLine(/** @type {number} */ count)}
	<line
		class="yaxis-line"
		x1={width / 2 - chartWidth / 2}
		x2={width / 2 + chartWidth / 2}
		y1={yScale(count)}
		y2={yScale(count)}
		stroke="lightgray"
		stroke-width="1"
	/>
	<text
		class="yaxis-text"
		x={width / 2 - chartWidth / 2}
		y={yScale(count) - 5}
		fill="lightgray"
		font-size="1.5rem"
	>
		{Math.round((count / maxCount) * 100)} % {count === maxCount ? 'guests' : ''}
	</text>
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
		<filter id="linechart-drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="white" />
		</filter>
	</defs>

	<line
		class="yaxis-line"
		x1={width / 2 - chartWidth / 2}
		x2={width / 2 + chartWidth / 2}
		y1={yScale(0)}
		y2={yScale(0)}
		stroke="lightgray"
		stroke-width="1"
	/>
	<g
		class="y-axis"
		style:opacity={stepNr >= getStepNrFromIdPart2('visiting_hours_interaction') ? '1' : '0'}
		style:transition="opacity 0.3s ease"
	>
		{@render yAxisLine(maxCount)}
		{@render yAxisLine(maxCount / 2)}
		{@render yAxisLine(0)}
	</g>
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

	{@render coverRect('10:00', '11:30', opacityNoonCovers.current, 'start')}
	{@render coverRect('14:00', '23:45', opacityNoonCovers.current, 'end')}

	{@render coverRect('10:00', '17:00', opacityEveningCovers.current, 'start')}
	{@render coverRect('20:00', '23:45', opacityEveningCovers.current, 'end')}

	<text
		class="x-axis-title"
		x={(xScale.range()[0] + xScale.range()[1]) / 2}
		y={yScale.range()[0] + 50}
		text-anchor="middle"
		fill="gray"
		dominant-baseline="hanging"
		font-size="1.5rem"
	>
		visiting hours →
	</text>

	{#if stepNr >= getStepNrFromIdPart2('visiting_hours_interaction')}
		<g class="hover-interaction">
			{#if hoverTime !== ''}
				<line
					class="hover-info-line"
					x1={xScale(hoverTime) + xScale.bandwidth() / 2}
					x2={xScale(hoverTime) + xScale.bandwidth() / 2}
					y1={yScale(hoverCount)}
					y2={yScale.range()[0]}
					stroke="#333333"
					stroke-width="3"
					stroke-dasharray="10 10"
				/>
				<text
					class="hover-info-text"
					x={xScale(hoverTime) + xScale.bandwidth() / 2}
					y={yScale(hoverCount) - 40}
					text-anchor="middle"
					fill="#333333"
					font-size="1.5rem"
					filter="url(#linechart-drop-shadow)"
				>
					{hoverTime}
				</text>
				<text
					class="hover-info-text"
					x={xScale(hoverTime) + xScale.bandwidth() / 2}
					y={yScale(hoverCount) - 15}
					text-anchor="middle"
					fill="#333333"
					font-size="1.5rem"
					filter="url(#linechart-drop-shadow)"
				>
					{Math.round((hoverCount / maxCount) * 100)} %
				</text>
				<circle
					class="hover-info-circle"
					cx={xScale(hoverTime) + xScale.bandwidth() / 2}
					cy={yScale(hoverCount)}
					r="5"
					fill="none"
					stroke="#333333"
					stroke-width="3"
				/>
			{/if}

			<rect
				class="hover-interaction-rect"
				onpointermove={(event) => {
					showHoverInfo(event);
				}}
				onpointerover={(event) => {
					showHoverInfo(event);
				}}
				x={xScale.range()[0]}
				y={0}
				width={xScale.range()[1] - xScale.range()[0]}
				{height}
				fill="transparent"
			/>
		</g>
	{/if}
</svg>

<style>
	svg {
	}
</style>
