<script>
	import { getWeekChartData, getDayChartData } from '$lib/scripts/utilityReport.js';
	import SalesOverWeekChart from '$lib/components/demo/report/charts/SalesOverWeekChart.svelte';
	import SalesOverDaysChart from '$lib/components/demo/report/charts/SalesOverDaysChart.svelte';

	let { sectionId, data, sectionHeader = $bindable() } = $props();

	const question =
		'How are the sales distributed over the course of an average day/an average week?';
	sectionHeader = question;
	const dataWeek = $derived(getWeekChartData(data));
	const dataDays = $derived(getDayChartData(data));

	// $inspect(dataDays);
</script>

<section id={sectionId}>
	<hr />
	<h2 id="{sectionId}-header" class="section-header limit-width">
		{question}
	</h2>
	<p class="default-text limit-width">
		We first look at how the sales are distributed over an average week.
	</p>
	<p class="interaction-text limit-width">
		➤ Interaction: You may hover over a bar to see the precise number of sales.
	</p>
	<SalesOverWeekChart {dataWeek} />
	<p class="insight-text limit-width">
		Over the week, sales increase, peaking on <span style:font-weight="bold">Friday</span>. After
		that, sales decrease again, with Sunday being the least busy day.
	</p>
	<br />
	<p class="default-text limit-width">
		We now look at how the sales are distributed over an average day. To see whether the behavior
		differs between different days of the week, we distiguish the analysis by the day of the week.
	</p>
	<p class="interaction-text limit-width">➤ Interaction: You may .</p>
	<SalesOverDaysChart {dataDays} />
	<p class="insight-text limit-width">... This pattern is quite similar between the days.</p>
</section>
