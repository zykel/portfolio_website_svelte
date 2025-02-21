<script>
	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number } & { quantity: string }} DataEntry
	 */

	import { getContext, onMount, setContext } from 'svelte';
	import { rollups, sum } from 'd3-array';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import LoadingCircle from '$lib/components/demo/dashboard/LoadingCircle.svelte';
	import { getIngredientsChartData } from '$lib/scripts/utilityDashboard.svelte';

	let { width, height } = $props();
	const margin = getContext('margin');

	const data = getContext('data');
	const selected = getContext('selected');

	// TODO: Theoretically first apply time filter on data

	const barchartData = $derived(getIngredientsChartData(data));

	const yScale = $derived(scaleBand());

	let loaded = $state(false);

	onMount(() => {
		loaded = true;
	});
</script>

<LoadingCircle {loaded} />
{#if width > 0}
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}"></svg>
{/if}

<style>
	svg {
		width: 100%;
		height: 100%;
		background-color: rgb(213, 213, 213);
	}
</style>
