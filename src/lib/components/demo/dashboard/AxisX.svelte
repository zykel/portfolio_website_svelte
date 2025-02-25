<script>
	let { xScale, yScale, yAxisLabelWidth, tickLabelsAll } = $props();

	// Calculate ticks for the x-axis
	const xTicks = $derived(
		tickLabelsAll.filter((/** @type {any} */ d, /** @type {number} */ i) => i % 2 === 0)
	);
</script>

<g class="axis-x">
	<line
		x1={xScale.range()[0] - yAxisLabelWidth}
		x2={xScale.range()[1]}
		y1={yScale(0)}
		y2={yScale(0)}
		stroke="gray"
		stroke-width="1"
	/>

	<!-- {#each xTicks as tick}
		<line
			x1={xScale(tick) + xScale.bandwidth() / 2}
			x2={xScale(tick) + xScale.bandwidth() / 2}
			y1={yScale(0)}
			y2={yScale(0) + 5}
			stroke="black"
			stroke-width="1"
		/>
	{/each} -->

	{#each xTicks as tick}
		<text
			class="axis-label"
			x={xScale(tick) + xScale.bandwidth() / 2}
			y={yScale(0)}
			text-anchor="middle"
		>
			{tick}
		</text>
	{/each}
</g>
