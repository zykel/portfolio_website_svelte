<script>
	import { getContext } from 'svelte';
	import { toggleFocusedItem } from '$lib/scripts/utilityDashboard.svelte';

	let { x0s, yScale } = $props();

	const hoveredPizzaName = getContext('hoveredPizzaName');
	const updateHoveredPizzaName = getContext('updateHoveredPizzaName');
	const focusedItems = getContext('focusedItems');
	$inspect({ focusedItems });

	const pinHeadRadius = 3;
	const pinLineLength = 8;
</script>

<g class="barchart-pins">
	{#each yScale.domain() as name, i}
		{@const isHoveringRow = hoveredPizzaName.value === name}
		{@const isPinned = focusedItems.value.includes(name)}
		{@const color = isPinned ? 'black' : isHoveringRow ? 'gray' : 'transparent'}
		<circle
			class="barchart-pin-head"
			cx={x0s.pins}
			cy={yScale(name)}
			r={pinHeadRadius}
			fill={color}
		/>
		<line
			class="barchart-pin-line"
			x1={x0s.pins}
			y1={yScale(name)}
			x2={x0s.pins}
			y2={yScale(name) + pinLineLength}
			stroke={color}
			stroke-width={1}
		/>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<rect
			class="barchart-pin-hover-rect"
			class:isHoveringRow
			class:isPinned
			onclick={() => toggleFocusedItem(focusedItems, name)}
			onpointerover={() => updateHoveredPizzaName(name)}
			onpointerleave={() => updateHoveredPizzaName(null)}
			x={x0s.pins - pinHeadRadius * 2}
			y={yScale(name) - pinHeadRadius * 2}
			width={x0s.labels - x0s.pins + pinHeadRadius * 2}
			height={yScale.step() + pinHeadRadius * 2}
			cursor="pointer"
		>
			<title>Focus item</title>
		</rect>
	{/each}
</g>

<style>
	.barchart-pin-hover-rect {
		pointer-events: all;
		fill: rgba(255, 255, 255, 0.5);
	}
	.barchart-pin-hover-rect.isPinned {
		fill: rgba(255, 255, 255, 0);
	}
	.barchart-pin-hover-rect:hover {
		fill: rgba(255, 255, 255, 0.1);
	}
</style>
