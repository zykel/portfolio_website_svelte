<script>
	let { xScale, yScale, tickLabelsAll } = $props();

	// Calculate ticks for the x-axis
	const ticks = $derived(tickLabelsAll);
	// .filter((/** @type {any} */ d, /** @type {number} */ i) => i % 2 === 0)
</script>

<g class="axis-y">
	{#each ticks as tick, i}
		{#if i !== 0}
			<line
				x1={xScale.range()[0]}
				x2={xScale.range()[1]}
				y1={yScale(tick)}
				y2={yScale(tick)}
				stroke="lightgray"
				stroke-width="1"
			/>
		{/if}

		<text class="axis-label y-axis" x={xScale.range()[0]} y={yScale(tick) - 5}>
			{tick}
			{i === ticks.length - 1 ? 'sales' : ''}
		</text>
	{/each}
</g>
