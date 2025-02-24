<script>
	let { x0s, widths, margin, reorderButtonAreaHeight, sortingOrder, sortBarcharts } = $props();
</script>

<g class="barchart-reorder-titles">
	<foreignObject
		x={x0s.chartCounts}
		y={reorderButtonAreaHeight + margin.top - 30}
		width={widths.chartCounts}
		height="30"
	>
		<div class="barchart-reorder-title">
			Counts
			<button
				class="barcharts-reorder-button{sortingOrder.value.key === 'countTotal' &&
				sortingOrder.value.order === 'asc'
					? ' order-selected'
					: ''}"
				onclick={(e) => {
					sortingOrder.value = { key: 'countTotal', order: 'asc' };
					sortBarcharts();
				}}>&uarr;</button
			>
			<button
				class="barcharts-reorder-button{sortingOrder.value.key === 'countTotal' &&
				sortingOrder.value.order === 'desc'
					? ' order-selected'
					: ''}"
				onclick={() => {
					sortingOrder.value = { key: 'countTotal', order: 'desc' };
					sortBarcharts();
				}}>&darr;</button
			>
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
			<button
				class="barcharts-reorder-button{sortingOrder.value.key === 'priceTotal' &&
				sortingOrder.value.order === 'asc'
					? ' order-selected'
					: ''}"
				onclick={() => {
					sortingOrder.value = { key: 'priceTotal', order: 'asc' };
					sortBarcharts();
				}}>↑</button
			>
			<button
				class="barcharts-reorder-button{sortingOrder.value.key === 'priceTotal' &&
				sortingOrder.value.order === 'desc'
					? ' order-selected'
					: ''}"
				onclick={() => {
					sortingOrder.value = { key: 'priceTotal', order: 'desc' };
					sortBarcharts();
				}}>&darr;</button
			>
		</div>
	</foreignObject>
</g>

<style>
	svg {
		width: 100%;
		height: 100%;
		/* background-color: rgb(213, 213, 213); */
	}

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
