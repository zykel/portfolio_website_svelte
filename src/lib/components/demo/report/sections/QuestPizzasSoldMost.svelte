<script>
	import PizzaSalesChart from '$lib/components/demo/report/charts/PizzaSalesChart.svelte';
	import { getDataGrouped, categoryColorScale } from '$lib/scripts/utilityReport.js';

	let { sectionId, data, sectionHeader = $bindable() } = $props();

	const dataGrouped = $derived(getDataGrouped(data));

	const nrTopPizzas = 6;
	const nrBottomPizzas = 1;

	const question = 'Which pizzas are sold the most/the least?';
	sectionHeader = question;
</script>

<section id={sectionId}>
	<hr />
	<h2 id="{sectionId}-header" class="section-header limit-width">
		{question}
	</h2>
	<p class="default-text limit-width">
		The chart below shows the number of sales for each pizza type, irrespective of the pizza size.
	</p>
	<p class="interaction-text limit-width">
		➤ Interaction: You may hover over the bars to display the exact number of sales for each pizza.
	</p>
	<PizzaSalesChart {dataGrouped} {nrTopPizzas} {nrBottomPizzas} />
	<p class="insight-text limit-width">
		The most sold pizzas are the
		<span class="pizza-category-text">
			Classic Deluxe <span
				class="category-color-legend-color"
				style="background-color: {categoryColorScale('Classic')};"
			></span>
		</span>, the
		<span class="pizza-category-text">
			Barbecue Chicken <span
				class="category-color-legend-color"
				style="background-color: {categoryColorScale('Chicken')};"
			></span>
		</span>, the
		<span class="pizza-category-text">
			Hawaiian <span
				class="category-color-legend-color"
				style="background-color: {categoryColorScale('Classic')};"
			></span>
		</span>, the
		<span class="pizza-category-text">
			Pepperoni <span
				class="category-color-legend-color"
				style="background-color: {categoryColorScale('Classic')};"
			></span>
		</span>, the
		<span class="pizza-category-text">
			Thai Chicken <span
				class="category-color-legend-color"
				style="background-color: {categoryColorScale('Chicken')};"
			></span>
		</span>, and the
		<span class="pizza-category-text">
			California Chicken <span
				class="category-color-legend-color"
				style="background-color: {categoryColorScale('Chicken')};"
			></span>
		</span>.
	</p>
	<p class="insight-text limit-width">
		The least sold pizza is by far the
		<span class="pizza-category-text">
			Brie Carre <span
				class="category-color-legend-color"
				style="background-color: {categoryColorScale('Supreme')};"
			></span>
		</span>. If offering the pizza comes with an increased cost, it might be worth considering to
		remove it from the menu.
	</p>
</section>

<style>
	.pizza-category-text {
		font-weight: bold;
	}

	.category-color-legend-color {
		display: inline-block;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		margin: 0 1px; /* Optional: Add some space between the text and the circle */
		transform: translateY(2px);
	}
</style>
