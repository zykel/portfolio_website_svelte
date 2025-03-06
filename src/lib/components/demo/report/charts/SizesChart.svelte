<script>
	import { pie, arc } from 'd3-shape';
	import { sum } from 'd3-array';
	import { getContext } from 'svelte';
	import { schemeObservable10Light } from '$lib/scripts/utilityReport.js';

	let { data } = $props();

	const extents = getContext('extents');
	const width = $derived(extents.widthLimited - extents.chartPadding * 2);

	const margin = { top: 30, right: 120, bottom: 30, left: 110 };

	const radius = $derived(Math.min(width - margin.left - margin.right, 400) / 2);

	const height = $derived(margin.top + radius * 2 + margin.bottom);

	const pieScale = $derived(pie().value((/** @type {{ nrSales: number; }} */ d) => d.nrSales));

	const dataPie = $derived(pieScale(data).sort((a, b) => a.index - b.index));

	const salesTotal = $derived(sum(data, (/** @type {{ nrSales: number; }} */ d) => d.nrSales));

	const arcScale = $derived(
		arc()
			.innerRadius(radius * 0)
			.outerRadius(radius)
			// .padAngle(0.04)
			.cornerRadius(3)
	);

	const gTranslate = $derived([
		(margin.left + (width - margin.right)) / 2,
		(margin.top + (height - margin.bottom)) / 2
	]);

	const logOut = (/** @type {any} */ d) => {
		console.log(d);
		return d;
	};

	const getLabelLinePathPoints = (/** @type {any} */ datumPie, /** @type {any} */ n) => {
		const pInner = arcScale.centroid(datumPie).map((/** @type {number} */ d) => d * 2.05);
		const pCorner = arcScale.centroid(datumPie).map((/** @type {number} */ d) => d * 2.2);
		const hLineOuter = pInner[0] < pCorner[0] || datumPie.index === n - 1 ? 20 : -20;
		return {
			inner: pInner,
			corner: pCorner,
			outer: [pCorner[0] + hLineOuter, pCorner[1]]
		};
	};

	const numberFormatter = new Intl.NumberFormat('en-US');
	// Function to format numbers with commas
	/**
	 * @param { number | bigint } number
	 */
	function formatNumber(number) {
		return numberFormatter.format(number);
	}

	let hoveredSize = $state('');

	const showHoverInfo = $derived(getContext('showHoverInfo').value);
	const hideHoverInfo = $derived(getContext('hideHoverInfo').value);
	const handlePointerOver = (
		/** @type {PointerEvent} */ event,
		/** @type {string} */ size,
		/** @type {number} */ nrSales
	) => {
		hoveredSize = size;
		showHoverInfo({
			event,
			infoText: [
				{ title: 'Size: ', value: size },
				{
					title: 'Number of sales: ',
					value: formatNumber(nrSales)
				},
				{
					title: 'Share of all sales: ',
					value: Math.round((nrSales / salesTotal) * 10000) / 100 + '%'
				}
			]
		});
	};
</script>

<div id="insight-remove-xxl" class="chart">
	<h3 class="chart-title">Number of sales by pizza size</h3>
	{#if width > 0 && height > 0}
		<svg class="chart-svg" {width} {height}>
			<g class="sizes-pie-g" transform={`translate(${gTranslate})`}>
				{#each dataPie as datumPie, i}
					{@const pathPoints = getLabelLinePathPoints(datumPie, dataPie.length)}
					<path
						onpointerover={(/** @type {PointerEvent} */ event) =>
							handlePointerOver(event, datumPie.data.size, datumPie.data.nrSales)}
						onpointermove={(/** @type {PointerEvent} */ event) =>
							handlePointerOver(event, datumPie.data.size, datumPie.data.nrSales)}
						onpointerout={() => {
							hoveredSize = '';
							hideHoverInfo();
						}}
						transform={hoveredSize === datumPie.data.size
							? `translate(${arcScale.centroid(datumPie).map((/** @type {number} */ d) => d * 0.1)})`
							: ''}
						d={arcScale(datumPie)}
						fill={schemeObservable10Light[4 - i + 4]}
						stroke={hoveredSize === datumPie.data.size
							? 'black'
							: schemeObservable10Light[4 - i + 4]}
						stroke-width={hoveredSize === datumPie.data.size ? 2 : 0}
					/>
				{/each}
			</g>
			<g class="sizes-labels-g" transform={`translate(${gTranslate})`}>
				{#each dataPie as datumPie, i}
					{@const pathPoints = getLabelLinePathPoints(datumPie, dataPie.length)}
					<path
						class="sizes-pie-label-tickline"
						d={`
						M ${pathPoints.inner} 
						L ${pathPoints.corner}
						L ${pathPoints.outer}
						`}
						stroke={hoveredSize === datumPie.data.size ? 'black' : 'gray'}
						stroke-width={1}
						fill="none"
					/>
					<text
						onpointerover={(/** @type {PointerEvent} */ event) =>
							handlePointerOver(event, datumPie.data.size, datumPie.data.nrSales)}
						onpointermove={(/** @type {PointerEvent} */ event) =>
							handlePointerOver(event, datumPie.data.size, datumPie.data.nrSales)}
						onpointerout={() => {
							hoveredSize = '';
							hideHoverInfo();
						}}
						class="label-small"
						transform={`translate(${pathPoints.outer[0] + (pathPoints.outer[0] > 0 ? 5 : -5)}, ${pathPoints.outer[1]})`}
						dominant-baseline="middle"
						text-anchor={pathPoints.outer[0] > 0 ? 'start' : 'end'}
						font-weight={hoveredSize === datumPie.data.size ? 'bold' : 'normal'}
					>
						{datumPie.data.size}: {formatNumber(datumPie.data.nrSales)} sales
					</text>
				{/each}
			</g>
		</svg>
	{/if}
</div>

<style>
	.sizes-pie-label {
		/* font-size: 1rem; */
		/* font-weight: bold; */
		/* fill: gray; */
	}
</style>
