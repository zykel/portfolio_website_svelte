<script>
	import { scaleLinear } from 'd3-scale';
	import { getContext } from 'svelte';
	import { interpolate } from 'd3-interpolate';
	import { formatNumber } from '$lib/scripts/utilityDashboard.svelte';

	let { data, x0, width, yScale, valueAccessor } = $props();

	const margin = getContext('margin');
	const hoveredPizzaName = getContext('hoveredPizzaName');
	const updateHoveredPizzaName = getContext('updateHoveredPizzaName');

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

	const xTicks = $derived(xScale.ticks(3));
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
			<stop offset="0%" stop-color="#bcd1e8" />
			<stop offset="{(100 * valueMax) / item[valueAccessor]}%" stop-color="#bf9bc7" />
		</linearGradient>
	{/each}
</defs>

<g class="pizza-barcharts-bars">
	{#each data as item, i}
		<rect
			onpointerover={() => updateHoveredPizzaName(item.name)}
			class="reference-bar"
			x={xScale(0)}
			y={yScale(item.name)}
			width={xScale.range()[1] - xScale.range()[0]}
			height={yScale.bandwidth()}
			fill="rgb(245,245,245)"
			stroke={hoveredPizzaName.value === item.name ? 'rgb(32, 32, 32)' : 'gray'}
			stroke-width={hoveredPizzaName.value === item.name ? '2' : '1'}
			rx={yScale.bandwidth() / 2}
			stroke-opacity={hoveredPizzaName.value === item.name ? 1 : 1 / 3}
		/>
	{/each}

	<line
		class="barcharts-half-axis"
		x1={xScale(xTicks[1])}
		x2={xScale(xTicks[1])}
		y1={yScale.range()[0]}
		y2={yScale.range()[1] + 3}
		stroke="gray"
		stroke-width="1"
		stroke-opacity={1 / 4}
	/>

	{#if xTicks.length === 3}
		<line
			class="barcharts-half-axis"
			x1={xScale(xTicks[2])}
			x2={xScale(xTicks[2])}
			y1={yScale.range()[0]}
			y2={yScale.range()[1] + 3}
			stroke="gray"
			stroke-width="1"
			stroke-opacity={1 / 4}
		/>
	{/if}

	{#each data as item, i}
		<rect
			onpointerover={() => updateHoveredPizzaName(item.name)}
			class="main-bar"
			x={xScale(0)}
			y={yScale(item.name)}
			width={xScale(item[valueAccessor]) - xScale(0)}
			height={yScale.bandwidth()}
			fill="url(#gradient-{i})"
			rx={yScale.bandwidth() / 2}
			opacity="1"
		/>
	{/each}
	{#each data as item, i}
		{#if hoveredPizzaName.value === item.name}
			<line
				class="value-marker-line"
				x1={xScale(item[valueAccessor])}
				x2={xScale(item[valueAccessor])}
				y1={yScale(item.name) - 4}
				y2={yScale(item.name) + yScale.bandwidth() + 4}
				stroke="rgb(32, 32, 32)"
				stroke-width="2"
			/>
			{@const nudgeLabel =
				xScale.range()[1] - xScale(item[valueAccessor]) < 10 && valueAccessor === 'priceTotal'}
			<text
				class="value-marker-text"
				x={xScale(item[valueAccessor])}
				y={yScale(item.name) + yScale.bandwidth() / 2 + 4}
				text-anchor={nudgeLabel ? 'end' : 'middle'}
				pointer-events="none"
			>
				{formatNumber(item[valueAccessor], 2)}
			</text>
		{/if}
	{/each}
	<line
		class="barcharts-zero-axis"
		x1={xScale(0)}
		x2={xScale(0)}
		y1={yScale.range()[0]}
		y2={yScale.range()[1] + 3}
		stroke="gray"
		stroke-width="1"
		stroke-opacity={1}
	/>
	<text class="axis-label axis-x" x={xScale(xTicks[0])} y={yScale.range()[1]} text-anchor="middle">
		0
	</text>
	<text class="axis-label axis-x" x={xScale(xTicks[1])} y={yScale.range()[1]} text-anchor="middle">
		{formatNumber(xTicks[1])}
	</text>

	{#if xTicks.length === 3}
		<text
			class="axis-label axis-x"
			x={xScale(xTicks[2])}
			y={yScale.range()[1]}
			text-anchor="middle"
		>
			{formatNumber(xTicks[2])}
		</text>
	{/if}
</g>
