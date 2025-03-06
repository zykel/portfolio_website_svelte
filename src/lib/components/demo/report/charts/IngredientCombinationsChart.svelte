<script>
	import MiniIngredientChart from './MiniIngredientChart.svelte';
	import PointerAnnotation from './PointerAnnotation.svelte';
	let { ingredientsData, dataIngredientCombinations, mostUsedIngredients } = $props();

	const nrIngredients = $derived(mostUsedIngredients.length);

	let chartWidth = $state(0);
	$inspect(chartWidth);

	let hoveredIngredient = $state('');

	const handlePointerOver = (/** @type {string} */ ingredient) => {
		hoveredIngredient = ingredient;
	};
	const handlePointerOut = () => {
		hoveredIngredient = '';
	};

	let tableWdith = $state(0);
</script>

<div id="insight-explore-new-combinations" class="chart center-content poppins">
	<h3 class="chart-title">Ingredients that have not been used together so far</h3>
	{#if tableWdith > 0}
		<svg width={tableWdith - 1} height="40">
			<PointerAnnotation
				x={5}
				y={40}
				widthArrow={20}
				heightArrow={15}
				placement="topright"
				text="The most used ingredient, garlic"
				width={250}
				height={40}
			/>
		</svg>
	{/if}
	<div class="table-grid" bind:clientWidth={tableWdith}>
		{#each dataIngredientCombinations as combination, i}
			<div class="table-grid-cell" style:min-width="100px" bind:clientWidth={chartWidth}>
				<MiniIngredientChart
					width={chartWidth - 5}
					height={20}
					{ingredientsData}
					{nrIngredients}
					{combination}
					{hoveredIngredient}
					{handlePointerOver}
					{handlePointerOut}
				/>
			</div>
			<div class="table-grid-cell">
				<span
					class="ingredient label-small"
					onpointerover={(event) => handlePointerOver(combination[0])}
					onpointermove={(event) => handlePointerOver(combination[0])}
					onpointerout={handlePointerOut}
					style:background-color={hoveredIngredient === combination[0]
						? 'hsl(0, 0%, 90%)'
						: 'white'}
					style:border={hoveredIngredient === combination[0] ? 'solid 1px black' : 'solid 1px gray'}
					style:color={hoveredIngredient === combination[0] ? 'black' : '#333333'}
				>
					{combination[0]}
				</span>
				<span class="plus-symbol">+</span>
				<span
					class="ingredient label-small"
					onpointerover={(event) => handlePointerOver(combination[1])}
					onpointermove={(event) => handlePointerOver(combination[1])}
					onpointerout={handlePointerOut}
					style:background-color={hoveredIngredient === combination[1]
						? 'hsl(0, 0%, 90%)'
						: 'white'}
					style:border={hoveredIngredient === combination[1] ? 'solid 1px black' : 'solid 1px gray'}
					style:color={hoveredIngredient === combination[1] ? 'black' : '#333333'}
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
		white-space: normal;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		color: rgb(0, 0, 0);
		/* background-color: rgb(244, 244, 244); */
		border: solid 1px gray;
		cursor: default;
		text-align: center;
		width: fit-content;
		box-sizing: border-box;
	}
</style>
