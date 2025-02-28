<script>
	import PizzaSalesChart from '$lib/components/demo/report/charts/PizzaSalesChart.svelte';

	let { sectionId, data, sectionHeader = $bindable() } = $props();

	const question = 'Which pizzas are sold the most/the least?';
	sectionHeader = question;
</script>

<section id={sectionId}>
	<h2 id="{sectionId}-header" class="section-header limit-width">
		{question}
	</h2>
	<p class="default-text limit-width">
		The chart below shows the number of sales for each pizza type, irrespective of its size.
	</p>
	<PizzaSalesChart {data} />
	<p class="interaction-text limit-width">
		Interaction: Here I describe how the interaction takes place.
	</p>
	<p class="insight-text limit-width">
		This is some text to give the answer to a question proposed at the beginning of a section.
	</p>
</section>
