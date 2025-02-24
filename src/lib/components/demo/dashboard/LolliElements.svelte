<script>
	import { formatNumber } from '$lib/scripts/utilityDashboard.svelte';

	let { item, xScale, yScale, colorScale, width, hoveredIngredient = $bindable() } = $props();

	const hovered = $derived(item.ingredient === hoveredIngredient);
</script>

<line
	class="ingredients-lollipop-line"
	x1={xScale(0)}
	y1={yScale(item.ingredient)}
	x2={xScale(item.count)}
	y2={yScale(item.ingredient)}
	stroke={colorScale(item.count)}
/>
<circle
	class="ingredients-lollipop-dot"
	cx={xScale(item.count)}
	cy={yScale(item.ingredient)}
	r="4"
	fill={colorScale(item.count)}
	stroke={'black'}
	stroke-width={hovered ? 2 : 0}
/>
<text
	class="ingredients-lollipop-label"
	x={xScale(item.count) + 7}
	y={yScale(item.ingredient) + 5}
	font-size="0.7em"
	font-weight={hovered ? 'bold' : 'normal'}
	fill={hovered ? 'black' : 'gray'}
>
	{item.ingredient}
	{false ? `(${formatNumber(item.count, 2)})` : ''}
</text>
<rect
	x={xScale(0) - 5}
	y={yScale(item.ingredient) + yScale.bandwidth() - 5}
	height={yScale.bandwidth() + 5}
	{width}
	fill={hovered ? 'white' : 'transparent'}
	opacity={0.8}
	pointer-events="none"
/>
<text
	class="ingredients-lollipop-label value-label"
	x={xScale(item.count) + 17}
	y={yScale(item.ingredient) + 20}
	fill={'black'}
	font-size="0.7em"
	pointer-events="none"
	style:display={hovered ? 'block' : 'none'}
	font-weight="bold"
>
	{formatNumber(item.count, 2)}
</text>
<path
	class="cornered-arrow-pointing-down-and-right"
	d={`
    M ${xScale(item.count)} ${yScale(item.ingredient) + 10}
    v 6
    h 15
`}
	stroke={'black'}
	fill={'none'}
	pointer-events="none"
	style:display={hovered ? 'block' : 'none'}
/>
<rect
	class="ingredients-lollipop-hover-rect"
	onpointerover={() => (hoveredIngredient = item.ingredient)}
	onpointerleave={() => (hoveredIngredient = '')}
	x={xScale(0) - 5}
	y={yScale(item.ingredient) - 4}
	height={yScale.bandwidth() + 2}
	{width}
	fill={'transparent'}
/>
