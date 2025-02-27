<script>
	import { line } from 'd3-shape';
	import { getContext } from 'svelte';

	let { item, xScale, yScale, yScaleTopPaddingFactor } = $props();

	const lineGenerator = line()
		.x((/** @type {{ unit: any; }} */ d) => xScale(d.unit) + xScale.bandwidth() / 2)
		.y((/** @type {{ count: any; }} */ d) => yScale(d.count));

	const hoveredPizzaName = getContext('hoveredPizzaName');
	const focusedItems = getContext('focusedItems');
	const areItemsFocused = $derived(focusedItems.value.length > 0);

	const itemSelectedOrNoFocus = $derived(
		!areItemsFocused || focusedItems.value.includes(item.name)
	);

	const itemHovered = $derived(hoveredPizzaName.value === item.name);

	const yMaxTotal = $derived(yScale.domain()[1] / yScaleTopPaddingFactor);
	const yMaxItem = $derived(
		Math.max(...item.records.map((/** @type {{ count: any; }} */ d) => d.count))
	);

	const itemNameForHTMLId = $derived(item.name.replace(/[^a-zA-Z0-9]/g, '-'));

	$inspect(item);
</script>

<path
	d={lineGenerator(item.records)}
	fill="none"
	stroke="url(#gradient-line-{itemSelectedOrNoFocus ? 'color' : 'desaturated'})"
	stroke-width={itemHovered ? 4 : 2}
	opacity={itemHovered ? 1 : 1 / 2}
/>

{#each item.records as record}
	<circle
		cx={xScale(record.unit) + xScale.bandwidth() / 2}
		cy={yScale(record.count)}
		r="3"
		fill="url(#gradient-line-{itemSelectedOrNoFocus ? 'color' : 'desaturated'})"
		stroke={itemHovered ? 'black' : 'none'}
		stroke-width="2"
		opacity={1 / 2}
	/>
{/each}
