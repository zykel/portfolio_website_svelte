<script>
	import { getSizeData, categoryColorScale } from '$lib/scripts/utilityReport.js';
	import SizesChart from '../charts/SizesChart.svelte';

	let { sectionId, data, sectionHeader = $bindable() } = $props();

	const question = 'How can the business be improved?';
	sectionHeader = question;

	const dataSizes = $derived(getSizeData(data));
	$inspect(dataSizes);
</script>

<section id={sectionId}>
	<hr />
	<h2 id="{sectionId}-header" class="section-header limit-width">
		{question}
	</h2>
	<p class="default-text limit-width">
		In the sections above, we have seen that the restaurant is doing well in terms of sales.
		However, we have also noted that there are some areas where the business has potential for
		improvement. At the end of this section we summarize the suggestions from the previous sections
		and some additional suggestions made in the following.
	</p>
	<p class="default-text limit-width">
		The pizzas are offered in five different sizes, S, M, L, XL, and XXL. The chart below shows how
		often each of the sizes is sold.
	</p>
	<p class="interaction-text limit-width">
		Interaction: Here I describe how the interaction takes place.
	</p>
	<SizesChart data={dataSizes} />
	<p class="insight-text limit-width">
		Pizzas of size XXL make up only 0.1% of all sales. If offering XXL pizzas comes with increased
		costs, e.g., due to extra large kitchen utensils, it might be worth considering to <span
			style:font-weight="bold">remove pizzas of size XXL</span
		> from the menu.
	</p>
	<p class="default-text limit-width">The suggestions include</p>
	<ul class="default-text limit-width">
		<li>
			to <a href="#insight-remove-brie-carre">remove the Brie Carre pizza from the menu</a> and
		</li>
		<li>
			to <a href="#insight-allocate-staff"
				>allocate the staff according to the resaurant's busiest visiting times</a
			>, including, in general,
		</li>
		<li>
			to
			<a href="#insight-open-at-11">open the restaurant at 11:00 instead of 10:00</a>.
		</li>
	</ul>
</section>
