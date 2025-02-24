<script>
	import { formatNumber } from '$lib/scripts/utilityDashboard.svelte';

	let { xScale, yScale, axisHeight } = $props();

	const ticks = $derived(xScale.ticks(2));

	const tickOffset = $derived(yScale.bandwidth() * 0.75);
	const tickHeight = 7;
	const labelOffset = 4;
</script>

<line
	class="lolli-axis-x"
	x1={xScale(0)}
	y1={yScale.range()[0] - tickOffset}
	x2={xScale(0)}
	y2={yScale.range()[1]}
	stroke={'lightgray'}
	stroke-width={1}
/>

{#each ticks as tick, i}
	<line
		class="lolli-axis-x-tick"
		x1={xScale(tick)}
		y1={yScale.range()[0] - tickOffset - tickHeight}
		x2={xScale(tick)}
		y2={yScale.range()[0] - tickOffset}
		stroke={'gray'}
		stroke-width={1}
	/>
	<text
		class="lolli-axis-x-tick-label"
		x={xScale(tick)}
		y={yScale.range()[0] - tickOffset - tickHeight - labelOffset}
		font-size="0.7em"
		fill={'gray'}
		text-anchor="middle"
	>
		{formatNumber(tick)}
	</text>
{/each}

<text
	class="lolli-axis-x-tick-label"
	x={xScale.range()[1]}
	y={yScale.range()[0] - tickOffset - tickHeight - labelOffset}
	font-size="0.7em"
	fill={'gray'}
>
	{@html '&rarr; times used'}
</text>
