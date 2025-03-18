<script>
	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number }} DataEntry
	 */

	import { onMount, setContext } from 'svelte';
	import MainArea from '$lib/components/demo/dashboard/MainArea.svelte';
	import { valueof } from '@observablehq/plot';
	import { daysOfWeek, hoursOfDay, monthsOfYear } from '$lib/scripts/utilityDashboard.svelte.js';
	import QuestPizzasSoldMost from '$lib/components/demo/report/sections/QuestPizzasSoldMost.svelte';
	import QuestPeaksOverTime from '$lib/components/demo/report/sections/QuestPeaksOverTime.svelte';
	import QuestIngredientsUsedMost from '$lib/components/demo/report/sections/QuestIngredientsUsedMost.svelte';
	import QuestImproveBusiness from '$lib/components/demo/report/sections/QuestImproveBusiness.svelte';
	import TableOfContents from '$lib/components/demo/report/sections/TableOfContents.svelte';
	import HoverInfo from '$lib/components/demo/report/charts/HoverInfo.svelte';
	import { getIngredientsData, schemeObservable10Light } from '$lib/scripts/utilityReport.js';

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

	$inspect(csvData);
	const ingredientsData = $derived(getIngredientsData(csvData));

	const sectionIds = [
		'pizzas-sold-most',
		'peaks-over-time',
		'ingredients-most-used',
		'improve-business'
	];

	const extents = $state({ width: 0, widthLimited: 0, chartPadding: 16 });
	const showHoverInfo = $state({ value: () => {} });
	const hideHoverInfo = $state({ value: () => {} });
	setContext('extents', extents);
	setContext('showHoverInfo', showHoverInfo);
	setContext('hideHoverInfo', hideHoverInfo);

	const getSectionHeadersInitial = () => {
		/**@type {{ [key: string]: string }}*/
		const sectionHeaders = {};
		sectionIds.forEach((sectionId) => (sectionHeaders[sectionId] = ''));

		return sectionHeaders;
	};

	const sectionHeaders = $state(getSectionHeadersInitial());

	let loaded = $state(false);

	onMount(() => {
		loaded = true;
	});

	const titleRectHeight = 7;
</script>

{#snippet titleRect(x, y, width, height, color)}
	<div
		style:position="absolute"
		style:top="{50 + y}px"
		style:left="{x}px"
		style:width="{width}px"
		style:height="{height}px"
		style:background-color={color}
		style:opacity="0.6"
		style:z-index="-1"
	></div>
{/snippet}

<main class="report-container" bind:clientWidth={extents.width}>
	<section>
		<!-- <hr class="limit-width" style:margin-top="1rem" /> -->
		<div id="title-div" class="limit-width">
			{@render titleRect(20, 0, 3.2 * 70, titleRectHeight, schemeObservable10Light[0])}
			{@render titleRect(
				40,
				titleRectHeight,
				3.2 * 80,
				titleRectHeight,
				schemeObservable10Light[1]
			)}
			{@render titleRect(
				0,
				2 * titleRectHeight,
				3.2 * 70,
				titleRectHeight,
				schemeObservable10Light[2]
			)}
			{@render titleRect(
				10,
				3 * titleRectHeight,
				3.2 * 40,
				titleRectHeight,
				schemeObservable10Light[3]
			)}
			<h1 class="limit-width" bind:clientWidth={extents.widthLimited}>
				Analytical Report: Pizza Sales
			</h1>
		</div>
		<p class="default-text limit-width">
			This report summarizes the findings from analyzing a synthetic pizza sales data set to answer
			a list of questions. It also summarizes key insights that could help improve the business. The
			report is structured in sections based on the inital questions.
		</p>
	</section>
	{#if !loaded}
		<section>
			<p class="default-text limit-width">Calculating<span class="dots">...</span></p>
		</section>
	{:else}
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
			{ingredientsData}
		/>
		<QuestImproveBusiness
			sectionId={sectionIds[3]}
			bind:sectionHeader={sectionHeaders[sectionIds[3]]}
			data={csvData}
			{ingredientsData}
		/>
		<HoverInfo />
	{/if}
</main>

<style>
	:global(body) {
		position: relative;
	}

	#title-div {
		position: relative;
	}

	.dots {
		display: inline-block;
		animation: dots 1s steps(5, end) infinite;
	}

	@keyframes dots {
		0%,
		20% {
			color: rgba(0, 0, 0, 0);
			text-shadow:
				0.25em 0 0 rgba(0, 0, 0, 0),
				0.5em 0 0 rgba(0, 0, 0, 0);
		}
		40% {
			color: black;
			text-shadow:
				0.25em 0 0 rgba(0, 0, 0, 0),
				0.5em 0 0 rgba(0, 0, 0, 0);
		}
		60% {
			text-shadow:
				0.25em 0 0 black,
				0.5em 0 0 rgba(0, 0, 0, 0);
		}
		80%,
		100% {
			text-shadow:
				0.25em 0 0 black,
				0.5em 0 0 black;
		}
	}
</style>
