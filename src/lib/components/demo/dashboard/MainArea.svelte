<script>
	import { getContext, setContext } from 'svelte';
	import TimeViz from '$lib/components/demo/dashboard/TimeViz.svelte';
	import PizzaCharts from '$lib/components/demo/dashboard/PizzaCharts.svelte';
	import IngredientsChart from '$lib/components/demo/dashboard/IngredientsChart.svelte';

	// You can add any necessary script here

	const extents = $state({
		timeVizHeight: 0,
		timeVizWidth: 0,
		pizzaChartsHeight: 0,
		pizzaChartsWidth: 0,
		ingredientsChartHeight: 0,
		ingredientsChartWidth: 0
	});

	const margin = {
		top: 20,
		right: 5,
		bottom: 20,
		left: 5
	};
	const fontsize = {
		axis: 12
	};

	setContext('margin', margin);
	setContext('fontsize', fontsize);

	let showIndividualSales = $state(false);
	let selected = getContext('selected');
	let ingredientsFilterString = $state('');
	const resetTimeFilterRange = getContext('resetTimeFilterRange');
</script>

<div class="main-area">
	<div
		class="left-part"
		style:grid-template-rows={selected.type === 'pizza_name' ? '3fr 2fr' : '2fr 3fr'}
	>
		<div class="section">
			<div class="dashboard__section-title-container">
				<h3>
					Number of sales and revenue per pizza {selected.type === 'pizza_category'
						? 'category'
						: ''}
				</h3>
			</div>
			<div
				class="svg-container"
				bind:clientHeight={extents.pizzaChartsHeight}
				bind:clientWidth={extents.pizzaChartsWidth}
			>
				<PizzaCharts width={extents.pizzaChartsWidth} height={extents.pizzaChartsHeight} />
			</div>
		</div>
		<div class="section">
			<div class="dashboard__section-title-container flex-row-spread">
				<h3>
					Sales per
					<div class="select-wrapper">
						<select
							id="timeUnitSelector"
							bind:value={selected.timeUnit}
							onchange={() => resetTimeFilterRange()}
						>
							{#each getContext('timeUnits') as unit}
								<option value={unit}>{unit}</option>
							{/each}
						</select>
					</div>
				</h3>
				<!-- <label>
					<input type="checkbox" bind:checked={showIndividualSales} />
					Show individual sales
				</label> -->
			</div>
			<div
				class="svg-container"
				bind:clientHeight={extents.timeVizHeight}
				bind:clientWidth={extents.timeVizWidth}
			>
				<TimeViz width={extents.timeVizWidth} height={extents.timeVizHeight} />
			</div>
		</div>
	</div>
	<div class="right-part section">
		<div class="dashboard__section-title-container">
			<h3>Ingredients</h3>
			<div class="ingredient-filter-container">
				<label for="#ingredient-filter">Filter:</label>
				<input
					id="ingredient-filter"
					type="text"
					placeholder="Ingredient"
					bind:value={ingredientsFilterString}
				/>
				<button title="Clear Filter" onclick={() => (ingredientsFilterString = '')}
					>{@html '&#10005;'}</button
				>
			</div>
		</div>
		<div
			class="svg-container"
			bind:clientHeight={extents.ingredientsChartHeight}
			bind:clientWidth={extents.ingredientsChartWidth}
		>
			<IngredientsChart
				width={extents.ingredientsChartWidth}
				height={extents.ingredientsChartHeight}
				{ingredientsFilterString}
			/>
		</div>
	</div>
</div>

<style>
	.main-area {
		display: grid;
		grid-template-columns: 3fr 1fr; /* Two equal columns */
		grid-gap: 20px; /* Gap between columns */
		padding: 20px; /* Padding around the main area */
		background-color: #ecf0f1; /* Main area background color */
		box-sizing: border-box;
		min-height: 0;
		height: 100vh;
		height: 100svh;
	}

	.left-part {
		display: grid;
		/*grid-template-rows: 3fr 2fr; /* Done dynamically in markdown */
		grid-gap: 20px;
		min-height: 0;
	}

	.section {
		background-color: white; /* Section background color */
		padding: 20px;
		border-radius: 10px; /* Rounded corners */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100%;
		min-height: 0;
		box-sizing: border-box;
	}

	.right-part {
		background-color: white; /* Section background color */
		padding: 20px;
		border-radius: 10px; /* Rounded corners */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
		min-height: 0;
	}

	h3 {
		margin-bottom: 0.5rem;
		color: rgb(40, 40, 40);
	}

	.dashboard__section-content {
		/* min-height: 0; */
	}

	.svg-container {
		min-height: 0;
	}

	.flex-row-spread {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.ingredient-filter-container {
		display: flex;
		align-items: center;
		padding: 0.5rem 0;
	}

	.ingredient-filter-container label {
		margin-right: 10px;
	}

	.ingredient-filter-container input {
		width: 80px;
		margin-right: 10px;
		font-family: inherit;
		border-radius: 1rem;
		border: 1px solid gray;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}

	.ingredient-filter-container button {
		border-radius: 50%; /* Make the button round */
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		background: none;
		border: 1px solid gray;
		color: gray;
		cursor: pointer;
	}
	.ingredient-filter-container button:hover {
		border: 1px solid black;
		color: black;
	}

	.select-wrapper {
		position: relative;
		display: inline-block;
	}
	.select-wrapper::after {
		content: '▾'; /* Unicode character for downward arrow */
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none; /* Ensure the arrow does not block clicks */
		color: rgb(0, 0, 0); /* Arrow color */
	}
	#timeUnitSelector {
		appearance: none; /* Remove default styles */
		background: none; /* Remove default background */
		border: 1px solid rgb(0, 0, 0); /* Remove default border */
		border-radius: 10px;
		color: inherit; /* Inherit text color */
		font: inherit; /* Inherit font styles */
		padding: 0 1.5rem 0 0.5rem; /* Remove default padding */
		margin: 0; /* Remove default margin */
	}

	#timeUnitSelector option {
		color: rgb(40, 40, 40);
	}
</style>
