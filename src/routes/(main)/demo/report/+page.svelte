<script>
	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number }} DataEntry
	 */

	import { setContext } from 'svelte';
	import MainArea from '$lib/components/demo/dashboard/MainArea.svelte';
	import { valueof } from '@observablehq/plot';
	import { daysOfWeek, hoursOfDay, monthsOfYear } from '$lib/scripts/utilityDashboard.svelte.js';
	import QuestPizzasSoldMost from '$lib/components/demo/report/sections/QuestPizzasSoldMost.svelte';
	import QuestPeaksOverTime from '$lib/components/demo/report/sections/QuestPeaksOverTime.svelte';
	import QuestIngredientsUsedMost from '$lib/components/demo/report/sections/QuestIngredientsUsedMost.svelte';
	import QuestImproveBusiness from '$lib/components/demo/report/sections/QuestImproveBusiness.svelte';
	import TableOfContents from '$lib/components/demo/report/sections/TableOfContents.svelte';

	let { data } = $props();

	let csvData = data.csvData.map((d) => {
		// Parse order_date and order_time into javascript date, with order_date being formated as e.g. 24.08.2015 and order_time as e.g. 20:58:08
		const date = d.order_date.split('.');
		const time = d.order_time.split(':');
		d.date = new Date(+date[2], +date[1] - 1, +date[0], +time[0], +time[1], +time[2]);
		// Add day of week
		d.day = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.date.getDay()];
		// Add month of year
		d.month = d.date.getMonth();

		return d;
	});

	const sectionIds = [
		'pizzas-sold-most',
		'peaks-over-time',
		'ingredients-most-used',
		'improve-business'
	];

	const extents = $state({ width: 0 });
	setContext('extents', extents);

	const getSectionHeadersInitial = () => {
		/**@type {{ [key: string]: string }}*/
		const sectionHeaders = {};
		sectionIds.forEach((sectionId) => (sectionHeaders[sectionId] = ''));

		return sectionHeaders;
	};

	const sectionHeaders = $state(getSectionHeadersInitial());
</script>

<main class="report-container" bind:clientWidth={extents.width}>
	<h1>Pizza Report</h1>
	<p class="default-text limit-width">
		This report summarizes the findings from analyzing the pizza data set to answer questions. The
		report is structured in sections based on the inital questions.
	</p>
	<TableOfContents {sectionIds} {sectionHeaders} />

	<QuestPizzasSoldMost
		sectionId={sectionIds[0]}
		bind:sectionHeader={sectionHeaders[sectionIds[0]]}
		data={csvData}
	/>
	<QuestPeaksOverTime
		sectionId={sectionIds[1]}
		bind:sectionHeader={sectionHeaders[sectionIds[1]]}
		data={csvData}
	/>
	<QuestIngredientsUsedMost
		sectionId={sectionIds[2]}
		bind:sectionHeader={sectionHeaders[sectionIds[2]]}
		data={csvData}
	/>
	<QuestImproveBusiness
		sectionId={sectionIds[3]}
		bind:sectionHeader={sectionHeaders[sectionIds[3]]}
		data={csvData}
	/>
</main>

<style>
</style>
