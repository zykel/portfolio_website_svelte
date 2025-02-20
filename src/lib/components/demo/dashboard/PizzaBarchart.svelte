<script>
	import { scaleLinear } from 'd3-scale';
	import { getContext } from 'svelte';
	import { interpolate } from 'd3-interpolate';

	let { data, x0, width, yScale, valueAccessor } = $props();

	const margin = getContext('margin');

	const valueMax = $derived(Math.max(...data.map((/** @type {any} */ d) => d[valueAccessor])));

	const xScale = $derived(
		scaleLinear()
			.domain([0, valueMax])
			.range([x0, x0 + width])
	);

	const colorScale = $derived(
		scaleLinear()
			.domain([0, Math.max(...data.map((/** @type {any} */ d) => d[valueAccessor]))])
			.range(['#ADD8E6', '#FF00FF']) // Less vibrant blueish tone to more vibrant purple-ish/pink tone
			.interpolate(interpolate)
	);
</script>

<defs>
	{#each data as item, i}
		<linearGradient
			id="gradient-{i}"
			x1="0%"
			y1="0%"
			x2="{(100 * valueMax) / item[valueAccessor]}%"
			y2="0%"
		>
			<stop offset="0%" stop-color="#9ec0e6" />
			<stop offset="{(100 * valueMax) / item[valueAccessor]}%" stop-color="#d400ff" />
		</linearGradient>
	{/each}
</defs>

<g class="pizza-barcharts-bars">
	{#each data as item, i}
		<rect
			class="reference-bar"
			x={xScale(0)}
			y={yScale(item.name)}
			width={xScale.range()[1] - xScale.range()[0]}
			height={yScale.bandwidth()}
			fill="white"
			stroke="gray"
			stroke-width="1"
			rx={yScale.bandwidth() / 2}
			stroke-opacity={1 / 3}
		/>
		<rect
			class="main-bar"
			x={xScale(0)}
			y={yScale(item.name)}
			width={xScale(item[valueAccessor]) - xScale(0)}
			height={yScale.bandwidth()}
			fill="url(#gradient-{i})"
			rx={yScale.bandwidth() / 2}
		/>
	{/each}
</g>
