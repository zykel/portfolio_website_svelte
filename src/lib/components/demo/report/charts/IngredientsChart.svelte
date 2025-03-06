<script>
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { max } from 'd3-array';
	import { getContext } from 'svelte';
	import { defaultColor } from '$lib/scripts/utilityReport.js';
	import AxisXTop from './AxisXTop.svelte';
	import BracketAnnotation from './BracketAnnotation.svelte';

	let { data } = $props();

	const extents = getContext('extents');
	const showHoverInfo = $derived(getContext('showHoverInfo').value);
	const hideHoverInfo = $derived(getContext('hideHoverInfo').value);
	const width = $derived(extents.widthLimited - extents.chartPadding * 2);

	const margin = { top: 50, right: 110, bottom: 5, left: 130 };

	let topN = $state(10);
	const dataTopN = $derived(data.slice(0, topN));

	const barHeight = 20;
	const height = $derived(topN * barHeight + margin.top + margin.bottom);

	const maxCount = $derived(max(dataTopN, (/** @type {any} */ d) => d.count));
	const ingredients = $derived(dataTopN.map((/** @type {any} */ d) => d.ingredient));

	const xScale = $derived(
		scaleLinear()
			.domain([0, maxCount])
			.range([margin.left, width - margin.right])
	);

	const yScale = $derived(
		scaleBand()
			.domain(ingredients)
			.range([margin.top, height - margin.bottom])
			.padding(0.2)
	);

	const nrXAxisTicks = 4;

	let hoveredIngredient = $state('');
</script>

<div class="chart">
	<!-- radio selection of 3 options bound to the value to topN -->
	<div class="radio-selection legend label-small">
		Show top
		<span class="ingredients-radio-selection-options">
			<label>
				<input type="radio" bind:group={topN} value={10} />10
			</label>
			<label>
				<input type="radio" bind:group={topN} value={20} />20
			</label>
			<label>
				<input type="radio" bind:group={topN} value={data.length} />all
			</label>
		</span>
		ingredients.
	</div>
	<svg class="chart-svg" {width} {height}>
		{#if width > 0}
			<AxisXTop
				{xScale}
				{yScale}
				{margin}
				nrTicks={nrXAxisTicks}
				axisTitle={'Number of times used'}
			/>
			<g class="ingredients-clip-bars">
				<defs>
					{#each dataTopN as { ingredient, count }, i}
						<clipPath id="ingredients-clip-right-corners-{i}">
							<rect
								x={margin.left - 10}
								y={yScale(ingredient) - (hoveredIngredient === ingredient ? 2 : 0)}
								width={xScale(count) +
									10 -
									margin.left +
									(hoveredIngredient === ingredient ? 2 : 0)}
								height={yScale.bandwidth() + (hoveredIngredient === ingredient ? 4 : 0)}
								rx="5"
							/>
						</clipPath>
					{/each}
				</defs>
			</g>
			<g class="ingredients-bars">
				{#each dataTopN as { ingredient, count }, i}
					<rect
						x={margin.left}
						y={yScale(ingredient)}
						width={xScale(count) - margin.left}
						height={yScale.bandwidth()}
						fill={defaultColor}
						stroke="black"
						stroke-width={hoveredIngredient === ingredient ? 2 : 0}
						clip-path="url(#ingredients-clip-right-corners-{i})"
					/>
				{/each}
			</g>

			<BracketAnnotation
				topleft={{ x: xScale(data[0].count) + 5, y: yScale(data[0].ingredient) }}
				topright={{ x: xScale(data[0].count) + 20, y: yScale(data[0].ingredient) }}
				bottomright={{
					x: xScale(data[0].count) + 20,
					y: yScale(data[3].ingredient) + yScale.bandwidth()
				}}
				bottomleft={{
					x: xScale(data[3].count) + 5,
					y: yScale(data[3].ingredient) + yScale.bandwidth()
				}}
				directionOpen={'left'}
				text={'The most used ingredients'}
				width={margin.right}
				height={200}
			/>

			<g class="axis-y">
				<defs>
					<linearGradient
						gradientUnits="userSpaceOnUse"
						x1="0"
						x2={margin.left}
						y1="0"
						y2="0"
						id="ingredients-truncateText"
					>
						<stop offset="90%" stop-opacity="1" />
						<stop offset="100%" stop-opacity="0" />
					</linearGradient>
				</defs>
				{#each dataTopN as { ingredient, count }, i}
					<text
						x={1}
						y={yScale(ingredient) + yScale.bandwidth() / 2}
						dominant-baseline="middle"
						text-anchor="beginning"
						font-weight={hoveredIngredient === ingredient ? 'bold' : 'normal'}
						fill="url(#ingredients-truncateText)"
					>
						{ingredient}
					</text>
				{/each}
			</g>

			<g class="ghost-hover-bars">
				{#each dataTopN as { ingredient, count }, i}
					{@const handlePointerOver = (/** @type {PointerEvent} */ event) => {
						event.preventDefault();
						hoveredIngredient = ingredient;
						showHoverInfo({
							event,
							infoText: [
								{ title: 'Ingredient: ', value: ingredient },
								{ title: 'Times used: ', value: xScale.tickFormat(nrXAxisTicks)(count) }
							]
						});
					}}

					<rect
						class="ghost-hover-bar"
						onpointerover={handlePointerOver}
						onpointermove={handlePointerOver}
						onpointerout={() => {
							hoveredIngredient = '';
							hideHoverInfo();
						}}
						x={0}
						y={yScale(ingredient)}
						{width}
						height={yScale.step()}
						fill="transparent"
						cursor="pointer"
					/>
				{/each}
			</g>
		{/if}
	</svg>
</div>

<style>
	.ingredients-radio-selection-options {
		margin: 0 8px;
	}
	label {
		text-decoration: underline;
		margin: 0 3px;
	}
	input,
	label {
		cursor: pointer;
	}
</style>
