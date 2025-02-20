<script>
	let { xScale, yScale, tickLabelsAll } = $props();

	// Calculate ticks for the x-axis
	const ticks = $derived(tickLabelsAll);
	// .filter((/** @type {any} */ d, /** @type {number} */ i) => i % 2 === 0)
</script>

{#each ticks as tick, i}
	<line
		x1={xScale.range()[0]}
		x2={xScale.range()[1]}
		y1={yScale(tick)}
		y2={yScale(tick)}
		stroke="lightgray"
		stroke-width="2"
	/>

	<text x={xScale.range()[0]} y={yScale(tick) - 5} fill="gray">
		{tick}
		{i === ticks.length - 1 ? 'sales' : ''}
	</text>
{/each}
