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
</script>

<div class="main-area">
	<div class="left-part">
		<div class="section">
			<div class="dashboard__section-title-container flex-row-spread">
				<h3>Sales [?per X (?on average)]</h3>
				<select id="timeUnitSelector" bind:value={selected.timeUnit}>
					{#each getContext('timeUnits') as unit}
						<option value={unit}>{unit}</option>
					{/each}
				</select>
				<label>
					<input type="checkbox" bind:checked={showIndividualSales} />
					Show individual sales
				</label>
			</div>
			<div
				class="svg-container"
				bind:clientHeight={extents.timeVizHeight}
				bind:clientWidth={extents.timeVizWidth}
			>
				<TimeViz width={extents.timeVizWidth} height={extents.timeVizHeight} />
			</div>
		</div>
		<div class="section">
			<div class="dashboard__section-title-container">
				<h3>Total Price and Sales</h3>
			</div>
			<div
				class="svg-container"
				bind:clientHeight={extents.pizzaChartsHeight}
				bind:clientWidth={extents.pizzaChartsWidth}
			>
				<PizzaCharts width={extents.pizzaChartsWidth} height={extents.pizzaChartsHeight} />
			</div>
		</div>
	</div>
	<div class="right-part section">
		<div class="dashboard__section-title-container">
			<h3>Ingredients</h3>
			<p>[] Sort alphabetically.</p>
		</div>
		<div
			class="svg-container"
			bind:clientHeight={extents.ingredientsChartHeight}
			bind:clientWidth={extents.ingredientsChartWidth}
		>
			<IngredientsChart
				width={extents.ingredientsChartWidth}
				height={extents.ingredientsChartHeight}
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
		grid-template-rows: 1fr 2fr; /* Two equal rows */
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

	.dashboard__section-title-container {
		/* min-height: 0; */
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
</style>
