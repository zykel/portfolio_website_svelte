<script>
	import {
		getSizeData,
		categoryColorScale,
		getIngredientCombinationData,
		getRecipes
	} from '$lib/scripts/utilityReport.js';
	import IngredientCombinationsChart from '../charts/IngredientCombinationsChart.svelte';
	import SizesChart from '../charts/SizesChart.svelte';

	let { sectionId, data, ingredientsData, sectionHeader = $bindable() } = $props();

	const question = 'How can the business be improved?';
	sectionHeader = question;

	const dataSizes = $derived(getSizeData(data));

	const mostUsedIngredients = $derived(
		ingredientsData.slice(0, 10).map((/** @type {{ ingredient: any; }} */ d) => d.ingredient)
	);
	const recipes = $derived(getRecipes(data));
	const dataIngredientCombinations = $derived(
		getIngredientCombinationData(data, mostUsedIngredients, recipes)
	);

	$inspect(dataIngredientCombinations);
</script>

<section id={sectionId}>
	<hr class="limit-width" />
	<h2 id="{sectionId}-header" class="section-header limit-width">
		{question}
	</h2>
	<p class="default-text limit-width">
		In the sections above, we have seen that the restaurant is doing well in terms of sales.
		However, we have also noted that there are some areas where the business has potential for
		improvement. At the end of this section, we summarize the suggestions from the previous sections
		and some additional suggestions made in the following.
	</p>
	<p class="default-text limit-width">
		The pizzas are offered in five different sizes, S, M, L, XL, and XXL. The chart below shows how
		often each of the sizes is sold.
	</p>
	<p class="interaction-text limit-width">
		➤ Interaction: You may hover over a slice or an accompanying label to highlight the slice and to
		show additional information, like the share of all sales.
	</p>
	<SizesChart data={dataSizes} />
	<p class="insight-text limit-width">
		Pizzas of size XXL make up only 0.06% of all sales. If offering XXL pizzas comes with increased
		costs, e.g., due to requiring extra large kitchen utensils, it might be worth considering to <span
			style:font-weight="bold">remove pizzas of size XXL</span
		> from the menu.
	</p>
	<br />
	<p class="default-text limit-width">
		We already saw <a href="#ingredients-most-used-header"
			>to which extent the different ingredients are used</a
		>. Further analysis showed that even among the ten most used ingredients, there exist several
		combinations of ingredients that have not been used on any pizza so far. The combinations are
		listed below.
	</p>
	<p class="interaction-text limit-width">
		➤ Interaction: You may hover over an ingredient or a colored bar in the bar charts to highlight
		which (so far unused) combiations the ingredient is part of.
	</p>
	<IngredientCombinationsChart
		{ingredientsData}
		{dataIngredientCombinations}
		{mostUsedIngredients}
	/>
	<p class="insight-text limit-width">
		Several of the most used ingredients have not been used together on a pizza so far. It might be
		worth <span style:font-weight="bold">exploring new ingredient combinations</span>, like Tomatoes
		or Red Onions together with Mozzarella Cheese.
	</p>
	<br />
	<h3 class="limit-width">Summary: How the business can be improved</h3>
	<p class="default-text limit-width">
		In the sections above, several suggestions were made for how the business could be improved.
		They include
	</p>
	<ul class="default-text limit-width">
		<li>
			to <a href="#insight-remove-brie-carre">remove the Brie Carre pizza from the menu</a>,
		</li>
		<li>
			to <a href="#insight-allocate-staff"
				>allocate the staff according to the resaurant's busiest visiting times</a
			>, including, in general,
		</li>
		<li>
			to
			<a href="#insight-open-at-11">open the restaurant at 11:00 instead of 10:00</a>,
		</li>
		<li>
			to <a href="#insight-remove-xxl">remove pizzas of size XXL from the menu</a>, and
		</li>
		<li>
			to <a href="#insight-explore-new-combinations"
				>explore new combinations of popular ingredients</a
			>.
		</li>
	</ul>
	<hr class="limit-width" style="margin-top: 2rem;" />
</section>

<style>
	ul {
		/* list-style-type: '💡 '; */
	}
</style>
