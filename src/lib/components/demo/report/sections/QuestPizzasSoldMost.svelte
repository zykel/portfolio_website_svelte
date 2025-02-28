<script>
	import PizzaSalesChart from '$lib/components/demo/report/charts/PizzaSalesChart.svelte';
	import { getDataGrouped } from '$lib/scripts/utilityReport.js';

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
		Interaction: Here I describe how the interaction takes place.
	</p>
	<PizzaSalesChart {dataGrouped} {nrTopPizzas} {nrBottomPizzas} />
	<p class="insight-text limit-width">
		Insight: The most sold pizzas are the <span class="pizza-category-classic-text"
			>Classic Deluxe</span
		>, the <span class="pizza-category-chicken-text">Barbecue Chicken</span>,
		<span class="pizza-category-classic-text">the Hawaiian</span>, the
		<span class="pizza-category-classic-text">Pepperoni</span>, the
		<span class="pizza-category-chicken-text">Thai Chicken</span>, and the
		<span class="pizza-category-chicken-text">California Chicken</span>. They are from the
		categories X and Y.
	</p>
	<p class="insight-text limit-width">
		Insight: The least sold pizza is by far the <span class="pizza-category-supreme-text"
			>Brie Carre</span
		>.
	</p>
</section>
