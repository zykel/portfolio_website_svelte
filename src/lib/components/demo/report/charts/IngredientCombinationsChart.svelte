<script>
	import MiniIngredientChart from './MiniIngredientChart.svelte';
	let { ingredientsData, dataIngredientCombinations, mostUsedIngredients } = $props();

	const nrIngredients = $derived(mostUsedIngredients.length);

	let chartWidth = $state(0);
	$inspect(chartWidth);

	let hoveredIngredient = $state('');

	const handlePointerOver = (/** @type {string} */ ingredient) => {
		hoveredIngredient = ingredient;
	};
</script>

<div class="chart center-content poppins">
	<h3 class="chart-title">Ingredients that have not been used together so far</h3>
	<div class="table-grid">
		{#each dataIngredientCombinations as combination, i}
			<div class="table-grid-cell" style:min-width="100px" bind:clientWidth={chartWidth}>
				<MiniIngredientChart
					width={chartWidth - 5}
					height={20}
					{ingredientsData}
					{nrIngredients}
					{combination}
					{hoveredIngredient}
				/>
			</div>
			<div class="table-grid-cell">
				<span
					class="ingredient label-small"
					onpointerover={(event) => handlePointerOver(combination[0])}
					onpointermove={(event) => handlePointerOver(combination[0])}
					onpointerout={() => (hoveredIngredient = '')}
					style:font-weight={hoveredIngredient === combination[0] ? 'bold' : 'normal'}
				>
					{combination[0]}
				</span>
				<span class="plus-symbol">+</span>
				<span
					class="ingredient label-small"
					onpointerover={(event) => handlePointerOver(combination[1])}
					onpointermove={(event) => handlePointerOver(combination[1])}
					onpointerout={() => (hoveredIngredient = '')}
					style:font-weight={hoveredIngredient === combination[1] ? 'bold' : 'normal'}
				>
					{combination[1]}
				</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.center-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.poppins {
		font-family: Poppins, sans-serif;
	}
	.table-grid {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: repeat(10, 1fr);
		grid-column-gap: 15px;
		grid-row-gap: 15px;
		margin-bottom: 0.5rem;
	}

	.table-grid-cell {
		display: flex;
		align-items: center;
	}

	.plus-symbol {
		margin: 0 0.5rem;
		/* font-weight: 900; */
		font-size: 1.25rem;
	}

	.rightaligned {
		justify-content: flex-end;
	}

	.ingredient {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		color: rgb(0, 0, 0);
		/* background-color: rgb(244, 244, 244); */
		border: solid 1px gray;
		cursor: pointer;
	}
</style>
