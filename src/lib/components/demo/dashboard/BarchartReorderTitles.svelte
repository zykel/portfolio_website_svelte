<script>
	import { clearFocusedItems } from '$lib/scripts/utilityDashboard.svelte';
	import { getContext } from 'svelte';

	let { x0s, widths, margin, reorderButtonAreaHeight, sortingOrder } = $props();

	const focusedItems = getContext('focusedItems');
</script>

{#snippet reorderButton(/** @type string */ key, /** @type string */ order)}
	<button
		class="barcharts-reorder-button{sortingOrder.value.key === key &&
		sortingOrder.value.order === order
			? ' order-selected'
			: ''}"
		onclick={(e) => {
			sortingOrder.value = { key, order };
			// sortBarcharts();
		}}>{@html order === 'asc' ? '&uarr;' : '&darr;'}</button
	>
{/snippet}

<g class="barchart-reorder-titles">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<text
		onclick={() => clearFocusedItems(focusedItems)}
		x={x0s.pins + widths.pins * 0.3}
		y={reorderButtonAreaHeight / 2 + margin.top - 12}
		text-anchor="middle"
		dominant-baseline="middle"
		fill="gray"
		style:display={focusedItems.value.length > 0 ? 'block' : 'none'}
		cursor="pointer"
	>
		{@html 'x'}
		<title>Clear focus selection</title>
	</text>
	<foreignObject
		x={x0s.labels}
		y={reorderButtonAreaHeight + margin.top - 30}
		width={widths.labels}
		height="30"
	>
		<div class="barchart-reorder-title">
			Name
			{@render reorderButton('name', 'asc')}
			{@render reorderButton('name', 'desc')}
		</div>
	</foreignObject>
	<foreignObject
		x={x0s.chartCounts}
		y={reorderButtonAreaHeight + margin.top - 30}
		width={widths.chartCounts}
		height="30"
	>
		<div class="barchart-reorder-title">
			#Sales
			{@render reorderButton('countTotal', 'asc')}
			{@render reorderButton('countTotal', 'desc')}
		</div>
	</foreignObject>
	<foreignObject
		x={x0s.chartPrices}
		y={reorderButtonAreaHeight + margin.top - 30}
		width={widths.chartPrices}
		height="30"
	>
		<div class="barchart-reorder-title">
			Revenue
			{@render reorderButton('priceTotal', 'asc')}
			{@render reorderButton('priceTotal', 'desc')}
		</div>
	</foreignObject>
</g>

<style>
	.barcharts-reorder-button {
		background-color: transparent;
		border: none;
		font-size: 1em;
		cursor: pointer;
		padding: 0;
		color: gray;
	}

	.barcharts-reorder-button:hover {
		color: black;
	}
	.barcharts-reorder-button.order-selected {
		color: black;
	}

	.barchart-reorder-title {
		color: rgb(40, 40, 40);
	}
</style>
