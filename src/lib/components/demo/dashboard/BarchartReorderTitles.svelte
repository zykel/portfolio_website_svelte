<script>
	let { x0s, widths, margin, reorderButtonAreaHeight, sortingOrder, sortBarcharts } = $props();
</script>

{#snippet reorderButton(/** @type string */ key, /** @type string */ order)}
	<button
		class="barcharts-reorder-button{sortingOrder.value.key === key &&
		sortingOrder.value.order === order
			? ' order-selected'
			: ''}"
		onclick={(e) => {
			sortingOrder.value = { key, order };
			sortBarcharts();
		}}>{@html order === 'asc' ? '&uarr;' : '&darr;'}</button
	>
{/snippet}

<g class="barchart-reorder-titles">
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
			Counts
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
			Prices
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
</style>
