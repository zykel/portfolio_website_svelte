<script>
	let { xScale, yScale, margin, nrTicks, axisTitle } = $props();

	const ticks = $derived(xScale.ticks(nrTicks));
	const tickFormat = $derived(xScale.tickFormat(nrTicks));
	const ticklineHeight = 7;
	const axisTitleOffset = 20;
</script>

<g class="axis-x">
	<text
		x={xScale.range()[1]}
		y={margin.top - ticklineHeight - axisTitleOffset}
		dy="-0.5rem"
		text-anchor="end"
		class="axis-title"
	>
		{axisTitle + ' →'}
	</text>
	<!-- <rect
		x={xScale.range()[0]}
		y={margin.top - ticklineHeight}
		width={xScale.range()[1] - xScale.range()[0]}
		height={10}
		fill="black"
	/> -->
	{#each ticks as tick}
		<text
			x={xScale(tick)}
			y={margin.top - ticklineHeight}
			dy="-0.5em"
			text-anchor="middle"
			class="tick"
		>
			{tickFormat(tick)}
		</text>
		<line
			class="axis-x-gridline"
			x1={xScale(tick)}
			y1={margin.top}
			x2={xScale(tick)}
			y2={yScale.range()[1]}
			stroke="lightgray"
			stroke-width="1"
		/>
		<line
			class="axis-x-tickline"
			x1={xScale(tick)}
			y1={margin.top - ticklineHeight}
			x2={xScale(tick)}
			y2={margin.top}
			stroke="black"
			stroke-width="1"
		/>
	{/each}
</g>
