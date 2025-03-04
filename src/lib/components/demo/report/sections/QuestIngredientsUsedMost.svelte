<script>
	import { getIngredientsData } from '$lib/scripts/utilityReport.js';
	import IngredientsChart from '$lib/components/demo/report/charts/IngredientsChart.svelte';

	let { sectionId, data, sectionHeader = $bindable() } = $props();

	const question = 'Which ingredients are used the most and should always be in stock?';
	sectionHeader = question;

	const ingredientsData = $derived(getIngredientsData(data));
	$inspect(ingredientsData);
</script>

<section id={sectionId}>
	<hr />
	<h2 id="{sectionId}-header" class="section-header limit-width">
		{question}
	</h2>
	<p class="default-text limit-width">
		This is some default explanations regarding the content of the dashboard.
	</p>
	<p class="interaction-text limit-width">
		➤ Interaction: Here I describe how the interaction takes place.
	</p>
	<IngredientsChart data={ingredientsData} />
	<p class="insight-text limit-width">
		This is some text to give the answer to a question proposed at the beginning of a section.
	</p>
</section>
