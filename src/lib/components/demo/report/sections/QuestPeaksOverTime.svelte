<script>
	import { getWeekChartData, getDayChartData } from '$lib/scripts/utilityReport.js';
	import SalesOverWeekChart from '$lib/components/demo/report/charts/SalesOverWeekChart.svelte';
	import SalesOverDaysChart from '$lib/components/demo/report/charts/SalesOverDaysChart.svelte';

	let { sectionId, data, sectionHeader = $bindable() } = $props();

	const question =
		'How are the sales distributed over the course of an average week/an average day?';
	sectionHeader = question;
	const dataWeek = $derived(getWeekChartData(data));
	const dataDays = $derived(getDayChartData(data));

	// $inspect(dataDays);
</script>

<section id={sectionId}>
	<hr class="limit-width" />
	<h2 id="{sectionId}-header" class="section-header limit-width">
		{question}
	</h2>
	<p class="default-text limit-width">
		We first look at how the sales are distributed over an average week.
	</p>
	<p class="interaction-text limit-width">
		➤ Interaction: You may hover over a bar to see the exact number of sales.
	</p>
	<SalesOverWeekChart {dataWeek} />
	<p class="insight-text limit-width">
		Over the week, sales increase, peaking on <span style:font-weight="bold">Friday</span>. After
		that, sales decrease again, with Sunday being the least busy day. The staff should be allocated
		accordingly.
	</p>
	<br />
	<p class="default-text limit-width">
		We now look at how the sales are distributed over an average day. To see whether the behavior
		differs between different days of the week, we distiguish the analysis by the day of the week.
	</p>
	<p class="interaction-text limit-width">
		➤ Interaction: You may hover over the chart to see the exact number of sales for each day and
		time.
	</p>
	<SalesOverDaysChart {dataDays} />
	<p class="insight-text limit-width">
		While Friday is the busiest day overall, the <span style:font-weight="bold">peak</span> in sales
		occurs on <span style:font-weight="bold">Thursday between 12:45 and 13:00</span>. In general,
		the patterns are quite similar between the days, with
		<span style:font-weight="bold">most sales happing around noon</span>, and another
		<span style:font-weight="bold">smaller peak in the evening</span>.
	</p>
	<p class="insight-text limit-width">
		The restaurant currently opens at 10:00. However, the chart shows that before 11:00, there are
		essentially no customers. To save money, the restaurant could consider <span
			style:font-weight="bold">opening at 11:00</span
		> instead.
	</p>
</section>
