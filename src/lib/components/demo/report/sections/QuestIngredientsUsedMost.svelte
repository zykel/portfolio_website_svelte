<script>
	import IngredientsChart from '$lib/components/demo/report/charts/IngredientsChart.svelte';

	let { sectionId, ingredientsData, sectionHeader = $bindable() } = $props();

	const question = 'Which ingredients are used the most?';
	sectionHeader = question;

	$inspect(ingredientsData);
</script>

<section id={sectionId}>
	<hr />
	<h2 id="{sectionId}-header" class="section-header limit-width">
		{question}
	</h2>
	<p class="default-text limit-width">
		The chart below shows how often the most-used ingredients were used in the pizzas.
	</p>
	<p class="interaction-text limit-width">
		➤ Interaction: You may click of one of the options below to select how many of the top
		ingredients should be displayed.
		<br />
		➤ Interaction: You may hover over the bars to display the exact number of times an ingredient was
		used.
	</p>
	<IngredientsChart data={ingredientsData} />
	<p class="insight-text limit-width">
		The most important ingredients are <span style:font-weight="bold">Garlic</span>,
		<span style:font-weight="bold">Tomatoes</span>,
		<span style:font-weight="bold">Red Onions</span>, and
		<span style:font-weight="bold">Red Peppers</span>. They should always be in stock.
	</p>
</section>
