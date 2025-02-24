<script>
	import { getContext } from 'svelte';

	let { x0s, yScale } = $props();

	const hoveredPizzaName = getContext('hoveredPizzaName');
</script>

<g class="barchart-labels">
	{#each yScale.domain() as name, i}
		<text
			class="axis-label-small{hoveredPizzaName.value === name ? ' hovered' : ''}"
			x={x0s.labels}
			y={yScale(name) + yScale.bandwidth() / 2}
			text-anchor="start"
		>
			{name.replace(' Pizza', ' ').replace('The ', '')}
		</text>
	{/each}
</g>
